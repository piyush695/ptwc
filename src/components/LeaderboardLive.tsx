'use client'

import { useEffect, useMemo, useState } from 'react'

type ApiRow = {
  traderId: string
  accountId: string
  displayName: string
  firstName?: string | null
  lastName?: string | null
  country: string
  phase: string
  status: string
  openingBalance?: number | null
  currentEquity?: number | null
  currentBalance?: number | null
  pnl?: number | null
  maxDrawdown?: number | null
  totalTrades?: number | null
  lastSyncAt?: string | null
  updatedAt?: string | null
}

type ApiResponse = {
  phase: string
  rows: ApiRow[]
  serverTime?: string
}

type Entry = {
  rank: number
  traderId: string
  accountId: string
  displayName: string
  country: string
  pnl: number
  maxDrawdown: number
  totalTrades: number
  currentBalance: number | null
  status: string
}

function safeNum(v: any, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

export default function LeaderboardLive() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<ApiRow[]>([])
  const [serverTime, setServerTime] = useState<string | null>(null)

  // Poll every 10s (change to 60_000 for 60 seconds)
  const POLL_MS = 10_000

  async function fetchBoard() {
    try {
      setError(null)
      const res = await fetch('/api/leaderboard?limit=50', { cache: 'no-store' })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = (await res.json()) as ApiResponse
      setRows(Array.isArray(data.rows) ? data.rows : [])
      setServerTime(data.serverTime ?? null)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBoard()
    const iv = setInterval(fetchBoard, POLL_MS)
    return () => clearInterval(iv)
  }, [])

  // Ranking rule:
  // 1) Higher PnL first
  // 2) If tie, LOWER maxDrawdown wins
  const entries: Entry[] = useMemo(() => {
    const mapped: Entry[] = rows.map((r) => ({
      rank: 0,
      traderId: r.traderId,
      accountId: r.accountId,
      displayName: r.displayName || `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim() || r.traderId,
      country: r.country || '—',
      pnl: safeNum(r.pnl, 0),
      maxDrawdown: safeNum(r.maxDrawdown, 0),
      totalTrades: safeNum(r.totalTrades, 0),
      currentBalance: r.currentBalance ?? null,
      status: r.status || 'ACTIVE',
    }))

    mapped.sort((a, b) => {
      const pnlDiff = b.pnl - a.pnl
      if (pnlDiff !== 0) return pnlDiff
      // tie-breaker: lower drawdown wins
      return a.maxDrawdown - b.maxDrawdown
    })

    return mapped.map((e, i) => ({ ...e, rank: i + 1 }))
  }, [rows])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <div className="text-lg font-semibold">Loading leaderboard…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="text-xs tracking-[0.2em] uppercase text-gray-400">Live</div>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-2">Leaderboard</h1>
            <p className="text-gray-400 mt-2">
              Ranked by <span className="text-white font-semibold">PnL</span>, tie-break by{' '}
              <span className="text-white font-semibold">lower drawdown</span>.
            </p>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3 text-sm">
            <div className="text-gray-400">Server time</div>
            <div className="font-mono text-white">{serverTime ?? '—'}</div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-xl border border-gray-800">
          <div className="grid grid-cols-12 bg-gray-900/60 text-xs uppercase tracking-[0.18em] text-gray-400 px-4 py-3">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Trader</div>
            <div className="col-span-2">Country</div>
            <div className="col-span-2 text-right">PnL</div>
            <div className="col-span-2 text-right">Max DD</div>
            <div className="col-span-1 text-right">Trades</div>
          </div>

          {entries.map((e) => (
            <div
              key={e.traderId + e.accountId}
              className="grid grid-cols-12 px-4 py-4 border-t border-gray-900 hover:bg-gray-900/40 transition"
            >
              <div className="col-span-1 font-bold text-gray-300">{e.rank}</div>
              <div className="col-span-4 font-semibold">{e.displayName}</div>
              <div className="col-span-2 text-gray-300">{e.country}</div>

              <div className="col-span-2 text-right font-mono">
                {e.pnl >= 0 ? (
                  <span className="text-emerald-300">+{e.pnl.toFixed(2)}</span>
                ) : (
                  <span className="text-rose-300">{e.pnl.toFixed(2)}</span>
                )}
              </div>

              <div className="col-span-2 text-right font-mono text-gray-200">
                {e.maxDrawdown.toFixed(2)}%
              </div>

              <div className="col-span-1 text-right font-mono text-gray-200">{e.totalTrades}</div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="px-4 py-10 text-gray-400">No leaderboard rows yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
