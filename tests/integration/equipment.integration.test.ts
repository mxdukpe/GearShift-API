import request from 'supertest';
import { createApp } from '../../src/index';

describe('Equipment API — Integration', () => {
  const app = createApp();
  let equipmentId: string;

  it('should return 201 and created equipment when POST /api/equipment is called with valid body', async () => {
    // Arrange
    const body = { name: 'MacBook Pro', category: 'laptop', dailyRate: 50 };

    // Act
    const res = await request(app).post('/api/equipment').send(body);

    // Assert
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('MacBook Pro');
    expect(res.body.state).toBe('available');
    equipmentId = res.body.id;
  });

  it('should return 200 and array when GET /api/equipment is called', async () => {
    // Arrange — equipment already created above

    // Act
    const res = await request(app).get('/api/equipment');

    // Assert
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 200 and equipment when GET /api/equipment/:id is called with valid id', async () => {
    // Arrange — equipmentId set above

    // Act
    const res = await request(app).get(`/api/equipment/${equipmentId}`);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(equipmentId);
  });

  it('should return 200 and rented state when PATCH /api/equipment/:id/rent is called', async () => {
    // Arrange — equipment is available

    // Act
    const res = await request(app).patch(`/api/equipment/${equipmentId}/rent`);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.state).toBe('rented');
  });

  it('should return 200 and available state when PATCH /api/equipment/:id/return is called', async () => {
    // Arrange — equipment is rented

    // Act
    const res = await request(app).patch(`/api/equipment/${equipmentId}/return`);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.state).toBe('available');
  });

  it('should return 204 when DELETE /api/equipment/:id is called with valid id', async () => {
    // Arrange — equipment exists

    // Act
    const res = await request(app).delete(`/api/equipment/${equipmentId}`);

    // Assert
    expect(res.status).toBe(204);
  });

  it('should return 200 and healthy status when GET /health is called', async () => {
    // Arrange — nothing needed

    // Act
    const res = await request(app).get('/health');

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('should return 404 when GET /api/equipment/:id is called with unknown id', async () => {
    // Arrange
    const unknownId = 'non-existent-id';

    // Act
    const res = await request(app).get(`/api/equipment/${unknownId}`);

    // Assert
    expect(res.status).toBe(404);
  });
});
