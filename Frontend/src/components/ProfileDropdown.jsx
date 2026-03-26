import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({ openAuthModal }) => {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/");
  };

  return (
    <div className="profile-container">
      <div onClick={() => setOpen(!open)}>
        👤 {isLoggedIn ? currentUser.name : "Visitor"}
      </div>

      {open && (
        <div className="dropdown">
          {!isLoggedIn && (
            <>
              <div onClick={() => openAuthModal("signin")}>Sign In</div>
              <div onClick={() => openAuthModal("signup")}>Sign Up</div>
            </>
          )}

          {isLoggedIn && (
            <>
              <div onClick={handleDashboard}>Dashboard</div>
              <div onClick={() => navigate("/edit-profile")}>
                Edit Profile
              </div>
              <div onClick={() => openAuthModal("changePassword")}>
                Change Password
              </div>
              <div onClick={logout}>Logout</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
