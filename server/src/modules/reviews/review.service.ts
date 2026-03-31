import { ReviewRepository } from './review.repository';
import { ReviewResponse, toReviewResponse } from './review.entity';
import { CreateReviewDto } from './review.schema';
import { NotFoundError, ConflictError } from '../../shared/middleware/error-handler.middleware';
import { geminiService } from '../../shared/services/gemini.service';
import { emitToStaff, emitToAll } from '../../shared/services/socket.service';

export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async create(userId: string, dto: CreateReviewDto): Promise<ReviewResponse> {
    const hasReviewed = await this.reviewRepository.hasUserReviewed(userId, dto.product);
    if (hasReviewed) throw new ConflictError('You have already reviewed this product');

    const translations = await geminiService.translate(
      { comment: dto.comment },
      { context: 'product review comment for filter-system factory' },
    );

    const review = await this.reviewRepository.create({
      user: userId as any,
      product: dto.product as any,
      rating: dto.rating,
      comment: translations.comment,
    });

    const populated = await this.reviewRepository.findById(String(review._id));
    const response = toReviewResponse(populated!);
    emitToStaff('review:new', response);
    return response;
  }

  async findByProduct(productId: string): Promise<{ reviews: ReviewResponse[]; average: number; count: number }> {
    const [reviews, stats] = await Promise.all([
      this.reviewRepository.findByProduct(productId),
      this.reviewRepository.getAverageRating(productId),
    ]);
    return {
      reviews: reviews.map(toReviewResponse),
      average: Math.round(stats.average * 10) / 10,
      count: stats.count,
    };
  }

  async findMyReviews(userId: string): Promise<ReviewResponse[]> {
    const reviews = await this.reviewRepository.findByUser(userId);
    return reviews.map(toReviewResponse);
  }

  async findAll(): Promise<ReviewResponse[]> {
    const reviews = await this.reviewRepository.findAll();
    return reviews.map(toReviewResponse);
  }

  async approve(id: string): Promise<ReviewResponse> {
    const review = await this.reviewRepository.approve(id);
    if (!review) throw new NotFoundError('Review');
    const response = toReviewResponse(review);
    emitToAll('review:approved', response);
    return response;
  }

  async remove(id: string): Promise<void> {
    const review = await this.reviewRepository.findById(id);
    if (!review) throw new NotFoundError('Review');
    await this.reviewRepository.delete(id);
    emitToAll('review:deleted', { id });
  }
}
