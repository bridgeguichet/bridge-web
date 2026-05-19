"use client";

import { useEffect, useState } from "react";

import { UserCog } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import type { User } from "@/features/admin";
import { useStaffUsers, useUpdateUser } from "@/features/admin";

interface StaffFormDialogProps {
  open: boolean;
  onOpenChange: () => void;
  staffId: string | null;
}

interface FormData {
  name: string;
  email: string;
  role: string;
  phone: string;
  emailVerified: boolean;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  role: "staff",
  phone: "",
  emailVerified: false,
};

export function StaffFormDialog({ open, onOpenChange, staffId }: StaffFormDialogProps) {
  const { data: staffUsers } = useStaffUsers();
  const updateUser = useUpdateUser();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const editingStaff = staffId ? staffUsers?.find((s: User) => s.id === staffId) : null;

  useEffect(() => {
    if (editingStaff) {
      setFormData({
        name: editingStaff.name,
        email: editingStaff.email,
        role: editingStaff.role,
        phone: editingStaff.phone || "",
        emailVerified: editingStaff.emailVerified,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingStaff, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffId) {
      updateUser.mutate({ id: staffId, data: formData });
    }
    onOpenChange();
  };

  if (!staffId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <UserCog className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Modifier le membre staff</DialogTitle>
              <DialogDescription>Modifiez les informations du membre de l'équipe</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nom complet <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+243 ..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "admin" | "manager" | "staff") => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="verified">Compte vérifié</Label>
                <p className="text-muted-foreground text-sm">L'utilisateur a confirmé son adresse email</p>
              </div>
              <Switch
                id="verified"
                checked={formData.emailVerified}
                onCheckedChange={(checked) => setFormData({ ...formData, emailVerified: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onOpenChange}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
