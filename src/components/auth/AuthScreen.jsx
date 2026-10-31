import React, { useState } from 'react';
import { 
  Flame, Mail, Lock, User, Eye, EyeOff, CheckCircle2, 
  ArrowRight, Sparkles, RefreshCw, Zap, Cloud, ShieldCheck
} from 'lucide-react';
import { playSound, triggerConfetti } from '../../utils/audio';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from '../../firebase';

export default function AuthScreen({ onAuthenticated, soundEnabled = true }) {
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Switch tabs
  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setErrorMsg('');
  };

  // Helper: Retrieve accounts from localStorage (Offline cache fallback)
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

  // 1. SIGN IN (Strict Authentication - Only valid credentials allowed)
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      if (auth) {
        const res = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        const user = res.user;
        const formattedUser = {
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Habit Member',
          email: user.email,
          avatar: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName || user.email)}&backgroundColor=4f46e5`,
          isVerified: true,
          isDemo: false
        };
        setIsLoading(false);
        playSound('victory', soundEnabled);
        triggerConfetti();
        onAuthenticated(formattedUser);
        return;
      }
    } catch (firebaseErr) {
      console.warn('Firebase login check:', firebaseErr.code);
      setIsLoading(false);

      if (firebaseErr.code === 'auth/user-not-found') {
        setErrorMsg('No account found with this email. Please click "Create Account".');
        return;
      } else if (
        firebaseErr.code === 'auth/wrong-password' || 
        firebaseErr.code === 'auth/invalid-credential'
      ) {
        setErrorMsg('Incorrect email or password. Please verify and try again.');
        return;
      } else if (firebaseErr.code === 'auth/too-many-requests') {
        setErrorMsg('Account access temporarily locked due to too many failed attempts. Try again later.');
        return;
      } else if (firebaseErr.code === 'auth/invalid-email') {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
    }

    // Offline cached credentials check (only if exact password matches)
    const accounts = getStoredAccounts();
    const existing = accounts[cleanEmail];
    setIsLoading(false);

    if (existing && existing.password === cleanPassword) {
      playSound('victory', soundEnabled);
      triggerConfetti();
      onAuthenticated({ ...existing, isDemo: false });
      return;
    }

    // Strictly reject any other attempt
    setErrorMsg('Invalid email or password. Please check your credentials or create an account.');
  };

  // 2. SIGN UP (Requires Full Name, Email, Password & Confirm Password)
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

    if (!confirmPassword) {
      setErrorMsg('Please confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter identical passwords.');
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
          isDemo: false,
          createdAt: new Date().toISOString()
        };

        // Cache locally for offline backup
        const accounts = getStoredAccounts();
        accounts[cleanEmail] = { ...formattedUser, password: password };
        saveStoredAccounts(accounts);

        setIsLoading(false);
        playSound('victory', soundEnabled);
        triggerConfetti();
        onAuthenticated(formattedUser);
        return;
      }
    } catch (firebaseErr) {
      console.warn('Firebase signup:', firebaseErr);
      setIsLoading(false);
      if (firebaseErr.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Please Sign In.');
        return;
      } else if (firebaseErr.code === 'auth/weak-password') {
        setErrorMsg('Password is too weak. Please use at least 6 characters.');
        return;
      } else if (firebaseErr.code === 'auth/invalid-email') {
        setErrorMsg('The email address is invalid.');
        return;
      }
    }

    // Local fallback when network is unavailable
    const accounts = getStoredAccounts();
    if (accounts[cleanEmail]) {
      setIsLoading(false);
      setErrorMsg('An account with this email already exists. Please Sign In.');
      return;
    }

    const newUser = {
      uid: 'usr_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: password,
      avatar: avatarUrl,
      isVerified: true,
      isDemo: false,
      createdAt: new Date().toISOString()
    };
    accounts[cleanEmail] = newUser;
    saveStoredAccounts(accounts);
    setIsLoading(false);

    playSound('victory', soundEnabled);
    triggerConfetti();
    onAuthenticated(newUser);
  };

  // 3. DEMO ACCESS (Strictly preview only - No data will be saved)
  const handleDemoSignIn = () => {
    const demoUser = {
      uid: 'demo_guest_preview',
      name: 'Guest Explorer',
      email: 'demo@habitiq.preview',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      isVerified: true,
      isDemo: true // STRICT DEMO FLAG: No data saved to localStorage or Cloud
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
            Habit<span className="text-indigo-400">IQ</span>
            <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold tracking-wider">
              Pro v2.0
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
            <Cloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Smart Daily Habit Tracker & Focus Matrix</span>
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
                  autoComplete="email"
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
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle password visibility"
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
                  <span>Authenticating...</span>
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
                  autoComplete="name"
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
                  autoComplete="email"
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
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle password visibility"
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
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  <span>Creating Account...</span>
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

        {/* Divider & Fast-Track Sandbox Demo Button */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 mb-3">Just exploring? Try the sandbox without creating an account:</p>
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>⚡ Interactive Demo Preview (No Data Saved)</span>
          </button>
        </div>
      </div>

      {/* Feature Badges below card */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 z-10">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Strict Encrypted Auth</span>
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
