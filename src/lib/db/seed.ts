import { config } from "dotenv";

config();

import { eq } from "drizzle-orm";
import { auth } from "../auth/auth";
import { db } from "./index";
import {
  categories,
  resources,
  services,
  serviceVariants,
  subcategories,
  users,
  vendorMembers,
  vendors,
} from "./schema";

const DEFAULT_PASSWORD = "00000000";

// Helper to create user via Better Auth API
async function createUserViaAuth(email: string, name: string, role: string, isSuperUser: boolean) {
  try {
    // Create user using Better Auth's internal API
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password: DEFAULT_PASSWORD,
        name,
      },
    });

    if (!result || !result.user) {
      throw new Error("Failed to create user");
    }

    // Update additional fields (role, isSuperUser)
    await db.update(users).set({ role, isSuperUser }).where(eq(users.id, result.user.id));

    console.log(`✅ ${email} created (${role}, super=${isSuperUser})`);
    return result.user;
  } catch (error: any) {
    // If user already exists, just return existing
    if (error.message?.includes("already exists")) {
      console.log(`⚠️  ${email} already exists`);
      const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return existing[0] || null;
    }
    console.error(`❌ Error creating ${email}:`, error.message);
    throw error;
  }
}

const seedData = async () => {
  console.log("🌱 Seeding database...\n");

  try {
    // ==========================================
    // 1. Créer ROOT User (super-user, pas membre d'un vendor)
    // ==========================================
    const rootUser = await createUserViaAuth("rootuser@bridge.com", "ROOT User", "customer", true);

    if (!rootUser) {
      throw new Error("Failed to create root user");
    }

    console.log("✅ ROOT User created (super-user, not a vendor member)\n");

    // ==========================================
    // 2. Créer utilisateur admin BRIDGE
    // ==========================================
    const adminUser = await createUserViaAuth("admin@bridge-guichet.com", "BRIDGE Admin", "admin", false);

    if (!adminUser) {
      throw new Error("Failed to create admin user");
    }

    console.log("✅ Admin user created\n");

    // ==========================================
    // 3. Créer vendor BRIDGE
    // ==========================================
    const [bridgeVendor] = await db
      .insert(vendors)
      .values({
        userId: adminUser.id,
        companyName: "BRIDGE Guichet",
        status: "active",
        isBridgeOfficial: true,
        commissionRate: "0",
        description: "Service officiel BRIDGE pour la diaspora congolaise",
      })
      .returning();

    console.log("✅ BRIDGE vendor created\n");

    // ==========================================
    // 4. Créer vendor_members pour l'équipe Bridge
    // ==========================================

    // Admin comme vendor_member
    await db.insert(vendorMembers).values({
      vendorId: bridgeVendor.id,
      userId: adminUser.id,
      role: "admin",
    });
    console.log("✅ Admin added as vendor member\n");

    // ==========================================
    // 5. Créer manager BRIDGE
    // ==========================================
    const managerUser = await createUserViaAuth("manager@bridge.com", "BRIDGE Manager", "manager", false);

    if (managerUser) {
      await db.insert(vendorMembers).values({
        vendorId: bridgeVendor.id,
        userId: managerUser.id,
        role: "manager",
      });
      console.log("✅ Manager added as vendor member\n");
    }

    // ==========================================
    // 6. Créer operator BRIDGE
    // ==========================================
    const operatorUser = await createUserViaAuth("operator@bridge.com", "BRIDGE Operator", "operator", false);

    if (operatorUser) {
      await db.insert(vendorMembers).values({
        vendorId: bridgeVendor.id,
        userId: operatorUser.id,
        role: "operator",
      });
      console.log("✅ Operator added as vendor member\n");
    }

    // ==========================================
    // 7. Créer catégories
    // ==========================================
    const categoriesData = [
      {
        slug: "mobilite",
        nameFr: "Mobilité",
        nameEn: "Mobility",
        icon: "car",
        sortOrder: 1,
      },
      {
        slug: "logement",
        nameFr: "Logement",
        nameEn: "Housing",
        icon: "home",
        sortOrder: 2,
      },
      {
        slug: "personnel",
        nameFr: "Personnel de maison",
        nameEn: "Household Staff",
        icon: "users",
        sortOrder: 3,
      },
      {
        slug: "services",
        nameFr: "Services",
        nameEn: "Services",
        icon: "briefcase",
        sortOrder: 4,
      },
      {
        slug: "conciergerie",
        nameFr: "Conciergerie",
        nameEn: "Concierge",
        icon: "bell",
        sortOrder: 5,
      },
    ];

    const createdCategories = await db.insert(categories).values(categoriesData).returning();
    console.log("✅ Categories created");

    const mobiliteCategory = createdCategories.find((c) => c.slug === "mobilite")!;
    const logementCategory = createdCategories.find((c) => c.slug === "logement")!;
    const personnelCategory = createdCategories.find((c) => c.slug === "personnel")!;
    const servicesCategory = createdCategories.find((c) => c.slug === "services")!;
    const conciergerieCategory = createdCategories.find((c) => c.slug === "conciergerie")!;

    // ==========================================
    // 8. Services Mobilité
    // ==========================================
    const mobiliteServices = [
      {
        vendorId: bridgeVendor.id,
        categoryId: mobiliteCategory.id,
        nameFr: "Voiture avec chauffeur",
        nameEn: "Car with driver",
        descriptionFr: "Service de voiture avec chauffeur professionnel à Kinshasa",
        descriptionEn: "Professional car with driver service in Kinshasa",
        basePrice: "50",
        priceUnit: "day",
        status: "active",
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: mobiliteCategory.id,
        nameFr: "Transfert aéroport",
        nameEn: "Airport transfer",
        descriptionFr: "Transfert depuis/vers l'aéroport de N'Djili",
        descriptionEn: "Transfer from/to N'Djili airport",
        basePrice: "60",
        priceUnit: "unit",
        status: "active",
      },
    ];

    const [voitureService, transfertService] = await db.insert(services).values(mobiliteServices).returning();

    // Variants pour voiture avec chauffeur
    await db.insert(serviceVariants).values([
      {
        serviceId: voitureService.id,
        nameFr: "Sedan Standard",
        nameEn: "Standard Sedan",
        priceModifier: "50",
        metadata: {
          vehicleType: "sedan",
          capacity: 4,
          luggage: 2,
          features: ["Climatisation", "Chauffeur professionnel"],
          examples: ["Toyota Corolla", "Honda Accord"],
        },
        sortOrder: 1,
      },
      {
        serviceId: voitureService.id,
        nameFr: "SUV Compact (RAV4)",
        nameEn: "Compact SUV (RAV4)",
        priceModifier: "100",
        metadata: {
          vehicleType: "suv",
          capacity: 5,
          luggage: 3,
          features: ["4x4", "Climatisation", "GPS", "Chauffeur expérimenté"],
          examples: ["Toyota RAV4", "Honda CR-V"],
        },
        sortOrder: 2,
      },
      {
        serviceId: voitureService.id,
        nameFr: "SUV Premium (Prado)",
        nameEn: "Premium SUV (Prado)",
        priceModifier: "150",
        metadata: {
          vehicleType: "premium_suv",
          capacity: 7,
          luggage: 5,
          features: ["4x4", "Cuir", "Climatisation bi-zone", "GPS", "Chauffeur VIP"],
          examples: ["Toyota Land Cruiser Prado", "Lexus GX"],
        },
        sortOrder: 3,
      },
      {
        serviceId: voitureService.id,
        nameFr: "Van 12 places",
        nameEn: "12-seat Van",
        priceModifier: "200",
        metadata: {
          vehicleType: "van",
          capacity: 12,
          luggage: 8,
          features: ["Climatisation", "Sièges confortables", "Chauffeur + assistant"],
          examples: ["Toyota Hiace", "Mercedes Sprinter"],
        },
        sortOrder: 4,
      },
    ]);

    // Variants pour transfert aéroport
    await db.insert(serviceVariants).values([
      {
        serviceId: transfertService.id,
        nameFr: "Aller simple - Sedan",
        nameEn: "One way - Sedan",
        priceModifier: "60",
        metadata: {
          tripType: "one_way",
          vehicleType: "sedan",
          capacity: 4,
          luggage: 2,
          features: ["Climatisation", "Accueil personnalisé"],
        },
        sortOrder: 1,
      },
      {
        serviceId: transfertService.id,
        nameFr: "Aller-retour - Sedan",
        nameEn: "Round trip - Sedan",
        priceModifier: "100",
        metadata: {
          tripType: "round_trip",
          vehicleType: "sedan",
          capacity: 4,
          luggage: 2,
          features: ["Climatisation", "Accueil personnalisé", "Flexibilité horaire"],
        },
        sortOrder: 2,
      },
      {
        serviceId: transfertService.id,
        nameFr: "Aller simple VIP - SUV Premium",
        nameEn: "One way VIP - Premium SUV",
        priceModifier: "120",
        metadata: {
          tripType: "one_way",
          vehicleType: "premium_suv",
          capacity: 7,
          luggage: 5,
          features: ["4x4", "Cuir", "WiFi", "Eau fraîche", "Chauffeur VIP"],
        },
        sortOrder: 3,
      },
      {
        serviceId: transfertService.id,
        nameFr: "Aller-retour VIP - SUV Premium",
        nameEn: "Round trip VIP - Premium SUV",
        priceModifier: "200",
        metadata: {
          tripType: "round_trip",
          vehicleType: "premium_suv",
          capacity: 7,
          luggage: 5,
          features: ["4x4", "Cuir", "WiFi", "Eau fraîche", "Chauffeur VIP", "Flexibilité horaire"],
        },
        sortOrder: 4,
      },
    ]);

    console.log("✅ Mobility services created");

    // ==========================================
    // 9. Services Logement
    // ==========================================
    const logementServices = [
      {
        vendorId: bridgeVendor.id,
        categoryId: logementCategory.id,
        nameFr: "Studio",
        nameEn: "Studio",
        descriptionFr: "Studio meublé avec ménage et petit déjeuner inclus",
        descriptionEn: "Furnished studio with cleaning and breakfast included",
        basePrice: "80",
        priceUnit: "day",
        status: "active",
        metadata: {
          amenities: ["cleaning", "breakfast"],
          locations: ["Gombe", "Ngaliema"],
        },
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: logementCategory.id,
        nameFr: "Appartement T2",
        nameEn: "2-room apartment",
        descriptionFr: "Appartement 2 pièces avec ménage et petit déjeuner",
        descriptionEn: "2-room apartment with cleaning and breakfast",
        basePrice: "100",
        priceUnit: "day",
        status: "active",
        metadata: {
          amenities: ["cleaning", "breakfast"],
          locations: ["Gombe", "Ngaliema"],
        },
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: logementCategory.id,
        nameFr: "Appartement T3",
        nameEn: "3-room apartment",
        descriptionFr: "Appartement 3 pièces avec ménage et petit déjeuner",
        descriptionEn: "3-room apartment with cleaning and breakfast",
        basePrice: "120",
        priceUnit: "day",
        status: "active",
        metadata: {
          amenities: ["cleaning", "breakfast"],
          locations: ["Gombe", "Ngaliema"],
        },
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: logementCategory.id,
        nameFr: "Villa",
        nameEn: "Villa",
        descriptionFr: "Villa spacieuse avec ménage et petit déjeuner",
        descriptionEn: "Spacious villa with cleaning and breakfast",
        basePrice: "160",
        priceUnit: "day",
        status: "active",
        metadata: {
          amenities: ["cleaning", "breakfast"],
          locations: ["Gombe", "Ngaliema"],
        },
      },
    ];

    const [studioService, , t3Service, villaService] = await db.insert(services).values(logementServices).returning();

    // Variantes pour Studio
    await db.insert(serviceVariants).values([
      {
        serviceId: studioService.id,
        nameFr: "Studio - Gombe Centre",
        nameEn: "Studio - Gombe Center",
        priceModifier: "80",
        metadata: {
          bedrooms: 1,
          bathrooms: 1,
          area: "35m²",
          floor: 3,
          location: "Gombe",
          address: "Avenue des Aviateurs",
          amenities: ["WiFi", "Climatisation", "Cuisine équipée", "Parking"],
          available: true,
        },
        sortOrder: 1,
      },
      {
        serviceId: studioService.id,
        nameFr: "Studio - Ngaliema",
        nameEn: "Studio - Ngaliema",
        priceModifier: "70",
        metadata: {
          bedrooms: 1,
          bathrooms: 1,
          area: "30m²",
          floor: 2,
          location: "Ngaliema",
          address: "Boulevard du 30 Juin",
          amenities: ["WiFi", "Climatisation", "Cuisine équipée"],
          available: true,
        },
        sortOrder: 2,
      },
    ]);

    // Variantes pour Appartement T3
    await db.insert(serviceVariants).values([
      {
        serviceId: t3Service.id,
        nameFr: "T3 Standing - Gombe",
        nameEn: "3BR Upscale - Gombe",
        priceModifier: "150",
        metadata: {
          bedrooms: 3,
          bathrooms: 2,
          area: "95m²",
          floor: 5,
          location: "Gombe",
          address: "Avenue Colonel Mondjiba",
          amenities: ["WiFi", "Climatisation", "Cuisine équipée", "Balcon", "Parking", "Gardien"],
          available: true,
        },
        sortOrder: 1,
      },
      {
        serviceId: t3Service.id,
        nameFr: "T3 Familial - Ngaliema",
        nameEn: "3BR Family - Ngaliema",
        priceModifier: "120",
        metadata: {
          bedrooms: 3,
          bathrooms: 2,
          area: "85m²",
          floor: 2,
          location: "Ngaliema",
          address: "Avenue Pumbu",
          amenities: ["WiFi", "Climatisation", "Cuisine équipée", "Jardin", "Parking"],
          available: true,
        },
        sortOrder: 2,
      },
      {
        serviceId: t3Service.id,
        nameFr: "T3 Vue Fleuve - Ma Campagne",
        nameEn: "3BR River View - Ma Campagne",
        priceModifier: "180",
        metadata: {
          bedrooms: 3,
          bathrooms: 2,
          area: "110m²",
          floor: 8,
          location: "Ma Campagne",
          address: "Boulevard du 30 Juin",
          amenities: [
            "WiFi",
            "Climatisation",
            "Cuisine équipée",
            "Vue fleuve",
            "Piscine commune",
            "Parking",
            "Sécurité 24/7",
          ],
          available: true,
        },
        sortOrder: 3,
      },
    ]);

    // Variantes pour Villa
    await db.insert(serviceVariants).values([
      {
        serviceId: villaService.id,
        nameFr: "Villa 3 chambres - Gombe",
        nameEn: "3BR Villa - Gombe",
        priceModifier: "180",
        metadata: {
          bedrooms: 3,
          bathrooms: 3,
          area: "200m²",
          landArea: "400m²",
          location: "Gombe",
          address: "Avenue Tombalbaye",
          amenities: [
            "WiFi",
            "Climatisation",
            "Cuisine équipée",
            "Jardin",
            "Terrasse",
            "Parking 2 voitures",
            "Gardien",
          ],
          available: true,
        },
        sortOrder: 1,
      },
      {
        serviceId: villaService.id,
        nameFr: "Villa 5 chambres - Ngaliema",
        nameEn: "5BR Villa - Ngaliema",
        priceModifier: "250",
        metadata: {
          bedrooms: 5,
          bathrooms: 4,
          area: "300m²",
          landArea: "600m²",
          location: "Ngaliema",
          address: "Avenue Kabambare",
          amenities: [
            "WiFi",
            "Climatisation",
            "Cuisine équipée",
            "Jardin",
            "Terrasse",
            "Garage 3 voitures",
            "Gardien",
            "Générateur",
          ],
          available: true,
        },
        sortOrder: 2,
      },
      {
        serviceId: villaService.id,
        nameFr: "Villa Premium avec Piscine - Binza",
        nameEn: "Premium Villa with Pool - Binza",
        priceModifier: "350",
        metadata: {
          bedrooms: 4,
          bathrooms: 4,
          area: "280m²",
          landArea: "800m²",
          location: "Binza",
          address: "Avenue Kabasele",
          amenities: [
            "WiFi",
            "Climatisation",
            "Cuisine équipée",
            "Piscine privée",
            "Jardin paysager",
            "Terrasse",
            "Garage 3 voitures",
            "Gardien 24/7",
            "Générateur",
            "Système d'alarme",
          ],
          available: true,
        },
        sortOrder: 3,
      },
      {
        serviceId: villaService.id,
        nameFr: "Villa de Luxe - Ma Campagne",
        nameEn: "Luxury Villa - Ma Campagne",
        priceModifier: "400",
        metadata: {
          bedrooms: 6,
          bathrooms: 5,
          area: "400m²",
          landArea: "1000m²",
          location: "Ma Campagne",
          address: "Boulevard du 30 Juin",
          amenities: [
            "WiFi fibre",
            "Climatisation centrale",
            "Cuisine équipée premium",
            "Piscine chauffée",
            "Jacuzzi",
            "Salle de sport",
            "Home cinema",
            "Jardin tropical",
            "Garage 4 voitures",
            "Personnel de maison",
            "Générateur",
            "Sécurité 24/7",
          ],
          available: true,
        },
        sortOrder: 4,
      },
    ]);

    console.log("✅ Housing services created");

    // ==========================================
    // 10. Services Personnel
    // ==========================================
    const personnelServices = [
      {
        vendorId: bridgeVendor.id,
        categoryId: personnelCategory.id,
        nameFr: "Bonne",
        nameEn: "Housekeeper",
        descriptionFr: "Personnel de maison qualifié",
        descriptionEn: "Qualified household staff",
        basePrice: "250",
        priceUnit: "month",
        status: "active",
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: personnelCategory.id,
        nameFr: "Nounou",
        nameEn: "Nanny",
        descriptionFr: "Nounou expérimentée pour enfants",
        descriptionEn: "Experienced nanny for children",
        basePrice: "300",
        priceUnit: "month",
        status: "active",
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: personnelCategory.id,
        nameFr: "Chauffeur personnel",
        nameEn: "Personal driver",
        descriptionFr: "Chauffeur personnel professionnel",
        descriptionEn: "Professional personal driver",
        basePrice: "400",
        priceUnit: "month",
        status: "active",
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: personnelCategory.id,
        nameFr: "Jardinier",
        nameEn: "Gardener",
        descriptionFr: "Service de jardinage professionnel",
        descriptionEn: "Professional gardening service",
        basePrice: "120",
        priceUnit: "month",
        status: "active",
      },
    ];

    await db.insert(services).values(personnelServices);
    console.log("✅ Household staff services created");

    // ==========================================
    // 11. Services divers
    // ==========================================
    const diversServices = [
      {
        vendorId: bridgeVendor.id,
        categoryId: servicesCategory.id,
        nameFr: "Dépannage",
        nameEn: "Emergency repair",
        descriptionFr: "Service de dépannage à domicile",
        descriptionEn: "Home emergency repair service",
        basePrice: "40",
        priceUnit: "hour",
        status: "active",
        metadata: { nightSurcharge: 1.5 },
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: servicesCategory.id,
        nameFr: "Médecin à domicile",
        nameEn: "Home doctor",
        descriptionFr: "Consultation médicale à domicile",
        descriptionEn: "Home medical consultation",
        basePrice: "50",
        priceUnit: "unit",
        status: "active",
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: servicesCategory.id,
        nameFr: "Adhésion médecin",
        nameEn: "Doctor membership",
        descriptionFr: "Adhésion mensuelle pour consultations illimitées",
        descriptionEn: "Monthly membership for unlimited consultations",
        basePrice: "20",
        priceUnit: "month",
        status: "active",
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: servicesCategory.id,
        nameFr: "Création de société",
        nameEn: "Company creation",
        descriptionFr: "Assistance à la création d'entreprise",
        descriptionEn: "Business creation assistance",
        basePrice: "800",
        priceUnit: "unit",
        status: "active",
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: servicesCategory.id,
        nameFr: "Suivi de chantier",
        nameEn: "Construction monitoring",
        descriptionFr: "Suivi mensuel de travaux de construction",
        descriptionEn: "Monthly construction work monitoring",
        basePrice: "300",
        priceUnit: "month",
        status: "active",
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: servicesCategory.id,
        nameFr: "Visa et papiers",
        nameEn: "Visa and documents",
        descriptionFr: "Assistance pour visas et documents administratifs",
        descriptionEn: "Assistance for visas and administrative documents",
        basePrice: "150",
        priceUnit: "unit",
        status: "active",
      },
    ];

    await db.insert(services).values(diversServices);
    console.log("✅ Miscellaneous services created");

    // ==========================================
    // 12. Services Conciergerie
    // ==========================================
    const conciergerieServices = [
      {
        vendorId: bridgeVendor.id,
        categoryId: conciergerieCategory.id,
        nameFr: "Achats et courses",
        nameEn: "Shopping and errands",
        descriptionFr: "Service d'achats avec commission de 15%",
        descriptionEn: "Shopping service with 15% commission",
        basePrice: "0",
        priceUnit: "unit",
        status: "active",
        metadata: { commissionRate: 0.15 },
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: conciergerieCategory.id,
        nameFr: "Livraison",
        nameEn: "Delivery",
        descriptionFr: "Service de livraison à Kinshasa",
        descriptionEn: "Delivery service in Kinshasa",
        basePrice: "20",
        priceUnit: "unit",
        status: "active",
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: conciergerieCategory.id,
        nameFr: "Gestion locative",
        nameEn: "Property management",
        descriptionFr: "Gestion de propriété avec commission de 10%",
        descriptionEn: "Property management with 10% commission",
        basePrice: "0",
        priceUnit: "month",
        status: "active",
        metadata: { commissionRate: 0.1 },
      },
      {
        vendorId: bridgeVendor.id,
        categoryId: conciergerieCategory.id,
        nameFr: "Transfert d'argent",
        nameEn: "Money transfer",
        descriptionFr: "Service de transfert d'argent (3% min 10$)",
        descriptionEn: "Money transfer service (3% min $10)",
        basePrice: "10",
        priceUnit: "unit",
        status: "active",
        metadata: { commissionRate: 0.03, minimumFee: 10 },
      },
    ];

    await db.insert(services).values(conciergerieServices);
    console.log("✅ Concierge services created");

    // ==========================================
    // 13. Créer ressources
    // ==========================================
    const resourcesData = [
      // Chauffeurs
      {
        vendorId: bridgeVendor.id,
        type: "driver",
        name: "Jean Mukendi",
        status: "available",
        metadata: { phone: "+243900000001", experience: "5 ans" },
      },
      {
        vendorId: bridgeVendor.id,
        type: "driver",
        name: "Pierre Kabongo",
        status: "available",
        metadata: { phone: "+243900000002", experience: "8 ans" },
      },
      {
        vendorId: bridgeVendor.id,
        type: "driver",
        name: "Joseph Tshisekedi",
        status: "available",
        metadata: { phone: "+243900000003", experience: "3 ans" },
      },
      // Véhicules
      {
        vendorId: bridgeVendor.id,
        type: "vehicle",
        name: "Sedan - CGO-001",
        status: "available",
        metadata: { plate: "CGO-001", model: "Toyota Corolla", year: 2020 },
      },
      {
        vendorId: bridgeVendor.id,
        type: "vehicle",
        name: "RAV4 - CGO-002",
        status: "available",
        metadata: { plate: "CGO-002", model: "Toyota RAV4", year: 2021 },
      },
      {
        vendorId: bridgeVendor.id,
        type: "vehicle",
        name: "RAV4 - CGO-003",
        status: "available",
        metadata: { plate: "CGO-003", model: "Toyota RAV4", year: 2021 },
      },
      {
        vendorId: bridgeVendor.id,
        type: "vehicle",
        name: "Prado - CGO-004",
        status: "available",
        metadata: { plate: "CGO-004", model: "Toyota Prado", year: 2022 },
      },
      {
        vendorId: bridgeVendor.id,
        type: "vehicle",
        name: "Van - CGO-005",
        status: "available",
        metadata: {
          plate: "CGO-005",
          model: "Toyota Hiace",
          year: 2020,
          seats: 12,
        },
      },
      // Personnel
      {
        vendorId: bridgeVendor.id,
        type: "staff",
        name: "Marie Kalala (Bonne)",
        status: "available",
        metadata: {
          phone: "+243900000010",
          type: "housekeeper",
          experience: "4 ans",
        },
      },
      {
        vendorId: bridgeVendor.id,
        type: "staff",
        name: "Grace Mbuyi (Nounou)",
        status: "available",
        metadata: {
          phone: "+243900000011",
          type: "nanny",
          experience: "6 ans",
        },
      },
    ];

    await db.insert(resources).values(resourcesData);
    console.log("✅ Resources created");

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📋 Comptes créés:");
    console.log("   - rootuser@bridge.com (ROOT User) - super-user");
    console.log("   - admin@bridge-guichet.com (BRIDGE Admin)");
    console.log("   - manager@bridge.com (BRIDGE Manager)");
    console.log("   - operator@bridge.com (BRIDGE Operator)");
    console.log(`\n🔑 Mot de passe pour tous: ${DEFAULT_PASSWORD}`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
};

seedData()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
