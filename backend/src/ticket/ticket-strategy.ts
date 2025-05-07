export interface IPricingStrategy {
  apply(currentPrice: number): number;
}

export class FullPriceStrategy implements IPricingStrategy {
  apply(currentPrice: number): number {
    return currentPrice;
  }
}

export class EarlyBirdStrategy implements IPricingStrategy {
  apply(currentPrice: number): number {
    return Math.round(currentPrice * 0.8); // 20% discount
  }
}

export class HotDemandStrategy implements IPricingStrategy {
  apply(currentPrice: number): number {
    return Math.round(currentPrice * 1.2); // 20% surcharge
  }
}
