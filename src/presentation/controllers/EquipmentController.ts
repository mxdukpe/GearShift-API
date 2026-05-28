import { Request, Response, NextFunction } from 'express';
import { EquipmentService } from '../../application/services/EquipmentService';

export class EquipmentController {
  constructor(private readonly service: EquipmentService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.service.getAll();
      res.json(items.map((e: { toJSON: () => object }) => e.toJSON()));
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

  getByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.service.getByCategory(req.params.category as string);
      res.json(items.map((e: { toJSON: () => object }) => e.toJSON()));
    } catch (err) {
      next(err);
    }
  };

  rent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.rent(req.params.id as string);
      res.json(item.toJSON());
    } catch (err) {
      next(err);
    }
  };

  returnEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.returnEquipment(req.params.id as string);
      res.json(item.toJSON());
    } catch (err) {
      next(err);
    }
  };

  sendToMaintenance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.sendToMaintenance(req.params.id as string);
      res.json(item.toJSON());
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
