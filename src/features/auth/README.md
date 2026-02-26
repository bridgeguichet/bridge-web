# Feature Auth - Documentation

Structure organisée pour l'authentification avec services, hooks React Query et types.

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

#### `authService.login(credentials)`

Connexion utilisateur via Next.js API route.

```typescript
const result = await authService.login({
  email: "user@example.com",
  password: "password123",
});
// Returns: { success: true, user: { id, email, name } }
```

#### `authService.logout()`

Déconnexion utilisateur.

```typescript
await authService.logout();
// Returns: { success: true }
```

#### `authService.refresh()`

Rafraîchir le token d'accès.

```typescript
await authService.refresh();
// Returns: { success: true }
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

Hook pour gérer la connexion avec React Query.

**Fonctionnalités :**

- ✅ Mutation React Query
- ✅ Toast de succès/erreur automatique
- ✅ Redirection vers `/dashboard` après connexion
- ✅ Cache utilisateur dans React Query

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

## 🔄 Intégration avec React Query

Les hooks utilisent React Query pour :

- **Cache** : Données utilisateur en cache
- **Loading states** : `isPending`, `isError`, `isSuccess`
- **Optimistic updates** : Mise à jour UI avant réponse serveur
- **Error handling** : Gestion automatique des erreurs
- **Retry logic** : Réessais automatiques si échec

### Accéder aux données utilisateur

```typescript
import { useQueryClient } from "@tanstack/react-query";

function MyComponent() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["user"]);

  return <div>Bonjour {user?.name}</div>;
}
```

## 🔐 Sécurité

- ✅ Tokens en cookies HttpOnly (jamais exposés à JS)
- ✅ Validation côté client ET serveur
- ✅ Gestion automatique des erreurs
- ✅ Refresh token automatique (middleware + axios)
- ✅ Clear du cache à la déconnexion

## 📚 Ressources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Guide d'authentification complet](../../../docs/authentication-guide.md)
- [Guide refresh token](../../../docs/refresh-token-guide.md)
