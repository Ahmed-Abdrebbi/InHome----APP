// File: src/core/config/categories.js
/**
 * Liste des métiers et catégories de services artisanaux au Maroc
 */
export const SERVICE_CATEGORIES = [
  {
    id: 'plomberie',
    name: 'Plomberie',
    icon: 'Wrench',
    tradeColorKey: 'plomberie',
    description: 'Fuites d’eau, chauffe-eau, débouchage, robinetterie',
    suggestedPrice: 100,
    tags: ['robinet', 'fuite', 'chauffe-eau', 'évier', 'toilettes', 'plombier'],
  },
  {
    id: 'electricite',
    name: 'Électricité',
    icon: 'Zap',
    tradeColorKey: 'electricite',
    description: 'Court-circuit, prises, disjoncteur, éclairage',
    suggestedPrice: 120,
    tags: ['court-circuit', 'prise', 'compteur', 'lumière', 'électricien'],
  },
  {
    id: 'peinture',
    name: 'Peinture',
    icon: 'Paintbrush',
    tradeColorKey: 'peinture',
    description: 'Peinture intérieure, rafraîchissement, enduit',
    suggestedPrice: 200,
    tags: ['mur', 'façade', 'plafond', 'retouche', 'peintre'],
  },
  {
    id: 'menage',
    name: 'Ménage',
    icon: 'Sparkles',
    tradeColorKey: 'menage',
    description: 'Nettoyage complet, vitres, après-travaux',
    suggestedPrice: 150,
    tags: ['nettoyage', 'vitres', 'grand ménage', 'femme de ménage'],
  },
  {
    id: 'demenagement',
    name: 'Déménagement',
    icon: 'Truck',
    tradeColorKey: 'demenagement',
    description: 'Transport de meubles, cartons, aide au portage',
    suggestedPrice: 350,
    tags: ['transport', 'meubles', 'camion', 'déménageur'],
  },
  {
    id: 'climatisation',
    name: 'Climatisation',
    icon: 'Wind',
    tradeColorKey: 'climatisation',
    description: 'Installation, recharge gaz, entretien annuel',
    suggestedPrice: 180,
    tags: ['clim', 'recharge', 'gaz', 'froid', 'chaleur'],
  },
  {
    id: 'menuiserie',
    name: 'Menuiserie',
    icon: 'Hammer',
    tradeColorKey: 'menuiserie',
    description: 'Portes, serrures, placards, montage meubles',
    suggestedPrice: 130,
    tags: ['serrure', 'porte', 'bois', 'placard', 'ikea', 'menuisier'],
  },
  {
    id: 'jardinage',
    name: 'Jardinage',
    icon: 'Flower2',
    tradeColorKey: 'jardinage',
    description: 'Taille, tonte de pelouse, arrosage, plantation',
    suggestedPrice: 140,
    tags: ['jardin', 'plante', 'gazon', 'taille', 'jardinier'],
  },
  {
    id: 'autre',
    name: 'Autre dépannage',
    icon: 'Settings',
    tradeColorKey: 'autre',
    description: 'Bricolage divers et réparations à domicile',
    suggestedPrice: 80,
    tags: ['bricolage', 'fixation', 'divers'],
  },
];

export const getCategoryById = (id) =>
  SERVICE_CATEGORIES.find((cat) => cat.id === id) || SERVICE_CATEGORIES[SERVICE_CATEGORIES.length - 1];
