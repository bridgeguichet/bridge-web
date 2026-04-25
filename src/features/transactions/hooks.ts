"use client";

import { useTransactionsStore } from "./store";
import type { CreateTransactionRequest, TransactionFilters } from "./types";

export function useTransactions(filters?: TransactionFilters) {
  const { transactions } = useTransactionsStore();

  let filtered = [...transactions];

  if (filters?.status) {
    filtered = filtered.filter((t) => t.status === filters.status);
  }

  if (filters?.type) {
    filtered = filtered.filter((t) => t.type === filters.type);
  }

  if (filters?.startDate) {
    filtered = filtered.filter((t) => new Date(t.createdAt) >= new Date(filters.startDate!));
  }

  if (filters?.endDate) {
    filtered = filtered.filter((t) => new Date(t.createdAt) <= new Date(filters.endDate!));
  }

  return {
    transactions: filtered,
    totalCount: filtered.length,
    pendingCount: filtered.filter((t) => t.status === "pending").length,
    completedCount: filtered.filter((t) => t.status === "completed").length,
    totalSpent: filtered
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0),
  };
}

export function useCreateTransaction() {
  const { addTransaction } = useTransactionsStore();

  return {
    mutate: (request: CreateTransactionRequest) => {
      return addTransaction(request);
    },
  };
}

export function useTransactionStats() {
  const { transactions, getTotalSpent } = useTransactionsStore();

  const completedTransactions = transactions.filter((t) => t.status === "completed");
  const pendingTransactions = transactions.filter((t) => t.status === "pending");
  const failedTransactions = transactions.filter((t) => t.status === "failed");

  return {
    totalTransactions: transactions.length,
    completedCount: completedTransactions.length,
    pendingCount: pendingTransactions.length,
    failedCount: failedTransactions.length,
    totalSpent: getTotalSpent(),
    thisMonthSpent: completedTransactions
      .filter((t) => {
        const date = new Date(t.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0),
  };
}
