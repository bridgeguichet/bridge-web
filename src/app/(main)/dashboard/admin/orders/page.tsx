"use client";

import { useTransactionsStore } from "@/features/transactions/store";

export default function AdminOrdersPage() {
  const transactions = useTransactionsStore((state) => state.transactions);

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 font-bold text-3xl">Gestion des Transactions</h1>

      <div className="rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                ID Transaction
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Aucune transaction pour le moment
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 text-sm">
                    #{txn.id.slice(4, 12)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm capitalize">{txn.type}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 font-semibold text-xs leading-5 ${
                        txn.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : txn.status === "failed" || txn.status === "refunded"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">${txn.amount.toFixed(2)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                    {new Date(txn.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
