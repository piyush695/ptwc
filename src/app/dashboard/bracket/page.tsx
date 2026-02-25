'use client'
// src/app/dashboard/bracket/page.tsx
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const TRADER = { displayName:'AlphaTrader', country:'United Arab Emirates', countryCode:'AE', status:'ACTIVE', kycStatus:'APPROVED', rank:3, returnPct:14.82 }
const flagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`

const MY_MATCHES = [
  { round:'Qualifier',   opponent:null,         oppCC:null,  myRet:'+14.82%', oppRet:null,   status:'ACTIVE',    start:'Jun 1',  end:'Jun 12', result:null       },
  { round:'Round of 32', opponent:'BrazilFX',   oppCC:'BR',  myRet:null,      oppRet:null,   status:'UPCOMING',  start:'Jun 15', end:'Jun 21', result:null       },
  { round:'Round of 16', opponent:'TBD',        oppCC:null,  myRet:null,      oppRet:null,   status:'LOCKED',    start:'Jun 22', end:'Jun 28', result:null       },
  { round:'Quarters',    opponent:'TBD',        oppCC:null,  myRet:null,      oppRet:null,   status:'LOCKED',    start:'Jun 29', end:'Jul 5',  result:null       },
  { round:'Semis',       opponent:'TBD',        oppCC:null,  myRet:null,      oppRet:null,   status:'LOCKED',    start:'Jul 6',  end:'Jul 10', result:null       },
  { round:'Grand Final', opponent:'TBD',        oppCC:null,  myRet:null,      oppRet:null,   status:'LOCKED',    start:'Jul 18', end:'Jul 18', result:null       },
]

const statusCfg: Record<string,(typeof MY_MATCHES)[0]['status'], any> = {
  ACTIVE:   { color:'var(--neon)',  bg:'rgba(0,212,255,0.1)',  label:'ACTIVE'   },
  UPCOMING: { color:'var(--gold)',  bg:'rgba(240,192,64,0.1)', label:'UPCOMING' },
  LOCKED:   { color:'var(--gray3)', bg:'rgba(74,85,128,0.15)', label:'LOCKED'   },
  WIN:      { color:'var(--green)', bg:'rgba(0,230,118,0.1)',  label:'WON'      },
  LOSS:     { color:'var(--red)',   bg:'rgba(255,56,96,0.1)',  label:'LOST'     },
}

export default function BracketPage() {
  return (
    <DashboardLayout trader={TRADER}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--neon)', marginBottom:8 }}>Tournament</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:36, color:'var(--white)', lineHeight:1 }}>My Bracket</h1>
      </div>

      {/* Current match card */}
      <div style={{ background:'var(--surface)', border:'1px solid rgba(0,212,255,0.3)', borderRadius:14, padding:28, marginBottom:24, position:'relative', overflow:'hidden', boxShadow:'0 0 40px rgba(0,212,255,0.06)' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,var(--neon),transparent)' }} />
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <span className="live-dot" />
          <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--neon)' }}>ACTIVE — OPEN QUALIFIER · Jun 1–12</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:20, alignItems:'center' }}>
          {/* Your side */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <div style={{ width:48, height:32, borderRadius:5, overflow:'hidden', border:'2px solid var(--neon)', boxShadow:'0 0 16px rgba(0,212,255,0.4)', flexShrink:0 }}>
                <img src={flagUrl('AE')} alt="UAE" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              </div>
              <div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:22, color:'var(--neon)' }}>AlphaTrader</div>
                <div style={{ fontSize:12, color:'var(--gray3)' }}>United Arab Emirates · #3 Global</div>
              </div>
            </div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:40, color:'var(--green)' }}>+14.82%</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gray3)', marginTop:4 }}>Net Return · 34 trades</div>
          </div>
          {/* VS */}
          <div style={{ textAlign:'center', padding:'0 20px' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:20, color:'var(--gold)', letterSpacing:'0.1em', marginBottom:8 }}>QUALIFIER</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray3)', marginBottom:4 }}>4 days remaining</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray3)' }}>Top scorer per country advances</div>
          </div>
          {/* Goal */}
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:22, color:'var(--white)', marginBottom:8 }}>Objective</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, color:'var(--gray2)', lineHeight:1.6 }}>
              Finish with the highest<br />net return % in UAE.<br />Min 10 trades required.
            </div>
            <div style={{ marginTop:12, display:'flex', justifyContent:'flex-end', gap:8 }}>
              <div style={{ background:'rgba(0,230,118,0.1)', border:'1px solid rgba(0,230,118,0.25)', borderRadius:6, padding:'6px 12px' }}>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, color:'var(--green)' }}>✓ 34/10 trades met</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full journey timeline */}
      <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:18, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--white)', marginBottom:16 }}>
        Tournament Journey
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {MY_MATCHES.map((m, i) => {
          const cfg = statusCfg[m.status] || statusCfg.LOCKED
          return (
            <div key={i} style={{ background:'var(--surface)', border:`1px solid ${m.status==='ACTIVE' ? 'rgba(0,212,255,0.25)' : 'var(--border)'}`, borderRadius:12, padding:'20px 24px', display:'flex', alignItems:'center', gap:20, opacity: m.status==='LOCKED' ? 0.5 : 1 }}>
              {/* Round badge */}
              <div style={{ width:90, flexShrink:0 }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gray3)', marginBottom:4 }}>Round</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:14, color:'var(--white)' }}>{m.round}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--gray3)', marginTop:2 }}>{m.start}{m.end !== m.start ? ` – ${m.end}` : ''}</div>
              </div>

              <div style={{ width:1, height:40, background:'var(--border)' }} />

              {/* Player vs opponent */}
              <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:16, alignItems:'center' }}>
                {/* Me */}
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:28, height:19, borderRadius:3, overflow:'hidden', flexShrink:0 }}>
                    <img src={flagUrl('AE')} alt="AE" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, color:'var(--neon)' }}>AlphaTrader</div>
                    {m.myRet && <div style={{ fontFamily:'var(--font-mono)', fontWeight:700, fontSize:13, color:'var(--green)' }}>{m.myRet}</div>}
                  </div>
                </div>
                {/* VS */}
                <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:14, color:'var(--gray3)', letterSpacing:'0.05em' }}>VS</div>
                {/* Opponent */}
                <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'flex-end' }}>
                  {m.opponent && m.opponent !== 'TBD' ? (
                    <>
                      <div>
                        <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, color:'var(--gray1)', textAlign:'right' }}>{m.opponent}</div>
                        {m.oppRet && <div style={{ fontFamily:'var(--font-mono)', fontWeight:700, fontSize:13, color:'var(--green)', textAlign:'right' }}>{m.oppRet}</div>}
                      </div>
                      {m.oppCC && (
                        <div style={{ width:28, height:19, borderRadius:3, overflow:'hidden', flexShrink:0 }}>
                          <img src={flagUrl(m.oppCC)} alt={m.oppCC} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:13, color:'var(--gray3)' }}>
                      {m.status === 'LOCKED' ? '🔒 Locked' : 'TBD'}
                    </div>
                  )}
                </div>
              </div>

              {/* Status pill */}
              <div style={{ flexShrink:0 }}>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', padding:'5px 12px', borderRadius:6, color:cfg.color, background:cfg.bg, border:`1px solid ${cfg.color}30` }}>
                  {cfg.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
