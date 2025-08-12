"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setUser(null); return }
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) { setUser(null); return }
      await loadUserProfile(authUser)
    } finally {
      setLoading(false)
    }
  }

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

  const loadUserProfile = async (authUser: any) => {
    try {
      const email = authUser.email as string
      const name = (authUser.user_metadata?.full_name as string) || email?.split('@')[0] || 'User'
      const { data: existing } = await supabase.from('users').select('*').eq('email', email).maybeSingle()
      if (existing) {
        setUser({
          $id: existing.id,
          email: existing.email,
          name: existing.name,
          role: existing.role,
          status: existing.status,
          profile: existing.profile ? JSON.stringify(existing.profile) : undefined,
          created_at: existing.created_at,
          updated_at: existing.updated_at,
        })
      } else {
        const { data: created } = await supabase
          .from('users')
          .insert({ email, name, role: 'user', status: 'active', profile: {} })
          .select('*')
          .maybeSingle()
        if (created) {
          setUser({
            $id: created.id,
            email: created.email,
            name: created.name,
            role: created.role,
            status: created.status,
            profile: created.profile ? JSON.stringify(created.profile) : undefined,
            created_at: created.created_at,
            updated_at: created.updated_at,
          })
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      
      // Don't set a fallback user - let the user be null if there's an error
      // This prevents showing incorrect user data
      setUser(null);
    }
  };

  const createDefaultAdmin = async () => {}

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error('No user')
      await loadUserProfile(authUser)
      return { success: true, message: 'Login successful' }
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
      await supabase.auth.signOut()
      setUser(null)
      setLoading(false)
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear the local state
      setUser(null);
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
      if (error) throw error
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) await loadUserProfile(authUser)
      return { success: true, message: 'Registration successful!' }
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
      const patch: any = {}
      if (data.name) patch.name = data.name
      if (data.email) patch.email = data.email
      if (data.role) patch.role = data.role
      if (data.status) patch.status = data.status
      if (data.profile) patch.profile = typeof data.profile === 'string' ? JSON.parse(data.profile) : data.profile
      const { data: updated, error } = await supabase
        .from('users')
        .update(patch)
        .eq('id', user.$id)
        .select('*')
        .maybeSingle()
      if (error) throw error
      if (updated) {
        setUser({
          $id: updated.id,
          email: updated.email,
          name: updated.name,
          role: updated.role,
          status: updated.status,
          profile: updated.profile ? JSON.stringify(updated.profile) : undefined,
          created_at: updated.created_at,
          updated_at: updated.updated_at,
        })
      }
      return { success: true, message: 'Profile updated successfully' };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to update profile' 
      };
    }
  };

  const changePassword = async (_currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      return { success: true, message: 'Password changed successfully' };
    } catch (error: any) {
      console.error('Password change error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to change password' 
      };
    }
  };

  const forgotPassword = async (_email: string): Promise<{ success: boolean; message: string }> => {
    try {
      return { success: true, message: 'Password reset not implemented' };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to send reset email' 
      };
    }
  };

  const resetPassword = async (_userId: string, _secret: string, _password: string): Promise<{ success: boolean; message: string }> => {
    try {
      return { success: true, message: 'Password reset not implemented' };
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
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) await loadUserProfile(authUser)
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