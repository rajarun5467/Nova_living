import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-cream">
      <section className="px-6 pt-36 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div>
            <p className="text-xs tracking-[0.25em] text-gold mb-5">ABOUT NOVA LIVING / EST. 2018</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] text-charcoal mb-7">We create more than interiors.</h1>
            <p className="max-w-xl text-charcoal/70 text-lg leading-relaxed mb-9">
              We design homes that feel like you. Thoughtful planning, honest materials and a deep respect for everyday rituals sit at the heart of everything we make.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="rounded-full bg-charcoal px-7 py-3.5 text-sm font-medium text-white hover:bg-gold hover:text-charcoal transition-colors">Start a conversation →</Link>
              <Link to="/products" className="rounded-full border border-charcoal/20 px-7 py-3.5 text-sm font-medium text-charcoal hover:border-gold hover:text-gold transition-colors">See our collection</Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-xl border border-black/10 shadow-xl">
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85" alt="Warm contemporary living room designed by Nova Living" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.src = "https://placehold.co/900x1100/302821/F4F1EC?text=Nova+Living"; }} />
            </div>
            <div className="absolute -bottom-6 -left-5 rounded-xl bg-white px-6 py-5 shadow-lg border border-black/5">
              <p className="font-serif text-3xl text-gold">150+</p>
              <p className="text-xs text-charcoal/60 mt-1">spaces brought to life</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-black/5 px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            { number: "01", title: "Designed around you", desc: "Your routines, personality and point of view guide every decision." },
            { number: "02", title: "Made to last", desc: "We choose enduring materials and partner with skilled makers." },
            { number: "03", title: "Handled end to end", desc: "One thoughtful team from first sketch to final installation." },
          ].map((value) => (
            <article key={value.number} className="rounded-xl bg-cream p-7 border border-black/5 hover:-translate-y-1 transition-transform duration-300">
              <p className="text-gold font-serif text-3xl mb-5">{value.number}</p>
              <h2 className="font-serif text-2xl mb-3">{value.title}</h2>
              <p className="text-sm leading-relaxed text-charcoal/65">{value.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden rounded-xl border border-black/10 shadow-lg aspect-[4/3]">
            <img src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1100&q=85" alt="Nova Living dining space" className="h-full w-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.src = "https://placehold.co/1000x750/eee9df/1C1A17?text=Nova+Living"; }} />
          </div>
          <div>
            <p className="text-xs tracking-[0.25em] text-gold mb-4">OUR APPROACH</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">Beautiful is a feeling, not a finish.</h2>
            <p className="text-charcoal/70 leading-relaxed mb-5">From a calm morning corner to a table that holds every celebration, we look for the details that make a room feel lived in and loved.</p>
            <p className="text-charcoal/70 leading-relaxed">That is why our work balances clarity with character: clean forms, tactile layers and choices that will still feel right years from now.</p>
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-6 py-20 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="text-xs tracking-[0.25em] text-gold mb-4">READY WHEN YOU ARE</p>
            <h2 className="font-serif text-4xl md:text-5xl">Let&apos;s shape your next space.</h2>
          </div>
          <Link to="/contact" className="shrink-0 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-charcoal hover:bg-white transition-colors">Book a consultation →</Link>
        </div>
      </section>
    </div>
  );
}
