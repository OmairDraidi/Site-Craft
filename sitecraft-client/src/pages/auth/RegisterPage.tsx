import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { formatApiError } from '../../utils/error.utils';

// Validation Schema
const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await authRegister(data);
      navigate('/dashboard');
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow - Unified spacing */}
      <div className="absolute top-[-20%] right-[-15%] w-[60%] h-[60%] bg-[#F6C453]/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#F6C453]/5 rounded-full blur-[120px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-10">
          <div className="h-20 w-20 bg-gradient-to-br from-[#F6C453] to-[#CBA34E] rounded-[1.5rem] flex items-center justify-center shadow-[0_0_40px_rgba(246,196,83,0.25)] transform hover:scale-105 transition-transform duration-500">
            <span className="text-black text-5xl font-black italic">S</span>
          </div>
        </div>
        <h2 className="text-center text-5xl font-black tracking-tighter text-white mb-2 italic">
          Join <span className="text-[#F6C453]">Elite</span>
        </h2>
        <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-[0.4em] mb-12">
          Architecture of Digital Luxury
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[480px] relative z-10 px-2 lg:px-0">
        <div className="bg-[#111111]/80 border border-white/10 py-10 px-8 lg:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] backdrop-blur-2xl">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-shake">
                <p className="text-xs text-red-500 font-bold uppercase tracking-wider text-center">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#F6C453] uppercase tracking-[0.2em] ml-1">First Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-600 group-focus-within:text-[#F6C453] transition-colors" />
                  </div>
                  <input
                    {...register('firstName')}
                    className="block w-full pl-12 bg-[#1A1A1A] border-white/5 text-white sm:text-sm rounded-2xl focus:ring-1 focus:ring-[#F6C453]/50 focus:border-[#F6C453] h-14 transition-all duration-300 placeholder-gray-700"
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-[9px] text-red-400 font-bold uppercase mt-1 ml-1">{errors.firstName.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#F6C453] uppercase tracking-[0.2em] ml-1">Last Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-600 group-focus-within:text-[#F6C453] transition-colors" />
                  </div>
                  <input
                    {...register('lastName')}
                    className="block w-full pl-12 bg-[#1A1A1A] border-white/5 text-white sm:text-sm rounded-2xl focus:ring-1 focus:ring-[#F6C453]/50 focus:border-[#F6C453] h-14 transition-all duration-300 placeholder-gray-700"
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-[9px] text-red-400 font-bold uppercase mt-1 ml-1">{errors.lastName.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#F6C453] uppercase tracking-[0.2em] ml-1">Professional Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-600 group-focus-within:text-[#F6C453] transition-colors" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full pl-12 bg-[#1A1A1A] border-white/5 text-white sm:text-sm rounded-2xl focus:ring-1 focus:ring-[#F6C453]/50 focus:border-[#F6C453] h-14 transition-all duration-300"
                  placeholder="admin@sitecraft.com"
                />
                {errors.email && <p className="text-[9px] text-red-400 font-bold uppercase mt-1 ml-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#F6C453] uppercase tracking-[0.2em] ml-1">Security PIN</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-600 group-focus-within:text-[#F6C453] transition-colors" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-12 pr-12 bg-[#1A1A1A] border-white/5 text-white sm:text-sm rounded-2xl focus:ring-1 focus:ring-[#F6C453]/50 focus:border-[#F6C453] h-14 transition-all duration-300"
                  placeholder="········"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-600" /> : <Eye className="h-5 w-5 text-gray-600" />}
                </button>
                {errors.password && <p className="text-[9px] text-red-400 font-bold uppercase mt-1 ml-1">{errors.password.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#F6C453] uppercase tracking-[0.2em] ml-1">Confirm PIN</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-600 group-focus-within:text-[#F6C453] transition-colors" />
                </div>
                <input
                  {...register('confirmPassword')}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-12 pr-12 bg-[#1A1A1A] border-white/5 text-white sm:text-sm rounded-2xl focus:ring-1 focus:ring-[#F6C453]/50 focus:border-[#F6C453] h-14 transition-all duration-300"
                  placeholder="········"
                />
                {errors.confirmPassword && <p className="text-[9px] text-red-400 font-bold uppercase mt-1 ml-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full h-16 flex justify-center items-center rounded-[1.25rem] shadow-[0_15px_30px_rgba(246,196,83,0.2)] text-[13px] font-black text-black bg-gradient-to-r from-[#F6C453] via-[#FFDFA0] to-[#CBA34E] hover:shadow-[0_20px_40px_rgba(246,196,83,0.3)] transform transition-all duration-500 active:scale-[0.98] disabled:opacity-50 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-6 w-6 text-black" />
                ) : (
                  <span className="relative z-10 uppercase tracking-[0.2em]">Acquire Membership</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed">
              Already a member?{' '}
              <Link to="/login" className="font-black text-[#F6C453] hover:text-[#FFDFA0] transition-colors">
                Authorize Session
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
