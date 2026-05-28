import { Equipment } from '../../domain/entities/Equipment';
import { IEquipmentRepository } from '../../domain/repositories/IEquipmentRepository';

export class InMemoryEquipmentRepository implements IEquipmentRepository {
  private equipments: Map<string, Equipment> = new Map();

  async findAll(): Promise<Equipment[]> {
    return Array.from(this.equipments.values());
  }

  async findById(id: string): Promise<Equipment | null> {
    return this.equipments.get(id) ?? null;
  }

  async save(equipment: Equipment): Promise<Equipment> {
    this.equipments.set(equipment.id, equipment);
    return equipment;
  }

  async update(equipment: Equipment): Promise<Equipment> {
    if (!this.equipments.has(equipment.id)) {
      throw new Error(`Equipment ${equipment.id} not found`);
    }
    this.equipments.set(equipment.id, equipment);
    return equipment;
  }

  async delete(id: string): Promise<boolean> {
    return this.equipments.delete(id);
  }

  async findByCategory(category: string): Promise<Equipment[]> {
    return Array.from(this.equipments.values()).filter((e) => e.category === category);
  }
}
