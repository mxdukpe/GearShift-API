import { Reservation } from '../entities/Reservation';

export interface IReservationRepository {
  findAll(): Promise<Reservation[]>;
  findById(id: string): Promise<Reservation | null>;
  save(reservation: Reservation): Promise<Reservation>;
  update(reservation: Reservation): Promise<Reservation>;
  findByEquipmentId(equipmentId: string): Promise<Reservation[]>;
  findByUserId(userId: string): Promise<Reservation[]>;
}
