'use client'

import { History, FileSpreadsheet } from 'lucide-react'
import { EXAMPLE_QUERIES, HistoryItem, Filiere } from '@/lib/data'

const TAG_COLORS: Record<Filiere, { bg: string; color: string; border: string }> = {
  PV:       { bg: '#0F2238', color: '#00D4AA', border: '#1E3A5F' },
  EE:       { bg: '#1C1800', color: '#F4C842', border: '#854D0E' },
  BESS:     { bg: '#1A0F2E', color: '#A78BFA', border: '#6D28D9' },
  IRVE:     { bg: '#0F1F0F', color: '#6EE7B7', border: '#166534' },
  CPE:      { bg: '#0A1F1F', color: '#67E8F9', border: '#155E75' },
  'E-BOILER': { bg: '#1F0A0A', color: '#FCA5A5', border: '#991B1B' },
}

interface SidebarProps {
  activeExample: number | null
  history: HistoryItem[]
  onSelectExample: (idx: number) => void
  onSelectHistory: (query: string) => void
}

export default function Sidebar({ activeExample, history, onSelectExample, onSelectHistory }: SidebarProps) {
  return (
    <aside
      style={{
        width: 220,
        background: '#111827',
        borderRight: '1px solid #1E2D45',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {/* Examples */}
      <div style={{ padding: '12px 12px 6px' }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.8px',
            color: '#4B5563',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Requêtes GreenYellow
        </div>

        {EXAMPLE_QUERIES.map((ex, i) => {
          const tagStyle = TAG_COLORS[ex.tag] ?? TAG_COLORS.PV
          const isActive = activeExample === i
          return (
            <button
              key={i}
              onClick={() => onSelectExample(i)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '7px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 11,
                color: isActive ? tagStyle.color : '#9CA3AF',
                lineHeight: 1.4,
                marginBottom: 4,
                border: `1px solid ${isActive ? tagStyle.border : 'transparent'}`,
                background: isActive ? tagStyle.bg : 'transparent',
                transition: 'all 0.15s',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = '#1E293B'
                  e.currentTarget.style.borderColor = '#1E3A5F'
                  e.currentTarget.style.color = '#E5E7EB'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.color = '#9CA3AF'
                }
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 9,
                    padding: '1px 5px',
                    borderRadius: 3,
                    marginBottom: 3,
                    fontWeight: 600,
                    background: tagStyle.bg,
                    color: tagStyle.color,
                    border: `1px solid ${tagStyle.border}`,
                  }}
                >
                  {ex.tag}
                </span>
              </div>
              {ex.label}
            </button>
          )
        })}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ padding: '12px 12px 6px', marginTop: 8 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.8px',
              color: '#4B5563',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Historique
          </div>

          {history.slice(0, 6).map(item => (
            <button
              key={item.id}
              onClick={() => onSelectHistory(item.query)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '6px 10px',
                fontSize: 11,
                color: '#6B7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 6,
                borderRadius: 5,
                marginBottom: 2,
                border: 'none',
                background: 'transparent',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1E293B'
                e.currentTarget.style.color = '#9CA3AF'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#6B7280'
              }}
            >
              <History size={11} color="#4B5563" style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {item.query.slice(0, 60)}...
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Export note */}
      <div style={{ padding: 12, marginTop: 'auto' }}>
        <div style={{ fontSize: 9, color: '#374151', textAlign: 'center', lineHeight: 1.4 }}>
          <FileSpreadsheet size={12} color="#374151" style={{ display: 'block', margin: '0 auto 4px' }} />
          Export TSV → Excel / Salesforce
          <br />
          via le bouton en haut à droite
        </div>
      </div>
    </aside>
  )
}
