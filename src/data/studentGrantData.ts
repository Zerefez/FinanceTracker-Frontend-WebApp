/**
 * Default grant amounts based on housing status
 */
export const DEFAULT_GRANT_AMOUNTS = {
  LIVING_AWAY: 7086,
  LIVING_WITH_PARENTS: 3029
};

/**
 * Tax rates for different tax cards
 */
export const TAX_RATES = {
  MAIN_CARD: 0.148, // 14.8% for main tax card
  SECONDARY_CARD: 0.195 // 19.5% for secondary card
};

/**
 * Income ceiling for students
 */
export const INCOME_CEILING = 247976;

/**
 * Maximum earnable amount
 */
export const MAX_EARNABLE = 228138;

/**
 * Month names in English
 */
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 
  'May', 'June', 'July', 'August', 
  'September', 'October', 'November', 'December'
];

/**
 * Housing status options
 */
export const HOUSING_STATUS = {
  AWAY: {
    value: 'away',
    label: 'Living Away'
  },
  WITH_PARENTS: {
    value: 'with',
    label: 'Living With Parents'
  }
};

/**
 * Tax card options
 */
export const TAX_CARD_OPTIONS = {
  MAIN: {
    value: 'main',
    label: 'Main Card'
  },
  SECONDARY: {
    value: 'secondary',
    label: 'Secondary Card'
  }
};

/**
 * Person status options
 */
export const PERSON_STATUS = {
  NOT_PARENT_DEPENDENT: 'Not Parent-Dependent'
};

/**
 * Grant status options
 */
export const GRANT_STATUS = {
  NORMAL: 'Normal Grant'
};

/**
 * Available years for the student grant
 */
export const AVAILABLE_YEARS = ['2025', '2024', '2023']; 