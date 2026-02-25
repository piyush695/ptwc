'use client'
// src/app/dashboard/leaderboard/page.tsx
import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const TRADER = { displayName:'AlphaTrader', country:'United Arab Emirates', countryCode:'AE', status:'ACTIVE', kycStatus:'APPROVED', rank:3, returnPct:14.82 }
const flagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`

const LEADERBOARD = [
  { rank:1,  name:'GoldenPip',   cc:'IN', country:'India',         ret:'+19.6%', dd:'1.8%', trades:41, balance:'$11,960', status:'ACTIVE' },
  { rank:2,  name:'NightFX',     cc:'NG', country:'Nigeria',       ret:'+17.2%', dd:'3.4%', trades:28, balance:'$11,720', status:'ACTIVE' },
  { rank:3,  name:'AlphaTrader', cc:'AE', country:'UAE',           ret:'+14.8%', dd:'2.1%', trades:34, balance:'$11,480', status:'ACTIVE', isMe:true },
  { rank:4,  name:'WaveRider',   cc:'GB', country:'United Kingdom',ret:'+12.1%', dd:'4.2%', trades:22, balance:'$11,210', status:'ACTIVE' },
  { rank:5,  name:'StrikeFX',    cc:'ZA', country:'South Africa',  ret:'+10.4%', dd:'2.9%', trades:31, balance:'$11,040', status:'ACTIVE' },
  { rank:6,  name:'PhoenixFX',   cc:'PK', country:'Pakistan',      ret:'+9.2%',  dd:'1.5%', trades:44, balance:'$10,920', status:'ACTIVE' },
  { rank:7,  name:'PipKing',     cc:'SG', country:'Singapore',     ret:'+8.7%',  dd:'3.1%', trades:19, balance:'$10,870', status:'ACTIVE' },
  { rank:8,  name:'BullsEye',    cc:'MY', country:'Malaysia',      ret:'+7.4%',  dd:'2.6%', trades:26, balance:'$10,740', status:'ACTIVE' },
  { rank:9,  name:'ZeroLoss',    cc:'KE', country:'Kenya',         ret:'+6.8%',  dd:'1.2%', trades:37, balance:'$10,680', status:'ACTIVE' },
  { rank:10, name:'TrendHunter', cc:'BR', country:'Brazil',        ret:'+5.9%',  dd:'4.8%', trades:15, balance:'$10,590', status:'ACTIVE' },
]

export default function DashboardLeaderboardPage() {
  const [search, setSearch] = useState('')
  const filtered = LEADERBOARD.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.country.toLowerCase().includes(search.toLowerCase())
  )
  const me = LEADERBOARD.find(t => t.isMe)!
  const ahead = LEADERBOARD[LEADERBOARD.indexOf(me) - 1]
  const gap = ahead ? (parseFloat(ahead.ret) - parseFloat(me.ret)).toFixed(2) : null

  return (
    <DashboardLayout trader={TRADER}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--neon)', marginBottom:8 }}>Tournament</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:36, color:'var(--white)', lineHeight:1 }}>Leaderboard</h1>
      </div>

      {/* My position callout */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:24 }}>
        <div style={{ background:'rgba(0,212,255,0.05)', border:'1px solid rgba(0,212,255,0.25)', borderRadius:12, padding:'20px 24px' }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gray3)', marginBottom:8 }}>Your Rank</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:40, color:'var(--neon)', lineHeight:1 }}>#{me.rank}</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, color:'var(--gray3)', marginTop:6 }}>out of 2,418 active traders</div>
        </div>
        <div style={{ background:'rgba(0,230,118,0.05)', border:'1px solid rgba(0,230,118,0.2)', borderRadius:12, padding:'20px 24px' }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gray3)', marginBottom:8 }}>Your Return</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:40, color:'var(--green)', lineHeight:1 }}>{me.ret}</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, color:'var(--gray3)', marginTop:6 }}>{me.trades} trades · {me.dd} max DD</div>
        </div>
        <div style={{ background:'rgba(240,192,64,0.05)', border:'1px solid rgba(240,192,64,0.2)', borderRadius:12, padding:'20px 24px' }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gray3)', marginBottom:8 }}>Gap to #2</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:40, color:'var(--gold)', lineHeight:1 }}>
            {gap ? `-${gap}%` : '🏆'}
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, color:'var(--gray3)', marginTop:6 }}>
            {ahead ? `Overtake ${ahead.name}` : 'You are leading!'}
          </div>
        </div>
      </div>

      {/* Search */}
      <input className="input-field" placeholder="🔍  Search trader or country..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom:16 }} />

      {/* Table */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'var(--deep)' }}>
              {['Rank','Trader','Country','Return %','Balance','Max DD','Trades','Status'].map((h,i) => (
                <th key={h} style={{ padding:'12px 18px', textAlign: i>2?'right':'left', fontFamily:'var(--font-display)', fontWeight:700, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray3)', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.rank} className="tr-hover" style={{ background: t.isMe ? 'rgba(0,212,255,0.04)' : 'transparent' }}>
                <td style={{ padding:'14px 18px' }}>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:18, color: t.rank===1?'var(--gold)':t.rank===2?'#c0d0e0':t.rank===3?'#cd7040':'var(--gray3)' }}>
                    {t.rank===1?'🥇':t.rank===2?'🥈':t.rank===3?'🥉':t.rank}
                  </span>
                </td>
                <td style={{ padding:'14px 18px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontFamily:'var(--font-display)', fontWeight: t.isMe?900:800, fontSize:15, color: t.isMe?'var(--neon)':'var(--white)' }}>{t.name}</span>
                    {t.isMe && <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', padding:'2px 6px', borderRadius:3, background:'rgba(0,212,255,0.15)', color:'var(--neon)', border:'1px solid rgba(0,212,255,0.3)' }}>YOU</span>}
                  </div>
                </td>
                <td style={{ padding:'14px 18px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:22, height:15, borderRadius:2, overflow:'hidden', flexShrink:0 }}>
                      <img src={flagUrl(t.cc)} alt={t.cc} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                    </div>
                    <span style={{ fontSize:13, color:'var(--gray2)' }}>{t.country}</span>
                  </div>
                </td>
                <td style={{ padding:'14px 18px', textAlign:'right' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, fontSize:15, color:'var(--green)' }}>{t.ret}</span>
                </td>
                <td style={{ padding:'14px 18px', textAlign:'right' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--gray1)' }}>{t.balance}</span>
                </td>
                <td style={{ padding:'14px 18px', textAlign:'right' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color: parseFloat(t.dd)>6?'var(--red)':'var(--green)' }}>{t.dd}</span>
                </td>
                <td style={{ padding:'14px 18px', textAlign:'right' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--gray1)' }}>{t.trades}</span>
                </td>
                <td style={{ padding:'14px 18px', textAlign:'right' }}>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', padding:'3px 8px', borderRadius:4, background:'rgba(0,230,118,0.1)', color:'var(--green)', border:'1px solid rgba(0,230,118,0.25)' }}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding:'12px 18px', borderTop:'1px solid var(--border)', background:'var(--deep)', textAlign:'center' }}>
          <a href="/leaderboard" style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--neon)', textDecoration:'none' }}>
            View Full Public Leaderboard (2,418 traders) →
          </a>
        </div>
      </div>
    </DashboardLayout>
  )
}
