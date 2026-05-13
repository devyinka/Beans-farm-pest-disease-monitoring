"use client";
import { createContext, useContext, useState } from "react";
import { UserProfile } from "@/types/type";

// Context to manage user login state and profile information across the app
const UserLoginContext = createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  userProfile: UserProfile | null; // null means no user is logged in yet
  setUserProfile: (profile: UserProfile | null) => void;
}>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userProfile: null,
  setUserProfile: () => {},
});

export const UserLoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  return (
    <UserLoginContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userProfile,
        setUserProfile,
      }}
    >
      {children}
    </UserLoginContext.Provider>
  );
};

export const useUserLoginContext = () => {
  const context = useContext(UserLoginContext);
  if (!context) {
    throw new Error("useUserLogin must be used within UserLoginProvider");
  }
  return context;
};
