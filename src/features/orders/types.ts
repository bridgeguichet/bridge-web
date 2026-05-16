import type { Order, OrderItem } from "@/lib/db/schema";

export interface OrderFilters {
  status?: string;
  customerId?: string;
  vendorId?: string;
  type?: "pack" | "single";
  [key: string]: string | undefined;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface CreateOrderRequest {
  items: Array<{
    serviceId: string;
    variantId?: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    metadata?: Record<string, any>;
  }>;
  vendorId: string;
  totalAmount: string;
  paymentMethod: string;
  notes?: string;
}
