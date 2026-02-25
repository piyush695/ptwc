'use client'
// src/components/layout/Navbar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const path = usePathname()

  const links = [
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/bracket',     label: 'Bracket'     },
    { href: '/news',        label: 'News'         },
    { href: '/traders',     label: 'Traders'      },
  ]

  const isActive = (href: string) => path === href

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(3,4,10,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,212,255,0.1)',
        boxShadow: '0 1px 0 rgba(0,212,255,0.06)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            {/* Trophy icon */}
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--neon)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0,212,255,0.5)',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#03040a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
                <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0012 0V2z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, letterSpacing: '0.06em', color: 'var(--white)', lineHeight: 1 }}>
                HOLA PRIME
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.2em', color: 'var(--neon)', lineHeight: 1, marginTop: 2 }}>
                WORLD CUP
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden md:flex">
            {links.map(link => (
              <Link key={link.href} href={link.href} style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '8px 16px', borderRadius: 6, textDecoration: 'none',
                color: isActive(link.href) ? 'var(--neon)' : 'var(--gray2)',
                background: isActive(link.href) ? 'rgba(0,212,255,0.08)' : 'transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isActive(link.href)) { (e.target as HTMLElement).style.color = 'var(--white)' } }}
              onMouseLeave={e => { if (!isActive(link.href)) { (e.target as HTMLElement).style.color = 'var(--gray2)' } }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hidden md:flex">
            <Link href="/login" style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--gray2)', textDecoration: 'none', transition: 'color 0.2s',
            }}>
              Sign In
            </Link>
            <Link href="/register" className="btn-neon" style={{ padding: '10px 22px', fontSize: 13 }}>
              Register
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--gray2)', cursor: 'pointer', padding: 4 }} className="block md:hidden">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--deep)',
            padding: '16px 24px',
          }}>
            {links.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} style={{
                display: 'block', padding: '12px 0',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: isActive(link.href) ? 'var(--neon)' : 'var(--gray1)',
                textDecoration: 'none', borderBottom: '1px solid var(--border)',
              }}>
                {link.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <Link href="/login" className="btn-outline" style={{ flex: 1, padding: '11px', fontSize: 13, textAlign: 'center' }}>Sign In</Link>
              <Link href="/register" className="btn-neon" style={{ flex: 1, padding: '11px', fontSize: 13, textAlign: 'center' }}>Register</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
