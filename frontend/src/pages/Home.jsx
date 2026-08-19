import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import Testimonials from "../components/Testimonials.jsx";

function AnimatedCounter({ end, suffix = "", duration = 2000, start = 0 }) {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, start, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const heroSlides = [
  { image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1900&q=85", eyebrow: "THE NEW SEASON / 2026", title: "Spaces Designed for the Way You Live.", copy: "Discover thoughtful furniture and interiors that make everyday rituals feel a little more considered." },
  { image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1900&q=85", eyebrow: "THE ART OF HOME", title: "A Softer Way to Come Home.", copy: "Warm materials, quiet forms and enduring pieces, selected to grow with your space." },
  { image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1900&q=85", eyebrow: "MADE FOR YOUR RHYTHM", title: "Rooms With Room to Breathe.", copy: "Build a home around how you actually live with our designers and crafted collections." },
];

const categoryImages = {
  "Living Room": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=85",
  Bedroom: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=85",
  Dining: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=85",
  Decor: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=85",
};

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    api.get("/products?featured=true&limit=4").then(({ data }) => setFeatured(data.products)).catch(() => {});
    api.get("/categories").then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % heroSlides.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  const slide = heroSlides[activeSlide];
  const searchProducts = (event) => {
    event.preventDefault();
    navigate(keyword.trim() ? `/products?keyword=${encodeURIComponent(keyword.trim())}` : "/products");
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-charcoal">
        <img
          key={slide.image}
          src={slide.image}
          alt="Living room"
          className="absolute inset-0 w-full h-full object-cover animate-hero-image"
          onError={(event) => { event.currentTarget.src = "https://placehold.co/1900x1100/302821/F4F1EC?text=NOVA+LIVING"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center px-6 text-white">
          <p key={slide.eyebrow} className="text-xs tracking-widest text-gold mb-4 animate-rise-in">{slide.eyebrow}</p>
          <h1 key={slide.title} className="font-serif text-5xl md:text-7xl leading-tight max-w-2xl mb-6 animate-rise-in">{slide.title}</h1>
          <p key={slide.copy} className="max-w-lg text-white/80 mb-10 text-lg leading-relaxed animate-rise-in">{slide.copy}</p>
          <div className="flex gap-4">
            <Link to="/products" className="bg-gold text-charcoal px-8 py-4 rounded-full text-sm font-medium hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl">
              Explore Collection →
            </Link>
            <Link to="/contact" className="border-2 border-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white hover:text-charcoal transition-all duration-300">
              Book a Consultation
            </Link>
          </div>
        </div>
          <div className="absolute bottom-10 left-6 right-6 max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex gap-2" aria-label="Choose hero slide">
              {heroSlides.map((item, index) => (
                <button key={item.eyebrow} aria-label={`Show slide ${index + 1}`} onClick={() => setActiveSlide(index)} className={`h-1.5 transition-all duration-300 ${index === activeSlide ? "w-12 bg-gold" : "w-5 bg-white/50"}`} />
              ))}
            </div>
            <span className="text-xs tracking-widest text-white/60">0{activeSlide + 1} / 0{heroSlides.length}</span>
          </div>
      </section>

      <section className="relative z-10 -mt-8 px-6">
        <form onSubmit={searchProducts} className="max-w-3xl mx-auto bg-white p-2 rounded-full shadow-xl flex items-center gap-2 border border-black/5">
          <span className="pl-4 text-xl text-gold" aria-hidden="true">⌕</span>
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Search your next favourite piece..." className="min-w-0 flex-1 px-2 py-3 outline-none text-sm bg-transparent" aria-label="Search products" />
          <button className="bg-charcoal text-white px-6 py-3 rounded-full text-sm hover:bg-gold hover:text-charcoal transition-colors">Search</button>
        </form>
      </section>

      {/* Stats */}
      <section className="bg-cream px-6 py-14 border-y border-black/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          {[
            { num: 10, suffix: "+", label: "Years of Craftsmanship", icon: "🏆" },
            { num: 2500, suffix: "+", label: "Happy Clients", icon: "👥" },
            { num: 150, suffix: "+", label: "Completed Projects", icon: "🏠" },
            { num: 25, suffix: "+", label: "Expert Designers", icon: "✨" },
          ].map((stat) => (
            <div key={stat.label} className="group border-black/10 px-3 py-3 md:border-l md:first:border-l-0">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-4xl filter drop-shadow-sm" style={{ color: "#C9A15A" }}>{stat.icon}</span>
                <p className="font-serif text-4xl text-gold group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter end={stat.num} suffix={stat.suffix} duration={2000} />
                </p>
              </div>
              <p className="text-sm text-charcoal/60 tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Images */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-black/10">
              <img
                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=800"
                alt="Dining Room"
                className="w-full h-[500px] object-cover"
                loading="lazy"
                onError={(event) => { event.currentTarget.src = "https://placehold.co/800x1000/eee9df/1C1A17?text=Nova+Living"; }}
              />
            </div>
            <div className="absolute -bottom-8 -right-4 w-56 h-44 rounded-xl overflow-hidden shadow-lg border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600"
                alt="Armchair"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(event) => { event.currentTarget.src = "https://placehold.co/600x450/eee9df/1C1A17?text=Nova+Living"; }}
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="md:pl-8">
            <p className="text-xs tracking-widest text-gold mb-4">ABOUT NOVA LIVING</p>
            <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight text-charcoal">We Create More Than Interiors.</h2>
            <p className="text-charcoal/70 leading-relaxed mb-8 text-base">
              At NOVA LIVING, we believe a beautiful space is more than furniture and finishes. It is a reflection of personality, comfort, and the way you choose to live.
            </p>
            <Link to="/about" className="inline-block text-gold font-medium text-sm tracking-wide hover:underline mb-10">
              Discover Our Story →
            </Link>

            {/* Features */}
            <div className="grid sm:grid-cols-3 md:grid-cols-1 gap-3">
              {[
                { icon: "🎨", title: "Personalized Design" },
                { icon: "💎", title: "Quality Materials" },
                { icon: "🔧", title: "End-to-End Execution" },
              ].map((feature) => (
                <div key={feature.title} className="flex items-center gap-3 rounded-xl border border-black/10 bg-cream px-4 py-3 hover:border-gold transition-colors">
                  <span className="text-xl" style={{ color: "#C9A15A" }}>{feature.icon}</span>
                  <span className="text-charcoal text-sm font-medium">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-cream px-6 py-20">
        <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
          <div>
          <p className="text-xs tracking-widest text-gold mb-3">BROWSE BY CATEGORY</p>
          <h2 className="font-serif text-4xl">Explore the Collection</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["Sofas", "Beds", "Lighting", "Decor"].map((style) => (
              <button key={style} type="button" onClick={() => navigate(`/products?keyword=${style.toLowerCase()}`)} className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs text-charcoal hover:border-gold hover:text-gold transition-colors">
                {style}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(categories.length ? categories : [
            { name: "Living Room", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80" },
            { name: "Bedroom", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80" },
            { name: "Dining", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80" },
            { name: "Decor", image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80" }
          ]).map((c) => ({ ...c, image: c.image || categoryImages[c.name] || categoryImages.Decor })).map((c) => (
            <Link
              key={c._id || c.name}
              to={c._id ? `/products?category=${c._id}` : `/products?keyword=${encodeURIComponent(c.name)}`}
              className="relative rounded-xl overflow-hidden h-72 group border border-black/10 shadow-sm"
            >
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.target.src = `https://placehold.co/400x400/1C1A17/C9A15A?text=${encodeURIComponent(c.name)}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-white font-serif text-xl mb-2">{c.name}</div>
                <div className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View Collection →
                </div>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-5 mb-8">
          <div>
          <p className="text-xs tracking-widest text-gold mb-3">OUR SERVICES</p>
          <h2 className="font-serif text-4xl">From Vision to Reality.</h2>
          </div>
          <Link to="/contact" className="hidden sm:inline-flex text-xs font-medium text-charcoal hover:text-gold transition-colors">Talk to a designer →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { num: "01", title: "Interior Design", desc: "Transform your spaces with our expert interior design services tailored to your lifestyle.", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80" },
            { num: "02", title: "Modular Kitchens", desc: "Custom modular kitchens that blend functionality with aesthetics for modern living.", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80" },
            { num: "03", title: "Custom Furniture", desc: "Bespoke furniture crafted to your specifications using premium materials.", image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80" },
          ].map((service) => (
            <Link to={`/contact?service=${encodeURIComponent(service.title)}`} key={service.title} className="relative h-80 rounded-xl overflow-hidden group border border-black/10 shadow-sm">
              <img 
                src={service.image} 
                alt={service.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                onError={(event) => { event.currentTarget.src = "https://placehold.co/700x700/302821/F4F1EC?text=Nova+Living"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-gold text-4xl font-serif mb-2">{service.num}</div>
                <h3 className="font-serif text-xl text-white mb-2">{service.title}</h3>
                <div className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explore Service →
                </div>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs tracking-widest text-gold mb-2">FEATURED PROJECTS</p>
              <h2 className="font-serif text-4xl md:text-5xl">Spaces We've Transformed.</h2>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-charcoal hover:text-gold transition-colors">
              View All Projects <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {featured.map((p) => (
              <Link key={p._id} to={`/products/${p._id}`} className="group overflow-hidden rounded-xl bg-white border border-black/10 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[1.45] overflow-hidden bg-cream">
                  <img
                    src={p.images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85"}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(event) => { event.currentTarget.src = "https://placehold.co/900x620/eee9df/1C1A17?text=Nova+Living"; }}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-4">
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg truncate group-hover:text-gold transition-colors">{p.name}</h3>
                    <p className="text-xs text-charcoal/55 mt-1 truncate">{p.material || "Signature piece"} <span className="px-1">•</span> {p.category?.name || "NOVA collection"}</p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 text-lg group-hover:bg-charcoal group-hover:text-white transition-colors" aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/products" className="mt-6 inline-flex sm:hidden items-center gap-2 text-xs font-medium text-charcoal hover:text-gold transition-colors">
            View All Projects <span aria-hidden="true">→</span>
          </Link>
        </section>
      )}

      <Testimonials />

      {/* Why choose us */}
      <section className="border-y border-black/5 bg-white px-6 py-12 md:py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-widest text-charcoal font-medium mb-8">WHY CHOOSE NOVA LIVING?</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "◈", title: "Crafted with Precision", desc: "Premium materials and meticulous craftsmanship." },
              { icon: "♧", title: "Designed Around You", desc: "Every space is tailored to your lifestyle." },
              { icon: "✧", title: "Timeless by Design", desc: "We create interiors that remain beautiful beyond trends." },
              { icon: "♙", title: "End-to-End Experience", desc: "From concept to installation, we manage everything." },
            ].map((benefit, index) => (
              <div key={benefit.title} className={`flex items-start gap-4 py-4 lg:px-7 lg:py-0 ${index > 0 ? "lg:border-l lg:border-black/10" : ""} animate-rise-in`}>
                <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center text-4xl font-serif text-gold" aria-hidden="true">{benefit.icon}</span>
                <div>
                  <h3 className="font-serif text-lg leading-tight mb-2">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-charcoal/60 max-w-[190px]">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-12 relative">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
              Let's Create a Space You'll Love Coming Home To.
            </h2>
            <p className="text-white/70 mt-4 max-w-md text-base leading-relaxed">
              Tell us about your space, your style, and your vision. Our design team will help bring it to life with bespoke solutions tailored just for you.
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/contact" className="bg-gold text-charcoal px-8 py-4 rounded-full text-sm font-medium hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl">
              Book a Consultation →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
