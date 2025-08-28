export const APP_CONFIG = {
  PAYMENT: {
    APPLICATION_FEE: 50,
    CURRENCY: 'BDT',
  },
  
  APP: {
    NAME: 'United Forum Organisation',
    PROGRAM_NAME: 'নিরাপদ শৌচাগার কর্মসূচি',
    PROGRAM_NAME_EN: 'Safe Toilet Program',
  },
  
  FORM: {
    MAX_FAMILY_MEMBERS: 50,
    MAX_CHILDREN_COUNT: 15,
    MAX_LAND_AMOUNT: 1000,
  }
} as const;

export const getApplicationFee = () => APP_CONFIG.PAYMENT.APPLICATION_FEE;
export const getApplicationFeeText = () => `${APP_CONFIG.PAYMENT.APPLICATION_FEE} টাকা`;
export const getApplicationFeeWithCurrency = () => `৳${APP_CONFIG.PAYMENT.APPLICATION_FEE}`;

export type AppConfig = typeof APP_CONFIG;