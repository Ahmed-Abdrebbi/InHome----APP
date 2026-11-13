// File: src/core/api/errors.js
/**
 * Normalisation standard des erreurs HTTP / Réseau
 */
export class ApiError extends Error {
  constructor(message, status = 500, fields = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

export const normalizeError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    const message =
      (data && (data.error || data.message)) ||
      `Erreur serveur (${status})`;
    const fields = data && data.fields ? data.fields : null;

    return new ApiError(message, status, fields);
  }

  if (error.request) {
    return new ApiError(
      'Impossible de contacter le serveur InHome. Vérifiez votre connexion Internet.',
      0
    );
  }

  return new ApiError(error.message || 'Une erreur inattendue est survenue.', 500);
};
