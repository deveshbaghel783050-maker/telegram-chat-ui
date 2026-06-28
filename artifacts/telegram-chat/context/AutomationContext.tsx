import React, { createContext, useContext, useState } from "react";
import { Message } from "./ProfileContext";
import { RandomUser } from "@/utils/randomData";

export type GeneratedScreenshot = {
  id: string;
  dataUrl: string;
  label: string;
};

export type ChatFolder = {
  id: string;
  user: RandomUser;
  messages: Message[];
  screenshots: GeneratedScreenshot[];
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  chats: ChatFolder[];
  createdAt: string;
  screenshotCount: number;
};

type AutomationContextType = {
  projects: Project[];
  addProject: (p: Project) => void;
  deleteProject: (id: string) => void;
  clearAll: () => void;
};

const AutomationContext = createContext<AutomationContextType>({} as AutomationContextType);

export function AutomationProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  function addProject(p: Project) {
    setProjects((prev) => [p, ...prev]);
  }

  function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  function clearAll() {
    setProjects([]);
  }

  return (
    <AutomationContext.Provider value={{ projects, addProject, deleteProject, clearAll }}>
      {children}
    </AutomationContext.Provider>
  );
}

export function useAutomation() {
  return useContext(AutomationContext);
}
