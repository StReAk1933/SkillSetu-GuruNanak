import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  LogOut,
  Shield,
  UserCheck,
  Cpu,
  Target,
  GraduationCap,
  Award,
  ShieldCheck,
  Users,
  CheckCircle2,
} from 'lucide-react';

import { login, logout, getCurrentUser } from '../auth/auth';

/**
 * SkillSetu Login Page — Enterprise Polish
 * Theme: Modern AI + Enterprise Workforce Intelligence
 * Features: User / Employee Login & Admin Login Switcher Options
 */
export default function Login({ onLoginSuccess }) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [selectedRoleTab, setSelectedRoleTab] = useState('EMPLOYEE');
  const [email, setEmail] = useState('rahul@skillsetu.com');
  const [password, setPassword] = useState('123456');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Network visual nodes
  const networkNodes = [
    { id: 'comp', label: 'Competency', icon: Target, position: 'top-2 left-6 sm:top-4 sm:left-10', color: '#00B87A' },
    { id: 'gap', label: 'Skill Gap', icon: Cpu, position: 'top-2 right-6 sm:top-4 sm:right-10', color: '#06B6D4' },
    { id: 'learn', label: 'Learning', icon: GraduationCap, position: 'top-1/2 -left-2 sm:top-1/2 sm:left-2 -translate-y-1/2', color: '#4F46E5' },
    { id: 'assess', label: 'Assessment', icon: Award, position: 'top-1/2 -right-2 sm:top-1/2 sm:right-2 -translate-y-1/2', color: '#F59E0B' },
    { id: 'verify', label: 'Verification', icon: ShieldCheck, position: 'bottom-2 left-6 sm:bottom-4 sm:left-10', color: '#00C98B' },
    { id: 'workforce', label: 'Workforce', icon: Users, position: 'bottom-2 right-6 sm:bottom-4 sm:right-10', color: '#6366F1' },
  ];

  const handleSelectRoleTab = (role) => {
    setSelectedRoleTab(role);
    setErrorMessage('');
    if (role === 'ADMIN') {
      setEmail('admin@skillsetu.com');
      setPassword('admin123');
    } else {
      setEmail('rahul@skillsetu.com');
      setPassword('123456');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setEmail('rahul@skillsetu.com');
    setPassword('123456');
    setSelectedRoleTab('EMPLOYEE');
    setErrorMessage('');
    setIsSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const result = await login(email, password, rememberMe);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setCurrentUser(result.user);
          setIsLoading(false);
          if (onLoginSuccess) {
            onLoginSuccess(result.user);
          }
        }, 350);
      } else {
        setErrorMessage(result.message || 'Invalid email or password');
        setIsLoading(false);
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex flex-col lg:flex-row relative selection:bg-[#00B87A] selection:text-white overflow-x-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00B87A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4F46E5]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-[#06B6D4]/5 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================================
          LEFT SIDE: Brand + AI Competency Intelligence Visualization
          ========================================================================= */}
      <div className="w-full lg:w-7/12 flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10 border-b lg:border-b-0 lg:border-r border-slate-200/80 bg-[#F8FAFC]">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 entrance-1">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00B87A] via-[#00C98B] to-[#4F46E5] p-[1.5px] shadow-md shadow-[#00B87A]/15">
              <div className="flex items-center justify-center w-full h-full bg-[#0F172A] rounded-[14px]">
                <Sparkles className="w-5 h-5 text-[#00C98B]" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-[#0F172A] font-heading block leading-none">
                SkillSetu
              </span>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Competency Intelligence Platform
              </p>
            </div>
          </div>

          {/* AI Status Indicator */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B87A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00B87A]"></span>
            </span>
            <span className="text-[#0F172A] font-semibold">AI Engine Ready</span>
          </div>
        </div>

        {/* Center Content: Hero Statement & AI Network Visual */}
        <div className="my-8 lg:my-auto max-w-2xl">
          {/* Hero Statement */}
          <div className="entrance-2 mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15] font-heading">
              Discover skills.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B87A] via-[#06B6D4] to-[#4F46E5]">
                Identify gaps.
              </span>{' '}
              Build capabilities.
            </h1>
            <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Empowering enterprise workforce capability through AI-driven competency mapping and real-time skill intelligence.
            </p>
          </div>

          {/* AI Competency Intelligence Network Visual */}
          <div className="relative w-full h-64 sm:h-80 my-4 rounded-3xl bg-white/60 border border-slate-200/90 shadow-sm p-4 backdrop-blur-xs flex items-center justify-center entrance-3 overflow-hidden">
            {/* SVG Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00B87A" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <line x1="50%" y1="50%" x2="20%" y2="18%" stroke="url(#lineGrad)" strokeWidth="1.5" className="animate-line-dash" />
              <line x1="50%" y1="50%" x2="80%" y2="18%" stroke="url(#lineGrad)" strokeWidth="1.5" className="animate-line-dash" />
              <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="url(#lineGrad)" strokeWidth="1.5" className="animate-line-dash" />
              <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="url(#lineGrad)" strokeWidth="1.5" className="animate-line-dash" />
              <line x1="50%" y1="50%" x2="20%" y2="82%" stroke="url(#lineGrad)" strokeWidth="1.5" className="animate-line-dash" />
              <line x1="50%" y1="50%" x2="80%" y2="82%" stroke="url(#lineGrad)" strokeWidth="1.5" className="animate-line-dash" />
            </svg>

            {/* Central Node: AI Competency Twin */}
            <div className="relative z-20 flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-[#0F172A] text-white shadow-xl shadow-[#0F172A]/20 border border-slate-700/80 animate-pulse-glow">
              <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#00B87A] to-[#06B6D4] text-white mb-1.5 shadow-md shadow-[#00B87A]/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-tight font-heading">AI Competency Twin</span>
              <span className="text-[10px] text-[#00C98B] font-mono mt-0.5">Core Vector Engine</span>
            </div>

            {/* Peripheral Nodes */}
            {networkNodes.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.id}
                  className={`absolute z-10 ${node.position} flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200`}
                >
                  <div
                    className="p-1 rounded-lg"
                    style={{ backgroundColor: `${node.color}15`, color: node.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700">{node.label}</span>
                </div>
              );
            })}
          </div>

          {/* 3 Decorative Informational Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 entrance-3">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm animate-float-slow">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#00B87A]" />
                <span className="text-xs font-bold text-[#0F172A]">AI Competency Twin</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Real-time dynamic proficiency vector mapping.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm animate-float-reverse">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                <span className="text-xs font-bold text-[#0F172A]">Credential Audit</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Evidence-based multi-tier skill verification.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm animate-float-slow">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                <span className="text-xs font-bold text-[#0F172A]">Workforce Readiness</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Predictive opportunity allocation index.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Trust Line */}
        <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 entrance-4">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#00B87A]" />
            <span>Secure enterprise access</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Role-Based Access &bull; AI-Assisted &bull; Workforce Intelligence
          </span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT SIDE: Crisp Polished Sign-In Card (420–480px width)
          ========================================================================= */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-[#F8FAFC] relative z-10">
        <div className="w-full max-w-[460px] entrance-4">
          {/* Main Login Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            {currentUser ? (
              /* Authenticated Active Session View */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B87A]/10 border border-[#00B87A]/25 text-xs font-semibold text-[#00B87A]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authenticated Session Active</span>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-mono font-semibold rounded-md border ${
                    currentUser.role === 'ADMIN'
                      ? 'bg-[#00B87A]/15 text-[#00B87A] border-[#00B87A]/30'
                      : 'bg-[#4F46E5]/15 text-[#4F46E5] border-[#4F46E5]/30'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight font-heading">
                    Welcome, {currentUser.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Your authenticated role is active and ready for the application workspace.
                  </p>
                </div>

                <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-11 h-11 text-white font-bold text-sm rounded-xl shadow-md ${
                      currentUser.role === 'ADMIN'
                        ? 'bg-gradient-to-tr from-[#00B87A] to-[#00C98B]'
                        : 'bg-gradient-to-tr from-[#4F46E5] to-[#6366F1]'
                    }`}>
                      {currentUser.avatar || 'US'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[#0F172A] truncate">
                          {currentUser.name}
                        </p>
                        {currentUser.role === 'ADMIN' ? (
                          <Shield className="w-3.5 h-3.5 text-[#00B87A]" />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5 text-[#4F46E5]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono truncate">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                    <span className="text-slate-400">Designated Role:</span>
                    <span className="font-semibold text-[#0F172A]">{currentUser.role}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-slate-200 text-[#0F172A] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out / Switch Account</span>
                </button>
              </div>
            ) : (
              /* Standard Polish Sign-In Form */
              <>
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight font-heading">
                    Welcome back
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                    Sign in to your SkillSetu workspace
                  </p>
                </div>

                {/* Role Switcher Options: User / Employee vs Admin */}
                <div className="flex p-1 mb-6 rounded-2xl bg-slate-100/90 border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => handleSelectRoleTab('EMPLOYEE')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      selectedRoleTab === 'EMPLOYEE'
                        ? 'bg-white text-[#0F172A] shadow-sm border border-slate-200/70 font-bold'
                        : 'text-slate-500 hover:text-[#0F172A]'
                    }`}
                  >
                    <UserCheck className={`w-3.5 h-3.5 ${selectedRoleTab === 'EMPLOYEE' ? 'text-[#4F46E5]' : 'text-slate-400'}`} />
                    <span>User / Employee</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectRoleTab('ADMIN')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      selectedRoleTab === 'ADMIN'
                        ? 'bg-white text-[#0F172A] shadow-sm border border-slate-200/70 font-bold'
                        : 'text-slate-500 hover:text-[#0F172A]'
                    }`}
                  >
                    <Shield className={`w-3.5 h-3.5 ${selectedRoleTab === 'ADMIN' ? 'text-[#00B87A]' : 'text-slate-400'}`} />
                    <span>Admin Login</span>
                  </button>
                </div>

                {/* Error Message Display with subtle shake */}
                {errorMessage && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5 animate-subtle-shake">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{errorMessage}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@organization.com"
                        className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-slate-300 rounded-xl text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#00B87A] focus:ring-2 focus:ring-[#00B87A]/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="password"
                        className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-xs font-semibold text-[#4F46E5] hover:text-[#6366F1] transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-3 bg-[#F8FAFC] border border-slate-300 rounded-xl text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#00B87A] focus:ring-2 focus:ring-[#00B87A]/20 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#F8FAFC] border-slate-300 text-[#00B87A] focus:ring-[#00B87A] accent-[#00B87A] cursor-pointer"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2.5 text-xs font-medium text-slate-600 cursor-pointer select-none"
                    >
                      Remember my session on this device
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#00B87A] to-[#00C98B] hover:from-[#00A36C] hover:to-[#00B87A] text-white text-sm font-semibold rounded-xl shadow-lg shadow-[#00B87A]/20 hover:shadow-[#00B87A]/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#00B87A] focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isSuccess ? '✓ Authentication successful' : 'Authenticating...'}</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password / Demo Credentials Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl">
            <h3 className="text-base font-semibold text-[#0F172A]">Platform Demo Credentials</h3>
            <p className="text-xs text-slate-500 mt-2">
              For this prototype, use the credentials corresponding to your role:
            </p>
            <div className="mt-4 space-y-2.5">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 font-mono text-xs text-[#0F172A]">
                <span className="font-semibold text-[#00B87A] block font-sans text-[11px] uppercase tracking-wider mb-1">Admin Account</span>
                <span className="text-slate-500">Email:</span> admin@skillsetu.com<br />
                <span className="text-slate-500">Password:</span> admin123
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 font-mono text-xs text-[#0F172A]">
                <span className="font-semibold text-[#4F46E5] block font-sans text-[11px] uppercase tracking-wider mb-1">Employee / Official</span>
                <span className="text-slate-500">Email:</span> rahul@skillsetu.com<br />
                <span className="text-slate-500">Password:</span> 123456
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="mt-5 w-full py-2.5 bg-[#00B87A] hover:bg-[#00A36C] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
