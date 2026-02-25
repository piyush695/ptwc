'use client'
// src/app/bracket/page.tsx
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'

// Mock bracket data
const TRADERS = [
  { id:'t1', name:'AlphaTrader', country:'🇦🇪', cc:'AE', seed:1, status:'active' },
  { id:'t2', name:'NightFX',     country:'🇳🇬', cc:'NG', seed:2, status:'active' },
  { id:'t3', name:'GoldenPip',   country:'🇮🇳', cc:'IN', seed:3, status:'won'    },
  { id:'t4', name:'WaveRider',   country:'🇬🇧', cc:'GB', seed:4, status:'lost'   },
  { id:'t5', name:'StrikeFX',    country:'🇿🇦', cc:'ZA', seed:5, status:'active' },
  { id:'t6', name:'DeltaEdge',   country:'🇲🇾', cc:'MY', seed:6, status:'active' },
  { id:'t7', name:'PhoenixFX',   country:'🇵🇰', cc:'PK', seed:7, status:'won'    },
  { id:'t8', name:'ZeroLoss',    country:'🇰🇪', cc:'KE', seed:8, status:'lost'   },
]

interface MatchSlot { trader?: typeof TRADERS[0]; tbd?: boolean; winner?: boolean; loser?: boolean; ret?: string }
interface BracketMatch { id: string; t1: MatchSlot; t2: MatchSlot; live?: boolean; done?: boolean }

const ROUNDS: { label: string; matches: BracketMatch[] }[] = [
  {
    label: 'Round of 32',
    matches: [
      { id:'r32-1', t1:{trader:TRADERS[0],ret:'+14.2%'}, t2:{trader:TRADERS[7],ret:'+8.1%',loser:true}, done:true },
      { id:'r32-2', t1:{trader:TRADERS[1],ret:'+12.8%'}, t2:{trader:TRADERS[6],ret:'+11.4%',loser:true}, done:true },
      { id:'r32-3', t1:{trader:TRADERS[2],ret:'+9.2%',winner:true}, t2:{trader:TRADERS[5],ret:'+7.3%',loser:true}, done:true },
      { id:'r32-4', t1:{trader:TRADERS[3],ret:'+18.6%'}, t2:{trader:TRADERS[4],ret:'+6.1%',loser:true}, live:true },
    ],
  },
  {
    label: 'Round of 16',
    matches: [
      { id:'r16-1', t1:{trader:TRADERS[0]}, t2:{trader:TRADERS[1]}, live:true },
      { id:'r16-2', t1:{trader:TRADERS[2]}, t2:{tbd:true}, done:false },
    ],
  },
  {
    label: 'Quarterfinals',
    matches: [
      { id:'qf-1', t1:{tbd:true}, t2:{tbd:true} },
    ],
  },
  {
    label: 'Semifinals',
    matches: [
      { id:'sf-1', t1:{tbd:true}, t2:{tbd:true} },
    ],
  },
  {
    label: '🏆 Grand Final',
    matches: [
      { id:'gf-1', t1:{tbd:true}, t2:{tbd:true} },
    ],
  },
]

function MatchCard({ match }: { match: BracketMatch }) {
  const Slot = ({ slot }: { slot: MatchSlot }) => {
    if (slot.tbd) {
      return (
        <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.3 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--gray3)' }}>?</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--gray3)', letterSpacing: '0.05em' }}>TBD</span>
        </div>
      )
    }
    const t = slot.trader!
    return (
      <div style={{
        padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
        background: slot.winner ? 'rgba(0,230,118,0.06)' : slot.loser ? 'transparent' : 'transparent',
        opacity: slot.loser ? 0.35 : 1,
        transition: 'background 0.2s',
      }}>
        <span style={{ fontSize: 18 }}>{t.country}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: slot.winner ? 'var(--green)' : 'var(--white)', letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {t.name}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gray3)' }}>{t.cc} · #{t.seed}</div>
        </div>
        {slot.ret && (
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: slot.winner ? 'var(--green)' : slot.loser ? 'var(--red)' : 'var(--gray1)', flexShrink: 0 }}>
            {slot.ret}
          </div>
        )}
        {slot.winner && <span style={{ color: 'var(--green)', fontSize: 12 }}>✓</span>}
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${match.live ? 'rgba(0,212,255,0.4)' : match.done ? 'var(--border)' : 'var(--border)'}`,
      borderRadius: 10, overflow: 'hidden', minWidth: 220,
      boxShadow: match.live ? '0 0 20px rgba(0,212,255,0.12)' : 'none',
      transition: 'border-color 0.2s',
    }}>
      {match.live && (
        <div style={{ background: 'rgba(0,212,255,0.08)', borderBottom: '1px solid rgba(0,212,255,0.2)', padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="live-dot" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--neon)' }}>LIVE</span>
        </div>
      )}
      <div style={{ borderBottom: '1px solid var(--border)' }}><Slot slot={match.t1} /></div>
      <Slot slot={match.t2} />
    </div>
  )
}

export default function BracketPage() {
  const [activeRound, setActiveRound] = useState(0)

  const liveMatches = ROUNDS[0].matches.filter(m => m.live)

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div style={{ paddingTop: 64, background: 'var(--deep)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px 0' }}>
          <div className="section-label" style={{ marginBottom: 10 }}>Tournament</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 64px)', color: 'var(--white)', marginBottom: 8 }}>
            H2H Bracket
          </h1>
          <p style={{ color: 'var(--gray2)', fontSize: 15, marginBottom: 32 }}>
            Head-to-head elimination · Highest % return each week advances
          </p>

          {/* Round tabs */}
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 0 }}>
            {ROUNDS.map((r, i) => (
              <button key={r.label} onClick={() => setActiveRound(i)} style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '12px 20px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                background: 'transparent',
                color: activeRound === i ? 'var(--neon)' : 'var(--gray2)',
                borderBottom: `2px solid ${activeRound === i ? 'var(--neon)' : 'transparent'}`,
                transition: 'all 0.2s',
              }}>
                {r.label}
                {i === 0 && <span className="badge badge-red" style={{ marginLeft: 8 }}>LIVE</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 24px' }}>

        {/* Live matches highlight */}
        {activeRound === 0 && liveMatches.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span className="live-dot" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--white)' }}>
                Live Right Now
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(360px,1fr))', gap: 16 }}>
              {liveMatches.map(match => {
                const t1 = match.t1.trader!
                const t2 = match.t2.trader!
                const ret1 = parseFloat(match.t1.ret?.replace('%','') || '0')
                const ret2 = parseFloat(match.t2.ret?.replace('%','') || '0')
                return (
                  <div key={match.id} className="card-glow" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--neon), transparent)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                      <span className="live-dot" />
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: '0.15em', color: 'var(--neon)' }}>ROUND OF 32 — LIVE MATCH</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
                      {/* T1 */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 40, marginBottom: 6 }}>{t1.country}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: 'var(--white)', marginBottom: 2 }}>{t1.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray2)', marginBottom: 12 }}>{t1.cc}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 30, color: ret1 > ret2 ? 'var(--green)' : 'var(--red)' }}>
                          {match.t1.ret}
                        </div>
                        {ret1 > ret2 && <div style={{ marginTop: 6 }}><span className="badge badge-green">Leading</span></div>}
                      </div>

                      {/* VS */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--gold)', letterSpacing: '0.1em' }}>VS</div>
                        <div style={{ width: 1, height: 40, background: 'var(--border2)', margin: '8px auto' }} />
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gray3)' }}>ENDS<br />FRI</div>
                      </div>

                      {/* T2 */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 40, marginBottom: 6 }}>{t2.country}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: 'var(--white)', marginBottom: 2 }}>{t2.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray2)', marginBottom: 12 }}>{t2.cc}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 30, color: ret2 > ret1 ? 'var(--green)' : 'var(--red)' }}>
                          {match.t2.ret}
                        </div>
                        {ret2 > ret1 && <div style={{ marginTop: 6 }}><span className="badge badge-green">Leading</span></div>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Bracket matches grid */}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--white)', marginBottom: 24 }}>
            {ROUNDS[activeRound].label}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
            {ROUNDS[activeRound].matches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>

        {/* Info bar */}
        <div style={{ marginTop: 48, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray2)' }}>
            Scoring
          </div>
          {[
            ['Primary', 'Net % Return'],
            ['Tiebreaker 1', 'Lower Max Drawdown'],
            ['Tiebreaker 2', 'More Trades'],
            ['Min Trades', '10 per round'],
            ['Round Duration', '5 days (Mon–Fri)'],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--gray3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}:</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--white)' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
