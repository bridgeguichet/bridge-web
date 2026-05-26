"use client";

import { Edit2, Trash2, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

interface MembersTableProps {
  members: MemberWithUser[];
  roleLabels: Record<string, { label: string; icon: React.ReactNode; color: string }>;
  onEdit: (memberId: string) => void;
  onDelete: (memberId: string, vendorId: string) => void;
  currentUserId: string;
}

export function MembersTable({ members, roleLabels, onEdit, onDelete, currentUserId }: MembersTableProps) {
  const getRoleBadge = (role: string) => {
    const config = roleLabels[role] || { label: role, color: "bg-gray-100 text-gray-600" };
    return (
      <Badge className={`${config.color} border-0`}>
        <span className="flex items-center gap-1">
          {config.icon}
          {config.label}
        </span>
      </Badge>
    );
  };

  const canDelete = (member: MemberWithUser) => {
    // Can't delete yourself
    if (member.user.id === currentUserId) return false;
    // Can't delete admin (except by another admin - handled by backend)
    return true;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Membre</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Date d&apos;ajout</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((item) => (
            <TableRow key={item.member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={item.user.image ?? undefined} alt={item.user.name} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{item.user.name}</p>
                    <p className="text-muted-foreground text-sm">{item.user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleBadge(item.member.role)}</TableCell>
              <TableCell>
                {new Date(item.member.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item.member.id)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {canDelete(item) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(item.member.id, item.member.vendorId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
