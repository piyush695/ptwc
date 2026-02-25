'use client'
// src/app/dashboard/trades/page.tsx
import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const TRADER = { displayName:'AlphaTrader', country:'United Arab Emirates', countryCode:'AE', status:'ACTIVE', kycStatus:'APPROVED', rank:3, returnPct:14.82 }

const ALL_TRADES = [
  { id:'t1',  symbol:'XAUUSD', type:'BUY',  lots:0.10, open:2312.40, close:2328.90, openTime:'Jun 8 14:10', closeTime:'Jun 8 14:22', duration:'12m', pnl:+165.00, pips:+164, status:'CLOSED' },
  { id:'t2',  symbol:'EURUSD', type:'SELL', lots:0.20, open:1.0842,  close:1.0818,  openTime:'Jun 8 10:55', closeTime:'Jun 8 11:05', duration:'10m', pnl:+48.00,  pips:+24,  status:'CLOSED' },
  { id:'t3',  symbol:'US30',   type:'BUY',  lots:0.05, open:39420,   close:null,    openTime:'Jun 8 09:30', closeTime:null,          duration:'Live',pnl:+78.40,  pips:null, status:'OPEN'   },
  { id:'t4',  symbol:'GBPUSD', type:'BUY',  lots:0.15, open:1.2640,  close:1.2598,  openTime:'Jun 7 16:20', closeTime:'Jun 7 17:10', duration:'50m', pnl:-63.00,  pips:-42,  status:'CLOSED' },
  { id:'t5',  symbol:'XAUUSD', type:'SELL', lots:0.10, open:2298.10, close:2290.60, openTime:'Jun 7 13:00', closeTime:'Jun 7 14:45', duration:'1h45',pnl:+75.00,  pips:+75,  status:'CLOSED' },
  { id:'t6',  symbol:'USDJPY', type:'BUY',  lots:0.25, open:157.42,  close:157.82,  openTime:'Jun 7 09:15', closeTime:'Jun 7 11:30', duration:'2h15',pnl:+100.00, pips:+40,  status:'CLOSED' },
  { id:'t7',  symbol:'GBPUSD', type:'SELL', lots:0.20, open:1.2680,  close:1.2622,  openTime:'Jun 6 15:40', closeTime:'Jun 6 16:55', duration:'1h15',pnl:+116.00, pips:+58,  status:'CLOSED' },
  { id:'t8',  symbol:'EURUSD', type:'BUY',  lots:0.20, open:1.0792,  close:1.0768,  openTime:'Jun 6 10:00', closeTime:'Jun 6 11:20', duration:'1h20',pnl:-48.00,  pips:-24,  status:'CLOSED' },
  { id:'t9',  symbol:'NAS100', type:'BUY',  lots:0.02, open:18640,   close:18710,   openTime:'Jun 5 14:30', closeTime:'Jun 5 15:45', duration:'1h15',pnl:+140.00, pips:+70,  status:'CLOSED' },
  { id:'t10', symbol:'XAUUSD', type:'BUY',  lots:0.10, open:2272.00, close:2280.40, openTime:'Jun 5 09:00', closeTime:'Jun 5 12:00', duration:'3h',  pnl:+84.00,  pips:+84,  status:'CLOSED' },
]

export default function TradesPage() {
  const [filter, setFilter] = useState('ALL')
  const [symbolFilter, setSymbolFilter] = useState('ALL')

  const symbols = ['ALL', ...Array.from(new Set(ALL_TRADES.map(t => t.symbol)))]
  const filtered = ALL_TRADES.filter(t => {
    const fs = filter === 'ALL' || t.status === filter || (filter === 'WIN' && t.pnl > 0) || (filter === 'LOSS' && t.pnl < 0)
    const sym = symbolFilter === 'ALL' || t.symbol === symbolFilter
    return fs && sym
  })

  const closed = ALL_TRADES.filter(t => t.status === 'CLOSED')
  const wins   = closed.filter(t => t.pnl > 0)
  const totalPnl = closed.reduce((s, t) => s + t.pnl, 0)

  return (
    <DashboardLayout trader={TRADER}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--neon)', marginBottom:8 }}>My Trading</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:36, color:'var(--white)', lineHeight:1 }}>Trade History</h1>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:24 }}>
        {[
          { label:'Total Trades', value:String(ALL_TRADES.length),                    color:'var(--white)' },
          { label:'Closed',       value:String(closed.length),                        color:'var(--gray1)' },
          { label:'Win Rate',     value:`${((wins.length/closed.length)*100).toFixed(1)}%`, color:'var(--green)' },
          { label:'Total P&L',    value:`+$${totalPnl.toFixed(2)}`,                   color:'var(--green)' },
          { label:'Open Trades',  value:String(ALL_TRADES.filter(t=>t.status==='OPEN').length), color:'var(--neon)' },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'18px 20px' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gray3)', marginBottom:8 }}>{s.label}</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:26, color:s.color, lineHeight:1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        {['ALL','OPEN','CLOSED','WIN','LOSS'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.08em', padding:'8px 16px', borderRadius:7, border:'none', cursor:'pointer', transition:'all 0.15s', background: filter===f ? 'var(--neon)' : 'var(--surface)', color: filter===f ? 'var(--black)' : 'var(--gray2)', boxShadow: filter===f ? '0 0 14px rgba(0,212,255,0.35)' : 'none' }}>{f}</button>
        ))}
        <div style={{ width:1, height:24, background:'var(--border)', margin:'0 4px' }} />
        <select value={symbolFilter} onChange={e => setSymbolFilter(e.target.value)}
          style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.08em', padding:'8px 14px', borderRadius:7, border:'1px solid var(--border2)', background:'var(--surface)', color:'var(--gray2)', cursor:'pointer' }}>
          {symbols.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Symbols' : s}</option>)}
        </select>
        <span style={{ marginLeft:'auto', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--gray3)' }}>{filtered.length} trades</span>
      </div>

      {/* Table */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'var(--deep)' }}>
              {['Symbol','Type','Lots','Open Price','Close Price','Open Time','Duration','P&L','Pips'].map((h,i) => (
                <th key={h} style={{ padding:'12px 16px', textAlign: i > 3 ? 'right' : 'left', fontFamily:'var(--font-display)', fontWeight:700, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray3)', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="tr-hover">
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background: t.status==='OPEN' ? 'var(--neon)' : t.pnl>0 ? 'var(--green)' : 'var(--red)', boxShadow: t.status==='OPEN' ? '0 0 6px rgba(0,212,255,0.8)' : 'none' }} />
                    <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:14, color:'var(--white)' }}>{t.symbol}</span>
                  </div>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:11, letterSpacing:'0.1em', padding:'3px 8px', borderRadius:4, background: t.type==='BUY'?'rgba(0,230,118,0.1)':'rgba(255,56,96,0.1)', color: t.type==='BUY'?'var(--green)':'var(--red)', border:`1px solid ${t.type==='BUY'?'rgba(0,230,118,0.25)':'rgba(255,56,96,0.25)'}` }}>
                    {t.type}
                  </span>
                </td>
                <td style={{ padding:'12px 16px' }}><span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--gray2)' }}>{t.lots}</span></td>
                <td style={{ padding:'12px 16px' }}><span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--gray2)' }}>{t.open}</span></td>
                <td style={{ padding:'12px 16px', textAlign:'right' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color: t.close ? 'var(--gray2)' : 'var(--neon)' }}>
                    {t.close ?? '—LIVE—'}
                  </span>
                </td>
                <td style={{ padding:'12px 16px', textAlign:'right' }}><span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray3)' }}>{t.openTime}</span></td>
                <td style={{ padding:'12px 16px', textAlign:'right' }}><span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray3)' }}>{t.duration}</span></td>
                <td style={{ padding:'12px 16px', textAlign:'right' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, fontSize:14, color: t.pnl>=0?'var(--green)':'var(--red)' }}>
                    {t.pnl>=0?'+':''}${t.pnl.toFixed(2)}
                  </span>
                </td>
                <td style={{ padding:'12px 16px', textAlign:'right' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color: t.pips && t.pips>0 ? 'var(--green)' : t.pips && t.pips<0 ? 'var(--red)' : 'var(--gray3)' }}>
                    {t.pips != null ? `${t.pips>0?'+':''}${t.pips}` : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px', color:'var(--gray3)', fontFamily:'var(--font-display)', fontSize:13, letterSpacing:'0.12em', textTransform:'uppercase' }}>No trades found</div>
        )}
        <div style={{ padding:'12px 16px', borderTop:'1px solid var(--border)', background:'var(--deep)', display:'flex', justifyContent:'space-between' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--gray3)' }}>Showing {filtered.length} trades</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color: totalPnl>=0?'var(--green)':'var(--red)', fontWeight:700 }}>
            Total P&L: {totalPnl>=0?'+':''}${totalPnl.toFixed(2)}
          </span>
        </div>
      </div>
    </DashboardLayout>
  )
}
