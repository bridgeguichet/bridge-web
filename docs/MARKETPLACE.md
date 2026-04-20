# Bridge Marketplace - Documentation

## Vue d'ensemble

Le marketplace Bridge est une plateforme complète de services à Kinshasa, permettant aux utilisateurs de découvrir, commander et gérer des services (mobilité, logement, personnel de maison, etc.).

## Architecture

### Stack Technique

- **Frontend**: Next.js 16 + React 19
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL + Drizzle ORM
- **Authentification**: Better Auth (email/password + Google OAuth)
- **State Management**: 
  - Server state: TanStack React Query v5
  - Client state: Zustand
- **UI**: shadcn/ui + Tailwind CSS
- **i18n**: i18next (FR/EN)

### Structure du Projet

```
src/
├── app/
│   ├── (external)/
│   │   └── marketplace/          # Page publique marketplace
│   ├── (main)/
│   │   ├── cart/                 # Page panier
│   │   ├── checkout/             # Page checkout
│   │   └── dashboard/
│   │       └── admin/
│   │           ├── orders/       # Gestion commandes
│   │           └── resources/    # Gestion ressources
│   └── api/
│       ├── categories/           # API catégories
│       ├── services/             # API services
│       ├── orders/               # API commandes
│       └── resources/            # API ressources
├── features/
│   ├── marketplace/
│   │   ├── types.ts
│   │   ├── services.ts
│   │   ├── hooks.ts
│   │   └── components/
│   ├── orders/
│   │   ├── types.ts
│   │   ├── services.ts
│   │   └── hooks.ts
│   ├── cart/
│   │   └── store.ts              # Zustand store
│   └── resources/
│       ├── types.ts
│       ├── services.ts
│       └── hooks.ts
└── lib/
    ├── db/
    │   └── schema/               # Schémas Drizzle
    ├── payments/                 # Système paiements
    └── i18n/                     # Traductions
```

## Installation et Configuration

### 1. Variables d'environnement

Créer `.env.local`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bridge_marketplace

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3000

# Better Auth
BETTER_AUTH_SECRET=your-super-secret-better-auth-key
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration de la base de données

```bash
# Générer les migrations
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Seed la base de données
npm run db:seed
```

### 4. Démarrer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Fonctionnalités Implémentées

### ✅ Phase 1-2: Infrastructure et Schéma DB
- Drizzle ORM configuré
- PostgreSQL connecté
- 8 tables créées: users, vendors, categories, subcategories, services, serviceVariants, orders, orderItems, resources, orderAssignments, payments, addresses
- Better Auth intégré

### ✅ Phase 3: Authentification
- Login/Register email/password
- Google OAuth
- Session management
- Route protection

### ✅ Phase 4: Hooks React Query
- `useCategories()` - Liste catégories
- `useServices(filters)` - Liste services avec filtres
- `useService(id)` - Détails service
- `useServiceVariants(serviceId)` - Variantes service
- `useInfiniteServices(filters)` - Infinite scroll
- `useOrders(filters)` - Liste commandes
- `useOrder(id)` - Détails commande avec polling
- `useCreateOrder()` - Créer commande
- `useUpdateOrderStatus()` - Mettre à jour statut
- `useCancelOrder()` - Annuler commande
- `useResources(filters)` - Liste ressources (admin)

### ✅ Phase 5: API Routes
- `GET /api/categories` - Liste catégories avec subcategories
- `GET /api/services` - Liste services (filtres: categoryId, search, status)
- `GET /api/services/:id` - Détails service avec variants
- `GET /api/orders` - Liste commandes utilisateur
- `POST /api/orders` - Créer commande
- `GET /api/orders/:id` - Détails commande
- `PATCH /api/orders/:id` - Mettre à jour statut (admin)
- `POST /api/orders/:id/payment` - Traiter paiement
- `GET /api/resources` - Liste ressources (admin)
- `POST /api/resources` - Créer ressource (admin)

### ✅ Phase 6: Frontend Marketplace
- Page marketplace publique (`/marketplace`)
- Filtres par catégorie
- Composant ServiceCard
- Composant CategoryFilter
- Page panier (`/cart`)
- Page checkout (`/checkout`)
- Store Zustand pour le panier

### ✅ Phase 7: Dashboard Admin
- Page gestion commandes (`/dashboard/admin/orders`)
- Page gestion ressources (`/dashboard/admin/resources`)
- Filtres par type de ressource
- Affichage statuts avec badges

### ✅ Phase 8: Système Paiements
- Architecture extensible avec providers
- Provider Cash
- Provider Mobile Money (simulation)
- API paiement avec mise à jour commande
- Enregistrement dans table payments

### ✅ Phase 9: Traductions i18n
- Traductions FR complètes
- Traductions EN complètes
- Clés: marketplace, cart, orders, admin

## Tests et Validation

### Checklist Validation

#### Infrastructure
- [ ] DB migrations appliquées
- [ ] Seed data chargé
- [ ] Better Auth fonctionne
- [ ] Connexion PostgreSQL OK

#### API Routes
- [ ] `GET /api/categories` retourne catégories
- [ ] `GET /api/services` retourne services
- [ ] `GET /api/services/:id` retourne détails
- [ ] `POST /api/orders` crée commande
- [ ] `GET /api/orders` retourne commandes user
- [ ] `PATCH /api/orders/:id` met à jour statut (admin)
- [ ] `POST /api/orders/:id/payment` traite paiement

#### Frontend
- [ ] Page marketplace affiche services
- [ ] Filtres catégories fonctionnent
- [ ] Ajout au panier fonctionne
- [ ] Page panier affiche items
- [ ] Checkout crée commande
- [ ] Dashboard admin affiche commandes

#### Auth
- [ ] Login fonctionne
- [ ] Register fonctionne
- [ ] Google OAuth fonctionne (si configuré)
- [ ] Session persiste
- [ ] Logout fonctionne

#### Paiements
- [ ] Paiement cash fonctionne
- [ ] Paiement mobile money fonctionne
- [ ] Statut commande mis à jour après paiement

#### i18n
- [ ] Switch FR/EN fonctionne
- [ ] Toutes les pages traduites
- [ ] Fallback FR fonctionne

### Parcours de Test Manuel

#### Parcours Client

1. **Découverte**
   - Aller sur `/marketplace`
   - Vérifier affichage des services
   - Tester filtres par catégorie

2. **Ajout au panier**
   - Cliquer sur "Ajouter au panier"
   - Vérifier toast de confirmation
   - Aller sur `/cart`
   - Vérifier que le service est dans le panier

3. **Commande**
   - Cliquer sur "Passer commande"
   - Vérifier résumé de la commande
   - Sélectionner méthode de paiement
   - Confirmer la commande
   - Vérifier redirection vers détails commande

4. **Suivi**
   - Aller sur `/dashboard/orders`
   - Vérifier que la commande apparaît
   - Cliquer sur la commande
   - Vérifier les détails

#### Parcours Admin

1. **Connexion admin**
   - Login avec `admin@bridge-guichet.com`
   - Vérifier accès dashboard admin

2. **Gestion commandes**
   - Aller sur `/dashboard/admin/orders`
   - Vérifier liste des commandes
   - Cliquer sur une commande
   - Mettre à jour le statut
   - Vérifier mise à jour

3. **Gestion ressources**
   - Aller sur `/dashboard/admin/resources`
   - Filtrer par type (chauffeurs, véhicules, personnel)
   - Vérifier affichage des ressources

### Tests API avec curl

```bash
# Test categories
curl http://localhost:3000/api/categories

# Test services
curl http://localhost:3000/api/services

# Test service par ID
curl http://localhost:3000/api/services/{service-id}

# Test création commande (nécessite auth)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "vendorId": "...",
    "totalAmount": "100",
    "paymentMethod": "cash"
  }'
```

## Commandes Utiles

```bash
# Dev server
npm run dev

# Build production
npm run build

# Start production
npm start

# Lint
npm run lint

# Format
npm run format

# Database
npm run db:generate    # Générer migrations
npm run db:migrate     # Appliquer migrations
npm run db:push        # Push schema (dev)
npm run db:studio      # Drizzle Studio UI
npm run db:seed        # Seed database
```

## Données de Test

### Utilisateur Admin
- Email: `admin@bridge-guichet.com`
- Mot de passe: À définir lors du premier login

### Services Seed
Le seed crée automatiquement:
- 3 catégories (Mobilité, Logement, Personnel de maison)
- 6 services BRIDGE
- 1 vendor BRIDGE

## Prochaines Étapes

### Fonctionnalités Avancées (Optionnel)

1. **Email Verification**
   - Activer `requireEmailVerification` dans Better Auth
   - Configurer service email (SendGrid, Resend, etc.)

2. **Password Reset**
   - Implémenter flow reset password
   - Pages forgot-password et reset-password

3. **Account Linking**
   - Permettre lier compte email avec Google OAuth

4. **Session Management Dashboard**
   - Page pour voir sessions actives
   - Possibilité de révoquer sessions

5. **Notifications**
   - Email notifications pour commandes
   - Push notifications (optionnel)

6. **Reviews et Ratings**
   - Système d'avis clients
   - Notes pour services

7. **Favoris**
   - Sauvegarder services favoris
   - Liste de souhaits

8. **Recherche Avancée**
   - Full-text search
   - Filtres avancés (prix, disponibilité, etc.)

9. **Analytics**
   - Dashboard analytics admin
   - Statistiques commandes
   - Revenus par catégorie

10. **Multi-vendor**
    - Activation Phase 2 du plan
    - Inscription vendors
    - Dashboard vendor

## Support et Documentation

- **Documentation Better Auth**: https://www.better-auth.com/docs
- **Documentation Drizzle**: https://orm.drizzle.team/docs
- **Documentation React Query**: https://tanstack.com/query/latest/docs
- **Documentation shadcn/ui**: https://ui.shadcn.com

## Troubleshooting

### Erreur de connexion DB
```bash
# Vérifier que PostgreSQL est démarré
# Vérifier DATABASE_URL dans .env.local
# Tester connexion: npm run db:studio
```

### Erreur Better Auth
```bash
# Vérifier BETTER_AUTH_SECRET est défini
# Vérifier BETTER_AUTH_URL correspond à l'URL de l'app
# Tester: curl http://localhost:3000/api/auth/ok
```

### Erreur migrations
```bash
# Supprimer dossier drizzle/ et régénérer
rm -rf drizzle
npm run db:generate
npm run db:migrate
```

### Erreur seed
```bash
# Vérifier que les migrations sont appliquées
# Vérifier que la DB est vide ou compatible
# Relancer: npm run db:seed
```

## Contribution

Pour contribuer au marketplace:

1. Créer une branche feature
2. Implémenter les changements
3. Tester localement
4. Soumettre une PR

## License

Propriété de Bridge Digital Platform.
