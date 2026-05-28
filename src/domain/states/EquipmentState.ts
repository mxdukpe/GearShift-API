import { Equipment } from '../entities/Equipment';

export interface EquipmentState {
  getName(): string;
  rent(equipment: Equipment): EquipmentState;
  returnEquipment(equipment: Equipment): EquipmentState;
  sendToMaintenance(equipment: Equipment): EquipmentState;
  retire(equipment: Equipment): EquipmentState;
}

export class AvailableState implements EquipmentState {
  getName(): string {
    return 'available';
  }

  rent(_equipment: Equipment): EquipmentState {
    return new RentedState();
  }

  returnEquipment(_equipment: Equipment): EquipmentState {
    throw new Error('Equipment is already available');
  }

  sendToMaintenance(_equipment: Equipment): EquipmentState {
    return new MaintenanceState();
  }

  retire(_equipment: Equipment): EquipmentState {
    return new RetiredState();
  }
}

export class RentedState implements EquipmentState {
  getName(): string {
    return 'rented';
  }

  rent(_equipment: Equipment): EquipmentState {
    throw new Error('Equipment is already rented');
  }

  returnEquipment(_equipment: Equipment): EquipmentState {
    return new AvailableState();
  }

  sendToMaintenance(_equipment: Equipment): EquipmentState {
    throw new Error('Cannot send rented equipment to maintenance');
  }

  retire(_equipment: Equipment): EquipmentState {
    throw new Error('Cannot retire rented equipment');
  }
}

export class MaintenanceState implements EquipmentState {
  getName(): string {
    return 'maintenance';
  }

  rent(_equipment: Equipment): EquipmentState {
    throw new Error('Equipment is under maintenance');
  }

  returnEquipment(_equipment: Equipment): EquipmentState {
    return new AvailableState();
  }

  sendToMaintenance(_equipment: Equipment): EquipmentState {
    throw new Error('Equipment is already under maintenance');
  }

  retire(_equipment: Equipment): EquipmentState {
    return new RetiredState();
  }
}

export class RetiredState implements EquipmentState {
  getName(): string {
    return 'retired';
  }

  rent(_equipment: Equipment): EquipmentState {
    throw new Error('Equipment is retired');
  }

  returnEquipment(_equipment: Equipment): EquipmentState {
    throw new Error('Equipment is retired');
  }

  sendToMaintenance(_equipment: Equipment): EquipmentState {
    throw new Error('Equipment is retired');
  }

  retire(_equipment: Equipment): EquipmentState {
    throw new Error('Equipment is already retired');
  }
}
