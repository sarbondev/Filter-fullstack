import { Request, Response } from 'express';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './review.schema';
import { ResponseHelper } from '../../shared/utils/api-response';
import { AuthRequest } from '../../shared/types/common.types';

export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    const review = await this.reviewService.create(req.user!.sub, req.body as CreateReviewDto);
    ResponseHelper.created(res, review, 'Review submitted for approval');
  };

  getByProduct = async (req: Request, res: Response): Promise<void> => {
    const result = await this.reviewService.findByProduct(req.params['productId']! as string);
    ResponseHelper.success(res, result, 'Reviews retrieved');
  };

  getMyReviews = async (req: AuthRequest, res: Response): Promise<void> => {
    const reviews = await this.reviewService.findMyReviews(req.user!.sub);
    ResponseHelper.success(res, reviews, 'My reviews retrieved');
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const reviews = await this.reviewService.findAll();
    ResponseHelper.success(res, reviews, 'All reviews retrieved');
  };

  approve = async (req: Request, res: Response): Promise<void> => {
    const review = await this.reviewService.approve(req.params['id']! as string);
    ResponseHelper.success(res, review, 'Review approved');
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.reviewService.remove(req.params['id']! as string);
    ResponseHelper.noContent(res);
  };
}
