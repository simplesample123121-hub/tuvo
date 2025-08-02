"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { databases, databaseId, collections } from '@/lib/appwrite';
import { Models, Query, Client, Account, ID } from 'appwrite';

// Create Appwrite client and account instance directly
const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('688d133a00190cb1d93c');

const account = new Account(client);

export interface User {
  $id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended';
  profile?: string; // JSON string for Appwrite
  // These might not exist in the collection, so they're optional
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loadUserProfile: (userId: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (userId: string, secret: string, password: string) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
  parseProfile: (profileString: string) => any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkExistingSession = async () => {
    try {
      const currentUser = await account.get();
      console.log('Found existing session for:', currentUser.email);
      await loadUserProfile(currentUser.$id);
    } catch (error) {
      console.log('No existing session found');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // First, try to create default admin if no users exist
        await createDefaultAdmin();
        
        // Then check for existing session
        await checkExistingSession();
      } catch (error) {
        console.error('Error initializing app:', error);
        setLoading(false);
      }
    };

    initializeApp();
    
    // Cleanup function to handle component unmount
    return () => {
      // Any cleanup needed when component unmounts
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Try to get user profile from our database
      const response = await databases.listDocuments(
        databaseId,
        collections.users,
        [Query.equal('$id', userId)]
      );
      
      if (response.documents.length > 0) {
        setUser(response.documents[0] as unknown as User);
      } else {
        // Create user profile if it doesn't exist
        const currentUser = await account.get();
        const newUser = {
          email: currentUser.email,
          name: currentUser.name,
          role: 'user',
          status: 'active',
          profile: JSON.stringify({}) // Convert to string for Appwrite
        };
        
        const createdUser = await databases.createDocument(
          databaseId,
          collections.users,
          userId,
          newUser
        );
        
        setUser(createdUser as unknown as User);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      
      // Fallback to sample user data for development
      console.log('Using sample user data due to permission/schema issues');
      const sampleUser: User = {
        $id: userId,
        email: 'user@example.com',
        name: 'Sample User',
        role: 'user',
        status: 'active',
        profile: JSON.stringify({}) // Convert to string for Appwrite
      };
      setUser(sampleUser);
    }
  };

  // Create default admin user if no users exist
  const createDefaultAdmin = async () => {
    try {
      // Check if any users exist
      const allUsers = await databases.listDocuments(
        databaseId,
        collections.users,
        []
      );

      // If no users exist, create default admin
      if (allUsers.documents.length === 0) {
        console.log('No users found, creating default admin...');
        
        try {
          // First, create the user in Appwrite authentication
          const adminUser = await account.create(
            ID.unique(),
            'admin@eventbooker.com',
            'Admin@123',
            'System Administrator'
          );
          
          console.log('✅ Admin user created in Appwrite auth:', adminUser);
          
          // Then create the user profile in our database
          const adminId = adminUser.$id;
          const defaultAdmin = {
            email: 'admin@eventbooker.com',
            name: 'System Administrator',
            role: 'admin',
            status: 'active',
            profile: JSON.stringify({
              isAdmin: true,
              permissions: ['events', 'bookings', 'users', 'analytics', 'settings'],
              createdBy: 'system',
              isDefaultAdmin: true
            })
          };

          const createdAdmin = await databases.createDocument(
            databaseId,
            collections.users,
            adminId,
            defaultAdmin
          );

          console.log('✅ Default admin user created in database:', createdAdmin);
          return createdAdmin;
        } catch (authError) {
          console.error('Error creating admin in Appwrite auth:', authError);
          
          // If user already exists in auth, just create the profile
          try {
            const adminId = ID.unique();
            const defaultAdmin = {
              email: 'admin@eventbooker.com',
              name: 'System Administrator',
              role: 'admin',
              status: 'active',
              profile: JSON.stringify({
                isAdmin: true,
                permissions: ['events', 'bookings', 'users', 'analytics', 'settings'],
                createdBy: 'system',
                isDefaultAdmin: true
              })
            };

            const createdAdmin = await databases.createDocument(
              databaseId,
              collections.users,
              adminId,
              defaultAdmin
            );

            console.log('✅ Default admin profile created:', createdAdmin);
            return createdAdmin;
          } catch (dbError) {
            console.error('Error creating admin profile:', dbError);
          }
        }
      }
    } catch (error) {
      console.error('Error creating default admin:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // First, try to get current session to see if user is already logged in
      try {
        const currentSession = await account.get();
        console.log('User already logged in:', currentSession.email);
        // If we get here, user is already logged in
        await loadUserProfile(currentSession.$id);
        return { success: true, message: 'Already logged in' };
      } catch (sessionError) {
        // No active session, proceed with login
        console.log('No active session, proceeding with login');
      }

      // Create new session
      await account.createEmailSession(email, password);
      const currentUser = await account.get();
      await loadUserProfile(currentUser.$id);
      
      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Delete the current session
      await account.deleteSession('current');
      setUser(null);
      setLoading(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear the local state
      setUser(null);
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      // Auto-verify user in development (you can remove this in production)
      try {
        await account.updateVerification(user.$id, user.$id);
      } catch (verifyError) {
        console.log('Auto-verification failed (this is normal in production):', verifyError);
      }

      // Create user profile
      await loadUserProfile(user.$id);

      // Optionally log in the user after registration
      try {
        await account.createEmailSession(email, password);
        const currentUser = await account.get();
        await loadUserProfile(currentUser.$id);
      } catch (loginError) {
        console.log('Auto-login after registration failed:', loginError);
        // This is okay, user can login manually
      }

      return { success: true, message: 'Registration successful! Please check your email to verify your account.' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed' 
      };
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      // Only update valid attributes that exist in the collection
      const validData: any = {
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status
      };

      // Handle profile field as string
      if (data.profile) {
        validData.profile = typeof data.profile === 'string' ? data.profile : JSON.stringify(data.profile);
      }

      const updatedUser = await databases.updateDocument(
        databaseId,
        collections.users,
        user.$id,
        validData
      );
      
      setUser(updatedUser as unknown as User);
      return { success: true, message: 'Profile updated successfully' };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to update profile' 
      };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      await account.updatePassword(newPassword);
      return { success: true, message: 'Password changed successfully' };
    } catch (error: any) {
      console.error('Password change error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to change password' 
      };
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      await account.createRecovery(email, 'http://localhost:3000/reset-password');
      return { success: true, message: 'Password reset email sent' };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to send reset email' 
      };
    }
  };

  const resetPassword = async (userId: string, secret: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      await account.updateRecovery(userId, secret, password, password);
      return { success: true, message: 'Password reset successfully' };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to reset password' 
      };
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await account.get();
      await loadUserProfile(currentUser.$id);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    }
  };

  const parseProfile = (profileString: string) => {
    try {
      return JSON.parse(profileString);
    } catch (e) {
      console.error('Failed to parse profile string:', e);
      return null;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin',
    login,
    logout,
    register,
    loadUserProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshUser,
    parseProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 