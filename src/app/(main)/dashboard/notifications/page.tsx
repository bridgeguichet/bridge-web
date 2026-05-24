import { Bell } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Retrouvez ici toutes vos notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Centre de notifications</CardTitle>
          <CardDescription>Les alertes et mises à jour de votre espace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <Bell className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Aucune notification</h3>
            <p className="mt-1 max-w-sm text-muted-foreground text-sm">
              Vous n'avez pas de nouvelles notifications pour le moment. Revenez plus tard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
