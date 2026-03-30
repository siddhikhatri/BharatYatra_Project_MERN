import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Mail, Lock, User as UserIcon, Phone, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "/src/context/AuthContext";
import axios from 'axios';


export default function AuthModal({ isOpen, onClose, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || "signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    // Sign In
    email: '',
    password: '',


    // Sign Up
    name: '',
    signupEmail: '',
    phone: '',
    signupPassword: '',
    confirmPassword: '',


    // Forgot Password
    forgotEmail: '',


    // Change Password
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });


  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const { updateProfile } = useAuth();

  const handleEditProfile = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...currentUser,
      name: formData.name,
      phone: formData.phone,
    };

    updateProfile(updatedUser);

    alert("Profile updated successfully!");
    onClose();
  };
  useEffect(() => {
    if (activeTab === "editProfile" && currentUser) {
      setFormData({
        ...formData,
        name: currentUser.name,
        phone: currentUser.phone,
      });
    }
  }, [activeTab]);


  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const { login, logout } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrors({});

    const { email, password } = formData;

    let newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation (light validation only)
    if (!password) {
      newErrors.password = "Password is Required";
    } else if (password.length < 8) {
      newErrors.password = "Password Must be at Least 8 Characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      console.log("Token saved:", res.token);
      onClose();
      navigate("/dashboard");
    } catch (err) {

      setErrors({
        general:
          err.response?.data?.msg ||
          "Invalid email or password. Please try again.",
      });

    } finally {
      setIsSubmitting(false);
    }
  };


  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrors({});

    const {
      name,
      signupEmail,
      phone,
      signupPassword,
      confirmPassword,
    } = formData;

    let newErrors = {};

    // Name validation
    if (!name) newErrors.name = "Name is required";
    else if (!/^[A-Za-z ]+$/.test(name))
      newErrors.name = "Name must contain only letters";

    // Email validation
    if (!signupEmail) newErrors.signupEmail = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(signupEmail))
      newErrors.signupEmail = "Invalid email format";

    // Phone validation
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[789]\d{9}$/.test(phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!signupPassword) {
      newErrors.signupPassword = "Password is required";
    } else if (!passwordRegex.test(signupPassword)) {
      newErrors.signupPassword =
        "Password must be 8+ chars, include uppercase, lowercase, number & special character";
    }

    if (signupPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    //  CALL BACKEND API
    try {
      const res = await axios.post("http://127.0.0.1:3000/addUserData", {
        name,
        email: signupEmail,
        phone: phone,
        password: signupPassword,
      });

      alert(res.data.message || "Registration Successful!");
      setActiveTab("signin");

    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };


  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrors({});

    let newErrors = {};

    // validation
    if (!formData.forgotEmail) {
      newErrors.forgotEmail = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.forgotEmail)) {
      newErrors.forgotEmail = "Invalid email format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post("http://127.0.0.1:3000/forgotpassword", {
        email: formData.forgotEmail,
      });

      alert(res.data.message || "Reset link sent to your email!");

      // reset field
      setFormData({ ...formData, forgotEmail: "" });

      // go back to signin
      setActiveTab("signin");

    } catch (err) {
      setErrors({
        general:
          err.response?.data?.message ||
          "Something went wrong. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  {activeTab === 'signin' && '🔐 Sign In'}
                  {activeTab === 'signup' && '✨ Create Account'}
                  {activeTab === 'forgot' && '🔑 Reset Password'}
                  {activeTab === 'change' && '🔄 Change Password'}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {activeTab === 'signin' && 'Welcome back to Bharat Yatra'}
                  {activeTab === 'signup' && 'Join our travel community'}
                  {activeTab === 'forgot' && 'Recover your account'}
                  {activeTab === 'change' && 'Update your security'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Step Indicator for Sign In/Sign Up */}
            {(activeTab === 'signin' || activeTab === 'signup') && (
              <div className="px-6 py-4 bg-gray-50 flex justify-between items-center border-b">
                <div className="flex gap-4">
                  <motion.button
                    onClick={() => {
                      setActiveTab('signin');
                      setErrors({});
                    }}
                    className={`font-semibold text-sm transition-all pb-2 border-b-2 ${activeTab === 'signin'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                      }`}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setActiveTab('signup');
                      setErrors({});
                    }}
                    className={`font-semibold text-sm transition-all pb-2 border-b-2 ${activeTab === 'signup'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                      }`}
                  >
                    Sign Up
                  </motion.button>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Sign In Form */}
              {activeTab === 'signin' && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSignIn}
                  className="space-y-5"
                >
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      📧 Email Address
                    </label>
                    {errors.general && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                        ❌ {errors.general}
                      </div>
                    )}
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none text-black transition-colors ${errors.email
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                          }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">❌ {errors.email}</p>
                    )}
                  </div>
                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      🔒 Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none text-black transition-colors ${errors.password
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {formData.password.length > 0 && formData.password.length < 8 && (
                      <p className="text-red-500 text-sm mt-1">
                        Password must be at least 8 characters
                      </p>
                    )}
                  </div>

                  {/* Forgot Password Link */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setErrors({});
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    Forgot Password?
                  </button>

                  {/* Sign In Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? '⏳ Signing In...' : '🚀 Sign In'}
                  </motion.button>

                  <p className="text-center text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('signup');
                        setErrors({});
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Sign Up Now
                    </button>
                  </p>
                </motion.form>
              )}

              {/* Sign Up Form */}
              {activeTab === 'signup' && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSignUp}
                  className="space-y-5"
                >
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      👤 Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Siddhi Khatri"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-gray-900 ${errors.email
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                          }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">❌ {errors.name}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      📧 Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="signupEmail"
                        value={formData.signupEmail}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.signupEmail
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                          }`}
                      />
                    </div>
                    {errors.signupEmail && (
                      <p className="text-red-600 text-sm mt-1">❌ {errors.signupEmail}</p>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      📱 Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value) && value.length <= 10) {
                            setFormData({ ...formData, phone: value });
                          }
                        }}
                        placeholder="9876543210"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.phone
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                          }`}
                      />
                    </div>

                    {formData.phone.length > 0 && !/^[789]\d{9}$/.test(formData.phone) && (
                      <p className="text-red-500 text-sm mt-1">
                        Phone must start with 7, 8, or 9 and contain 10 digits
                      </p>
                    )}

                    {formData.phone.length === 10 && /^[789]\d{9}$/.test(formData.phone) && (
                      <p className="text-green-600 text-sm mt-1">
                        ✔ Valid Indian phone number
                      </p>
                    )}

                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">❌ {errors.phone}</p>
                    )}

                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      🔒 Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="signupPassword"
                        value={formData.signupPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.signupPassword
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                          }`}
                      />
                      {formData.signupPassword.length > 0 &&
                        formData.signupPassword.length < 8 && (
                          <p className="text-red-500 text-sm mt-1">
                            Password must be at least 8 characters
                          </p>
                        )}

                      {formData.signupPassword.length >= 8 && (
                        <p className="text-green-600 text-sm mt-1">
                          ✔ Password length is valid
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {/* 🔐 Strong Password Validation UI */}
                    <div className="text-sm mt-2 space-y-1">

                      <p className={`flex items-center gap-2 
    ${/[A-Z]/.test(formData.signupPassword) ? "text-green-600" : "text-gray-400"}`}>
                        ✔ At least 1 Uppercase letter
                      </p>

                      <p className={`flex items-center gap-2 
    ${/[a-z]/.test(formData.signupPassword) ? "text-green-600" : "text-gray-400"}`}>
                        ✔ At least 1 Lowercase letter
                      </p>

                      <p className={`flex items-center gap-2 
    ${/\d/.test(formData.signupPassword) ? "text-green-600" : "text-gray-400"}`}>
                        ✔ At least 1 Number
                      </p>

                      <p className={`flex items-center gap-2 
    ${/[@$!%*?&]/.test(formData.signupPassword) ? "text-green-600" : "text-gray-400"}`}>
                        ✔ At least 1 Special Character
                      </p>

                      <p className={`flex items-center gap-2 
    ${formData.signupPassword.length >= 8 ? "text-green-600" : "text-gray-400"}`}>
                        ✔ Minimum 8 characters
                      </p>

                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      🔒 Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={formData.signupPassword.length < 6}
                        onFocus={(e) => {
                          if (formData.signupPassword.length < 6) {
                            e.target.blur();
                          }
                        }}
                        className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none transition-colors 
  ${errors.confirmPassword
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                          }
  ${formData.signupPassword.length < 8
                            ? 'bg-gray-200 cursor-not-allowed'
                            : ''
                          }`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {formData.confirmPassword && (
                      formData.signupPassword === formData.confirmPassword ? (
                        <p className="text-green-600 text-sm mt-1">✔ Passwords match</p>
                      ) : (
                        <p className="text-red-500 text-sm mt-1">❌ Passwords do not match</p>
                      )
                    )}
                  </div>

                  {/* Sign Up Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? '⏳ Creating Account...' : '🎉 Create Account'}
                  </motion.button>

                  <p className="text-center text-gray-600 text-sm">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('signin');
                        setErrors({});
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Sign In
                    </button>
                  </p>

                  {/* Benefits */}
                  <div className="mt-6 pt-4 border-t space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      ✅ <span>Exclusive travel deals</span>
                    </p>
                    <p className="flex items-center gap-2">
                      ✅ <span>Easy booking management</span>
                    </p>
                    <p className="flex items-center gap-2">
                      ✅ <span>24/7 customer support</span>
                    </p>
                  </div>
                </motion.form>
              )}

              {/* Forgot Password Form */}
              {activeTab === 'forgot' && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleForgotPassword}
                  className="space-y-5"
                >
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      📧 Enter your registered email
                    </label>

                    {errors.general && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                        ❌ {errors.general}
                      </div>
                    )}

                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="forgotEmail"
                        value={formData.forgotEmail}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none text-black ${errors.forgotEmail
                            ? 'border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                          }`}
                      />
                    </div>

                    {errors.forgotEmail && (
                      <p className="text-red-600 text-sm mt-1">
                        ❌ {errors.forgotEmail}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting || !formData.forgotEmail}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? '⏳ Sending...' : '📩 Send Reset Link'}
                  </motion.button>

                  {/* Back to Sign In */}
                  <p className="text-center text-gray-600 text-sm">
                    Remember your password?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('signin');
                        setErrors({});
                      }}
                      className="text-blue-600 font-semibold"
                    >
                      Sign In
                    </button>
                  </p>
                </motion.form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Eye, EyeOff, Mail, Lock, User as UserIcon, Phone, MapPin } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from "/src/context/AuthContext";
// import axios from 'axios';


// export default function AuthModal({ isOpen, onClose, initialTab }) {
//   const [activeTab, setActiveTab] = useState(initialTab || "signin");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const navigate = useNavigate()

//   const [formData, setFormData] = useState({
//     // Sign In
//     email: '',
//     password: '',


//     // Sign Up
//     name: '',
//     signupEmail: '',
//     phone: '',
//     signupPassword: '',
//     confirmPassword: '',


//     // Forgot Password
//     forgotEmail: '',


//     // Change Password
//     currentPassword: '',
//     newPassword: '',
//     confirmNewPassword: '',
//   });


//   useEffect(() => {
//     if (initialTab) {
//       setActiveTab(initialTab);
//     }
//   }, [initialTab]);

//   const { updateProfile } = useAuth();

//   const handleEditProfile = (e) => {
//     e.preventDefault();

//     const updatedUser = {
//       ...currentUser,
//       name: formData.name,
//       phone: formData.phone,
//     };

//     updateProfile(updatedUser);

//     alert("Profile updated successfully!");
//     onClose();
//   };
//   useEffect(() => {
//     if (activeTab === "editProfile" && currentUser) {
//       setFormData({
//         ...formData,
//         name: currentUser.name,
//         phone: currentUser.phone,
//       });
//     }
//   }, [activeTab]);





//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   const { login } = useAuth();
//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     setErrors({});

//     const { email, password } = formData;

//     let newErrors = {};

//     // Email validation
//     if (!email) {
//       newErrors.email = "Email is required";
//     } else if (!/^\S+@\S+\.\S+$/.test(email)) {
//       newErrors.email = "Invalid email format";
//     }

//     // Password validation (light validation only)
//     if (!password) {
//       newErrors.password = "Password is Required";
//     } else if (password.length < 8) {
//       newErrors.password = "Password Must be at Least 8 Characters";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const res = await login(email, password);
//       console.log("Token saved:", res.token);
//       onClose();
//       navigate("/dashboard");
//     } catch (err) {

//       setErrors({
//         general:
//           err.response?.data?.msg ||
//           "Invalid email or password. Please try again.",
//       });

//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     setErrors({});

//     const {
//       name,
//       signupEmail,
//       phone,
//       signupPassword,
//       confirmPassword,
//     } = formData;

//     let newErrors = {};

//     // Name validation
//     if (!name) newErrors.name = "Name is required";
//     else if (!/^[A-Za-z ]+$/.test(name))
//       newErrors.name = "Name must contain only letters";

//     // Email validation
//     if (!signupEmail) newErrors.signupEmail = "Email is required";
//     else if (!/^\S+@\S+\.\S+$/.test(signupEmail))
//       newErrors.signupEmail = "Invalid email format";

//     // Phone validation
//     if (!phone) {
//       newErrors.phone = "Phone number is required";
//     } else if (!/^[789]\d{9}$/.test(phone)) {
//       newErrors.phone = "Phone number must be exactly 10 digits";
//     }

//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//     if (!signupPassword) {
//       newErrors.signupPassword = "Password is required";
//     } else if (!passwordRegex.test(signupPassword)) {
//       newErrors.signupPassword =
//         "Password must be 8+ chars, include uppercase, lowercase, number & special character";
//     }

//     if (signupPassword !== confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match";

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     //  CALL BACKEND API
//     try {
//       const res = await axios.post("http://127.0.0.1:3000/addUserData", {
//         name,
//         email: signupEmail,
//         phone: phone,
//         password: signupPassword,
//       });

//       alert(res.data.message || "Registration Successful!");
//       setActiveTab("signin");

//     } catch (err) {
//       alert(err.response?.data?.message || "Registration Failed");
//     }
//   };


//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     setErrors({});

//     let newErrors = {};

//     // validation
//     if (!formData.forgotEmail) {
//       newErrors.forgotEmail = "Email is required";
//     } else if (!/^\S+@\S+\.\S+$/.test(formData.forgotEmail)) {
//       newErrors.forgotEmail = "Invalid email format";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const res = await axios.post("http://127.0.0.1:3000/forgot-password", {
//         email: formData.forgotEmail,
//       });

//       alert(res.data.message || "Reset link sent to your email!");

//       // reset field
//       setFormData({ ...formData, forgotEmail: "" });

//       // go back to signin
//       setActiveTab("signin");

//     } catch (err) {
//       setErrors({
//         general:
//           err.response?.data?.message ||
//           "Something went wrong. Try again.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const { logout } = useAuth();
//   <button onClick={logout}>Logout</button>


//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={onClose}
//           className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4"
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-bold">
//                   {activeTab === 'signin' && '🔐 Sign In'}
//                   {activeTab === 'signup' && '✨ Create Account'}
//                   {activeTab === 'forgot' && '🔑 Reset Password'}
//                   {activeTab === 'change' && '🔄 Change Password'}
//                 </h2>
//                 <p className="text-blue-100 text-sm mt-1">
//                   {activeTab === 'signin' && 'Welcome back to Bharat Yatra'}
//                   {activeTab === 'signup' && 'Join our travel community'}
//                   {activeTab === 'forgot' && 'Recover your account'}
//                   {activeTab === 'change' && 'Update your security'}
//                 </p>
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={onClose}
//                 className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all"
//               >
//                 <X size={24} />
//               </motion.button>
//             </div>

//             {/* Step Indicator for Sign In/Sign Up */}
//             {(activeTab === 'signin' || activeTab === 'signup') && (
//               <div className="px-6 py-4 bg-gray-50 flex justify-between items-center border-b">
//                 <div className="flex gap-4">
//                   <motion.button
//                     onClick={() => {
//                       setActiveTab('signin');
//                       setErrors({});
//                     }}
//                     className={`font-semibold text-sm transition-all pb-2 border-b-2 ${activeTab === 'signin'
//                       ? 'text-blue-600 border-blue-600'
//                       : 'text-gray-600 border-transparent hover:text-gray-900'
//                       }`}
//                   >
//                     Sign In
//                   </motion.button>
//                   <motion.button
//                     onClick={() => {
//                       setActiveTab('signup');
//                       setErrors({});
//                     }}
//                     className={`font-semibold text-sm transition-all pb-2 border-b-2 ${activeTab === 'signup'
//                       ? 'text-blue-600 border-blue-600'
//                       : 'text-gray-600 border-transparent hover:text-gray-900'
//                       }`}
//                   >
//                     Sign Up
//                   </motion.button>
//                 </div>
//               </div>
//             )}

//             {/* Content */}
//             <div className="p-6 max-h-[70vh] overflow-y-auto">
//               {/* Sign In Form */}
//               {activeTab === 'signin' && (
//                 <motion.form
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   onSubmit={handleSignIn}
//                   className="space-y-5"
//                 >
//                   {/* Email Input */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       📧 Email Address
//                     </label>
//                     {errors.general && (
//                       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
//                         ❌ {errors.general}
//                       </div>
//                     )}
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="you@example.com"
//                         className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none text-black transition-colors ${errors.email
//                           ? 'border-red-500 focus:border-red-500'
//                           : 'border-gray-300 focus:border-blue-500'
//                           }`}
//                       />
//                     </div>
//                     {errors.email && (
//                       <p className="text-red-600 text-sm mt-1">❌ {errors.email}</p>
//                     )}
//                   </div>
//                   {/* Password Input */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       🔒 Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
//                       <input
//                         type={showPassword ? 'text' : 'password'}
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         placeholder="••••••••"
//                         className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none text-black transition-colors ${errors.password
//                           ? 'border-red-500 focus:border-red-500'
//                           : 'border-gray-300 focus:border-blue-500'
//                           }`}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
//                       >
//                         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                       </button>
//                     </div>
//                     {formData.password.length > 0 && formData.password.length < 8 && (
//                       <p className="text-red-500 text-sm mt-1">
//                         Password must be at least 8 characters
//                       </p>
//                     )}
//                   </div>

//                   {/* Forgot Password Link */}
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setActiveTab('forgot');
//                       setErrors({});
//                     }}
//                     className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
//                   >
//                     Forgot Password?
//                   </button>

//                   {/* Sign In Button */}
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
//                   >
//                     {isSubmitting ? '⏳ Signing In...' : '🚀 Sign In'}
//                   </motion.button>

//                   <p className="text-center text-gray-600 text-sm">
//                     Don't have an account?{' '}
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setActiveTab('signup');
//                         setErrors({});
//                       }}
//                       className="text-blue-600 hover:text-blue-700 font-semibold"
//                     >
//                       Sign Up Now
//                     </button>
//                   </p>
//                 </motion.form>
//               )}

//               {/* Sign Up Form */}
//               {activeTab === 'signup' && (
//                 <motion.form
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   onSubmit={handleSignUp}
//                   className="space-y-5"
//                 >
//                   {/* Name Input */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       👤 Full Name
//                     </label>
//                     <div className="relative">
//                       <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         placeholder="Siddhi Khatri"
//                         className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-gray-900 ${errors.email
//                           ? 'border-red-500 focus:border-red-500'
//                           : 'border-gray-300 focus:border-blue-500'
//                           }`}
//                       />
//                     </div>
//                     {errors.name && (
//                       <p className="text-red-600 text-sm mt-1">❌ {errors.name}</p>
//                     )}
//                   </div>

//                   {/* Email Input */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       📧 Email Address
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
//                       <input
//                         type="email"
//                         name="signupEmail"
//                         value={formData.signupEmail}
//                         onChange={handleChange}
//                         placeholder="you@example.com"
//                         className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.signupEmail
//                           ? 'border-red-500 focus:border-red-500'
//                           : 'border-gray-300 focus:border-blue-500'
//                           }`}
//                       />
//                     </div>
//                     {errors.signupEmail && (
//                       <p className="text-red-600 text-sm mt-1">❌ {errors.signupEmail}</p>
//                     )}
//                   </div>

//                   {/* Phone Input */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       📱 Phone Number
//                     </label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={(e) => {
//                           const value = e.target.value;

//                           // Allow only digits and max 10 numbers
//                           if (/^\d*$/.test(value) && value.length <= 10) {
//                             setFormData({ ...formData, phone: value });
//                           }
//                         }}


//                         placeholder="9876543210"
//                         className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.phone
//                           ? 'border-red-500 focus:border-red-500'
//                           : 'border-gray-300 focus:border-blue-500'
//                           }`}
//                       />
//                     </div>
//                     {/* {errors.phone && (
//                       <p className="text-red-600 text-sm mt-1">❌ {errors.phone}</p>
//                     )} */}
//                     {/* Live Validation Message */}

//                     {formData.phone.length > 0 && !/^[789]\d{9}$/.test(formData.phone) && (
//                       <p className="text-red-500 text-sm mt-1">
//                         Phone must start with 7, 8, or 9 and contain 10 digits
//                       </p>
//                     )}

//                     {formData.phone.length === 10 && /^[789]\d{9}$/.test(formData.phone) && (
//                       <p className="text-green-600 text-sm mt-1">
//                         ✔ Valid Indian phone number
//                       </p>
//                     )}

//                     {errors.phone && (
//                       <p className="text-red-600 text-sm mt-1">❌ {errors.phone}</p>
//                     )}

//                   </div>

//                   {/* Password Input */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       🔒 Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
//                       <input
//                         type={showPassword ? 'text' : 'password'}
//                         name="signupPassword"
//                         value={formData.signupPassword}
//                         onChange={handleChange}
//                         placeholder="••••••••"
//                         className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.signupPassword
//                           ? 'border-red-500 focus:border-red-500'
//                           : 'border-gray-300 focus:border-blue-500'
//                           }`}
//                       />
//                       {formData.signupPassword.length > 0 &&
//                         formData.signupPassword.length < 8 && (
//                           <p className="text-red-500 text-sm mt-1">
//                             Password must be at least 8 characters
//                           </p>
//                         )}

//                       {formData.signupPassword.length >= 8 && (
//                         <p className="text-green-600 text-sm mt-1">
//                           ✔ Password length is valid
//                         </p>
//                       )}

//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
//                       >
//                         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                       </button>
//                     </div>
//                     {/* 🔐 Strong Password Validation UI */}
//                     <div className="text-sm mt-2 space-y-1">

//                       <p className={`flex items-center gap-2 
//     ${/[A-Z]/.test(formData.signupPassword) ? "text-green-600" : "text-gray-400"}`}>
//                         ✔ At least 1 Uppercase letter
//                       </p>

//                       <p className={`flex items-center gap-2 
//     ${/[a-z]/.test(formData.signupPassword) ? "text-green-600" : "text-gray-400"}`}>
//                         ✔ At least 1 Lowercase letter
//                       </p>

//                       <p className={`flex items-center gap-2 
//     ${/\d/.test(formData.signupPassword) ? "text-green-600" : "text-gray-400"}`}>
//                         ✔ At least 1 Number
//                       </p>

//                       <p className={`flex items-center gap-2 
//     ${/[@$!%*?&]/.test(formData.signupPassword) ? "text-green-600" : "text-gray-400"}`}>
//                         ✔ At least 1 Special Character
//                       </p>

//                       <p className={`flex items-center gap-2 
//     ${formData.signupPassword.length >= 8 ? "text-green-600" : "text-gray-400"}`}>
//                         ✔ Minimum 8 characters
//                       </p>

//                     </div>
//                   </div>

//                   {/* Confirm Password Input */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       🔒 Confirm Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
//                       {/* <input
//                         type={showConfirmPassword ? 'text' : 'password'}
//                         name="confirmPassword"
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                         placeholder="••••••••"
//                         className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none transition-colors ${errors.confirmPassword
//                           ? 'border-red-500 focus:border-red-500'
//                           : 'border-gray-300 focus:border-blue-500'
//                           }`}
//                       /> */}
//                       <input
//                         type={showConfirmPassword ? 'text' : 'password'}
//                         name="confirmPassword"
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                         disabled={formData.signupPassword.length < 6}
//                         onFocus={(e) => {
//                           if (formData.signupPassword.length < 6) {
//                             e.target.blur();
//                           }
//                         }}
//                         className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none transition-colors 
//   ${errors.confirmPassword
//                             ? 'border-red-500 focus:border-red-500'
//                             : 'border-gray-300 focus:border-blue-500'
//                           }
//   ${formData.signupPassword.length < 8
//                             ? 'bg-gray-200 cursor-not-allowed'
//                             : ''
//                           }`}
//                       />

//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
//                       >
//                         {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                       </button>
//                     </div>
//                     {formData.confirmPassword && (
//                       formData.signupPassword === formData.confirmPassword ? (
//                         <p className="text-green-600 text-sm mt-1">✔ Passwords match</p>
//                       ) : (
//                         <p className="text-red-500 text-sm mt-1">❌ Passwords do not match</p>
//                       )
//                     )}
//                   </div>

//                   {/* Sign Up Button */}
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
//                   >
//                     {isSubmitting ? '⏳ Creating Account...' : '🎉 Create Account'}
//                   </motion.button>

//                   <p className="text-center text-gray-600 text-sm">
//                     Already have an account?{' '}
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setActiveTab('signin');
//                         setErrors({});
//                       }}
//                       className="text-blue-600 hover:text-blue-700 font-semibold"
//                     >
//                       Sign In
//                     </button>
//                   </p>

//                   {/* Benefits */}
//                   <div className="mt-6 pt-4 border-t space-y-2 text-sm text-gray-600">
//                     <p className="flex items-center gap-2">
//                       ✅ <span>Exclusive travel deals</span>
//                     </p>
//                     <p className="flex items-center gap-2">
//                       ✅ <span>Easy booking management</span>
//                     </p>
//                     <p className="flex items-center gap-2">
//                       ✅ <span>24/7 customer support</span>
//                     </p>
//                   </div>
//                 </motion.form>
//               )}

//               {/* Forgot Password Form */}
//               {activeTab === 'forgot' && (
//                 <motion.form
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   onSubmit={handleForgotPassword}
//                   className="space-y-5"
//                 >
//                   {/* Email Input */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       📧 Enter your registered email
//                     </label>

//                     {errors.general && (
//                       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
//                         ❌ {errors.general}
//                       </div>
//                     )}

//                     <div className="relative">
//                       <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
//                       <input
//                         type="email"
//                         name="forgotEmail"
//                         value={formData.forgotEmail}
//                         onChange={handleChange}
//                         placeholder="you@example.com"
//                         className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none text-black ${errors.forgotEmail
//                             ? 'border-red-500'
//                             : 'border-gray-300 focus:border-blue-500'
//                           }`}
//                       />
//                     </div>

//                     {errors.forgotEmail && (
//                       <p className="text-red-600 text-sm mt-1">
//                         ❌ {errors.forgotEmail}
//                       </p>
//                     )}
//                   </div>

//                   {/* Submit Button */}
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="submit"
//                     disabled={isSubmitting || !formData.forgotEmail}
//                     className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
//                   >
//                     {isSubmitting ? '⏳ Sending...' : '📩 Send Reset Link'}
//                   </motion.button>

//                   {/* Back to Sign In */}
//                   <p className="text-center text-gray-600 text-sm">
//                     Remember your password?{' '}
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setActiveTab('signin');
//                         setErrors({});
//                       }}
//                       className="text-blue-600 font-semibold"
//                     >
//                       Sign In
//                     </button>
//                   </p>
//                 </motion.form>
//               )}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }