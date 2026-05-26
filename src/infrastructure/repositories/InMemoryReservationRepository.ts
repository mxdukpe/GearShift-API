import { Reservation } from '../../domain/entities/Reservation';
import { IReservationRepository } from '../../domain/repositories/IReservationRepository';

export class InMemoryReservationRepository implements IReservationRepository {
  private reservations: Map<string, Reservation> = new Map();

  async findAll(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async findById(id: string): Promise<Reservation | null> {
    return this.reservations.get(id) ?? null;
  }

  async save(reservation: Reservation): Promise<Reservation> {
    this.reservations.set(reservation.id, reservation);
    return reservation;
  }

  async update(reservation: Reservation): Promise<Reservation> {
    if (!this.reservations.has(reservation.id)) {
      throw new Error(`Reservation ${reservation.id} not found`);
    }
    this.reservations.set(reservation.id, reservation);
    return reservation;
  }

  async findByEquipmentId(equipmentId: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter((r) => r.equipmentId === equipmentId);
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter((r) => r.userId === userId);
  }
}
