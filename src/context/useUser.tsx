import React, { createContext, useState, useContext, useEffect } from "react";

interface UserProps {
  name: string;
  email: string;
  avatar: string;
}

interface UserContextProps {
  user: UserProps | null;
}

// create the context with the interface and an initial null value
const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserProps | null>(null);

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
