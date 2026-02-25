'use client'
// src/app/dashboard/kyc/page.tsx
import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const TRADER = { displayName:'AlphaTrader', country:'United Arab Emirates', countryCode:'AE', status:'ACTIVE', kycStatus:'APPROVED', rank:3, returnPct:14.82 }

const KYC_STEPS = [
  { id:1, label:'Identity Verification',    desc:'Government-issued ID (passport, national ID, or driving licence)',  status:'APPROVED',  icon:'🪪' },
  { id:2, label:'Proof of Address',         desc:'Utility bill or bank statement (not older than 3 months)',           status:'APPROVED',  icon:'🏠' },
  { id:3, label:'Selfie Verification',      desc:'Clear selfie holding your ID next to your face',                     status:'APPROVED',  icon:'📸' },
  { id:4, label:'Agreement & Consent',      desc:'Tournament rules, risk disclosure, and participant agreement',       status:'APPROVED',  icon:'📄' },
]

const statusCfg: Record<string, { color:string; bg:string; border:string; label:string }> = {
  APPROVED:  { color:'var(--green)', bg:'rgba(0,230,118,0.1)',  border:'rgba(0,230,118,0.3)',  label:'Approved'  },
  PENDING:   { color:'var(--gold)',  bg:'rgba(240,192,64,0.1)', border:'rgba(240,192,64,0.3)', label:'Pending'   },
  REJECTED:  { color:'var(--red)',   bg:'rgba(255,56,96,0.1)',  border:'rgba(255,56,96,0.3)',  label:'Rejected'  },
  REQUIRED:  { color:'var(--gray3)',bg:'rgba(74,85,128,0.15)', border:'var(--border2)',        label:'Required'  },
}

export default function KYCPage() {
  const [activeStep, setActiveStep] = useState<number|null>(null)
  const allApproved = KYC_STEPS.every(s => s.status === 'APPROVED')

  return (
    <DashboardLayout trader={TRADER}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--neon)', marginBottom:8 }}>Account Verification</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:36, color:'var(--white)', lineHeight:1 }}>KYC / Identity Verification</h1>
      </div>

      {/* Overall status banner */}
      {allApproved ? (
        <div style={{ background:'rgba(0,230,118,0.07)', border:'1px solid rgba(0,230,118,0.3)', borderRadius:14, padding:'24px 28px', marginBottom:28, display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(0,230,118,0.15)', border:'2px solid var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>✓</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:20, color:'var(--green)' }}>KYC Fully Approved</div>
            <div style={{ fontSize:14, color:'var(--gray2)', marginTop:4 }}>Your identity has been verified. Your $10,000 trading account is fully active.</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gray3)' }}>Approved</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--green)', marginTop:4 }}>May 2, 2026</div>
          </div>
        </div>
      ) : (
        <div style={{ background:'rgba(240,192,64,0.07)', border:'1px solid rgba(240,192,64,0.3)', borderRadius:14, padding:'24px 28px', marginBottom:28, display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(240,192,64,0.12)', border:'2px solid var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>⚠️</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:20, color:'var(--gold)' }}>KYC Verification Required</div>
            <div style={{ fontSize:14, color:'var(--gray2)', marginTop:4 }}>Complete all steps below to activate your trading account and enter the qualifier.</div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'20px 24px', marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--white)' }}>Verification Progress</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--green)', fontWeight:700 }}>
            {KYC_STEPS.filter(s=>s.status==='APPROVED').length}/{KYC_STEPS.length} steps complete
          </span>
        </div>
        <div style={{ height:6, background:'var(--surface2)', borderRadius:3, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${(KYC_STEPS.filter(s=>s.status==='APPROVED').length/KYC_STEPS.length)*100}%`, background:'linear-gradient(90deg,var(--neon),var(--green))', borderRadius:3, boxShadow:'0 0 8px rgba(0,212,255,0.5)', transition:'width 0.6s ease' }} />
        </div>
      </div>

      {/* KYC steps */}
      <div style={{ display:'flex', flexDirection:'column', gap:12, maxWidth:700 }}>
        {KYC_STEPS.map(step => {
          const cfg = statusCfg[step.status]
          const expanded = activeStep === step.id

          return (
            <div key={step.id} style={{ background:'var(--surface)', border:`1px solid ${step.status==='APPROVED'?'rgba(0,230,118,0.15)':step.status==='REJECTED'?'rgba(255,56,96,0.25)':'var(--border)'}`, borderRadius:12, overflow:'hidden' }}>
              {/* Header row */}
              <div
                style={{ padding:'20px 24px', display:'flex', alignItems:'center', gap:16, cursor: step.status !== 'APPROVED' ? 'pointer' : 'default' }}
                onClick={() => step.status !== 'APPROVED' && setActiveStep(expanded ? null : step.id)}
              >
                {/* Step icon */}
                <div style={{ width:48, height:48, borderRadius:10, background: step.status==='APPROVED'?'rgba(0,230,118,0.1)':'var(--surface2)', border:`1px solid ${cfg.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                  {step.status === 'APPROVED' ? '✓' : step.icon}
                </div>

                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:15, color:'var(--white)' }}>{step.label}</div>
                  <div style={{ fontSize:13, color:'var(--gray3)', marginTop:3 }}>{step.desc}</div>
                </div>

                {/* Status badge */}
                <div style={{ flexShrink:0, display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', padding:'5px 12px', borderRadius:6, color:cfg.color, background:cfg.bg, border:`1px solid ${cfg.border}` }}>
                    {cfg.label}
                  </span>
                  {step.status !== 'APPROVED' && (
                    <span style={{ color:'var(--gray3)', fontSize:16 }}>{expanded ? '▲' : '▼'}</span>
                  )}
                </div>
              </div>

              {/* Expanded upload area for non-approved */}
              {expanded && step.status !== 'APPROVED' && (
                <div style={{ padding:'0 24px 24px', borderTop:'1px solid var(--border)' }}>
                  <div style={{ paddingTop:20 }}>
                    <div style={{ border:'2px dashed var(--border2)', borderRadius:10, padding:'32px', textAlign:'center', cursor:'pointer', transition:'all 0.2s', background:'var(--deep)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='var(--neon)'; (e.currentTarget as HTMLElement).style.background='rgba(0,212,255,0.03)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='var(--border2)'; (e.currentTarget as HTMLElement).style.background='var(--deep)' }}
                    >
                      <div style={{ fontSize:28, marginBottom:10 }}>📁</div>
                      <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:13, color:'var(--white)', marginBottom:6 }}>Drop your file here or click to browse</div>
                      <div style={{ fontSize:12, color:'var(--gray3)' }}>JPG, PNG or PDF · Max 10MB</div>
                    </div>
                    <button style={{ width:'100%', marginTop:12, padding:'12px', borderRadius:8, border:'none', background:'var(--neon)', color:'var(--black)', fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', boxShadow:'0 0 16px rgba(0,212,255,0.3)' }}>
                      Upload Document
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Info box */}
      <div style={{ maxWidth:700, marginTop:20, background:'rgba(0,212,255,0.04)', border:'1px solid rgba(0,212,255,0.15)', borderRadius:12, padding:'16px 20px' }}>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, color:'var(--neon)', marginBottom:8 }}>ℹ KYC takes 24–48 hours</div>
        <div style={{ fontSize:13, color:'var(--gray2)', lineHeight:1.6 }}>
          Documents are reviewed by our compliance team. You'll receive an email once approved. If rejected, you'll see the reason and can resubmit. Questions? Email <span style={{ color:'var(--neon)' }}>kyc@holaprime.com</span>
        </div>
      </div>
    </DashboardLayout>
  )
}
