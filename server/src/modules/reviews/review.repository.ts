import { ReviewModel } from './review.schema';
import { IReview } from './review.entity';

export class ReviewRepository {
  async create(data: Partial<IReview>): Promise<IReview> {
    const review = new ReviewModel(data);
    return review.save();
  }

  async findById(id: string): Promise<IReview | null> {
    return ReviewModel.findById(id)
      .populate('user', 'name')
      .populate('product', 'name slug')
      .lean<IReview>();
  }

  async findByProduct(productId: string, approvedOnly = true): Promise<IReview[]> {
    const filter: Record<string, unknown> = { product: productId };
    if (approvedOnly) filter.isApproved = true;
    return ReviewModel.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean<IReview[]>();
  }

  async findByUser(userId: string): Promise<IReview[]> {
    return ReviewModel.find({ user: userId })
      .populate('product', 'name slug images')
      .sort({ createdAt: -1 })
      .lean<IReview[]>();
  }

  async findAll(approvedOnly = false): Promise<IReview[]> {
    const filter = approvedOnly ? { isApproved: true } : {};
    return ReviewModel.find(filter)
      .populate('user', 'name')
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
      .lean<IReview[]>();
  }

  async approve(id: string): Promise<IReview | null> {
    return ReviewModel.findByIdAndUpdate(id, { $set: { isApproved: true } }, { new: true })
      .populate('user', 'name')
      .populate('product', 'name slug')
      .lean<IReview>();
  }

  async delete(id: string): Promise<void> {
    await ReviewModel.findByIdAndDelete(id);
  }

  async getAverageRating(productId: string): Promise<{ average: number; count: number }> {
    const result = await ReviewModel.aggregate([
      { $match: { product: productId as any, isApproved: true } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    return result[0] || { average: 0, count: 0 };
  }

  async hasUserReviewed(userId: string, productId: string): Promise<boolean> {
    const count = await ReviewModel.countDocuments({ user: userId, product: productId });
    return count > 0;
  }
}
