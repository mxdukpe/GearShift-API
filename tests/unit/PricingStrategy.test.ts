import {
  StandardPricing,
  StudentPricing,
  WeekendPricing,
  EnterprisePricing,
  getPricingStrategy,
} from '../../src/domain/strategies/PricingStrategy';

describe('Strategy Pattern — Pricing', () => {
  it('should return full price when StandardPricing is used', () => {
    // Arrange
    const strategy = new StandardPricing();

    // Act
    const price = strategy.calculate(100, 5);

    // Assert
    expect(price).toBe(500);
  });

  it('should apply 20% discount when StudentPricing is used', () => {
    // Arrange
    const strategy = new StudentPricing();

    // Act
    const price = strategy.calculate(100, 5);

    // Assert
    expect(price).toBe(400);
  });

  it('should apply 15% surcharge when WeekendPricing is used', () => {
    // Arrange
    const strategy = new WeekendPricing();

    // Act
    const price = strategy.calculate(100, 5);

    // Assert
    expect(price).toBe(575);
  });

  it('should apply 30% discount when EnterprisePricing is used with short duration', () => {
    // Arrange
    const strategy = new EnterprisePricing();

    // Act
    const price = strategy.calculate(100, 5);

    // Assert
    expect(price).toBe(350);
  });

  it('should apply 40% discount when EnterprisePricing is used with duration > 7 days', () => {
    // Arrange
    const strategy = new EnterprisePricing();

    // Act
    const price = strategy.calculate(100, 10);

    // Assert
    expect(price).toBe(600);
  });

  it('should return correct strategy instance when valid type is provided', () => {
    // Arrange & Act
    const standard = getPricingStrategy('standard');
    const student = getPricingStrategy('student');

    // Assert
    expect(standard).toBeInstanceOf(StandardPricing);
    expect(student).toBeInstanceOf(StudentPricing);
  });

  it('should throw error when unknown pricing type is provided', () => {
    // Arrange & Act & Assert
    expect(() => getPricingStrategy('vip')).toThrow('Unknown pricing type: vip');
  });
});
