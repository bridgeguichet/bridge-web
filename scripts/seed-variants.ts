import { db } from "../src/lib/db";
import { serviceVariants, services } from "../src/lib/db/schema";
import { eq, like } from "drizzle-orm";

async function seedVariants() {
  try {
    console.log("🌱 Seeding service variants...");

    // Trouver les services de mobilité (location de voiture)
    const mobilityServices = await db.select().from(services).where(like(services.nameFr, "%location%voiture%"));

    console.log(`Found ${mobilityServices.length} mobility services`);

    for (const service of mobilityServices) {
      console.log(`Adding variants for: ${service.nameFr}`);

      // Variante: Berline économique
      await db.insert(serviceVariants).values({
        serviceId: service.id,
        nameFr: "Berline économique",
        nameEn: "Economy Sedan",
        priceModifier: "45.00",
        metadata: {
          capacity: 4,
          luggage: 2,
          features: ["Climatisation", "GPS", "Bluetooth"],
        },
        sortOrder: 1,
      });

      // Variante: SUV familial
      await db.insert(serviceVariants).values({
        serviceId: service.id,
        nameFr: "SUV familial",
        nameEn: "Family SUV",
        priceModifier: "75.00",
        metadata: {
          capacity: 7,
          luggage: 4,
          features: ["Climatisation", "GPS", "Bluetooth", "Caméra de recul"],
        },
        sortOrder: 2,
      });

      // Variante: Voiture de luxe
      await db.insert(serviceVariants).values({
        serviceId: service.id,
        nameFr: "Voiture de luxe",
        nameEn: "Luxury Car",
        priceModifier: "120.00",
        metadata: {
          capacity: 4,
          luggage: 3,
          features: ["Climatisation", "GPS", "Bluetooth", "Sièges cuir", "Toit ouvrant"],
        },
        sortOrder: 3,
      });

      console.log(`✅ Added 3 variants for ${service.nameFr}`);
    }

    // Trouver les services de logement
    const housingServices = await db.select().from(services).where(like(services.nameFr, "%logement%"));

    console.log(`Found ${housingServices.length} housing services`);

    for (const service of housingServices) {
      console.log(`Adding variants for: ${service.nameFr}`);

      // Variante: Studio
      await db.insert(serviceVariants).values({
        serviceId: service.id,
        nameFr: "Studio",
        nameEn: "Studio",
        priceModifier: "350.00",
        metadata: {
          bedrooms: 0,
          bathrooms: 1,
          area: "25m²",
          capacity: 2,
          amenities: ["WiFi", "Cuisine équipée", "Climatisation"],
          features: ["Meublé", "Charges incluses"],
        },
        sortOrder: 1,
      });

      // Variante: Appartement 2 pièces
      await db.insert(serviceVariants).values({
        serviceId: service.id,
        nameFr: "Appartement 2 pièces",
        nameEn: "1-Bedroom Apartment",
        priceModifier: "550.00",
        metadata: {
          bedrooms: 1,
          bathrooms: 1,
          area: "45m²",
          capacity: 3,
          amenities: ["WiFi", "Cuisine équipée", "Climatisation", "Balcon"],
          features: ["Meublé", "Charges incluses", "Parking"],
        },
        sortOrder: 2,
      });

      // Variante: Appartement 3 pièces
      await db.insert(serviceVariants).values({
        serviceId: service.id,
        nameFr: "Appartement 3 pièces",
        nameEn: "2-Bedroom Apartment",
        priceModifier: "750.00",
        metadata: {
          bedrooms: 2,
          bathrooms: 1,
          area: "65m²",
          capacity: 4,
          amenities: ["WiFi", "Cuisine équipée", "Climatisation", "Balcon", "Lave-linge"],
          features: ["Meublé", "Charges incluses", "Parking", "Ascenseur"],
        },
        sortOrder: 3,
      });

      console.log(`✅ Added 3 variants for ${service.nameFr}`);
    }

    console.log("✨ Seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding variants:", error);
    process.exit(1);
  }
}

seedVariants();
