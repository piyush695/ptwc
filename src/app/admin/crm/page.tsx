'use client'
// src/app/admin/crm/page.tsx
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

const MOCK_LEADS = [
  { id:'l1', name:'Ahmad Al-Rashid', email:'ahmad@example.com', country:'🇦🇪', cc:'AE', status:'CONVERTED', source:'organic',  assigned:'Sarah', lastContact:'2h ago',   followUp:null,         tags:['vip','qualifier'] },
  { id:'l2', name:'Emeka Okafor',    email:'emeka@example.com', country:'🇳🇬', cc:'NG', status:'CONVERTED', source:'referral', assigned:'Mike',  lastContact:'5h ago',   followUp:null,         tags:['qualifier'] },
  { id:'l3', name:'Ravi Sharma',     email:'ravi@example.com',  country:'🇮🇳', cc:'IN', status:'REGISTERED',source:'social',   assigned:'Sarah', lastContact:'1d ago',   followUp:'Tomorrow',   tags:['kyc-pending'] },
  { id:'l4', name:'James Smith',     email:'james@example.com', country:'🇬🇧', cc:'GB', status:'REGISTERED',source:'email',    assigned:'Mike',  lastContact:'1d ago',   followUp:'Tomorrow',   tags:['kyc-pending'] },
  { id:'l5', name:'Thabo Nkosi',     email:'thabo@example.com', country:'🇿🇦', cc:'ZA', status:'QUALIFIED',  source:'organic',  assigned:'Sarah', lastContact:'3d ago',   followUp:'May 10',     tags:['high-value'] },
  { id:'l6', name:'Amir Hassan',     email:'amir@example.com',  country:'🇲🇾', cc:'MY', status:'CONTACTED', source:'ads',      assigned:null,    lastContact:'5d ago',   followUp:'May 8',      tags:[] },
  { id:'l7', name:'Ali Khan',        email:'ali@example.com',   country:'🇵🇰', cc:'PK', status:'NEW',        source:'organic',  assigned:null,    lastContact:'Just now', followUp:'May 7',      tags:['new'] },
  { id:'l8', name:'David Kimani',    email:'david@example.com', country:'🇰🇪', cc:'KE', status:'LOST',       source:'social',   assigned:'Mike',  lastContact:'1w ago',   followUp:null,         tags:['rejected-kyc'] },
]

const STATUS_CFG: Record<string, { color: string; bg: string; border: string }> = {
  NEW:        { color:'var(--neon)',  bg:'rgba(0,212,255,0.08)',  border:'rgba(0,212,255,0.2)'  },
  CONTACTED:  { color:'var(--gold)', bg:'rgba(240,192,64,0.08)', border:'rgba(240,192,64,0.2)' },
  QUALIFIED:  { color:'var(--green)',bg:'rgba(0,230,118,0.08)',  border:'rgba(0,230,118,0.2)'  },
  REGISTERED: { color:'var(--neon)', bg:'rgba(0,212,255,0.08)',  border:'rgba(0,212,255,0.2)'  },
  CONVERTED:  { color:'var(--green)',bg:'rgba(0,230,118,0.08)',  border:'rgba(0,230,118,0.2)'  },
  LOST:       { color:'var(--red)',  bg:'rgba(255,56,96,0.08)',  border:'rgba(255,56,96,0.2)'  },
}

const ACTIVITY_LOG = [
  { time:'2h ago',  type:'email', user:'Sarah', note:'Sent welcome + KYC instructions to Ahmad' },
  { time:'5h ago',  type:'call',  user:'Mike',  note:'Called Emeka — confirmed registration interest' },
  { time:'1d ago',  type:'note',  user:'Sarah', note:'Ravi needs passport re-upload — doc was blurry' },
  { time:'2d ago',  type:'email', user:'System',note:'Bulk email sent: "Qualifier starts June 1" — 2,418 recipients' },
  { time:'3d ago',  type:'note',  user:'Mike',  note:'Thabo flagged as high-value — referred 3 others' },
]

export default function AdminCRMPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [showBulkEmail, setShowBulkEmail] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')

  const filtered = MOCK_LEADS.filter(l => {
    const ms = !statusFilter || l.status === statusFilter
    const mq = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase())
    return ms && mq
  })

  const counts = Object.entries(
    MOCK_LEADS.reduce((acc, l) => ({ ...acc, [l.status]: (acc[l.status as keyof typeof acc] || 0) + 1 }), {} as Record<string,number>)
  )

  return (
    <AdminLayout>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--neon)', marginBottom:8 }}>Customer Relations</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:36, color:'var(--white)', lineHeight:1 }}>CRM</h1>
          <button onClick={() => setShowBulkEmail(true)} style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', padding:'12px 24px', borderRadius:8, border:'none', cursor:'pointer', background:'var(--neon)', color:'var(--black)', boxShadow:'0 0 20px rgba(0,212,255,0.35)' }}>
            ✉ Bulk Email
          </button>
        </div>
      </div>

      {/* Pipeline status cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10, marginBottom:24 }}>
        {[['NEW','New'],['CONTACTED','Contacted'],['QUALIFIED','Qualified'],['REGISTERED','Registered'],['CONVERTED','Converted'],['LOST','Lost']].map(([val,label]) => {
          const count = MOCK_LEADS.filter(l => l.status === val).length
          const cfg = STATUS_CFG[val]
          return (
            <button key={val} onClick={() => setStatusFilter(statusFilter === val ? '' : val)} style={{
              background: statusFilter === val ? cfg.bg : 'var(--surface)',
              border: `1px solid ${statusFilter === val ? cfg.border : 'var(--border)'}`,
              borderRadius:10, padding:'16px 12px', cursor:'pointer', textAlign:'center', transition:'all 0.2s',
            }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:26, color: cfg.color }}>{count}</div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gray3)', marginTop:4 }}>{label}</div>
            </button>
          )
        })}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>

        {/* Leads table */}
        <div>
          <input className="input-field" placeholder="🔍  Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom:16 }} />

          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'var(--deep)' }}>
                  {['Name','Country','Status','Source','Assigned','Last Contact','Follow Up','Actions'].map((h,i) => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gray3)', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => {
                  const cfg = STATUS_CFG[lead.status]
                  return (
                    <tr key={lead.id} className="tr-hover">
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:14, color:'var(--white)' }}>{lead.name}</div>
                        <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray3)', marginTop:1 }}>{lead.email}</div>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <span style={{ fontSize:16 }}>{lead.country}</span>
                          <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray2)' }}>{lead.cc}</span>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', padding:'3px 8px', borderRadius:4, color:cfg.color, background:cfg.bg, border:`1px solid ${cfg.border}` }}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray2)' }}>{lead.source}</span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        {lead.assigned
                          ? <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:12, color:'var(--gray1)' }}>{lead.assigned}</span>
                          : <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray3)' }}>—</span>
                        }
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray2)' }}>{lead.lastContact}</span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        {lead.followUp
                          ? <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, color:'var(--gold)' }}>📅 {lead.followUp}</span>
                          : <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray3)' }}>—</span>
                        }
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.08em', padding:'5px 10px', borderRadius:5, border:'1px solid var(--border2)', background:'transparent', color:'var(--neon)', cursor:'pointer' }}>LOG</button>
                          <button style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.08em', padding:'5px 10px', borderRadius:5, border:'none', background:'rgba(0,212,255,0.1)', color:'var(--neon)', cursor:'pointer' }}>✉</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:'48px', color:'var(--gray3)', fontFamily:'var(--font-display)', fontSize:13, letterSpacing:'0.1em', textTransform:'uppercase' }}>No records found</div>
            )}
          </div>
        </div>

        {/* Activity log */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:20, height:'fit-content' }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:15, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--white)', marginBottom:20 }}>
            Activity Log
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {ACTIVITY_LOG.map((a,i) => (
              <div key={i} style={{ display:'flex', gap:12, paddingBottom:16, borderBottom: i < ACTIVITY_LOG.length-1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--deep)', border:'1px solid var(--border2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:14 }}>
                  {a.type==='email'?'✉':a.type==='call'?'📞':'📝'}
                </div>
                <div>
                  <div style={{ fontSize:13, color:'var(--gray1)', lineHeight:1.5 }}>{a.note}</div>
                  <div style={{ display:'flex', gap:8, marginTop:4 }}>
                    <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--neon)' }}>{a.user}</span>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--gray3)' }}>{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Log activity form */}
          <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid var(--border)' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--white)', marginBottom:12 }}>
              Log Activity
            </div>
            <select className="input-field" style={{ marginBottom:10, fontSize:13 }}>
              <option>📝 Note</option><option>✉ Email</option><option>📞 Call</option>
            </select>
            <textarea className="input-field" placeholder="Add a note..." style={{ minHeight:80, resize:'vertical', fontSize:13, marginBottom:10 }} />
            <button style={{ width:'100%', padding:'11px', borderRadius:8, border:'none', background:'var(--surface2)', color:'var(--white)', fontFamily:'var(--font-display)', fontWeight:800, fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', borderColor:'var(--border2)', border:'1px solid var(--border2)' }}>
              Save Activity
            </button>
          </div>
        </div>
      </div>

      {/* Bulk email modal */}
      {showBulkEmail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(3,4,10,0.8)', backdropFilter:'blur(10px)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'var(--deep)', border:'1px solid var(--border)', borderRadius:16, width:'100%', maxWidth:580 }}>
            <div style={{ padding:'24px 28px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:24, color:'var(--white)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Bulk Email</h2>
              <button onClick={() => setShowBulkEmail(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--gray3)', fontSize:24 }}>×</button>
            </div>
            <div style={{ padding:28, display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:8 }}>Send To</label>
                <select className="input-field">
                  <option>All Traders (2,418)</option>
                  <option>KYC Pending (38)</option>
                  <option>Active Only (1,894)</option>
                  <option>Registered — Not Active (486)</option>
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:8 }}>Template</label>
                <select className="input-field">
                  <option>— Custom —</option>
                  <option>Registration Confirmation</option>
                  <option>Qualifier Reminder</option>
                  <option>KYC Approval</option>
                  <option>Match Announcement</option>
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:8 }}>Subject</label>
                <input className="input-field" placeholder="Email subject..." value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
              </div>
              <div>
                <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:8 }}>Message Body</label>
                <textarea className="input-field" placeholder="Write your message..." style={{ minHeight:140, resize:'vertical' }} value={emailBody} onChange={e => setEmailBody(e.target.value)} />
              </div>
              <div style={{ background:'rgba(240,192,64,0.06)', border:'1px solid rgba(240,192,64,0.2)', borderRadius:8, padding:'12px 16px', display:'flex', gap:10, alignItems:'flex-start' }}>
                <span style={{ color:'var(--gold)', fontSize:16 }}>⚠</span>
                <span style={{ fontSize:13, color:'var(--gray2)', lineHeight:1.5 }}>This will send emails to all selected traders immediately. This action cannot be undone.</span>
              </div>
            </div>
            <div style={{ padding:'0 28px 28px', display:'flex', gap:12 }}>
              <button onClick={() => setShowBulkEmail(false)} style={{ flex:1, padding:'13px', borderRadius:8, border:'1px solid var(--border2)', background:'transparent', color:'var(--gray2)', fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer' }}>Cancel</button>
              <button style={{ flex:2, padding:'13px', borderRadius:8, border:'none', background:'var(--neon)', color:'var(--black)', fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', boxShadow:'0 0 20px rgba(0,212,255,0.35)' }}>✉ Send Email Campaign</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
