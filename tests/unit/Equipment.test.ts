import { Equipment } from '../../src/domain/entities/Equipment';

describe('Equipment Entity', () => {
  it('should create equipment with correct properties when valid props are provided', () => {
    // Arrange
    const props = {
      id: 'eq-1',
      name: 'MacBook Pro',
      category: 'laptop' as const,
      dailyRate: 50,
      description: 'Laptop haut de gamme',
    };

    // Act
    const equipment = new Equipment(props);

    // Assert
    expect(equipment.id).toBe('eq-1');
    expect(equipment.name).toBe('MacBook Pro');
    expect(equipment.category).toBe('laptop');
    expect(equipment.dailyRate).toBe(50);
    expect(equipment.description).toBe('Laptop haut de gamme');
  });

  it('should be in available state when newly created', () => {
    // Arrange & Act
    const equipment = new Equipment({
      id: 'eq-1',
      name: 'MacBook',
      category: 'laptop',
      dailyRate: 50,
    });

    // Assert
    expect(equipment.getStateName()).toBe('available');
    expect(equipment.isAvailable()).toBe(true);
  });

  it('should default description to empty string when not provided', () => {
    // Arrange & Act
    const equipment = new Equipment({
      id: 'eq-2',
      name: 'Monitor',
      category: 'monitor',
      dailyRate: 25,
    });

    // Assert
    expect(equipment.description).toBe('');
  });

  it('should return correct JSON when toJSON is called', () => {
    // Arrange
    const equipment = new Equipment({
      id: 'eq-1',
      name: 'MacBook Pro',
      category: 'laptop',
      dailyRate: 50,
      description: 'Laptop haut de gamme',
    });

    // Act
    const json = equipment.toJSON();

    // Assert
    expect(json).toEqual({
      id: 'eq-1',
      name: 'MacBook Pro',
      category: 'laptop',
      dailyRate: 50,
      description: 'Laptop haut de gamme',
      state: 'available',
    });
  });
});
