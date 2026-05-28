import { Equipment, EquipmentCategory } from '../../domain/entities/Equipment';
import { IEquipmentRepository } from '../../domain/repositories/IEquipmentRepository';
import { randomUUID } from 'crypto';

export interface CreateEquipmentDTO {
  name: string;
  category: EquipmentCategory;
  dailyRate: number;
  description?: string;
}

export class EquipmentService {
  constructor(private readonly repository: IEquipmentRepository) {}

  async getAll(): Promise<Equipment[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Equipment> {
    const equipment = await this.repository.findById(id);
    if (!equipment) {
      throw new Error(`Equipment ${id} not found`);
    }
    return equipment;
  }

  async create(dto: CreateEquipmentDTO): Promise<Equipment> {
    const equipment = new Equipment({
      id: randomUUID(),
      name: dto.name,
      category: dto.category,
      dailyRate: dto.dailyRate,
      description: dto.description,
    });
    return this.repository.save(equipment);
  }

  async getByCategory(category: string): Promise<Equipment[]> {
    return this.repository.findByCategory(category);
  }

  async rent(id: string): Promise<Equipment> {
    const equipment = await this.getById(id);
    equipment.rent();
    return this.repository.update(equipment);
  }

  async returnEquipment(id: string): Promise<Equipment> {
    const equipment = await this.getById(id);
    equipment.returnEquipment();
    return this.repository.update(equipment);
  }

  async sendToMaintenance(id: string): Promise<Equipment> {
    const equipment = await this.getById(id);
    equipment.sendToMaintenance();
    return this.repository.update(equipment);
  }

  async delete(id: string): Promise<boolean> {
    await this.getById(id);
    return this.repository.delete(id);
  }
}
