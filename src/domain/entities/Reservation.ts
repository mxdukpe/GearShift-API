export type ReservationStatus = 'active' | 'completed' | 'cancelled';

export interface ReservationProps {
  id: string;
  equipmentId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  pricingType: string;
  totalPrice: number;
}

export class Reservation {
  public readonly id: string;
  public readonly equipmentId: string;
  public readonly userId: string;
  public readonly startDate: Date;
  public readonly endDate: Date;
  public readonly pricingType: string;
  public readonly totalPrice: number;
  private status: ReservationStatus;

  constructor(props: ReservationProps) {
    if (props.endDate <= props.startDate) {
      throw new Error('End date must be after start date');
    }
    if (props.totalPrice < 0) {
      throw new Error('Total price cannot be negative');
    }

    this.id = props.id;
    this.equipmentId = props.equipmentId;
    this.userId = props.userId;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.pricingType = props.pricingType;
    this.totalPrice = props.totalPrice;
    this.status = 'active';
  }

  getStatus(): ReservationStatus {
    return this.status;
  }

  getDurationDays(): number {
    const diff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  complete(): void {
    if (this.status !== 'active') {
      throw new Error(`Cannot complete a ${this.status} reservation`);
    }
    this.status = 'completed';
  }

  cancel(): void {
    if (this.status !== 'active') {
      throw new Error(`Cannot cancel a ${this.status} reservation`);
    }
    this.status = 'cancelled';
  }

  toJSON() {
    return {
      id: this.id,
      equipmentId: this.equipmentId,
      userId: this.userId,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      pricingType: this.pricingType,
      totalPrice: this.totalPrice,
      status: this.status,
      durationDays: this.getDurationDays(),
    };
  }
}
