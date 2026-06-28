import React, { createContext, useContext, useState } from "react";

export type Profile = {
  name: string;
  phone: string;
  username: string;
  bio: string;
  avatarUri: string | null;
};

type ProfileContextType = {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
};

const defaultProfile: Profile = {
  name: "FLASH",
  phone: "+91 84389 52382",
  username: "@flash_user",
  bio: "Hey there! I am using Telegram.",
  avatarUri: null,
};

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  updateProfile: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  function updateProfile(updates: Partial<Profile>) {
    setProfile((prev) => ({ ...prev, ...updates }));
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
