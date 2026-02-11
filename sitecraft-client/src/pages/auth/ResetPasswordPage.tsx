import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/auth.service';

// Validation schema matching backend requirements
const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one digit')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword(token, data.newPassword, data.confirmPassword);
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Password reset successful! Please login with your new password.' },
        });
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-[#F6C453]/10 rounded-full blur-[140px]" />
        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-[#111111]/80 border border-white/10 py-10 px-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] backdrop-blur-2xl text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-6">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Invalid Link</h2>
            <p className="text-gray-500 text-sm font-bold mb-10 leading-relaxed">
              This access restoration link is invalid or has expired. Please request a new ritual.
            </p>
            <Link
              to="/forgot-password"
              className="group relative w-full h-14 flex justify-center items-center rounded-2xl text-[12px] font-black text-black bg-gradient-to-r from-[#F6C453] to-[#CBA34E] uppercase tracking-[0.2em] transition-all hover:scale-[1.02]"
            >
              Request New Ritual
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-[#F6C453]/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-[#F6C453]/5 rounded-full blur-[120px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-10">
          <div className="h-20 w-20 bg-gradient-to-br from-[#F6C453] to-[#CBA34E] rounded-[1.5rem] flex items-center justify-center shadow-[0_0_40px_rgba(246,196,83,0.25)] transform hover:scale-105 transition-transform duration-500">
            <span className="text-black text-5xl font-black italic">S</span>
          </div>
        </div>
        <h2 className="text-center text-5xl font-black tracking-tighter text-white mb-2 italic">
          Vault <span className="text-[#F6C453]">Renewal</span>
        </h2>
        <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-[0.4em] mb-12">
          Architecture of Digital Luxury
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[440px] relative z-10 px-2 lg:px-0">
        <div className="bg-[#111111]/80 border border-white/10 py-10 px-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] backdrop-blur-2xl">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#F6C453]/10 mb-6">
                <CheckCircle2 className="h-10 w-10 text-[#F6C453]" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                Renewal Complete
              </h2>
              <p className="text-gray-400 text-sm font-bold mb-2">
                Your credentials have been updated.
              </p>
              <p className="text-[#F6C453] text-[10px] font-black uppercase tracking-widest animate-pulse">
                Redirecting to Vault Entrance...
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="text-center mb-4">
                <p className="text-gray-400 text-sm font-medium">
                  Establish a new high-security PIN for your elite access.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-shake">
                  <p className="text-xs text-red-500 font-bold uppercase tracking-wider text-center">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-[#F6C453] uppercase tracking-[0.2em]">New Security PIN</label>
                  {errors.newPassword && <span className="text-[9px] text-red-400 font-bold uppercase">{errors.newPassword.message}</span>}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-600 group-focus-within:text-[#F6C453] transition-colors" />
                  </div>
                  <input
                    {...register('newPassword')}
                    type={showPassword ? 'text' : 'password'}
                    className="block w-full pl-12 pr-12 bg-[#1A1A1A] border-white/5 text-white sm:text-sm rounded-2xl focus:ring-1 focus:ring-[#F6C453]/50 focus:border-[#F6C453] h-14 transition-all duration-300"
                    placeholder="········"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#F6C453] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-[#F6C453] uppercase tracking-[0.2em]">Confirm PIN</label>
                  {errors.confirmPassword && <span className="text-[9px] text-red-400 font-bold uppercase">{errors.confirmPassword.message}</span>}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-600 group-focus-within:text-[#F6C453] transition-colors" />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    className="block w-full pl-12 bg-[#1A1A1A] border-white/5 text-white sm:text-sm rounded-2xl focus:ring-1 focus:ring-[#F6C453]/50 focus:border-[#F6C453] h-14 transition-all duration-300"
                    placeholder="········"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full h-16 flex justify-center items-center rounded-2xl shadow-[0_15px_30px_rgba(246,196,83,0.15)] text-[13px] font-black text-black bg-gradient-to-r from-[#F6C453] via-[#FFDFA0] to-[#CBA34E] hover:shadow-[0_20px_40px_rgba(246,196,83,0.25)] transform transition-all duration-500 active:scale-[0.98] disabled:opacity-50 overflow-hidden"
                >
                  <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
                  {isLoading ? (
                    <Loader2 className="animate-spin h-6 w-6 text-black" />
                  ) : (
                    <span className="relative z-10 uppercase tracking-[0.2em]">Update Security Key</span>
                  )}
                </button>
              </div>

              <div className="text-center pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center text-[11px] font-black text-gray-500 hover:text-[#F6C453] uppercase tracking-widest transition-colors duration-300"
                >
                  <ArrowLeft className="h-3 w-3 mr-2" />
                  Cancel Ritual
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

