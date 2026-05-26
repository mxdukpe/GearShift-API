import { EquipmentState, AvailableState } from '../states/EquipmentState';

export type EquipmentCategory = 'laptop' | 'monitor' | 'accessory';

export interface EquipmentProps {
  id: string;
  name: string;
  category: EquipmentCategory;
  dailyRate: number;
  description?: string;
}

export class Equipment {
  public readonly id: string;
  public name: string;
  public category: EquipmentCategory;
  public dailyRate: number;
  public description: string;
  private state: EquipmentState;

  constructor(props: EquipmentProps) {
    this.id = props.id;
    this.name = props.name;
    this.category = props.category;
    this.dailyRate = props.dailyRate;
    this.description = props.description ?? '';
    this.state = new AvailableState();
  }

  getStateName(): string {
    return this.state.getName();
  }

  rent(): void {
    this.state = this.state.rent(this);
  }

  returnEquipment(): void {
    this.state = this.state.returnEquipment(this);
  }

  sendToMaintenance(): void {
    this.state = this.state.sendToMaintenance(this);
  }

  retire(): void {
    this.state = this.state.retire(this);
  }

  isAvailable(): boolean {
    return this.state.getName() === 'available';
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      dailyRate: this.dailyRate,
      description: this.description,
      state: this.getStateName(),
    };
  }
}
