'use client'
// src/app/admin/page.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'

// Mock data
const MOCK_REGISTRATIONS = [
  { day: 'Mon', count: 142 }, { day: 'Tue', count: 198 }, { day: 'Wed', count: 167 },
  { day: 'Thu', count: 221 }, { day: 'Fri', count: 289 }, { day: 'Sat', count: 314 },
  { day: 'Sun', count: 276 },
]

const MOCK_ACTIVITY = [
  { time: '2 min ago',  type: 'kyc',    msg: 'KYC approved — AlphaTrader (🇦🇪 UAE)',       color: 'var(--green)' },
  { time: '8 min ago',  type: 'reg',    msg: 'New registration — NightFX (🇳🇬 Nigeria)',    color: 'var(--neon)'  },
  { time: '14 min ago', type: 'dq',     msg: 'Drawdown breach — TradePro (🇮🇳 India)',      color: 'var(--red)'   },
  { time: '21 min ago', type: 'kyc',    msg: 'KYC approved — GoldenPip (🇬🇧 UK)',           color: 'var(--green)' },
  { time: '35 min ago', type: 'reg',    msg: 'New registration — PhoenixFX (🇵🇰 Pakistan)', color: 'var(--neon)'  },
  { time: '1h ago',     type: 'email',  msg: 'Bulk email sent — 1,240 traders',             color: 'var(--gold)'  },
  { time: '2h ago',     type: 'kyc',    msg: 'KYC rejected — missing document (🇧🇷 Brazil)', color: 'var(--red)'   },
]

const STATS = [
  { label: 'Total Registered', value: '2,418', delta: '+142 today',  deltaUp: true,  icon: '◉', color: 'var(--neon)',  href: '/admin/traders'               },
  { label: 'KYC Pending',      value: '38',    delta: '↑ 8 new',     deltaUp: false, icon: '⚠', color: 'var(--gold)', href: '/admin/traders?status=KYC_PENDING' },
  { label: 'Active Traders',   value: '1,894', delta: '+67 today',   deltaUp: true,  icon: '◈', color: 'var(--green)',href: '/admin/traders?status=ACTIVE'  },
  { label: 'Countries',        value: '32',    delta: 'All filled',  deltaUp: true,  icon: '◎', color: 'var(--neon)', href: '/admin/traders'               },
  { label: 'Disqualified',     value: '12',    delta: '↑ 3 today',   deltaUp: false, icon: '✕', color: 'var(--red)',  href: '/admin/traders?status=DISQUALIFIED' },
  { label: 'Emails Sent Today','value': '3,200', delta: '2 campaigns', deltaUp: true,icon: '◇', color: 'var(--gold)', href: '/admin/crm'                   },
  { label: 'Active Matches',   value: '0',     delta: 'Qualifier phase', deltaUp: true, icon: '⚡', color: 'var(--neon)', href: '/admin/bracket'           },
  { label: 'Qualified',        value: '0',     delta: 'Opens Jun 1',  deltaUp: true,  icon: '🏆', color: 'var(--gold)', href: '/admin/bracket'              },
]

const QUICK_ACTIONS = [
  { label: 'Approve KYC Batch',   icon: '✓', color: 'var(--green)', href: '/admin/traders?status=KYC_PENDING', desc: '38 pending' },
  { label: 'Send Bulk Email',      icon: '✉', color: 'var(--neon)',  href: '/admin/crm',    desc: '2,418 traders' },
  { label: 'Seed Bracket',        icon: '◈', color: 'var(--gold)',  href: '/admin/bracket', desc: 'After qualifier' },
  { label: 'Update Config',       icon: '⚙', color: 'var(--gray2)', href: '/admin/config',  desc: 'Rules & dates' },
  { label: 'Publish News Post',   icon: '✎', color: 'var(--neon)',  href: '/admin/cms',     desc: 'CMS editor' },
  { label: 'View Audit Logs',     icon: '◎', color: 'var(--gray2)', href: '/admin/logs',    desc: 'Last 24h' },
]

const TOP_TRADERS = [
  { name: 'AlphaTrader', country: '🇦🇪', cc: 'AE', ret: '+24.8%', dd: '2.1%', trades: 34, status: 'ACTIVE' },
  { name: 'NightFX',     country: '🇳🇬', cc: 'NG', ret: '+21.3%', dd: '3.4%', trades: 28, status: 'ACTIVE' },
  { name: 'GoldenPip',   country: '🇮🇳', cc: 'IN', ret: '+19.6%', dd: '1.8%', trades: 41, status: 'ACTIVE' },
  { name: 'WaveRider',   country: '🇬🇧', cc: 'GB', ret: '+17.2%', dd: '4.2%', trades: 22, status: 'ACTIVE' },
  { name: 'StrikeFX',    country: '🇿🇦', cc: 'ZA', ret: '+15.8%', dd: '2.9%', trades: 31, status: 'ACTIVE' },
]

function MiniBarChart({ data }: { data: { day: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
      {data.map((d, i) => (
        <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{
            width: '100%', borderRadius: 4,
            height: `${(d.count / max) * 70}px`,
            background: i === data.length - 1
              ? 'linear-gradient(to top, var(--neon), rgba(0,212,255,0.4))'
              : 'rgba(0,212,255,0.15)',
            boxShadow: i === data.length - 1 ? '0 0 8px rgba(0,212,255,0.4)' : 'none',
            transition: 'height 0.3s ease',
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gray3)' }}>{d.day}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [time, setTime] = useState(new Date())
  const [animatedStats, setAnimatedStats] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    setTimeout(() => setAnimatedStats(true), 100)
    return () => clearInterval(t)
  }, [])

  return (
    <AdminLayout>
      {/* ── Page header ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--neon)', marginBottom: 8 }}>
            Operations Dashboard
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 40, color: 'var(--white)', lineHeight: 1 }}>
            Command Center
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--white)', letterSpacing: '0.05em' }}>
            {time.toLocaleTimeString()}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray3)' }}>
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* ── Phase progress bar ──────────────────────────────────── */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 0, overflow: 'hidden' }}>
        {['Registration','Qualifier','Round of 32','Round of 16','Quarters','Semis','Grand Final'].map((phase, i) => (
          <div key={phase} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', zIndex: 1,
              background: i === 0 ? 'var(--neon)' : 'var(--surface2)',
              border: `2px solid ${i === 0 ? 'var(--neon)' : 'var(--border2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: i === 0 ? '0 0 12px rgba(0,212,255,0.6)' : 'none',
            }}>
              {i === 0 && <span style={{ fontSize: 12 }}>●</span>}
            </div>
            {i < 6 && <div style={{ position: 'absolute', top: 14, left: '50%', width: '100%', height: 2, background: i < 0 ? 'var(--neon)' : 'var(--border2)', zIndex: 0 }} />}
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: i === 0 ? 'var(--neon)' : 'var(--gray3)', textAlign: 'center', lineHeight: 1.2 }}>
              {phase}
            </span>
          </div>
        ))}
      </div>

      {/* ── Stats grid ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {STATS.map((stat, i) => (
          <Link key={stat.label} href={stat.href} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '20px', textDecoration: 'none',
            display: 'block', position: 'relative', overflow: 'hidden',
            opacity: animatedStats ? 1 : 0,
            transform: animatedStats ? 'translateY(0)' : 'translateY(16px)',
            transition: `all 0.4s ease ${i * 0.05}s`,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface2)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: stat.color, borderRadius: '12px 0 0 12px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 18, color: stat.color }}>{stat.icon}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 32, color: 'var(--white)', lineHeight: 1, marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray3)', marginBottom: 8 }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: stat.deltaUp ? 'var(--green)' : 'var(--red)' }}>
              {stat.delta}
            </div>
          </Link>
        ))}
      </div>

      {/* ── Middle row: chart + activity + quick actions ─────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 16, marginBottom: 28 }}>

        {/* Registrations chart */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registrations</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray3)', marginTop: 2 }}>Last 7 days</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: 'var(--neon)' }}>1,607</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--green)', fontWeight: 700 }}>↑ 12% vs last week</div>
            </div>
          </div>
          <MiniBarChart data={MOCK_REGISTRATIONS} />
        </div>

        {/* Activity feed */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--white)', marginBottom: 20 }}>
            Recent Activity
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, marginTop: 6, flexShrink: 0, boxShadow: `0 0 6px ${a.color}` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--gray1)', lineHeight: 1.4 }}>{a.msg}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gray3)', marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--white)', marginBottom: 20 }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {QUICK_ACTIONS.map(action => (
              <Link key={action.label} href={action.href} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                background: 'var(--deep)', border: '1px solid var(--border)',
                borderRadius: 8, textDecoration: 'none', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = action.color; (e.currentTarget as HTMLElement).style.background = 'var(--surface2)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--deep)' }}
              >
                <span style={{ fontSize: 16, color: action.color, width: 20, textAlign: 'center', flexShrink: 0 }}>{action.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {action.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gray3)' }}>{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top traders table ────────────────────────────────────── */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--white)' }}>
            Top Performers — Qualifier
          </div>
          <Link href="/admin/traders" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--neon)', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--deep)' }}>
              {['Rank', 'Trader', 'Country', 'Return', 'Max DD', 'Trades', 'Status'].map((h, i) => (
                <th key={h} style={{ padding: '12px 20px', textAlign: i > 2 ? 'right' : 'left', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray3)', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOP_TRADERS.map((t, i) => (
              <tr key={t.name} className="tr-hover">
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, ...(i===0?{color:'var(--gold)'}:i===1?{color:'#c0d0e0'}:i===2?{color:'#cd7040'}:{color:'var(--gray3)'}) }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--white)' }}>{t.name}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{t.country}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray2)' }}>{t.cc}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: 'var(--green)' }}>{t.ret}</span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: parseFloat(t.dd) > 5 ? 'var(--red)' : 'var(--green)' }}>{t.dd}</span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gray1)' }}>{t.trades}</span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <span className="badge badge-green">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
