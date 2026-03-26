import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock,Eye,EyeOff } from "lucide-react";
import axios from "axios";
import { useState } from "react";

export default function AdminLogin() {

  const navigate = useNavigate();
  const [password,setPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState({
    email: "",
    password: ""
  });

  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {

    const { name, value } = e.target;

    setLoginData({
      ...loginData,
      [name]: value
    });

    // Email validation
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

    // Password validation
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
            "Password must be 8+ characters with uppercase, lowercase, number & special character"
        }));
      }
      else {
        setError((prev) => ({ ...prev, password: "" }));
      }
    }

    setServerError("");
  };

  const validateForm = () => {

  let newError = {
    email: "",
    password: ""
  };

  let isValid = true;

  if (loginData.email.trim() === "") {
    newError.email = "Email is required";
    isValid = false;
  }

  if (loginData.password.trim() === "") {
    newError.password = "Password is required";
    isValid = false;
  }

  setError(newError);

  return isValid;
};

  const handleLogin = async () => {

  if (!validateForm()) return;

  try {

      const res = await axios.post(
        "http://localhost:3000/admin/login",
        loginData
      );

      if (res.data.admin) {

        localStorage.setItem("adminEmail", res.data.admin.email);

        navigate("/admin/dashboard");

      } else {
        setServerError(res.data.message);
      }

    } catch (error) {

      if (error.response) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Server error");
      }

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
          Sign In
        </h3>

        {/* Email */}
        <div className="mb-2 relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>

          <input
            type="email"
            name="email"
            value={loginData.email}
            placeholder="Email"
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg
            ${error.email ? "border-red-500" : loginData.email ? "border-green-500" : "border-gray-300"}`}
          />
        </div>

        {error.email && (
          <p className="text-red-500 text-m mb-2">{error.email}</p>
        )}

        {/* Password */}
        <div className="mb-2 relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>

          <input
            type={password ? "text" : "password"}
            name="password"
            value={loginData.password}
            placeholder="Password"
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg
            ${error.password ? "border-red-500" : loginData.password ? "border-green-500" : "border-gray-300"}`}
          />

          <button
                type="button"
                onClick={() => setPassword(!password)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {password ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
        </div>

        {error.password && (
          <p className="text-red-500 text-m mb-2">{error.password}</p>
        )}

        {/* Server Error */}
        {serverError && (
          <p className="text-red-500 text-m text-center mb-3">{serverError}</p>
        )}

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <Link
            to="/forgotpassword"
            className="text-m text-cyan-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600"
        >
          Sign In
        </button>

        {/* Signup */}
        <p className="text-m text-center mt-4">
          Don't have an account?{" "}
          <Link to="/adminSignup" className="text-cyan-600 hover:underline">
            Sign Up
          </Link>
        </p>

      </div>

    </div>
  );
}




// import { Link, useNavigate } from "react-router-dom";
// import { Mail, Lock } from "lucide-react";
// import axios from "axios";
// import { useState } from "react";

// export default function AdminLogin() {

//   const navigate = useNavigate();

//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: ""
//   });

//   const [error, setError] = useState({
//     email: "",
//     password: ""
//   });

//   const [serverError, setServerError] = useState("");

//   const handleChange = (e) => {
//     setLoginData({
//       ...loginData,
//       [e.target.name]: e.target.value
//     });

//     setError({
//       ...error,
//       [e.target.name]: ""
//     });

//     setServerError("");
//   };

//   const validate = () => {

//     let isValid = true;
//     let newError = { email: "", password: "" };

//     // Email required
//     if (loginData.email.trim() === "") {
//       newError.email = "Email is required";
//       isValid = false;
//     }

//     // Email format
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (loginData.email && !emailPattern.test(loginData.email)) {
//       newError.email = "Enter valid email address";
//       isValid = false;
//     }

//     // Password required
//     if (loginData.password.trim() === "") {
//       newError.password = "Password is required";
//       isValid = false;
//     }

//     setError(newError);
//     return isValid;
//   };

//   const handleLogin = async () => {

//     if (!validate()) return;

//     try {

//       const res = await axios.post(
//         "http://localhost:3000/admin/login",
//         loginData
//       );

//       if (res.data.admin) {

//         localStorage.setItem("adminEmail", res.data.admin.email);

//         setLoginData({
//           email: "",
//           password: ""
//         });

//         navigate("/admin/dashboard");

//       } else {
//         setServerError(res.data.message);
//       }

//     } catch (error) {

//       if (error.response) {
//         setServerError(error.response.data.message);
//       } else {
//         setServerError("Something went wrong");
//       }

//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">

//       <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-8">

//         {/* Logo */}
//         <div className="flex flex-col items-center mb-6">
//           <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold">BY</span>
//           </div>
//           <h2 className="text-xl font-semibold mt-2">BharatYatra</h2>
//         </div>

//         <h3 className="text-lg font-semibold text-center mb-6">
//           Sign In
//         </h3>

//         {/* Email */}
//         <div className="mb-2 relative">
//           <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>

//           <input
//             type="email"
//             name="email"
//             value={loginData.email}
//             placeholder="Email"
//             onChange={handleChange}
//             className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-cyan-500 
//             ${error.email ? "border-red-500" : "border-gray-300"}`}
//           />
//         </div>

//         {error.email && (
//           <p className="text-red-500 text-m mb-2">{error.email}</p>
//         )}

//         {/* Password */}
//         <div className="mb-2 relative">
//           <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>

//           <input
//             type="password"
//             name="password"
//             value={loginData.password}
//             placeholder="Password"
//             onChange={handleChange}
//             className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-cyan-500 
//             ${error.password ? "border-red-500" : "border-gray-300"}`}
//           />
//         </div>

//         {error.password && (
//           <p className="text-red-500 text-m mb-2">{error.password}</p>
//         )}

//         {/* Server Error */}
//         {serverError && (
//           <p className="text-red-500 text-m mb-3 text-center">{serverError}</p>
//         )}

//         {/* Forgot Password */}
//         <div className="text-right mb-4">
//           <Link
//             to="/forgotpassword"
//             className="text-m text-cyan-600 hover:underline"
//           >
//             Forgot Password?
//           </Link>
//         </div>

//         {/* Login Button */}
//         <button
//           onClick={handleLogin}
//           className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600"
//         >
//           Sign In
//         </button>

//         {/* Signup Link */}
//         <p className="text-m text-center mt-4">
//           Don't have an account?{" "}
//           <Link to="/adminSignup" className="text-cyan-600 hover:underline">
//             Sign Up
//           </Link>
//         </p>

//       </div>
//     </div>
//   );
// }