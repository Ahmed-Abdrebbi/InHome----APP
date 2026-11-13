// File: src/core/i18n/index.js
import fr from './fr';
import ar from './ar';

const dictionaries = {
  fr,
  ar,
};

let currentLanguage = 'fr';

export const setLanguage = (lang) => {
  if (dictionaries[lang]) {
    currentLanguage = lang;
  }
};

export const getLanguage = () => currentLanguage;

/**
 * Traduit une clé donnée. Exemple: t('common.confirm')
 * Supporte le remplacement simple: t('booking.radar.offersCount', 3) -> "3 offres reçues"
 */
export const t = (key, ...args) => {
  const dict = dictionaries[currentLanguage] || dictionaries.fr;
  let text = dict[key] || fr[key] || key;

  if (args.length > 0) {
    args.forEach((arg) => {
      text = text.replace('%s', arg);
    });
  }

  return text;
};

export default t;
