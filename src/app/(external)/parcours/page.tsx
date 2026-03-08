"use client";

import { useRouter } from "next/navigation";
import {
  Globe,
  Plane,
  TrendingUp,
  Zap,
  Coffee,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const parcoursList = [
  {
    id: "diaspora",
    title: "Diaspora",
    description:
      "Vous êtes d'origine congolaise et vivez à l'étranger ? Découvrez des services sur-mesure pour vous.",
    icon: Globe,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    bgGradient: "from-blue-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-blue-500/5",
    borderHover: "hover:border-blue-500/50",
    badge: "Populaire",
    badgeVariant: "default" as const,
  },
  {
    id: "expat",
    title: "Expatrié",
    description:
      "Vous venez vous installer au Congo ? Facilitez votre intégration et votre quotidien.",
    icon: Plane,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
    bgGradient: "from-emerald-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-emerald-500/5",
    borderHover: "hover:border-emerald-500/50",
    badge: null,
    badgeVariant: null,
  },
  {
    id: "investisseur",
    title: "Investisseur",
    description:
      "Saisissez les meilleures opportunités d'investissement et développez vos projets.",
    icon: TrendingUp,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    bgGradient: "from-purple-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-purple-500/5",
    borderHover: "hover:border-purple-500/50",
    badge: "Premium",
    badgeVariant: "secondary" as const,
  },
  {
    id: "nextgen",
    title: "NextGen (18-26 ans)",
    description:
      "Les services pour propulser la nouvelle génération vers l'avenir de leurs ambitions.",
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    bgGradient: "from-amber-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-amber-500/5",
    borderHover: "hover:border-amber-500/50",
    badge: "Nouveau",
    badgeVariant: "outline" as const,
  },
  {
    id: "retraite",
    title: "Retraite",
    description:
      "Préparez sereinement votre avenir ou profitez de vos vieux jours en toute tranquillité.",
    icon: Coffee,
    color: "text-rose-500",
    bgColor: "bg-rose-500",
    bgGradient: "from-rose-500/10 via-transparent to-transparent",
    bgHover: "hover:bg-rose-500/5",
    borderHover: "hover:border-rose-500/50",
    badge: null,
    badgeVariant: null,
  },
];

export default function Parcours() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 via-background to-background" />

      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="text-center mb-20 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Trouvez votre parcours idéal</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Choisissez votre parcours
          </h1>

          <p className="text-muted-foreground text-lg md:text-lg max-w-3xl mx-auto leading-relaxed">
            Sélectionnez le profil qui vous correspond le mieux afin que nous
            puissions adapter votre expérience et vous proposer les services les
            plus pertinents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parcoursList.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                onClick={() => router.push(`/parcours/${item.id}`)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                className={cn(
                  "group cursor-pointer transition-all duration-500 ease-out",
                  "hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:scale-[1.02]",
                  "relative overflow-hidden border-2",
                  "animate-in fade-in slide-in-from-bottom-8",
                  item.bgHover,
                  item.borderHover,
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br",
                    item.bgGradient,
                  )}
                />

                <CardHeader className="pb-6 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={cn(
                        "p-4 rounded-2xl w-fit bg-linear-to-br from-background to-muted/50 shadow-lg border-2 transition-all duration-300",
                        "group-hover:scale-110 group-hover:rotate-3",
                        item.color,
                      )}
                    >
                      <Icon className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    {item.badge && (
                      <Badge
                        variant={item.badgeVariant}
                        className="animate-in fade-in zoom-in duration-500"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-xl md:text-2xl mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>

                  <CardDescription className="text-base leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 relative z-10">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-all duration-300">
                    <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                      Démarrer maintenant
                    </span>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardContent>

                <div
                  className={cn(
                    "absolute -bottom-16 -right-16 w-40 h-40 rounded-full opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-30 group-hover:scale-150",
                    item.bgColor,
                  )}
                />

                <div
                  className={cn(
                    "absolute -top-16 -left-16 w-32 h-32 rounded-full opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-20 group-hover:scale-125",
                    item.bgColor,
                  )}
                />
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <p className="text-sm text-muted-foreground">
            Besoin d'aide pour choisir ?{" "}
            <button
              type="button"
              className="text-primary hover:underline font-medium transition-colors"
              onClick={() => router.push("/contact")}
            >
              Contactez notre équipe
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
