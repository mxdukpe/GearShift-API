import { Reservation } from '../../src/domain/entities/Reservation';

describe('Reservation Entity', () => {
  const validProps = {
    id: 'res-1',
    equipmentId: 'eq-1',
    userId: 'user-1',
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-04'),
    pricingType: 'standard',
    totalPrice: 150,
  };

  it('should create reservation with correct properties when valid props are provided', () => {
    // Arrange & Act
    const reservation = new Reservation(validProps);

    // Assert
    expect(reservation.id).toBe('res-1');
    expect(reservation.equipmentId).toBe('eq-1');
    expect(reservation.userId).toBe('user-1');
    expect(reservation.totalPrice).toBe(150);
  });

  it('should have active status when newly created', () => {
    // Arrange & Act
    const reservation = new Reservation(validProps);

    // Assert
    expect(reservation.getStatus()).toBe('active');
  });

  it('should return 3 days when start is June 1 and end is June 4', () => {
    // Arrange
    const reservation = new Reservation(validProps);

    // Act
    const duration = reservation.getDurationDays();

    // Assert
    expect(duration).toBe(3);
  });

  it('should transition to completed when complete is called on active reservation', () => {
    // Arrange
    const reservation = new Reservation(validProps);

    // Act
    reservation.complete();

    // Assert
    expect(reservation.getStatus()).toBe('completed');
  });

  it('should transition to cancelled when cancel is called on active reservation', () => {
    // Arrange
    const reservation = new Reservation(validProps);

    // Act
    reservation.cancel();

    // Assert
    expect(reservation.getStatus()).toBe('cancelled');
  });

  it('should throw error when completing a cancelled reservation', () => {
    // Arrange
    const reservation = new Reservation(validProps);
    reservation.cancel();

    // Act & Assert
    expect(() => reservation.complete()).toThrow('Cannot complete a cancelled reservation');
  });

  it('should throw error when cancelling a completed reservation', () => {
    // Arrange
    const reservation = new Reservation(validProps);
    reservation.complete();

    // Act & Assert
    expect(() => reservation.cancel()).toThrow('Cannot cancel a completed reservation');
  });

  it('should throw error when endDate is before startDate', () => {
    // Arrange
    const invalidProps = {
      ...validProps,
      startDate: new Date('2026-06-04'),
      endDate: new Date('2026-06-01'),
    };

    // Act & Assert
    expect(() => new Reservation(invalidProps)).toThrow('End date must be after start date');
  });

  it('should throw error when totalPrice is negative', () => {
    // Arrange
    const invalidProps = { ...validProps, totalPrice: -10 };

    // Act & Assert
    expect(() => new Reservation(invalidProps)).toThrow('Total price cannot be negative');
  });

  it('should return correct JSON when toJSON is called', () => {
    // Arrange
    const reservation = new Reservation(validProps);

    // Act
    const json = reservation.toJSON();

    // Assert
    expect(json.id).toBe('res-1');
    expect(json.status).toBe('active');
    expect(json.durationDays).toBe(3);
    expect(json.totalPrice).toBe(150);
  });
});
