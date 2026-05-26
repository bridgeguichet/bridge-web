import { db } from "../src/lib/db";
import { serviceVariants } from "../src/lib/db/schema";

async function addVariants() {
  try {
    console.log("🌱 Adding service variants...");

    // Variants pour "Voiture avec chauffeur" (ID: c6c93104-5b4f-4b8a-8bb6-5b9abb1608d9)
    const voitureId = "c6c93104-5b4f-4b8a-8bb6-5b9abb1608d9";

    await db.insert(serviceVariants).values([
      {
        serviceId: voitureId,
        nameFr: "Berline économique",
        nameEn: "Economy Sedan",
        priceModifier: "45.00",
        metadata: {
          capacity: 4,
          luggage: 2,
          features: ["Climatisation", "GPS", "Bluetooth"],
        },
        sortOrder: 1,
      },
      {
        serviceId: voitureId,
        nameFr: "SUV familial",
        nameEn: "Family SUV",
        priceModifier: "75.00",
        metadata: {
          capacity: 7,
          luggage: 4,
          features: ["Climatisation", "GPS", "Bluetooth", "Caméra de recul"],
        },
        sortOrder: 2,
      },
      {
        serviceId: voitureId,
        nameFr: "Voiture de luxe",
        nameEn: "Luxury Car",
        priceModifier: "120.00",
        metadata: {
          capacity: 4,
          luggage: 3,
          features: ["Climatisation", "GPS", "Bluetooth", "Sièges cuir", "Toit ouvrant"],
        },
        sortOrder: 3,
      },
    ]);

    console.log(`✅ Added 3 variants for Voiture avec chauffeur`);

    // Variants pour "Studio" (ID: 8b03d1e3-989a-4c52-82d0-cfadfe0d4952)
    const studioId = "8b03d1e3-989a-4c52-82d0-cfadfe0d4952";

    await db.insert(serviceVariants).values([
      {
        serviceId: studioId,
        nameFr: "Studio 25m²",
        nameEn: "Studio 25m²",
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
      },
      {
        serviceId: studioId,
        nameFr: "Studio 35m²",
        nameEn: "Studio 35m²",
        priceModifier: "450.00",
        metadata: {
          bedrooms: 0,
          bathrooms: 1,
          area: "35m²",
          capacity: 2,
          amenities: ["WiFi", "Cuisine équipée", "Climatisation", "Balcon"],
          features: ["Meublé", "Charges incluses", "Parking"],
        },
        sortOrder: 2,
      },
    ]);

    console.log(`✅ Added 2 variants for Studio`);

    // Variants pour "Appartement T2" (ID: 90a37a8c-2f92-40ad-9e4e-7d908c44c877)
    const t2Id = "90a37a8c-2f92-40ad-9e4e-7d908c44c877";

    await db.insert(serviceVariants).values([
      {
        serviceId: t2Id,
        nameFr: "T2 45m²",
        nameEn: "1-Bedroom 45m²",
        priceModifier: "550.00",
        metadata: {
          bedrooms: 1,
          bathrooms: 1,
          area: "45m²",
          capacity: 3,
          amenities: ["WiFi", "Cuisine équipée", "Climatisation", "Balcon"],
          features: ["Meublé", "Charges incluses", "Parking"],
        },
        sortOrder: 1,
      },
      {
        serviceId: t2Id,
        nameFr: "T2 55m²",
        nameEn: "1-Bedroom 55m²",
        priceModifier: "650.00",
        metadata: {
          bedrooms: 1,
          bathrooms: 1,
          area: "55m²",
          capacity: 3,
          amenities: ["WiFi", "Cuisine équipée", "Climatisation", "Balcon", "Lave-linge"],
          features: ["Meublé", "Charges incluses", "Parking", "Ascenseur"],
        },
        sortOrder: 2,
      },
    ]);

    console.log(`✅ Added 2 variants for Appartement T2`);

    console.log("✨ All variants added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding variants:", error);
    process.exit(1);
  }
}

addVariants();
