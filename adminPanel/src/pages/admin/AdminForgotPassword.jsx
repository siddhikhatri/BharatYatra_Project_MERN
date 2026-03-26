import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminForgotPassword() {

  const [serverError, setServerError] = useState("");

  const [data, setData] = useState({
    email: ""
  });

  const [error, setError] = useState({
    email: ""
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });

    setError({
      ...error,
      [e.target.name]: ""
    });
  };

  const validate = () => {
    let isValid = true;
    let newError = { email: "" };

    // Empty validation
    if (data.email.trim() === "") {
      newError.email = "Email is required";
      isValid = false;
    }

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailPattern.test(data.email)) {
      newError.email = "Enter a valid email address";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const resetPassword = () => {

  if (!validate()) return;

  setServerError("");

  axios.post("http://localhost:3000/admin/forgotPassword", data)
    .then((res) => {
      alert(res.data.message);
    })
    .catch((err) => {

      if (err.response) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Something went wrong");
      }

    });

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
          Forgot Password
        </h3>

        {/* Email */}
        <div className="mb-2 relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-600"/>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={data.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border  rounded-lg"
          />
        </div>

        {/* Error message */}
        {error.email && (
          <p className="text-red-500 text-m mb-3">{error.email}</p>
        )}

        {serverError && (
          <p className="text-red-500 text-m mb-3">{serverError}</p>
        )}

        <button
          onClick={resetPassword}
          className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600"
        >
          Reset Password
        </button>

        <p className="text-m text-center mt-4">
          Remember password?{" "}
          <Link to="/adminLogin" className="text-cyan-600">
            Sign In
          </Link>
        </p>

      </div>

    </div>
  );
}
