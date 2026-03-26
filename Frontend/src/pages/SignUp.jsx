import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      alert("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    localStorage.setItem("travelUser", JSON.stringify(formData));
    localStorage.setItem("isLoggedIn", "true");

    alert("Account Created Successfully");
    navigate("/packages");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border px-3 py-2 rounded" />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have account?
          <Link to="/signin" className="text-blue-600 ml-1">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
