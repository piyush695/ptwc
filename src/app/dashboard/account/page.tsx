'use client'
// src/app/dashboard/account/page.tsx
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const TRADER = { displayName:'AlphaTrader', country:'United Arab Emirates', countryCode:'AE', status:'ACTIVE', kycStatus:'APPROVED', rank:3, returnPct:14.82 }
const ACCOUNT = { number:'HP-WC-A1B2', server:'HolaPrime-Live', balance:11482.40, equity:11620.18, startBalance:10000, returnPct:14.82, maxDrawdown:2.14, dailyDrawdown:0.44, totalTrades:34, winTrades:25, lossTrades:9, winRate:73.5, avgWin:142.80, avgLoss:68.40, avgRR:2.09, totalLots:2.85, bestTrade:412.00, worstTrade:-134.00, leverage:30, currency:'USD' }

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100)
  const danger = pct > 75
  return (
    <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 3, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: danger ? 'var(--red)' : color, borderRadius: 3, transition: 'width 0.6s ease', boxShadow: `0 0 6px ${danger ? 'rgba(255,56,96,0.5)' : color}` }} />
    </div>
  )
}

export default function AccountPage() {
  const profit = ACCOUNT.balance - ACCOUNT.startBalance
  return (
    <DashboardLayout trader={TRADER}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--neon)', marginBottom:8 }}>Trading Account</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:36, color:'var(--white)', lineHeight:1 }}>Account Overview</h1>
      </div>

      {/* Account hero bar */}
      <div style={{ background:'var(--surface)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:14, padding:'24px 28px', marginBottom:20, display:'flex', gap:0, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,var(--neon),transparent)' }} />
        {[
          { label:'Account Number', value:ACCOUNT.number,      mono:true  },
          { label:'Server',         value:ACCOUNT.server,      mono:true  },
          { label:'Currency',       value:ACCOUNT.currency,    mono:false },
          { label:'Leverage',       value:`1:${ACCOUNT.leverage}`, mono:true },
          { label:'Status',         value:'ACTIVE',            color:'var(--green)' },
        ].map((item, i) => (
          <div key={item.label} style={{ flex:1, padding:'0 20px', borderRight: i < 4 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gray3)', marginBottom:8 }}>{item.label}</div>
            <div style={{ fontFamily: item.mono ? 'var(--font-mono)' : 'var(--font-display)', fontWeight: item.color ? 800 : 700, fontSize:15, color: item.color || 'var(--gray1)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Balance cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Balance',       value:`$${ACCOUNT.balance.toLocaleString('en',{minimumFractionDigits:2})}`,  color:'var(--white)', top:'var(--neon)' },
          { label:'Equity',        value:`$${ACCOUNT.equity.toLocaleString('en',{minimumFractionDigits:2})}`,   color:'var(--white)', top:'var(--gray3)' },
          { label:'Net Profit',    value:`+$${profit.toLocaleString('en',{minimumFractionDigits:2})}`,           color:'var(--green)', top:'var(--green)' },
          { label:'Net Return %',  value:`+${ACCOUNT.returnPct}%`,                                               color:'var(--green)', top:'var(--green)' },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'20px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:s.top }} />
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gray3)', marginBottom:10 }}>{s.label}</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:28, color:s.color, lineHeight:1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>

        {/* Drawdown meters */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:24 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:14, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--white)', marginBottom:20 }}>Drawdown Limits</div>
          {[
            { label:'Daily Drawdown',  value:ACCOUNT.dailyDrawdown,  max:8,  color:'var(--neon)' },
            { label:'Total Drawdown',  value:ACCOUNT.maxDrawdown,    max:12, color:'var(--gold)' },
          ].map(d => (
            <div key={d.label} style={{ marginBottom:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gray3)' }}>{d.label}</span>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, fontSize:16, color:d.color }}>{d.value}%</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray3)' }}>/ {d.max}%</span>
                </div>
              </div>
              <Bar value={d.value} max={d.max} color={d.color} />
              <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--gray3)', marginTop:4 }}>
                {(d.max - d.value).toFixed(2)}% remaining before disqualification
              </div>
            </div>
          ))}
          <div style={{ background:'rgba(0,230,118,0.05)', border:'1px solid rgba(0,230,118,0.2)', borderRadius:8, padding:'10px 14px' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, color:'var(--green)' }}>✓ Account in good standing</div>
            <div style={{ fontSize:12, color:'var(--gray3)', marginTop:3 }}>Both drawdown levels are well within limits.</div>
          </div>
        </div>

        {/* Performance stats */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:24 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:14, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--white)', marginBottom:20 }}>Performance Stats</div>
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {[
              { label:'Total Trades',  value:String(ACCOUNT.totalTrades), color:'var(--white)' },
              { label:'Wins / Losses', value:`${ACCOUNT.winTrades} / ${ACCOUNT.lossTrades}`, color:'var(--white)' },
              { label:'Win Rate',      value:`${ACCOUNT.winRate}%`,     color:'var(--green)' },
              { label:'Avg Win',       value:`+$${ACCOUNT.avgWin}`,      color:'var(--green)' },
              { label:'Avg Loss',      value:`-$${ACCOUNT.avgLoss}`,     color:'var(--red)'   },
              { label:'Avg R:R',       value:`1:${ACCOUNT.avgRR}`,       color:'var(--neon)'  },
              { label:'Total Lots',    value:String(ACCOUNT.totalLots),  color:'var(--gray1)' },
              { label:'Best Trade',    value:`+$${ACCOUNT.bestTrade}`,   color:'var(--green)' },
              { label:'Worst Trade',   value:`-$${ACCOUNT.worstTrade}`,  color:'var(--red)'   },
            ].map((s, i, arr) => (
              <div key={s.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom: i<arr.length-1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gray3)' }}>{s.label}</span>
                <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, fontSize:14, color:s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rules reminder */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:24 }}>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:14, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--white)', marginBottom:16 }}>Account Rules</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {[
            { rule:'Daily Drawdown Limit', value:'8%',     status:'safe',    note:'0.44% used today'  },
            { rule:'Total Drawdown Limit', value:'12%',    status:'safe',    note:'2.14% used total'  },
            { rule:'Min Trades Required',  value:'10',     status:'done',    note:'34 trades placed'  },
            { rule:'Max Leverage',         value:'1:30',   status:'safe',    note:'In use'            },
            { rule:'Max Position Size',    value:'5%',     status:'safe',    note:'Of account balance' },
            { rule:'Allowed Instruments',  value:'FX+CFDs',status:'safe',    note:'All categories'    },
          ].map(r => {
            const color = r.status==='done' ? 'var(--green)' : r.status==='warning' ? 'var(--gold)' : 'var(--neon)'
            return (
              <div key={r.rule} style={{ background:'var(--deep)', border:`1px solid var(--border)`, borderRadius:8, padding:'14px 16px' }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gray3)', marginBottom:6 }}>{r.rule}</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:18, color }}>{r.value}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--gray3)', marginTop:4 }}>{r.note}</div>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
