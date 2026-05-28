import { Database } from '../../src/infrastructure/database/Database';

describe('Singleton Pattern — Database', () => {
  afterEach(() => {
    Database.resetInstance();
  });

  it('should return the same instance when getInstance is called twice', () => {
    // Arrange & Act
    const db1 = Database.getInstance();
    const db2 = Database.getInstance();

    // Assert
    expect(db1).toBe(db2);
  });

  it('should be connected when connect is called', async () => {
    // Arrange
    const db = Database.getInstance();

    // Act
    await db.connect();

    // Assert
    expect(db.isConnected()).toBe(true);
  });

  it('should be disconnected when disconnect is called after connect', async () => {
    // Arrange
    const db = Database.getInstance();
    await db.connect();

    // Act
    await db.disconnect();

    // Assert
    expect(db.isConnected()).toBe(false);
  });

  it('should return a new instance when resetInstance is called', () => {
    // Arrange
    const db1 = Database.getInstance();

    // Act
    Database.resetInstance();
    const db2 = Database.getInstance();

    // Assert
    expect(db1).not.toBe(db2);
  });
});
