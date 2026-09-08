"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
} as const;

const fieldVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
} as const;

export default function ContactPage() {
  return (
    <div className="bg-neutral-100 flex-1 relative overflow-hidden">
      {/* Decorative background blobs */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-red/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-96 -left-32 w-80 h-80 rounded-full bg-black/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Header */}
      <section className="relative text-center px-6 pt-28 pb-16">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block text-red text-sm font-semibold uppercase tracking-widest mb-4"
        >
          Let&apos;s talk
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-4xl sm:text-6xl font-bold text-black"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 max-w-2xl mx-auto text-black/70 text-lg"
        >
          Have a question about our machinery or solutions? Send us a message
          and our team will get back to you.
        </motion.p>
      </section>

      {/* Form + Details */}
      <section className="relative px-6 pb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
          <motion.form
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="md:col-span-3 bg-white rounded-2xl shadow-lg shadow-black/5 border border-black/5 p-8 sm:p-10"
            whileHover={{ boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)" }}
          >
            <motion.div variants={fieldVariant} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-lg border border-black/10 bg-neutral-100 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-red/50 focus:scale-[1.01] transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-black mb-2">
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="Your company"
                  className="w-full rounded-lg border border-black/10 bg-neutral-100 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-red/50 focus:scale-[1.01] transition-all duration-200"
                />
              </div>
            </motion.div>

            <motion.div variants={fieldVariant} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-black/10 bg-neutral-100 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-red/50 focus:scale-[1.01] transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+27 ..."
                  className="w-full rounded-lg border border-black/10 bg-neutral-100 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-red/50 focus:scale-[1.01] transition-all duration-200"
                />
              </div>
            </motion.div>

            <motion.div variants={fieldVariant} className="mt-6">
              <label htmlFor="interest" className="block text-sm font-medium text-black mb-2">
                I&apos;m interested in
              </label>
              <select
                id="interest"
                className="w-full rounded-lg border border-black/10 bg-neutral-100 px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red/50 transition-all duration-200"
              >
                <option>Sewing</option>
                <option>Vibemac</option>
                <option>Maica</option>
                <option>Cutting</option>
                <option>Print</option>
                <option>Laundry</option>
                <option>CAD Pattern Design</option>
                <option>Laser Machines</option>
                <option>General Enquiry</option>
              </select>
            </motion.div>

            <motion.div variants={fieldVariant} className="mt-6">
              <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell us about your requirements..."
                className="w-full rounded-lg border border-black/10 bg-neutral-100 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-red/50 focus:scale-[1.01] transition-all duration-200 resize-none"
              />
            </motion.div>

            <motion.div variants={fieldVariant}>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(214,40,40,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 w-full sm:w-auto px-10 py-3.5 bg-red text-white text-sm font-medium rounded-full hover:bg-black transition-colors duration-300"
              >
                Send Message
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Contact details */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="md:col-span-2 flex flex-col gap-6"
          >
            <motion.div
              variants={fieldVariant}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-black/5 p-8 transition-shadow duration-300"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-5">
                Contact
              </h3>
              <div className="flex items-start gap-3 text-sm text-black/70 mb-6">
                <Phone size={16} className="mt-0.5 shrink-0 text-red" />
                <div className="space-y-1">
                  <div>+27 83 648 0733</div>
                  <div>+27 78 511 1866</div>
                  <div>+27 78 511 2043</div>
                  <div>+27 83 655 3985</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-black/70">
                <Mail size={16} className="mt-0.5 shrink-0 text-red" />
                <div className="space-y-1">
                  <a href="mailto:sales@rightback.co.za" className="block hover:text-red transition-colors">
                    sales@rightback.co.za
                  </a>
                  <a href="mailto:akesh@rightback.co.za" className="block hover:text-red transition-colors">
                    akesh@rightback.co.za
                  </a>
                  <a href="mailto:vivian@rightback.co.za" className="block hover:text-red transition-colors">
                    vivian@rightback.co.za
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fieldVariant}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-black/5 p-8 transition-shadow duration-300"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-5">
                Visit us
              </h3>
              <div className="flex items-start gap-3 text-sm text-black/70 leading-relaxed">
                <MapPin size={16} className="mt-0.5 shrink-0 text-red" />
                <p>
                  15 Sucrose Crescent,
                  <br />
                  B 12A Old Mill Business Park
                  <br />
                  Mount Edgecombe, Durban,
                  <br />
                  South Africa
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fieldVariant}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-black rounded-2xl p-8 text-white relative overflow-hidden"
            >
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-red/20 blur-2xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative flex items-center gap-2 mb-2">
                <Zap size={18} className="text-red" />
                <h3 className="text-lg font-semibold">Quick response</h3>
              </div>
              <p className="relative text-white/70 text-sm">
                We typically respond to enquiries within one business day.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}