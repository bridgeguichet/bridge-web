export type NotificationType =
  | "ORDER_CREATED"
  | "ORDER_UPDATED"
  | "PAYMENT_CONFIRMED"
  | "PAYMENT_FAILED"
  | "REFUND_PROCESSED"
  | "PACK_CREATED"
  | "PACK_STATUS_UPDATED"
  | "SERVICE_COMPLETED"
  | "SERVICE_DEADLINE_APPROACHING"
  | "APPOINTMENT_SCHEDULED"
  | "APPOINTMENT_REMINDER"
  | "APPOINTMENT_CANCELLED"
  | "MESSAGE_RECEIVED"
  | "ADMIN_ALERT"
  | "SYSTEM"
  | "pending_validation"
  | "validation_result";

export interface NotificationData {
  orderId?: string;
  packId?: string;
  serviceId?: string;
  appointmentId?: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
  url?: string;
  pendingActionId?: string;
  approved?: boolean;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: NotificationData | null;
  readAt: Date | string | null;
  createdAt: Date | string;
}

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
}
