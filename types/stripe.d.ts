declare namespace JSX {
  interface IntrinsicElements {
    'stripe-buy-button': {
      'buy-button-id': string;
      'publishable-key': string;
    };
    'stripe-pricing-table': {
      'pricing-table-id': string;
      'publishable-key': string;
      'client-reference-id'?: string;
    };
  }
}
