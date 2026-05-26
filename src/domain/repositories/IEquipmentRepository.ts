import { Equipment } from '../entities/Equipment';

export interface IEquipmentRepository {
  findAll(): Promise<Equipment[]>;
  findById(id: string): Promise<Equipment | null>;
  save(equipment: Equipment): Promise<Equipment>;
  update(equipment: Equipment): Promise<Equipment>;
  delete(id: string): Promise<boolean>;
  findByCategory(category: string): Promise<Equipment[]>;
}
