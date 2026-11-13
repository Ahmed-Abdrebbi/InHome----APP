// File: src/core/utils/formatPrice.js
import { CURRENCY } from '../config/constants';

/**
 * Formate un montant en Dirhams marocains: "DH 80"
 * @param {number|string} amount
 * @returns {string}
 */
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `${CURRENCY.SYMBOL} 0`;
  }
  const numeric = Math.round(Number(amount));
  return `${CURRENCY.SYMBOL} ${numeric}`;
};

export default formatPrice;
