import express from 'express';
import { InMemoryEquipmentRepository } from './infrastructure/repositories/InMemoryEquipmentRepository';
import { InMemoryReservationRepository } from './infrastructure/repositories/InMemoryReservationRepository';
import { Database } from './infrastructure/database/Database';
import { EquipmentService } from './application/services/EquipmentService';
import { ReservationService } from './application/services/ReservationService';
import { EquipmentController } from './presentation/controllers/EquipmentController';
import { ReservationController } from './presentation/controllers/ReservationController';
import { createEquipmentRoutes } from './presentation/routes/equipmentRoutes';
import { createReservationRoutes } from './presentation/routes/reservationRoutes';
import { errorHandler } from './presentation/middleware/errorHandler';
import { Logger } from './infrastructure/logging/Logger';

export function createApp() {
  const app = express();
  app.use(express.json());

  const logger = Logger.getInstance();

  // Middleware pour logger chaque requête HTTP reçue au format JSON
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      logger.info('HTTP Request processed', {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        durationMs: Date.now() - start,
      });
    });
    next();
  });

  // Singleton — unique instance de la base de données
  const db = Database.getInstance();
  db.connect();

  // Repository Pattern — injection de dépendances
  const equipmentRepo = new InMemoryEquipmentRepository();
  const reservationRepo = new InMemoryReservationRepository();

  // Services métier
  const equipmentService = new EquipmentService(equipmentRepo);
  const reservationService = new ReservationService(reservationRepo, equipmentRepo);

  // Controllers
  const equipmentController = new EquipmentController(equipmentService);
  const reservationController = new ReservationController(reservationService);

  // Routes
  app.use('/api/equipment', createEquipmentRoutes(equipmentController));
  app.use('/api/reservations', createReservationRoutes(reservationController));

  // Health check (pour le monitoring plus tard)
  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      database: db.isConnected() ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Error handler (middleware pattern)
  app.use(errorHandler);

  return app;
}

// Lancement du serveur (seulement si exécuté directement)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const app = createApp();
  app.listen(PORT, () => {
    Logger.getInstance().info(`🚀 GearShift-API running on http://localhost:${PORT}`);
  });
}
