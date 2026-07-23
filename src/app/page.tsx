import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const [bestSellers, categories, bundles] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.bundle.findMany({
      where: { isActive: true },
      include: { _count: { select: { items: true } } },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const testimonials = [
    { name: 'Ayesha K.', city: 'Karachi', text: 'The Kunri chili is unreal — the colour, the aroma, exactly what my mother used to buy from the village.', initials: 'AK' },
    { name: 'Bilal R.', city: 'Lahore', text: 'Switched my whole pantry to Aura. The garam masala makes a difference you can smell from the next room.', initials: 'BR' },
    { name: 'Sana M.', city: 'Islamabad', text: 'Beautifully packed, super fresh, and delivered in two days. The biryani masala is restaurant-grade.', initials: 'SM' },
    { name: 'Tariq A.', city: 'Rawalpindi', text: 'Ordered the BBQ bundle for a family gathering. Everyone asked where I got the spices!', initials: 'TA' },
    { name: 'Fatima Z.', city: 'Faisalabad', text: 'Finally, organic spices I can trust. My children\'s food is now completely preservative-free.', initials: 'FZ' },
  ];

  const whyItems = [
    { title: '100% Organic', desc: 'Sourced from trusted Pakistani farms, free from synthetic chemicals.', svg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
    { title: 'No Preservatives', desc: 'Nothing artificial added — ever. Just pure, unadulterated spice.', svg: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
    { title: 'No Artificial Colors', desc: 'Every hue comes from the spice itself, never from chemicals.', svg: '<path d="M3 3h18v18H3V3z"/>' },
    { title: 'Hygienically Sealed', desc: 'Sealed in food-grade facilities under rigorous quality control.', svg: '<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>' },
    { title: 'Express Delivery', desc: 'Across Pakistan within 2-4 business days, with real-time tracking.', svg: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
    { title: 'Fresh Aroma', desc: 'Ground in small batches each week to preserve volatile oils and aroma.', svg: '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero" itemScope itemType="https://schema.org/WebPageElement" style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100dvh - 90px)', display: 'flex', alignItems: 'center' }}>
        <div className="hero-bg" style={{ position: 'absolute', inset: 0 }}>
          <img src="/images/products/hero-spices.jpg" alt="Organic Pakistani spices on rustic wooden table — Aura Foods premium collection" fetchPriority="high" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="hero-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.92), rgba(10,10,10,0.6), rgba(10,10,10,0.3))' }} />
        </div>
        <div className="hero-content" style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '6rem 1.5rem', width: '100%' }}>
          <div className="hero-text fade-up" style={{ maxWidth: 640 }}>
            <span className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.3em', color: 'var(--gold)', marginBottom: '1.5rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/></svg>
              Artisan-Sourced · Stone-Ground · Freshly Packed
            </span>
            <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.25rem, 6vw, 4.5rem)', lineHeight: 1.05, color: 'var(--cream)', textWrap: 'balance' }}>
              Pure & Premium <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Organic Spices</em> from Pakistan
            </h1>
            <p className="hero-subtitle" style={{ fontSize: 'clamp(.9375rem, 1.2vw, 1.125rem)', color: 'rgba(250,247,242,0.75)', marginTop: '1.5rem', maxWidth: 560, lineHeight: 1.7 }}>
              Freshly packed, authentic spices from the fields of Sindh, delivered across Pakistan. Experience the heritage in every pinch.
            </p>
            <div className="hero-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', marginTop: '2.5rem' }}>
              <Link href="/products" className="btn-primary">
                Shop Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <Link href="/about" className="btn-secondary">Our Story</Link>
            </div>
            <div className="hero-features" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '3rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.75rem', color: 'rgba(250,247,242,0.65)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ color: 'var(--gold)' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                100% Organic
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.75rem', color: 'rgba(250,247,242,0.65)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ color: 'var(--gold)' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                No Preservatives
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.75rem', color: 'rgba(250,247,242,0.65)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ color: 'var(--gold)' }}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                Nationwide Delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category — Crafted Collections */}
      <section className="section" itemScope itemType="https://schema.org/ItemList">
        <div className="section-header fade-up" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 3.5rem' }}>
          <div className="section-eyebrow" style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.3em', color: 'var(--gold)' }}>Browse by Category</div>
          <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1, marginTop: '.75rem' }}>Curated Collections</h2>
          <p className="section-subtitle" style={{ color: 'var(--muted)', marginTop: '1rem', fontSize: '.9375rem' }}>From everyday essentials to signature blends — discover our carefully curated spice families.</p>
        </div>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} itemProp="itemListElement">
          {categories.map((cat: any) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="category-card" style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden', display: 'block', textDecoration: 'none', color: 'var(--cream)' }} itemProp="significantLink">
              <img src={cat.image || '/images/products/placeholder.jpg'} alt={`${cat.name} — Buy organic ${cat.name} online in Pakistan`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s' }} />
              <div className="category-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.1) 60%, transparent 100%)' }} />
              <div className="category-name" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>{cat.name}</h3>
                <span style={{ fontSize: '.75rem', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '.35rem', marginTop: '.25rem', transition: 'gap .3s' }}>
                  Explore
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers — Loved in Pakistani Kitchens */}
      <section className="section-muted" style={{ padding: '5rem 1.5rem', background: 'rgba(74,103,65,0.05)' }} itemScope itemType="https://schema.org/ItemList">
        <div className="section" style={{ padding: 0, maxWidth: 1280, margin: '0 auto' }}>
          <div className="section-header-left fade-up" style={{ textAlign: 'left', margin: '0 0 3.5rem' }}>
            <div className="section-eyebrow" style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.3em', color: 'var(--gold)' }}>Best Sellers</div>
            <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1, marginTop: '.75rem' }}>Trusted by Pakistani Kitchens</h2>
            <p className="section-subtitle" style={{ color: 'var(--muted)', marginTop: '1rem', fontSize: '.9375rem' }}>The pantry staples our customers return to, time and again.</p>
          </div>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }} itemProp="itemListElement">
            {bestSellers.length > 0 ? bestSellers.map((product: any) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  oldPrice: product.oldPrice || null,
                  weight: product.weight || null,
                  tagline: product.tagline || null,
                  images: product.images.map((img: any) => ({
                    url: img.url,
                    alt: img.alt,
                  })),
                }}
                showBadge="Best Seller"
              />
            )) : (
              <p style={{ textAlign: 'center', color: 'var(--muted)', gridColumn: '1 / -1' }}>No featured products yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Why Aura Foods — A Promise You Can Taste */}
      <section className="section">
        <div className="section-header fade-up" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 3.5rem' }}>
          <div className="section-eyebrow" style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.3em', color: 'var(--gold)' }}>Why Aura Foods</div>
          <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1, marginTop: '.75rem' }}>A Promise You Can Taste</h2>
          <p className="section-subtitle" style={{ color: 'var(--muted)', marginTop: '1rem', fontSize: '.9375rem' }}>Six principles that define every jar we deliver.</p>
        </div>
        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {whyItems.map((item) => (
            <div key={item.title} className="why-card fade-up" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '1.5rem', textAlign: 'center', transition: 'all .3s' }}>
              <div className="why-icon" style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), #d4b85a)', display: 'grid', placeItems: 'center', margin: '0 auto 1rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" style={{ color: 'var(--ink)' }} dangerouslySetInnerHTML={{ __html: item.svg }} />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem' }}>{item.title}</h3>
              <p style={{ fontSize: '.8125rem', color: 'var(--muted)', marginTop: '.35rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section — From Sindh Soil to Your Spice Rack */}
      <section className="story-section" style={{ padding: '5rem 1.5rem', background: 'var(--ink)', color: 'var(--cream)' }}>
        <div className="story-container" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div className="story-image fade-up" style={{ position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
            <div className="img-hover-switch" style={{ display: 'grid', width: '100%' }}>
              <img src="/images/products/story-en.jpg" alt="Traditional spice grinding in Sindh, Pakistan — Aura Foods heritage process" className="img-default" loading="lazy" style={{ gridArea: '1/1', width: '100%', transition: 'opacity .4s ease', objectFit: 'cover', aspectRatio: '4/5', position: 'relative', zIndex: 1 }} />
              <img src="/images/products/story-ur.jpg" alt="مصالحہ پیسنے کی روایتی تکنیک — Aura Foods کا معیار" className="img-hover" loading="lazy" style={{ gridArea: '1/1', width: '100%', transition: 'opacity .4s ease', objectFit: 'cover', aspectRatio: '4/5', position: 'relative', zIndex: 0, opacity: 0 }} />
            </div>
            <div className="story-location" style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', background: 'rgba(10,10,10,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '.75rem', padding: '1rem' }}>
              <div className="story-location-label" style={{ fontSize: '.625rem', textTransform: 'uppercase', letterSpacing: '.2em', color: 'var(--gold)' }}>From the fields of</div>
              <div className="story-location-name" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', marginTop: '.15rem' }}>Kunri, Sindh</div>
            </div>
          </div>
          <div className="story-content fade-up">
            <div className="section-eyebrow" style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.3em', color: 'var(--gold)' }}>Our Quality Commitment</div>
            <h2 className="story-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', lineHeight: 1.1, marginTop: '.75rem' }}>
              From Sindh Soil to <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Your Spice Rack</em>
            </h2>
            <p className="story-text" style={{ color: 'rgba(250,247,242,0.7)', lineHeight: 1.8, marginTop: '1.25rem' }}>
              Every spice we offer is traceable to the family farms of Kunri — the chilli capital of Asia. Each batch is sun-dried, hand-cleaned, stone-ground, and sealed within days, never months.
            </p>
            <div className="story-list" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'Heritage Sourcing', desc: 'Direct, longstanding partnerships with Sindh growers.' },
                { title: 'Triple-Stage Cleaning', desc: 'Stones, stems, and dust — meticulously removed.' },
                { title: 'Cold Stone-Grinding', desc: 'Preserves delicate volatile oils and robust aroma.' },
                { title: 'Hygienic Packaging', desc: 'Sealed in certified food-grade facilities.' },
              ].map((item) => (
                <div key={item.title} className="story-list-item" style={{ display: 'flex', gap: '1rem' }}>
                  <div className="story-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', marginTop: '.45rem', flexShrink: 0 }} />
                  <div>
                    <div className="story-list-title" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{item.title}</div>
                    <div className="story-list-desc" style={{ fontSize: '.8125rem', color: 'rgba(250,247,242,0.6)', marginTop: '.1rem' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Love — Trusted Across Pakistan */}
      <section className="section">
        <div className="section-header fade-up" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 3.5rem' }}>
          <div className="section-eyebrow" style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.3em', color: 'var(--gold)' }}>Testimonials</div>
          <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1, marginTop: '.75rem' }}>Trusted Across Pakistan</h2>
          <p className="section-subtitle" style={{ color: 'var(--muted)', marginTop: '1rem', fontSize: '.9375rem' }}>Genuine feedback from real kitchens.</p>
        </div>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card fade-up" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '1.75rem', transition: 'all .3s' }}>
              <div className="stars" style={{ display: 'flex', gap: '.125rem', color: 'var(--gold)', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" width="16" height="16" style={{ fill: 'currentColor' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <p className="testimonial-text" style={{ color: 'rgba(10,10,10,0.85)', lineHeight: 1.7, fontSize: '.9375rem' }}>&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-author" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                <div className="testimonial-avatar" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--olive)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{t.initials}</div>
                <div>
                  <div className="testimonial-name" style={{ fontSize: '.875rem', fontWeight: 600 }}>{t.name}</div>
                  <div className="testimonial-city" style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Journal — Stories from the Kitchen */}
      <section className="section" itemScope itemType="https://schema.org/Blog">
        <div className="section-header fade-up" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 3.5rem' }}>
          <div className="section-eyebrow" style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.3em', color: 'var(--gold)' }}>Journal</div>
          <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1, marginTop: '.75rem' }}>Stories from the Kitchen</h2>
          <p className="section-subtitle" style={{ color: 'var(--muted)', marginTop: '1rem', fontSize: '.9375rem' }}>Insights, recipes, and stories from Pakistan&apos;s spice heartland.</p>
        </div>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div className="blog-card fade-up" style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--card)', textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="blog-card-img" style={{ height: 200, overflow: 'hidden' }}>
              <img src="/images/products/turmeric.jpg" alt="The Health Benefits of Daily Turmeric — Aura Foods blog" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div className="blog-card-meta" style={{ display: 'flex', gap: '.75rem', fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted)', marginBottom: '.5rem' }}>
                <span className="blog-card-cat" style={{ color: 'var(--gold)' }}>Wellness</span>
                <span>4 min read</span>
              </div>
              <h3 className="blog-card-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', lineHeight: 1.4 }}>The Health Benefits of Daily Turmeric</h3>
            </div>
          </div>
          <div className="blog-card fade-up" style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--card)', textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="blog-card-img" style={{ height: 200, overflow: 'hidden' }}>
              <img src="/images/products/bbq.jpg" alt="Best Spices for the Perfect BBQ Night — Aura Foods blog" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div className="blog-card-meta" style={{ display: 'flex', gap: '.75rem', fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted)', marginBottom: '.5rem' }}>
                <span className="blog-card-cat" style={{ color: 'var(--gold)' }}>Cooking</span>
                <span>6 min read</span>
              </div>
              <h3 className="blog-card-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', lineHeight: 1.4 }}>Best Spices for the Perfect BBQ Night</h3>
            </div>
          </div>
          <div className="blog-card fade-up" style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--card)', textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div className="blog-card-img" style={{ height: 200, overflow: 'hidden' }}>
              <img src="/images/products/garam.jpg" alt="Inside Sindh: Pakistan's Spice Heritage — Aura Foods blog" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div className="blog-card-meta" style={{ display: 'flex', gap: '.75rem', fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted)', marginBottom: '.5rem' }}>
                <span className="blog-card-cat" style={{ color: 'var(--gold)' }}>Heritage</span>
                <span>5 min read</span>
              </div>
              <h3 className="blog-card-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', lineHeight: 1.4 }}>Inside Sindh: Pakistan&apos;s Spice Heritage</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle Offers — Curated Combos, Better Value */}
      {bundles.length > 0 && (
        <section className="section-muted" style={{ padding: '5rem 1.5rem', background: 'rgba(74,103,65,0.05)' }}>
          <div className="section" style={{ padding: 0, maxWidth: 1280, margin: '0 auto' }}>
            <div className="section-header fade-up" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 3.5rem' }}>
              <div className="section-eyebrow" style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.3em', color: 'var(--gold)' }}>Bundle Offers</div>
              <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', lineHeight: 1.1, marginTop: '.75rem' }}>Curated Combos, Exceptional Value</h2>
              <p className="section-subtitle" style={{ color: 'var(--muted)', marginTop: '1rem', fontSize: '.9375rem' }}>Enjoy greater value when you stock up on essentials.</p>
            </div>
            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {bundles.map((bundle: any) => (
                <Link key={bundle.id} href={`/bundles/${bundle.slug}`} className="bundle-card fade-up" style={{ background: 'var(--ink)', color: 'var(--cream)', borderRadius: 8, padding: '2rem', position: 'relative', overflow: 'hidden', display: 'block', textDecoration: 'none', transition: 'all .3s' }}>
                  {bundle.oldPrice > bundle.price && (
                    <span className="bundle-badge" style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '.625rem', textTransform: 'uppercase', letterSpacing: '.15em', background: 'linear-gradient(135deg, var(--gold), #d4b85a)', color: 'var(--ink)', padding: '.35rem .75rem', borderRadius: 9999, fontWeight: 700 }}>
                      Save {Math.round((1 - bundle.price / bundle.oldPrice) * 100)}%
                    </span>
                  )}
                  {bundle.image && (
                    <img src={bundle.image} alt={`${bundle.name} — Aura Foods spice bundle`} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: '.75rem' }} loading="lazy" />
                  )}
                  <div className="bundle-label" style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.25em', color: 'var(--gold)' }}>Bundle</div>
                  <h3 className="bundle-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginTop: '.75rem' }}>{bundle.name}</h3>
                  <p className="bundle-items" style={{ fontSize: '.875rem', opacity: .65, marginTop: '.5rem' }}>{bundle._count.items} items</p>
                  <div className="bundle-price-row" style={{ display: 'flex', alignItems: 'flex-end', gap: '.75rem', marginTop: '2rem' }}>
                    <span className="bundle-price" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem' }}>Rs.{bundle.price.toLocaleString()}</span>
                    {bundle.oldPrice > bundle.price && (
                      <span className="bundle-old" style={{ fontSize: '.8125rem', opacity: .4, textDecoration: 'line-through', marginBottom: '.15rem' }}>Rs.{bundle.oldPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <span className="bundle-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', color: 'var(--gold)', fontSize: '.875rem', fontWeight: 600, textDecoration: 'none', marginTop: '1.5rem', transition: 'gap .3s' }}>
                    Shop the Bundle
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
