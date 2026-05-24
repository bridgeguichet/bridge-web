"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, CalendarCheck, CheckCircle, Clock, CreditCard, Download, Loader2, Lock, Package, Smartphone, Trash2, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePackBuilderStore } from "@/features/pack-builder/store";
import { useCreateTransaction } from "@/features/transactions";

export default function PaiementPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"mobile_money" | "visa" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mobile Money form state
  const [mobileProvider, setMobileProvider] = useState<string>("");
  const [mobilePhone, setMobilePhone] = useState<string>("");

  // Visa form state
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardHolder, setCardHolder] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvv, setCardCvv] = useState<string>("");

  const items = usePackBuilderStore((state) => state.items);
  const removeItem = usePackBuilderStore((state) => state.removeItem);
  const getTotalAmount = usePackBuilderStore((state) => state.getTotalAmount);
  const clearPack = usePackBuilderStore((state) => state.clearPack);
  const wantsCounselor = usePackBuilderStore((state) => state.wantsCounselor);
  const appointment = usePackBuilderStore((state) => state.appointment);
  const { mutate: createTransaction } = useCreateTransaction();

  const totalAmount = getTotalAmount();

  // Rediriger si le pack est vide
  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      router.push("/monpack");
    }
  }, [items.length, isSuccess, router]);

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    toast.success("Service retiré du pack");
  };

  const handlePayment = async () => {
    if (!paymentMethod) return;

    // Validation selon le moyen de paiement
    if (paymentMethod === "mobile_money") {
      if (!mobileProvider || !mobilePhone) {
        toast.error("Veuillez remplir tous les champs Mobile Money");
        return;
      }
    }

    if (paymentMethod === "visa") {
      if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
        toast.error("Veuillez remplir tous les champs de la carte");
        return;
      }
    }

    setIsProcessing(true);

    // Simulation du traitement de paiement (2-3 secondes)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setIsProcessing(false);

    // Créer une transaction pour ce pack
    createTransaction({
      type: "pack",
      amount: totalAmount,
      paymentMethod: paymentMethod === "mobile_money" ? "mobile_money" : "card",
      description: `Pack personnalisé (${items.length} service${items.length > 1 ? "s" : ""})`,
      items: items.map((item) => ({
        id: item.id || item.serviceId,
        name: item.service?.nameFr || "Service",
        description: item.variant?.nameFr ?? undefined,
        quantity: item.quantity,
        unitPrice: Number.parseFloat(item.unitPrice || "0"),
        totalPrice: Number.parseFloat(item.totalPrice || "0"),
        category: item.category?.nameFr,
      })),
      metadata: {
        source: "pack-builder",
        paymentMethod: paymentMethod,
        mobileProvider: paymentMethod === "mobile_money" ? mobileProvider : undefined,
        last4Digits: paymentMethod === "visa" ? cardNumber.slice(-4) : undefined,
      },
    });

    setIsSuccess(true);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    }
    return value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleReturnHome = () => {
    clearPack();
    router.push("/");
  };

  // Écran de succès après paiement
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-lg">
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <h1 className="mb-2 font-bold text-2xl text-gray-900">Paiement effectué avec succès !</h1>
                <p className="mb-6 text-gray-600">
                  Votre commande a été enregistrée. Vous recevrez une confirmation par email.
                </p>
                <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
                  <p className="mb-1 text-gray-500 text-sm">Méthode de paiement</p>
                  <p className="font-medium text-gray-900">
                    {paymentMethod === "mobile_money" ? "Mobile Money" : "Carte Visa"}
                  </p>
                  <p className="mt-3 mb-1 text-gray-500 text-sm">Montant payé</p>
                  <p className="font-bold text-xl text-primary">${totalAmount.toFixed(2)}</p>
                </div>
                <Button variant="outline" className="mb-3 w-full gap-2" size="sm">
                  <Download className="h-4 w-4" />
                  Télécharger la facture
                </Button>
                <Button onClick={handleReturnHome} className="w-full gap-2">
                  Retour à l&apos;accueil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-6">
          <Button onClick={() => router.push("/monpack/conseiller")} variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>

        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-center font-bold text-3xl text-gray-900">Finaliser votre commande</h1>

          <div className="grid gap-6">
            {/* Résumé du pack */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Résumé de votre pack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length === 0 ? (
                  <p className="py-4 text-center text-gray-500">Votre pack est vide</p>
                ) : (
                  <>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm">{item.service?.nameFr}</p>
                            {item.variant && <p className="text-gray-500 text-xs">{item.variant.nameFr}</p>}
                            <p className="mt-1 text-gray-600 text-xs">
                              Qté: {item.quantity} × ${item.unitPrice}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <p className="font-semibold text-gray-900 text-sm">${item.totalPrice}</p>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-gray-200 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-2xl text-primary">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Récap rendez-vous conseiller */}
            {wantsCounselor === true && appointment?.date && appointment?.timeSlot && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CalendarCheck className="h-5 w-5 text-primary" />
                    Rendez-vous avec un conseiller
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Conseiller Bridge</p>
                      <p className="text-gray-500 text-xs">Accompagnement personnalisé</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 rounded-lg bg-white p-3">
                      <CalendarCheck className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-gray-500 text-xs">Date</p>
                        <p className="font-semibold text-gray-900 text-sm capitalize">
                          {new Date(appointment.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white p-3">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-gray-500 text-xs">Créneau</p>
                        <p className="font-semibold text-gray-900 text-sm">{appointment.timeSlot.time}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Choix du moyen de paiement */}
            <Card>
              <CardHeader>
                <CardTitle>Choisissez votre moyen de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Mobile Money */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("mobile_money")}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                      paymentMethod === "mobile_money"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${
                        paymentMethod === "mobile_money" ? "bg-primary text-white" : "bg-gray-100"
                      }`}
                    >
                      <Smartphone className="h-7 w-7" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">Mobile Money</p>
                      <p className="text-gray-500 text-sm">Airtel Money, M-Pesa...</p>
                    </div>
                  </button>

                  {/* Carte Visa */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("visa")}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                      paymentMethod === "visa" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${
                        paymentMethod === "visa" ? "bg-primary text-white" : "bg-gray-100"
                      }`}
                    >
                      <CreditCard className="h-7 w-7" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">Carte Visa</p>
                      <p className="text-gray-500 text-sm">Carte bancaire internationale</p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Champs de saisie Mobile Money */}
            {paymentMethod === "mobile_money" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Smartphone className="h-5 w-5" />
                    Informations Mobile Money
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile-provider">Opérateur</Label>
                    <Select value={mobileProvider} onValueChange={setMobileProvider}>
                      <SelectTrigger id="mobile-provider">
                        <SelectValue placeholder="Sélectionnez votre opérateur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="airtel">Airtel Money</SelectItem>
                        <SelectItem value="mpesa">M-Pesa</SelectItem>
                        <SelectItem value="orange">Orange Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile-phone">Numéro de téléphone</Label>
                    <Input
                      id="mobile-phone"
                      type="tel"
                      placeholder="Ex: +243 81 234 5678"
                      value={mobilePhone}
                      onChange={(e) => setMobilePhone(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Champs de saisie Carte Visa */}
            {paymentMethod === "visa" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Lock className="h-5 w-5" />
                    Informations de carte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Numéro de carte</Label>
                    <Input
                      id="card-number"
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-holder">Nom du titulaire</Label>
                    <Input
                      id="card-holder"
                      type="text"
                      placeholder="JOHN DOE"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-expiry">Date d&apos;expiration</Label>
                      <Input
                        id="card-expiry"
                        type="text"
                        placeholder="MM/AA"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-cvv">CVV</Label>
                      <Input
                        id="card-cvv"
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bouton de paiement */}
            <Button
              onClick={handlePayment}
              disabled={!paymentMethod || isProcessing}
              className="w-full gap-2"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  Procéder au paiement
                  <span className="ml-2">(${totalAmount.toFixed(2)})</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
