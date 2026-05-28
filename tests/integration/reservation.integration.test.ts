import request from 'supertest';
import { createApp } from '../../src/index';

describe('Reservation API — Integration', () => {
  const app = createApp();
  let equipmentId: string;
  let reservationId: string;

  beforeAll(async () => {
    // Arrange — creation de l'equipement requis pour la reservation
    const eqRes = await request(app)
      .post('/api/equipment')
      .send({ name: 'iPad Pro', category: 'tablet', dailyRate: 15 });
    equipmentId = eqRes.body.id;
  });

  it('should return 201 and created reservation when POST /api/reservations is called with valid body', async () => {
    // Arrange
    const body = {
      equipmentId,
      userId: 'user-789',
      startDate: '2026-07-01',
      endDate: '2026-07-06',
      pricingType: 'standard',
    };

    // Act
    const res = await request(app).post('/api/reservations').send(body);

    // Assert
    expect(res.status).toBe(201);
    expect(res.body.equipmentId).toBe(equipmentId);
    expect(res.body.userId).toBe('user-789');
    expect(res.body.status).toBe('active');
    expect(res.body.totalPrice).toBe(75); // 5 jours * 15 = 75
    reservationId = res.body.id;
  });

  it('should return 200 and array when GET /api/reservations is called', async () => {
    // Arrange — reservation deja creee ci-dessus

    // Act
    const res = await request(app).get('/api/reservations');

    // Assert
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return 200 and reservation when GET /api/reservations/:id is called with valid id', async () => {
    // Arrange — reservationId recupere

    // Act
    const res = await request(app).get(`/api/reservations/${reservationId}`);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(reservationId);
  });

  it('should return 200 and array when GET /api/reservations/user/:userId is called', async () => {
    // Arrange — reservation active existante pour user-789

    // Act
    const res = await request(app).get('/api/reservations/user/user-789');

    // Assert
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].userId).toBe('user-789');
  });

  it('should return 200 and completed status when PATCH /api/reservations/:id/complete is called', async () => {
    // Arrange — reservation active

    // Act
    const res = await request(app).patch(`/api/reservations/${reservationId}/complete`);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');
  });

  it('should return 409 when PATCH /api/reservations/:id/cancel is called on a completed reservation', async () => {
    // Arrange — reservation passee a 'completed' à l'étape precedente

    // Act
    const res = await request(app).patch(`/api/reservations/${reservationId}/cancel`);

    // Assert
    expect(res.status).toBe(409);
  });

  it('should return 404 when GET /api/reservations/:id is called with unknown id', async () => {
    // Arrange
    const unknownId = 'non-existent-res';

    // Act
    const res = await request(app).get(`/api/reservations/${unknownId}`);

    // Assert
    expect(res.status).toBe(404);
  });
});
