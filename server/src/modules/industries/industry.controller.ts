import { Request, Response } from 'express';
import { IndustryService } from './industry.service';
import { CreateIndustryDto, UpdateIndustryDto } from './industry.schema';
import { ResponseHelper } from '../../shared/utils/api-response';

export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  getActive = async (_req: Request, res: Response): Promise<void> => {
    const industries = await this.industryService.findActive();
    ResponseHelper.success(res, industries, 'Active industries retrieved');
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const industries = await this.industryService.findAll();
    ResponseHelper.success(res, industries, 'Industries retrieved');
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const industry = await this.industryService.findOne(req.params['id']! as string);
    ResponseHelper.success(res, industry);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const industry = await this.industryService.create(req.body as CreateIndustryDto);
    ResponseHelper.created(res, industry, 'Industry created');
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const industry = await this.industryService.update(req.params['id']! as string, req.body as UpdateIndustryDto);
    ResponseHelper.success(res, industry, 'Industry updated');
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.industryService.remove(req.params['id']! as string);
    ResponseHelper.noContent(res);
  };
}
