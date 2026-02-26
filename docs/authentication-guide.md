# Guide d'Authentification Sécurisée Next.js + Django

Architecture d'authentification sécurisée avec **cookies HttpOnly** pour Bridge.

## 🏗️ Architecture

```
┌─────────────┐      Login      ┌──────────────┐      ┌─────────────┐
│             │  ──────────────> │   Next.js    │ ───> │   Django    │
│   Client    │                  │  API Route   │      │   Backend   │
│  (Browser)  │  <──────────────│  /api/login  │ <─── │             │
│             │   Set Cookies    └──────────────┘      └─────────────┘
└─────────────┘                                               ▲
       │                                                       │
       │          Toutes les autres requêtes                  │
       └───────────────────────────────────────────────────────┘
                    (avec cookies HttpOnly)
```

### Flux d'authentification

1. **Login** : Client → Next.js API Route → Django
2. **Set Cookies** : Next.js set les tokens en cookies HttpOnly
3. **Requêtes** : Client → Django directement (cookies envoyés automatiquement)

## 🔐 Sécurité

### Tokens jamais exposés à JavaScript

- ✅ Access token et refresh token en **cookies HttpOnly**
- ✅ Non accessibles via `document.cookie` ou JavaScript
- ✅ Protection contre XSS (Cross-Site Scripting)
- ✅ `SameSite=lax` : Protection CSRF
- ✅ `Secure=true` en production (HTTPS uniquement)

### Configuration des cookies

| Cookie          | Durée   | HttpOnly | Secure    | SameSite |
| --------------- | ------- | -------- | --------- | -------- |
| `access_token`  | 15 min  | ✅       | ✅ (prod) | lax      |
| `refresh_token` | 7 jours | ✅       | ✅ (prod) | lax      |

## 📁 Structure des fichiers

```
src/
├── app/
│   └── api/
│       └── auth/
│           ├── login/
│           │   └── route.ts          # API route login
│           └── logout/
│               └── route.ts          # API route logout
├── lib/
│   ├── auth/
│   │   └── auth-client.ts           # Client auth functions
│   └── axios/
│       ├── axios-instance.ts        # Axios configuré pour Django
│       └── index.ts
docs/
└── django-backend-config.md         # Configuration Django
```

## 🚀 Utilisation

### 1. Configuration des variables d'environnement

**.env.local** (Next.js)

```env
DJANGO_API_URL=http://localhost:8000
NEXT_PUBLIC_DJANGO_API_URL=http://localhost:8000
NODE_ENV=development
```

### 2. Connexion côté client

```typescript
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await authClient.login(credentials);
    },
    onSuccess: (data) => {
      toast.success("Connexion réussie");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    loginMutation.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
```

### 3. Requêtes vers Django

```typescript
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

interface User {
  id: string;
  email: string;
  name: string;
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Requête directe vers Django
      // Les cookies sont envoyés automatiquement
      const { data } = await axiosInstance.get<User[]>("/api/users/");
      return data;
    },
  });
}
```

### 4. Déconnexion

```typescript
import { authClient } from "@/lib/auth/auth-client";

const handleLogout = async () => {
  await authClient.logout();
  router.push("/auth/login");
};
```

## 🔄 Gestion du Refresh Token

### Option 1 : Middleware Next.js (Recommandé)

Créer un middleware pour rafraîchir automatiquement le token :

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  // Si pas de access token mais refresh token existe
  if (!accessToken && refreshToken) {
    try {
      // Appeler Django pour refresh
      const response = await fetch(
        `${process.env.DJANGO_API_URL}/api/auth/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken.value }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const res = NextResponse.next();

        res.cookies.set("access_token", data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 15,
          path: "/",
        });

        return res;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
```

### Option 2 : Intercepteur Axios

```typescript
// axios-instance.ts
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Appeler Next.js API route pour refresh
        await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        // Réessayer la requête originale
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
```

## 🧪 Tests

### Tester la connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt
```

### Tester une requête protégée

```bash
curl http://localhost:8000/api/users/ \
  -b cookies.txt
```

## ⚠️ Points d'attention

### CORS Configuration

Django doit autoriser :

- ✅ `CORS_ALLOW_CREDENTIALS = True`
- ✅ Origin Next.js dans `CORS_ALLOWED_ORIGINS`

### Domaines en production

Les cookies fonctionnent entre domaines si :

- Next.js : ``
- Django : ``
- Cookie domain : ``

### HTTPS obligatoire en production

```typescript
// route.ts
const isProduction = process.env.NODE_ENV === "production";

cookieStore.set("access_token", token, {
  secure: isProduction, // true en production
  // ...
});
```

## 📊 Comparaison avec localStorage

| Critère         | Cookies HttpOnly | localStorage |
| --------------- | ---------------- | ------------ |
| Accessible JS   | ❌ Non           | ✅ Oui       |
| Protection XSS  | ✅ Oui           | ❌ Non       |
| Auto-envoi      | ✅ Oui           | ❌ Non       |
| CSRF Protection | ✅ SameSite      | ⚠️ Manuel    |
| Persistance     | ✅ Configurable  | ✅ Permanent |

## 🔗 Ressources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Django CORS Headers](https://github.com/adamchainz/django-cors-headers)
- [Django REST Framework JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
