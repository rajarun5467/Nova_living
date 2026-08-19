import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b border-black/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="leading-tight group">
          <span className="block font-serif text-2xl tracking-wide text-charcoal group-hover:text-gold transition-colors">NOVA LIVING</span>
          <span className="block text-[10px] tracking-widest text-charcoal/60 mt-1">
            DESIGNING SPACES. DEFINING LIVING.
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm tracking-wide text-charcoal">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-gold transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-gold after:transition-all hover:after:w-full">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative text-charcoal hover:text-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-gold text-charcoal text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="text-sm font-medium text-charcoal hover:text-gold transition-colors">{user.name.split(" ")[0]} ▾</button>
              <div className="absolute right-0 top-6 hidden group-hover:block bg-white text-charcoal rounded-lg shadow-xl w-48 py-2 text-sm border border-black/5">
                <Link to="/orders" className="block px-4 py-2 hover:bg-cream transition-colors">My Orders</Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="block px-4 py-2 hover:bg-cream transition-colors">Admin Panel</Link>
                )}
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="w-full text-left px-4 py-2 hover:bg-cream transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium text-charcoal hover:text-gold transition-colors">Login</Link>
          )}

          <Link
            to="/contact"
            className="hidden sm:inline-block bg-gold text-charcoal text-sm font-medium px-6 py-2.5 rounded-full hover:bg-charcoal hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get a Quote
          </Link>

          <button className="md:hidden text-2xl text-charcoal" onClick={() => setOpen(!open)}>☰</button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-black/5 px-6 py-4 space-y-4">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="block text-sm font-medium py-2 text-charcoal" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
