"use client";

import { useMemo, useState } from "react";

import { Loader2, UserCog } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useStaffUsers } from "@/features/admin";

import { StaffFormDialog } from "./_components/staff-form-dialog";
import { StaffTable } from "./_components/staff-table";

export default function StaffPage() {
  const { data: staffUsers, isLoading } = useStaffUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const filteredStaff = useMemo(() => {
    if (!staffUsers) return [];
    if (!searchQuery) return staffUsers;
    return staffUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [staffUsers, searchQuery]);

  const handleEdit = (staffId: string) => {
    setEditingStaffId(staffId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingStaffId(null);
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
          <h1 className="font-bold text-3xl tracking-tight">Staff</h1>
          <p className="text-muted-foreground">Gérez les membres de l'équipe administrative</p>
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

      {filteredStaff.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-12 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <UserCog className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold text-lg">Aucun membre staff trouvé</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            {searchQuery ? "Essayez une autre recherche." : "Aucun utilisateur staff enregistré."}
          </p>
        </div>
      ) : (
        <StaffTable staff={filteredStaff} onEdit={handleEdit} />
      )}

      <StaffFormDialog open={isFormOpen} onOpenChange={handleCloseForm} staffId={editingStaffId} />
    </div>
  );
}
