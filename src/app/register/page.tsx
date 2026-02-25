'use client'
// src/app/register/page.tsx
import { useState } from 'react'
import Link from 'next/link'

const COUNTRIES = [
  {code:'AE',name:'UAE',           region:'Middle East'   },
  {code:'AU',name:'Australia',     region:'Asia Pacific'  },
  {code:'BR',name:'Brazil',        region:'Latin America' },
  {code:'CA',name:'Canada',        region:'North America' },
  {code:'DE',name:'Germany',       region:'Europe'        },
  {code:'EG',name:'Egypt',         region:'Africa'        },
  {code:'FR',name:'France',        region:'Europe'        },
  {code:'GB',name:'United Kingdom',region:'Europe'        },
  {code:'GH',name:'Ghana',         region:'Africa'        },
  {code:'IN',name:'India',         region:'Asia Pacific'  },
  {code:'ID',name:'Indonesia',     region:'Asia Pacific'  },
  {code:'JP',name:'Japan',         region:'Asia Pacific'  },
  {code:'KE',name:'Kenya',         region:'Africa'        },
  {code:'KW',name:'Kuwait',        region:'Middle East'   },
  {code:'MY',name:'Malaysia',      region:'Asia Pacific'  },
  {code:'MX',name:'Mexico',        region:'Latin America' },
  {code:'NG',name:'Nigeria',       region:'Africa'        },
  {code:'PK',name:'Pakistan',      region:'Asia Pacific'  },
  {code:'PH',name:'Philippines',   region:'Asia Pacific'  },
  {code:'QA',name:'Qatar',         region:'Middle East'   },
  {code:'SA',name:'Saudi Arabia',  region:'Middle East'   },
  {code:'SG',name:'Singapore',     region:'Asia Pacific'  },
  {code:'ZA',name:'South Africa',  region:'Africa'        },
  {code:'TH',name:'Thailand',      region:'Asia Pacific'  },
  {code:'TR',name:'Turkey',        region:'Europe'        },
  {code:'TZ',name:'Tanzania',      region:'Africa'        },
  {code:'VN',name:'Vietnam',       region:'Asia Pacific'  },
  {code:'NL',name:'Netherlands',   region:'Europe'        },
  {code:'IT',name:'Italy',         region:'Europe'        },
  {code:'ES',name:'Spain',         region:'Europe'        },
  {code:'AR',name:'Argentina',     region:'Latin America' },
  {code:'RU',name:'Russia',        region:'Europe'        },
]

// Returns a real flag image URL from flagcdn.com — works on all browsers/OS
const flagUrl = (code: string) =>
  `https://flagcdn.com/w80/${code.toLowerCase()}.png`

const STEPS = ['Choose Country', 'Your Profile', 'Confirm']

export default function RegisterPage() {
  const [step, setStep]                   = useState(0)
  const [countryCode, setCountryCode]     = useState('')
  const [countrySearch, setCountrySearch] = useState('')
  const [form, setForm]                   = useState({ firstName:'', lastName:'', displayName:'', email:'', password:'', confirmPassword:'', referralCode:'' })
  const [agree1, setAgree1]               = useState(false)
  const [agree2, setAgree2]               = useState(false)
  const [error, setError]                 = useState('')
  const [loading, setLoading]             = useState(false)
  const [done, setDone]                   = useState(false)
  const [hoveredCode, setHoveredCode]     = useState('')

  const selected = COUNTRIES.find(c => c.code === countryCode)

  const filteredCountries = COUNTRIES.filter(c =>
    !countrySearch ||
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const f = (k: string, v: string) => { setForm(p => ({...p,[k]:v})); setError('') }

  const next = () => {
    if (step === 0 && !countryCode) return setError('Please select your country')
    if (step === 1) {
      if (!form.firstName || !form.lastName)      return setError('Enter your full name')
      if (!form.email.includes('@'))              return setError('Enter a valid email')
      if (form.password.length < 8)              return setError('Password must be 8+ characters')
      if (!/[A-Z]/.test(form.password))          return setError('Password must contain an uppercase letter')
      if (!/[0-9]/.test(form.password))          return setError('Password must contain a number')
      if (form.password !== form.confirmPassword) return setError('Passwords do not match')
      if (form.displayName.length < 3)           return setError('Display name must be 3+ characters')
    }
    setError('')
    setStep(s => s + 1)
  }

  const submit = async () => {
    if (!agree1) return setError('Please agree to the Terms & Conditions')
    if (!agree2) return setError('Please confirm you are 18+')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, countryCode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      setDone(true)
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }

  /* ── Success screen ─────────────────────────────────────────── */
  if (done) return (
    <div style={{ background:'var(--black)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ maxWidth:480, width:'100%', textAlign:'center' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(0,230,118,0.1)', border:'1px solid rgba(0,230,118,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 32px', boxShadow:'0 0 40px rgba(0,230,118,0.15)', fontSize:36 }}>✓</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:48, color:'var(--white)', marginBottom:12 }}>You're In!</h1>
        <p style={{ color:'var(--gray2)', marginBottom:24, fontSize:16, lineHeight:1.6 }}>Welcome to Hola Prime World Cup. Check your email for confirmation.</p>
        {selected && (
          <div className="card" style={{ display:'inline-block', padding:'28px 48px', marginBottom:32 }}>
            <img
              src={flagUrl(selected.code)} alt={selected.name}
              style={{ width:80, height:'auto', borderRadius:6, boxShadow:'0 0 20px rgba(0,212,255,0.3)', marginBottom:12, display:'block', margin:'0 auto 16px' }}
            />
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.2em', color:'var(--gray3)', textTransform:'uppercase', marginBottom:4 }}>Representing</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:24, color:'var(--gold)' }}>{selected.name}</div>
          </div>
        )}
        <Link href="/dashboard" className="btn-neon" style={{ display:'inline-flex' }}>Go to Dashboard →</Link>
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--black)', minHeight:'100vh', display:'flex' }}>

      {/* ── Left branding panel ──────────────────────────────────── */}
      <div className="reg-left-panel" style={{
        width:'40%', background:'var(--deep)', borderRight:'1px solid var(--border)',
        padding:'64px 48px', flexDirection:'column', justifyContent:'center',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:'-10%', right:'-10%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', filter:'blur(30px)' }} />
        <div style={{ position:'absolute', bottom:'-5%', left:'-5%', width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle, rgba(240,192,64,0.06) 0%, transparent 70%)', filter:'blur(20px)' }} />

        <Link href="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none', marginBottom:64 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:'var(--neon)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 16px rgba(0,212,255,0.5)', fontSize:18 }}>🏆</div>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:15, letterSpacing:'0.06em', color:'var(--white)' }}>HOLA PRIME</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.2em', color:'var(--neon)' }}>WORLD CUP</div>
          </div>
        </Link>

        <h2 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:52, color:'var(--white)', lineHeight:0.95, marginBottom:24, textTransform:'uppercase' }}>
          CLAIM<br />YOUR<br /><span className="text-shimmer">FLAG.</span>
        </h2>
        <p style={{ color:'var(--gray2)', fontSize:15, lineHeight:1.7, marginBottom:40, maxWidth:320 }}>
          One trader per country. Compete for $60,000 on a fully funded $10K account.
        </p>
        {['✅ Free entry — just pass KYC','✅ $10,000 funded account provided','✅ Trade qualifier your way','✅ H2H bracket from June 15','✅ Grand Final July 18, 2026'].map(t => (
          <div key={t} style={{ color:'var(--gray1)', fontSize:14, marginBottom:10 }}>{t}</div>
        ))}
      </div>

      {/* ── Right form panel ─────────────────────────────────────── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 48px', maxWidth:640, width:'100%', margin:'0 auto' }}>

        {/* Step indicator */}
        <div style={{ display:'flex', alignItems:'center', marginBottom:40 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : undefined }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                <div style={{
                  width:32, height:32, borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'var(--font-display)', fontWeight:900, fontSize:14,
                  background: i < step ? 'var(--green)' : i === step ? 'var(--neon)' : 'var(--surface2)',
                  color: i <= step ? 'var(--black)' : 'var(--gray3)',
                  boxShadow: i === step ? '0 0 14px rgba(0,212,255,0.5)' : 'none',
                  transition:'all 0.3s',
                }}>
                  {i < step ? '✓' : i+1}
                </div>
                <span style={{ fontFamily:'var(--font-display)', fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color: i === step ? 'var(--neon)' : 'var(--gray3)', whiteSpace:'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length-1 && (
                <div style={{ flex:1, height:1, background: i < step ? 'var(--green)' : 'var(--border2)', margin:'0 8px', marginBottom:20, transition:'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 0: Country selection ─────────────────────────── */}
        {step === 0 && (
          <div className="animate-fade-up">
            <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:40, color:'var(--white)', marginBottom:6, textTransform:'uppercase' }}>Choose Your Country</h1>
            <p style={{ color:'var(--gray2)', marginBottom:24, fontSize:15 }}>You will represent this nation in the tournament.</p>

            <input
              className="input-field"
              placeholder="🔍  Search country..."
              value={countrySearch}
              onChange={e => setCountrySearch(e.target.value)}
              style={{ marginBottom:20 }}
            />

            {/* ── FLAG GRID ──────────────────────────────────────── */}
            <div style={{
              display:'grid', gridTemplateColumns:'repeat(4, 1fr)',
              gap:10, maxHeight:420, overflowY:'auto', paddingRight:4,
            }}>
              {filteredCountries.map(c => {
                const isSelected = countryCode === c.code
                const isHovered  = hoveredCode  === c.code
                return (
                  <button
                    key={c.code}
                    onClick={() => { setCountryCode(c.code); setError('') }}
                    onMouseEnter={() => setHoveredCode(c.code)}
                    onMouseLeave={() => setHoveredCode('')}
                    style={{
                      display:'flex', flexDirection:'column',
                      alignItems:'center', justifyContent:'center',
                      gap:8, padding:'14px 8px',
                      background: isSelected
                        ? 'rgba(0,212,255,0.1)'
                        : isHovered ? 'var(--surface2)' : 'var(--surface)',
                      border:`1px solid ${isSelected
                        ? 'rgba(0,212,255,0.5)'
                        : isHovered ? 'var(--border2)' : 'var(--border)'}`,
                      borderRadius:10, cursor:'pointer',
                      boxShadow: isSelected ? '0 0 18px rgba(0,212,255,0.15)' : 'none',
                      transition:'all 0.15s ease',
                      transform: isSelected ? 'scale(1.04)' : isHovered ? 'scale(1.02)' : 'scale(1)',
                      position:'relative',
                    }}
                  >
                    {/* Selected checkmark badge */}
                    {isSelected && (
                      <div style={{
                        position:'absolute', top:6, right:6,
                        width:16, height:16, borderRadius:'50%',
                        background:'var(--neon)', display:'flex', alignItems:'center', justifyContent:'center',
                        boxShadow:'0 0 8px rgba(0,212,255,0.7)',
                      }}>
                        <span style={{ fontSize:9, color:'var(--black)', fontWeight:900, lineHeight:1 }}>✓</span>
                      </div>
                    )}

                    {/* ── REAL FLAG IMAGE ── */}
                    <div style={{
                      width:52, height:36, borderRadius:5, overflow:'hidden',
                      boxShadow: isSelected
                        ? '0 0 14px rgba(0,212,255,0.5), 0 2px 8px rgba(0,0,0,0.6)'
                        : '0 2px 6px rgba(0,0,0,0.5)',
                      border:`1px solid ${isSelected ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      flexShrink:0,
                      transition:'box-shadow 0.15s',
                    }}>
                      <img
                        src={flagUrl(c.code)}
                        alt={c.name}
                        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                        loading="lazy"
                      />
                    </div>

                    {/* Country name */}
                    <span style={{
                      fontFamily:'var(--font-display)',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize:10,
                      letterSpacing:'0.03em',
                      textTransform:'uppercase',
                      color: isSelected ? 'var(--neon)' : 'var(--gray2)',
                      textAlign:'center',
                      lineHeight:1.2,
                      transition:'color 0.15s',
                    }}>
                      {c.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Selected country preview bar */}
            {selected && (
              <div style={{
                marginTop:16, background:'rgba(0,212,255,0.05)',
                border:'1px solid rgba(0,212,255,0.2)', borderRadius:12,
                padding:'14px 20px', display:'flex', alignItems:'center', gap:16,
              }}>
                <div style={{ width:56, height:38, borderRadius:5, overflow:'hidden', flexShrink:0, border:'1px solid rgba(0,212,255,0.3)', boxShadow:'0 0 14px rgba(0,212,255,0.3)' }}>
                  <img src={flagUrl(selected.code)} alt={selected.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:18, color:'var(--white)' }}>
                    Representing {selected.name}
                  </div>
                  <div style={{ fontSize:12, color:'var(--gray3)', marginTop:2 }}>One spot per country · First come, first served</div>
                </div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:18, color:'var(--neon)', fontWeight:700 }}>{selected.code}</div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 1: Profile ───────────────────────────────────── */}
        {step === 1 && (
          <div className="animate-fade-up">
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
              {selected && (
                <div style={{ width:52, height:36, borderRadius:5, overflow:'hidden', border:'1px solid rgba(0,212,255,0.3)', boxShadow:'0 0 12px rgba(0,212,255,0.3)', flexShrink:0 }}>
                  <img src={flagUrl(selected.code)} alt={selected.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                </div>
              )}
              <div>
                <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:36, color:'var(--white)', lineHeight:1, textTransform:'uppercase' }}>Your Profile</h1>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:12, letterSpacing:'0.1em', color:'var(--neon)', marginTop:2 }}>
                  {selected?.name} · {selected?.code}
                </div>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:7 }}>First Name</label>
                  <input className="input-field" placeholder="Alex" value={form.firstName} onChange={e => f('firstName',e.target.value)} />
                </div>
                <div>
                  <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:7 }}>Last Name</label>
                  <input className="input-field" placeholder="Smith" value={form.lastName} onChange={e => f('lastName',e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:7 }}>
                  Display Name <span style={{ color:'var(--gray3)', fontSize:10, fontWeight:400, textTransform:'none', letterSpacing:0 }}>— shown on leaderboard</span>
                </label>
                <input className="input-field" placeholder="TraderAlex" value={form.displayName} onChange={e => f('displayName',e.target.value)} />
              </div>
              <div>
                <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:7 }}>Email</label>
                <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => f('email',e.target.value)} />
              </div>
              <div>
                <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:7 }}>Password</label>
                <input className="input-field" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" value={form.password} onChange={e => f('password',e.target.value)} />
              </div>
              <div>
                <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:7 }}>Confirm Password</label>
                <input className="input-field" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => f('confirmPassword',e.target.value)} />
              </div>
              <div>
                <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:7 }}>
                  Referral Code <span style={{ color:'var(--gray3)', fontSize:10, fontWeight:400, textTransform:'none', letterSpacing:0 }}>— optional</span>
                </label>
                <input className="input-field" placeholder="HP-XXXX" value={form.referralCode} onChange={e => f('referralCode',e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Confirm ───────────────────────────────────── */}
        {step === 2 && (
          <div className="animate-fade-up">
            <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:40, color:'var(--white)', marginBottom:8, textTransform:'uppercase' }}>Confirm & Enter</h1>
            <p style={{ color:'var(--gray2)', marginBottom:24, fontSize:15 }}>Review your details and accept the rules.</p>

            <div className="card" style={{ marginBottom:20 }}>
              {selected && (
                <div style={{ display:'flex', alignItems:'center', gap:16, paddingBottom:16, marginBottom:16, borderBottom:'1px solid var(--border)' }}>
                  <div style={{ width:64, height:44, borderRadius:6, overflow:'hidden', border:'1px solid rgba(0,212,255,0.3)', boxShadow:'0 0 14px rgba(0,212,255,0.25)', flexShrink:0 }}>
                    <img src={flagUrl(selected.code)} alt={selected.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gray3)' }}>Country</div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:22, color:'var(--white)' }}>{selected.name}</div>
                  </div>
                </div>
              )}
              {[['Display Name',form.displayName],['Email',form.email],['Name',`${form.firstName} ${form.lastName}`]].map(([label,val]) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gray3)' }}>{label}</span>
                  <span style={{ fontSize:14, color:'var(--gray1)' }}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:20 }}>
              <label style={{ display:'flex', alignItems:'flex-start', gap:12, cursor:'pointer' }}>
                <input type="checkbox" checked={agree1} onChange={e => setAgree1(e.target.checked)} style={{ marginTop:3, accentColor:'var(--neon)', width:16, height:16 }} />
                <span style={{ fontSize:13, color:'var(--gray2)', lineHeight:1.6 }}>
                  I have read and agree to the{' '}
                  <Link href="/terms" style={{ color:'var(--neon)', textDecoration:'none' }}>Terms & Conditions</Link>{' '}
                  and{' '}
                  <Link href="/rules" style={{ color:'var(--neon)', textDecoration:'none' }}>Tournament Rulebook</Link>
                </span>
              </label>
              <label style={{ display:'flex', alignItems:'flex-start', gap:12, cursor:'pointer' }}>
                <input type="checkbox" checked={agree2} onChange={e => setAgree2(e.target.checked)} style={{ marginTop:3, accentColor:'var(--neon)', width:16, height:16 }} />
                <span style={{ fontSize:13, color:'var(--gray2)', lineHeight:1.6 }}>I confirm I am 18+ and a resident of an eligible country</span>
              </label>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,56,96,0.08)', border:'1px solid rgba(255,56,96,0.25)', borderRadius:8, padding:'12px 16px', marginTop:16 }}>
            <span style={{ color:'var(--red)', fontSize:14 }}>⚠ {error}</span>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display:'flex', gap:12, marginTop:24 }}>
          {step > 0 && (
            <button onClick={() => setStep(s=>s-1)} className="btn-outline" style={{ flex:1 }}>← Back</button>
          )}
          {step < 2 ? (
            <button onClick={next} className="btn-neon" style={{ flex:2 }}>Continue →</button>
          ) : (
            <button onClick={submit} disabled={loading} className="btn-gold" style={{ flex:2, opacity:loading?0.6:1 }}>
              {loading ? 'Registering...' : '🏆 Complete Registration'}
            </button>
          )}
        </div>

        <p style={{ textAlign:'center', fontSize:13, color:'var(--gray3)', marginTop:20 }}>
          Already registered?{' '}
          <Link href="/login" style={{ color:'var(--neon)', textDecoration:'none' }}>Sign in →</Link>
        </p>
      </div>

      <style>{`
        .reg-left-panel { display: none; }
        @media (min-width: 900px) { .reg-left-panel { display: flex !important; } }
      `}</style>
    </div>
  )
}
