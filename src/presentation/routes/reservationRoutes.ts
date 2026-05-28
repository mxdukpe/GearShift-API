import { Router } from 'express';
import { ReservationController } from '../controllers/ReservationController';

export function createReservationRoutes(controller: ReservationController): Router {
  const router = Router();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.patch('/:id/complete', controller.complete);
  router.patch('/:id/cancel', controller.cancel);
  router.get('/user/:userId', controller.getByUser);

  return router;
}
