import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      console.log('Forgot Password:', { email });
      setIsSubmitted(true);
      setIsSubmitting(false);
      setEmail('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">🔑 Forgot Password?</h1>
            <p className="text-blue-100">
              No worries! We'll help you recover your account.
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {!isSubmitted ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <p className="text-gray-600 text-sm bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  Enter your email address and we'll send you a link to reset your password. 
                  The link will expire in 24 hours.
                </p>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    📧 Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({});
                      }}
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-lg ${
                        errors.email
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-2">❌ {errors.email}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 text-lg"
                >
                  {isSubmitting ? '⏳ Sending...' : '📧 Send Reset Link'}
                </motion.button>

                {/* Back to Login */}
                <Link
                  to="/signin"
                  className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold py-2"
                >
                  <ArrowLeft size={18} />
                  Back to Sign In
                </Link>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <Check size={40} className="text-green-600" />
                  </motion.div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    ✅ Check Your Email!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Tip:</strong> The link will expire in 24 hours. 
                      Check your spam folder if you don't see it.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsSubmitted(false)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
                  >
                    🔄 Send Again
                  </motion.button>

                  <Link
                    to="/signin"
                    className="block w-full bg-gray-200 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-300 transition-all text-center"
                  >
                    Back to Sign In
                  </Link>
                </div>

                {/* Help Text */}
                <p className="text-sm text-gray-600 mt-6">
                  Didn't receive the email?{' '}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Try again
                  </button>
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}