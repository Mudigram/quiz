'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { User } from './types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Try to get existing profile
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // User profile doesn't exist, create it
        console.log('User profile not found, creating...');
        await createUserProfile(userId);
        return;
      }

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      // Get current auth user data
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        console.error('No auth user found');
        setLoading(false);
        return;
      }

      // Extract Discord data from user metadata
      const discordData = authUser.user_metadata;
      const identityData = authUser.identities?.[0]?.identity_data;

      // Discord sends data in different fields depending on the OAuth flow
      const discordId = discordData.provider_id || identityData?.provider_id || authUser.id;
      const username = discordData.full_name || 
                       discordData.name || 
                       discordData.custom_claims?.global_name ||
                       identityData?.full_name ||
                       identityData?.global_name ||
                       'Discord User';
      const avatarUrl = discordData.avatar_url || 
                        identityData?.avatar_url ||
                        `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`;

      console.log('Creating user profile with:', { discordId, username, avatarUrl });

      // Insert user profile
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          discord_id: discordId,
          discord_username: username,
          discord_avatar_url: avatarUrl,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }

      console.log('User profile created successfully:', newUser);
      setUser(newUser);
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
    if (error) {
      console.error('Error signing in with Discord:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    setUser(null);
    setSupabaseUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, supabaseUser, loading, signInWithDiscord, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}