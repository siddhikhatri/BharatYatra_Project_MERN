// import { useEffect, useState } from "react";
// import DashboardSidebar from "../components/dashboard/DashboardSidebar";
// import DashboardHeader from "/src/components/dashboard/DashboardHeader";
// import { Upload, Eye, EyeOff } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "/src/context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function EditProfile() {
//   const { currentUser, token, openAuthModal } = useAuth();
//   const [activeTab, setActiveTab] = useState("basic");
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     dob: "",
//     address: "",
//     city: "",
//     country: "",
//     avatar: "",
//   });
//   const [errors, setErrors] = useState({});
//   const validateProfile = () => {
//     let newErrors = {};

//     if (!profile.name.trim()) {
//       newErrors.name = "Name is Required.";
//     }
//     if (!profile.email) {
//       newErrors.email = "Email is required";
//     }
//     if (!/^[6-9]\d{9}$/.test(profile.phone)) {
//       newErrors.phone = "Enter valid 10-digit phone number";
//     }

//     // DOB validation
//     if (profile.dob) {
//       const today = new Date();
//       const dobDate = new Date(profile.dob);
//       if (dobDate > today) {
//         newErrors.dob = "Date of birth cannot be in the future";
//       }
//       // Age calculation
//       const age = today.getFullYear() - dobDate.getFullYear();
//       if (age < 10) {
//         newErrors.dob = "Age must be at least 10 years";
//       }
//       if (age > 100) {
//         newErrors.dob = "Enter a valid date of birth";
//       }
//     }

//     if (!profile.city.trim()) {
//       newErrors.city = "City is required";
//     }
//     if (!profile.country.trim()) {
//       newErrors.country = "Country is required";
//     }
//     return newErrors;
//   };

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [passwordErrors, setPasswordErrors] = useState({})

//   const [forgotEmail, setForgotEmail] = useState("");
//   const [showPassword, setShowPassword] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//     forgot: false,
//   });

//   // Fetch user data
//   useEffect(() => {
//     window.scrollTo(0, 0);

//     //  If NO token → user not logged in
//     if (!token) {
//       openAuthModal("signin");
//       navigate("/");
//       return;
//     }

//     //  If token exists → fetch user data
//     if (currentUser) {
//       axios
//         .get(`http://localhost:3000/getUserDataByEmail/${currentUser.email}`)
//         .then((res) =>
//           setProfile((prev) => ({
//             ...prev,
//             ...res.data,
//           }))
//         )
//         .catch((err) => console.error("Error fetching user data:", err));
//     }

//   }, [token, currentUser, navigate]);

//   // Handlers
//   const handleChange = (e) =>
//     setProfile({ ...profile, [e.target.name]: e.target.value });

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;

//     setPasswordData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Live validation
//     setPasswordErrors((prev) => {
//       let updatedErrors = { ...prev };

//       if (name === "newPassword") {
//         const passwordRegex =
//           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

//         if (!value) {
//           updatedErrors.newPassword = "New password is required";
//         } else if (!passwordRegex.test(value)) {
//           updatedErrors.newPassword =
//             "Password must be 8+ chars, include uppercase, lowercase, number & special character";
//         } else {
//           delete updatedErrors.newPassword; // REMOVE ERROR
//         }
//       }

//       // Confirm password live match
//       if (name === "confirmPassword" || name === "newPassword") {
//         if (
//           passwordData.confirmPassword &&
//           value !== passwordData.confirmPassword &&
//           name === "newPassword"
//         ) {
//           updatedErrors.confirmPassword = "Passwords do not match";
//         } else if (
//           name === "confirmPassword" &&
//           value !== passwordData.newPassword
//         ) {
//           updatedErrors.confirmPassword = "Passwords do not match";
//         } else {
//           delete updatedErrors.confirmPassword; // REMOVE ERROR
//         }
//       }

//       return updatedErrors;
//     });
//   };

//   // Avatar upload
//   const handleAvatarUpload = (e) => {
//     if (!profile.email) return alert("Email not found!");
//     const file = e.target.files[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("avatar", file);
//     axios
//       .post(`http://localhost:3000/uploadUserAvatar/${profile.email}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       .then((res) => {
//         setProfile({ ...profile, avatar: res.data.avatar });
//         alert("Avatar uploaded successfully!");
//       })
//       .catch((err) => alert("Error uploading avatar: " + err.message));
//   };

//   // Profile submit
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const validationErrors = validateProfile();

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     axios
//       .put(`http://localhost:3000/updateUserDataByEmail/${currentUser.email}`, profile)
//       .then(() => {
//         alert("Profile updated successfully!");
//         setErrors({});
//       })
//       .catch((err) => alert("Error updating profile: " + err.message));
//   };

//   // Password submit
//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();

//     const { currentPassword, newPassword, confirmPassword } = passwordData;

//     let errors = {};

//     // 1. Required validation
//     if (!currentPassword) errors.currentPassword = "Current password is required";
//     if (!newPassword) errors.newPassword = "New password is required";
//     if (!confirmPassword) errors.confirmPassword = "Confirm password is required";

//     // 2. Strong password regex
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

//     if (newPassword && !passwordRegex.test(newPassword)) {
//       errors.newPassword =
//         "Password must be 8+ chars, include uppercase, lowercase, number & special character";
//     }

//     // 3. New password ≠ current password
//     if (currentPassword && newPassword && currentPassword === newPassword) {
//       errors.newPassword = "New password must be different from current password";
//     }



//     // If any error → stop
//     if (Object.keys(errors).length > 0) {
//       setPasswordErrors(errors);
//       return;
//     }

//     try {
//       const res = await axios.post("http://localhost:3000/changePassword", {
//         email: profile.email,
//         currentPassword,
//         newPassword,
//       });

//       alert(res.data.message || "Password Updated Successfully!");

//       setPasswordData({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });

//       setPasswordErrors({});
//     } catch (err) {
//       setPasswordErrors({
//         currentPassword:
//           err.response?.data?.message || "Current Password is Incorrect",
//       });
//     }
//   };

//   // Forgot password handler
//   const handleForgotPassword = (e) => {
//     e.preventDefault();
//     if (!forgotEmail) return alert("Please Enter Your Email.");

//     axios
//       .post("http://localhost:3000/forgotpassword", { email: forgotEmail })
//       .then((res) => alert(res.data.message))
//       .catch((err) =>
//         alert("Error sending password: " + (err.response?.data?.message || err.message))
//       );
//   };

//   if (!currentUser) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <p className="text-lg">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen">
//       <DashboardSidebar />
//       <div className="flex-1 flex flex-col">
//         <DashboardHeader />
//         <div className="p-8 bg-gray-50 flex-1">
//           <h1 className="text-3xl font-bold mb-6">Profile</h1>
//           <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl">

//             {/* Tabs */}
//             <div className="flex gap-8 border-b mb-8">
//               {["basic", "password", "forgot"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`pb-3 ${activeTab === tab
//                     ? "text-orange-500 border-b-2 border-orange-500 font-semibold"
//                     : "text-black"}`}
//                 >
//                   {tab === "basic" ? "Basic Info" : tab === "password" ? "Change Password" : "Forgot Password"}
//                 </button>
//               ))}
//             </div>

//             {/* BASIC INFO */}
//             {activeTab === "basic" && (
//               <form onSubmit={handleSubmit}>
//                 <div className="flex items-center gap-6 mb-8">
//                   <div className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden">
//                     {profile.avatar ? (
//                       <img
//                         src={`http://localhost:3000/Images/users/${profile.avatar}`}
//                         alt="profile"
//                         className="w-full h-full object-cover"
//                       />
//                     ) : profile.name.charAt(0).toUpperCase()}
//                   </div>

//                   <div>
//                     <p className="font-medium">{currentUser.name}</p>
//                     <p className="text-sm text-gray-500">You are logged in</p>
//                   </div>

//                   <label className="ml-auto text-orange-500 cursor-pointer flex items-center gap-1">
//                     <Upload size={16} /> Upload
//                     <input type="file" onChange={handleAvatarUpload} className="hidden" />
//                   </label>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <input
//                     type="text"
//                     name="name"
//                     value={profile.name}
//                     onChange={handleChange}
//                     className={`border rounded-lg p-3 ${errors.name ? "border-red-500" : ""}`}
//                   />
//                   {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

//                   <input
//                     type="text"
//                     name="phone"
//                     value={profile.phone || ""}
//                     onChange={handleChange}
//                     maxLength={10}
//                     className={`border rounded-lg p-3 ${errors.phone ? "border-red-500" : ""}`}
//                     placeholder="Enter 10-digit phone number"
//                   />

//                   {errors.phone && (
//                     <p className="text-red-500 text-sm">{errors.phone}</p>
//                   )}
//                   <input
//                     type="text"
//                     name="phone"
//                     value={profile.phone}
//                     onChange={handleChange}
//                     className={`border rounded-lg p-3 ${errors.phone ? "border-red-500" : ""}`}
//                   />
//                   {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

//                   <input
//                     type="date"
//                     name="dob"
//                     value={profile.dob || ""}
//                     onChange={handleChange}
//                     max={new Date().toISOString().split("T")[0]} // ✅ disables future dates
//                     className={`border rounded-lg p-3 ${errors.dob ? "border-red-500" : ""}`}
//                   />

//                   {errors.dob && (
//                     <p className="text-red-500 text-sm">{errors.dob}</p>
//                   )}

//                   <input type="text" name="address" placeholder="Address" value={profile.address} onChange={handleChange} className="border rounded-lg p-3" />
//                   <input
//                     type="text"
//                     name="city"
//                     value={profile.city}
//                     onChange={handleChange}
//                     className={`border rounded-lg p-3 ${errors.city ? "border-red-500" : ""}`}
//                   />
//                   {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

//                   <input
//                     type="text"
//                     name="country"
//                     value={profile.country}
//                     onChange={handleChange}
//                     className={`border rounded-lg p-3 ${errors.country ? "border-red-500" : ""}`}
//                   />
//                   {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
//                 </div>

//                 <button type="submit" className="mt-6 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600">
//                   Save
//                 </button>
//               </form>
//             )}

//             {/* CHANGE PASSWORD */}
//             {activeTab === "password" && (
//               <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">

//                 {/* Current Password */}
//                 <div>
//                   <div className="relative">
//                     <input
//                       type={showPassword.current ? "text" : "password"}
//                       name="currentPassword"
//                       placeholder="Current Password*"
//                       value={passwordData.currentPassword}
//                       onChange={handlePasswordChange}
//                       className={`border rounded-lg p-3 w-full pr-10 ${passwordErrors.currentPassword ? "border-red-500" : ""
//                         }`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowPassword({ ...showPassword, current: !showPassword.current })
//                       }
//                       className="absolute right-3 top-3 text-gray-400"
//                     >
//                       {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
//                     </button>
//                   </div>
//                   {passwordErrors.currentPassword && (
//                     <p className="text-red-500 text-sm mt-1">
//                       ❌ {passwordErrors.currentPassword}
//                     </p>
//                   )}
//                 </div>

//                 {/* New Password */}
//                 <div>
//                   <div className="relative">
//                     <input
//                       type={showPassword.new ? "text" : "password"}
//                       name="newPassword"
//                       placeholder="New Password*"
//                       value={passwordData.newPassword}
//                       onChange={handlePasswordChange}
//                       className={`border rounded-lg p-3 w-full pr-10 ${passwordErrors.newPassword ? "border-red-500" : ""
//                         }`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowPassword({ ...showPassword, new: !showPassword.new })
//                       }
//                       className="absolute right-3 top-3 text-gray-400"
//                     >
//                       {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
//                     </button>
//                   </div>
//                   {passwordErrors.newPassword && (
//                     <p className="text-red-500 text-sm mt-1">
//                       ❌ {passwordErrors.newPassword}
//                     </p>
//                   )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <div className="relative">
//                     <input
//                       type={showPassword.confirm ? "text" : "password"}
//                       name="confirmPassword"
//                       placeholder="Confirm Password*"
//                       value={passwordData.confirmPassword}
//                       onChange={handlePasswordChange}
//                       className={`border rounded-lg p-3 w-full pr-10 ${passwordErrors.confirmPassword ? "border-red-500" : ""
//                         }`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowPassword({ ...showPassword, confirm: !showPassword.confirm })
//                       }
//                       className="absolute right-3 top-3 text-gray-400"
//                     >
//                       {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
//                     </button>
//                   </div>

//                   {passwordErrors.confirmPassword && (
//                     <p className="text-red-500 text-sm mt-1">
//                       ❌ {passwordErrors.confirmPassword}
//                     </p>
//                   )}

//                   {/* Live Match */}
//                   {passwordData.confirmPassword && (
//                     passwordData.newPassword === passwordData.confirmPassword ? (
//                       <p className="text-green-600 text-sm">✔ Passwords Match With New Password</p>
//                     ) : (
//                       <p className="text-red-500 text-sm">❌ Passwords do not match</p>
//                     )
//                   )}
//                 </div>

//                 <button
//                   type="submit"
//                   className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600"
//                 >
//                   Update Password
//                 </button>
//               </form>
//             )}

//             {/* FORGOT PASSWORD */}
//             {activeTab === "forgot" && (
//               <form onSubmit={handleForgotPassword} className="max-w-md">
//                 <input
//                   type="email"
//                   placeholder="Enter your email*"
//                   value={forgotEmail}
//                   onChange={(e) => setForgotEmail(e.target.value)}
//                   className="border rounded-lg p-3 w-full mb-4"
//                   required
//                 />

//                 <button
//                   type="submit"
//                   className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600"
//                 >
//                   Send Reset Link
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "/src/components/dashboard/DashboardHeader";
import { Upload, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useAuth } from "/src/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { currentUser, token, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
    country: "",
    avatar: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({})

  const [forgotEmail, setForgotEmail] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
    forgot: false,
  });

  // Fetch user data
  useEffect(() => {
    window.scrollTo(0, 0);

    //  If NO token → user not logged in
    if (!token) {
      openAuthModal("signin");
      navigate("/");
      return;
    }

    // ✅ If token exists → fetch user data
    if (currentUser) {
      axios
        .get(`http://localhost:3000/getUserDataByEmail/${currentUser.email}`)
        .then((res) => setProfile(res.data))
        .catch((err) => console.error("Error fetching user data:", err));
    }

  }, [token, currentUser, navigate]);

  // Handlers
  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Live validation
    setPasswordErrors((prev) => {
      let updatedErrors = { ...prev };

      if (name === "newPassword") {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!value) {
          updatedErrors.newPassword = "New password is required";
        } else if (!passwordRegex.test(value)) {
          updatedErrors.newPassword =
            "Password must be 8+ chars, include uppercase, lowercase, number & special character";
        } else {
          delete updatedErrors.newPassword; // REMOVE ERROR
        }
      }

      // Confirm password live match
      if (name === "confirmPassword" || name === "newPassword") {
        if (
          passwordData.confirmPassword &&
          value !== passwordData.confirmPassword &&
          name === "newPassword"
        ) {
          updatedErrors.confirmPassword = "Passwords do not match";
        } else if (
          name === "confirmPassword" &&
          value !== passwordData.newPassword
        ) {
          updatedErrors.confirmPassword = "Passwords do not match";
        } else {
          delete updatedErrors.confirmPassword; // REMOVE ERROR
        }
      }

      return updatedErrors;
    });
  };

  // Avatar upload
  const handleAvatarUpload = (e) => {
    if (!profile.email) return alert("Email not found!");
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    axios
      .post(`http://localhost:3000/uploadUserAvatar/${profile.email}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setProfile({ ...profile, avatar: res.data.avatar });
        alert("Avatar uploaded successfully!");
      })
      .catch((err) => alert("Error uploading avatar: " + err.message));
  };

  // Profile submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profile.name || !profile.email || !profile.phone || !profile.city || !profile.country) {
      return alert("Please fill all required fields!");
    }
    axios
      .put(`http://localhost:3000/updateUserDataByEmail/${currentUser.email}`, profile)
      .then(() => alert("Profile updated successfully!"))
      .catch((err) => alert("Error updating profile: " + err.message));
  };

  // Password submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    let errors = {};

    // 1. Required validation
    if (!currentPassword) errors.currentPassword = "Current password is required";
    if (!newPassword) errors.newPassword = "New password is required";
    if (!confirmPassword) errors.confirmPassword = "Confirm password is required";

    // 2. Strong password regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (newPassword && !passwordRegex.test(newPassword)) {
      errors.newPassword =
        "Password must be 8+ chars, include uppercase, lowercase, number & special character";
    }

    // 3. New password ≠ current password
    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.newPassword = "New password must be different from current password";
    }



    // If any error → stop
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/changePassword", {
        email: profile.email,
        currentPassword,
        newPassword,
      });

      alert(res.data.message || "Password Updated Successfully!");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordErrors({});
    } catch (err) {
      setPasswordErrors({
        currentPassword:
          err.response?.data?.message || "Current Password is Incorrect",
      });
    }
  };

  // Forgot password submit
  // Forgot password handler
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) return alert("Please Enter Your Email.");

    axios
      .post("http://localhost:3000/forgotpassword", { email: forgotEmail })
      .then((res) => alert(res.data.message))
      .catch((err) =>
        alert("Error sending password: " + (err.response?.data?.message || err.message))
      );
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="p-8 bg-gray-50 flex-1">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl">

            {/* Tabs */}
            <div className="flex gap-8 border-b mb-8">
              {["basic", "password", "forgot"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 ${activeTab === tab
                    ? "text-orange-500 border-b-2 border-orange-500 font-semibold"
                    : "text-black"}`}
                >
                  {tab === "basic" ? "Basic Info" : tab === "password" ? "Change Password" : ""}
                </button>
              ))}
            </div>

            {/* BASIC INFO */}
            {activeTab === "basic" && (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                    {profile.avatar ? (
                      <img
                        src={`http://localhost:3000/Images/users/${profile.avatar}`}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : profile.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-sm text-gray-500">You are logged in</p>
                  </div>

                  <label className="ml-auto text-orange-500 cursor-pointer flex items-center gap-1">
                    <Upload size={16} /> Upload
                    <input type="file" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="name" placeholder="Full Name*" value={profile.name} onChange={handleChange} className="border rounded-lg p-3" required />
                  <input type="email" name="email" placeholder="Email*" value={profile.email} onChange={handleChange} className="border rounded-lg p-3" required />
                  <input type="text" name="phone" placeholder="Phone number*" value={profile.phone} onChange={handleChange} className="border rounded-lg p-3" required />
                  <input type="date" name="dob" value={profile.dob} onChange={handleChange} className="border rounded-lg p-3" />
                  <input type="text" name="address" placeholder="Address" value={profile.address} onChange={handleChange} className="border rounded-lg p-3" />
                  <input type="text" name="city" placeholder="City*" value={profile.city} onChange={handleChange} className="border rounded-lg p-3" required />
                  <input type="text" name="country" placeholder="Country*" value={profile.country} onChange={handleChange} className="border rounded-lg p-3" required />
                </div>

                <button type="submit" className="mt-6 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600">
                  Save
                </button>
              </form>
            )}

            {/* CHANGE PASSWORD */}
            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">

                {/* Current Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="currentPassword"
                      placeholder="Current Password*"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`border rounded-lg p-3 w-full pr-10 ${passwordErrors.currentPassword ? "border-red-500" : ""
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword({ ...showPassword, current: !showPassword.current })
                      }
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      ❌ {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="newPassword"
                      placeholder="New Password*"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`border rounded-lg p-3 w-full pr-10 ${passwordErrors.newPassword ? "border-red-500" : ""
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword({ ...showPassword, new: !showPassword.new })
                      }
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      ❌ {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password*"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`border rounded-lg p-3 w-full pr-10 ${passwordErrors.confirmPassword ? "border-red-500" : ""
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword({ ...showPassword, confirm: !showPassword.confirm })
                      }
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      ❌ {passwordErrors.confirmPassword}
                    </p>
                  )}

                  {/* Live Match */}
                  {passwordData.confirmPassword && (
                    passwordData.newPassword === passwordData.confirmPassword ? (
                      <p className="text-green-600 text-sm">✔ Passwords Match With New Password</p>
                    ) : (
                      <p className="text-red-500 text-sm">❌ Passwords do not match</p>
                    )
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600"
                >
                  Update Password
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD */}
           
          </div>
        </div>
      </div>
    </div>
  );
}