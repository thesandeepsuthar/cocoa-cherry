"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isLoginOpen: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_LOGIN_OPEN":
      return { ...state, isLoginOpen: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_USER", payload: data.data.user });
      } else {
        dispatch({ type: "SET_USER", payload: null });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      dispatch({ type: "SET_USER", payload: null });
    }
  };

  const login = async (mobile, otp, name, email) => {
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp, name, email }),
      });

      const data = await response.json();

      if (data.success) {
        dispatch({ type: "SET_USER", payload: data.data.user });
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch({ type: "LOGOUT" });
    }
  };

  const sendOTP = async (mobile) => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Send OTP failed:", error);
      return { success: false, message: "Failed to send OTP" };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.success) {
        dispatch({ type: "SET_USER", payload: data.data.user });
      }

      return data;
    } catch (error) {
      console.error("Update profile failed:", error);
      return { success: false, message: "Failed to update profile" };
    }
  };

  const value = {
    ...state,
    login,
    logout,
    sendOTP,
    updateProfile,
    checkAuth,
    setIsLoginOpen: (isOpen) =>
      dispatch({ type: "SET_LOGIN_OPEN", payload: isOpen }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
