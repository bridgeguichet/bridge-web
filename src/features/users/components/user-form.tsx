"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
// import { useOrganizations } from "@/features/organizations";
import { useCreateUser, useUpdateUser } from "@/features/users";
import type { UserDetail } from "@/features/users/types";
import { cn } from "@/lib/utils";

const userFormSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  full_name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }).optional(),
  organization: z.string().uuid({ message: "Organisation invalide" }),
  role: z.enum(["collecteur", "transporteur", "inspecteur", "manager", "admin"]).optional(),
  is_active: z.boolean().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user?: UserDetail;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [organizationSearch, setOrganizationSearch] = useState("");
  const [organizationOpen, setOrganizationOpen] = useState(false);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  // const { data: organizationsData } = useOrganizations({
  //   search: organizationSearch,
  // });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || "",
      full_name: user?.full_name || "",
      password: "",
      organization: "",
      role: "collecteur",
      is_active: user?.is_active ?? true,
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (user) {
        await updateUser.mutateAsync({
          id: user.id,
          userData: {
            email: data.email,
            full_name: data.full_name,
            is_active: data.is_active,
            is_staff: user.is_staff,
          },
        });
      } else {
        if (!data.password) {
          form.setError("password", { message: "Le mot de passe est requis" });
          return;
        }
        await createUser.mutateAsync({
          email: data.email,
          full_name: data.full_name,
          password: data.password,
          organization: data.organization,
          role: data.role,
          is_active: data.is_active,
        });
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!user && (
          <>
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Organisation</FormLabel>
                  {/* <Popover open={organizationOpen} onOpenChange={setOrganizationOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value
                            ? organizationsData?.results.find((org) => org.id === field.value)?.name
                            : "Sélectionner une organisation"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Rechercher une organisation..."
                          value={organizationSearch}
                          onValueChange={setOrganizationSearch}
                        />
                        <CommandList>
                          <CommandEmpty>Aucune organisation trouvée.</CommandEmpty>
                          <CommandGroup>
                            {organizationsData?.results.map((org) => (
                              <CommandItem
                                key={org.id}
                                value={org.id}
                                onSelect={() => {
                                  form.setValue("organization", org.id);
                                  setOrganizationOpen(false);
                                }}
                              >
                                <Check
                                  className={cn("mr-2 h-4 w-4", org.id === field.value ? "opacity-100" : "opacity-0")}
                                />
                                {org.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover> */}
                  <FormDescription>Organisation à laquelle l&apos;utilisateur sera rattaché</FormDescription>
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
                  <FormDescription>Minimum 6 caractères</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="collecteur">Collecteur</SelectItem>
                      <SelectItem value="transporteur">Transporteur</SelectItem>
                      <SelectItem value="inspecteur">Inspecteur</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Utilisateur actif</FormLabel>
                <FormDescription>L&apos;utilisateur peut se connecter et accéder à l&apos;application</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={createUser.isPending || updateUser.isPending}>
            {createUser.isPending || updateUser.isPending ? "Enregistrement..." : user ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
