"use client";

import { useState, FormEvent } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!form.name || !form.message) {
      setStatus({ type: "error", message: "Name and message are required." });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus({
        type: "success",
        message: data.message || "Thank you for your message!",
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page" style={{ padding: '8rem 1.5rem 3rem', maxWidth: 1280, margin: '0 auto' }}>
      <div className="section-header" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 2rem' }}>
        <div className="section-eyebrow" style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.3em', color: 'var(--gold)' }}>Get in Touch</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', marginTop: '.75rem' }}>We&apos;d Love to Hear From You</h1>
        <p style={{ color: 'var(--muted)', marginTop: '.75rem' }}>Questions, wholesale inquiries, or just want to say hello — drop us a message.</p>
      </div>

      {status && (
        <div style={{ maxWidth: 640, margin: '0 auto 2rem', padding: '1rem 1.5rem', borderRadius: '.75rem', textAlign: 'center', fontWeight: 500, background: status.type === 'success' ? '#d4edda' : '#f8d7da', color: status.type === 'success' ? '#155724' : '#721c24' }}>
          {status.message}
        </div>
      )}

      <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '2rem' }}>
        <div className="contact-info">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem' }}>Reach Out</h2>
          <p style={{ color: 'var(--muted)', marginTop: '.75rem', lineHeight: 1.7 }}>
            We typically respond within 24 hours. For urgent orders, please reach out via WhatsApp.
          </p>
          <div className="contact-details" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { icon: 'Tel', label: 'Phone', value: '+92 335 2832967' },
              { icon: 'Mail', label: 'Email', value: 'aurafoodsonline@gmail.com' },
              { icon: 'Map', label: 'Address', value: 'Karachi, Lahore' },
              { icon: 'Chat', label: 'WhatsApp', value: <a href="https://wa.me/923352832967" target="_blank" rel="noopener" style={{ color: 'var(--olive)', fontWeight: 600, textDecoration: 'none' }}>Chat on WhatsApp</a> },
            ].map((item) => (
              <div key={item.label} className="contact-detail" style={{ display: 'flex', gap: '1rem' }}>
                <div className="contact-detail-icon" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(212,175,55,0.1)', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: '.7rem', fontWeight: 600, color: 'var(--gold)' }}>
                  {item.icon}
                </div>
                <div>
                  <div className="contact-detail-label" style={{ fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted)' }}>{item.label}</div>
                  <div className="contact-detail-value" style={{ fontWeight: 600, marginTop: '.1rem' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="footer-social" style={{ marginTop: '2rem', display: 'flex', gap: '.5rem' }}>
            <a href="https://wa.me/923352832967" target="_blank" rel="noopener" aria-label="WhatsApp" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(10,10,10,0.2)', color: 'var(--ink)', textDecoration: 'none', fontSize: '.7rem', fontWeight: 600 }}>WA</a>
            <a href="https://www.instagram.com/aurafoodsonline?igsh=OWxkODFrcTdxYzUy" target="_blank" rel="noopener" aria-label="Instagram" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(10,10,10,0.2)', color: 'var(--ink)', textDecoration: 'none', fontSize: '.7rem', fontWeight: 600 }}>IG</a>
            <a href="https://www.facebook.com/share/1Ctuc2U2rj/" target="_blank" rel="noopener" aria-label="Facebook" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(10,10,10,0.2)', color: 'var(--ink)', textDecoration: 'none', fontSize: '.7rem', fontWeight: 600 }}>FB</a>
            <a href="https://www.daraz.pk/shop/d-mall-23/" target="_blank" rel="noopener" aria-label="Daraz Shop" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(10,10,10,0.2)', color: 'var(--ink)', textDecoration: 'none', fontSize: '.7rem', fontWeight: 600 }}>DZ</a>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} style={{ background: 'var(--card)', padding: '2rem', borderRadius: 8, border: '1px solid var(--border)' }}>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '.35rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--muted)' }}>Full Name <span style={{ color: '#c0392b' }}>*</span></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={200} placeholder="Your name" style={{ padding: '.75rem 1rem', borderRadius: '.75rem', border: '1px solid var(--border)', fontSize: '.9375rem', fontFamily: 'inherit', background: 'var(--card)' }} />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '.35rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--muted)' }}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={254} placeholder="your@email.com" style={{ padding: '.75rem 1rem', borderRadius: '.75rem', border: '1px solid var(--border)', fontSize: '.9375rem', fontFamily: 'inherit', background: 'var(--card)' }} />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '.35rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--muted)' }}>Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={50} placeholder="+92 335 2832967" style={{ padding: '.75rem 1rem', borderRadius: '.75rem', border: '1px solid var(--border)', fontSize: '.9375rem', fontFamily: 'inherit', background: 'var(--card)' }} />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '.35rem', marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--muted)' }}>Message <span style={{ color: '#c0392b' }}>*</span></label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} required minLength={10} maxLength={2000} placeholder="How can we help you?" style={{ padding: '.75rem 1rem', borderRadius: '.75rem', border: '1px solid var(--border)', fontSize: '.9375rem', fontFamily: 'inherit', background: 'var(--card)', resize: 'vertical' }} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
