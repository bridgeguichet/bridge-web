"use client";

import { useState } from "react";

import Image from "next/image";

import {
  CreditCardIcon,
  Delete02Icon,
  LockPasswordIcon,
  Mail01Icon,
  PlusSignIcon,
  Settings01Icon,
  SmartPhone01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore, useChangePassword } from "@/features/auth";

type MobileMoneyProvider = "mpesa" | "orange" | "airtel";

interface SavedMobileMoney {
  provider: MobileMoneyProvider;
  phoneNumber: string;
}

interface SavedCard {
  last4: string;
  expiry: string;
  holderName: string;
}

const mobileMoneyProviders = [
  { id: "mpesa" as const, name: "M-Pesa", color: "bg-green-500" },
  { id: "orange" as const, name: "Orange Money", color: "bg-orange-500" },
  { id: "airtel" as const, name: "Airtel Money", color: "bg-red-500" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function ParametrePage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const changePassword = useChangePassword();

  const [email, setEmail] = useState(currentUser?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [paymentType, setPaymentType] = useState<"mobile" | "card">("mobile");

  const [savedMobileMoney, setSavedMobileMoney] = useState<SavedMobileMoney | null>(null);
  const [savedCard, setSavedCard] = useState<SavedCard | null>(null);

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    holderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const isEmailVerified = currentUser?.emailVerified ?? false;

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Fonctionnalité à venir : modification de l'email");
  };

  const handleSendVerification = () => {
    toast.info("Fonctionnalité à venir : envoi du lien de vérification");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Veuillez saisir votre mot de passe actuel");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Le nouveau mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    await changePassword.mutateAsync({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = () => {
    toast.info("Fonctionnalité à venir : suppression du compte");
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.cardNumber || !cardForm.holderName || !cardForm.expiryMonth || !cardForm.expiryYear || !cardForm.cvv) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (cardForm.cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Numéro de carte invalide");
      return;
    }
    if (cardForm.cvv.length < 3) {
      toast.error("CVV invalide");
      return;
    }

    const last4 = cardForm.cardNumber.replace(/\s/g, "").slice(-4);
    setSavedCard({
      last4,
      expiry: `${cardForm.expiryMonth}/${cardForm.expiryYear}`,
      holderName: cardForm.holderName,
    });
    setIsAddingCard(false);
    setCardForm({ cardNumber: "", holderName: "", expiryMonth: "", expiryYear: "", cvv: "" });
    toast.success("Carte ajoutée avec succès");
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <HugeiconsIcon icon={Settings01Icon} size={24} color="currentColor" className="text-primary" />
          </div>
          <div>
            <h1 className="font-black text-3xl text-gray-900">Paramètres</h1>
            <p className="text-muted-foreground">Gérez vos paramètres et préférences</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="compte" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="compte" className="gap-2">
              <HugeiconsIcon icon={LockPasswordIcon} size={16} color="currentColor" />
              Compte
            </TabsTrigger>
            <TabsTrigger value="facturation" className="gap-2">
              <HugeiconsIcon icon={CreditCardIcon} size={16} color="currentColor" />
              Facturation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compte" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <HugeiconsIcon icon={Mail01Icon} size={20} color="currentColor" className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">Adresse email</CardTitle>
                    <CardDescription>Gérez votre adresse email et sa vérification</CardDescription>
                  </div>
                  <Badge variant={isEmailVerified ? "default" : "secondary"} className={isEmailVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                    {isEmailVerified ? "Vérifié" : "Non vérifié"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email actuel</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="max-w-md"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" variant="outline">
                      Modifier l&apos;email
                    </Button>
                    {!isEmailVerified && (
                      <Button type="button" onClick={handleSendVerification}>
                        Envoyer le lien de vérification
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <HugeiconsIcon icon={LockPasswordIcon} size={20} color="currentColor" className="text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mot de passe</CardTitle>
                    <CardDescription>Modifiez votre mot de passe pour sécuriser votre compte</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="max-w-md"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 md:max-w-2xl">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={changePassword.isPending}>
                    {changePassword.isPending ? "Mise à jour..." : "Changer le mot de passe"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                    <HugeiconsIcon icon={Delete02Icon} size={20} color="currentColor" className="text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-red-700">Supprimer le compte</CardTitle>
                    <CardDescription className="text-red-600/80">Cette action est irréversible</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-red-700">
                    La suppression de votre compte entraînera la perte définitive de toutes vos données, y compris vos commandes, vos favoris et votre historique. Cette action ne peut pas être annulée.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Supprimer mon compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facturation" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <HugeiconsIcon icon={CreditCardIcon} size={20} color="currentColor" className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mes moyens de paiement</CardTitle>
                    <CardDescription>Gérez vos moyens de paiement enregistrés</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2">
                  <Button
                    variant={paymentType === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPaymentType("mobile")}
                    className="gap-2 rounded-full"
                  >
                    <HugeiconsIcon icon={SmartPhone01Icon} size={16} color="currentColor" />
                    Mobile Money
                  </Button>
                  <Button
                    variant={paymentType === "card" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPaymentType("card")}
                    className="gap-2 rounded-full"
                  >
                    <HugeiconsIcon icon={CreditCardIcon} size={16} color="currentColor" />
                    Carte Visa
                  </Button>
                </div>

                {paymentType === "mobile" && (
                  <div className="space-y-4">
                    {savedMobileMoney ? (
                      <div className="rounded-xl border bg-muted/30 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${mobileMoneyProviders.find(p => p.id === savedMobileMoney.provider)?.color || "bg-gray-500"}`}>
                              <span className="font-bold text-white text-xs">
                                {savedMobileMoney.provider === "mpesa" ? "M" : savedMobileMoney.provider === "orange" ? "O" : "A"}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold">
                                {mobileMoneyProviders.find(p => p.id === savedMobileMoney.provider)?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {savedMobileMoney.phoneNumber.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => {
                              setSavedMobileMoney(null);
                              toast.success("Moyen de paiement supprimé");
                            }}
                          >
                            <HugeiconsIcon icon={Delete01Icon} size={18} color="currentColor" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-center text-muted-foreground">
                          Aucun moyen de paiement Mobile Money enregistré
                        </p>
                        <p className="text-center text-sm text-muted-foreground">
                          Choisissez votre opérateur pour ajouter un numéro
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                          {mobileMoneyProviders.map((provider) => (
                            <button
                              key={provider.id}
                              onClick={() => toast.info(`Fonctionnalité à venir : ajouter ${provider.name}`)}
                              className="group flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/20 p-4 transition-all hover:border-primary hover:bg-primary/5"
                            >
                              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${provider.color} transition-transform group-hover:scale-110`}>
                                <span className="font-bold text-white">
                                  {provider.id === "mpesa" ? "M" : provider.id === "orange" ? "O" : "A"}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                                {provider.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {paymentType === "card" && (
                  <div className="space-y-4">
                    {savedCard ? (
                      <div className="space-y-4">
                        <div className="relative mx-auto w-full max-w-sm">
                          <div className="aspect-[1.586/1] w-full rounded-2xl bg-linear-to-br from-rose-400 via-rose-500 to-rose-600 p-6 text-white shadow-xl">
                            <div className="flex h-full flex-col justify-between">
                              <div className="flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1">
                                  <Image
                                    src="/media/logo-bridge.png"
                                    alt="Bridge"
                                    width={40}
                                    height={40}
                                    className="h-auto w-full object-contain"
                                  />
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-2 w-2 rounded-sm bg-white/40" />
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="font-medium text-lg tracking-wider text-white/90">
                                  {savedCard.holderName.toUpperCase()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b pb-3">
                            <span className="text-muted-foreground">Numéro de carte</span>
                            <span className="font-mono font-medium">•••• •••• •••• {savedCard.last4}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Date d&apos;expiration</span>
                            <span className="font-medium">{savedCard.expiry}</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => {
                            setSavedCard(null);
                            toast.success("Carte supprimée");
                          }}
                        >
                          <HugeiconsIcon icon={Delete01Icon} size={16} color="currentColor" />
                          Supprimer cette carte
                        </Button>
                      </div>
                    ) : isAddingCard ? (
                      <form onSubmit={handleAddCard} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="holderName">Nom sur la carte</Label>
                          <Input
                            id="holderName"
                            value={cardForm.holderName}
                            onChange={(e) => setCardForm({ ...cardForm, holderName: e.target.value })}
                            placeholder="JEAN DUPONT"
                            className="uppercase"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Numéro de carte</Label>
                          <Input
                            id="cardNumber"
                            value={cardForm.cardNumber}
                            onChange={(e) => setCardForm({ ...cardForm, cardNumber: formatCardNumber(e.target.value) })}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryMonth">Mois</Label>
                            <Input
                              id="expiryMonth"
                              value={cardForm.expiryMonth}
                              onChange={(e) => setCardForm({ ...cardForm, expiryMonth: e.target.value.replace(/\D/g, "").slice(0, 2) })}
                              placeholder="MM"
                              maxLength={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiryYear">Année</Label>
                            <Input
                              id="expiryYear"
                              value={cardForm.expiryYear}
                              onChange={(e) => setCardForm({ ...cardForm, expiryYear: e.target.value.replace(/\D/g, "").slice(0, 2) })}
                              placeholder="AA"
                              maxLength={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              type="password"
                              value={cardForm.cvv}
                              onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                              placeholder="•••"
                              maxLength={4}
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button type="submit" className="flex-1">
                            Enregistrer la carte
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsAddingCard(false);
                              setCardForm({ cardNumber: "", holderName: "", expiryMonth: "", expiryYear: "", cvv: "" });
                            }}
                          >
                            Annuler
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col items-center gap-4 py-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                          <HugeiconsIcon icon={CreditCardIcon} size={32} color="currentColor" className="text-muted-foreground" />
                        </div>
                        <p className="text-center text-muted-foreground">
                          Aucune carte enregistrée
                        </p>
                        <Button
                          onClick={() => setIsAddingCard(true)}
                          className="gap-2"
                        >
                          <HugeiconsIcon icon={PlusSignIcon} size={16} color="currentColor" />
                          Ajouter une carte
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
