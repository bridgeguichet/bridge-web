# React Query Configuration

React Query (@tanstack/react-query) est configuré et prêt à l'emploi dans l'application.

## Configuration

Le QueryClient est configuré avec les options suivantes :

- **staleTime**: 60 secondes (les données sont considérées fraîches pendant 1 minute)
- **refetchOnWindowFocus**: désactivé (pas de refetch automatique au focus)
- **retry**: 1 tentative (en cas d'échec, réessaye une fois)

## Utilisation

### Exemple avec useQuery

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

export function UsersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get<User[]>("/api/users");
      return response.data;
    },
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Exemple avec useMutation

```tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function CreateUserForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newUser: { name: string; email: string }) => {
      const response = await axios.post("/api/users", newUser);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Utilisateur créé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nom" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Création..." : "Créer"}
      </button>
    </form>
  );
}
```

### Hooks personnalisés recommandés

Créez des hooks personnalisés pour vos requêtes :

```tsx
// hooks/use-users.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users");
      return data;
    },
  });
}

// Dans votre composant
import { useUsers } from "@/hooks/use-users";

export function MyComponent() {
  const { data: users, isLoading } = useUsers();
  // ...
}
```

## React Query Devtools (Optionnel)

Pour installer les devtools en développement :

```bash
npm install @tanstack/react-query-devtools
# ou
pnpm add @tanstack/react-query-devtools
```

Puis décommentez dans `src/lib/react-query/query-provider.tsx` :

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Dans le return
<QueryClientProvider client={client}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>;
```

## Ressources

- [Documentation officielle](https://tanstack.com/query/latest)
- [Guide de migration](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5)
