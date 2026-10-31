import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const login = (loginResponse) => {

    const {
      access_token,
      user
    } = loginResponse;

    // Store JWT
    localStorage.setItem(
      "token",
      access_token
    );

    // Store user information
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    // Update React state
    setUser(user);
  };


  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {

  return useContext(AuthContext);
}