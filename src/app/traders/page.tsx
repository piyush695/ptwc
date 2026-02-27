// 'use client'
// // src/app/traders/page.tsx
// import { useState } from 'react'
// import Navbar from '@/components/layout/Navbar'

// const flagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`

// const TRADERS = [
//   { rank:1,  name:'GoldenPip',    cc:'IN', country:'India',          ret:'+19.6%', dd:'1.8%', trades:41, status:'ACTIVE',   joined:'Apr 30' },
//   { rank:2,  name:'NightFX',      cc:'NG', country:'Nigeria',        ret:'+17.2%', dd:'3.4%', trades:28, status:'ACTIVE',   joined:'Apr 29' },
//   { rank:3,  name:'AlphaTrader',  cc:'AE', country:'UAE',            ret:'+14.8%', dd:'2.1%', trades:34, status:'ACTIVE',   joined:'May 1'  },
//   { rank:4,  name:'WaveRider',    cc:'GB', country:'United Kingdom', ret:'+12.1%', dd:'4.2%', trades:22, status:'ACTIVE',   joined:'May 2'  },
//   { rank:5,  name:'StrikeFX',     cc:'ZA', country:'South Africa',   ret:'+10.4%', dd:'2.9%', trades:31, status:'ACTIVE',   joined:'Apr 28' },
//   { rank:6,  name:'PhoenixFX',    cc:'PK', country:'Pakistan',       ret:'+9.2%',  dd:'1.5%', trades:44, status:'ACTIVE',   joined:'May 3'  },
//   { rank:7,  name:'PipKing',      cc:'SG', country:'Singapore',      ret:'+8.7%',  dd:'3.1%', trades:19, status:'ACTIVE',   joined:'May 1'  },
//   { rank:8,  name:'BullsEye',     cc:'MY', country:'Malaysia',       ret:'+7.4%',  dd:'2.6%', trades:26, status:'ACTIVE',   joined:'May 2'  },
//   { rank:9,  name:'ZeroLoss',     cc:'KE', country:'Kenya',          ret:'+6.8%',  dd:'1.2%', trades:37, status:'ACTIVE',   joined:'Apr 27' },
//   { rank:10, name:'TrendHunter',  cc:'BR', country:'Brazil',         ret:'+5.9%',  dd:'4.8%', trades:15, status:'ACTIVE',   joined:'May 4'  },
//   { rank:11, name:'ScalpMaster',  cc:'DE', country:'Germany',        ret:'+5.1%',  dd:'2.0%', trades:52, status:'ACTIVE',   joined:'May 1'  },
//   { rank:12, name:'FXPhantom',    cc:'FR', country:'France',         ret:'+4.7%',  dd:'3.6%', trades:18, status:'ACTIVE',   joined:'May 3'  },
//   { rank:13, name:'PipDragon',    cc:'JP', country:'Japan',          ret:'+4.2%',  dd:'1.9%', trades:29, status:'ACTIVE',   joined:'May 2'  },
//   { rank:14, name:'GoldRush',     cc:'GH', country:'Ghana',          ret:'+3.8%',  dd:'2.4%', trades:21, status:'ACTIVE',   joined:'May 5'  },
//   { rank:15, name:'CandleKing',   cc:'AU', country:'Australia',      ret:'+3.2%',  dd:'1.7%', trades:33, status:'ACTIVE',   joined:'Apr 30' },
//   { rank:16, name:'SwingTrader',  cc:'CA', country:'Canada',         ret:'+2.9%',  dd:'3.3%', trades:14, status:'ACTIVE',   joined:'May 4'  },
// ]

// const STATUS_COLORS: Record<string, string> = {
//   ACTIVE: 'var(--green)', KYC_PENDING: 'var(--gold)', DISQUALIFIED: 'var(--red)',
// }

// export default function TradersPage() {
//   const [search, setSearch] = useState('')
//   const [sortBy, setSortBy] = useState<'rank' | 'name' | 'trades'>('rank')

//   const filtered = TRADERS
//     .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.country.toLowerCase().includes(search.toLowerCase()))
//     .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : sortBy === 'trades' ? b.trades - a.trades : a.rank - b.rank)

//   return (
//     <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
//       <Navbar />
//       <div style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 32px 80px' }}>

//         {/* Header */}
//         <div style={{ marginBottom: 48 }}>
//           <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--neon)', marginBottom: 12 }}>Qualifier</div>
//           <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px,6vw,72px)', textTransform: 'uppercase', color: 'var(--white)', lineHeight: 0.95, margin: '0 0 20px' }}>
//             All <span className="text-shimmer">Traders</span>
//           </h1>
//           <p style={{ fontSize: 16, color: 'var(--gray2)', maxWidth: 520 }}>
//             2,418 traders registered from 32 countries. One qualifier spot per nation.
//           </p>
//         </div>

//         {/* Stats */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
//           {[
//             { label: 'Registered', value: '2,418' },
//             { label: 'Countries', value: '32' },
//             { label: 'Active Traders', value: '1,894' },
//             { label: 'KYC Pending', value: '38' },
//           ].map(s => (
//             <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
//               <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: 'var(--white)', lineHeight: 1 }}>{s.value}</div>
//               <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gray3)', marginTop: 6 }}>{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Filters */}
//         <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
//           <input className="input-field" placeholder="🔍  Search by name or country..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 220 }} />
//           <div style={{ display: 'flex', gap: 6 }}>
//             {(['rank', 'name', 'trades'] as const).map(s => (
//               <button key={s} onClick={() => setSortBy(s)} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '9px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', background: sortBy === s ? 'var(--neon)' : 'var(--surface)', color: sortBy === s ? 'var(--black)' : 'var(--gray2)', transition: 'all 0.15s' }}>
//                 Sort: {s}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Table */}
//         <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ background: 'var(--deep)' }}>
//                 {['Rank', 'Trader', 'Country', 'Return', 'Max DD', 'Trades', 'Joined', 'Status'].map((h, i) => (
//                   <th key={h} style={{ padding: '13px 18px', textAlign: i > 2 ? 'right' : 'left', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray3)', whiteSpace: 'nowrap' }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map(t => (
//                 <tr key={t.rank} className="tr-hover">
//                   <td style={{ padding: '13px 18px' }}>
//                     <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: t.rank === 1 ? 'var(--gold)' : t.rank === 2 ? '#c0d0e0' : t.rank === 3 ? '#cd7040' : 'var(--gray3)' }}>
//                       {t.rank <= 3 ? ['🥇','🥈','🥉'][t.rank-1] : `#${t.rank}`}
//                     </span>
//                   </td>
//                   <td style={{ padding: '13px 18px' }}>
//                     <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--white)' }}>{t.name}</span>
//                   </td>
//                   <td style={{ padding: '13px 18px' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                       <div style={{ width: 22, height: 15, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
//                         <img src={flagUrl(t.cc)} alt={t.cc} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
//                       </div>
//                       <span style={{ fontSize: 13, color: 'var(--gray2)' }}>{t.country}</span>
//                     </div>
//                   </td>
//                   <td style={{ padding: '13px 18px', textAlign: 'right' }}>
//                     <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: 'var(--green)' }}>{t.ret}</span>
//                   </td>
//                   <td style={{ padding: '13px 18px', textAlign: 'right' }}>
//                     <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: parseFloat(t.dd) > 6 ? 'var(--red)' : 'var(--gray2)' }}>{t.dd}</span>
//                   </td>
//                   <td style={{ padding: '13px 18px', textAlign: 'right' }}>
//                     <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gray2)' }}>{t.trades}</span>
//                   </td>
//                   <td style={{ padding: '13px 18px', textAlign: 'right' }}>
//                     <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gray3)' }}>{t.joined}</span>
//                   </td>
//                   <td style={{ padding: '13px 18px', textAlign: 'right' }}>
//                     <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 4, background: `${STATUS_COLORS[t.status] || '#888'}12`, color: STATUS_COLORS[t.status] || 'var(--gray2)', border: `1px solid ${STATUS_COLORS[t.status] || '#888'}30` }}>
//                       {t.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div style={{ padding: '13px 18px', borderTop: '1px solid var(--border)', background: 'var(--deep)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray3)' }}>Showing top {filtered.length} traders</span>
//             <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray3)' }}>2,418 total registered</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'
// src/app/traders/page.tsx — real data from /api/leaderboard
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'

const flagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'var(--green)', KYC_PENDING: 'var(--gold)', DISQUALIFIED: 'var(--red)', ELIMINATED: 'var(--gray3)',
}

export default function TradersPage() {
  const [traders, setTraders]   = useState<any[]>([])
  const [stats, setStats]       = useState<any>(null)
  const [search, setSearch]     = useState('')
  const [sortBy, setSortBy]     = useState<'rank' | 'name' | 'trades'>('rank')
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(0)
  const PER_PAGE = 50

  const load = async (p = 1, sort = sortBy) => {
    setLoading(true)
    const params = new URLSearchParams({ limit: String(PER_PAGE), offset: String((p - 1) * PER_PAGE) })
    if (search) params.set('search', search)
    const [lbRes, statsRes] = await Promise.all([
      fetch(`/api/leaderboard?${params}`).then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/stats').then(r => r.json()).catch(() => ({})),
    ])
    setTraders(lbRes.entries || [])
    setTotal(lbRes.total || 0)
    if (statsRes.traders) setStats(statsRes)
    setLoading(false)
  }

  useEffect(() => { load(1, sortBy) }, [])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); load(1) }

  const sorted = [...traders].sort((a, b) => {
    if (sortBy === 'name') return (a.trader?.displayName || '').localeCompare(b.trader?.displayName || '')
    if (sortBy === 'trades') return (b.totalTrades || 0) - (a.totalTrades || 0)
    return (a.rank || 99999) - (b.rank || 99999)
  })

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 32px 80px' }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--neon)', marginBottom: 12 }}>Qualifier</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px,6vw,72px)', textTransform: 'uppercase', color: 'var(--white)', lineHeight: 0.95, margin: '0 0 20px' }}>
            All <span className="text-shimmer">Traders</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--gray2)', maxWidth: 520 }}>
            {stats ? `${stats.traders?.total?.toLocaleString() || '—'} traders registered from ${stats.countries?.withTraders || '—'} countries. One qualifier spot per nation.` : 'Loading tournament stats…'}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Registered',    value: stats?.traders?.total?.toLocaleString() || '—' },
            { label: 'Countries',     value: stats?.countries?.withTraders || '—' },
            { label: 'Active Traders',value: stats?.traders?.active?.toLocaleString() || '—' },
            { label: 'KYC Pending',   value: stats?.traders?.kycPending?.toLocaleString() || '—' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: 'var(--white)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gray3)', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <input className="input-field" placeholder="🔍  Search by name or country..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 220 }} />
          <button type="submit" style={{ padding: '9px 18px', borderRadius: 7, background: 'var(--neon)', color: 'var(--black)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, border: 'none', cursor: 'pointer' }}>Search</button>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['rank', 'name', 'trades'] as const).map(s => (
              <button key={s} type="button" onClick={() => { setSortBy(s) }} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '9px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', background: sortBy === s ? 'var(--neon)' : 'var(--surface)', color: sortBy === s ? 'var(--black)' : 'var(--gray2)', transition: 'all 0.15s' }}>
                {s}
              </button>
            ))}
          </div>
        </form>

        {/* Table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray3)', fontFamily: 'var(--font-display)', fontSize: 13 }}>Loading traders…</div>
          ) : sorted.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray3)', fontFamily: 'var(--font-display)', fontSize: 13 }}>No traders found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--deep)' }}>
                  {['Rank', 'Trader', 'Country', 'Return', 'Max DD', 'Trades', 'Status'].map((h, i) => (
                    <th key={h} style={{ padding: '13px 18px', textAlign: i > 2 ? 'right' : 'left', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray3)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((e: any) => {
                  const t = e.trader || {}
                  const cc = t.country?.code || ''
                  const rank = e.rank || '—'
                  return (
                    <tr key={e.id} className="tr-hover">
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: rank === 1 ? 'var(--gold)' : rank === 2 ? '#c0d0e0' : rank === 3 ? '#cd7040' : 'var(--gray3)' }}>
                          {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : `#${rank}`}
                        </span>
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--white)' }}>{t.displayName || '—'}</span>
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {cc && <div style={{ width: 22, height: 15, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}><img src={flagUrl(cc)} alt={cc} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>}
                          <span style={{ fontSize: 13, color: 'var(--gray2)' }}>{t.country?.name || '—'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px', textAlign: 'right' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: (e.returnPct || 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          {e.returnPct != null ? `${e.returnPct >= 0 ? '+' : ''}${e.returnPct.toFixed(2)}%` : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '13px 18px', textAlign: 'right' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: (e.maxDrawdown || 0) > 6 ? 'var(--red)' : 'var(--gray2)' }}>
                          {e.maxDrawdown != null ? `${e.maxDrawdown.toFixed(1)}%` : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '13px 18px', textAlign: 'right' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gray2)' }}>{e.totalTrades ?? '—'}</span>
                      </td>
                      <td style={{ padding: '13px 18px', textAlign: 'right' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 4, background: `${STATUS_COLORS[t.status] || '#888'}12`, color: STATUS_COLORS[t.status] || 'var(--gray2)', border: `1px solid ${STATUS_COLORS[t.status] || '#888'}30` }}>
                          {t.status || '—'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          <div style={{ padding: '13px 18px', borderTop: '1px solid var(--border)', background: 'var(--deep)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray3)' }}>Showing {sorted.length} of {total} traders</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {page > 1 && <button onClick={() => { setPage(p => p - 1); load(page - 1) }} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid var(--border2)', background: 'transparent', color: 'var(--gray2)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>← Prev</button>}
              {sorted.length === PER_PAGE && <button onClick={() => { setPage(p => p + 1); load(page + 1) }} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid var(--border2)', background: 'transparent', color: 'var(--gray2)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Next →</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
