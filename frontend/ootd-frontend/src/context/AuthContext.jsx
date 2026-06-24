import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    console.log("Saved Token:", savedToken);
    console.log("Saved User:", savedUser);

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      console.log("Login Response:", response.data);

      const token = response.data.token;
      const user = response.data.user;

      if (!token) {
        throw new Error("Token not received from backend");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Stored Token:", localStorage.getItem("token"));

      setToken(token);
      setUser(user);

      return response.data;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log("Signup Response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    window.location.href = "/login";
  };

  const checkAuth = () => {
    return !!localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
        checkAuth,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

