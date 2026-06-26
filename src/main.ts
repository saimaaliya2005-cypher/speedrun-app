import { PricingManager } from './pricing';
import { BentoAccordionManager } from './features-bento';

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================
  // 1. Initial Entry Animations & Performance Loader Orchestrator
  // ========================================================
  const appLoader = document.getElementById('app-loader');
  const appContainer = document.getElementById('app-container');

  if (appLoader && appContainer) {
    // Fade out loader and fade in app within 300ms (well under the 500ms constraint)
    setTimeout(() => {
      appLoader.style.opacity = '0';
      appContainer.style.opacity = '1';
      appContainer.style.transform = 'translateY(0)';
      
      setTimeout(() => {
        appLoader.style.display = 'none';
      }, 300);
    }, 150);
  }

  // ========================================================
  // 2. Feature 1: Pricing Engine Hookup
  // ========================================================
  const currencySelect = document.getElementById('currency-select') as HTMLSelectElement | null;
  const billingToggle = document.getElementById('billing-toggle') as HTMLInputElement | null;

  const priceStarter = document.getElementById('price-starter');
  const priceProfessional = document.getElementById('price-professional');
  const priceEnterprise = document.getElementById('price-enterprise');

  if (currencySelect && billingToggle && priceStarter && priceProfessional && priceEnterprise) {
    const priceElementsMap = new Map<string, HTMLElement>([
      ['starter', priceStarter],
      ['professional', priceProfessional],
      ['enterprise', priceEnterprise]
    ]);
    
    new PricingManager(currencySelect, billingToggle, priceElementsMap);
    console.log('Pricing manager loaded successfully.');
  }

  // ========================================================
  // 3. Feature 2: Bento Grid & Accordion Hookup
  // ========================================================
  const bentoContainer = document.getElementById('bento-grid-container');
  const accordionContainer = document.getElementById('accordion-list-container');
  
  const bentoCards = Array.from(document.querySelectorAll('.bento-card')) as HTMLElement[];
  const accordionItems = Array.from(document.querySelectorAll('.accordion-item')) as HTMLElement[];

  if (bentoContainer && accordionContainer && bentoCards.length > 0 && accordionItems.length > 0) {
    new BentoAccordionManager(bentoContainer, accordionContainer, bentoCards, accordionItems);
    console.log('Bento-Accordion wrapper loaded successfully.');
  }
});