"use client"

import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import { User } from '@/lib/types';
import { supabase } from '@/lib/db';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const { data: userProfile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
            
            if (error) console.error('Error fetching user profile:', error);
            else setUser(userProfile as User);
        }
        setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            fetchUser();
        }
        if (event === 'SIGNED_OUT') {
            setUser(null);
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{user, setUser, loading}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};