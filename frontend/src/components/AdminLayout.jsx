import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { label: "Overview", to: "/admin", icon: "📊" },
  { label: "Products", to: "/admin/products", icon: "🛋️" },
  { label: "Orders", to: "/admin/orders", icon: "📦" },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal lg:flex">
      <aside className="w-full bg-charcoal text-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0">
        <div className="flex items-center justify-between px-6 py-5 lg:block lg:px-7 lg:py-8">
          <Link to="/admin" className="block">
            <span className="block font-serif text-2xl tracking-wide">NOVA LIVING</span>
            <span className="mt-1 block text-[10px] tracking-[0.22em] text-gold">ADMIN STUDIO</span>
          </Link>
          <span className="hidden rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-wider text-white/55 lg:inline-block lg:mt-12">Workspace</span>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:mt-10 lg:block lg:px-4" aria-label="Admin navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/admin"} className={({ isActive }) => `flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-3 text-sm transition-colors lg:mb-2 ${isActive ? "bg-gold text-charcoal" : "text-white/65 hover:bg-white/10 hover:text-white"}`}>
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden absolute bottom-0 w-72 border-t border-white/10 p-6 lg:block">
          <p className="text-xs text-white/45">Signed in as</p>
          <p className="mt-1 truncate text-sm text-white">{user?.name || "Administrator"}</p>
          <button type="button" onClick={signOut} className="mt-4 text-xs text-gold hover:text-white transition-colors">Sign out →</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-4 lg:px-10">
          <p className="text-xs tracking-[0.2em] text-charcoal/45">CONTROL CENTER</p>
          <Link to="/" className="text-xs text-charcoal/60 hover:text-gold transition-colors">View storefront ↗</Link>
        </div>
        {children}
      </main>
    </div>
  );
}
