'use client'
// src/app/news/page.tsx
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

const ARTICLES = [
  {
    slug: 'registration-now-open',
    category: 'Announcement',
    categoryColor: 'var(--neon)',
    date: 'May 1, 2026',
    title: 'Registration Is Now Open — Claim Your Country\'s Flag',
    excerpt: 'The Hola Prime World Cup 2026 is officially open for registration. One trader per country. 32 nations. One champion. Secure your flag before someone else does.',
    featured: true,
    readTime: '3 min',
  },
  {
    slug: 'prize-pool-breakdown',
    category: 'Tournament',
    categoryColor: 'var(--gold)',
    date: 'Apr 28, 2026',
    title: '$100,000 Prize Pool — Full Breakdown & Distribution',
    excerpt: 'We\'ve published the complete prize structure for the 2026 World Cup. Grand champion takes home $60,000 on top of their funded account profits.',
    featured: false,
    readTime: '4 min',
  },
  {
    slug: 'kyc-guide',
    category: 'Guide',
    categoryColor: 'var(--green)',
    date: 'Apr 25, 2026',
    title: 'How to Complete KYC in Under 10 Minutes',
    excerpt: 'A step-by-step walkthrough of the identity verification process — documents needed, what to avoid, and how to get approved fast.',
    featured: false,
    readTime: '5 min',
  },
  {
    slug: 'trading-rules-explained',
    category: 'Rules',
    categoryColor: 'var(--neon)',
    date: 'Apr 20, 2026',
    title: 'Qualifier Trading Rules — Everything You Need to Know',
    excerpt: 'Drawdown limits, minimum trade count, eligible instruments, and how scoring works. Read this before your first trade.',
    featured: false,
    readTime: '6 min',
  },
  {
    slug: 'mt5-setup-guide',
    category: 'Guide',
    categoryColor: 'var(--green)',
    date: 'Apr 18, 2026',
    title: 'Setting Up MetaTrader 5 for the World Cup',
    excerpt: 'Download, install, and connect MT5 to your HolaPrime-Live server. Includes screenshots and common troubleshooting fixes.',
    featured: false,
    readTime: '7 min',
  },
  {
    slug: 'bracket-format',
    category: 'Tournament',
    categoryColor: 'var(--gold)',
    date: 'Apr 15, 2026',
    title: 'How the H2H Bracket Works — Seeding, Rounds & Format',
    excerpt: 'After the qualifier, the top 32 traders enter a head-to-head bracket. Here\'s how seeding works, how weekly rounds are scored, and what to expect.',
    featured: false,
    readTime: '5 min',
  },
]

export default function NewsPage() {
  const featured = ARTICLES[0]
  const rest = ARTICLES.slice(1)

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 32px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--neon)', marginBottom: 12 }}>Latest</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px,6vw,72px)', textTransform: 'uppercase', color: 'var(--white)', lineHeight: 0.95, margin: 0 }}>
            News &<br /><span className="text-shimmer">Updates</span>
          </h1>
        </div>

        {/* Featured article */}
        <Link href={`/news/${featured.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 32 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 16, padding: '40px', position: 'relative', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(0,212,255,0.4)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(0,212,255,0.2)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--neon), transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 5, background: 'rgba(0,212,255,0.1)', color: featured.categoryColor, border: `1px solid ${featured.categoryColor}30` }}>{featured.category}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', padding: '4px 10px', borderRadius: 5, background: 'rgba(240,192,64,0.08)', border: '1px solid rgba(240,192,64,0.2)' }}>★ Featured</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gray3)', marginLeft: 'auto' }}>{featured.date} · {featured.readTime} read</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(22px,3vw,36px)', color: 'var(--white)', marginBottom: 14, lineHeight: 1.1, textTransform: 'uppercase' }}>{featured.title}</h2>
            <p style={{ fontSize: 16, color: 'var(--gray2)', lineHeight: 1.7, maxWidth: 680, marginBottom: 20 }}>{featured.excerpt}</p>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--neon)' }}>Read Article →</span>
          </div>
        </Link>

        {/* Article grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {rest.map(a => (
            <Link key={a.slug} href={`/news/${a.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(0,212,255,0.25)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = '1px solid var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 4, color: a.categoryColor, background: `${a.categoryColor}12`, border: `1px solid ${a.categoryColor}25` }}>{a.category}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gray3)', marginLeft: 'auto' }}>{a.readTime} read</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, color: 'var(--white)', marginBottom: 10, lineHeight: 1.2, textTransform: 'uppercase', flex: 1 }}>{a.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--gray3)', lineHeight: 1.65, marginBottom: 16 }}>{a.excerpt}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gray3)' }}>{a.date}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--neon)' }}>Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
