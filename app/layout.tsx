import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { supabase } from "@/lib/supabase";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RightBack Technology",
  description: "Advanced garment manufacturing solutions.",
};

async function getSiteSettings() {
  const { data } = await supabase
    .from("site_settings")
    .select("company_name, tagline, logo_url, phones, emails, address, facebook, instagram, linkedin")
    .limit(1)
    .single();

  return {
    companyName: data?.company_name ?? "RightBack Technology",
    tagline:
      data?.tagline ??
      "Precision machinery. Smarter production. Reliable performance.",
    logoUrl: data?.logo_url ?? null,
    phones: (data?.phones as string[]) ?? [],
    emails: (data?.emails as string[]) ?? [],
    address: data?.address ?? "",
    facebook: data?.facebook ?? "",
    instagram: data?.instagram ?? "",
    linkedin: data?.linkedin ?? "",
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteSettingsProvider value={settings}>
          <Header />
          {children}
        </SiteSettingsProvider>
      </body>
    </html>
  );
}