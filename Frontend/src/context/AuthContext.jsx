import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  //  Axios default header (auto attach token)
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  //  Restore user on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setCurrentUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);


  //used when token expired but exist in localstorage so manage and user can not face issue
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          // Token expired or invalid
          setCurrentUser(null);
          setToken(null);

          localStorage.removeItem("currentUser");
          localStorage.removeItem("token");

          alert("Session Expired. Please Login Again.");

          window.location.href = "/";
        }
        return Promise.reject(err);
      }
    );
    // cleanup
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  //  LOGIN
  const login = async (email, password) => {
    const res = await axios.post("http://127.0.0.1:3000/loginUser", {
      email,
      password,
    });

    if (res.data.flag === 1) {
      const user = res.data.user;
      const token = res.data.token;

      //  Save in state
      setCurrentUser(user);
      setToken(token);

      //  Save in localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("token", token);

      closeAuthModal();

      return res.data; // IMPORTANT
    } else {
      throw new Error(res.data.msg);
    }
  };

  //  LOGOUT
  const logout = () => {
    setCurrentUser(null);
    setToken(null);

    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  };

  // (optional keep)
  const updateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  // Auth Modal
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    tab: "signin",
  });

  const openAuthModal = (tab = "signin") => {
    setAuthModal({ isOpen: true, tab });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, tab: "signin" });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isLoggedIn: !!token, //  NOW BASED ON TOKEN
        login,
        logout,
        updateProfile,
        authModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);