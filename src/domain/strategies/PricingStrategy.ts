export interface PricingStrategy {
  readonly name: string;
  calculate(dailyRate: number, durationDays: number): number;
}

export class StandardPricing implements PricingStrategy {
  readonly name = 'standard';

  calculate(dailyRate: number, durationDays: number): number {
    return dailyRate * durationDays;
  }
}

export class StudentPricing implements PricingStrategy {
  readonly name = 'student';
  private readonly discount = 0.2; // 20% de réduction

  calculate(dailyRate: number, durationDays: number): number {
    return dailyRate * durationDays * (1 - this.discount);
  }
}

export class WeekendPricing implements PricingStrategy {
  readonly name = 'weekend';
  private readonly surcharge = 0.15; // 15% de surcharge

  calculate(dailyRate: number, durationDays: number): number {
    return dailyRate * durationDays * (1 + this.surcharge);
  }
}

export class EnterprisePricing implements PricingStrategy {
  readonly name = 'enterprise';
  private readonly discount = 0.3; // 30% pour les entreprises
  private readonly volumeThreshold = 7; // seuil pour remise supplémentaire
  private readonly volumeBonus = 0.1; // 10% en plus si durée > 7 jours

  calculate(dailyRate: number, durationDays: number): number {
    let discount = this.discount;
    if (durationDays > this.volumeThreshold) {
      discount += this.volumeBonus;
    }
    return dailyRate * durationDays * (1 - discount);
  }
}

/** Factory function pour récupérer la bonne stratégie */
export function getPricingStrategy(type: string): PricingStrategy {
  const strategies: Record<string, PricingStrategy> = {
    standard: new StandardPricing(),
    student: new StudentPricing(),
    weekend: new WeekendPricing(),
    enterprise: new EnterprisePricing(),
  };

  const strategy = strategies[type];
  if (!strategy) {
    throw new Error(`Unknown pricing type: ${type}`);
  }
  return strategy;
}
