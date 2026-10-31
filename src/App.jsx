import React, { useState, useEffect } from 'react';
import AuthScreen from './components/auth/AuthScreen';
import Dashboard from './components/dashboard/Dashboard';
import { auth, signOut, onAuthStateChanged } from './firebase';

export default function App() {
  // 1. User Authentication State (Auth Gate)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedSession = localStorage.getItem('habitpulse_active_user');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        // Strictly ignore demo sessions so demo data never persists
        if (parsed && !parsed.isDemo && (parsed.uid || parsed.email)) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // If a real Firebase user is signed in
      if (firebaseUser) {
        const formattedUser = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Habit Member',
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email || 'User')}&backgroundColor=4f46e5`,
          isVerified: true,
          isDemo: false
        };
        setCurrentUser(formattedUser);
        localStorage.setItem('habitpulse_active_user', JSON.stringify(formattedUser));
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Theme State (Dark / Light)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('habitpulse_theme');
      return savedTheme ? savedTheme === 'dark' : true;
    } catch {
      return true;
    }
  });

  // 3. Sound FX preference
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const savedSound = localStorage.getItem('habitpulse_sound');
      return savedSound ? savedSound === 'true' : true;
    } catch {
      return true;
    }
  });

  // Apply theme to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('habitpulse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('habitpulse_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist sound preference
  useEffect(() => {
    localStorage.setItem('habitpulse_sound', String(soundEnabled));
  }, [soundEnabled]);

  // When user successfully authenticates
  const handleAuthenticated = (userObj) => {
    setCurrentUser(userObj);
    // Real users are persisted; Demo users are NEVER saved to localStorage
    if (!userObj?.isDemo) {
      localStorage.setItem('habitpulse_active_user', JSON.stringify(userObj));
    } else {
      localStorage.removeItem('habitpulse_active_user');
    }
  };

  // Sign out / lock
  const handleSignOut = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setCurrentUser(null);
    localStorage.removeItem('habitpulse_active_user');
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // AUTH GATE: If no user is logged in, show AuthScreen (Strict Login / Signup)
  if (!currentUser) {
    return (
      <AuthScreen
        onAuthenticated={handleAuthenticated}
        soundEnabled={soundEnabled}
      />
    );
  }

  // Open the full Dashboard!
  return (
    <Dashboard
      user={currentUser}
      onSignOut={handleSignOut}
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      soundEnabled={soundEnabled}
      toggleSound={toggleSound}
    />
  );
}
