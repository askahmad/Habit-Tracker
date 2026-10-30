import React, { useState, useEffect } from 'react';
import AuthScreen from './components/auth/AuthScreen';
import Dashboard from './components/dashboard/Dashboard';

export default function App() {
  // 1. User Authentication State (Auth Gate)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedSession = localStorage.getItem('habitpulse_active_user');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        // User must be verified to enter dashboard
        if (parsed && parsed.isVerified) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

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

  // When user successfully verifies & authenticates
  const handleAuthenticated = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('habitpulse_active_user', JSON.stringify(userObj));
  };

  // Sign out / lock
  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('habitpulse_active_user');
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // AUTH GATE: If no verified user is logged in, show AuthScreen (Login / Signup / Verification)
  if (!currentUser) {
    return (
      <AuthScreen
        onAuthenticated={handleAuthenticated}
        soundEnabled={soundEnabled}
      />
    );
  }

  // Once verified, open the full Dashboard!
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

