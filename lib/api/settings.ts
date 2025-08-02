import { databases, databaseId, collections } from '../appwrite';

export interface Settings {
  id: string;
  platform_name: string;
  platform_description: string;
  contact_email: string;
  contact_phone: string;
  timezone: string;
  currency: string;
  smtp_config: {
    host: string;
    port: string;
    username: string;
    password: string;
  };
  payment_config: {
    stripe_public_key: string;
    stripe_secret_key: string;
    paypal_client_id: string;
    paypal_secret: string;
  };
  notifications: {
    email_notifications: boolean;
    sms_notifications: boolean;
    push_notifications: boolean;
    booking_confirmations: boolean;
    payment_reminders: boolean;
    event_reminders: boolean;
  };
  security: {
    two_factor_auth: boolean;
    session_timeout: number;
    password_policy: string;
    ip_whitelist: string;
  };
  appearance: {
    primary_color: string;
    logo_url: string;
    favicon_url: string;
    dark_mode: boolean;
  };
  integrations: {
    google_analytics: string;
    facebook_pixel: string;
    google_maps_api: string;
    recaptcha_site_key: string;
    recaptcha_secret_key: string;
  };
}

export const settingsApi = {
  // Get settings
  async get(): Promise<Settings | null> {
    try {
      const response = await databases.listDocuments(databaseId, collections.settings);
      if (response.documents.length > 0) {
        return response.documents[0] as Settings;
      }
      return null;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
  },

  // Create default settings
  async createDefault(): Promise<Settings | null> {
    try {
      const defaultSettings: Omit<Settings, 'id'> = {
        platform_name: 'EventHub',
        platform_description: 'Your premier event booking platform',
        contact_email: 'support@eventhub.com',
        contact_phone: '+1-555-0123',
        timezone: 'UTC',
        currency: 'USD',
        smtp_config: {
          host: 'smtp.gmail.com',
          port: '587',
          username: 'noreply@eventhub.com',
          password: ''
        },
        payment_config: {
          stripe_public_key: '',
          stripe_secret_key: '',
          paypal_client_id: '',
          paypal_secret: ''
        },
        notifications: {
          email_notifications: true,
          sms_notifications: false,
          push_notifications: true,
          booking_confirmations: true,
          payment_reminders: true,
          event_reminders: true
        },
        security: {
          two_factor_auth: true,
          session_timeout: 30,
          password_policy: 'strong',
          ip_whitelist: ''
        },
        appearance: {
          primary_color: '#3b82f6',
          logo_url: '/logo.png',
          favicon_url: '/favicon.ico',
          dark_mode: true
        },
        integrations: {
          google_analytics: '',
          facebook_pixel: '',
          google_maps_api: '',
          recaptcha_site_key: '',
          recaptcha_secret_key: ''
        }
      };

      const response = await databases.createDocument(
        databaseId,
        collections.settings,
        'default_settings',
        defaultSettings
      );
      return response as Settings;
    } catch (error) {
      console.error('Error creating default settings:', error);
      return null;
    }
  },

  // Update settings
  async update(settingsData: Partial<Settings>): Promise<Settings | null> {
    try {
      const currentSettings = await this.get();
      if (!currentSettings) {
        return await this.createDefault();
      }

      const response = await databases.updateDocument(
        databaseId,
        collections.settings,
        currentSettings.id,
        settingsData
      );
      return response as Settings;
    } catch (error) {
      console.error('Error updating settings:', error);
      return null;
    }
  },

  // Get specific setting
  async getSetting(key: keyof Settings): Promise<any> {
    try {
      const settings = await this.get();
      return settings ? settings[key] : null;
    } catch (error) {
      console.error('Error getting setting:', error);
      return null;
    }
  },

  // Update specific setting
  async updateSetting(key: keyof Settings, value: any): Promise<boolean> {
    try {
      const settings = await this.get();
      if (!settings) {
        await this.createDefault();
      }

      const updateData = { [key]: value };
      const result = await this.update(updateData);
      return result !== null;
    } catch (error) {
      console.error('Error updating setting:', error);
      return false;
    }
  },

  // Get platform configuration
  async getPlatformConfig() {
    try {
      const settings = await this.get();
      if (!settings) {
        return null;
      }

      return {
        name: settings.platform_name,
        description: settings.platform_description,
        contact: {
          email: settings.contact_email,
          phone: settings.contact_phone
        },
        timezone: settings.timezone,
        currency: settings.currency,
        appearance: settings.appearance
      };
    } catch (error) {
      console.error('Error getting platform config:', error);
      return null;
    }
  },

  // Get payment configuration
  async getPaymentConfig() {
    try {
      const settings = await this.get();
      if (!settings) {
        return null;
      }

      return settings.payment_config;
    } catch (error) {
      console.error('Error getting payment config:', error);
      return null;
    }
  },

  // Get notification settings
  async getNotificationSettings() {
    try {
      const settings = await this.get();
      if (!settings) {
        return null;
      }

      return settings.notifications;
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return null;
    }
  }
}; 