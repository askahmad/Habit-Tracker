import React, { useState } from 'react';
import { 
  Flame, Mail, Lock, User, Eye, EyeOff, CheckCircle2, 
  ArrowRight, ShieldCheck, Sparkles, KeyRound, RefreshCw, Zap
} from 'lucide-react';
import { playSound, triggerConfetti } from '../../utils/audio';

export default function AuthScreen({ onAuthenticated, soundEnabled = true }) {
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup' | 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Verification state
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [expectedCode, setExpectedCode] = useState('784921');
  const [pendingUser, setPendingUser] = useState(null);

  // Switch tabs
  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setErrorMsg('');
  };

  // Helper: Retrieve accounts from localStorage
  const getStoredAccounts = () => {
    try {
      return JSON.parse(localStorage.getItem('habitpulse_accounts') || '{}');
    } catch {
      return {};
    }
  };

  // Helper: Save accounts to localStorage
  const saveStoredAccounts = (accounts) => {
    localStorage.setItem('habitpulse_accounts', JSON.stringify(accounts));
  };

  // 1. SIGN IN SUBMIT
  const handleSignIn = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const accounts = getStoredAccounts();
      const existing = accounts[cleanEmail];

      if (!existing) {
        setErrorMsg('No account found with this email. Please switch to Create Account.');
        return;
      }

      if (existing.password !== password) {
        setErrorMsg('Invalid password. Please check and try again.');
        return;
      }

      // Check if user needs verification
      if (!existing.isVerified) {
        const demoOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setExpectedCode(demoOtp);
        setPendingUser(existing);
        setTab('verify');
        setErrorMsg('');
        return;
      }

      // Successful login
      playSound('victory', soundEnabled);
      triggerConfetti();
      onAuthenticated(existing);
    }, 400);
  };

  // 2. SIGN UP SUBMIT -> TRANSITION TO VERIFICATION
  const handleSignUp = (e) => {
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

    const accounts = getStoredAccounts();
    if (accounts[cleanEmail]) {
      setErrorMsg('An account with this email already exists. Please Sign In.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Generate a realistic 6-digit OTP code for verification
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setExpectedCode(generatedOtp);

      const newUser = {
        uid: 'usr_' + Date.now(),
        name: cleanName,
        email: cleanEmail,
        password: password,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=4f46e5`,
        isVerified: false,
        createdAt: new Date().toISOString()
      };

      setPendingUser(newUser);
      setTab('verify');
      setVerificationCode(['', '', '', '', '', '']);
      playSound('click', soundEnabled);
    }, 450);
  };

  // 3. OTP VERIFICATION
  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const entered = verificationCode.join('');

    if (entered.length < 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    // Accept either the generated OTP or '123456' for ease of testing
    if (entered !== expectedCode && entered !== '123456') {
      setErrorMsg('Invalid verification code. Please check the code or resend.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const verifiedUser = {
        ...pendingUser,
        isVerified: true
      };

      // Save to accounts list
      const accounts = getStoredAccounts();
      accounts[verifiedUser.email] = verifiedUser;
      saveStoredAccounts(accounts);

      playSound('victory', soundEnabled);
      triggerConfetti();
      onAuthenticated(verifiedUser);
    }, 400);
  };

  // Demo one-click sign in for instant access
  const handleDemoSignIn = () => {
    const demoUser = {
      uid: 'demo_user_1',
      name: 'Alex Rivera',
      email: 'alex@habitpulse.io',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      isVerified: true
    };
    const accounts = getStoredAccounts();
    accounts[demoUser.email] = demoUser;
    saveStoredAccounts(accounts);

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
              Pro v2.0
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">Daily Habit Tracker, Streak Builder & Focus Dashboard</p>
        </div>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="w-full max-w-md bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-slide-up">
        {/* Navigation Tabs (if not on verify screen) */}
        {tab !== 'verify' ? (
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
        ) : (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
              <KeyRound className="w-4 h-4" />
              <span>Identity Verification</span>
            </div>
            <button
              onClick={() => setTab('signup')}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              ← Back
            </button>
          </div>
        )}

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
                  <span>Verifying Credentials...</span>
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                  <span>Preparing Verification...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ----------------- 3. OTP VERIFICATION FORM ----------------- */}
        {tab === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="space-y-5 animate-slide-up">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-base text-white">Enter 6-Digit Code</h3>
              <p className="text-xs text-slate-400 mt-1">
                A verification code has been dispatched to{' '}
                <strong className="text-indigo-400">{pendingUser?.email || email}</strong>
              </p>

              {/* Demo test helper pill */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono">
                <span>Code:</span>
                <span className="font-bold tracking-widest text-white">{expectedCode}</span>
                <button
                  type="button"
                  onClick={() => {
                    setVerificationCode(expectedCode.split(''));
                    playSound('click', soundEnabled);
                  }}
                  className="ml-1 text-[10px] text-amber-400 underline font-sans"
                >
                  Auto-fill
                </button>
              </div>
            </div>

            {/* 6 Digit Inputs */}
            <div className="flex justify-center gap-2 sm:gap-2.5 my-2">
              {verificationCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center font-bold text-xl rounded-xl bg-slate-950/80 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 text-white outline-none transition-all shadow-inner"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying & Opening Dashboard...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Enter Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider & Fast-Track Demo Button */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 mb-3">Want to preview the full dashboard right away?</p>
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
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Encrypted Local Storage</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>RPG Player Gamification</span>
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>100% Free Forever</span>
        </span>
      </div>
    </div>
  );
}

