import React, { useState } from 'react';
import { useApp } from '../AppContext';
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

export const AuthPages: React.FC<{ subView: 'login' | 'register-candidate-1' | 'register-recruiter' | 'verify-email' }> = ({ subView }) => {
  const { login, registerCandidate, registerRecruiter, navigate, showToast } = useApp();

  // Common authentication state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Candidate Step 2 states
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // Recruiter specific states
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [size, setSize] = useState('11-50 employees');

  // Verify Email simulated state
  const [verificationSent, setVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(60);

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
        await registerCandidate({
          firstName, lastName, email, password,
          bio: bio || undefined,
          skills: skills.length > 0 ? skills : undefined,
          linkedinUrl: linkedin || undefined,
        });
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
      await registerRecruiter({
        companyName, firstName, lastName, email, password,
        industry, companySize: size,
      });
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
    showToast('Verification link transmitted successfully.', 'success');
  };

  const simulateSuccessVerify = () => {
    setIsVerified(true);
    showToast('Email verified! Navigating to dashboard...', 'success');
    setTimeout(() => {
      navigate('candidate-dashboard');
    }, 1500);
  };

  return (
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
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">Login to Account</h3>
                <p className="text-gray-500 text-xs">Enter credentials to manage candidate screening</p>
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
                    <button type="button" onClick={() => navigate('help')} className="text-[11px] text-blue-600 hover:underline">Forgot password?</button>
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
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">Create Candidate Account</h3>
                <p className="text-gray-500 text-xs">Step {step} of 2 - {step === 1 ? 'Basic Coordinates' : 'Experience & Setup'}</p>
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
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 border border-gray-300 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <label htmlFor="terms" className="text-[11px] text-gray-600 ml-2 select-none">
                      I agree to terms of server evaluation policy and consent to recording interview dialogue.
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
                      <button type="button" className="py-1 px-3 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-[11px] font-semibold text-gray-800">Choose File</button>
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
                    <span>{step === 1 ? 'Build step 2' : 'Finalize Registration'}</span>
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
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">Setup Enterprise Portal</h3>
                <p className="text-gray-500 text-xs">Verify your corporate email framework</p>
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
                  <select 
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full h-10 px-2 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none"
                  >
                    <option>Technology & Consulting</option>
                    <option>Finance & Banking</option>
                    <option>Healthcare & Pharma</option>
                    <option>E-Commerce & Retail</option>
                    <option>Edu-Tech / Education</option>
                  </select>
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
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <label htmlFor="terms-recruiter" className="text-[11px] text-gray-600 ml-2 select-none">
                    Confirm alignment with corporate workspace evaluation criteria and terms of use.
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
                  <span>Build Org Workspace</span>
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
                  A verification transmission coordinate was linked to your sandbox email. Press the button below to fast-track verification.
                </p>
              </div>

              {isVerified ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl inline-flex items-center gap-2 text-green-700 text-xs font-semibold shadow-inner">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Verified successfully! Launching dashboard controls...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <button 
                    type="button"
                    onClick={simulateSuccessVerify}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    <span>Confirm verification in simulator</span>
                  </button>

                  <div className="pt-2">
                    <button 
                      type="button" 
                      onClick={triggerVerificationResend}
                      disabled={verificationSent}
                      className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 font-semibold"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{verificationSent ? `Verification re-dispatched.` : `Resend validation link in (${countdown}s)`}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
