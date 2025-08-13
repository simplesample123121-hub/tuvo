// Centralized email configuration. For development-only scenarios, you can hardcode
// credentials here. Prefer environment variables in production.

export const EMAIL_CONFIG = {
  // Resend
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_FROM: process.env.RESEND_FROM || '',

  // SMTP (fallback)
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || '',
}

// Optional: Hardcode keys for local testing ONLY.
// WARNING: Do NOT commit real production secrets to source control.
// export const DEV_EMAIL_OVERRIDES = {
//   RESEND_API_KEY: 're_61YYw6N3_MqEv326dJqtRgbEdT9qJj6jp', // e.g. 're_********************************'
//   RESEND_FROM: 'onboarding@resend.dev', // e.g. 'no-reply@yourdomain.com' (must be verified in Resend)
// }

export const DEV_EMAIL_OVERRIDES = {
  RESEND_API_KEY: 're_TgUmPpsK_MqxpxuXoHchEPJsFP6gHkqHG', // e.g. 're_********************************'
  RESEND_FROM: 'Tuvo <no-reply@tuvo.in>', // e.g. 'no-reply@yourdomain.com' (must be verified in Resend)
}

