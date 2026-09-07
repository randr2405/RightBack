import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-bold mb-4">
            RightBack <span className="text-red">Technology</span>
          </h3>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact us</h4>
          <ul className="space-y-2 text-white/80 text-sm">
            <li>+27 83 648 0733</li>
            <li>+27 78 511 1866</li>
            <li>+27 78 511 2043</li>
            <li>+27 83 655 3985</li>
            <li className="pt-2">
              <a href="mailto:sales@rightback.co.za" className="hover:text-red">
                sales@rightback.co.za
              </a>
            </li>
            <li>
              <a href="mailto:akesh@rightback.co.za" className="hover:text-red">
                akesh@rightback.co.za
              </a>
            </li>
            <li>
              <a href="mailto:vivian@rightback.co.za" className="hover:text-red">
                vivian@rightback.co.za
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Visit us</h4>
          <p className="text-white/80 text-sm leading-relaxed">
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

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} RightBack Technology. All rights reserved.
      </div>
    </footer>
  );
}