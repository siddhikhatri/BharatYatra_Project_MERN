import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.newPassword && formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      console.log('Password changed:', { newPassword: formData.newPassword });
      setIsSuccess(true);
      setIsSubmitting(false);
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
            <h1 className="text-3xl font-bold mb-2">🔐 Change Password</h1>
            <p className="text-blue-100">
              Update your account security
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {!isSuccess ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    🔒 Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-colors text-lg ${
                        errors.currentPassword
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-red-600 text-sm mt-2">❌ {errors.currentPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    🔑 New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-colors text-lg ${
                        errors.newPassword
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-600 text-sm mt-2">❌ {errors.newPassword}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    💡 Use at least 8 characters with a mix of letters and numbers
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    ✓ Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-colors text-lg ${
                        errors.confirmPassword
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-2">❌ {errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 text-lg mt-6"
                >
                  {isSubmitting ? '⏳ Updating...' : '🔄 Update Password'}
                </motion.button>

                {/* Back Button */}
                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold py-2"
                >
                  <ArrowLeft size={18} />
                  Back to Home
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
                    ✅ Password Updated!
                  </h2>
                  <p className="text-gray-600">
                    Your password has been successfully changed. 
                    Your account is now more secure.
                  </p>
                </div>

                {/* Success Features */}
                <div className="bg-green-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-green-700 text-sm">
                    <Check size={18} />
                    <span>Password updated successfully</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700 text-sm">
                    <Check size={18} />
                    <span>Your account is secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700 text-sm">
                    <Check size={18} />
                    <span>You'll use the new password on next login</span>
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
                >
                  🏠 Back to Home
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}