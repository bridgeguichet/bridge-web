import { config } from "dotenv";

config();

import { db } from "./index";
import {
  accounts,
  categories,
  resources,
  serviceVariants,
  services,
  subcategories,
  users,
  vendors,
} from "./schema";

const seedData = async () => {
  console.log("🌱 Seeding database...");

  try {
    // 1. Créer utilisateur admin BRIDGE
    const [adminUser] = await db
      .insert(users)
      .values({
        email: "admin@bridge-guichet.com",
        name: "BRIDGE Admin",
        emailVerified: true,
        role: "admin",
        phone: "+243000000000",
      })
      .returning();

    console.log("✅ Admin user created");

    // 1b. Créer account email/password pour admin
    // Note: Le mot de passe sera défini lors du premier login via Better Auth
    await db.insert(accounts).values({
      userId: adminUser.id,
      accountId: adminUser.email,
      providerId: "credential",
      password: null, // Sera défini lors de l'inscription
    });

    console.log("✅ Admin account created");

    // 2. Créer vendor BRIDGE
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

    console.log("✅ BRIDGE vendor created");

    // 3. Créer catégories
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

    const createdCategories = await db
      .insert(categories)
      .values(categoriesData)
      .returning();
    console.log("✅ Categories created");

    const mobiliteCategory = createdCategories.find(
      (c) => c.slug === "mobilite",
    )!;
    const logementCategory = createdCategories.find(
      (c) => c.slug === "logement",
    )!;
    const personnelCategory = createdCategories.find(
      (c) => c.slug === "personnel",
    )!;
    const servicesCategory = createdCategories.find(
      (c) => c.slug === "services",
    )!;
    const conciergerieCategory = createdCategories.find(
      (c) => c.slug === "conciergerie",
    )!;

    // 4. Services Mobilité
    const mobiliteServices = [
      {
        vendorId: bridgeVendor.id,
        categoryId: mobiliteCategory.id,
        nameFr: "Voiture avec chauffeur",
        nameEn: "Car with driver",
        descriptionFr:
          "Service de voiture avec chauffeur professionnel à Kinshasa",
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

    const [voitureService, transfertService] = await db
      .insert(services)
      .values(mobiliteServices)
      .returning();

    // Variants pour voiture avec chauffeur
    await db.insert(serviceVariants).values([
      {
        serviceId: voitureService.id,
        nameFr: "Sedan",
        nameEn: "Sedan",
        priceModifier: "50",
        sortOrder: 1,
      },
      {
        serviceId: voitureService.id,
        nameFr: "RAV4",
        nameEn: "RAV4",
        priceModifier: "100",
        sortOrder: 2,
      },
      {
        serviceId: voitureService.id,
        nameFr: "Prado",
        nameEn: "Prado",
        priceModifier: "150",
        sortOrder: 3,
      },
      {
        serviceId: voitureService.id,
        nameFr: "Van 12 places",
        nameEn: "12-seat Van",
        priceModifier: "200",
        sortOrder: 4,
      },
    ]);

    // Variants pour transfert aéroport
    await db.insert(serviceVariants).values([
      {
        serviceId: transfertService.id,
        nameFr: "Aller simple",
        nameEn: "One way",
        priceModifier: "60",
        sortOrder: 1,
      },
      {
        serviceId: transfertService.id,
        nameFr: "Aller-retour",
        nameEn: "Round trip",
        priceModifier: "100",
        sortOrder: 2,
      },
    ]);

    console.log("✅ Mobility services created");

    // 5. Services Logement
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

    await db.insert(services).values(logementServices);
    console.log("✅ Housing services created");

    // 6. Services Personnel
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

    // 7. Services divers
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

    // 8. Services Conciergerie
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

    // 9. Créer ressources exemple
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

    console.log("🎉 Database seeded successfully!");
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
