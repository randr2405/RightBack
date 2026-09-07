import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-100 text-black mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand block */}
          <div className="md:col-span-5">
            <h3 className="text-3xl font-bold tracking-tight">
              RightBack
              <span className="block text-red">Technology</span>
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
                →
              </span>
            </Link>
          </div>

          {/* Contact block */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-black/70">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-red" />
                <div className="space-y-1">
                  <div>+27 83 648 0733</div>
                  <div>+27 78 511 1866</div>
                  <div>+27 78 511 2043</div>
                  <div>+27 83 655 3985</div>
                </div>
              </li>
              <li className="flex items-start gap-3 pt-2">
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
              </li>
            </ul>
          </div>

          {/* Visit block */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-5">
              Visit us
            </h4>
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
          </div>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-black/50">
          <span>© {new Date().getFullYear()} RightBack Technology. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Precision machinery. Smarter production.
            <span className="text-red">●</span>
          </span>
        </div>
      </div>
    </footer>
  );
}