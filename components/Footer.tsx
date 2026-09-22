"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.878h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.114 20.452H3.558V9h3.556v11.452Z" />
    </svg>
  );
}

export default function Footer() {
  const { companyName, tagline, phones, emails, address, facebook, instagram, linkedin } =
    useSiteSettings();
  const [firstWord, ...rest] = companyName.split(" ");
  const restOfName = rest.join(" ");

  const hasSocials = facebook || instagram || linkedin;

  return (
    <footer className="bg-neutral-100 text-black mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand block */}
          <div className="md:col-span-5">
            <h3 className="text-3xl font-bold tracking-tight">
              {firstWord}
              {restOfName && <span className="block text-red">{restOfName}</span>}
            </h3>
            <p className="mt-4 text-black/60 text-sm leading-relaxed max-w-xs">
              Advanced garment manufacturing technology and solutions for
              factories across Southern Africa.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-black group"
            >
              Get in touch
              <span className="inline-block transition-transform group-hover:translate-x-1">
                {"\u2192"}
              </span>
            </Link>

            {hasSocials && (
              <div className="flex items-center gap-3 mt-6">
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:text-red hover:border-red/40 transition-colors"
                  >
                    <FacebookIcon />
                  </a>
                )}
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:text-red hover:border-red/40 transition-colors"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:text-red hover:border-red/40 transition-colors"
                  >
                    <LinkedinIcon />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Contact block */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-black/70">
              {phones.length > 0 && (
                <li className="flex items-start gap-3">
                  <Phone size={16} className="mt-0.5 shrink-0 text-red" />
                  <div className="space-y-1">
                    {phones.map((phone) => (
                      <div key={phone}>{phone}</div>
                    ))}
                  </div>
                </li>
              )}
              {emails.length > 0 && (
                <li className="flex items-start gap-3 pt-2">
                  <Mail size={16} className="mt-0.5 shrink-0 text-red" />
                  <div className="space-y-1">
                    {emails.map((email) => (
                      <a
                        key={email}
                        href={"mailto:" + email}
                        className="block hover:text-red transition-colors"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Visit block */}
          {address && (
            <div className="md:col-span-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-5">
                Visit us
              </h4>
              <div className="flex items-start gap-3 text-sm text-black/70 leading-relaxed">
                <MapPin size={16} className="mt-0.5 shrink-0 text-red" />
                <p>{address}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-black/50">
          <span>
            {"\u00A9 "}
            {new Date().getFullYear()} {companyName}. All rights reserved.
          </span>
          <span className="flex items-center gap-1">
            {tagline.split(".")[0]}.
            <span className="text-red">{"\u25CF"}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}