import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    api.get("/testimonials").then(({ data }) => setTestimonials(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (testimonials.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const goTo = (index) => setActiveIndex((index + testimonials.length) % testimonials.length);
  const visibleTestimonials = testimonials.map((_, offset) => testimonials[(activeIndex + offset) % testimonials.length]).slice(0, Math.min(3, testimonials.length));

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-xs tracking-widest text-gold mb-3">LOVED BY HOMEOWNERS</p>
        <h2 className="font-serif text-4xl mb-4">What Our Clients Say</h2>
        <p className="text-charcoal/60 max-w-2xl mx-auto">Real stories from real homeowners who transformed their spaces with NOVA LIVING.</p>
      </div>
      <div className="relative">
        <div className="grid md:grid-cols-3 gap-8">
          {visibleTestimonials.map((t, offset) => (
          <div key={`${t._id}-${offset}`} className={`${offset > 0 ? "hidden md:block" : ""} bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-black/5 animate-rise-in`}>
            <div className="text-gold text-lg mb-4">{"★".repeat(t.rating)}</div>
            <p className="text-charcoal/70 leading-relaxed mb-6 italic">"{t.message}"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-charcoal font-serif text-lg">
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-charcoal">{t.name}</div>
                <div className="text-xs text-charcoal/50">{t.location}</div>
              </div>
            </div>
          </div>
          ))}
        </div>

        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-5 mt-10">
            <button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Previous testimonial" className="w-10 h-10 rounded-full border border-black/10 text-charcoal hover:bg-charcoal hover:text-white transition-colors">←</button>
            <div className="flex items-center gap-2" aria-label="Choose testimonial">
              {testimonials.map((testimonial, index) => (
                <button type="button" key={testimonial._id} onClick={() => goTo(index)} aria-label={`Show testimonial ${index + 1}`} className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? "w-8 bg-gold" : "w-2 bg-charcoal/20"}`} />
              ))}
            </div>
            <button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Next testimonial" className="w-10 h-10 rounded-full border border-black/10 text-charcoal hover:bg-charcoal hover:text-white transition-colors">→</button>
          </div>
        )}
      </div>
    </section>
  );
}
