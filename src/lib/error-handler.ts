import { AxiosError } from "axios";

interface ApiErrorResponse {
  error?: string;
  message?: string;
  detail?: string | string[];
  [key: string]: unknown;
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data) {
      // Si detail est un tableau, joindre les messages
      if (Array.isArray(data.detail)) {
        return data.detail.join(" ");
      }

      // Si detail est une chaîne
      if (typeof data.detail === "string") {
        return data.detail;
      }

      // Sinon utiliser message ou error
      if (data.message) {
        return data.message;
      }

      if (data.error) {
        return data.error;
      }
    }

    // Message par défaut basé sur le status
    if (error.response?.status === 400) {
      return "Données invalides";
    }
    if (error.response?.status === 401) {
      return "Non autorisé";
    }
    if (error.response?.status === 403) {
      return "Accès interdit";
    }
    if (error.response?.status === 404) {
      return "Ressource introuvable";
    }
    if (error.response?.status === 500) {
      return "Erreur serveur";
    }

    return error.message || "Une erreur est survenue";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur est survenue";
}
