import { CashProvider, MobileMoneyProvider, type PaymentResult } from "./payment-provider";

const providers = {
  mobile_money: new MobileMoneyProvider(),
  cash: new CashProvider(),
};

export async function processPayment(method: string, amount: number, metadata: any): Promise<PaymentResult> {
  const provider = providers[method as keyof typeof providers];
  if (!provider) {
    throw new Error(`Provider ${method} non supporté`);
  }

  return provider.processPayment(amount, metadata);
}

export async function verifyPayment(method: string, reference: string): Promise<boolean> {
  const provider = providers[method as keyof typeof providers];
  if (!provider) {
    throw new Error(`Provider ${method} non supporté`);
  }

  return provider.verifyPayment(reference);
}
