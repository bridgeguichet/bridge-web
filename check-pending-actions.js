const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { pendingActions } = require('./src/lib/db/schema');

// Configuration de la base de données
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL non trouvé dans les variables d\'environnement');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function checkPendingActions() {
  try {
    console.log('🔍 Vérification des données dans la table pending_actions...\n');
    
    // Récupérer toutes les pending actions
    const allActions = await db.select().from(pendingActions);
    
    console.log(`📊 Nombre total d'actions: ${allActions.length}\n`);
    
    if (allActions.length === 0) {
      console.log('❌ Aucune action trouvée dans la base de données');
      return;
    }
    
    // Grouper par statut
    const byStatus = allActions.reduce((acc, action) => {
      acc[action.status] = (acc[action.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📈 Répartition par statut:');
    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    console.log('\n📋 Détail des actions:');
    allActions.forEach((action, index) => {
      console.log(`${index + 1}. ID: ${action.id}`);
      console.log(`   Vendor: ${action.vendorId}`);
      console.log(`   Demandé par: ${action.requestedBy}`);
      console.log(`   Type: ${action.actionType} - ${action.targetType}`);
      console.log(`   Cible: ${action.targetName} (${action.targetId})`);
      console.log(`   Statut: ${action.status}`);
      console.log(`   Créé le: ${action.createdAt}`);
      if (action.reviewedAt) {
        console.log(`   Traité le: ${action.reviewedAt} par ${action.reviewedBy}`);
      }
      if (action.reason) {
        console.log(`   Raison: ${action.reason}`);
      }
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await client.end();
  }
}

checkPendingActions();
