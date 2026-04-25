export type TransactionStatus = "pending" | "completed" | "failed" | "refunded";
export type TransactionType = "order" | "pack" | "subscription" | "refund";
export type PaymentMethod = "mobile_money" | "card" | "cash" | "bank_transfer";

export interface TransactionItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  orderId?: string;
  packId?: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  items: TransactionItem[];
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  items: TransactionItem[];
  description?: string;
  orderId?: string;
  packId?: string;
  metadata?: Record<string, any>;
}

export interface TransactionFilters {
  status?: TransactionStatus;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
}
