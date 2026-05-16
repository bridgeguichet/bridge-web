# Guide de Gestion des Sessions avec Better Auth

Documentation complète sur la gestion des sessions avec Better Auth dans l'architecture Next.js full-stack avec Drizzle ORM.

## 🔄 Flux de Session Better Auth

```
Session Expirée ou Invalide
         ↓
    Détection
         ↓
   Better Auth → Vérification
         ↓
  Session Régénérée (si valide)
         ↓
   Cookie HttpOnly Mis à Jour
         ↓
  Rejouer la requête
```

## 📋 Architecture Better Auth

### Approche 1 : Middleware Next.js (Protection des routes)

**Quand l'utiliser :** Pour protéger les pages nécessitant une authentification

**Fichier :** `src/middleware.ts`

**Fonctionnement :**

1. Intercepte les requêtes vers `/dashboard/*`
2. Vérifie la validité de la session via Better Auth
3. Redirige vers `/auth/login` si non authentifié
4. Continue la navigation si session valide

**Avantages :**

- ✅ Refresh transparent avant le chargement de la page
- ✅ Pas de flash de redirection
- ✅ Protection au niveau routing

**Inconvénients :**

- ❌ Ne gère pas les requêtes API côté client
- ❌ S'exécute à chaque navigation

**Configuration :**

```typescript
// middleware.ts
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
```

### Approche 2 : Client Better Auth (Recommandé pour les API calls)

**Quand l'utiliser :** Pour les requêtes API avec authentification

**Fichier :** `src/lib/auth-client.ts`

**Fonctionnement :**

1. Le client Better Auth gère automatiquement les cookies de session
2. Les requêtes incluent automatiquement le token de session
3. Better Auth gère le refresh automatique côté serveur
4. Rejoue automatiquement les requêtes après refresh
5. Queue intelligente pour requêtes simultanées

**Avantages :**

- ✅ Gère automatiquement toutes les requêtes API
- ✅ Queue intelligente pour requêtes simultanées
- ✅ Transparent pour le développeur
- ✅ Pas de code supplémentaire dans les composants

**Inconvénients :**

- ❌ Dépendance au package `@better-auth/client`

**Code :**

```typescript
// Automatique - aucune configuration nécessaire
import { authClient } from "@/lib/auth-client";

const { data } = await authClient.getSession();
// Session gérée automatiquement par Better Auth
```

### Approche 3 : API Better Auth (Configuration)

**Quand l'utiliser :** Configuration de Better Auth avec Drizzle ORM

**Fichier :** `src/lib/auth.ts`

**Fonctionnement :**

1. Better Auth configuré avec le adapter Drizzle
2. Gestion automatique des sessions avec rotation
3. Cookies HttpOnly sécurisés
4. Base de données PostgreSQL via Drizzle ORM

**Avantages :**

- ✅ Contrôle total sur quand rafraîchir
- ✅ Peut être appelé manuellement si besoin

**Inconvénients :**

- ❌ Nécessite un appel explicite
- ❌ Plus de code dans les composants

**Configuration Better Auth :**

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // 1 jour
  },
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  },
});
```

## 🎯 Quelle Approche Choisir ?

### Recommandation : Better Auth + Middleware Next.js

```typescript
// ✅ Middleware pour la protection des routes
// src/middleware.ts - Vérifie la session

// ✅ Better Auth Client pour les API calls
// src/lib/auth-client.ts - Gère les sessions automatiquement
```

**Pourquoi cette combinaison ?**

- Better Auth gère toute la logique d'authentification
- Le middleware protège les routes côté serveur
- Couverture complète sans gestion manuelle des tokens

## 🔧 Configuration Better Auth avec Drizzle ORM

Better Auth est configuré avec l'adapter Drizzle pour PostgreSQL :

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});

// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});
```

## 📊 Diagramme de Séquence

### Scénario : Requête API avec Better Auth

```
Client                Next.js              Better Auth
  │                      │                    │
  │──GET /api/users/────>│                    │
  │                      │──Vérifier session──>│
  │                      │<──Session OK───────│
  │                      │                    │
  │                      │──Query Drizzle────>│
  │                      │<──Résultat─────────│
  │<─────200─────────────│                    │

### Scénario : Session expirée

```
Client                Next.js              Better Auth
  │                      │                    │
  │──GET /api/users/────>│                    │
  │                      │──Vérifier session──>│
  │                      │<──Session expirée──│
  │                      │                    │
  │──Redirection login───│                    │
  │<─────302─────────────│                    │
```

## 🛡️ Gestion des Erreurs

### Session non valide

```typescript
// hooks/use-session.ts
import { authClient } from "@/lib/auth-client";

export function useSession() {
  const { data: session, isPending, error } = authClient.useSession();
  
  if (error) {
    // Session invalide → Redirection login
    window.location.href = "/auth/login";
  }
  
  return { session, isPending };
}
```

### Protection des routes API

```typescript
// app/api/protected/route.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Accès autorisé
  return Response.json({ data: "Protected data" });
}
```

## 🧪 Tests

### Tester l'authentification Better Auth

```bash
# 1. Inscription
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "Test User"
  }' \
  -c cookies.txt

# 2. Connexion
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }' \
  -c cookies.txt

# 3. Vérifier la session
curl http://localhost:3000/api/auth/get-session \
  -b cookies.txt

# 4. Déconnexion
curl -X POST http://localhost:3000/api/auth/sign-out \
  -b cookies.txt \
  -c cookies.txt
```

### Simuler une session expirée

```typescript
// En dev, réduire la durée de session dans lib/auth.ts
session: {
  expiresIn: 60 * 10, // 10 secondes pour tester
  updateAge: 60 * 5,
}
```

## 📝 Logs de Debug

Ajouter des logs pour suivre les sessions :

```typescript
// lib/auth.ts avec logs
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  hooks: {
    before: async (ctx) => {
      console.log("� Auth request:", ctx.path);
    },
    after: async (ctx) => {
      console.log("✅ Auth success:", ctx.path);
    },
  },
  logger: {
    verboseLogging: process.env.NODE_ENV === "development",
  },
});
```

## ⚡ Optimisations

### Session prolongée pour utilisateurs actifs

```typescript
// lib/auth.ts
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // Mise à jour après 1 jour
    // La session est automatiquement prolongée si l'utilisateur est actif
  },
});
```

### Cache des sessions côté client

```typescript
// React Query pour cacher la session
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function useCachedSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## 🔐 Sécurité

### Points de vigilance

- ✅ Session ID en cookie HttpOnly (non accessible JS)
- ✅ Cookie `SameSite=lax` pour protection CSRF
- ✅ `Secure=true` en production (HTTPS)
- ✅ Durée de session configurable (7 jours par défaut)
- ✅ Rotation automatique des session tokens par Better Auth
- ✅ Invalidation des sessions côté serveur après logout
- ✅ Protection brute-force avec rate limiting

### Configuration de sécurité

```typescript
// lib/auth.ts
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // 1 jour
  },
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  },
  rateLimit: {
    window: 10, // 10 secondes
    max: 5, // 5 tentatives
  },
});
```

## 📚 Résumé

| Méthode                  | Utilisation      | Automatique | Recommandé      |
| ------------------------ | ---------------- | ----------- | --------------- |
| **Better Auth Client**   | Auth & Sessions  | ✅          | ✅ Tous cas     |
| **Middleware Next.js**   | Protection routes| ✅          | ✅ Pages        |
| **API getSession**       | Routes protégées | ✅          | ✅ API Routes   |

**Stack actuelle :** Better Auth + Drizzle ORM + Next.js = Full-stack authentification 🎯

## 📖 Ressources

- [Documentation Better Auth](https://www.better-auth.com/docs)
- [Adapter Drizzle](https://www.better-auth.com/docs/adapters/drizzle)
- [Configuration Next.js](https://www.better-auth.com/docs/integrations/next-js)
