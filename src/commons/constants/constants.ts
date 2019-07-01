export const TOKEN = {
  APPLICATION: process.env.VERIFICATION_TOKEN,
  FACEBOOK: process.env.FACEBOOK_VERIFICATION_TOKEN,
};

export const TWILIO = {
  NUMBER: process.env.TWILIO_NUMBER,
  ACCOUNT_ID: process.env.TWILIO_ACCOUNT_ID,
  AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
};

export const API_URL = {
  FACEBOOK: 'https://graph.facebook.com/v3.3/me/',
};
