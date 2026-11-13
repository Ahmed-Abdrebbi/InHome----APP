// File: src/core/api/mocks/aiMock.js
import { SERVICE_CATEGORIES } from '../../config/categories';

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiMock = {
  async matchService(query = '') {
    await delay(450);
    const q = query.toLowerCase();

    // Mapping sémantique Darija / Français
    let matchedId = 'autre';
    if (q.includes('fuite') || q.includes('eau') || q.includes('robinet') || q.includes('robini') || q.includes('ma')) {
      matchedId = 'plomberie';
    } else if (q.includes('courant') || q.includes('lumiere') || q.includes('dow') || q.includes('prise') || q.includes('disjoncteur')) {
      matchedId = 'electricite';
    } else if (q.includes('peint') || q.includes('sbayghi') || q.includes('mur') || q.includes('7it')) {
      matchedId = 'peinture';
    } else if (q.includes('menage') || q.includes('khdama') || q.includes('neta') || q.includes('prop')) {
      matchedId = 'menage';
    } else if (q.includes('clim') || q.includes('froid') || q.includes('sokhon')) {
      matchedId = 'climatisation';
    } else if (q.includes('meuble') || q.includes('carton') || q.includes('r7il') || q.includes('deplace')) {
      matchedId = 'demenagement';
    } else if (q.includes('serrure') || q.includes('bab') || q.includes('porte') || q.includes('sarout')) {
      matchedId = 'menuiserie';
    }

    const category = SERVICE_CATEGORIES.find((c) => c.id === matchedId) || SERVICE_CATEGORIES[0];

    return {
      category,
      confidence: 0.94,
      suggestedPriceMin: Math.round(category.suggestedPrice * 0.8),
      suggestedPriceMax: Math.round(category.suggestedPrice * 1.3),
      explanation: `D'après votre description, il s'agit d'une intervention en ${category.name}.`,
    };
  },

  /**
   * Simule un streaming chunk par chunk comme le futur endpoint backend
   */
  async streamChat(userMessage, onChunk) {
    await delay(300);
    const fullReply = `Salam! D'après ce que vous m'expliquez ("${userMessage}"), voici mes recommandations :
1. Métier recommandé : Plomberie / Dépannage rapide.
2. Tarif estimé à Casablanca : entre 80 DH et 150 DH selon la pièce de rechange.
3. Astuce de sécurité : Coupez l'arrivée d'eau générale avant l'arrivée de l'artisan.

Voulez-vous que je pré-remplisse votre demande pour trouver un artisan maintenant ?`;

    const words = fullReply.split(' ');
    let accumulated = '';

    for (let i = 0; i < words.length; i++) {
      accumulated += (i > 0 ? ' ' : '') + words[i];
      if (onChunk) {
        onChunk(accumulated);
      }
      await delay(40);
    }

    return accumulated;
  },
};
