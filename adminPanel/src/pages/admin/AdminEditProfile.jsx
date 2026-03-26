import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Upload, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function AdminEditProfile() {
  const navigate = useNavigate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");


  const email = localStorage.getItem("adminEmail");
  console.log("Admin Email:", email);

  useEffect(() => {
    if (!email) {
      navigate("/adminLogin");
    }
  }, [])

  const [activeTab, setActiveTab] = useState("profile");
  const [image, setImage] = useState("");

  const uploadAvatar = async (file) => {

    const formData = new FormData();
    formData.append("image", file);

    try {

      const res = await axios.post(
        "http://localhost:3000/admin/uploadImage/" + email,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setImage(res.data.image);

    } catch (err) {
      console.log(err);
    }

  };

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {

    if (!email) return;

    const fetchProfile = async () => {

      try {

        const res = await axios.get(
          "http://localhost:3000/admin/getProfile/" + email
        );

        setProfile({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone
        });

        if (res.data.image) {
          setImage(res.data.image);
        }

      } catch (error) {
        console.log(error);
      }

    };

    fetchProfile();

  }, [email]);

  const updateProfile = async () => {

    if (phoneError) {
      alert("Please fix phone number");
      return;
    }

    try {

      const res = await axios.put(
        "http://localhost:3000/admin/updateProfile/" + email,
        profile
      );

      alert(res.data.message);

    } catch (error) {

      console.log(error);

    }

  };

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };


  const changePassword = async () => {

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:3000/admin/changePassword",
        {
          email,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        }
      );

      alert(res.data.message);

    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile({
      ...profile,
      [name]: value
    });

    // PHONE VALIDATION
    if (name === "phone") {

      const phonePattern = /^[789]\d{9}$/;

      if (value.trim() === "") {
        setPhoneError("Phone number is required");
      }
      else if (!phonePattern.test(value)) {
        setPhoneError("Phone must start with 9, 8, or 7 and be 10 digits");
      }
      else {
        setPhoneError("");
      }
    }
  };

  return (
    <div className="flex flex-col items-left mt-6">

      {/* Heading */}
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      {/* Buttons OUTSIDE BOX */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-5 py-2 rounded-lg text-sm ${activeTab === "profile"
            ? "bg-cyan-500 text-white"
            : "bg-gray-200"
            }`}
        >
          Profile Details
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`px-5 py-2 rounded-lg text-sm ${activeTab === "password"
            ? "bg-cyan-500 text-white"
            : "bg-gray-200"
            }`}
        >
          Change Password
        </button>
      </div>

      {/* BOX */}
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-lg p-6">

        {/* PROFILE DETAILS */}
        {activeTab === "profile" && (
          <div className="space-y-4">

            {/* Profile Image */}
            <div className="flex flex-col items-center gap-3 mb-4">

              <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-cyan-500 text-white text-3xl font-semibold">

                {image ? (
                  <img
                    src={`http://localhost:3000/Images/admins/${image}`}
                    alt="admin"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.name?.charAt(0).toUpperCase()
                )}

              </div>

              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    uploadAvatar(e.target.files[0]);
                  }
                }}
              />

            </div>

            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-" />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // only numbers
                  handleChange({ target: { name: "phone", value } });
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>

            <button
              onClick={updateProfile}
              className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600"
            >
              Update Profile
            </button>

          </div>
        )}

        {/* CHANGE PASSWORD */}
        {activeTab === "password" && (
          <div className="space-y-4">

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                readOnly
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100"
              />
            </div>

            {/* Current Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                placeholder="Current Password"
                onChange={handlePasswordChange}
                className="w-full pl-10 pr-10 py-2 border rounded-lg"
              />

              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>


            {/* New Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                onChange={handlePasswordChange}
                className="w-full pl-10 pr-10 py-2 border rounded-lg"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>


            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handlePasswordChange}
                className="w-full pl-10 pr-10 py-2 border rounded-lg"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>


            <button
              onClick={changePassword}
              className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600"
            >
              Change Password
            </button>

          </div>
        )}


      </div>

    </div>
  );
}