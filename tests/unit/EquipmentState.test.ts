import { Equipment } from '../../src/domain/entities/Equipment';

describe('State Pattern — Equipment lifecycle', () => {
  it('should transition to rented when rent is called on available equipment', () => {
    // Arrange
    const eq = new Equipment({ id: 'eq-1', name: 'MacBook', category: 'laptop', dailyRate: 50 });

    // Act
    eq.rent();

    // Assert
    expect(eq.getStateName()).toBe('rented');
    expect(eq.isAvailable()).toBe(false);
  });

  it('should transition to available when return is called on rented equipment', () => {
    // Arrange
    const eq = new Equipment({ id: 'eq-1', name: 'MacBook', category: 'laptop', dailyRate: 50 });
    eq.rent();

    // Act
    eq.returnEquipment();

    // Assert
    expect(eq.getStateName()).toBe('available');
  });

  it('should transition to maintenance when sendToMaintenance is called on available equipment', () => {
    // Arrange
    const eq = new Equipment({ id: 'eq-1', name: 'MacBook', category: 'laptop', dailyRate: 50 });

    // Act
    eq.sendToMaintenance();

    // Assert
    expect(eq.getStateName()).toBe('maintenance');
  });

  it('should transition to available when return is called on maintenance equipment', () => {
    // Arrange
    const eq = new Equipment({ id: 'eq-1', name: 'MacBook', category: 'laptop', dailyRate: 50 });
    eq.sendToMaintenance();

    // Act
    eq.returnEquipment();

    // Assert
    expect(eq.getStateName()).toBe('available');
  });

  it('should transition to retired when retire is called on available equipment', () => {
    // Arrange
    const eq = new Equipment({ id: 'eq-1', name: 'MacBook', category: 'laptop', dailyRate: 50 });

    // Act
    eq.retire();

    // Assert
    expect(eq.getStateName()).toBe('retired');
  });

  it('should transition to retired when retire is called on maintenance equipment', () => {
    // Arrange
    const eq = new Equipment({ id: 'eq-1', name: 'MacBook', category: 'laptop', dailyRate: 50 });
    eq.sendToMaintenance();

    // Act
    eq.retire();

    // Assert
    expect(eq.getStateName()).toBe('retired');
  });

  it('should throw error when rent is called on already rented equipment', () => {
    // Arrange
    const eq = new Equipment({ id: 'eq-1', name: 'MacBook', category: 'laptop', dailyRate: 50 });
    eq.rent();

    // Act & Assert
    expect(() => eq.rent()).toThrow('Equipment is already rented');
  });

  it('should throw error when return is called on available equipment', () => {
    // Arrange
    const eq = new Equipment({ id: 'eq-1', name: 'MacBook', category: 'laptop', dailyRate: 50 });

    // Act & Assert
    expect(() => eq.returnEquipment()).toThrow('Equipment is already available');
  });

  it('should throw error when rent is called on retired equipment', () => {
    // Arrange
    const eq = new Equipment({ id: 'eq-1', name: 'MacBook', category: 'laptop', dailyRate: 50 });
    eq.retire();

    // Act & Assert
    expect(() => eq.rent()).toThrow('Equipment is retired');
  });
});
