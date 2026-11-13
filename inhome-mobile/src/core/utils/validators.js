// File: src/core/utils/validators.js
/**
 * Validation des numéros de téléphone marocains:
 * Formats acceptés:
 * - 0612345678, 0712345678, 0512345678
 * - +212612345678, +212712345678
 * - 212612345678
 */
export const isValidMoroccanPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s.-]/g, '');
  const moroccanPhoneRegex = /^(?:\+212|212|0)([5-7]\d{8})$/;
  return moroccanPhoneRegex.test(cleaned);
};

export const normalizeMoroccanPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s.-]/g, '');
  if (cleaned.startsWith('0')) {
    return `+212${cleaned.substring(1)}`;
  }
  if (cleaned.startsWith('212')) {
    return `+${cleaned}`;
  }
  return cleaned;
};

export const isValidPassword = (password) => {
  return typeof password === 'string' && password.trim().length >= 6;
};

export const isValidPrice = (price) => {
  const p = Number(price);
  return !isNaN(p) && p >= 20 && p <= 10000;
};
