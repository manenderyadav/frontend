import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => localStorage.getItem("token"));
  const [username, setUsername] = useState(() => localStorage.getItem("username"));

  const login = (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setUser(token);
    setUsername(username);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setUsername(null);
  };

  const value = { user, login, logout, username };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
