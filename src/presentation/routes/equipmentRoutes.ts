import { Router } from 'express';
import { EquipmentController } from '../controllers/EquipmentController';

export function createEquipmentRoutes(controller: EquipmentController): Router {
  const router = Router();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.get('/category/:category', controller.getByCategory);
  router.patch('/:id/rent', controller.rent);
  router.patch('/:id/return', controller.returnEquipment);
  router.patch('/:id/maintenance', controller.sendToMaintenance);
  router.delete('/:id', controller.delete);

  return router;
}
