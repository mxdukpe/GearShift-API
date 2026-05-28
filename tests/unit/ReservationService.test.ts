import { ReservationService } from '../../src/application/services/ReservationService';
import { InMemoryEquipmentRepository } from '../../src/infrastructure/repositories/InMemoryEquipmentRepository';
import { InMemoryReservationRepository } from '../../src/infrastructure/repositories/InMemoryReservationRepository';
import { Equipment } from '../../src/domain/entities/Equipment';

describe('ReservationService', () => {
  let reservationService: ReservationService;
  let equipmentRepo: InMemoryEquipmentRepository;
  let reservationRepo: InMemoryReservationRepository;

  beforeEach(() => {
    equipmentRepo = new InMemoryEquipmentRepository();
    reservationRepo = new InMemoryReservationRepository();
    reservationService = new ReservationService(reservationRepo, equipmentRepo);
  });

  describe('create', () => {
    it('should create a reservation and rent the equipment when valid data is provided', async () => {
      // Arrange
      const equipment = new Equipment({
        id: 'eq-123',
        name: 'Projector',
        category: 'accessory',
        dailyRate: 10,
      });
      await equipmentRepo.save(equipment);

      const dto = {
        equipmentId: 'eq-123',
        userId: 'user-456',
        startDate: '2026-06-01',
        endDate: '2026-06-04',
        pricingType: 'standard',
      };

      // Act
      const result = await reservationService.create(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.equipmentId).toBe('eq-123');
      expect(result.userId).toBe('user-456');
      expect(result.totalPrice).toBe(30); // 3 jours * 10 = 30

      const updatedEquipment = await equipmentRepo.findById('eq-123');
      expect(updatedEquipment?.getStateName()).toBe('rented');
    });

    it('should throw an error when the equipment does not exist', async () => {
      // Arrange
      const dto = {
        equipmentId: 'non-existent-eq',
        userId: 'user-456',
        startDate: '2026-06-01',
        endDate: '2026-06-04',
        pricingType: 'standard',
      };

      // Act & Assert
      await expect(reservationService.create(dto)).rejects.toThrow(
        'Equipment non-existent-eq not found',
      );
    });

    it('should throw an error when the equipment is not available', async () => {
      // Arrange
      const equipment = new Equipment({
        id: 'eq-123',
        name: 'Projector',
        category: 'accessory',
        dailyRate: 10,
      });
      equipment.rent();
      await equipmentRepo.save(equipment);

      const dto = {
        equipmentId: 'eq-123',
        userId: 'user-456',
        startDate: '2026-06-01',
        endDate: '2026-06-04',
        pricingType: 'standard',
      };

      // Act & Assert
      await expect(reservationService.create(dto)).rejects.toThrow(
        'Equipment eq-123 is not available',
      );
    });
  });

  describe('getAll', () => {
    it('should return all reservations when they exist', async () => {
      // Arrange
      const equipment = new Equipment({
        id: 'eq-123',
        name: 'Projector',
        category: 'accessory',
        dailyRate: 10,
      });
      await equipmentRepo.save(equipment);
      await reservationService.create({
        equipmentId: 'eq-123',
        userId: 'user-1',
        startDate: '2026-06-01',
        endDate: '2026-06-04',
      });

      // Act
      const result = await reservationService.getAll();

      // Assert
      expect(result).toHaveLength(1);
    });
  });

  describe('getById', () => {
    it('should return the reservation when a valid id is provided', async () => {
      // Arrange
      const equipment = new Equipment({
        id: 'eq-123',
        name: 'Projector',
        category: 'accessory',
        dailyRate: 10,
      });
      await equipmentRepo.save(equipment);
      const created = await reservationService.create({
        equipmentId: 'eq-123',
        userId: 'user-1',
        startDate: '2026-06-01',
        endDate: '2026-06-04',
      });

      // Act
      const result = await reservationService.getById(created.id);

      // Assert
      expect(result.id).toBe(created.id);
    });

    it('should throw an error when the id does not exist', async () => {
      // Arrange
      const fakeId = 'non-existent-res';

      // Act & Assert
      await expect(reservationService.getById(fakeId)).rejects.toThrow(
        'Reservation non-existent-res not found',
      );
    });
  });

  describe('complete', () => {
    it('should mark reservation as completed and make equipment available when called on active reservation', async () => {
      // Arrange
      const equipment = new Equipment({
        id: 'eq-123',
        name: 'Projector',
        category: 'accessory',
        dailyRate: 10,
      });
      await equipmentRepo.save(equipment);
      const created = await reservationService.create({
        equipmentId: 'eq-123',
        userId: 'user-1',
        startDate: '2026-06-01',
        endDate: '2026-06-04',
      });

      // Act
      const result = await reservationService.complete(created.id);

      // Assert
      expect(result.getStatus()).toBe('completed');
      const updatedEquipment = await equipmentRepo.findById('eq-123');
      expect(updatedEquipment?.getStateName()).toBe('available');
    });
  });

  describe('cancel', () => {
    it('should mark reservation as cancelled and make equipment available when called on active reservation', async () => {
      // Arrange
      const equipment = new Equipment({
        id: 'eq-123',
        name: 'Projector',
        category: 'accessory',
        dailyRate: 10,
      });
      await equipmentRepo.save(equipment);
      const created = await reservationService.create({
        equipmentId: 'eq-123',
        userId: 'user-1',
        startDate: '2026-06-01',
        endDate: '2026-06-04',
      });

      // Act
      const result = await reservationService.cancel(created.id);

      // Assert
      expect(result.getStatus()).toBe('cancelled');
      const updatedEquipment = await equipmentRepo.findById('eq-123');
      expect(updatedEquipment?.getStateName()).toBe('available');
    });
  });

  describe('getByUser', () => {
    it('should return only reservations for the specified user when multiple exist', async () => {
      // Arrange
      const equipment1 = new Equipment({
        id: 'eq-1',
        name: 'Projector',
        category: 'accessory',
        dailyRate: 10,
      });
      const equipment2 = new Equipment({
        id: 'eq-2',
        name: 'Laptop',
        category: 'laptop',
        dailyRate: 50,
      });
      await equipmentRepo.save(equipment1);
      await equipmentRepo.save(equipment2);

      await reservationService.create({
        equipmentId: 'eq-1',
        userId: 'user-1',
        startDate: '2026-06-01',
        endDate: '2026-06-04',
      });

      // Act
      const result = await reservationService.getByUser('user-1');

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]!.userId).toBe('user-1');
    });
  });

  describe('InMemoryReservationRepository additional methods', () => {
    it('should return reservations by equipment ID when findByEquipmentId is called', async () => {
      // Arrange
      const equipment = new Equipment({
        id: 'eq-1',
        name: 'Projector',
        category: 'accessory',
        dailyRate: 10,
      });
      await equipmentRepo.save(equipment);
      const created = await reservationService.create({
        equipmentId: 'eq-1',
        userId: 'user-1',
        startDate: '2026-06-01',
        endDate: '2026-06-04',
      });

      // Act
      const result = await reservationRepo.findByEquipmentId('eq-1');

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe(created.id);
    });

    it('should throw an error when update is called with a non-existent reservation', async () => {
      // Arrange
      const equipment = new Equipment({
        id: 'eq-1',
        name: 'Projector',
        category: 'accessory',
        dailyRate: 10,
      });
      await equipmentRepo.save(equipment);
      const created = await reservationService.create({
        equipmentId: 'eq-1',
        userId: 'user-1',
        startDate: '2026-06-01',
        endDate: '2026-06-04',
      });

      const fakeReservation = Object.assign(
        Object.create(Object.getPrototypeOf(created)),
        created,
        { id: 'non-existent-id' },
      );

      // Act & Assert
      await expect(reservationRepo.update(fakeReservation)).rejects.toThrow(
        'Reservation non-existent-id not found',
      );
    });
  });
});
