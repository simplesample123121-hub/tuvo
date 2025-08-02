"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, 
  User, 
  Shield, 
  Mail, 
  CreditCard, 
  Bell,
  Globe,
  Palette,
  Database,
  Key,
  Save,
  Trash2,
  Plus,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react'
import { settingsApi, Settings as SettingsType } from '@/lib/api/settings'
import { useAuth } from '@/contexts/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    // General Settings
    platformName: 'EventHub',
    platformDescription: 'Your premier event booking platform',
    contactEmail: 'support@eventhub.com',
    contactPhone: '+1-555-0123',
    timezone: 'UTC',
    currency: 'USD',
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@eventhub.com',
    smtpPassword: '********',
    emailFrom: 'noreply@eventhub.com',
    emailFromName: 'EventHub',
    
    // Payment Settings
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: 'sk_test_...',
    paypalClientId: 'client_id_...',
    paypalSecret: 'secret_...',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingConfirmations: true,
    paymentReminders: true,
    eventReminders: true,
    
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    ipWhitelist: '',
    
    // Appearance Settings
    primaryColor: '#3b82f6',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    darkMode: true,
    
    // Integration Settings
    googleAnalytics: 'GA-XXXXXXXXX',
    facebookPixel: 'XXXXXXXXXX',
    googleMapsApi: 'AIza...',
    recaptchaSiteKey: '6Lc...',
    recaptchaSecretKey: '6Lc...'
  })

  // Load settings from Appwrite
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true)
        const settingsData = await settingsApi.get()
        if (settingsData) {
          setSettings({
            // General Settings
            platformName: settingsData.platform_name,
            platformDescription: settingsData.platform_description,
            contactEmail: settingsData.contact_email,
            contactPhone: settingsData.contact_phone,
            timezone: settingsData.timezone,
            currency: settingsData.currency,
            
            // Email Settings
            smtpHost: settingsData.smtp_config.host,
            smtpPort: settingsData.smtp_config.port,
            smtpUsername: settingsData.smtp_config.username,
            smtpPassword: settingsData.smtp_config.password,
            emailFrom: settingsData.smtp_config.username,
            emailFromName: settingsData.platform_name,
            
            // Payment Settings
            stripePublicKey: settingsData.payment_config.stripe_public_key,
            stripeSecretKey: settingsData.payment_config.stripe_secret_key,
            paypalClientId: settingsData.payment_config.paypal_client_id,
            paypalSecret: settingsData.payment_config.paypal_secret,
            
            // Notification Settings
            emailNotifications: settingsData.notifications.email_notifications,
            smsNotifications: settingsData.notifications.sms_notifications,
            pushNotifications: settingsData.notifications.push_notifications,
            bookingConfirmations: settingsData.notifications.booking_confirmations,
            paymentReminders: settingsData.notifications.payment_reminders,
            eventReminders: settingsData.notifications.event_reminders,
            
            // Security Settings
            twoFactorAuth: settingsData.security.two_factor_auth,
            sessionTimeout: settingsData.security.session_timeout,
            passwordPolicy: settingsData.security.password_policy,
            ipWhitelist: settingsData.security.ip_whitelist,
            
            // Appearance Settings
            primaryColor: settingsData.appearance.primary_color,
            logoUrl: settingsData.appearance.logo_url,
            faviconUrl: settingsData.appearance.favicon_url,
            darkMode: settingsData.appearance.dark_mode,
            
            // Integration Settings
            googleAnalytics: settingsData.integrations.google_analytics,
            facebookPixel: settingsData.integrations.facebook_pixel,
            googleMapsApi: settingsData.integrations.google_maps_api,
            recaptchaSiteKey: settingsData.integrations.recaptcha_site_key,
            recaptchaSecretKey: settingsData.integrations.recaptcha_secret_key
          })
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = async () => {
    try {
      const settingsData: Partial<SettingsType> = {
        platform_name: settings.platformName,
        platform_description: settings.platformDescription,
        contact_email: settings.contactEmail,
        contact_phone: settings.contactPhone,
        timezone: settings.timezone,
        currency: settings.currency,
        smtp_config: {
          host: settings.smtpHost,
          port: settings.smtpPort,
          username: settings.smtpUsername,
          password: settings.smtpPassword
        },
        payment_config: {
          stripe_public_key: settings.stripePublicKey,
          stripe_secret_key: settings.stripeSecretKey,
          paypal_client_id: settings.paypalClientId,
          paypal_secret: settings.paypalSecret
        },
        notifications: {
          email_notifications: settings.emailNotifications,
          sms_notifications: settings.smsNotifications,
          push_notifications: settings.pushNotifications,
          booking_confirmations: settings.bookingConfirmations,
          payment_reminders: settings.paymentReminders,
          event_reminders: settings.eventReminders
        },
        security: {
          two_factor_auth: settings.twoFactorAuth,
          session_timeout: settings.sessionTimeout,
          password_policy: settings.passwordPolicy,
          ip_whitelist: settings.ipWhitelist
        },
        appearance: {
          primary_color: settings.primaryColor,
          logo_url: settings.logoUrl,
          favicon_url: settings.faviconUrl,
          dark_mode: settings.darkMode
        },
        integrations: {
          google_analytics: settings.googleAnalytics,
          facebook_pixel: settings.facebookPixel,
          google_maps_api: settings.googleMapsApi,
          recaptcha_site_key: settings.recaptchaSiteKey,
          recaptcha_secret_key: settings.recaptchaSecretKey
        }
      }
      
      const result = await settingsApi.update(settingsData)
      if (result) {
        console.log('Settings saved successfully')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  const adminUsers = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@eventhub.com',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Event Manager',
      email: 'manager@eventhub.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-14T15:30:00Z'
    },
    {
      id: '3',
      name: 'Support Staff',
      email: 'support@eventhub.com',
      role: 'admin',
      status: 'inactive',
      lastLogin: '2024-01-10T09:15:00Z'
    }
  ]

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin': return <Badge className="bg-red-100 text-red-800">Super Admin</Badge>
      case 'admin': return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>
      default: return <Badge variant="outline">User</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'inactive': return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your platform settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Platform Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) => handleSettingChange('platformName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="platformDescription">Platform Description</Label>
                  <Textarea
                    id="platformDescription"
                    value={settings.platformDescription}
                    onChange={(e) => handleSettingChange('platformDescription', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={settings.logoUrl}
                      onChange={(e) => handleSettingChange('logoUrl', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="faviconUrl">Favicon URL</Label>
                    <Input
                      id="faviconUrl"
                      value={settings.faviconUrl}
                      onChange={(e) => handleSettingChange('faviconUrl', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <Switch
                    id="darkMode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.smtpPort}
                    onChange={(e) => handleSettingChange('smtpPort', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.smtpUsername}
                    onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <div className="relative">
                    <Input
                      id="smtpPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={settings.smtpPassword}
                      onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="emailFrom">From Email</Label>
                  <Input
                    id="emailFrom"
                    type="email"
                    value={settings.emailFrom}
                    onChange={(e) => handleSettingChange('emailFrom', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emailFromName">From Name</Label>
                  <Input
                    id="emailFromName"
                    value={settings.emailFromName}
                    onChange={(e) => handleSettingChange('emailFromName', e.target.value)}
                  />
                </div>
              </div>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Test Email Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stripe Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="stripePublicKey">Public Key</Label>
                  <Input
                    id="stripePublicKey"
                    value={settings.stripePublicKey}
                    onChange={(e) => handleSettingChange('stripePublicKey', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="stripeSecretKey">Secret Key</Label>
                  <Input
                    id="stripeSecretKey"
                    type="password"
                    value={settings.stripeSecretKey}
                    onChange={(e) => handleSettingChange('stripeSecretKey', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PayPal Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paypalClientId">Client ID</Label>
                  <Input
                    id="paypalClientId"
                    value={settings.paypalClientId}
                    onChange={(e) => handleSettingChange('paypalClientId', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="paypalSecret">Secret</Label>
                  <Input
                    id="paypalSecret"
                    type="password"
                    value={settings.paypalSecret}
                    onChange={(e) => handleSettingChange('paypalSecret', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="bookingConfirmations">Booking Confirmations</Label>
                  <p className="text-sm text-muted-foreground">Send booking confirmation emails</p>
                </div>
                <Switch
                  id="bookingConfirmations"
                  checked={settings.bookingConfirmations}
                  onCheckedChange={(checked) => handleSettingChange('bookingConfirmations', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="paymentReminders">Payment Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send payment reminder emails</p>
                </div>
                <Switch
                  id="paymentReminders"
                  checked={settings.paymentReminders}
                  onCheckedChange={(checked) => handleSettingChange('paymentReminders', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="eventReminders">Event Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send event reminder emails</p>
                </div>
                <Switch
                  id="eventReminders"
                  checked={settings.eventReminders}
                  onCheckedChange={(checked) => handleSettingChange('eventReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordPolicy">Password Policy</Label>
                  <Select value={settings.passwordPolicy} onValueChange={(value) => handleSettingChange('passwordPolicy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="strong">Strong</SelectItem>
                      <SelectItem value="very_strong">Very Strong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                  <Textarea
                    id="ipWhitelist"
                    value={settings.ipWhitelist}
                    onChange={(e) => handleSettingChange('ipWhitelist', e.target.value)}
                    placeholder="Enter IP addresses (one per line)"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Admin Users</h2>
              <p className="text-muted-foreground">Manage admin users and permissions</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {adminUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
} 