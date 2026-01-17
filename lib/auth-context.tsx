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
  signInWithUsername: (username: string, password: string) => Promise<void>;
  signUpWithUsername: (username: string, password: string) => Promise<void>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
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

  // Helper to generate synthetic email
  const getSyntheticEmail = (username: string) => `${username.toLowerCase()}@users.ritual.internal`;

  const signInWithUsername = async (username: string, password: string) => {
    const email = getSyntheticEmail(username);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }
    // Auth state change listener will handle the rest
  };

  const signUpWithUsername = async (username: string, password: string) => {
    const email = getSyntheticEmail(username);

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username, // Initially use username as full name
          username: username,
        },
      },
    });

    if (authError) {
      console.error('Error signing up:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('No user returned from sign up');
    }

    // 2. We need to manually create the user profile if the trigger doesn't handle all fields perfectly
    // or to ensure username is set correctly in our table
    // The trigger will run, but we can update/ensure
    await createUserProfile(authData.user.id, 3, { username });
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    if (!username || username.length < 3) return false;

    // Check if username exists in users table
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .ilike('username', username) // Case-insensitive check
      .maybeSingle();

    if (error) {
      console.error('Error checking username:', error);
      return false;
    }

    return !data; // If data exists, username is taken
  };

  const createUserProfile = async (userId: string, retries = 3, extraData: { username?: string } = {}) => {
    try {
      // Get current auth user data
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        console.error('No auth user found');
        setLoading(false);
        return;
      }

      // Check if it's a Discord user or Email user
      const isDiscord = authUser.app_metadata.provider === 'discord';

      let discordId, username, avatarUrl;

      if (isDiscord) {
        // Extract Discord data from user metadata
        const discordData = authUser.user_metadata;
        const identityData = authUser.identities?.[0]?.identity_data;

        discordId = discordData.provider_id || identityData?.provider_id || authUser.id;
        username = discordData.full_name ||
          discordData.name ||
          discordData.custom_claims?.global_name ||
          identityData?.full_name ||
          identityData?.global_name ||
          'Discord User';
        avatarUrl = discordData.avatar_url ||
          identityData?.avatar_url ||
          `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`;
      } else {
        // Email/Password User
        username = extraData.username || authUser.user_metadata.username || authUser.user_metadata.full_name || 'User';
        // Generic avatar or generate one
        avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${username}`;
      }

      console.log('Creating user profile with:', { username, avatarUrl });

      // Insert user profile
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          discord_id: discordId, // Can be null
          discord_username: isDiscord ? username : null,
          username: username, // The canonical username
          display_name: username,
          discord_avatar_url: isDiscord ? avatarUrl : null,
          avatar_url: avatarUrl,
        })
        .select()
        .single();

      if (error) {
        // Handle constraint violation (e.g. duplicate username if not handled by checks)
        // If profile already exists, just return it
        if (error.code === '23505') { // Unique violation
          // Try to fetch existing
          const { data: existing } = await supabase.from('users').select('*').eq('id', userId).single();
          if (existing) {
            setUser(existing);
            return;
          }
        }
        throw error;
      }

      console.log('User profile created successfully:', newUser);
      setUser(newUser);
    } catch (error) {
      console.error(`Error in createUserProfile (attempt ${4 - retries}/3):`, error);

      if (retries > 0) {
        console.log(`Retrying user creation in 1s... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await createUserProfile(userId, retries - 1, extraData);
      } else {
        setLoading(false);
      }
    } finally {
      if (retries === 0) {
        setLoading(false);
      }
    }
  };

  const signInWithDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/profile`,
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
    <AuthContext.Provider value={{
      user,
      supabaseUser,
      loading,
      signInWithDiscord,
      signInWithUsername,
      signUpWithUsername,
      checkUsernameAvailability,
      signOut
    }}>
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