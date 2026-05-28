import { Reservation } from '../../domain/entities/Reservation';
import { IReservationRepository } from '../../domain/repositories/IReservationRepository';
import { IEquipmentRepository } from '../../domain/repositories/IEquipmentRepository';
import { getPricingStrategy } from '../../domain/strategies/PricingStrategy';
import { randomUUID } from 'crypto';

export interface CreateReservationDTO {
  equipmentId: string;
  userId: string;
  startDate: string;
  endDate: string;
  pricingType?: string;
}

export class ReservationService {
  constructor(
    private readonly reservationRepo: IReservationRepository,
    private readonly equipmentRepo: IEquipmentRepository,
  ) {}

  async getAll(): Promise<Reservation[]> {
    return this.reservationRepo.findAll();
  }

  async getById(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepo.findById(id);
    if (!reservation) {
      throw new Error(`Reservation ${id} not found`);
    }
    return reservation;
  }

  async create(dto: CreateReservationDTO): Promise<Reservation> {
    const equipment = await this.equipmentRepo.findById(dto.equipmentId);
    if (!equipment) {
      throw new Error(`Equipment ${dto.equipmentId} not found`);
    }
    if (!equipment.isAvailable()) {
      throw new Error(`Equipment ${dto.equipmentId} is not available`);
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const pricingType = dto.pricingType ?? 'standard';

    const strategy = getPricingStrategy(pricingType);
    const durationDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalPrice = strategy.calculate(equipment.dailyRate, durationDays);

    const reservation = new Reservation({
      id: randomUUID(),
      equipmentId: dto.equipmentId,
      userId: dto.userId,
      startDate,
      endDate,
      pricingType,
      totalPrice,
    });

    equipment.rent();
    await this.equipmentRepo.update(equipment);
    return this.reservationRepo.save(reservation);
  }

  async complete(id: string): Promise<Reservation> {
    const reservation = await this.getById(id);
    reservation.complete();

    const equipment = await this.equipmentRepo.findById(reservation.equipmentId);
    if (equipment) {
      equipment.returnEquipment();
      await this.equipmentRepo.update(equipment);
    }

    return this.reservationRepo.update(reservation);
  }

  async cancel(id: string): Promise<Reservation> {
    const reservation = await this.getById(id);
    reservation.cancel();

    const equipment = await this.equipmentRepo.findById(reservation.equipmentId);
    if (equipment) {
      equipment.returnEquipment();
      await this.equipmentRepo.update(equipment);
    }

    return this.reservationRepo.update(reservation);
  }

  async getByUser(userId: string): Promise<Reservation[]> {
    return this.reservationRepo.findByUserId(userId);
  }
}
