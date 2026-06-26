/**
 * Bento-to-Accordion Wrapper Manager with Context Lock State Persistence.
 * Implements Feature 2: Responsive reflow from Desktop Bento Grid to Mobile Accordion.
 * Tracks active state index across layout reflows (window resize) smoothly.
 */
export class BentoAccordionManager {
  private activeIndex: number = 0;
  private isMobile: boolean = false;
  private breakpointWidth: number = 768;

  constructor(
    private bentoContainer: HTMLElement,
    private accordionContainer: HTMLElement,
    private bentoCards: HTMLElement[],
    private accordionItems: HTMLElement[]
  ) {
    this.init();
  }

  private init() {
    this.checkViewport();
    this.initBentoListeners();
    this.initAccordionListeners();

    // Context Lock resize listener
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Run initial UI state update
    this.syncUI();
  }

  private checkViewport() {
    this.isMobile = window.innerWidth < this.breakpointWidth;
  }

  /**
   * Desktop: Listen to hovers (mouseenter) on bento items.
   * Tracks active index in real-time.
   */
  private initBentoListeners() {
    this.bentoCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        if (!this.isMobile) {
          this.activeIndex = index;
          this.syncUI();
        }
      });
    });
  }

  /**
   * Mobile: Listen to clicks on accordion headers.
   * Expands the panel smoothly and updates activeIndex.
   */
  private initAccordionListeners() {
    this.accordionItems.forEach((item, index) => {
      const header = item.querySelector('.accordion-header');
      if (header) {
        header.addEventListener('click', () => {
          if (this.isMobile) {
            // If already active, maybe toggle it off (or keep at least one open)
            // Let's force-open the clicked one to keep consistent with activeIndex
            this.activeIndex = index;
            this.syncUI();
          }
        });
      }
    });
  }

  /**
   * Smoothly synchronizes the visual states of Bento (desktop) and Accordion (mobile)
   * to match the current activeIndex.
   */
  private syncUI() {
    if (!this.isMobile) {
      // 1. Desktop Bento sync
      this.bentoCards.forEach((card, index) => {
        if (index === this.activeIndex) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      // Collapse all accordions in background
      this.accordionItems.forEach(item => {
        item.classList.remove('active');
        const content = item.querySelector('.accordion-content') as HTMLElement;
        if (content) content.style.maxHeight = '0px';
      });
    } else {
      // 2. Mobile Accordion sync
      this.accordionItems.forEach((item, index) => {
        const content = item.querySelector('.accordion-content') as HTMLElement;
        if (index === this.activeIndex) {
          item.classList.add('active');
          if (content) {
            // Set max-height programmatically to allow smooth CSS transition
            content.style.maxHeight = `${content.scrollHeight}px`;
          }
        } else {
          item.classList.remove('active');
          if (content) {
            content.style.maxHeight = '0px';
          }
        }
      });

      // Clear bento active classes in background
      this.bentoCards.forEach(card => card.classList.remove('active'));
    }
  }

  /**
   * Handles resizing and transfers index context across viewport thresholds smoothly
   * (The Context Lock Constraint)
   */
  private handleResize() {
    const wasMobile = this.isMobile;
    this.checkViewport();

    if (wasMobile !== this.isMobile) {
      console.log(`Breakpoint crossed! Syncing active index: ${this.activeIndex} to ${this.isMobile ? 'Accordion' : 'Bento'}`);
      this.syncUI();
    }
  }
}