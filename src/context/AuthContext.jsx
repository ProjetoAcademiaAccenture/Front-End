import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // 'banco', 'loja', 'admin'

  const login = (userData, type) => {
    setUser(userData);
    setUserType(type);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  const signup = (userData, type) => {
    setUser(userData);
    setUserType(type);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        userType,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
