'use client'
// src/app/dashboard/page.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const flagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`

// ── Mock trader data (replace with session/API) ──────────────
const TRADER = {
  displayName: 'AlphaTrader',
  country: 'United Arab Emirates',
  countryCode: 'AE',
  status: 'ACTIVE',
  kycStatus: 'APPROVED',
  rank: 3,
  returnPct: 14.82,
}

const ACCOUNT = {
  number: 'HP-WC-A1B2',
  server: 'HolaPrime-Live',
  balance: 11482.40,
  equity: 11620.18,
  openPnL: +137.78,
  returnPct: 14.82,
  maxDrawdown: 2.14,
  dailyDrawdown: 0.44,
  totalTrades: 34,
  winRate: 73.5,
  avgRR: 2.1,
  tradingDaysLeft: 4,
}

const RECENT_TRADES = [
  { id:'t1', symbol:'XAUUSD', type:'BUY',  open:2312.40, close:2328.90, lots:0.10, pnl:+165.00, date:'Today 14:22',    status:'CLOSED' },
  { id:'t2', symbol:'EURUSD', type:'SELL', open:1.0842,  close:1.0818,  lots:0.20, pnl:+48.00,  date:'Today 11:05',    status:'CLOSED' },
  { id:'t3', symbol:'US30',   type:'BUY',  open:39420,   close:null,    lots:0.05, pnl:+78.40,  date:'Open',           status:'OPEN'   },
  { id:'t4', symbol:'GBPUSD', type:'BUY',  open:1.2640,  close:1.2598,  lots:0.15, pnl:-63.00,  date:'Yesterday',      status:'CLOSED' },
  { id:'t5', symbol:'XAUUSD', type:'SELL', open:2298.10, close:2290.60, lots:0.10, pnl:+75.00,  date:'Yesterday',      status:'CLOSED' },
]

const NEARBY_TRADERS = [
  { rank:1, name:'GoldenPip',  cc:'IN', ret:'+19.6%', gap:'+4.78%' },
  { rank:2, name:'NightFX',    cc:'NG', ret:'+17.2%', gap:'+2.38%' },
  { rank:3, name:'AlphaTrader',cc:'AE', ret:'+14.8%', gap:'YOU',    isMe: true },
  { rank:4, name:'WaveRider',  cc:'GB', ret:'+12.1%', gap:'-2.72%' },
  { rank:5, name:'StrikeFX',   cc:'ZA', ret:'+10.4%', gap:'-4.42%' },
]

const NOTIFICATIONS = [
  { type:'info',    time:'2h ago',  msg:'Qualifier period ends in 4 trading days. Make sure you have 10+ trades.' },
  { type:'success', time:'1d ago',  msg:'KYC verification approved! Your trading account is now fully active.' },
  { type:'warning', time:'2d ago',  msg:'Daily drawdown reached 4.2% today — stay within the 8% limit.' },
  { type:'info',    time:'3d ago',  msg:'Welcome to Hola Prime World Cup 2026! Your account HP-WC-A1B2 is ready.' },
]

const TIMELINE = [
  { label:'Register & KYC',   date:'May 1–30',     done:true,  active:false },
  { label:'Qualifier',        date:'Jun 1–12',      done:false, active:true  },
  { label:'Round of 32',      date:'Jun 15–21',     done:false, active:false },
  { label:'Round of 16',      date:'Jun 22–28',     done:false, active:false },
  { label:'Quarterfinals',    date:'Jun 29–Jul 5',  done:false, active:false },
  { label:'Semifinals',       date:'Jul 6–10',      done:false, active:false },
  { label:'Grand Final',      date:'Jul 18',        done:false, active:false },
]

// Drawdown ring component
function DrawdownRing({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = (value / max) * 100
  const r = 28, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={70} height={70} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={35} cy={35} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={5} />
        <circle cx={35} cy={35} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease', filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div style={{ textAlign: 'center', marginTop: -6 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, color, lineHeight: 1 }}>{value.toFixed(1)}%</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray3)', marginTop: 3 }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gray3)' }}>max {max}%</div>
      </div>
    </div>
  )
}

// Stat card
function StatCard({ label, value, sub, color = 'var(--white)', border = 'var(--border)' }: any) {
  return (
    <div style={{ background: 'var(--surface)', border: `1px solid ${border}`, borderRadius: 12, padding: '20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gray3)', marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, color: 'var(--gray3)', marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

export default function DashboardPage() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const iv = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(iv) }, [])

  const daysLeft = ACCOUNT.tradingDaysLeft
  const tradesLeft = Math.max(0, 10 - RECENT_TRADES.filter(t => t.status === 'CLOSED').length)

  return (
    <DashboardLayout trader={TRADER}>

      {/* ── Page Header ───────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--neon)', marginBottom: 8 }}>
            Trader Dashboard
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 36, color: 'var(--white)', lineHeight: 1, margin: 0 }}>
            Welcome back, {TRADER.displayName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
            <div style={{ width: 22, height: 15, borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
              <img src={flagUrl(TRADER.countryCode)} alt={TRADER.country} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <span style={{ fontSize: 13, color: 'var(--gray2)' }}>Representing {TRADER.country}</span>
            <span style={{ color: 'var(--border2)' }}>·</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray3)' }}>{ACCOUNT.number}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--white)' }}>{time.toLocaleTimeString()}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gray3)' }}>{time.toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' })}</div>
        </div>
      </div>

      {/* ── KYC / Qualifier alert banners ─────────────────────── */}
      {TRADER.kycStatus !== 'APPROVED' && (
        <div style={{ background: 'rgba(240,192,64,0.07)', border: '1px solid rgba(240,192,64,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--gold)' }}>KYC Verification Required</div>
            <div style={{ fontSize: 13, color: 'var(--gray2)', marginTop: 3 }}>Complete KYC to activate your $10,000 trading account and enter the qualifier.</div>
          </div>
          <Link href="/dashboard/kyc" className="btn-gold" style={{ padding: '10px 20px', fontSize: 12, flexShrink: 0 }}>Complete KYC →</Link>
        </div>
      )}

      {/* Qualifier warning */}
      <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 12, padding: '14px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <span className="live-dot" />
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--neon)' }}>Qualifier Active — </span>
          <span style={{ fontSize: 13, color: 'var(--gray2)' }}>
            {daysLeft} trading days remaining · {tradesLeft > 0 ? `${tradesLeft} more trades needed to qualify` : 'Minimum trade count met ✓'}
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray3)' }}>Ends Jun 12</span>
      </div>

      {/* ── Top stat cards ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="Net Return"     value={`+${ACCOUNT.returnPct}%`}       color="var(--green)"  border="rgba(0,230,118,0.2)"  sub="vs $10,000 start" />
        <StatCard label="Account Balance" value={`$${ACCOUNT.balance.toLocaleString('en',{minimumFractionDigits:2})}`} color="var(--white)"  sub={`Equity $${ACCOUNT.equity.toLocaleString('en',{minimumFractionDigits:2})}`} />
        <StatCard label="Current Rank"   value={`#${TRADER.rank}`}              color="var(--gold)"   border="rgba(240,192,64,0.2)"  sub="out of 2,418 traders" />
        <StatCard label="Open P&L"       value={`+$${ACCOUNT.openPnL.toFixed(2)}`} color="var(--green)" sub="1 position open" />
      </div>

      {/* ── Middle row: Account health + rank ladder + timeline ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>

        {/* Account health */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--white)', marginBottom: 20 }}>Account Health</div>

          {/* Drawdown rings */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20 }}>
            <DrawdownRing value={ACCOUNT.dailyDrawdown}  max={8}  color="var(--neon)"  label="Daily DD" />
            <DrawdownRing value={ACCOUNT.maxDrawdown}    max={12} color="var(--gold)"  label="Total DD" />
          </div>

          {/* Stats list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { label: 'Win Rate',    value: `${ACCOUNT.winRate}%`,  color: 'var(--green)' },
              { label: 'Avg R:R',     value: `1:${ACCOUNT.avgRR}`,   color: 'var(--neon)'  },
              { label: 'Total Trades',value: String(ACCOUNT.totalTrades), color: 'var(--white)' },
              { label: 'Days Left',   value: `${daysLeft} days`,     color: daysLeft <= 2 ? 'var(--red)' : 'var(--gold)' },
            ].map((s, i) => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray3)' }}>{s.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rank ladder */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--white)', marginBottom: 20 }}>
            Your Position
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NEARBY_TRADERS.map((t) => (
              <div key={t.rank} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8,
                background: t.isMe ? 'rgba(0,212,255,0.08)' : 'transparent',
                border: `1px solid ${t.isMe ? 'rgba(0,212,255,0.3)' : 'transparent'}`,
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, width: 24, textAlign: 'center', color: t.rank === 1 ? 'var(--gold)' : t.rank === 2 ? '#c0d0e0' : t.rank === 3 ? '#cd7040' : 'var(--gray3)' }}>
                  {t.rank}
                </span>
                <div style={{ width: 20, height: 14, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={flagUrl(t.cc)} alt={t.cc} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: t.isMe ? 800 : 600, fontSize: 13, color: t.isMe ? 'var(--neon)' : 'var(--gray1)', flex: 1 }}>
                  {t.name} {t.isMe && '← YOU'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, color: 'var(--green)' }}>{t.ret}</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/leaderboard" style={{ display: 'block', textAlign: 'center', marginTop: 14, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--neon)', textDecoration: 'none' }}>
            Full Leaderboard →
          </Link>
        </div>

        {/* Tournament timeline */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--white)', marginBottom: 20 }}>
            Your Journey
          </div>
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: 10, top: 10, bottom: 10, width: 1, background: 'var(--border)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {TIMELINE.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '8px 0', position: 'relative' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: item.done ? 'var(--green)' : item.active ? 'var(--neon)' : 'var(--surface2)',
                    border: `2px solid ${item.done ? 'var(--green)' : item.active ? 'var(--neon)' : 'var(--border2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: item.active ? '0 0 12px rgba(0,212,255,0.6)' : 'none',
                    zIndex: 1, fontSize: 9, color: 'var(--black)',
                  }}>
                    {item.done ? '✓' : ''}
                  </div>
                  <div style={{ paddingBottom: i < TIMELINE.length - 1 ? 8 : 0, opacity: !item.done && !item.active ? 0.4 : 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: item.active ? 800 : 700, fontSize: 12, color: item.active ? 'var(--neon)' : item.done ? 'var(--green)' : 'var(--gray2)', letterSpacing: '0.04em' }}>
                      {item.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gray3)' }}>{item.date}</div>
                  </div>
                  {item.active && (
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(0,212,255,0.1)', color: 'var(--neon)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: 4, padding: '2px 7px' }}>NOW</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom row: recent trades + notifications + MT5 ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>

        {/* Recent trades */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--white)' }}>Recent Trades</div>
            <Link href="/dashboard/trades" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--neon)', textDecoration: 'none' }}>All Trades →</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--deep)' }}>
                {['Symbol','Type','Lots','Open','Close','P&L','Time'].map((h, i) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: i > 2 ? 'right' : 'left', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray3)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_TRADES.map(t => (
                <tr key={t.id} className="tr-hover">
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--white)' }}>{t.symbol}</span>
                    {t.status === 'OPEN' && <span className="live-dot" style={{ marginLeft: 6 }} />}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 4, background: t.type === 'BUY' ? 'rgba(0,230,118,0.1)' : 'rgba(255,56,96,0.1)', color: t.type === 'BUY' ? 'var(--green)' : 'var(--red)', border: `1px solid ${t.type === 'BUY' ? 'rgba(0,230,118,0.25)' : 'rgba(255,56,96,0.25)'}` }}>
                      {t.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray2)' }}>{t.lots}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray2)' }}>{t.open}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: t.close ? 'var(--gray2)' : 'var(--neon)' }}>
                      {t.close ?? '—LIVE—'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: t.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gray3)' }}>{t.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column: notifications + MT5 creds */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* MT5 / Account credentials */}
          <div style={{ background: 'var(--surface)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 12, padding: 20, boxShadow: '0 0 20px rgba(0,212,255,0.05)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--white)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--neon)' }}>◈</span> MT5 Credentials
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Login',    value: '847392',          copy: true  },
                { label: 'Server',   value: ACCOUNT.server,    copy: false },
                { label: 'Password', value: '••••••••',        copy: true, hint: 'Click to reveal' },
              ].map((item, i) => (
                <div key={item.label} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray3)' }}>{item.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gray1)' }}>{item.value}</span>
                    {item.copy && (
                      <button
                        onClick={() => navigator.clipboard.writeText(item.value)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray3)', fontSize: 12, padding: '2px 4px', borderRadius: 4, transition: 'color 0.15s' }}
                        title="Copy"
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--neon)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--gray3)'}
                      >⧉</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, padding: '9px 12px', borderRadius: 7, border: '1px solid var(--border2)', background: 'transparent', color: 'var(--neon)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Download MT5
              </button>
              <button style={{ flex: 1, padding: '9px 12px', borderRadius: 7, border: 'none', background: 'var(--neon)', color: 'var(--black)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Open Platform
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--white)', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Notifications</span>
              <span style={{ background: 'var(--red)', color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 9, borderRadius: 100, padding: '2px 7px' }}>3</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NOTIFICATIONS.map((n, i) => {
                const colors: Record<string, string> = { info:'var(--neon)', success:'var(--green)', warning:'var(--gold)', error:'var(--red)' }
                const icons: Record<string, string>  = { info:'ℹ', success:'✓', warning:'⚠', error:'✕' }
                const c = colors[n.type]
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: `${c}08`, border: `1px solid ${c}20`, borderRadius: 8 }}>
                    <span style={{ fontSize: 14, color: c, flexShrink: 0, marginTop: 1 }}>{icons[n.type]}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: 'var(--gray1)', lineHeight: 1.5 }}>{n.msg}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gray3)', marginTop: 4 }}>{n.time}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}
