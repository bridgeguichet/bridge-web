-- Script pour ajouter des variants aux services de mobilité et logement
-- À exécuter après avoir identifié les IDs des services

-- Exemple pour un service de location de voiture (remplacer 'SERVICE_ID' par l'ID réel)
-- Variante: Berline économique
INSERT INTO service_variants (service_id, name_fr, name_en, price_modifier, metadata, sort_order)
VALUES (
  'SERVICE_ID_VOITURE',
  'Berline économique',
  'Economy Sedan',
  '45.00',
  '{"capacity": 4, "luggage": 2, "features": ["Climatisation", "GPS", "Bluetooth"]}'::jsonb,
  1
);

-- Variante: SUV familial
INSERT INTO service_variants (service_id, name_fr, name_en, price_modifier, metadata, sort_order)
VALUES (
  'SERVICE_ID_VOITURE',
  'SUV familial',
  'Family SUV',
  '75.00',
  '{"capacity": 7, "luggage": 4, "features": ["Climatisation", "GPS", "Bluetooth", "Caméra de recul"]}'::jsonb,
  2
);

-- Variante: Voiture de luxe
INSERT INTO service_variants (service_id, name_fr, name_en, price_modifier, metadata, sort_order)
VALUES (
  'SERVICE_ID_VOITURE',
  'Voiture de luxe',
  'Luxury Car',
  '120.00',
  '{"capacity": 4, "luggage": 3, "features": ["Climatisation", "GPS", "Bluetooth", "Sièges cuir", "Toit ouvrant"]}'::jsonb,
  3
);

-- Exemple pour un service de logement (remplacer 'SERVICE_ID' par l'ID réel)
-- Variante: Studio
INSERT INTO service_variants (service_id, name_fr, name_en, price_modifier, metadata, sort_order)
VALUES (
  'SERVICE_ID_LOGEMENT',
  'Studio',
  'Studio',
  '350.00',
  '{"bedrooms": 0, "bathrooms": 1, "area": "25m²", "capacity": 2, "amenities": ["WiFi", "Cuisine équipée", "Climatisation"], "features": ["Meublé", "Charges incluses"]}'::jsonb,
  1
);

-- Variante: Appartement 2 pièces
INSERT INTO service_variants (service_id, name_fr, name_en, price_modifier, metadata, sort_order)
VALUES (
  'SERVICE_ID_LOGEMENT',
  'Appartement 2 pièces',
  '1-Bedroom Apartment',
  '550.00',
  '{"bedrooms": 1, "bathrooms": 1, "area": "45m²", "capacity": 3, "amenities": ["WiFi", "Cuisine équipée", "Climatisation", "Balcon"], "features": ["Meublé", "Charges incluses", "Parking"]}'::jsonb,
  2
);

-- Variante: Appartement 3 pièces
INSERT INTO service_variants (service_id, name_fr, name_en, price_modifier, metadata, sort_order)
VALUES (
  'SERVICE_ID_LOGEMENT',
  'Appartement 3 pièces',
  '2-Bedroom Apartment',
  '750.00',
  '{"bedrooms": 2, "bathrooms": 1, "area": "65m²", "capacity": 4, "amenities": ["WiFi", "Cuisine équipée", "Climatisation", "Balcon", "Lave-linge"], "features": ["Meublé", "Charges incluses", "Parking", "Ascenseur"]}'::jsonb,
  3
);

-- Pour trouver les IDs des services, exécutez d'abord:
-- SELECT id, name_fr, category_id FROM services WHERE name_fr LIKE '%location%' OR name_fr LIKE '%logement%';
