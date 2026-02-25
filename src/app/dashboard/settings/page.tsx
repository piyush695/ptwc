'use client'
// src/app/dashboard/settings/page.tsx
import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const TRADER = { displayName:'AlphaTrader', country:'United Arab Emirates', countryCode:'AE', status:'ACTIVE', kycStatus:'APPROVED', rank:3, returnPct:14.82 }

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({ firstName:'Ahmad', lastName:'Al-Rashid', displayName:'AlphaTrader', email:'ahmad@example.com', phone:'+971501234567' })
  const [notifSettings, setNotifSettings] = useState({ emailTrades:true, emailRankChange:true, emailMatchStart:true, emailDrawdown:true, smsAlerts:false, drawdownThreshold:'6' })
  const [security, setSecurity] = useState({ currentPw:'', newPw:'', confirmPw:'' })

  const pf = (k: string, v: string) => setProfile(p => ({...p,[k]:v}))
  const nf = (k: string, v: string | boolean) => setNotifSettings(p => ({...p,[k]:v}))
  const sf = (k: string, v: string) => setSecurity(p => ({...p,[k]:v}))

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }

  const TABS = [
    { id:'profile',  label:'Profile'       },
    { id:'security', label:'Security'      },
    { id:'notifs',   label:'Notifications' },
    { id:'danger',   label:'Danger Zone'   },
  ]

  const Label = ({ children }: any) => (
    <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray2)', marginBottom:8 }}>
      {children}
    </label>
  )

  const Toggle = ({ on, onChange, label }: { on:boolean; onChange:(v:boolean)=>void; label:string }) => (
    <label style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
      <span style={{ fontSize:14, color:'var(--gray1)' }}>{label}</span>
      <div
        onClick={() => onChange(!on)}
        style={{ width:44, height:24, borderRadius:12, background: on ? 'var(--neon)' : 'var(--surface2)', border:`1px solid ${on?'var(--neon)':'var(--border2)'}`, position:'relative', transition:'all 0.2s', cursor:'pointer', flexShrink:0, boxShadow: on ? '0 0 10px rgba(0,212,255,0.4)' : 'none' }}
      >
        <div style={{ position:'absolute', top:2, left: on ? 22 : 2, width:18, height:18, borderRadius:'50%', background:'var(--white)', transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.4)' }} />
      </div>
    </label>
  )

  return (
    <DashboardLayout trader={TRADER}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--neon)', marginBottom:8 }}>Account</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:36, color:'var(--white)', lineHeight:1 }}>Settings</h1>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          {saved && (
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(0,230,118,0.1)', border:'1px solid rgba(0,230,118,0.25)', borderRadius:8, padding:'10px 16px' }}>
              <span style={{ color:'var(--green)' }}>✓</span>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:12, letterSpacing:'0.08em', color:'var(--green)' }}>SAVED</span>
            </div>
          )}
          {activeTab !== 'danger' && (
            <button onClick={handleSave} style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', padding:'12px 28px', borderRadius:8, border:'none', cursor:'pointer', background:'var(--neon)', color:'var(--black)', boxShadow:'0 0 18px rgba(0,212,255,0.35)' }}>
              Save Changes
            </button>
          )}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:24, maxWidth:820 }}>

        {/* Tab nav */}
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ fontFamily:'var(--font-display)', fontWeight: activeTab===tab.id ? 800 : 600, fontSize:13, letterSpacing:'0.04em', padding:'12px 16px', borderRadius:8, border:'none', cursor:'pointer', textAlign:'left', background: activeTab===tab.id ? 'rgba(0,212,255,0.1)' : 'transparent', color: activeTab===tab.id ? 'var(--neon)' : 'var(--gray2)', borderRight: `2px solid ${activeTab===tab.id ? 'var(--neon)' : 'transparent'}`, transition:'all 0.15s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>

          {/* ── PROFILE ──────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:28 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:16, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--white)', marginBottom:24 }}>Profile Information</div>

              {/* Avatar */}
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28, paddingBottom:24, borderBottom:'1px solid var(--border)' }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--surface2)', border:'2px solid var(--neon)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontFamily:'var(--font-display)', fontWeight:900, color:'var(--neon)' }}>
                  {profile.firstName.charAt(0)}
                </div>
                <div>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:'var(--white)' }}>{profile.displayName}</div>
                  <div style={{ fontSize:13, color:'var(--gray3)', marginTop:3 }}>{profile.email}</div>
                  <button style={{ marginTop:8, fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', padding:'5px 12px', borderRadius:5, border:'1px solid var(--border2)', background:'transparent', color:'var(--gray2)', cursor:'pointer' }}>
                    Change Avatar
                  </button>
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div><Label>First Name</Label><input className="input-field" value={profile.firstName} onChange={e=>pf('firstName',e.target.value)} /></div>
                  <div><Label>Last Name</Label><input className="input-field" value={profile.lastName} onChange={e=>pf('lastName',e.target.value)} /></div>
                </div>
                <div>
                  <Label>Display Name <span style={{ fontFamily:'var(--font-body)', fontWeight:400, textTransform:'none', letterSpacing:0, fontSize:10, color:'var(--gray3)' }}>— shown on leaderboard</span></Label>
                  <input className="input-field" value={profile.displayName} onChange={e=>pf('displayName',e.target.value)} />
                </div>
                <div><Label>Email</Label><input className="input-field" type="email" value={profile.email} onChange={e=>pf('email',e.target.value)} /></div>
                <div><Label>Phone</Label><input className="input-field" type="tel" value={profile.phone} onChange={e=>pf('phone',e.target.value)} /></div>
                <div>
                  <Label>Country</Label>
                  <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:8, padding:'12px 16px' }}>
                    <img src={`https://flagcdn.com/w40/ae.png`} alt="UAE" style={{ width:24, height:16, objectFit:'cover', borderRadius:2 }} />
                    <span style={{ fontSize:14, color:'var(--gray2)' }}>United Arab Emirates</span>
                    <span style={{ marginLeft:'auto', fontSize:12, color:'var(--gray3)' }}>Cannot be changed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SECURITY ─────────────────────────────────────── */}
          {activeTab === 'security' && (
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:28 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:16, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--white)', marginBottom:24 }}>Change Password</div>
              <div style={{ display:'flex', flexDirection:'column', gap:16, maxWidth:400 }}>
                <div><Label>Current Password</Label><input className="input-field" type="password" placeholder="••••••••" value={security.currentPw} onChange={e=>sf('currentPw',e.target.value)} /></div>
                <div><Label>New Password</Label><input className="input-field" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" value={security.newPw} onChange={e=>sf('newPw',e.target.value)} /></div>
                <div><Label>Confirm New Password</Label><input className="input-field" type="password" placeholder="Repeat new password" value={security.confirmPw} onChange={e=>sf('confirmPw',e.target.value)} /></div>
                <button onClick={handleSave} style={{ padding:'13px', borderRadius:8, border:'none', background:'var(--neon)', color:'var(--black)', fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', boxShadow:'0 0 16px rgba(0,212,255,0.3)' }}>
                  Update Password
                </button>
              </div>

              <div style={{ marginTop:32, paddingTop:28, borderTop:'1px solid var(--border)' }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:14, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--white)', marginBottom:16 }}>Two-Factor Authentication</div>
                <div style={{ background:'var(--deep)', border:'1px solid var(--border)', borderRadius:10, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, color:'var(--gray1)' }}>Authenticator App (2FA)</div>
                    <div style={{ fontSize:12, color:'var(--gray3)', marginTop:3 }}>Use Google Authenticator or Authy</div>
                  </div>
                  <button style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', padding:'9px 16px', borderRadius:7, border:'1px solid var(--border2)', background:'transparent', color:'var(--neon)', cursor:'pointer' }}>
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ────────────────────────────────── */}
          {activeTab === 'notifs' && (
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:28 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:16, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--white)', marginBottom:24 }}>Notification Preferences</div>

              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray3)', marginBottom:10 }}>Email Notifications</div>
              <Toggle on={notifSettings.emailTrades}     onChange={v=>nf('emailTrades',v)}     label="Trade confirmations & executions" />
              <Toggle on={notifSettings.emailRankChange} onChange={v=>nf('emailRankChange',v)} label="Rank changes (up or down)" />
              <Toggle on={notifSettings.emailMatchStart} onChange={v=>nf('emailMatchStart',v)} label="Match start & result announcements" />
              <Toggle on={notifSettings.emailDrawdown}   onChange={v=>nf('emailDrawdown',v)}   label="Drawdown warning alerts" />

              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray3)', margin:'20px 0 10px' }}>SMS Alerts</div>
              <Toggle on={notifSettings.smsAlerts} onChange={v=>nf('smsAlerts',v)} label="Critical alerts via SMS (drawdown breach, DQ risk)" />

              <div style={{ marginTop:20 }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gray3)', marginBottom:10 }}>Drawdown Warning Threshold</div>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <input type="range" min="3" max="7" step="0.5" value={notifSettings.drawdownThreshold} onChange={e=>nf('drawdownThreshold',e.target.value)} style={{ flex:1, accentColor:'var(--neon)' }} />
                  <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, fontSize:16, color:'var(--gold)', minWidth:40, textAlign:'right' }}>{notifSettings.drawdownThreshold}%</span>
                </div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--gray3)', marginTop:6 }}>
                  Alert when daily drawdown exceeds {notifSettings.drawdownThreshold}% (limit is 8%)
                </div>
              </div>
            </div>
          )}

          {/* ── DANGER ZONE ──────────────────────────────────── */}
          {activeTab === 'danger' && (
            <div style={{ background:'rgba(255,56,96,0.04)', border:'1px solid rgba(255,56,96,0.2)', borderRadius:12, padding:28 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:16, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--red)', marginBottom:24 }}>⚠ Danger Zone</div>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 }}>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:15, color:'var(--white)' }}>Withdraw from Tournament</div>
                    <div style={{ fontSize:13, color:'var(--gray3)', marginTop:4 }}>This will forfeit your entry. Your country's slot will open to other traders.</div>
                  </div>
                  <button style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', padding:'10px 20px', borderRadius:7, border:'1px solid rgba(255,56,96,0.4)', background:'rgba(255,56,96,0.1)', color:'var(--red)', cursor:'pointer', flexShrink:0 }}>
                    Withdraw
                  </button>
                </div>
                <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 }}>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:15, color:'var(--white)' }}>Delete Account</div>
                    <div style={{ fontSize:13, color:'var(--gray3)', marginTop:4 }}>Permanently delete your account and all data. This cannot be undone.</div>
                  </div>
                  <button style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', padding:'10px 20px', borderRadius:7, border:'1px solid rgba(255,56,96,0.4)', background:'rgba(255,56,96,0.1)', color:'var(--red)', cursor:'pointer', flexShrink:0 }}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  )
}
