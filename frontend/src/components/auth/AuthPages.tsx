import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useApp } from '../AppContext';
import { useCMS } from '../admin/AdminCMS';
import { 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertCircle, 
  Mail, 
  Building, 
  User, 
  ArrowRight, 
  ClipboardCheck, 
  Clock, 
  Lock 
} from 'lucide-react';

export const AuthPages: React.FC<{ subView: 'login' | 'register-candidate-1' | 'register-recruiter' | 'verify-email' | 'forgot-password' }> = ({ subView }) => {
  const { login, registerCandidate, registerRecruiter, navigate, showToast } = useApp();
  const cms = useCMS();

  // Common authentication state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Candidate Step 2 states
  const [step, setStep] = useState(1);
  const [registeredRole, setRegisteredRole] = useState<'candidate' | 'recruiter' | null>(null);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [fpEmail, setFpEmail] = useState('');
  const [fpStep, setFpStep] = useState<'email' | 'otp' | 'newPassword' | 'done'>('email');
  const [fpOtp, setFpOtp] = useState('');
  const [fpNewPassword, setFpNewPassword] = useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = useState('');
  const [fpError, setFpError] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Recruiter specific states
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [customIndustry, setCustomIndustry] = useState('');
  const [size, setSize] = useState('11-50 employees');

  // Verify Email simulated state
  const [verificationSent, setVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendCooldown, setResendCooldown] = useState(0);
  useEffect(() => {
    if (subView !== 'verify-email' || isVerified) return;
    if (countdown <= 0) { setVerificationSent(false); return; }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [subView, isVerified, countdown]);
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Password complex validations
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const strength = Object.values(checks).filter(Boolean).length;
  const strengthColor = 
    strength <= 1 ? 'bg-red-500' :
    strength === 3 ? 'bg-orange-500' : 'bg-green-500';
  const strengthText = 
    strength <= 1 ? 'Weak' :
    strength === 3 ? 'Fair' : 'Strong';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Email and password are required.');
      return;
    }
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (!success) setErrorMsg('Invalid email or password.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCandidateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (step === 1) {
      if (!firstName || !lastName || !email || !password) {
        setErrorMsg('Please fill in all required fields.');
        return;
      }
      if (!checks.length || !checks.upper || !checks.number) {
        setErrorMsg('Password needs 8+ chars, uppercase, and a number.');
        return;
      }
      if (!termsAccepted) {
        setErrorMsg('You must agree to the QANI terms.');
        return;
      }
      setStep(2);
    } else {
      setIsLoading(true);
      try {
        const newUser = await registerCandidate({
          firstName, lastName, email, password,
          bio: bio || undefined,
          skills: skills.length > 0 ? skills : undefined,
          linkedinUrl: linkedin || undefined,
        });
        setRegisteredUser(newUser);
        if (resumeFile) {
          const reader = new FileReader();
          reader.onload = () => {
            const cvData = reader.result as string;
            api.uploadCV(newUser.id, cvData, resumeFile.name).catch(console.error);
          };
          reader.readAsDataURL(resumeFile);
        }
        api.sendOTP(newUser.email, 'email', newUser.id).catch(console.error);
        setResendCooldown(30);
        setRegisteredRole('candidate');
        navigate('verify-email');
      } catch (err: any) {
        setErrorMsg(err.message || 'Registration failed. Email may already be in use.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRecruiterRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!companyName || !firstName || !lastName || !email || !password) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Agreement to platform terms is required.');
      return;
    }
    setIsLoading(true);
    try {
      const newUser = await registerRecruiter({
        companyName, firstName, lastName, email, password,
        industry: (industry === 'Other' && customIndustry.trim()) ? customIndustry.trim() : industry, companySize: size,
      });
      setRegisteredRole('recruiter');
      setRegisteredUser(newUser);
      api.sendOTP(newUser.email, 'email', newUser.id).catch(console.error);
      setResendCooldown(30);
      navigate('verify-email');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => {
    setSkills(skills.filter(x => x !== s));
  };

  const triggerVerificationResend = () => {
    setVerificationSent(true);
    setCountdown(60);
    showToast('Verification link transmitted successfully.', 'success');
  };
  const handleVerifyOTP = async () => {
    if (!registeredUser || otpInput.length !== 6) {
      setOtpError('Please enter the 6-digit code sent to your email.');
      return;
    }
    setOtpVerifying(true);
    setOtpError('');
    try {
      await api.verifyOTPCode(registeredUser.email, 'email', otpInput, registeredUser.id);
      setIsVerified(true);
      showToast('Email verified! Navigating to dashboard...', 'success');
      setTimeout(() => {
        navigate(registeredRole === 'recruiter' ? 'recruiter-dashboard' : 'candidate-dashboard');
      }, 1500);
    } catch (err: any) {
      setOtpError(err.message || 'Invalid or expired code. Please try again.');
    } finally {
      setOtpVerifying(false);
    }
  };
  const resendOTP = () => {
    if (!registeredUser || resendCooldown > 0) return;
    api.sendOTP(registeredUser.email, 'email', registeredUser.id).catch(console.error);
    setResendCooldown(30);
    triggerVerificationResend();
  };
  const handleForgotPasswordSubmit = async () => {
    if (!fpEmail) { setFpError('Please enter your email address.'); return; }
    setFpLoading(true);
    setFpError('');
    try {
      const res = await fetch('https://qani.io/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fpEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setFpStep('otp');
        showToast('If that email exists, a reset code has been sent.', 'success');
      } else {
        setFpError(data.error || 'Failed to send reset code.');
      }
    } catch {
      setFpError('Failed to send reset code. Try again.');
    }
    setFpLoading(false);
  };
  const handleResetPasswordSubmit = async () => {
    if (fpOtp.length !== 6) { setFpError('Please enter the 6-digit code.'); return; }
    if (fpNewPassword.length < 8) { setFpError('Password must be at least 8 characters.'); return; }
    if (fpNewPassword !== fpConfirmPassword) { setFpError('Passwords do not match.'); return; }
    setFpLoading(true);
    setFpError('');
    try {
      const res = await fetch('https://qani.io/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fpEmail, otp: fpOtp, newPassword: fpNewPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setFpStep('done');
        showToast('Password reset successfully!', 'success');
      } else {
        setFpError(data.error || 'Failed to reset password.');
      }
    } catch {
      setFpError('Failed to reset password. Try again.');
    }
    setFpLoading(false);
  };
  return (
    <>
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans bg-gray-50">
      {/* Left graphic banner */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#1E293B] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract background grids */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="z-10 flex items-center gap-3 cursor-pointer group" onClick={() => navigate('landing')}>
          <div className="relative flex items-center justify-center w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg transform rotate-3 shadow-md group-hover:rotate-6 transition-all duration-300" />
            <div className="relative w-7.5 h-7.5 bg-gray-900 rounded border border-gray-800 flex items-center justify-center font-mono font-extrabold text-white text-xs tracking-tighter">
              Q
            </div>
          </div>
          <span className="font-extrabold tracking-wider text-xl text-white group-hover:text-blue-400 transition duration-300">QANI Platform</span>
        </div>

        <div className="z-10 space-y-4">
          <span className="text-xs bg-blue-900/60 border border-blue-800 text-blue-300 font-semibold py-1 px-3 rounded-full uppercase tracking-wider">
            Secured server sandbox
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">AI Recruitment Screen Core</h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Validate experience parameters, filter compensation configurations, and score work capability indices flawlessly using direct server integrations.
          </p>
        </div>

        <p className="z-10 text-xs text-gray-500 font-mono">
          © 2026 QANI Corp | Singapore Security Node
        </p>
      </div>

      {/* Right form card wrapper */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div id="auth-box-card" className="w-full max-w-lg bg-white border border-gray-200 shadow-2xl rounded-2xl p-8 space-y-6">
          {errorMsg && (
            <div id="auth-error-banner" className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* VIEW: LOGIN */}
          {subView === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">{cms.loginPage?.tagline || "Welcome back to QANI"}</h3>
                <p className="text-gray-500 text-xs">{cms.loginPage?.subtagline || "Your AI recruitment platform"}</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-gray-700 block">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input 
                      id="email"
                      type="email"
                      required
                      placeholder="e.g. candidate@qani.ai or recruiter@qani.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-lg text-sm pl-11 pr-4 transition outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono text-center block">
                    Use <strong className="text-blue-600">candidate@qani.ai</strong> or <strong className="text-blue-600">recruiter@qani.ai</strong> for immediate demo logins.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="pass" className="text-xs font-semibold text-gray-700">Password</label>
                    <button type="button" onClick={() => navigate('forgot-password')} className="text-[11px] text-blue-600 hover:underline">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input 
                      id="pass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-lg text-sm pl-11 pr-11 transition outline-none animate_password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input 
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="text-xs text-gray-600 ml-2 cursor-pointer select-none">Remember this browser session</label>
                </div>
              </div>

              <button 
                id="login-btn-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg text-xs transition uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Log In Securely</span>
                )}
              </button>

              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button 
                  type="button"
                  id="nav-to-candidate-reg"
                  onClick={() => navigate('auth-register-candidate-1')}
                  className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-semibold rounded-lg text-xs transition"
                >
                  Register Candidate Profile
                </button>
                <button 
                  type="button"
                  id="nav-to-recruiter-reg"
                  onClick={() => navigate('auth-register-recruiter')}
                  className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-semibold rounded-lg text-xs transition"
                >
                  Create Company Portal
                </button>
              </div>
            </form>
          )}

          {/* VIEW: REGISTER CANDIDATE */}
          {subView === 'register-candidate-1' && (
            <form onSubmit={handleCandidateRegister} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-blue-600 font-bold tracking-wider">Candidate Hub</span>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">{cms.registerCandidate?.title || "Join as a Candidate"}</h3>
                <p className="text-gray-500 text-xs">{cms.registerCandidate?.subtitle || "Create your profile and get AI-screened for top Australian jobs."}</p>
              </div>

              {/* Step 1 input fields */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.55">
                      <label className="text-xs font-semibold text-gray-700 block">First Name</label>
                      <input 
                        type="text"
                        required
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full h-10 px-3 bg-gray-50 border border-gray-300 focus:bg-white focus:border-blue-500 rounded-lg text-xs outline-none transition"
                      />
                    </div>
                    <div className="space-y-1.55">
                      <label className="text-xs font-semibold text-gray-700 block">Last Name</label>
                      <input 
                        type="text"
                        required
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full h-10 px-3 bg-gray-50 border border-gray-300 focus:bg-white focus:border-blue-500 rounded-lg text-xs outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 block">Email Address</label>
                    <input 
                      type="email"
                      required
                      placeholder="e.g. john.doe@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-300 focus:bg-white focus:border-blue-500 rounded-lg text-xs outline-none transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 block">Secure Password</label>
                    <input 
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-300 focus:bg-white focus:border-blue-500 rounded-lg text-xs outline-none transition"
                    />
                    
                    {/* strength meter lines */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-500">
                        <span>Strength Score:</span>
                        <span className="text-blue-600">{strengthText}</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden flex">
                        <div className={`h-full ${strengthColor}`} style={{ width: `${(strength / 4) * 100}%` }} />
                      </div>
                      {/* password requirements */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 pt-1">
                        <span className="flex items-center gap-1">
                          {checks.length ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-gray-300" />}
                          <span>Minimum 8 chars</span>
                        </span>
                        <span className="flex items-center gap-1">
                          {checks.upper ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-gray-300" />}
                          <span>1 Uppercase (A-Z)</span>
                        </span>
                        <span className="flex items-center gap-1">
                          {checks.number ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-gray-300" />}
                          <span>1 Number (0-9)</span>
                        </span>
                        <span className="flex items-center gap-1">
                          {checks.special ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-gray-300" />}
                          <span>1 Special Character</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input 
                      id="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={() => { if (!termsAccepted) { setShowTermsModal(true); } else { setTermsAccepted(false); } }}
                      className="w-4 h-4 border border-gray-300 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <label htmlFor="terms" className="text-[11px] text-gray-600 ml-2 select-none">
                      I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="text-blue-600 underline hover:text-blue-800">Terms & Conditions</button> and consent to recording interview dialogue.
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2 Inputs */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 block">Brief Professional Summary (Bio)</label>
                    <textarea 
                      placeholder="e.g. Full Stack Architect with a passion for designing container operations..."
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-300 focus:bg-white focus:border-blue-500 rounded-lg text-xs outline-none transition resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 block">Skills Tags</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="e.g. React, Docker (Enter to Add)"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                        className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none"
                      />
                      <button type="button" onClick={addSkill} className="px-4 bg-gray-900 text-white font-semibold rounded-lg text-xs">Add</button>
                    </div>
                    {/* selected skill list chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {skills.map(s => (
                        <span key={s} className="inline-flex items-center gap-1 text-[11px] bg-blue-50 border border-blue-200 text-blue-700 py-1 px-2.5 rounded-full font-medium">
                          <span>{s}</span>
                          <button type="button" onClick={() => removeSkill(s)} className="text-blue-500 hover:text-blue-700 font-bold">×</button>
                        </span>
                      ))}
                      {skills.length === 0 && <span className="text-gray-400 text-[10px] italic">No skill tags added yet.</span>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 block">LinkedIn Profile URL</label>
                    <input 
                      type="url"
                      placeholder="https://linkedin.com/in/url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center space-y-1">
                    <span className="text-xs block font-bold text-gray-700">Attach Resume (PDF/DOC)</span>
                    <p className="text-[10px] text-gray-500">Maximum file size 8MB</p>
                    <div className="pt-2">
                      {resumeFile ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-[11px] font-semibold text-gray-700">{resumeFile.name}</span>
                          <button type="button" onClick={() => setResumeFile(null)} className="text-[11px] text-red-500 hover:text-red-700 font-semibold">Remove</button>
                        </div>
                      ) : (
                        <label className="inline-block py-1 px-3 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-[11px] font-semibold text-gray-800 cursor-pointer">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 8 * 1024 * 1024) { setErrorMsg('File too large. Max 8MB.'); return; }
                              setResumeFile(file);
                            }}
                          />
                          Choose File
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                {step === 2 && (
                  <button type="button" onClick={() => setStep(1)} className="py-2 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg text-xs uppercase tracking-wider">
                    Back
                  </button>
                )}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg text-xs transition uppercase tracking-wider flex items-center justify-center gap-1"
                >
                  {isLoading ? (
                    <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{step === 1 ? 'Continue to Profile' : 'Create My Account'}</span>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button type="button" onClick={() => navigate('auth-login')} className="text-xs text-blue-600 hover:underline">Already registered? Log In</button>
              </div>
            </form>
          )}

          {/* VIEW: REGISTER RECRUITER */}
          {subView === 'register-recruiter' && (
            <form onSubmit={handleRecruiterRegister} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-blue-600 font-bold tracking-wider">Hiring Workspace</span>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">{cms.registerRecruiter?.title || "Start Recruiting with AI"}</h3>
                <p className="text-gray-500 text-xs">{cms.registerRecruiter?.subtitle || "Post jobs and let QANI's AI screen candidates 24/7."}</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <label htmlFor="comp-name" className="text-xs font-semibold text-gray-700 block">Company Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input 
                      id="comp-name"
                      type="text"
                      required
                      placeholder="e.g. Acme Tech Solutions"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full h-10 pl-10 pr-3 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 block">Your First Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="Sarah"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 block">Your Last Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="Chen"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 block">Interviewer Email Address</label>
                  <input 
                    type="email"
                    required
                    placeholder="e.g. sarah.chen@acme.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none"
                  />
                  <span className="text-[10px] text-gray-400 block font-mono">Requires corporate workspace handles to validate organization bounds.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 block">Company Size</label>
                  <select 
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full h-10 px-2 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none"
                  >
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>51-200 employees</option>
                    <option>200-500 employees</option>
                    <option>500+ employees</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 block">Primary Category / Industry</label>
                  <input
                    type="text"
                    list="industry-options"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Start typing to search..."
                    className="w-full h-10 px-2 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none"
                  />
                  <datalist id="industry-options">
                    <option value="Technology & Consulting" />
                    <option value="Software & SaaS" />
                    <option value="Construction & Real Estate" />
                    <option value="Finance & Banking" />
                    <option value="Insurance" />
                    <option value="Healthcare & Pharma" />
                    <option value="Biotechnology" />
                    <option value="E-Commerce & Retail" />
                    <option value="Edu-Tech / Education" />
                    <option value="Manufacturing & Logistics" />
                    <option value="Government & Non-Profit" />
                    <option value="Hospitality & Tourism" />
                    <option value="Media & Entertainment" />
                    <option value="Telecommunications" />
                    <option value="Energy & Utilities" />
                    <option value="Agriculture & Farming" />
                    <option value="Legal Services" />
                    <option value="Marketing & Advertising" />
                    <option value="Automotive" />
                    <option value="Mining & Resources" />
                    <option value="Transportation" />
                    <option value="Food & Beverage" />
                    <option value="Aerospace & Defense" />
                    <option value="Other" />
                  </datalist>
                  {industry === 'Other' && (
                    <input
                      type="text"
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      placeholder="Please specify your industry"
                      className="w-full h-10 px-2 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none mt-1.5"
                    />
                  )}
                </div>


                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 block">Interviewer Password</label>
                  <input 
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none"
                  />
                </div>

                <div className="flex items-start">
                  <input 
                    id="terms-recruiter"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={() => { if (!termsAccepted) { setShowTermsModal(true); } else { setTermsAccepted(false); } }}
                    className="w-4 h-4 border border-gray-300 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <label htmlFor="terms-recruiter" className="text-[11px] text-gray-600 ml-2 select-none">
                    Confirm alignment with corporate workspace evaluation criteria and the <button type="button" onClick={() => setShowTermsModal(true)} className="text-blue-600 underline hover:text-blue-800">Terms & Conditions</button>.
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gray-950 hover:bg-gray-900 disabled:bg-gray-800 text-white font-semibold rounded-lg text-xs transition uppercase tracking-wider flex items-center justify-center gap-1"
              >
                {isLoading ? (
                  <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Create Recruiter Account</span>
                )}
              </button>

              <div className="text-center pt-2">
                <button type="button" onClick={() => navigate('auth-login')} className="text-xs text-blue-600 hover:underline">Already have company access? Log In</button>
              </div>
            </form>
          )}
          {/* VIEW: EMAIL VERIFICATION */}
          {subView === 'verify-email' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-100/30">
                  <Mail className="w-8 h-8" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-gray-900">Verify Your Email Address</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  We've sent a 6-digit verification code to {registeredUser?.email || 'your email'}. Enter it below to verify your account.
                  <span className="block mt-1 text-amber-600">Don't see it? Check your spam or junk folder.</span>
                </p>
              </div>
              {isVerified ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl inline-flex items-center gap-2 text-green-700 text-xs font-semibold shadow-inner">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Verified successfully! Launching dashboard controls...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="w-full h-12 px-4 text-center text-lg font-bold tracking-widest bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                  {otpError && (
                    <p className="text-xs text-red-600 font-semibold">{otpError}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={otpVerifying || otpInput.length !== 6}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg text-xs transition uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    <span>{otpVerifying ? 'Verifying...' : 'Verify Code'}</span>
                  </button>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={resendOTP}
                      disabled={resendCooldown > 0}
                      className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 font-semibold"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{resendCooldown > 0 ? `Resend code in (${resendCooldown}s)` : 'Resend code'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {subView === 'forgot-password' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-100/30">
                  <Mail className="w-8 h-8" />
                </div>
              </div>
              {fpStep === 'email' && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900">Reset Your Password</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">Enter your email address and we'll send you a 6-digit code to reset your password.</p>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="email"
                      value={fpEmail}
                      onChange={(e) => { setFpEmail(e.target.value); setFpError(''); }}
                      placeholder="you@email.com"
                      className="w-full h-10 px-3.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                    {fpError && <p className="text-xs text-red-600 font-semibold">{fpError}</p>}
                    <button
                      type="button"
                      onClick={handleForgotPasswordSubmit}
                      disabled={fpLoading}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg text-xs transition uppercase tracking-wider"
                    >
                      {fpLoading ? 'Sending...' : 'Send Reset Code'}
                    </button>
                    <button type="button" onClick={() => navigate('auth-login')} className="text-xs text-blue-600 hover:underline">Back to Log In</button>
                  </div>
                </>
              )}
              {fpStep === 'otp' && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900">Enter Reset Code</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">We've sent a 6-digit code to {fpEmail}.</p>
                    <p className="text-xs text-amber-600 font-semibold">Don't see it? Check your spam or junk folder.</p>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={fpOtp}
                      onChange={(e) => { setFpOtp(e.target.value.replace(/[^0-9]/g, '')); setFpError(''); }}
                      placeholder="Enter 6-digit code"
                      className="w-full h-12 px-4 text-center text-lg font-bold tracking-widest bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    />
                    <input
                      type="password"
                      value={fpNewPassword}
                      onChange={(e) => { setFpNewPassword(e.target.value); setFpError(''); }}
                      placeholder="New password (min 8 characters)"
                      className="w-full h-10 px-3.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                    <input
                      type="password"
                      value={fpConfirmPassword}
                      onChange={(e) => { setFpConfirmPassword(e.target.value); setFpError(''); }}
                      placeholder="Confirm new password"
                      className="w-full h-10 px-3.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                    {fpError && <p className="text-xs text-red-600 font-semibold">{fpError}</p>}
                    <button
                      type="button"
                      onClick={handleResetPasswordSubmit}
                      disabled={fpLoading}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg text-xs transition uppercase tracking-wider"
                    >
                      {fpLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                    <button type="button" onClick={handleForgotPasswordSubmit} className="text-xs text-blue-600 hover:underline">Resend Code</button>
                  </div>
                </>
              )}
              {fpStep === 'done' && (
                <>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl inline-flex items-center gap-2 text-green-700 text-xs font-semibold shadow-inner">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Password reset successfully!</span>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => navigate('auth-login')}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition uppercase tracking-wider"
                    >
                      Go to Log In
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    {showTermsModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">QANI Terms & Conditions</h2>
            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
            >
              &times;
            </button>
          </div>
          <div className="overflow-y-auto p-6 space-y-4 text-xs text-gray-600 leading-relaxed">
            <p><strong>Last updated: June 2026</strong></p>

            <h3 className="text-sm font-bold text-gray-900 pt-2">1. Acceptance of Terms</h3>
            <p>By creating an account, accessing, or using the QANI platform ("Service"), operated by QANI ("we", "us", "our"), you ("User") agree to be bound by these Terms & Conditions ("Terms"). If you do not agree, you must not use the Service. Continued use of the Service constitutes ongoing acceptance of these Terms as they may be updated from time to time.</p>

            <h3 className="text-sm font-bold text-gray-900 pt-2">2. Nature of the Service</h3>
            <p>QANI provides an AI-assisted conversational screening and recruitment support tool. QANI is a qualification and information-gathering layer only. QANI does not make hiring decisions, does not guarantee employment outcomes, and is not a substitute for an employer's own judgment, compliance obligations, or legal duties in hiring. All hiring decisions remain solely the responsibility of the recruiter, company, or organization using the Service ("Recruiter Users").</p>

            <h3 className="text-sm font-bold text-gray-900 pt-2">3. No Warranty; AI Limitations</h3>
            <p>The Service, including all AI-generated scores, assessments, transcripts, and recommendations, is provided "as is" and "as available" without warranties of any kind, whether express, implied, or statutory, including but not limited to warranties of accuracy, completeness, merchantability, fitness for a particular purpose, or non-infringement. AI-generated outputs may contain errors, omissions, or biases. Users acknowledge that automated scoring is probabilistic and must not be relied upon as the sole basis for any employment decision.</p>

            <h3 className="text-sm font-bold text-gray-900 pt-2">4. Limitation of Liability</h3>
            <p>To the maximum extent permitted by applicable law, QANI, its officers, directors, employees, contractors, and affiliates shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including but not limited to loss of profits, data, goodwill, or business opportunity, arising from or related to use of the Service, even if advised of the possibility of such damages. QANI's total cumulative liability arising out of or relating to these Terms or the Service shall not exceed the lesser of (a) the total fees paid by the User to QANI in the twelve (12) months preceding the claim, or (b) one hundred Australian dollars (AUD $100).</p>

            <h3 className="text-sm font-bold text-gray-900 pt-2">5. Indemnification</h3>
            <p>User agrees to indemnify, defend, and hold harmless QANI and its affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or related to: (a) User's use or misuse of the Service; (b) User's violation of these Terms; (c) any hiring or employment decision made by a Recruiter User; (d) any content, data, or information submitted by User; or (e) User's violation of any applicable law or third-party right.</p>

            <h3 className="text-sm font-bold text-gray-900 pt-2">6. Data Collection, Recording, and Use</h3>
            <p>By using the Service, User consents to the recording, storage, transcription, and AI-based analysis of interview dialogue, written responses, uploaded documents (including CVs and photographs), and related metadata. QANI may use de-identified and aggregated data to improve, train, and operate its AI systems and services. QANI will handle personal information in accordance with its Privacy Policy and applicable Australian Privacy Principles (APPs), but Users acknowledge inherent risks in any data transmission and storage, and QANI disclaims liability for unauthorized access to the extent permitted by law.</p>

            <h3 className="text-sm font-bold text-gray-900 pt-2">7. Recruiter User Obligations</h3>
            <p>Recruiter Users represent and warrant that their use of the Service, including any job postings, screening criteria, and hiring decisions, complies with all applicable employment, anti-discrimination, privacy, and labor laws in their jurisdiction. QANI is not responsible for ensuring Recruiter User compliance with such laws, and Recruiter Users assume full responsibility and liability for the legality of their hiring practices.</p>

            <h3 className="text-sm font-bold text-gray-900 pt-2">8. Intellectual Property</h3>
            <p>All software, algorithms, AI models, designs, trademarks, and content comprising the Service are and remain the exclusive property of QANI. Nothing in these Terms grants User any right, title, or interest in QANI's intellectual property except a limited, revocable, non-exclusive license to use the Service as intended. AI-generated outputs produced through the Service (including scorecards and summaries) may be used by the Recruiter User for internal hiring purposes only, and QANI retains the right to use such outputs in de-identified, aggregated form for product improvement.</p>

            <h3 className="text-sm font-bold text-gray-900 pt-2">9. Account Suspension and Termination</h3>
            <p>QANI reserves the right, at its sole discretion and without prior notice, to suspend, restrict, or terminate any account suspected of violating these Terms, engaging in fraudulent activity, or misusing the Service. QANI is not liable for any loss arising from such suspension or termination.</p>

            <h3 className="text-sm font-bold text-gray-900 pt-2">10. Dispute Resolution and Governing Law</h3>
            <p>These Terms are governed by the laws of New South Wales, Australia, without regard to conflict-of-law principles. Any dispute arising out of or relating to these Terms or the Service shall first be attempted to be resolved through good-faith negotiation. If unresolved within thirty (30) days, the dispute shall be submitted to confidential binding arbitration administered in Sydney, Australia, except where prohibited by applicable law, and each party shall bear its own legal costs unless the arbitrator determines otherwise. User waives any right to participate in a class action or class-wide arbitration to the extent permitted by law.</p>

            <h3 className="text-sm font-bold text-gray-900 pt-2">11. Changes to the Service and Terms</h3>
            <p>QANI may modify, suspend, or discontinue any part of the Service at any time without liability. QANI may update these Terms from time to time; continued use of the Service after such updates constitutes acceptance of the revised Terms.</p>

            <h3 className="text-sm font-bold text-gray-900 pt-2">12. Severability and Entire Agreement</h3>
            <p>If any provision of these Terms is found unenforceable, the remaining provisions shall remain in full force and effect. These Terms, together with QANI's Privacy Policy, constitute the entire agreement between User and QANI regarding the Service and supersede any prior agreements.</p>

            <h3 className="text-sm font-bold text-gray-900 pt-2">13. Contact</h3>
            <p>For questions regarding these Terms, contact QANI via the Contact page at qani.io.</p>
          </div>
          <div className="p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => { setTermsAccepted(true); setShowTermsModal(false); }}
              className="w-full py-3 px-4 bg-gray-950 hover:bg-gray-900 text-white font-bold rounded-lg text-sm transition uppercase tracking-wider"
            >
              I Agree
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
