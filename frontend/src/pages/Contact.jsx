import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const service = searchParams.get("service");
  const initialProject = service === "Modular Kitchens" ? "Modular kitchen" : service === "Custom Furniture" ? "Custom furniture" : "Interior design";
  const [form, setForm] = useState({ name: "", email: "", phone: "", project: initialProject, budget: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 700);
  };

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  return (
    <div className="bg-cream px-6 pt-36 pb-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
        <div>
          <p className="text-xs tracking-[0.25em] text-gold mb-5">LET&apos;S TALK</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-6">Let&apos;s make room for what matters.</h1>
          <p className="text-charcoal/70 leading-relaxed max-w-md mb-10">Tell us about your space, your style and your vision. Our design team will get back to you within one working day.</p>
          <div className="space-y-5 text-sm">
            <div className="flex gap-4"><span className="text-gold text-lg">✦</span><div><p className="font-medium">Visit our studio</p><p className="text-charcoal/60 mt-1">21 Design District, Mumbai</p></div></div>
            <div className="flex gap-4"><span className="text-gold text-lg">✉</span><div><p className="font-medium">Write to us</p><a href="mailto:hello@novaliving.in" className="text-charcoal/60 mt-1 inline-block hover:text-gold">hello@novaliving.in</a></div></div>
            <div className="flex gap-4"><span className="text-gold text-lg">◷</span><div><p className="font-medium">Studio hours</p><p className="text-charcoal/60 mt-1">Mon - Sat, 10:00 - 18:00</p></div></div>
          </div>
          <div className="mt-12 overflow-hidden rounded-xl border border-black/10 shadow-lg aspect-[4/3]">
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85" alt="Nova Living studio interior" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.src = "https://placehold.co/900x675/302821/F4F1EC?text=Nova+Living"; }} />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 md:p-10 border border-black/10 shadow-sm">
          {sent ? (
            <div className="min-h-[480px] flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-3xl text-gold mb-6">✓</div>
              <p className="text-xs tracking-[0.25em] text-gold mb-4">MESSAGE RECEIVED</p>
              <h2 className="font-serif text-4xl mb-4">Thank you, {form.name.split(" ")[0]}.</h2>
              <p className="text-charcoal/65 max-w-sm leading-relaxed mb-8">We&apos;ll be in touch shortly to learn more about your space and find the right next step.</p>
              <button type="button" onClick={() => setSent(false)} className="rounded-full border border-black/15 px-6 py-3 text-sm hover:border-gold hover:text-gold transition-colors">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="mb-8"><p className="text-xs tracking-[0.25em] text-gold mb-3">YOUR PROJECT</p><h2 className="font-serif text-3xl">Start with a few details.</h2></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="text-sm">Your name<input name="name" placeholder="Full name" required value={form.name} onChange={updateField} className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 outline-none focus:border-gold" /></label>
                <label className="text-sm">Email address<input name="email" type="email" placeholder="you@example.com" required value={form.email} onChange={updateField} className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 outline-none focus:border-gold" /></label>
                <label className="text-sm">Phone number<input name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={updateField} className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 outline-none focus:border-gold" /></label>
                <label className="text-sm">Project type<select name="project" value={form.project} onChange={updateField} className="mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 outline-none focus:border-gold"><option>Interior design</option><option>Modular kitchen</option><option>Custom furniture</option><option>Renovation</option></select></label>
                <label className="text-sm sm:col-span-2">Estimated budget<select name="budget" value={form.budget} onChange={updateField} className="mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 outline-none focus:border-gold"><option value="">Select a range</option><option>Under ₹5 lakh</option><option>₹5 - 15 lakh</option><option>₹15 - 30 lakh</option><option>₹30 lakh+</option></select></label>
              </div>
              <label className="block text-sm">Tell us about your space<textarea name="message" placeholder="What are you imagining?" rows={5} required value={form.message} onChange={updateField} className="mt-2 w-full resize-none rounded-lg border border-black/10 px-4 py-3 outline-none focus:border-gold" /></label>
              <button disabled={submitting} className="w-full rounded-full bg-charcoal py-3.5 text-sm font-medium text-white hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50">{submitting ? "Sending..." : "Send enquiry →"}</button>
              <p className="text-center text-xs text-charcoal/45">Your details are only used to respond to your enquiry.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
