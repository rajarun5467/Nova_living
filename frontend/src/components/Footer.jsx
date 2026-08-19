import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#F7F4EF] border-t border-black/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12">
        <div className="col-span-2">
          <h3 className="font-serif text-2xl mb-3 text-charcoal">NOVA LIVING</h3>
          <p className="text-sm text-charcoal/60 mb-5 tracking-wide">Designing Spaces. Defining Living.</p>
          <p className="text-sm text-charcoal/70 max-w-sm leading-relaxed">
            We create beautiful, functional and timeless spaces that reflect who you are and how you live. Every piece tells a story of craftsmanship and elegance.
          </p>
          <div className="flex gap-4 mt-6">
            {['instagram', 'facebook', 'pinterest'].map((social) => (
              <a key={social} href="#" className="w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-white transition-all duration-300">
                <span className="text-xs capitalize">{social[0].toUpperCase()}</span>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs tracking-widest text-charcoal/50 mb-4 font-medium">COMPANY</h4>
          <ul className="space-y-3 text-sm text-charcoal/70">
            <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            <li><Link to="/about" className="hover:text-gold transition-colors">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            <li><Link to="/products" className="hover:text-gold transition-colors">Careers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-widest text-charcoal/50 mb-4 font-medium">SHOP</h4>
          <ul className="space-y-3 text-sm text-charcoal/70">
            <li><Link to="/products" className="hover:text-gold transition-colors">Sofas</Link></li>
            <li><Link to="/products" className="hover:text-gold transition-colors">Beds</Link></li>
            <li><Link to="/products" className="hover:text-gold transition-colors">Tables</Link></li>
            <li><Link to="/products" className="hover:text-gold transition-colors">Decor</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-widest text-charcoal/50 mb-4 font-medium">CONTACT</h4>
          <ul className="space-y-3 text-sm text-charcoal/70">
            <li className="flex items-center gap-2">
              <span className="text-gold">✓</span>
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gold">✓</span>
              <span>hello@novaliving.in</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">✓</span>
              <span>New Delhi, India</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-black/5 mt-12 pt-8 text-xs text-charcoal/40 flex flex-col md:flex-row justify-between items-center gap-4">
        <span>© 2026 NOVA LIVING. All Rights Reserved.</span>
        <div className="flex gap-6">
          <Link to="#" className="hover:text-charcoal/60 transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-charcoal/60 transition-colors">Terms & Conditions</Link>
          <Link to="/login" className="hover:text-gold transition-colors">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
