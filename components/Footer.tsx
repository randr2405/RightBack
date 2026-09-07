import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-100 text-black mt-auto border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-bold mb-4">
            RightBack <span className="text-red">Technology</span>
          </h3>
          <p className="text-black/60 text-sm leading-relaxed max-w-xs">
            Advanced garment manufacturing technology and solutions for
            factories across Southern Africa.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-black">Contact us</h4>
          <ul className="space-y-2 text-black/70 text-sm">
            <li>+27 83 648 0733</li>
            <li>+27 78 511 1866</li>
            <li>+27 78 511 2043</li>
            <li>+27 83 655 3985</li>
            <li className="pt-2">
              <a href="mailto:sales@rightback.co.za" className="hover:text-red transition-colors">
                sales@rightback.co.za
              </a>
            </li>
            <li>
              <a href="mailto:akesh@rightback.co.za" className="hover:text-red transition-colors">
                akesh@rightback.co.za
              </a>
            </li>
            <li>
              <a href="mailto:vivian@rightback.co.za" className="hover:text-red transition-colors">
                vivian@rightback.co.za
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-black">Visit us</h4>
          <p className="text-black/70 text-sm leading-relaxed">
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

      <div className="border-t border-black/10 py-4 text-center text-xs text-black/50">
        © {new Date().getFullYear()} RightBack Technology. All rights reserved.
      </div>
    </footer>
  );
}