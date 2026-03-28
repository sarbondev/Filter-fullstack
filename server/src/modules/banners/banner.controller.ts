import { Request, Response } from 'express';
import { BannerService } from './banner.service';
import { CreateBannerDto, UpdateBannerDto } from './banner.schema';
import { ResponseHelper } from '../../shared/utils/api-response';

export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  getActive = async (_req: Request, res: Response): Promise<void> => {
    const banners = await this.bannerService.findActive();
    ResponseHelper.success(res, banners, 'Active banners retrieved');
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const banners = await this.bannerService.findAll();
    ResponseHelper.success(res, banners, 'Banners retrieved');
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const banner = await this.bannerService.findOne(req.params['id']! as string);
    ResponseHelper.success(res, banner);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const banner = await this.bannerService.create(req.body as CreateBannerDto);
    ResponseHelper.created(res, banner, 'Banner created');
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const banner = await this.bannerService.update(req.params['id']! as string, req.body as UpdateBannerDto);
    ResponseHelper.success(res, banner, 'Banner updated');
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.bannerService.remove(req.params['id']! as string);
    ResponseHelper.noContent(res);
  };
}
