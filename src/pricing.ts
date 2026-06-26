export type Currency = 'INR' | 'USD' | 'EUR';
export type BillingCycle = 'monthly' | 'annual';

export interface Plan {
  id: string;
  name: string;
  basePriceUSD: number;
}

export interface RegionConfig {
  symbol: string;
  rateMultiplier: number;
  flatFee: number;
}

// 1. Data configuration structures (no hardcoding values in UI logic)
export const PLANS: Plan[] = [
  { id: 'starter', name: 'Starter', basePriceUSD: 29 },
  { id: 'professional', name: 'Professional', basePriceUSD: 79 },
  { id: 'enterprise', name: 'Enterprise', basePriceUSD: 199 }
];

export const REGIONS: Record<Currency, RegionConfig> = {
  USD: { symbol: '$', rateMultiplier: 1.0, flatFee: 0 },
  EUR: { symbol: '€', rateMultiplier: 0.92, flatFee: 0 },
  INR: { symbol: '₹', rateMultiplier: 75.0, flatFee: 100 }
};

const ANNUAL_DISCOUNT_FACTOR = 0.80; // Flat 20% discount

/**
 * Perform dynamic pricing calculation based on base USD rate, currency multiplier, flat fee, and billing cycle.
 */
export function calculatePrice(plan: Plan, currency: Currency, billingCycle: BillingCycle): string {
  const region = REGIONS[currency];
  let price = (plan.basePriceUSD * region.rateMultiplier) + region.flatFee;

  if (billingCycle === 'annual') {
    price = price * ANNUAL_DISCOUNT_FACTOR;
  }

  const rounded = Math.round(price);
  return `${region.symbol}${rounded}`;
}

/**
 * PricingManager implements state isolation guardrails.
 * Toggling billing cycles or switching currencies isolates state updates to the targeted text nodes.
 */
export class PricingManager {
  private currentCurrency: Currency = 'USD';
  private currentBillingCycle: BillingCycle = 'monthly';

  constructor(
    private currencySelect: HTMLSelectElement,
    private billingToggle: HTMLInputElement,
    private priceElements: Map<string, HTMLElement>
  ) {
    this.init();
  }

  private init() {
    this.currencySelect.addEventListener('change', (e) => {
      const select = e.target as HTMLSelectElement;
      this.currentCurrency = select.value as Currency;
      this.updatePrices();
    });

    this.billingToggle.addEventListener('change', (e) => {
      const toggle = e.target as HTMLInputElement;
      this.currentBillingCycle = toggle.checked ? 'annual' : 'monthly';
      this.updatePrices();
    });

    // Run initial rendering
    this.updatePrices();
  }

  private updatePrices() {
    PLANS.forEach((plan) => {
      const el = this.priceElements.get(plan.id);
      if (el) {
        const calculatedText = calculatePrice(plan, this.currentCurrency, this.currentBillingCycle);
        
        // Zero-reflow DOM node text replacement
        if (el.textContent !== calculatedText) {
          el.textContent = calculatedText;
        }
      }
    });
  }
}
