import React, { useEffect, useState, createContext, useContext } from "react";

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState();
  const [cardData, setCardData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [admin, setAdmin] = useState();

  // Base backend URL - use Vite env var in production, fallback to localhost for dev
  const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  const setTokenInLs = (tkn) => {
    setToken(tkn);
    if (tkn) {
      localStorage.setItem("token", tkn);
    } else {
      localStorage.removeItem("token");
    }
  };

  const isLoggedIn = !!token;

  const LogoutUser = () => {
    setToken(""); // removing token from state
    setAdmin(false);
    localStorage.removeItem("token"); // removing token from local storage
  };

  // helper to get Authorization header only when token exists
  const getAuthHeaders = () => {
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const authentication = async () => {
    try {
      if (!token) {
        // no token -> skip authentication and clear state
        setUserData(undefined);
        setAdmin(false);
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE}/api/auth/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        // credentials: 'include' // uncomment only if backend uses cookies/sessions
      });

      if (response.ok) {
        const Data = await response.json();
        setUserData(Data);
        setAdmin(Data.isAdmin);
      } else {
        // token invalid or expired - clear local auth
        setUserData(undefined);
        setAdmin(false);
        // optional: remove token from storage if server says unauthorized
        if (response.status === 401 || response.status === 403) {
          setTokenInLs("");
        }
      }
    } catch (error) {
      console.error("error from the authentication function at auth.jsx", error);
    } finally {
      setLoading(false);
    }
  };

  // to fetch the card details on the services page
  const getServices = async () => {
    try {
      const response = await fetch(`${BASE}/data/service`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: 'include' // uncomment for cookie-based auth if needed
      });
      if (response.ok) {
        const data = await response.json();
        setCardData(data);
      } else {
        console.error("Failed to load services", response.status);
      }
    } catch (error) {
      console.error("error from the card/auth.jsx", error);
    }
  };

  useEffect(() => {
    getServices();
    authentication();
    // run when token changes (login/logout)
  }, [token]);

  return (
    <authContext.Provider
      value={{
        cardData,
        userData,
        isLoggedIn,
        setTokenInLs,
        LogoutUser,
        token,
        isLoading,
        admin,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(authContext);
};
