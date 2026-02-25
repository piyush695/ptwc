'use client'
// src/app/dashboard/notifications/page.tsx
import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const TRADER = { displayName:'AlphaTrader', country:'United Arab Emirates', countryCode:'AE', status:'ACTIVE', kycStatus:'APPROVED', rank:3, returnPct:14.82 }

const ALL_NOTIFS = [
  { id:'n1',  type:'warning', read:false, title:'Qualifier ends in 4 days',         body:'Ensure you have completed at least 10 trades before June 12. Current count: 34 — you\'re good!', time:'2h ago',   category:'tournament' },
  { id:'n2',  type:'success', read:false, title:'Rank improved — you\'re now #3',   body:'Great trading today! You moved up from #5 to #3 on the qualifier leaderboard.',                  time:'5h ago',   category:'ranking'    },
  { id:'n3',  type:'info',    read:false, title:'New trade executed: XAUUSD BUY',   body:'Your position of 0.10 lots on XAUUSD opened at 2312.40. Current P&L: +$165.00.',               time:'Today',    category:'account'    },
  { id:'n4',  type:'success', read:true,  title:'KYC Fully Approved',               body:'All verification documents have been reviewed and approved. Your account is fully active.',      time:'1d ago',   category:'kyc'        },
  { id:'n5',  type:'info',    read:true,  title:'Account HP-WC-A1B2 is ready',      body:'Your $10,000 funded trading account is now set up. Server: HolaPrime-Live. Login: 847392.',     time:'2d ago',   category:'account'    },
  { id:'n6',  type:'warning', read:true,  title:'Daily drawdown alert: 4.2%',       body:'Your daily drawdown reached 4.2% on June 6. Limit is 8%. Be cautious with position sizing.',   time:'3d ago',   category:'risk'       },
  { id:'n7',  type:'info',    read:true,  title:'Qualifier phase begins June 1',    body:'The open qualifier has started. You have 12 days to trade on your funded account.',              time:'5d ago',   category:'tournament' },
  { id:'n8',  type:'info',    read:true,  title:'Welcome to Hola Prime World Cup',  body:'Registration confirmed. Your account is being set up and you\'ll receive MT5 credentials soon.','time':'7d ago', category:'general'    },
]

const iconMap: Record<string, string> = { warning:'⚠', success:'✓', info:'ℹ', error:'✕' }
const colorMap: Record<string, string> = { warning:'var(--gold)', success:'var(--green)', info:'var(--neon)', error:'var(--red)' }

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(ALL_NOTIFS)
  const [filter, setFilter] = useState('ALL')

  const categories = ['ALL','tournament','ranking','account','kyc','risk','general']
  const filtered = notifs.filter(n => filter === 'ALL' || n.category === filter)
  const unread = notifs.filter(n => !n.read).length

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read:true })))
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id===id ? {...n,read:true} : n))

  return (
    <DashboardLayout trader={TRADER}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--neon)', marginBottom:8 }}>Inbox</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:36, color:'var(--white)', lineHeight:1 }}>
            Notifications
            {unread > 0 && <span style={{ background:'var(--red)', color:'var(--white)', fontFamily:'var(--font-display)', fontWeight:900, fontSize:14, borderRadius:100, padding:'2px 10px', marginLeft:12, verticalAlign:'middle' }}>{unread}</span>}
          </h1>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', padding:'10px 20px', borderRadius:8, border:'1px solid var(--border2)', background:'transparent', color:'var(--gray2)', cursor:'pointer', transition:'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='var(--neon)'; (e.currentTarget as HTMLElement).style.borderColor='var(--neon)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='var(--gray2)'; (e.currentTarget as HTMLElement).style.borderColor='var(--border2)' }}
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:20, flexWrap:'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', padding:'8px 14px', borderRadius:7, border:'none', cursor:'pointer', transition:'all 0.15s', background: filter===cat ? 'var(--neon)' : 'var(--surface)', color: filter===cat ? 'var(--black)' : 'var(--gray2)', boxShadow: filter===cat ? '0 0 12px rgba(0,212,255,0.3)' : 'none' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div style={{ display:'flex', flexDirection:'column', gap:8, maxWidth:740 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px', color:'var(--gray3)', fontFamily:'var(--font-display)', fontSize:13, letterSpacing:'0.12em', textTransform:'uppercase' }}>No notifications</div>
        )}
        {filtered.map(n => {
          const c = colorMap[n.type]
          return (
            <div key={n.id}
              onClick={() => markRead(n.id)}
              style={{ background: n.read ? 'var(--surface)' : `${c}06`, border:`1px solid ${n.read ? 'var(--border)' : `${c}25`}`, borderRadius:12, padding:'18px 20px', display:'flex', gap:16, cursor:'pointer', transition:'all 0.15s', position:'relative' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = n.read ? 'var(--surface2)' : `${c}0a`}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = n.read ? 'var(--surface)' : `${c}06`}
            >
              {/* Unread dot */}
              {!n.read && (
                <div style={{ position:'absolute', top:18, right:18, width:8, height:8, borderRadius:'50%', background:'var(--neon)', boxShadow:'0 0 6px rgba(0,212,255,0.8)' }} />
              )}

              {/* Icon */}
              <div style={{ width:40, height:40, borderRadius:10, background:`${c}15`, border:`1px solid ${c}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18, color:c }}>
                {iconMap[n.type]}
              </div>

              {/* Content */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:5 }}>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight: n.read ? 700 : 900, fontSize:14, color: n.read ? 'var(--gray1)' : 'var(--white)' }}>{n.title}</span>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', padding:'2px 7px', borderRadius:4, background:`${c}12`, color:c, border:`1px solid ${c}25`, flexShrink:0 }}>
                    {n.category}
                  </span>
                </div>
                <div style={{ fontSize:13, color:'var(--gray2)', lineHeight:1.55 }}>{n.body}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray3)', marginTop:6 }}>{n.time}</div>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
