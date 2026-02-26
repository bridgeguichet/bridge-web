# Guide de Gestion du Refresh Token

Documentation complète sur les 3 approches pour gérer le refresh token dans l'architecture Next.js + Django.

## 🔄 Flux de Refresh Token

```
Access Token Expiré (401)
         ↓
    Détection
         ↓
   Refresh Token → Django
         ↓
  Nouveau Access Token
         ↓
   Set Cookie HttpOnly
         ↓
  Rejouer la requête
```

## 📋 3 Approches Implémentées

### Approche 1 : Middleware Next.js (Recommandé pour les pages)

**Quand l'utiliser :** Pour protéger les pages et rafraîchir avant le chargement

**Fichier :** `src/middleware.ts`

**Fonctionnement :**

1. Intercepte toutes les requêtes vers `/dashboard/*` et `/api/*`
2. Vérifie si `access_token` existe
3. Si absent mais `refresh_token` présent → appelle Django pour refresh
4. Set le nouveau `access_token` en cookie
5. Continue la navigation

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

### Approche 2 : Intercepteur Axios (Recommandé pour les API calls)

**Quand l'utiliser :** Pour les requêtes API directes vers Django

**Fichier :** `src/lib/axios/axios-instance.ts`

**Fonctionnement :**

1. Détecte une erreur 401 sur une requête API
2. Appelle `/api/auth/refresh` (Next.js API route)
3. Next.js appelle Django et set le nouveau cookie
4. Rejoue automatiquement la requête originale
5. Queue les requêtes simultanées pendant le refresh

**Avantages :**

- ✅ Gère automatiquement toutes les requêtes API
- ✅ Queue intelligente pour requêtes simultanées
- ✅ Transparent pour le développeur
- ✅ Pas de code supplémentaire dans les composants

**Inconvénients :**

- ❌ Nécessite un appel supplémentaire via Next.js API route

**Code :**

```typescript
// Automatique - aucune configuration nécessaire
import { axiosInstance } from "@/lib/axios";

const { data } = await axiosInstance.get("/api/users/");
// Si 401, refresh automatique et retry
```

### Approche 3 : API Route Next.js (Manuel)

**Quand l'utiliser :** Pour un contrôle manuel du refresh

**Fichier :** `src/app/api/auth/refresh/route.ts`

**Fonctionnement :**

1. Endpoint `/api/auth/refresh` disponible
2. Lit le `refresh_token` depuis les cookies
3. Appelle Django pour obtenir un nouveau `access_token`
4. Set le nouveau token en cookie HttpOnly
5. Retourne success/error

**Avantages :**

- ✅ Contrôle total sur quand rafraîchir
- ✅ Peut être appelé manuellement si besoin

**Inconvénients :**

- ❌ Nécessite un appel explicite
- ❌ Plus de code dans les composants

**Utilisation manuelle :**

```typescript
const refreshToken = async () => {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      console.log("Token refreshed");
    }
  } catch (error) {
    console.error("Refresh failed");
  }
};
```

## 🎯 Quelle Approche Choisir ?

### Recommandation : Combiner Middleware + Axios Interceptor

```typescript
// ✅ Middleware pour les pages
// src/middleware.ts - Déjà configuré

// ✅ Axios Interceptor pour les API calls
// src/lib/axios/axios-instance.ts - Déjà configuré
```

**Pourquoi cette combinaison ?**

- Le middleware protège la navigation et refresh avant le chargement
- L'intercepteur gère les requêtes API pendant l'utilisation
- Couverture complète sans code supplémentaire

## 🔧 Configuration Django

Django doit avoir un endpoint de refresh :

```python
# views.py
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    refresh_token = request.data.get('refresh_token')

    if not refresh_token:
        return Response(
            {'error': 'Refresh token requis'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        refresh = RefreshToken(refresh_token)
        return Response({
            'access_token': str(refresh.access_token),
        })
    except Exception:
        return Response(
            {'error': 'Token invalide ou expiré'},
            status=status.HTTP_401_UNAUTHORIZED
        )
```

## 📊 Diagramme de Séquence

### Scénario : Requête API avec token expiré

```
Client                Next.js              Django
  │                      │                    │
  │──GET /api/users/────>│                    │
  │                      │──GET /api/users/──>│
  │                      │<──401 Unauthorized─│
  │                      │                    │
  │<─────401─────────────│                    │
  │                      │                    │
  │──POST /api/refresh──>│                    │
  │                      │──POST /refresh/───>│
  │                      │<──access_token─────│
  │                      │ (set cookie)       │
  │<─────200─────────────│                    │
  │                      │                    │
  │──GET /api/users/────>│                    │
  │                      │──GET /api/users/──>│
  │                      │    (new token)     │
  │                      │<──200 OK───────────│
  │<─────200─────────────│                    │
```

## 🛡️ Gestion des Erreurs

### Token expiré définitivement

```typescript
// axios-instance.ts
if (error.response?.status === 401 && !originalRequest._retry) {
  try {
    await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    return axiosInstance(originalRequest);
  } catch (refreshError) {
    // Refresh échoué → Redirection login
    window.location.href = "/auth/login";
  }
}
```

### Requêtes simultanées pendant refresh

```typescript
// Queue système pour éviter multiples refresh
let isRefreshing = false;
let failedQueue = [];

if (isRefreshing) {
  // Mettre en queue
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  }).then(() => axiosInstance(originalRequest));
}
```

## 🧪 Tests

### Tester le refresh manuellement

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}' \
  -c cookies.txt

# 2. Attendre expiration access token (15 min)

# 3. Faire une requête (devrait auto-refresh)
curl http://localhost:8000/api/users/ \
  -b cookies.txt \
  -v

# 4. Vérifier le refresh manuel
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

### Simuler un token expiré

```typescript
// Pour tester en dev, réduire la durée
cookieStore.set("access_token", token, {
  maxAge: 10, // 10 secondes au lieu de 15 min
});
```

## 📝 Logs de Debug

Ajouter des logs pour suivre le refresh :

```typescript
// axios-instance.ts
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("🔄 Token expiré, tentative de refresh...");

      try {
        await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        console.log("✅ Token refreshed avec succès");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh échoué, redirection login");
        window.location.href = "/auth/login";
      }
    }
  }
);
```

## ⚡ Optimisations

### Refresh proactif (avant expiration)

```typescript
// Optionnel : Refresh 1 min avant expiration
const REFRESH_BEFORE_EXPIRY = 60 * 1000; // 1 minute

setInterval(async () => {
  await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
}, 15 * 60 * 1000 - REFRESH_BEFORE_EXPIRY); // 14 min
```

### Cache du refresh

```typescript
// Éviter refresh si déjà fait récemment
let lastRefresh = 0;
const REFRESH_COOLDOWN = 5000; // 5 secondes

if (Date.now() - lastRefresh < REFRESH_COOLDOWN) {
  return axiosInstance(originalRequest);
}
lastRefresh = Date.now();
```

## 🔐 Sécurité

### Points de vigilance

- ✅ Refresh token en cookie HttpOnly (non accessible JS)
- ✅ Access token en cookie HttpOnly (non accessible JS)
- ✅ `SameSite=lax` pour protection CSRF
- ✅ `Secure=true` en production (HTTPS)
- ✅ Durée courte access token (15 min)
- ✅ Durée longue refresh token (7 jours)
- ✅ Blacklist refresh token côté Django après logout

### Rotation des refresh tokens (optionnel)

```python
# Django settings.py
SIMPLE_JWT = {
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

Avec rotation, chaque refresh génère un nouveau refresh token.

## 📚 Résumé

| Méthode               | Utilisation      | Automatique | Recommandé      |
| --------------------- | ---------------- | ----------- | --------------- |
| **Middleware**        | Navigation pages | ✅          | ✅ Pages        |
| **Axios Interceptor** | Requêtes API     | ✅          | ✅ API          |
| **API Route Manuel**  | Contrôle manuel  | ❌          | ⚠️ Cas spéciaux |

**Configuration actuelle :** Middleware + Axios Interceptor = Couverture complète automatique 🎯
