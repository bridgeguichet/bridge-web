"use client";

import { useMemo, useState } from "react";

import { Loader2, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useCustomerUsers } from "@/features/admin";

import { CustomerDetailDialog } from "./_components/customer-detail-dialog";
import { CustomerTable } from "./_components/customer-table";

export default function CustomersPage() {
  const { data: customerUsers, isLoading } = useCustomerUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    if (!customerUsers) return [];
    if (!searchQuery) return customerUsers;
    return customerUsers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [customerUsers, searchQuery]);

  const handleViewDetails = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Clients ({customerUsers?.length || 0})</h1>
          <p className="text-muted-foreground">Consultez les informations de vos clients</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Rechercher par nom ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-12 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold text-lg">Aucun client trouvé</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            {searchQuery ? "Essayez une autre recherche." : "Aucun client enregistré."}
          </p>
        </div>
      ) : (
        <CustomerTable customers={filteredCustomers} onViewDetails={handleViewDetails} />
      )}

      <CustomerDetailDialog
        open={!!selectedCustomerId}
        onOpenChange={() => setSelectedCustomerId(null)}
        customerId={selectedCustomerId}
      />
    </div>
  );
}
