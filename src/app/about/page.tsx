import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      {/* About Hero */}
      <section className="about-hero" style={{ padding: '8rem 1.5rem 4rem', background: 'linear-gradient(135deg, rgba(10,10,10,0.95), rgba(74,103,65,0.85))', color: 'var(--cream)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Our Story — Aura Foods Organic Spices</h1>
        <p style={{ opacity: .7, marginTop: '.75rem', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          From the sun-drenched fields of Sindh to your kitchen — Aura Foods is on a mission to bring back the authentic taste of Pakistani spices.
        </p>
      </section>

      <div className="about-content" style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* About Grid */}
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="about-text">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '1rem' }}>
              Rooted in Sindh, <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Trusted Everywhere</em>
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
              Aura Foods was born in the spice heartland of Pakistan — Kunri, Sindh. For generations, our families have grown, harvested, and traded spices using methods passed down through centuries.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
              We work directly with small family farms, ensuring fair prices and premium quality. Every batch is traceable back to its origin. Every jar contains spices that are sun-dried, hand-sorted, and stone-ground to preserve the natural oils and aroma.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8 }}>No shortcuts. No additives. Just pure, honest spice that tastes like home.</p>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '3rem', textAlign: 'center' }}>
              <div><div className="stat-number" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: 'var(--gold)', fontWeight: 700 }}>8+</div><div className="stat-label" style={{ fontSize: '.8125rem', color: 'var(--muted)', marginTop: '.25rem' }}>Premium Products</div></div>
              <div><div className="stat-number" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: 'var(--gold)', fontWeight: 700 }}>50+</div><div className="stat-label" style={{ fontSize: '.8125rem', color: 'var(--muted)', marginTop: '.25rem' }}>Partner Farms</div></div>
              <div><div className="stat-number" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: 'var(--gold)', fontWeight: 700 }}>100%</div><div className="stat-label" style={{ fontSize: '.8125rem', color: 'var(--muted)', marginTop: '.25rem' }}>Organic Promise</div></div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '1rem', overflow: 'hidden', aspectRatio: '4/5' }}>
              <img src="/images/products/story-en.jpg" alt="Traditional spice grinding in Sindh, Pakistan — Aura Foods heritage" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="section-header" style={{ textAlign: 'center', maxWidth: 560, margin: '5rem auto 3.5rem' }}>
          <div className="section-eyebrow" style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.3em', color: 'var(--gold)' }}>Our Values</div>
          <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1, marginTop: '.75rem' }}>What We Stand For</h2>
        </div>

        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { title: 'Pure Quality', desc: 'We source directly from the finest growing regions. Every batch is tested for purity, ensuring you receive only the best.', svg: '<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>' },
            { title: 'Authentic Origin', desc: 'Our red chili comes from Kunri, Sindh — the chili capital of Pakistan. This region produces some of the most flavorful chilies in the world.', svg: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>' },
            { title: 'Traditional Methods', desc: 'We combine traditional sun-drying and stone-grinding techniques with modern hygiene standards to preserve natural aroma and flavor.', svg: '<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>' },
          ].map((item) => (
            <div key={item.title} className="why-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '1.5rem', textAlign: 'center', transition: 'all .3s' }}>
              <div className="why-icon" style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), #d4b85a)', display: 'grid', placeItems: 'center', margin: '0 auto 1rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" style={{ color: 'var(--ink)' }}>
                  <path d={item.svg.replace(/<path d="/, '').replace(/\/>.*/, '')} />
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem' }}>{item.title}</h3>
              <p style={{ fontSize: '.8125rem', color: 'var(--muted)', marginTop: '.35rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="section" style={{ padding: '5rem 1.5rem', textAlign: 'center', maxWidth: 'none', background: 'rgba(10,10,10,0.03)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>Experience the Aura Foods Difference</h2>
          <p className="section-subtitle" style={{ color: 'var(--muted)', marginTop: '1rem', fontSize: '.9375rem' }}>Discover our full range of premium spices and bring authentic flavor to your kitchen.</p>
          <Link href="/products" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
            Browse Products
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
