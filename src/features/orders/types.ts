export type OrderStatus = "pending" | "completed" | "failed" | "refunded";
export type OrderType = "order" | "pack" | "subscription" | "refund";
export type PaymentMethod = "mobile_money" | "card" | "cash" | "bank_transfer";

export interface OrderItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  icon?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreateOrderRequest {
  type: OrderType;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  description?: string;
  orderNumber: string;
  metadata?: Record<string, unknown>;
}

export interface OrderFilters {
  type?: OrderType;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  userOnly?: boolean;
}

export interface OrderStats {
  totalRevenue: number;
  thisMonthRevenue: number;
  totalCount: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
  orderCount: number;
  packCount: number;
}
