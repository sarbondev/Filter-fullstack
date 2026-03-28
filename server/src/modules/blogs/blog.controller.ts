import { Request, Response } from 'express';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './blog.schema';
import { ResponseHelper } from '../../shared/utils/api-response';
import { parsePagination } from '../../shared/utils/pagination';

export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = parsePagination(req);
    const result = await this.blogService.findAll(page, limit);
    ResponseHelper.paginated(res, result, 'Blogs retrieved');
  };

  getPublished = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = parsePagination(req);
    const result = await this.blogService.findAll(page, limit, true);
    ResponseHelper.paginated(res, result, 'Blogs retrieved');
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const blog = await this.blogService.findOne(req.params['id']! as string);
    ResponseHelper.success(res, blog);
  };

  getBySlug = async (req: Request, res: Response): Promise<void> => {
    const blog = await this.blogService.findBySlug(req.params['slug']! as string);
    ResponseHelper.success(res, blog);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const blog = await this.blogService.create(req.body as CreateBlogDto);
    ResponseHelper.created(res, blog, 'Blog created');
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const blog = await this.blogService.update(req.params['id']! as string, req.body as UpdateBlogDto);
    ResponseHelper.success(res, blog, 'Blog updated');
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.blogService.remove(req.params['id']! as string);
    ResponseHelper.noContent(res);
  };
}
