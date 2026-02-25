'use client'
// src/app/admin/config/page.tsx
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

const INITIAL = {
  phase: 'REGISTRATION',
  regDeadline: '2026-05-30',
  qualifierStart: '2026-06-01',
  qualifierEnd: '2026-06-12',
  grandFinal: '2026-07-18',
  prizePool: '100000',
  firstPrize: '60000',
  secondPrize: '25000',
  accountSize: '10000',
  leverage: '30',
  dailyDD: '8',
  totalDD: '12',
  minTrades: '10',
  maxPositionPct: '5',
  instruments: 'EURUSD,GBPUSD,USDJPY,XAUUSD,USOIL,US30,NAS100,GER40',
  registrationOpen: true,
}

export default function AdminConfigPage() {
  const [config, setConfig] = useState(INITIAL)
  const [saved, setSaved] = useState(false)
  const f = (k: string, v: string | boolean) => setConfig(p => ({...p,[k]:v}))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const Section = ({ title, icon, children }: any) => (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
      <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', background:'var(--deep)', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontSize:18 }}>{icon}</span>
        <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:15, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--white)' }}>{title}</span>
      </div>
      <div style={{ padding:24 }}>{children}</div>
    </div>
  )

  const Field = ({ label, note, children }: any) => (
    <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:20, alignItems:'center', paddingBottom:16, borderBottom:'1px solid var(--border)', marginBottom:16 }}>
      <div>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--white)' }}>{label}</div>
        {note && <div style={{ fontSize:12, color:'var(--gray3)', marginTop:3, lineHeight:1.4 }}>{note}</div>}
      </div>
      <div>{children}</div>
    </div>
  )

  return (
    <AdminLayout>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--neon)', marginBottom:8 }}>System</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:36, color:'var(--white)', lineHeight:1 }}>Tournament Config</h1>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            {saved && (
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(0,230,118,0.1)', border:'1px solid rgba(0,230,118,0.25)', borderRadius:8, padding:'10px 16px' }}>
                <span style={{ color:'var(--green)', fontSize:14 }}>✓</span>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:12, letterSpacing:'0.08em', color:'var(--green)' }}>SAVED</span>
              </div>
            )}
            <button onClick={handleSave} style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', padding:'12px 28px', borderRadius:8, border:'none', cursor:'pointer', background:'var(--neon)', color:'var(--black)', boxShadow:'0 0 20px rgba(0,212,255,0.35)' }}>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:800 }}>

        {/* Phase */}
        <Section title="Current Phase" icon="⚡">
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16 }}>
            {['REGISTRATION','QUALIFIER','ROUND_32','ROUND_16','QUARTERS','SEMIS','GRAND_FINAL'].map(p => (
              <button key={p} onClick={() => f('phase',p)} style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.08em', padding:'9px 16px', borderRadius:6, border:'none', cursor:'pointer', background: config.phase===p ? 'var(--neon)' : 'var(--deep)', color: config.phase===p ? 'var(--black)' : 'var(--gray2)', boxShadow: config.phase===p ? '0 0 14px rgba(0,212,255,0.35)' : 'none', transition:'all 0.15s' }}>
                {p.replace(/_/g,' ')}
              </button>
            ))}
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
            <input type="checkbox" checked={config.registrationOpen} onChange={e => f('registrationOpen',e.target.checked)} style={{ width:16, height:16, accentColor:'var(--neon)' }} />
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:13, color:'var(--gray1)' }}>Registration Open</span>
          </label>
        </Section>

        {/* Dates */}
        <Section title="Key Dates" icon="📅">
          {[
            ['Registration Deadline', 'regDeadline', 'Last day traders can register'],
            ['Qualifier Start',        'qualifierStart', ''],
            ['Qualifier End',          'qualifierEnd', ''],
            ['Grand Final Date',       'grandFinal', 'Live event date'],
          ].map(([label, key, note]) => (
            <Field key={key} label={label} note={note}>
              <input type="date" className="input-field" value={config[key as keyof typeof config] as string} onChange={e => f(key, e.target.value)} style={{ fontFamily:'var(--font-mono)', fontSize:14 }} />
            </Field>
          ))}
        </Section>

        {/* Prize pool */}
        <Section title="Prize Pool" icon="🏆">
          {[
            ['Total Prize Pool ($)', 'prizePool',   'USD · full prize pool amount'],
            ['1st Place ($)',         'firstPrize',  'Grand Champion prize'],
            ['2nd Place ($)',         'secondPrize', 'Runner up prize'],
          ].map(([label, key, note]) => (
            <Field key={key} label={label} note={note}>
              <input type="number" className="input-field" value={config[key as keyof typeof config] as string} onChange={e => f(key, e.target.value)} style={{ fontFamily:'var(--font-mono)', fontSize:14 }} />
            </Field>
          ))}
        </Section>

        {/* Trading rules */}
        <Section title="Trading Rules" icon="⚙">
          {[
            ['Account Size ($)',       'accountSize',    '$10,000 default'],
            ['Max Leverage',           'leverage',       '1:X — set to 30 for 1:30'],
            ['Daily Drawdown %',       'dailyDD',        'Auto-DQ threshold per day'],
            ['Total Drawdown %',       'totalDD',        'Auto-DQ lifetime threshold'],
            ['Min Trades / Round',     'minTrades',      'Minimum trades to qualify'],
            ['Max Position Size %',    'maxPositionPct', '% of account per trade'],
          ].map(([label, key, note]) => (
            <Field key={key} label={label} note={note}>
              <input type="number" className="input-field" value={config[key as keyof typeof config] as string} onChange={e => f(key, e.target.value)} style={{ fontFamily:'var(--font-mono)', fontSize:14, maxWidth:200 }} />
            </Field>
          ))}

          <Field label="Allowed Instruments" note="Comma-separated symbols">
            <input className="input-field" value={config.instruments} onChange={e => f('instruments', e.target.value)} style={{ fontFamily:'var(--font-mono)', fontSize:13 }} />
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:10 }}>
              {config.instruments.split(',').map(sym => (
                <span key={sym} className="badge badge-neon">{sym.trim()}</span>
              ))}
            </div>
          </Field>
        </Section>

        {/* Danger zone */}
        <div style={{ background:'rgba(255,56,96,0.04)', border:'1px solid rgba(255,56,96,0.2)', borderRadius:12, padding:'20px 24px' }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:13, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--red)', marginBottom:12 }}>⚠ Danger Zone</div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <button style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase', padding:'10px 20px', borderRadius:8, border:'1px solid rgba(255,56,96,0.3)', background:'rgba(255,56,96,0.08)', color:'var(--red)', cursor:'pointer' }}>
              Force Sync All Accounts
            </button>
            <button style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase', padding:'10px 20px', borderRadius:8, border:'1px solid rgba(255,56,96,0.3)', background:'rgba(255,56,96,0.08)', color:'var(--red)', cursor:'pointer' }}>
              Reset Qualifier Rankings
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
