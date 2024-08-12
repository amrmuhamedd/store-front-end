import axios from "axios";
import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticated = localStorage.getItem("token");
    setIsAuthenticated(authenticated ? true : false);
  });
  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/auth/me",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        if (err.request.status == 401) {
          logout();
        }
      });
  }, [isAuthenticated]);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to fetch user", error);
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };

    fetchUser();
  }, []);
  const getUser = () => {
    axios({
      method: "GET",
      url: "/api/auth/me",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        if (err.request.status == 401) {
          logout();
        }
      });
  };
  const logout = () => {
    localStorage.clear();
    setUser({});
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        getUser,
        setIsAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
