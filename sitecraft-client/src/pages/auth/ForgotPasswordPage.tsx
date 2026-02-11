import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/auth.service';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

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
          Reset <span className="text-[#F6C453]">Access</span>
        </h2>
        <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-[0.4em] mb-12">
          Architecture of Digital Luxury
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[440px] relative z-10 px-2 lg:px-0">
        <div className="bg-[#111111]/80 border border-white/10 py-10 px-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] backdrop-blur-2xl">
          {isSubmitted ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#F6C453]/10 mb-6">
                <CheckCircle2 className="h-10 w-10 text-[#F6C453]" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                Check Your Email
              </h2>
              <p className="text-gray-500 text-sm font-bold leading-relaxed mb-10">
                If an account exists with that email, we've sent instructions to restore your elite access keys.
              </p>
              <Link
                to="/login"
                className="group relative w-full h-14 flex justify-center items-center rounded-2xl text-[12px] font-black text-black bg-gradient-to-r from-[#F6C453] to-[#CBA34E] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
              <div className="text-center mb-2">
                <p className="text-gray-400 text-sm font-medium">
                  Forgotten your credentials? Enter your email to begin restoration.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-shake">
                  <p className="text-xs text-red-500 font-bold uppercase tracking-wider text-center">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-[#F6C453] uppercase tracking-[0.2em]">Registered Email</label>
                  {errors.email && <span className="text-[9px] text-red-400 font-bold uppercase">{errors.email.message}</span>}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-600 group-focus-within:text-[#F6C453] transition-colors" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    className="block w-full pl-12 bg-[#1A1A1A] border-white/5 text-white sm:text-sm rounded-2xl focus:ring-1 focus:ring-[#F6C453]/50 focus:border-[#F6C453] placeholder-gray-700 h-14 transition-all duration-300"
                    placeholder="you@example.com"
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
                    <span className="relative z-10 uppercase tracking-[0.2em]">Send Reset Link</span>
                  )}
                </button>
              </div>

              <div className="text-center pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center text-[11px] font-black text-gray-500 hover:text-[#F6C453] uppercase tracking-widest transition-colors duration-300"
                >
                  <ArrowLeft className="h-3 w-3 mr-2" />
                  Return to Vault
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

