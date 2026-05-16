# Feature Auth - Documentation

Structure organisée pour l'authentification avec Better Auth, hooks React Query et types.

## 📁 Structure

``` md
src/features/auth/
├── types.ts          # Types TypeScript pour l'auth
├── services.ts       # Logique métier et appels API
├── hooks.ts          # Hooks React Query
├── index.ts          # Exports centralisés
└── README.md         # Documentation
```

## 🔧 Services (`services.ts`)

### Méthodes disponibles

Les services utilisent le client Better Auth pour l'authentification.

#### `authService.login(credentials)`

Connexion utilisateur via Better Auth.

```typescript
import { authClient } from "@/lib/auth-client";

const result = await authClient.signIn.email({
  email: "user@example.com",
  password: "password123",
});
// Returns: { data: { user, session }, error: null }
```

#### `authService.logout()`

Déconnexion utilisateur.

```typescript
await authClient.signOut();
// Returns: { data: null, error: null }
```

#### `authService.getSession()`

Récupérer la session active.

```typescript
const { data: session } = await authClient.getSession();
// Returns: { user, session } ou null si non connecté
```

#### `authService.validateEmail(email)`

Valider le format d'un email.

```typescript
const isValid = authService.validateEmail("user@example.com");
// Returns: true | false
```

#### `authService.validatePassword(password)`

Valider un mot de passe.

```typescript
const result = authService.validatePassword("pass");
// Returns: { valid: false, message: "Le mot de passe doit..." }
```

## 🪝 Hooks React Query (`hooks.ts`)

### `useLogin()`

Hook pour gérer la connexion avec Better Auth.

**Fonctionnalités :**

- ✅ Utilise Better Auth client
- ✅ Toast de succès/erreur automatique
- ✅ Redirection vers `/dashboard` après connexion
- ✅ Gestion automatique des sessions

**Exemple :**

```typescript
"use client";

import { useLogin } from "@/features/auth";

export function LoginForm() {
  const loginMutation = useLogin();

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
      {loginMutation.isError && (
        <p className="text-red-500">{loginMutation.error.message}</p>
      )}
    </form>
  );
}
```

### `useLogout()`

Hook pour gérer la déconnexion.

**Fonctionnalités :**

- ✅ Mutation React Query
- ✅ Clear du cache React Query
- ✅ Toast de succès/erreur
- ✅ Redirection vers `/auth/login`

**Exemple :**

```typescript
"use client";

import { useLogout } from "@/features/auth";

export function LogoutButton() {
  const logoutMutation = useLogout();

  return (
    <button
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? "Déconnexion..." : "Se déconnecter"}
    </button>
  );
}
```

### `useRefreshToken()`

Hook pour rafraîchir manuellement le token (rarement nécessaire car automatique).

**Exemple :**

```typescript
const refreshMutation = useRefreshToken();

// Appel manuel si nécessaire
refreshMutation.mutate();
```

## 📝 Types (`types.ts`)

### `User`

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}
```

### `LoginCredentials`

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

### `LoginResponse`

```typescript
interface LoginResponse {
  success: boolean;
  user: User;
}
```

## 🎯 Exemples d'utilisation

### Formulaire de connexion complet

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, authService } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const loginMutation = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </Form>
  );
}
```

### Bouton de déconnexion dans un menu

```typescript
"use client";

import { useLogout } from "@/features/auth";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const logoutMutation = useLogout();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        <LogOut className="mr-2 size-4" />
        {logoutMutation.isPending ? "Déconnexion..." : "Se déconnecter"}
      </Button>
    </div>
  );
}
```

### Validation côté client

```typescript
import { authService } from "@/features/auth";

// Valider email
const emailValid = authService.validateEmail(email);
if (!emailValid) {
  setError("Email invalide");
}

// Valider mot de passe
const passwordValidation = authService.validatePassword(password);
if (!passwordValidation.valid) {
  setError(passwordValidation.message);
}
```

## 🔄 Intégration avec Better Auth

Better Auth gère automatiquement :

- **Sessions** : Stockage en base de données avec rotation
- **Cookies** : HttpOnly, secure, sameSite
- **État utilisateur** : Accessible via `authClient.useSession()`
- **OAuth** : Google OAuth intégré

### Accéder aux données utilisateur

```typescript
import { authClient } from "@/lib/auth-client";

function MyComponent() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) return <div>Chargement...</div>;
  
  return <div>Bonjour {user?.name}</div>;
}
```

## 🔐 Sécurité

- ✅ Sessions en cookies HttpOnly (jamais exposés à JS)
- ✅ Validation côté client ET serveur par Better Auth
- ✅ Gestion automatique des erreurs
- ✅ Rotation automatique des session tokens
- ✅ Protection CSRF avec SameSite cookies
- ✅ Rate limiting intégré

## 📚 Ressources

- [Documentation Better Auth](https://www.better-auth.com/docs)
- [Guide des sessions](../../../docs/refresh-token-guide.md)
