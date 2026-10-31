import React, { useState } from 'react';
import { 
  Flame, Mail, Lock, User, Eye, EyeOff, CheckCircle2, 
  ArrowRight, Sparkles, RefreshCw, Zap, Cloud
} from 'lucide-react';
import { playSound, triggerConfetti } from '../../utils/audio';
import { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from '../../firebase';

export default function AuthScreen({ onAuthenticated, soundEnabled = true }) {
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Switch tabs
  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setErrorMsg('');
  };

  // Helper: Retrieve accounts from localStorage (Offline fallback)
  const getStoredAccounts = () => {
    try {
      return JSON.parse(localStorage.getItem('habitpulse_accounts') || '{}');
    } catch {
      return {};
    }
  };

  const saveStoredAccounts = (accounts) => {
    localStorage.setItem('habitpulse_accounts', JSON.stringify(accounts));
  };

  // 1. GOOGLE SIGN IN
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsGoogleLoading(true);
    try {
      if (!auth || !googleProvider) {
        throw new Error('Firebase Auth is not ready. Please check configuration.');
      }
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const formattedUser = {
        uid: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Habit Hero',
        email: user.email,
        avatar: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName || user.email)}&backgroundColor=4f46e5`,
        isVerified: true
      };

      playSound('victory', soundEnabled);
      triggerConfetti();
      onAuthenticated(formattedUser);
    } catch (err) {
      console.warn('Google Auth:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // User dismissed the popup
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMsg('Sign-in popup was blocked by browser. Please enable popups.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg('This domain is not authorized in Firebase Console -> Authentication -> Settings.');
      } else {
        setErrorMsg(err.message || 'Google sign-in encountered an error.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // 2. SIGN IN (Firebase Cloud Auth + Offline Fallback)
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      if (auth) {
        const res = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const user = res.user;
        const formattedUser = {
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Habit Hero',
          email: user.email,
          avatar: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName || user.email)}&backgroundColor=4f46e5`,
          isVerified: true
        };
        playSound('victory', soundEnabled);
        triggerConfetti();
        onAuthenticated(formattedUser);
        return;
      }
    } catch (firebaseErr) {
      console.warn('Firebase login attempt:', firebaseErr);
      if (firebaseErr.code === 'auth/user-not-found') {
        setErrorMsg('No account found with this email. Switch to Create Account.');
        setIsLoading(false);
        return;
      } else if (firebaseErr.code === 'auth/wrong-password' || firebaseErr.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid email or password. Please verify your details.');
        setIsLoading(false);
        return;
      } else if (firebaseErr.code === 'auth/too-many-requests') {
        setErrorMsg('Access temporarily blocked due to repeated attempts. Try again later.');
        setIsLoading(false);
        return;
      }
    }

    // Offline / Local fallback if Firebase was unreachable
    const accounts = getStoredAccounts();
    const existing = accounts[cleanEmail];
    setIsLoading(false);

    if (existing) {
      if (existing.password === password) {
        playSound('victory', soundEnabled);
        triggerConfetti();
        onAuthenticated(existing);
        return;
      } else {
        setErrorMsg('Invalid password. Please check and try again.');
        return;
      }
    }

    setErrorMsg('Could not sign in. Please verify your email and password or register.');
  };

  // 3. SIGN UP (Firebase Cloud Auth + Offline Fallback)
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=4f46e5`;

    try {
      if (auth) {
        const res = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        await updateProfile(res.user, {
          displayName: cleanName,
          photoURL: avatarUrl
        });

        const formattedUser = {
          uid: res.user.uid,
          name: cleanName,
          email: cleanEmail,
          avatar: avatarUrl,
          isVerified: true,
          createdAt: new Date().toISOString()
        };

        // Cache locally as well
        const accounts = getStoredAccounts();
        accounts[cleanEmail] = formattedUser;
        saveStoredAccounts(accounts);

        playSound('victory', soundEnabled);
        triggerConfetti();
        onAuthenticated(formattedUser);
        return;
      }
    } catch (firebaseErr) {
      console.warn('Firebase signup:', firebaseErr);
      if (firebaseErr.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Please Sign In.');
        setIsLoading(false);
        return;
      } else if (firebaseErr.code === 'auth/weak-password') {
        setErrorMsg('Password is too weak. Please use at least 6 characters.');
        setIsLoading(false);
        return;
      }
    }

    // Local fallback
    const accounts = getStoredAccounts();
    const newUser = {
      uid: 'usr_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: password,
      avatar: avatarUrl,
      isVerified: true,
      createdAt: new Date().toISOString()
    };
    accounts[cleanEmail] = newUser;
    saveStoredAccounts(accounts);
    setIsLoading(false);

    playSound('victory', soundEnabled);
    triggerConfetti();
    onAuthenticated(newUser);
  };

  // Demo one-click sign in for instant access
  const handleDemoSignIn = () => {
    const demoUser = {
      uid: 'demo_user_1',
      name: 'Alex Rivera',
      email: 'alex@habitpulse.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      isVerified: true
    };
    playSound('victory', soundEnabled);
    triggerConfetti();
    onAuthenticated(demoUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 z-10 text-center flex-col sm:flex-row">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
          <Flame className="w-7 h-7" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            HabitPulse
            <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold tracking-wider">
              Cloud v2.0
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
            <Cloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Live Firebase Cloud Sync & Habit Tracker</span>
          </p>
        </div>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="w-full max-w-md bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-slide-up">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-800/80 p-1 rounded-2xl mb-6 border border-slate-700/60">
          <button
            type="button"
            onClick={() => handleTabSwitch('signin')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              tab === 'signin'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('signup')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              tab === 'signup'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Google One-Click Sign In Button */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold absolute">
              or with email
            </span>
          </div>
        </div>

        {/* Error Notification Banner */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2 animate-slide-up">
            <span className="text-rose-400 font-bold shrink-0">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ----------------- 1. SIGN IN FORM ----------------- */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting to Cloud...</span>
                </>
              ) : (
                <>
                  <span>Sign In & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ----------------- 2. SIGN UP FORM ----------------- */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ahmad Khan"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Registering Account in Cloud...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Account & Enter Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider & Fast-Track Demo Button */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 mb-3">Want to preview the dashboard without registering?</p>
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>⚡ Instant One-Click Demo Login</span>
          </button>
        </div>
      </div>

      {/* Feature Badges below card */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 z-10">
        <span className="flex items-center gap-1.5">
          <Cloud className="w-4 h-4 text-indigo-400" />
          <span>Real-time Firebase Cloud Storage</span>
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Multi-Device Sync</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>RPG Player Gamification</span>
        </span>
      </div>
    </div>
  );
}
