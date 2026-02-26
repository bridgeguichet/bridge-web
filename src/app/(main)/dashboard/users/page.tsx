"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserDetailCard, UserForm, UsersTable } from "@/features/users/components";
import type { UserDetail } from "@/features/users/types";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function UsersPage() {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);

  const handleEdit = (user: UserDetail) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleView = (user: UserDetail) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">{t("pages.users.title")}</h1>
          <p className="text-muted-foreground">{t("pages.users.description")}</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("pages.users.newButton")}
        </Button>
      </div>

      <UsersTable onEdit={handleEdit} onView={handleView} />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("pages.users.createTitle")}</DialogTitle>
            <DialogDescription>{t("pages.users.createDescription")}</DialogDescription>
          </DialogHeader>
          <UserForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("pages.users.editTitle")}</DialogTitle>
            <DialogDescription>{t("pages.users.editDescription")}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedUser(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("pages.users.detailTitle")}</DialogTitle>
          </DialogHeader>
          {selectedUser && <UserDetailCard user={selectedUser} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
