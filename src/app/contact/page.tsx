'use client'
// src/app/contact/page.tsx
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [category, setCategory] = useState('general')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setSent(true)
    setLoading(false)
  }

  const CATEGORIES = [
    { id: 'general',    label: 'General Enquiry' },
    { id: 'kyc',        label: 'KYC / Verification' },
    { id: 'technical',  label: 'Technical Support' },
    { id: 'account',    label: 'Trading Account' },
    { id: 'prize',      label: 'Prize / Payment' },
    { id: 'rules',      label: 'Rules Question' },
  ]

  const CONTACTS = [
    { icon: '✉', label: 'General Support',  value: 'support@holaprime.com',    href: 'mailto:support@holaprime.com' },
    { icon: '🔒', label: 'KYC & Compliance', value: 'kyc@holaprime.com',        href: 'mailto:kyc@holaprime.com' },
    { icon: '⚖', label: 'Legal',            value: 'legal@holaprime.com',      href: 'mailto:legal@holaprime.com' },
    { icon: '🏆', label: 'Tournament Rules', value: 'rules@holaprime.com',      href: 'mailto:rules@holaprime.com' },
  ]

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '120px 32px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--neon)', marginBottom: 12 }}>Support</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px,6vw,72px)', textTransform: 'uppercase', color: 'var(--white)', lineHeight: 0.95, margin: '0 0 20px' }}>
            Get in<br /><span className="text-shimmer">Touch</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--gray2)', maxWidth: 480, lineHeight: 1.7 }}>
            Our team typically responds within 24 hours. For urgent account issues, use the KYC or Technical Support categories.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* Form */}
          {!sent ? (
            <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Category selector */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray2)', marginBottom: 10 }}>Category</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {CATEGORIES.map(c => (
                    <button key={c.id} type="button" onClick={() => setCategory(c.id)} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', padding: '8px 14px', borderRadius: 7, border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', background: category === c.id ? 'rgba(0,212,255,0.12)' : 'transparent', color: category === c.id ? 'var(--neon)' : 'var(--gray3)', borderColor: category === c.id ? 'rgba(0,212,255,0.4)' : 'var(--border)' }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name + email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray2)', marginBottom: 8 }}>Full Name</label>
                  <input className="input-field" placeholder="Alex Smith" value={form.name} onChange={e => f('name', e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray2)', marginBottom: 8 }}>Email</label>
                  <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => f('email', e.target.value)} required />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray2)', marginBottom: 8 }}>Subject</label>
                <input className="input-field" placeholder="Brief description of your issue" value={form.subject} onChange={e => f('subject', e.target.value)} required />
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray2)', marginBottom: 8 }}>Message</label>
                <textarea className="input-field" placeholder="Please describe your issue in as much detail as possible..." value={form.message} onChange={e => f('message', e.target.value)} required rows={6} style={{ resize: 'vertical', minHeight: 140, fontFamily: 'inherit', lineHeight: 1.6 }} />
              </div>

              <button type="submit" disabled={loading} style={{ padding: '15px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? 'rgba(0,212,255,0.3)' : 'var(--neon)', color: 'var(--black)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', boxShadow: loading ? 'none' : '0 0 20px rgba(0,212,255,0.35)', transition: 'all 0.2s' }}>
                {loading ? 'Sending...' : '→ Send Message'}
              </button>
            </form>
          ) : (
            <div style={{ background: 'var(--surface)', border: '1px solid rgba(0,230,118,0.25)', borderRadius: 16, padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,230,118,0.1)', border: '2px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: '0 0 24px rgba(0,230,118,0.2)' }}>✓</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: 'var(--white)', textTransform: 'uppercase', margin: 0 }}>Message Sent!</h2>
              <p style={{ fontSize: 15, color: 'var(--gray2)', lineHeight: 1.7, maxWidth: 360 }}>
                We've received your message and will reply to <strong style={{ color: 'var(--neon)' }}>{form.email}</strong> within 24 hours.
              </p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border2)', background: 'transparent', color: 'var(--gray2)', cursor: 'pointer', marginTop: 8 }}>
                Send Another
              </button>
            </div>
          )}

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Response time */}
            <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 14, padding: '20px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--neon)', marginBottom: 14 }}>Response Times</div>
              {[
                { label: 'General',   time: '24–48 hours' },
                { label: 'KYC',       time: '24–48 hours' },
                { label: 'Technical', time: '4–12 hours'  },
                { label: 'Prizes',    time: '48–72 hours' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray3)' }}>{r.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray1)' }}>{r.time}</span>
                </div>
              ))}
            </div>

            {/* Direct emails */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--white)', marginBottom: 14 }}>Direct Contact</div>
              {CONTACTS.map(c => (
                <a key={c.label} href={c.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', transition: 'all 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.75'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                >
                  <span style={{ fontSize: 18, flexShrink: 0, width: 28, textAlign: 'center' }}>{c.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray3)', marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--neon)' }}>{c.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Live chat note */}
            <div style={{ background: 'rgba(240,192,64,0.05)', border: '1px solid rgba(240,192,64,0.18)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>Live Chat</div>
              <div style={{ fontSize: 13, color: 'var(--gray3)', lineHeight: 1.6 }}>Available Mon–Fri, 09:00–18:00 GST. Use the chat bubble on the bottom right when available.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
