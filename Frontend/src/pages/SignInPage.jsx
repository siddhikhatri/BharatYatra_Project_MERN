import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Mail, Lock, User as UserIcon, Phone, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignInPage()
{
    const navigate=useNavigate()
    const [formData, setFormData] = useState({
    // Sign In
    email: '',
    password: '',
    })

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.value]:e.target.value,})
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        const savedUser=JSON.stringify(localStorage.getItem('travelUser'))
        if(savedUser && savedUser.email === formData.email && savedUser.password === formData.password)
        {
            localStorage.setItem("isLoggedIn","true")
            alert("login Successful.")
            navigate("/Packages")
        }
        else{
            alert("Invalid Email Or Password")
        }
    }


    return(<>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Sign In to Bharat Yatra
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 text-sm text-center space-y-2">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline block"
          >
            Forgot Password?
          </Link>

          <p>
            Don’t have an account?
            <Link
              to="/signup"
              className="ml-1 text-blue-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>)
}