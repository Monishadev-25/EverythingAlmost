import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Sparkles, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setGeneralError('');

    try {
      await register(form);
      navigate('/account', { replace: true });
    } catch (error) {
      if (error.errors && Object.keys(error.errors).length > 0) {
        setErrors(error.errors);
      } else {
        setGeneralError(error.message || 'Unable to create account.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#fdfaf5] border border-[#ede1d3] rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#8a5734] font-medium tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Everything Almost</span>
          </div>
          <h1 className="font-serif text-3xl text-[#241c18] font-normal">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-[#735e50]">
            Enjoy 10% off your first order, save delivery addresses, and track bespoke orders.
          </p>
        </div>

        {generalError && (
          <div className="bg-[#fbeeed] border border-[#f5c6c2] text-[#8e241c] text-xs p-3.5 rounded-xl">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#423328] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8a7261] absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Charlotte Bronte"
                required
                className="w-full bg-white border border-[#dfcebd] rounded-xl py-2.5 pl-10 pr-3.5 text-xs sm:text-sm text-[#241c18] placeholder-[#a69283] focus:outline-none focus:border-[#8a5734]"
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-red-600 mt-1">{errors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#423328] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8a7261] absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="charlotte@example.co.uk"
                required
                className="w-full bg-white border border-[#dfcebd] rounded-xl py-2.5 pl-10 pr-3.5 text-xs sm:text-sm text-[#241c18] placeholder-[#a69283] focus:outline-none focus:border-[#8a5734]"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-600 mt-1">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#423328] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8a7261] absolute left-3.5 top-3.5" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                required
                className="w-full bg-white border border-[#dfcebd] rounded-xl py-2.5 pl-10 pr-3.5 text-xs sm:text-sm text-[#241c18] placeholder-[#a69283] focus:outline-none focus:border-[#8a5734]"
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-600 mt-1">{errors.password[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#423328] uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8a7261] absolute left-3.5 top-3.5" />
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                className="w-full bg-white border border-[#dfcebd] rounded-xl py-2.5 pl-10 pr-3.5 text-xs sm:text-sm text-[#241c18] placeholder-[#a69283] focus:outline-none focus:border-[#8a5734]"
              />
            </div>
            {errors.password_confirmation && (
              <p className="text-[11px] text-red-600 mt-1">{errors.password_confirmation[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#784d2f] hover:bg-[#623c22] text-white py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wider transition-colors cursor-pointer shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-[#ede1d3] flex items-center justify-between text-xs text-[#735e50]">
          <span>Already registered?</span>
          <Link to="/signin" className="text-[#8a5734] font-semibold hover:underline">
            Sign In Instead →
          </Link>
        </div>
      </div>
    </div>
  );
}
