"use client";

import { createContext, useContext, ReactNode } from "react";

export type SiteSettingsValue = {
  companyName: string;
  tagline: string;
  logoUrl: string | null;
  phones: string[];
  emails: string[];
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
};

const defaultValue: SiteSettingsValue = {
  companyName: "RightBack Technology",
  tagline: "Precision machinery. Smarter production. Reliable performance.",
  logoUrl: null,
  phones: [],
  emails: [],
  address: "",
  facebook: "",
  instagram: "",
  linkedin: "",
};

const SiteSettingsContext = createContext<SiteSettingsValue>(defaultValue);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteSettingsValue;
  children: ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}