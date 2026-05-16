"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CreateTransactionRequest, Transaction, TransactionStatus } from "./types";

interface TransactionsStore {
  transactions: Transaction[];
  userId: string | null;
  setUserId: (userId: string | null) => void;
  addTransaction: (transaction: CreateTransactionRequest) => Transaction;
  updateTransactionStatus: (id: string, status: TransactionStatus) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByStatus: (status: TransactionStatus) => Transaction[];
  getTransactionsByType: (type: Transaction["type"]) => Transaction[];
  getTotalSpent: () => number;
  getRecentTransactions: (limit?: number) => Transaction[];
  clearTransactions: () => void;
}

const generateId = () => `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useTransactionsStore = create<TransactionsStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      userId: null,

      setUserId: (userId) => {
        const currentUserId = get().userId;
        if (currentUserId !== userId) {
          set({ userId, transactions: [] });
        }
      },

      addTransaction: (request) => {
        const now = new Date().toISOString();
        const transaction: Transaction = {
          id: generateId(),
          ...request,
          currency: request.currency || "USD",
          status: "pending",
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          transactions: [transaction, ...state.transactions],
        }));

        return transaction;
      },

      updateTransactionStatus: (id, status) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status,
                  updatedAt: new Date().toISOString(),
                  completedAt: status === "completed" ? new Date().toISOString() : t.completedAt,
                }
              : t,
          ),
        }));
      },

      getTransactionById: (id) => {
        return get().transactions.find((t) => t.id === id);
      },

      getTransactionsByStatus: (status) => {
        return get().transactions.filter((t) => t.status === status);
      },

      getTransactionsByType: (type) => {
        return get().transactions.filter((t) => t.type === type);
      },

      getTotalSpent: () => {
        return get()
          .transactions.filter((t) => t.status === "completed")
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getRecentTransactions: (limit = 10) => {
        return get().transactions.slice(0, limit);
      },

      clearTransactions: () => {
        set({ transactions: [] });
      },
    }),
    { name: "bridge-transactions" },
  ),
);
