import { EquipmentService } from '../../src/application/services/EquipmentService';
import { InMemoryEquipmentRepository } from '../../src/infrastructure/repositories/InMemoryEquipmentRepository';

describe('EquipmentService', () => {
  let service: EquipmentService;

  beforeEach(() => {
    service = new EquipmentService(new InMemoryEquipmentRepository());
  });

  it('should return equipment when getById is called after create', async () => {
    // Arrange
    const created = await service.create({ name: 'MacBook', category: 'laptop', dailyRate: 50 });

    // Act
    const found = await service.getById(created.id);

    // Assert
    expect(found.name).toBe('MacBook');
  });

  it('should return all equipment when getAll is called', async () => {
    // Arrange
    await service.create({ name: 'MacBook', category: 'laptop', dailyRate: 50 });
    await service.create({ name: 'Dell Monitor', category: 'monitor', dailyRate: 25 });

    // Act
    const all = await service.getAll();

    // Assert
    expect(all).toHaveLength(2);
  });

  it('should return only laptops when getByCategory is called with laptop', async () => {
    // Arrange
    await service.create({ name: 'MacBook', category: 'laptop', dailyRate: 50 });
    await service.create({ name: 'Mouse', category: 'accessory', dailyRate: 5 });

    // Act
    const laptops = await service.getByCategory('laptop');

    // Assert
    expect(laptops).toHaveLength(1);
    expect(laptops[0]!.name).toBe('MacBook');
  });

  it('should transition to rented when rent is called', async () => {
    // Arrange
    const eq = await service.create({ name: 'MacBook', category: 'laptop', dailyRate: 50 });

    // Act
    const rented = await service.rent(eq.id);

    // Assert
    expect(rented.getStateName()).toBe('rented');
  });

  it('should transition back to available when returnEquipment is called', async () => {
    // Arrange
    const eq = await service.create({ name: 'MacBook', category: 'laptop', dailyRate: 50 });
    await service.rent(eq.id);

    // Act
    const returned = await service.returnEquipment(eq.id);

    // Assert
    expect(returned.getStateName()).toBe('available');
  });

  it('should remove equipment when delete is called', async () => {
    // Arrange
    const eq = await service.create({ name: 'MacBook', category: 'laptop', dailyRate: 50 });

    // Act
    await service.delete(eq.id);

    // Assert
    await expect(service.getById(eq.id)).rejects.toThrow('not found');
  });

  it('should throw error when getById is called with non-existent id', async () => {
    // Arrange
    const fakeId = 'non-existent-id';

    // Act & Assert
    await expect(service.getById(fakeId)).rejects.toThrow('not found');
  });
});
