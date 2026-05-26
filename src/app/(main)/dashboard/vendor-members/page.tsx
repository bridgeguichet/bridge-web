"use client";

import { useMemo, useState } from "react";

import { Loader2, Plus, Shield, UserCog, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVendorMembers, useDeleteVendorMember, useUserVendorContext, type VendorRole } from "@/features/admin";
import { useAuthStore } from "@/features/auth/store";

import { MemberFormDialog } from "./_components/member-form-dialog";
import { MembersTable } from "./_components/members-table";

const ROLE_LABELS: Record<VendorRole, { label: string; icon: React.ReactNode; color: string }> = {
  admin: { label: "Administrateur", icon: <Shield className="h-4 w-4" />, color: "text-purple-600 bg-purple-100" },
  manager: { label: "Manager", icon: <UserCog className="h-4 w-4" />, color: "text-blue-600 bg-blue-100" },
  operator: { label: "Opérateur", icon: <UserX className="h-4 w-4" />, color: "text-gray-600 bg-gray-100" },
};

export default function VendorMembersPage() {
  const { currentUser: user } = useAuthStore();

  // Get vendor context from API (auto-detects vendorId based on user)
  const { data: vendorContext, isLoading: isLoadingContext, error: contextError } = useUserVendorContext();
  const vendorId = vendorContext?.vendorId ?? "";

  const { data: members, isLoading: isLoadingMembers, error: membersError } = useVendorMembers(vendorId);

  // Debug
  console.log("[VendorMembersPage] user:", user?.email);
  console.log("[VendorMembersPage] vendorContext:", vendorContext);
  console.log("[VendorMembersPage] isLoadingContext:", isLoadingContext);
  console.log("[VendorMembersPage] contextError:", contextError);
  console.log("[VendorMembersPage] vendorId:", vendorId);
  console.log("[VendorMembersPage] members:", members?.length);
  console.log("[VendorMembersPage] isLoadingMembers:", isLoadingMembers);
  console.log("[VendorMembersPage] membersError:", membersError);
  const deleteMember = useDeleteVendorMember();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    if (!searchQuery) return members;
    return members.filter((m) => {
      const matchesSearch =
        m.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.member.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [members, searchQuery]);

  const handleEdit = (memberId: string) => {
    setEditingMemberId(memberId);
    setIsFormOpen(true);
  };

  const handleDelete = async (memberId: string, memberVendorId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      await deleteMember.mutateAsync({ id: memberId, vendorId: memberVendorId });
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMemberId(null);
  };

  const isLoading = isLoadingContext || isLoadingMembers;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show message if no vendor context found
  if (!vendorContext) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-12 text-center">
        <div className="rounded-full bg-primary/10 p-3">
          <UserCog className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mt-4 font-semibold text-lg">Aucun contexte vendor</h3>
        <p className="mt-1 text-muted-foreground text-sm">
          Vous n'êtes pas associé à un vendor. Contactez un administrateur.
        </p>
        {contextError && (
          <div className="mt-4 rounded bg-red-50 p-2 text-xs text-red-600">Erreur: {contextError.message}</div>
        )}
        {membersError && (
          <div className="mt-2 rounded bg-red-50 p-2 text-xs text-red-600">Erreur membres: {membersError.message}</div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            {vendorContext?.isBridgeOfficial ? "Équipe BRIDGE" : "Membres du Vendor"}
          </h1>
          <p className="text-muted-foreground">
            {vendorContext?.isBridgeOfficial
              ? "Gérez les membres de l'équipe BRIDGE"
              : "Gérez les membres de votre équipe et leurs rôles"}
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Rechercher par nom, email ou rôle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Role limits info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Object.entries(ROLE_LABELS).map(([role, { label, icon, color }]) => {
          const count = members?.filter((m) => m.member.role === role).length ?? 0;
          const limit = role === "admin" ? 1 : role === "manager" ? 2 : 3;
          return (
            <div key={role} className="flex items-center gap-3 rounded-lg border bg-card p-4">
              <div className={`rounded-full p-2 ${color}`}>{icon}</div>
              <div>
                <p className="font-medium text-sm">{label}</p>
                <p className="text-muted-foreground text-xs">
                  {count} / {limit} membre{limit > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-12 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <UserCog className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold text-lg">Aucun membre trouvé</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            {searchQuery ? "Essayez une autre recherche." : "Commencez par ajouter un membre à votre équipe."}
          </p>
          {!searchQuery && (
            <Button className="mt-4" onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un membre
            </Button>
          )}
        </div>
      ) : (
        <MembersTable
          members={filteredMembers}
          roleLabels={ROLE_LABELS}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentUserId={user?.id ?? ""}
        />
      )}

      <MemberFormDialog
        open={isFormOpen}
        onOpenChange={handleCloseForm}
        memberId={editingMemberId}
        vendorId={vendorId}
        existingMembers={members || []}
      />
    </div>
  );
}
