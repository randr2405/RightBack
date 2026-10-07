import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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

const SITE_URL = "https://www.rightback.co.za";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "RightBack Technology",
  authors: [{ name: "RightBack Technology", url: SITE_URL }],
  creator: "RightBack Technology",
  publisher: "RightBack Technology",
  category: "business",
  title: {
    default: "RightBack Technology | Garment Manufacturing Solutions",
    template: "%s | RightBack Technology",
  },
  description:
    "Advanced garment manufacturing solutions: turnkey factory setups, sewing machine spares and garment manufacturing consumables online.",
  keywords: [
    "advanced garment manufacturing solutions",
    "turnkey garment manufacturing solutions",
    "sewing machine spares online",
    "garment manufacturing consumables online",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "RightBack Technology | Garment Manufacturing Solutions",
    description:
      "Advanced garment manufacturing solutions: turnkey factory setups, sewing machine spares and garment manufacturing consumables online.",
    url: "/",
    siteName: "RightBack Technology",
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RightBack Technology | Garment Manufacturing Solutions",
    description:
      "Advanced garment manufacturing solutions: turnkey factory setups, sewing machine spares and garment manufacturing consumables online.",
  },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.companyName,
    url: SITE_URL,
    description:
      "Advanced garment manufacturing solutions: turnkey factory setups, sewing machine spares and garment manufacturing consumables online.",
    logo: settings.logoUrl ?? undefined,
    telephone: settings.phones[0] || undefined,
    email: settings.emails[0] || undefined,
    address: settings.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.address,
          addressCountry: "ZA",
        }
      : undefined,
    sameAs: [settings.facebook, settings.instagram, settings.linkedin].filter(Boolean),
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SiteSettingsProvider value={settings}>
          <Header />
          {children}
        </SiteSettingsProvider>
      </body>
      <GoogleAnalytics gaId="G-8H3HDZP8HT" />
    </html>
  );
}