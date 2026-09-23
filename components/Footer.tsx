"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function Footer() {
  const { companyName, tagline, phones, emails, address, facebook, instagram, linkedin } =
    useSiteSettings();
  const [firstWord, ...rest] = companyName.split(" ");
  const restOfName = rest.join(" ");

  const hasSocials = facebook || instagram || linkedin;

  return (
    <footer className="bg-[#1A1A1A] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8"
        >
          <motion.div variants={fadeUp} className="md:col-span-5">
            <h3 className="text-3xl font-bold tracking-tight">
              {firstWord}
              {restOfName && <span className="block text-red">{restOfName}</span>}
            </h3>
            <p className="mt-4 text-white/60 text-sm leading-relaxed max-w-xs">
              Advanced garment manufacturing technology and solutions for
              factories across Southern Africa.
            </p>
            <motion.div whileHover={{ y: -3 }} whileTap={{ y: 0 }} className="inline-block mt-6">
              <Link
                href="/contact"
                className="inline-block px-6 py-2.5 border border-red text-white rounded-full text-sm hover:bg-red transition-colors duration-300"
              >
                Get in touch
              </Link>
            </motion.div>

            {hasSocials && (
              <div className="flex items-center gap-3 mt-6">
                {facebook && (
                  <motion.a
                    whileHover={{ y: -3 }}
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-red hover:border-red/40 transition-colors"
                  >
                    <FacebookIcon />
                  </motion.a>
                )}
                {instagram && (
                  <motion.a
                    whileHover={{ y: -3 }}
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-red hover:border-red/40 transition-colors"
                  >
                    <InstagramIcon />
                  </motion.a>
                )}
                {linkedin && (
                  <motion.a
                    whileHover={{ y: -3 }}
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-red hover:border-red/40 transition-colors"
                  >
                    <LinkedinIcon />
                  </motion.a>
                )}
              </div>
            )}
          </motion.div>

          <motion.div variants={fadeUp} className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-red mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
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
                        href={`mailto:${email}`}
                        className="block hover:text-red transition-colors"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </motion.div>

          {address && (
            <motion.div variants={fadeUp} className="md:col-span-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-red mb-5">
                Visit us
              </h4>
              <div className="flex items-start gap-3 text-sm text-white/70 leading-relaxed">
                <MapPin size={16} className="mt-0.5 shrink-0 text-red" />
                <p>{address}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
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