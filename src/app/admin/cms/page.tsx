'use client'
// src/app/admin/cms/page.tsx
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

const MOCK_POSTS = [
  { id:'p1', title:'World Cup Registration Now Open', slug:'wc-registration-open', category:'announcement', status:'PUBLISHED', featured:true,  date:'May 1, 2026' },
  { id:'p2', title:'Meet the Defending Champions',   slug:'defending-champions',  category:'trader-spotlight', status:'PUBLISHED', featured:false, date:'Apr 28, 2026' },
  { id:'p3', title:'Qualifier Rules & Scoring Guide', slug:'qualifier-rules',     category:'technical',   status:'PUBLISHED', featured:false, date:'Apr 25, 2026' },
  { id:'p4', title:'Prize Pool Breakdown 2026',       slug:'prize-pool-2026',     category:'news',        status:'DRAFT',     featured:false, date:'Apr 22, 2026' },
  { id:'p5', title:'How Anti-Cheat Works',            slug:'anti-cheat-system',   category:'technical',   status:'DRAFT',     featured:false, date:'Apr 20, 2026' },
]

const CAT_COLORS: Record<string, string> = {
  announcement: 'var(--neon)',  'trader-spotlight': 'var(--gold)',
  technical: 'var(--gray2)',    news: 'var(--green)',  results: 'var(--red)',
}

export default function AdminCMSPage() {
  const [posts, setPosts] = useState(MOCK_POSTS)
  const [showEditor, setShowEditor] = useState(false)
  const [form, setForm] = useState({ title:'', slug:'', category:'news', content:'', status:'DRAFT', featured:false })

  const genSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

  return (
    <AdminLayout>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--neon)', marginBottom:8 }}>Content Management</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:36, color:'var(--white)', lineHeight:1 }}>CMS / News</h1>
          <button onClick={() => setShowEditor(true)} style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', padding:'12px 24px', borderRadius:8, border:'none', cursor:'pointer', background:'var(--neon)', color:'var(--black)', boxShadow:'0 0 20px rgba(0,212,255,0.35)' }}>
            + New Post
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        {[
          { label:'Total Posts',  value: posts.length,                              color:'var(--neon)'  },
          { label:'Published',    value: posts.filter(p=>p.status==='PUBLISHED').length, color:'var(--green)' },
          { label:'Drafts',       value: posts.filter(p=>p.status==='DRAFT').length,     color:'var(--gold)'  },
          { label:'Featured',     value: posts.filter(p=>p.featured).length,         color:'var(--gold)'  },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'16px 20px' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:28, color:s.color }}>{s.value}</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray3)', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Posts table */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'var(--deep)' }}>
              {['Title','Category','Status','Featured','Date','Actions'].map((h,i) => (
                <th key={h} style={{ padding:'12px 20px', textAlign: i>3?'right':'left', fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray3)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="tr-hover">
                <td style={{ padding:'14px 20px' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:15, color:'var(--white)' }}>{post.title}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray3)', marginTop:2 }}>/{post.slug}</div>
                </td>
                <td style={{ padding:'14px 20px' }}>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color: CAT_COLORS[post.category] || 'var(--gray2)' }}>
                    {post.category}
                  </span>
                </td>
                <td style={{ padding:'14px 20px' }}>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', padding:'4px 10px', borderRadius:4,
                    background: post.status==='PUBLISHED' ? 'rgba(0,230,118,0.1)' : 'rgba(240,192,64,0.1)',
                    color: post.status==='PUBLISHED' ? 'var(--green)' : 'var(--gold)',
                    border: `1px solid ${post.status==='PUBLISHED' ? 'rgba(0,230,118,0.25)' : 'rgba(240,192,64,0.25)'}`,
                  }}>{post.status}</span>
                </td>
                <td style={{ padding:'14px 20px' }}>
                  {post.featured ? <span style={{ color:'var(--gold)', fontSize:18 }}>★</span> : <span style={{ color:'var(--gray3)', fontSize:18 }}>☆</span>}
                </td>
                <td style={{ padding:'14px 20px' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--gray2)' }}>{post.date}</span>
                </td>
                <td style={{ padding:'14px 20px', textAlign:'right' }}>
                  <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
                    <button style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.08em', padding:'6px 12px', borderRadius:6, border:'1px solid var(--border2)', background:'transparent', color:'var(--neon)', cursor:'pointer' }}>EDIT</button>
                    <button style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.08em', padding:'6px 12px', borderRadius:6, border:'1px solid rgba(255,56,96,0.25)', background:'rgba(255,56,96,0.08)', color:'var(--red)', cursor:'pointer' }}>DEL</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor modal */}
      {showEditor && (
        <div style={{ position:'fixed', inset:0, background:'rgba(3,4,10,0.8)', backdropFilter:'blur(10px)', zIndex:200, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 24px', overflowY:'auto' }}>
          <div style={{ background:'var(--deep)', border:'1px solid var(--border)', borderRadius:16, width:'100%', maxWidth:700 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding:'24px 28px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:24, color:'var(--white)', textTransform:'uppercase', letterSpacing:'0.05em' }}>New Post</h2>
              <button onClick={() => setShowEditor(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--gray3)', fontSize:24 }}>×</button>
            </div>

            <div style={{ padding:'28px', display:'flex', flexDirection:'column', gap:20 }}>
              <div>
                <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:8 }}>Title</label>
                <input className="input-field" placeholder="Post title..." value={form.title}
                  onChange={e => setForm(f => ({...f, title:e.target.value, slug: genSlug(e.target.value)}))} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div>
                  <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:8 }}>Slug</label>
                  <input className="input-field" style={{ fontFamily:'var(--font-mono)', fontSize:13 }} value={form.slug} onChange={e => setForm(f=>({...f,slug:e.target.value}))} />
                </div>
                <div>
                  <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:8 }}>Category</label>
                  <select className="input-field" value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
                    {['news','announcement','trader-spotlight','results','technical'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:8 }}>Content (HTML)</label>
                <textarea className="input-field" style={{ minHeight:180, resize:'vertical', fontFamily:'var(--font-mono)', fontSize:13 }} placeholder="<p>Write your content here...</p>" value={form.content} onChange={e => setForm(f=>({...f,content:e.target.value}))} />
              </div>
              <div style={{ display:'flex', gap:20, alignItems:'center' }}>
                <div>
                  <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:8 }}>Status</label>
                  <select className="input-field" value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))}>
                    <option>DRAFT</option><option>PUBLISHED</option><option>ARCHIVED</option>
                  </select>
                </div>
                <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', marginTop:20 }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f=>({...f,featured:e.target.checked}))} style={{ width:16, height:16, accentColor:'var(--gold)' }} />
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:13, color:'var(--gray1)' }}>Featured Post ★</span>
                </label>
              </div>
            </div>

            <div style={{ padding:'0 28px 28px', display:'flex', gap:12 }}>
              <button onClick={() => setShowEditor(false)} style={{ flex:1, padding:'13px', borderRadius:8, border:'1px solid var(--border2)', background:'transparent', color:'var(--gray2)', fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer' }}>Cancel</button>
              <button style={{ flex:2, padding:'13px', borderRadius:8, border:'none', background:'var(--neon)', color:'var(--black)', fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', boxShadow:'0 0 20px rgba(0,212,255,0.35)' }}>Publish Post</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
