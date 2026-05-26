import { Request, Response, NextFunction } from 'express';
import { ReservationService } from '../../application/services/ReservationService';

export class ReservationController {
  constructor(private readonly service: ReservationService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.service.getAll();
      res.json(items.map((r: { toJSON: () => object }) => r.toJSON()));
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.getById(req.params.id as string);
      res.json(item.toJSON());
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.create(req.body);
      res.status(201).json(item.toJSON());
    } catch (err) {
      next(err);
    }
  };

  complete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.complete(req.params.id as string);
      res.json(item.toJSON());
    } catch (err) {
      next(err);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.cancel(req.params.id as string);
      res.json(item.toJSON());
    } catch (err) {
      next(err);
    }
  };

  getByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.service.getByUser(req.params.userId as string);
      res.json(items.map((r: { toJSON: () => object }) => r.toJSON()));
    } catch (err) {
      next(err);
    }
  };
}
