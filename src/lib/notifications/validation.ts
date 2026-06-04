import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { 
  pendingActions, 
  services, 
  serviceVariants, 
  vendorMembers, 
  users, 
  vendors,
  notifications 
} from "@/lib/db/schema";
import { emitToUser } from "@/lib/socket/server";
import { PendingAction } from "@/lib/db/schema/pending-actions";

function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function notifyValidatorsForValidation(vendorId: string, pendingAction: PendingAction) {
  console.log(`🔔 Notification de validation pour vendorId: ${vendorId}, requestedBy: ${pendingAction.requestedBy}`);
  
  // Récupérer le rôle du demandeur pour déterminer les validateurs
  const requesterMember = await db
    .select({ role: vendorMembers.role })
    .from(vendorMembers)
    .where(eq(vendorMembers.userId, pendingAction.requestedBy))
    .limit(1);

  if (requesterMember.length === 0) {
    console.log(`❌ Aucun membre trouvé pour l'utilisateur: ${pendingAction.requestedBy}`);
    return;
  }

  const requesterRole = requesterMember[0].role;
  console.log(`👤 Rôle du demandeur: ${requesterRole}`);
  
  // Déterminer les validateurs selon le rôle du demandeur
  let validators;
  if (requesterRole === "manager") {
    // Manager : validé uniquement par les admins
    validators = await getVendorAdmins(vendorId);
    console.log(`🔍 Recherche des admins pour validation`);
  } else if (requesterRole === "operator") {
    // Operator : validé par les admins et les managers
    validators = await getVendorAdminsAndManagers(vendorId);
    console.log(`🔍 Recherche des admins et managers pour validation`);
  } else {
    console.log(`❌ Rôle non géré: ${requesterRole}`);
    return;
  }
  
  console.log(`📋 Nombre de validateurs trouvés: ${validators.length}`);
  console.log(`📋 Validateurs:`, validators.map(v => ({ id: v.id, role: v.role })));
  
  // Créer une notification pour chaque validateur
  for (const validator of validators) {
    console.log(`📨 Création de notification pour: ${validator.id} (${validator.role})`);
    
    // Créer la notification directement en base de données
    const [notification] = await db
      .insert(notifications)
      .values({
        id: generateId(),
        userId: validator.id,
        type: "pending_validation",
        title: "Nouvelle demande de validation",
        message: `Suppression de ${pendingAction.targetType} : ${pendingAction.targetName}`,
        data: { pendingActionId: pendingAction.id },
      })
      .returning();
    
    console.log(`✅ Notification créée: ${notification.id}`);
    
    // Envoyer notification push via Socket.IO
    emitToUser(validator.id, "notification:new", notification);
    console.log(`📡 Notification push envoyée à: ${validator.id}`);
  }
}

export async function getCascadeTargets(targetType: string, targetId: string) {
  switch (targetType) {
    case "category":
      // Récupérer tous les services de la catégorie
      return await db.select().from(services).where(eq(services.categoryId, targetId));
    case "service":
      // Récupérer toutes les variantes du service
      return await db.select().from(serviceVariants).where(eq(serviceVariants.serviceId, targetId));
    default:
      return [];
  }
}

export async function getVendorAdmins(vendorId: string) {
  // Récupérer tous les admins du vendor
  const members = await db
    .select({
      id: users.id,
      role: vendorMembers.role,
    })
    .from(vendorMembers)
    .innerJoin(users, eq(vendorMembers.userId, users.id))
    .where(eq(vendorMembers.vendorId, vendorId));

  // Filtrer pour ne garder que les admins
  return members.filter(member => 
    member.role === "admin"
  );
}

export async function getVendorAdminsAndManagers(vendorId: string) {
  // Récupérer tous les admins et managers du vendor
  const members = await db
    .select({
      id: users.id,
      role: vendorMembers.role,
    })
    .from(vendorMembers)
    .innerJoin(users, eq(vendorMembers.userId, users.id))
    .where(eq(vendorMembers.vendorId, vendorId));

  // Filtrer pour ne garder que les admins et managers
  return members.filter(member => 
    member.role === "admin" || member.role === "manager"
  );
}

export async function executeDeletionAfterApproval(pendingAction: PendingAction) {
  const { targetType, targetId } = pendingAction;
  
  try {
    switch (targetType) {
      case "category":
        // Supprimer la catégorie (cascade gérée par la DB)
        await db.delete(services).where(eq(services.categoryId, targetId));
        const { categories } = await import("@/lib/db/schema");
        await db.delete(categories).where(eq(categories.id, targetId));
        break;
        
      case "service":
        // Supprimer les variantes puis le service
        await db.delete(serviceVariants).where(eq(serviceVariants.serviceId, targetId));
        await db.delete(services).where(eq(services.id, targetId));
        break;
        
      case "variant":
        await db.delete(serviceVariants).where(eq(serviceVariants.id, targetId));
        break;
        
      case "resource":
        const { resources } = await import("@/lib/db/schema");
        await db.delete(resources).where(eq(resources.id, targetId));
        break;
        
      case "member":
        await db.delete(vendorMembers).where(eq(vendorMembers.id, targetId));
        break;
        
      default:
        throw new Error(`Type de cible non supporté: ${targetType}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Erreur lors de la suppression ${targetType} ${targetId}:`, error);
    return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
  }
}

export async function notifyRequesterOfApproval(pendingAction: PendingAction, approved: boolean, reason?: string) {
  const requester = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, pendingAction.requestedBy))
    .limit(1);

  if (requester.length === 0) return;

  // Créer la notification directement en base de données
  const [notification] = await db
    .insert(notifications)
    .values({
      id: generateId(),
      userId: requester[0].id,
      type: "validation_result",
      title: approved ? "Demande approuvée" : "Demande rejetée",
      message: approved 
        ? `Votre demande de suppression de ${pendingAction.targetType} "${pendingAction.targetName}" a été approuvée`
        : `Votre demande de suppression de ${pendingAction.targetType} "${pendingAction.targetName}" a été rejetée${reason ? `: ${reason}` : ""}`,
      data: { pendingActionId: pendingAction.id, approved },
    })
    .returning();

  emitToUser(requester[0].id, "notification:new", notification);
}
