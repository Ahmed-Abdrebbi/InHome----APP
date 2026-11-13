// File: src/core/theme/themes/majorelle.js
/**
 * Thème Majorelle Night (Inspiré des nuits de Marrakech, bleu Majorelle et safran)
 */
export const majorelleTheme = {
  id: 'majorelle',
  name: 'Majorelle Night',

  // Semantic surfaces & backgrounds
  background: '#0A1230',
  surface: '#141F4A',
  surfaceElevated: '#1B2A63',
  sheet: '#101A3F',

  // Text
  textPrimary: '#F4F6FF',
  textSecondary: '#A9B2D6',
  textDisabled: '#6B77A8',

  // Borders & Dividers
  border: '#2A386F',
  borderSubtle: '#1C2754',

  // Brand & Action
  brand: '#3949F0',
  accent: '#FFB300', // Safran
  onAccent: '#0A1230', // Contraste sur le safran
  accentSubtle: '#2A2410',

  // Status
  success: '#19C3B1',
  danger: '#FF5C5C',
  warning: '#FFB300',
  info: '#38BDF8',

  // Map
  mapBase: '#070D24',
  mapNavy: '#0F1A3D',

  // Métiers / Trade colors
  tradeColors: {
    plomberie: '#19C3B1',
    electricite: '#FFB300',
    peinture: '#FF6B6B',
    menage: '#4CC9F0',
    demenagement: '#FF8A3D',
    climatisation: '#7BD3FF',
    menuiserie: '#D4A373',
    jardinage: '#06D6A0',
    autre: '#9381FF',
  },
};

export default majorelleTheme;
