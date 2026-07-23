'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateCart = () => {
      try {
        const raw = localStorage.getItem('aura_cart');
        if (raw) {
          const items = JSON.parse(raw);
          const count = items.reduce((sum: number, item: { productId: number; quantity: number }) => sum + (item.quantity || 0), 0);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };

    updateCart();
    window.addEventListener('storage', updateCart);
    window.addEventListener('cartUpdated', updateCart);

    return () => {
      window.removeEventListener('storage', updateCart);
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
      <div className="nav-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 90 }}>
        <Link href="/" className="nav-logo" aria-label="Aura Foods Home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/images/brand/logo.png" alt="Aura Foods" style={{ height: 48, width: 'auto' }} />
        </Link>

        <button className="nav-toggle md:hidden" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'flex', flexDirection: 'column', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <span style={{ display: 'block', width: 24, height: 2, background: 'var(--cream)', borderRadius: 2, transition: '.3s', transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
          <span style={{ display: 'block', width: 24, height: 2, background: 'var(--cream)', borderRadius: 2, transition: '.3s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: 24, height: 2, background: 'var(--cream)', borderRadius: 2, transition: '.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
        </button>

        <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '.25rem', listStyle: 'none', margin: 0 }}>
          <li className="hidden md:block"><Link href="/" style={{ color: 'rgba(250,247,242,0.8)', textDecoration: 'none', padding: '.5rem 1rem', fontSize: '.875rem', fontWeight: 500, borderRadius: 8, transition: 'color .2s' }}>Home</Link></li>
          <li className="hidden md:block"><Link href="/products" style={{ color: 'rgba(250,247,242,0.8)', textDecoration: 'none', padding: '.5rem 1rem', fontSize: '.875rem', fontWeight: 500, borderRadius: 8, transition: 'color .2s' }}>Shop</Link></li>
          <li className="hidden md:block"><Link href="/about" style={{ color: 'rgba(250,247,242,0.8)', textDecoration: 'none', padding: '.5rem 1rem', fontSize: '.875rem', fontWeight: 500, borderRadius: 8, transition: 'color .2s' }}>About</Link></li>
          <li className="hidden md:block"><Link href="/contact" style={{ color: 'rgba(250,247,242,0.8)', textDecoration: 'none', padding: '.5rem 1rem', fontSize: '.875rem', fontWeight: 500, borderRadius: 8, transition: 'color .2s' }}>Contact</Link></li>
          <li className="hidden md:block"><Link href="/bundles" style={{ color: 'rgba(250,247,242,0.8)', textDecoration: 'none', padding: '.5rem 1rem', fontSize: '.875rem', fontWeight: 500, borderRadius: 8, transition: 'color .2s' }}>Bundles</Link></li>
          <li className="nav-search hidden md:flex" style={{ display: 'flex', alignItems: 'center' }}>
            <form action="/products" method="GET" className="search-form" role="search" style={{ display: 'flex' }} onSubmit={handleSearch}>
              <input type="text" name="q" placeholder="Search spices..." className="search-input" aria-label="Search products" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '6px 12px', border: '1px solid rgba(10,10,10,0.1)', borderRadius: 8, fontSize: '.8125rem', fontFamily: 'inherit', background: 'rgba(250,247,242,0.08)', width: 140, color: 'var(--cream)', transition: 'all .2s' }} />
            </form>
          </li>
          <li>
            <Link href="/cart" className="cart-link" aria-label="Shopping cart" style={{ position: 'relative', padding: '.5rem', color: 'rgba(250,247,242,0.8)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              <span className="cart-count" id="cartCount" style={{ position: 'absolute', top: 0, right: 0, background: 'var(--gold)', color: 'var(--ink)', fontSize: '.65rem', fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>{cartCount}</span>
            </Link>
          </li>
        </ul>
      </div>

      {menuOpen && (
        <div style={{ background: 'rgba(10,10,10,0.98)', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
          <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
            <Link href="/" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '.65rem .75rem', color: 'rgba(250,247,242,0.8)', textDecoration: 'none', fontSize: '.875rem', fontWeight: 500, borderRadius: 8 }}>Home</Link>
            <Link href="/products" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '.65rem .75rem', color: 'rgba(250,247,242,0.8)', textDecoration: 'none', fontSize: '.875rem', fontWeight: 500, borderRadius: 8 }}>Shop</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '.65rem .75rem', color: 'rgba(250,247,242,0.8)', textDecoration: 'none', fontSize: '.875rem', fontWeight: 500, borderRadius: 8 }}>About</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '.65rem .75rem', color: 'rgba(250,247,242,0.8)', textDecoration: 'none', fontSize: '.875rem', fontWeight: 500, borderRadius: 8 }}>Contact</Link>
            <Link href="/bundles" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '.65rem .75rem', color: 'rgba(250,247,242,0.8)', textDecoration: 'none', fontSize: '.875rem', fontWeight: 500, borderRadius: 8 }}>Bundles</Link>
            <form action="/products" method="GET" style={{ marginTop: '.5rem' }}>
              <input type="text" name="q" placeholder="Search spices..." style={{ width: '100%', padding: '.65rem .75rem', borderRadius: 8, border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(10,10,10,0.5)', color: 'var(--cream)', fontSize: '.875rem', fontFamily: 'inherit' }} />
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
