import axios from 'axios';
import React, { useState } from 'react';
import api from '../../services/endpoints';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import useStudentStore from '../../Store/studentstore';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft, Globe, Apple, Key, ArrowLeft } from 'lucide-react';
import Footer from '../mainLayout/Footer';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setStudent } = useStudentStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp, 3: reset password
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(api.student.login, formData);
      const user = res.data.user || res.data.student || res.data?.data?.student;
      const token = res.data.token || res.data?.data?.token;
      if (!user) throw new Error("Invalid response");

      setStudent({ user, token });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      toast.success("Welcome back!");
      navigate(user.role === "admin" || user.role === "instructor" ? "/instructor/dashboard" : "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setOtpLoading(true);
    try {
      await axios.post(api.student.sendOtp, { email: forgotEmail });
      toast.success("OTP sent to your email!");
      setForgotStep(2);

      // Start countdown for resend
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    try {
      await axios.post(api.student.verifyOTP, {
        email: forgotEmail,
        otp
      });
      toast.success("OTP verified successfully!");
      setForgotStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Reset Password - FIXED: Send confirmPassword instead of otp
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setResetLoading(true);
    try {
      // FIX: Send confirmPassword instead of otp to match backend
      await axios.post(api.student.resetPassword, {
        email: forgotEmail,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      });

      toast.success("Password reset successfully! Please login with your new password.");

      setShowForgotPassword(false);
      setForgotStep(1);
      setForgotEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) {
      toast.info(`Please wait ${countdown} seconds before resending`);
      return;
    }

    setOtpLoading(true);
    try {
      await axios.post(api.student.sendOtp, { email: forgotEmail });
      toast.success("OTP resent successfully!");
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const renderForgotPassword = () => {
    return (
      <div className="w-full max-w-md mx-auto">
        <button
          onClick={() => {
            if (forgotStep === 1) {
              setShowForgotPassword(false);
            } else {
              setForgotStep(forgotStep - 1);
              if (forgotStep === 2) setOtp('');
              if (forgotStep === 3) {
                setNewPassword('');
                setConfirmPassword('');
              }
            }
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {forgotStep === 1 && "Forgot Password?"}
            {forgotStep === 2 && "Verify OTP"}
            {forgotStep === 3 && "Reset Password"}
          </h2>
          <p className="text-sm text-gray-500">
            {forgotStep === 1 && "Enter your email to receive a verification code"}
            {forgotStep === 2 && `We've sent a 6-digit code to ${forgotEmail}`}
            {forgotStep === 3 && "Enter your new password below"}
          </p>
        </div>

        {forgotStep === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">
                Email Address
              </label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-full py-4 px-6 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] transition-all text-sm outline-none"
                placeholder="name@example.com"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={otpLoading}
              className="w-full bg-[#0a1628] text-white py-4 rounded-full font-bold hover:bg-[#ba9d25] transition-all duration-300 shadow-sm"
            >
              {otpLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {forgotStep === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">
                Enter OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-gray-50 border border-gray-100 rounded-full py-4 px-6 text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] transition-all outline-none"
                placeholder="000000"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={otpLoading}
              className="w-full bg-[#0a1628] text-white py-4 rounded-full font-bold hover:bg-[#ba9d25] transition-all duration-300 shadow-sm"
            >
              {otpLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0}
                className={`text-sm ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#0078FF] hover:text-[#ba9d25]'} transition-colors`}
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        {forgotStep === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-full py-4 px-6 pr-14 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] transition-all text-sm outline-none"
                  placeholder="••••••••"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-full py-4 px-6 pr-14 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] transition-all text-sm outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full bg-[#0a1628] text-white py-4 rounded-full font-bold hover:bg-[#ba9d25] transition-all duration-300 shadow-sm"
            >
              {resetLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#f8faff] bg-line-grid flex flex-col font-poppins">
      <div className="flex-grow flex items-center justify-center p-4 md:p-8 overflow-hidden">
        <div className="w-full max-w-[1100px] min-h-[600px] md:h-[720px] bg-white rounded-[40px] border border-gray-100 flex overflow-hidden relative shadow-xl">

          {/* Left Section */}
          <div className="w-full md:w-[45%] p-10 md:p-5 flex flex-col justify-between relative z-10 border-r border-gray-50 overflow-y-auto">
            {!showForgotPassword ? (
              <>
                <div>
                  <div className="mb-10">
                    <div className="flex items-center gap-3">
                      <img src="/logo.svg" alt="Roots Classes" className="h-10 w-auto" />
                      <div className="h-6 w-[1px] bg-gray-200" />
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Portal</span>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Login to account</h1>
                    <p className="text-sm text-gray-400">Please enter your verified credentials.</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                      <input
                        type="email" required
                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-full py-4 px-6 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] transition-all text-sm outline-none"
                        placeholder="name@example.com"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"} required
                          value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-full py-4 px-6 pr-14 focus:ring-2 focus:ring-[#0078FF]/20 focus:border-[#0078FF] transition-all text-sm outline-none"
                          placeholder="••••••••"
                        />
                        <button
                          type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs text-gray-900 hover:text-[#ba9d25] transition-colors font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      type="submit" disabled={loading}
                      className="w-full bg-[#0a1628] text-white py-4 rounded-full font-bold hover:bg-[#ba9d25] transition-all duration-300 mt-4 shadow-sm"
                    >
                      {loading ? 'Authenticating...' : 'Sign In Now'}
                    </button>
                  </form>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">
                      <Apple size={16} /> Apple
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">
                      <Globe size={16} /> Google
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-5">
                  <Link to="/register" className="hover:text-gray-900 transition-colors">No account? <span className="text-[#0078FF] border-b border-[#0078FF]">Register</span></Link>
                  <Link to="/" className="hover:text-gray-900 transition-colors">Roots Classes © 2026</Link>
                </div>
              </>
            ) : (
              renderForgotPassword()
            )}
          </div>

          {/* Right Side: Visual Section */}
          <div className="hidden md:flex flex-1 m-4 rounded-[32px] relative overflow-hidden group">
            <img
              src="/assets/student_study.png"
              alt="Students"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#0a1628]/10" />

            <div className="absolute top-0 left-0 bg-[#ffcf5c] p-4 rounded-4xl border border-yellow-800/50 max-w-[200px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-900 mb-1">Live Mentorship</p>
              <p className="text-sm font-bold text-gray-900">Starts in 15 mins</p>
            </div>

            <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[24px] text-white">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Admission Progress</p>
                <span className="text-xs font-bold">Step 2/3</span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#ffcf5c] w-3/4 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;