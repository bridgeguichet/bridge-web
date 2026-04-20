export interface PaymentProvider {
  name: string;
  processPayment: (amount: number, metadata: any) => Promise<PaymentResult>;
  verifyPayment: (reference: string) => Promise<boolean>;
}

export interface PaymentResult {
  success: boolean;
  reference?: string;
  error?: string;
}

// Provider Mobile Money (exemple)
export class MobileMoneyProvider implements PaymentProvider {
  name = "mobile_money";

  async processPayment(amount: number, metadata: any): Promise<PaymentResult> {
    // Intégration API Mobile Money
    // À implémenter selon le provider (Airtel Money, M-Pesa, etc.)
    console.log("Processing Mobile Money payment:", amount, metadata);

    // Simulation
    return {
      success: true,
      reference: `MM-${Date.now()}`,
    };
  }

  async verifyPayment(reference: string): Promise<boolean> {
    // Vérifier statut paiement
    console.log("Verifying Mobile Money payment:", reference);
    return true;
  }
}

// Provider Cash
export class CashProvider implements PaymentProvider {
  name = "cash";

  async processPayment(amount: number, metadata: any): Promise<PaymentResult> {
    console.log("Processing Cash payment:", amount, metadata);

    return {
      success: true,
      reference: `CASH-${Date.now()}`,
    };
  }

  async verifyPayment(reference: string): Promise<boolean> {
    console.log("Verifying Cash payment:", reference);
    return true;
  }
}
