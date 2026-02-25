'use client'
// src/app/page.tsx
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/hero/HeroSection'

export default function HomePage() {
  const prizes = [
    { place:'1ST',    emoji:'🥇', amount:'$60,000',   label:'Grand Champion',     highlight:true  },
    { place:'2ND',    emoji:'🥈', amount:'$25,000',   label:'Runner Up',          highlight:false },
    { place:'3RD',    emoji:'🥉', amount:'$7,500',    label:'Semi-Finalists',     highlight:false },
    { place:'TOP 16', emoji:'🏅', amount:'Funded Acc', label:'Quarter-Finalists', highlight:false },
  ]

  const steps = [
    { num:'01', title:'Register',    desc:'Sign up, complete KYC, claim your country\'s flag. Free to enter.' },
    { num:'02', title:'Qualifier',   desc:'Jun 1–12. Trade on a $10K funded account. Top trader per country advances.' },
    { num:'03', title:'H2H Bracket', desc:'Jun 15–Jul 10. Weekly battles: R32 → R16 → QF → SF.' },
    { num:'04', title:'Grand Final', desc:'Jul 18, LIVE on stage in Dubai. Two finalists. One champion.' },
  ]

  const rules = [
    '$10,000 standardized funded account every round',
    'Scored on Net % Return — minimum 10 trades required',
    '8% daily / 12% total drawdown auto-disqualifies',
    'All trades audited — anti-cheat active 24/7',
    'Max leverage 1:30 across all rounds',
    'Major FX, Gold, Oil, Indices — all eligible',
  ]

  const timeline = [
    { date:'May 1–30',     event:'Registration Open',  active:true  },
    { date:'Jun 1–12',     event:'Open Qualifier',      active:false },
    { date:'Jun 15–21',    event:'Round of 32',         active:false },
    { date:'Jun 22–28',    event:'Round of 16',         active:false },
    { date:'Jun 29–Jul 5', event:'Quarterfinals',       active:false },
    { date:'Jul 6–10',     event:'Semifinals',          active:false },
    { date:'Jul 18',       event:'🏆 Grand Final LIVE', active:false },
  ]

  return (
    <div style={{ background:'var(--black)', minHeight:'100vh' }}>
      <Navbar />

      {/* ── HERO with countdown + trophy ─────────────────────── */}
      <HeroSection />

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section style={{ padding:'120px 32px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ marginBottom:60 }}>
          <div className="section-label" style={{ marginBottom:14 }}>How It Works</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'clamp(40px,5vw,68px)', textTransform:'uppercase', color:'var(--white)', lineHeight:1 }}>
            Four Phases.<br /><span className="text-neon">One Champion.</span>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px,1fr))', gap:2 }}>
          {steps.map((step, i) => (
            <div key={step.num}
              style={{ background:'var(--surface)', padding:'40px 32px', borderTop:'2px solid var(--neon)', position:'relative', transition:'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='var(--surface2)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='var(--surface)'}
            >
              <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--neon)', letterSpacing:'0.15em', marginBottom:18 }}>{step.num}</div>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:26, color:'var(--white)', marginBottom:12, textTransform:'uppercase' }}>{step.title}</h3>
              <p style={{ fontSize:15, color:'var(--gray2)', lineHeight:1.65 }}>{step.desc}</p>
              {i < steps.length-1 && (
                <div style={{ position:'absolute', top:'50%', right:-14, transform:'translateY(-50%)', color:'var(--neon)', fontSize:22, zIndex:10 }}>›</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── PRIZE POOL ───────────────────────────────────────── */}
      <section style={{ padding:'120px 32px', background:'var(--deep)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <div className="section-label" style={{ marginBottom:14 }}>Prize Structure</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'clamp(40px,5vw,68px)', textTransform:'uppercase', lineHeight:1 }}>
              <span className="text-gold-shimmer">$100,000</span><br />
              <span style={{ color:'var(--white)' }}>Prize Pool</span>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {prizes.map(p => (
              <div key={p.place} style={{
                background:p.highlight?'rgba(240,192,64,0.06)':'var(--surface)',
                border:`1px solid ${p.highlight?'rgba(240,192,64,0.3)':'var(--border)'}`,
                borderRadius:14, padding:'36px 24px', textAlign:'center',
                boxShadow:p.highlight?'0 0 40px rgba(240,192,64,0.12)':'none',
              }}>
                <div style={{ fontSize:40, marginBottom:12 }}>{p.emoji}</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:12, letterSpacing:'0.2em', color:'var(--gray3)', marginBottom:8 }}>{p.place} PLACE</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:34, color:p.highlight?'var(--gold)':'var(--white)', lineHeight:1 }}>{p.amount}</div>
                <div style={{ fontSize:13, color:'var(--gray2)', marginTop:8 }}>{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RULES + TIMELINE ─────────────────────────────────── */}
      <section style={{ padding:'120px 32px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64 }}>
          <div>
            <div className="section-label" style={{ marginBottom:14 }}>Tournament Rules</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'clamp(32px,4vw,52px)', textTransform:'uppercase', color:'var(--white)', lineHeight:1, marginBottom:40 }}>
              Fair.<br />Transparent.<br /><span className="text-neon">Audited.</span>
            </h2>
            {rules.map((rule,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:16 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--neon)', marginTop:8, flexShrink:0, boxShadow:'0 0 8px rgba(0,212,255,0.6)' }} />
                <span style={{ color:'var(--gray1)', fontSize:15, lineHeight:1.65 }}>{rule}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding:32 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:16, letterSpacing:'0.06em', color:'var(--white)', marginBottom:24, textTransform:'uppercase' }}>
              📅 Tournament Timeline
            </div>
            {timeline.map((item,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 0', borderBottom:i<timeline.length-1?'1px solid var(--border)':'none', opacity:item.active?1:0.5 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:item.active?'var(--neon)':'var(--gray3)', flexShrink:0, boxShadow:item.active?'0 0 10px rgba(0,212,255,0.7)':'none' }} />
                <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray3)', width:104, flexShrink:0 }}>{item.date}</div>
                <div style={{ fontSize:14, color:item.active?'var(--white)':'var(--gray2)', fontWeight:item.active?600:400 }}>{item.event}</div>
                {item.active && <span className="badge badge-neon" style={{ marginLeft:'auto' }}>NOW</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section style={{ padding:'0 32px 120px' }}>
        <div style={{
          maxWidth:1280, margin:'0 auto',
          background:'var(--surface)', border:'1px solid var(--border2)',
          borderRadius:20, padding:'80px 64px',
          position:'relative', overflow:'hidden', textAlign:'center',
        }}>
          <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'70%', height:2, background:'linear-gradient(90deg,transparent,var(--neon),transparent)' }} />
          <div style={{ position:'absolute', top:'-40%', left:'50%', transform:'translateX(-50%)', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)', filter:'blur(30px)' }} />
          <div style={{ position:'relative' }}>
            <div className="section-label" style={{ marginBottom:18 }}>Limited Spots — One Per Country</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'clamp(40px,6vw,76px)', textTransform:'uppercase', color:'var(--white)', marginBottom:14, lineHeight:1 }}>
              Your country needs<br /><span className="text-gold-shimmer">its best trader.</span>
            </h2>
            <p style={{ fontSize:18, color:'var(--gray2)', maxWidth:500, margin:'0 auto 40px' }}>
              Registration closes May 30. Don't let someone else represent your flag.
            </p>
            <Link href="/register" className="btn-gold" style={{ fontSize:17, padding:'18px 52px' }}>
              🏆 Register &amp; Claim Your Flag
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ borderTop:'1px solid var(--border)', padding:'40px 32px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:6, background:'var(--neon)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 10px rgba(0,212,255,0.4)', fontSize:14 }}>🏆</div>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:14, letterSpacing:'0.06em', color:'var(--white)' }}>HOLA PRIME WORLD CUP</span>
          </div>
          <div style={{ display:'flex', gap:24 }}>
            {[['Leaderboard','/leaderboard'],['Traders','/traders'],['News','/news'],['Rules','/rules'],['Contact','/contact'],['Terms','/terms'],['Privacy','/privacy']].map(([label,href]) => (
              <Link key={href} href={href} style={{ fontSize:13, color:'var(--gray3)', textDecoration:'none', transition:'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color='var(--white)'}
                onMouseLeave={e => (e.target as HTMLElement).style.color='var(--gray3)'}
              >{label}</Link>
            ))}
          </div>
          <div style={{ fontSize:12, color:'var(--gray3)' }}>© 2026 Hola Prime. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
