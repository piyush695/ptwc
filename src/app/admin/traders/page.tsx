'use client'
// src/app/admin/traders/page.tsx
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

const MOCK_TRADERS = [
  { id:'t1', display:'AlphaTrader', name:'Ahmad Al-Rashid', email:'ahmad@example.com', country:'🇦🇪', cc:'AE', status:'ACTIVE',       ret:'+24.8%', dd:'2.1%', trades:34, kyc:'2024-05-02', account:'HP-WC-A1B2' },
  { id:'t2', display:'NightFX',     name:'Emeka Okafor',   email:'emeka@example.com', country:'🇳🇬', cc:'NG', status:'ACTIVE',       ret:'+21.3%', dd:'3.4%', trades:28, kyc:'2024-05-03', account:'HP-WC-C3D4' },
  { id:'t3', display:'GoldenPip',   name:'Ravi Sharma',    email:'ravi@example.com',  country:'🇮🇳', cc:'IN', status:'KYC_PENDING',  ret:'—',      dd:'—',    trades:0,  kyc:null,          account:null         },
  { id:'t4', display:'WaveRider',   name:'James Smith',    email:'james@example.com', country:'🇬🇧', cc:'GB', status:'KYC_PENDING',  ret:'—',      dd:'—',    trades:0,  kyc:null,          account:null         },
  { id:'t5', display:'StrikeFX',    name:'Thabo Nkosi',    email:'thabo@example.com', country:'🇿🇦', cc:'ZA', status:'ACTIVE',       ret:'+15.8%', dd:'2.9%', trades:31, kyc:'2024-05-01', account:'HP-WC-E5F6' },
  { id:'t6', display:'DeltaEdge',   name:'Amir Hassan',    email:'amir@example.com',  country:'🇲🇾', cc:'MY', status:'DISQUALIFIED', ret:'+4.2%',  dd:'12.1%',trades:18, kyc:'2024-04-30', account:'HP-WC-G7H8' },
  { id:'t7', display:'PhoenixFX',   name:'Ali Khan',       email:'ali@example.com',   country:'🇵🇰', cc:'PK', status:'ACTIVE',       ret:'+18.9%', dd:'1.5%', trades:44, kyc:'2024-05-02', account:'HP-WC-I9J0' },
  { id:'t8', display:'ZeroLoss',    name:'David Kimani',   email:'david@example.com', country:'🇰🇪', cc:'KE', status:'KYC_REJECTED', ret:'—',      dd:'—',    trades:0,  kyc:null,          account:null         },
]

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  ACTIVE:       { label: 'Active',       color: 'var(--green)', bg: 'rgba(0,230,118,0.1)',  border: 'rgba(0,230,118,0.25)'  },
  KYC_PENDING:  { label: 'KYC Pending',  color: 'var(--gold)',  bg: 'rgba(240,192,64,0.1)', border: 'rgba(240,192,64,0.25)' },
  KYC_APPROVED: { label: 'KYC Approved', color: 'var(--neon)',  bg: 'rgba(0,212,255,0.1)',  border: 'rgba(0,212,255,0.25)'  },
  KYC_REJECTED: { label: 'KYC Rejected', color: 'var(--red)',   bg: 'rgba(255,56,96,0.1)',  border: 'rgba(255,56,96,0.25)'  },
  DISQUALIFIED: { label: 'Disqualified', color: 'var(--red)',   bg: 'rgba(255,56,96,0.1)',  border: 'rgba(255,56,96,0.25)'  },
  ELIMINATED:   { label: 'Eliminated',   color: 'var(--gray2)', bg: 'rgba(74,85,128,0.2)',  border: 'var(--border2)'        },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.ELIMINATED
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '4px 10px', borderRadius: 4,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  )
}

export default function AdminTradersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<typeof MOCK_TRADERS[0] | null>(null)

  const filtered = MOCK_TRADERS.filter(t => {
    const matchSearch = !search || t.display.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    all: MOCK_TRADERS.length,
    pending: MOCK_TRADERS.filter(t => t.status === 'KYC_PENDING').length,
    active: MOCK_TRADERS.filter(t => t.status === 'ACTIVE').length,
    dq: MOCK_TRADERS.filter(t => t.status === 'DISQUALIFIED').length,
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--neon)', marginBottom: 8 }}>
          Trader Management
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 36, color: 'var(--white)', lineHeight: 1 }}>
          Traders & KYC
        </h1>
      </div>

      {/* Tab filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: `All Traders (${counts.all})`,      value: ''              },
          { label: `KYC Pending (${counts.pending})`,  value: 'KYC_PENDING'  },
          { label: `Active (${counts.active})`,         value: 'ACTIVE'       },
          { label: `Disqualified (${counts.dq})`,      value: 'DISQUALIFIED' },
        ].map(tab => (
          <button key={tab.value} onClick={() => setStatusFilter(tab.value)} style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '10px 18px', borderRadius: 8, cursor: 'pointer', border: 'none',
            background: statusFilter === tab.value ? 'var(--neon)' : 'var(--surface)',
            color: statusFilter === tab.value ? 'var(--black)' : 'var(--gray2)',
            boxShadow: statusFilter === tab.value ? '0 0 16px rgba(0,212,255,0.35)' : 'none',
            transition: 'all 0.2s',
          }}>{tab.label}</button>
        ))}

        {/* Search */}
        <div style={{ marginLeft: 'auto' }}>
          <input className="input-field" placeholder="🔍  Search traders..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 260, padding: '10px 16px', fontSize: 14 }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--deep)' }}>
              {['Trader','Country','Status','Account','Return','Max DD','Trades','Actions'].map((h, i) => (
                <th key={h} style={{ padding: '14px 20px', textAlign: i > 3 ? 'right' : 'left', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray3)', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(trader => (
              <tr key={trader.id} className="tr-hover" onClick={() => setSelected(trader)}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--white)' }}>{trader.display}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray3)', marginTop: 2 }}>{trader.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gray3)' }}>{trader.email}</div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{trader.country}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray2)' }}>{trader.cc}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <StatusBadge status={trader.status} />
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {trader.account
                    ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray1)' }}>{trader.account}</span>
                    : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray3)' }}>—</span>
                  }
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: trader.ret.startsWith('+') ? 'var(--green)' : trader.ret === '—' ? 'var(--gray3)' : 'var(--red)' }}>
                    {trader.ret}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: trader.dd === '—' ? 'var(--gray3)' : parseFloat(trader.dd) > 8 ? 'var(--red)' : 'var(--green)' }}>
                    {trader.dd}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gray1)' }}>{trader.trades || '—'}</span>
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                    {trader.status === 'KYC_PENDING' && (
                      <>
                        <button style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: 'rgba(0,230,118,0.12)', color: 'var(--green)', transition: 'all 0.15s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,230,118,0.2)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,230,118,0.12)'}
                        >✓ APPROVE</button>
                        <button style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: 'rgba(255,56,96,0.12)', color: 'var(--red)', transition: 'all 0.15s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,56,96,0.2)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,56,96,0.12)'}
                        >✕ REJECT</button>
                      </>
                    )}
                    <button onClick={() => setSelected(trader)} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border2)', cursor: 'pointer', background: 'transparent', color: 'var(--gray2)', transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--neon)'; (e.currentTarget as HTMLElement).style.color = 'var(--neon)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.color = 'var(--gray2)' }}
                    >VIEW</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--gray3)', fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            No traders found
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--deep)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray3)' }}>Showing {filtered.length} of {MOCK_TRADERS.length} traders</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', padding: '7px 14px', borderRadius: 6, border: '1px solid var(--border2)', background: 'transparent', color: 'var(--gray2)', cursor: 'pointer' }}>← Prev</button>
            <button style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', padding: '7px 14px', borderRadius: 6, border: '1px solid var(--border2)', background: 'transparent', color: 'var(--gray2)', cursor: 'pointer' }}>Next →</button>
          </div>
        </div>
      </div>

      {/* Trader detail drawer */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(3,4,10,0.7)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setSelected(null)}>
          <div style={{ width: 460, background: 'var(--deep)', borderLeft: '1px solid var(--border)', height: '100%', overflowY: 'auto', padding: 32, animation: 'slideIn 0.25s ease' }} onClick={e => e.stopPropagation()}>

            {/* Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div>
                <StatusBadge status={selected.status} />
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: 'var(--white)', marginTop: 8, lineHeight: 1 }}>{selected.display}</h2>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray3)', marginTop: 4 }}>{selected.email}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray3)', fontSize: 24, padding: 4, lineHeight: 1 }}>×</button>
            </div>

            {/* Country + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
              <span style={{ fontSize: 40 }}>{selected.country}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: 'var(--white)' }}>{selected.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gray3)' }}>Representing {selected.cc}</div>
              </div>
            </div>

            {/* Stats */}
            {selected.account && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Return', value: selected.ret, color: selected.ret.startsWith('+') ? 'var(--green)' : 'var(--red)' },
                  { label: 'Max DD', value: selected.dd, color: parseFloat(selected.dd) > 8 ? 'var(--red)' : 'var(--green)' },
                  { label: 'Trades', value: String(selected.trades), color: 'var(--white)' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 14px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 22, color: s.color }}>{s.value}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray3)', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Account info */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px', marginBottom: 20 }}>
              {[
                ['Account Number', selected.account || 'Not provisioned'],
                ['KYC Verified', selected.kyc || 'Pending'],
                ['Status', selected.status.replace(/_/g, ' ')],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray3)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gray1)' }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selected.status === 'KYC_PENDING' && (
                <>
                  <button style={{ padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--green)', color: 'var(--black)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    ✓ Approve KYC
                  </button>
                  <button style={{ padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,56,96,0.12)', color: 'var(--red)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid rgba(255,56,96,0.25)' }}>
                    ✕ Reject KYC
                  </button>
                </>
              )}
              {['ACTIVE', 'KYC_APPROVED'].includes(selected.status) && (
                <button style={{ padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,56,96,0.10)', color: 'var(--red)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid rgba(255,56,96,0.25)' }}>
                  ⚠ Disqualify Trader
                </button>
              )}
              <button style={{ padding: '13px', borderRadius: 8, cursor: 'pointer', background: 'transparent', color: 'var(--neon)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid rgba(0,212,255,0.25)' }}>
                ✉ Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </AdminLayout>
  )
}
