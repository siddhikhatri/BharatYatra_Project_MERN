import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useState } from "react";

export default function AdminSignup() {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [serverMessage, setServerMessage] = useState("");

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    

    // NAME VALIDATION
    if (name === "name") {

      const namePattern = /^[A-Za-z\s]+$/;

      if (value.trim() === "") {
        setError((prev) => ({ ...prev, name: "Name is required" }));
      }
      else if (value.length < 3) {
        setError((prev) => ({ ...prev, name: "Name must be at least 3 characters" }));
      }
      else if (!namePattern.test(value)) {
        setError((prev) => ({ ...prev, name: "Only letters allowed" }));
      }
      else {
        setError((prev) => ({ ...prev, name: "" }));
      }
    }

    // EMAIL VALIDATION
    if (name === "email") {

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (value.trim() === "") {
        setError((prev) => ({ ...prev, email: "Email is required" }));
      }
      else if (!emailPattern.test(value)) {
        setError((prev) => ({ ...prev, email: "Invalid email format" }));
      }
      else {
        setError((prev) => ({ ...prev, email: "" }));
      }
    }

    // PASSWORD VALIDATION
    if (name === "password") {

      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (value.trim() === "") {
        setError((prev) => ({ ...prev, password: "Password is required" }));
      }
      else if (!passwordPattern.test(value)) {
        setError((prev) => ({
          ...prev,
          password:
            "8+ chars, uppercase, lowercase, number & special character required"
        }));
      }
      else {
        setError((prev) => ({ ...prev, password: "" }));
      }
    }

    setServerMessage("");
  };

  const validateForm = () => {

  let newError = {
    name: "",
    email: "",
    password: ""
  };

  let isValid = true;

  if (formData.name.trim() === "") {
    newError.name = "Name is required";
    isValid = false;
  }

  if (formData.email.trim() === "") {
    newError.email = "Email is required";
    isValid = false;
  }

  if (formData.password.trim() === "") {
    newError.password = "Password is required";
    isValid = false;
  }

  setError(newError);
  return isValid;
};

  const handleSignup = async () => {

  if (!validateForm()) return;

  try {

    const res = await axios.post(
      "http://localhost:3000/admin/signup",
      formData
    );

    setServerMessage(res.data.message);
    navigate('/adminlogin')

  } catch (error) {
    console.log("Error:", error);
  }

};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">BY</span>
          </div>
          <h2 className="text-xl font-semibold mt-2">BharatYatra</h2>
        </div>

        <h3 className="text-lg font-semibold text-center mb-6">
          Sign Up
        </h3>

        {/* Name */}
        <div className="mb-2 relative">
          <User className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>

          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Full Name"
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg
            ${error.name ? "border-red-500" : formData.name ? "border-green-500" : "border-gray-300"}`}
          />
        </div>

        {error.name && (
          <p className="text-red-500 text-m mb-2">{error.name}</p>
        )}

        {/* Email */}
        <div className="mb-2 relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>

          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg
            ${error.email ? "border-red-500" : formData.email ? "border-green-500" : "border-gray-300"}`}
          />
        </div>

        {error.email && (
          <p className="text-red-500 text-m mb-2">{error.email}</p>
        )}

        {/* Password */}
        <div className="mb-2 relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            className={`w-full pl-10 pr-10 py-2 border rounded-lg
            ${error.password ? "border-red-500" : formData.password ? "border-green-500" : "border-gray-300"}`}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

        </div>

        {error.password && (
          <p className="text-red-500 text-m mb-2">{error.password}</p>
        )}

        <button
          onClick={handleSignup}
          className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 mt-2"
        >
          Sign Up
        </button>

        {serverMessage && (
          <p className="text-center text-m mt-3 text-green-600">
            {serverMessage}
          </p>
        )}

        <p className="text-m text-center mt-4">
          Already have an account?{" "}
          <Link to="/adminlogin" className="text-cyan-600 hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}