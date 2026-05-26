/**
 * Helpers pour les transformations Cloudinary
 * Permet d'optimiser les images avec resize, format webp, quality auto
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit" | "thumb" | "scale";
  quality?: number | "auto";
  format?: "webp" | "jpg" | "png" | "auto";
  gravity?: "auto" | "center" | "face" | "faces";
}

/**
 * Génère une URL Cloudinary optimisée avec transformations
 * Si l'URL n'est pas une URL Cloudinary, retourne l'URL originale
 */
export function getOptimizedImageUrl(
  imageUrl: string | null | undefined,
  options: CloudinaryTransformOptions = {},
): string | null {
  if (!imageUrl) return null;

  // Si ce n'est pas une URL Cloudinary, retourner telle quelle
  if (!imageUrl.includes("cloudinary.com")) {
    return imageUrl;
  }

  const { width, height, crop = "fill", quality = "auto", format = "webp", gravity = "auto" } = options;

  // Extraire les composants de l'URL Cloudinary
  // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{extension}
  const urlParts = imageUrl.split("/upload/");
  if (urlParts.length !== 2) return imageUrl;

  const [baseUrl, imagePath] = urlParts;

  // Construire la chaîne de transformation
  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity) transformations.push(`g_${gravity}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

  const transformString = transformations.join(",");

  // Reconstruire l'URL avec les transformations
  return `${baseUrl}/upload/${transformString}/${imagePath}`;
}

/**
 * Alias pour les vignettes (thumbnails) - utilisé dans les listes
 */
export function getThumbnailUrl(imageUrl: string | null | undefined, width = 200, height = 200): string | null {
  return getOptimizedImageUrl(imageUrl, {
    width,
    height,
    crop: "thumb",
    gravity: "auto",
  });
}

/**
 * Alias pour les images moyennes - utilisé dans les cartes
 */
export function getCardImageUrl(imageUrl: string | null | undefined, width = 600, height = 400): string | null {
  return getOptimizedImageUrl(imageUrl, {
    width,
    height,
    crop: "fill",
    gravity: "auto",
  });
}

/**
 * Alias pour les images hero/large - utilisé dans les pages détail
 */
export function getHeroImageUrl(imageUrl: string | null | undefined, width = 1200, height = 600): string | null {
  return getOptimizedImageUrl(imageUrl, {
    width,
    height,
    crop: "fill",
    gravity: "auto",
  });
}
