"use client";

import { useEffect, useState } from "react";

import { Loader2, Shield, UserCog, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateVendorMember, useUpdateVendorMember, type VendorRole } from "@/features/admin";
import type { VendorMember } from "@/lib/db/schema";

interface MemberWithUser {
  member: VendorMember;
  user: {
    id: string;
    email: string;
    name: string;
    image: string | null;
  };
}

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string | null;
  vendorId: string;
  existingMembers: MemberWithUser[];
}

const ROLE_OPTIONS: { value: VendorRole; label: string; icon: React.ReactNode; description: string; limit: number }[] =
  [
    {
      value: "admin",
      label: "Administrateur",
      icon: <Shield className="h-4 w-4" />,
      description: "Contrôle total du vendor",
      limit: 1,
    },
    {
      value: "manager",
      label: "Manager",
      icon: <UserCog className="h-4 w-4" />,
      description: "Gestion quotidienne, demande de validation pour suppression",
      limit: 2,
    },
    {
      value: "operator",
      label: "Opérateur",
      icon: <UserX className="h-4 w-4" />,
      description: "Opérations de base uniquement",
      limit: 3,
    },
  ];

export function MemberFormDialog({ open, onOpenChange, memberId, vendorId, existingMembers }: MemberFormDialogProps) {
  const createMember = useCreateVendorMember();
  const updateMember = useUpdateVendorMember();
  const isEditing = !!memberId;

  const [formData, setFormData] = useState({
    email: "",
    role: "" as VendorRole | "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Find existing member if editing
  const existingMember = memberId ? existingMembers.find((m) => m.member.id === memberId) : null;

  useEffect(() => {
    if (existingMember) {
      setFormData({
        email: existingMember.user.email,
        role: existingMember.member.role as VendorRole,
      });
    } else {
      setFormData({ email: "", role: "" });
    }
    setErrors({});
  }, [existingMember, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!isEditing && !formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!isEditing && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Email invalide";
    }
    if (!formData.role) {
      newErrors.role = "Le rôle est requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditing && memberId) {
        await updateMember.mutateAsync({
          id: memberId,
          vendorId,
          data: { role: formData.role },
        });
      } else {
        await createMember.mutateAsync({
          vendorId,
          email: formData.email.trim().toLowerCase(),
          role: formData.role as VendorRole,
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving member:", error);
    }
  };

  const getRoleCount = (role: VendorRole) => {
    return existingMembers.filter((m) => m.member.role === role).length;
  };

  const isRoleDisabled = (role: VendorRole) => {
    const option = ROLE_OPTIONS.find((o) => o.value === role);
    if (!option) return true;
    const currentCount = getRoleCount(role);

    // If editing and same role, allow it
    if (isEditing && existingMember?.member.role === role) return false;

    return currentCount >= option.limit;
  };

  const isSubmitting = createMember.isPending || updateMember.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Modifier le membre" : "Ajouter un membre"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifiez le rôle du membre dans l'équipe."
                : "Invitez un utilisateur à rejoindre votre équipe."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Email - only for new members */}
            {!isEditing && (
              <div className="grid gap-2">
                <Label htmlFor="email">Email de l'utilisateur</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ex: utilisateur@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                <p className="text-muted-foreground text-xs">
                  L'utilisateur doit déjà avoir un compte sur la plateforme.
                </p>
              </div>
            )}

            {/* Role Selection */}
            <div className="grid gap-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as VendorRole })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle..." />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((option) => {
                    const count = getRoleCount(option.value);
                    const isDisabled = isRoleDisabled(option.value);
                    const isFull = count >= option.limit;

                    return (
                      <SelectItem key={option.value} value={option.value} disabled={isDisabled}>
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span>{option.label}</span>
                          <span className={`text-xs ${isFull ? "text-destructive" : "text-muted-foreground"}`}>
                            ({count}/{option.limit})
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.role && <p className="text-destructive text-sm">{errors.role}</p>}

              {/* Role description */}
              {formData.role && (
                <p className="text-muted-foreground text-sm">
                  {ROLE_OPTIONS.find((o) => o.value === formData.role)?.description}
                </p>
              )}
            </div>

            {/* Limits warning */}
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium mb-1">Limites par rôle :</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Administrateur : 1 membre</li>
                <li>• Manager : 2 membres maximum</li>
                <li>• Opérateur : 3 membres maximum</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
