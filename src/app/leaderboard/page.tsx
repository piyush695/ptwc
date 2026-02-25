'use client'

// src/app/leaderboard/page.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/layout/Navbar'

type ApiRow = {
  traderId: string
  accountId: string
  displayName?: string | null
  firstName?: string | null
  lastName?: string | null
  country?: string | null
  phase?: string | null
  status?: string | null
  openingBalance?: number | null
  currentEquity?: number | null
  currentBalance?: number | null
  pnl?: number | null
  maxDrawdown?: number | null
  totalTrades?: number | null
  updatedAt?: string | null
}

type ApiResponse = {
  phase: string
  rows: ApiRow[]
  serverTime?: string
}

interface Entry {
  rank: number
  traderId: string
  accountId: string
  displayName: string
  country: { name: string; flag: string }
  returnPct: number // using pnl here (as requested primary = PnL)
  maxDrawdown: number
  totalTrades: number
  winRate: number
  qualified: boolean
  currentBalance: number | null
  status: string
}

function safeNum(v: any, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

// Optional: simple fallback flag when API doesn't send code/flag
function flagFallback(countryName: string) {
  if (!countryName) return '🏳️'
  const c = countryName.toLowerCase()
  if (c.includes('united arab emirates') || c === 'uae') return '🇦🇪'
  if (c.includes('india')) return '🇮🇳'
  if (c.includes('nigeria')) return '🇳🇬'
  if (c.includes('pakistan')) return '🇵🇰'
  if (c.includes('saudi')) return '🇸🇦'
  if (c.includes('united kingdom') || c === 'uk') return '🇬🇧'
  return '🏳️'
}

export default function Page() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [search, setSearch] = useState('')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [pulse, setPulse] = useState(false)
  const [serverTime, setServerTime] = useState<string | null>(null)

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch('/api/leaderboard?limit=50', { cache: 'no-store' })
      if (!res.ok) throw new Error(`Leaderboard API failed: ${res.status}`)
      const json = (await res.json()) as ApiResponse

      setServerTime(json.serverTime ?? null)

      const rows = Array.isArray(json.rows) ? json.rows : []

      // Map API -> Entry
      const mapped: Entry[] = rows.map((r) => {
        const name =
          (r.displayName ?? '').trim() ||
          `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim() ||
          r.traderId

        const countryName = (r.country ?? '—').toString()
        const code = '' // API currently returns country name only

        return {
          rank: 0,
          traderId: r.traderId,
          accountId: r.accountId,
          displayName: name,
          country: {
            code,
            name: countryName,
            flag: flagFallback(countryName),
          },
          // Primary = PnL
          returnPct: safeNum(r.pnl, 0),
          // Tie breaker = drawdown (lower better)
          maxDrawdown: safeNum(r.maxDrawdown, 0),
          totalTrades: safeNum(r.totalTrades, 0),
          winRate: 0,
          qualified: false,
          currentBalance: r.currentBalance == null ? null : safeNum(r.currentBalance, 0),
          status: (r.status ?? 'ACTIVE').toString(),
        }
      })

      // Sort: PnL DESC, Drawdown ASC
      mapped.sort((a, b) => {
        if (b.returnPct !== a.returnPct) return b.returnPct - a.returnPct
        if (a.maxDrawdown !== b.maxDrawdown) return a.maxDrawdown - b.maxDrawdown
        return 0
      })

      const ranked = mapped.map((e, i) => ({ ...e, rank: i + 1 }))

      setEntries(ranked)
      setLastUpdated(new Date())
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
    } catch (err) {
      console.error(err)
      // keep last good state; just don't crash the page
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard()
    const iv = setInterval(fetchLeaderboard, 10_000) // 10s poll
    return () => clearInterval(iv)
  }, [fetchLeaderboard])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      (e) =>
        e.displayName.toLowerCase().includes(q) ||
        e.country.name.toLowerCase().includes(q) ||
        e.country.code.toLowerCase().includes(q)
    )
  }, [entries, search])

  const top3 = filtered.slice(0, 3)
  const rest = filtered.slice(3)

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div style={{ paddingTop: 64, background: 'var(--deep)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 10 }}>Live Rankings</div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 64px)', color: 'var(--white)', lineHeight: 1 }}>
                Qualifier Leaderboard
              </h1>
              <p style={{ color: 'var(--gray2)', marginTop: 8, fontSize: 15 }}>
                Ranked by PnL · Tie-break by lower drawdown · Updated every 10 seconds
              </p>
              {serverTime && (
                <p style={{ color: 'var(--gray3)', marginTop: 6, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                  Server: {serverTime}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 10, padding: '10px 16px' }}>
              <span className="live-dot" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray2)' }}>
                {lastUpdated.toLocaleTimeString()}
              </span>
              <span style={{ color: 'var(--border2)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: pulse ? 'var(--neon)' : 'var(--gray3)', transition: 'color 0.3s' }}>LIVE</span>
            </div>
          </div>

          {/* Summary stats */}
          <div style={{ display: 'flex', gap: 32, marginTop: 32, flexWrap: 'wrap' }}>
            {[
              { label: 'Active Traders', value: entries.length.toLocaleString() },
              { label: 'Countries', value: new Set(entries.map((e) => e.country.name)).size },
              {
                label: 'Avg PnL',
                value:
                  entries.length > 0
                    ? `${(entries.reduce((s, e) => s + e.returnPct, 0) / entries.length).toFixed(2)}`
                    : '0.00',
              },
              { label: 'Top PnL', value: entries[0] ? `${entries[0].returnPct.toFixed(2)}` : '0.00' },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: 'var(--white)' }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gray3)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        {/* Search */}
        <div style={{ marginBottom: 32 }}>
          <input
            className="input-field"
            placeholder="🔍  Search by trader name or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 440 }}
          />
        </div>

        {/* Top 3 podium */}
        {!search && top3.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 40 }}>
            {top3.map((e, i) => (
              <div
                key={e.traderId + e.accountId}
                style={{
                  background: i === 0 ? 'rgba(240,192,64,0.06)' : 'var(--surface)',
                  border: `1px solid ${
                    i === 0 ? 'rgba(240,192,64,0.3)' : i === 1 ? 'rgba(192,208,224,0.2)' : 'rgba(205,128,80,0.2)'
                  }`,
                  borderRadius: 14,
                  padding: '28px 24px',
                  boxShadow: i === 0 ? '0 0 40px rgba(240,192,64,0.1)' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {i === 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                    }}
                  />
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 28,
                      fontWeight: 900,
                      ...(i === 0 ? { color: 'var(--gold)' } : i === 1 ? { color: '#c0d0e0' } : { color: '#cd7040' }),
                    }}
                  >
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
  <img
    src={e.country.flag}
    alt={e.country.name}
    style={{ width: 28, height: 20, borderRadius: 4, objectFit: 'cover' }}
  />
  <div style={{ fontSize: 12, color: 'var(--gray2)' }}>{e.country.name}</div>
</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 28, color: e.returnPct >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {e.returnPct >= 0 ? '+' : ''}
                  {e.returnPct.toFixed(2)}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray3)', marginTop: 2 }}>
                  PnL
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--red)' }}>{e.maxDrawdown.toFixed(1)}%</div>
                    <div style={{ fontSize: 10, color: 'var(--gray3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Max DD</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--white)' }}>{e.totalTrades}</div>
                    <div style={{ fontSize: 10, color: 'var(--gray3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trades</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 180px 110px 100px 90px 90px 100px',
              padding: '0 20px',
              borderBottom: '1px solid var(--border2)',
              background: 'var(--deep)',
            }}
          >
            {['#', 'Trader', 'Country', 'PnL', 'Balance', 'Max DD', 'Trades', 'Status'].map((h, i) => (
              <div
                key={h}
                style={{
                  padding: '14px 8px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--gray3)',
                  textAlign: i > 2 ? 'right' : 'left',
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {(search ? filtered : rest).map((e) => (
            <div
              key={e.traderId + e.accountId}
              className="tr-hover"
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 180px 110px 100px 90px 90px 100px',
                padding: '0 20px',
                alignItems: 'center',
              }}
            >
              {/* Rank */}
              <div style={{ padding: '16px 8px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: 18,
                    ...(e.rank === 1
                      ? { color: 'var(--gold)' }
                      : e.rank === 2
                      ? { color: '#c0d0e0' }
                      : e.rank === 3
                      ? { color: '#cd7040' }
                      : { color: 'var(--gray3)' }),
                  }}
                >
                  {e.rank}
                </span>
              </div>

              {/* Trader */}
              <div style={{ padding: '16px 8px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--white)' }}>{e.displayName}</div>
              </div>

              {/* Country */}
   <div style={{ padding: '16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
  <img
    src={e.country.flag}
    alt={e.country.name}
    style={{ width: 22, height: 16, borderRadius: 3, objectFit: 'cover' }}
  />
  <div style={{ fontSize: 13, color: 'var(--white)', fontWeight: 500 }}>
    {e.country.name}
  </div>
</div>

              {/* PnL */}
              <div style={{ padding: '16px 8px', textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 17, color: e.returnPct >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {e.returnPct >= 0 ? '+' : ''}
                  {e.returnPct.toFixed(2)}
                </div>
              </div>

              {/* Balance */}
              <div style={{ padding: '16px 8px', textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gray1)' }}>
                  ${e.currentBalance?.toLocaleString() ?? '—'}
                </div>
              </div>

              {/* Max DD */}
              <div style={{ padding: '16px 8px', textAlign: 'right' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    color: e.maxDrawdown > 8 ? 'var(--red)' : e.maxDrawdown > 5 ? 'var(--gold)' : 'var(--green)',
                  }}
                >
                  {e.maxDrawdown.toFixed(1)}%
                </div>
              </div>

              {/* Trades */}
              <div style={{ padding: '16px 8px', textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gray1)' }}>{e.totalTrades}</div>
              </div>

              {/* Status */}
              <div style={{ padding: '16px 8px', textAlign: 'right' }}>
                <span className="badge badge-neon">{e.status || 'ACTIVE'}</span>
              </div>
            </div>
          ))}

          {(search ? filtered : rest).length === 0 && (
            <div style={{ padding: '28px 20px', color: 'var(--gray3)' }}>No rows yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}