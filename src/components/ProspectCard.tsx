'use client'

import { Send } from 'lucide-react'
import { Prospect, SignalType } from '@/lib/data'

const SIGNAL_STYLES: Record<SignalType, { bg: string; color: string; border: string }> = {
  expansion: { bg: '#0A1F0A', color: '#6EE7B7', border: '#166534' },
  energy:    { bg: '#1C1800', color: '#F4C842', border: '#854D0E' },
  tender:    { bg: '#0F0A1F', color: '#A78BFA', border: '#6D28D9' },
  cpe:       { bg: '#0A1F1F', color: '#67E8F9', border: '#155E75' },
  bess:      { bg: '#0F0A1F', color: '#C4B5FD', border: '#5B21B6' },
}

interface ProspectCardProps {
  prospect: Prospect
  isSelected: boolean
  onClick: () => void
  onQuickApproach: () => void
}

export default function ProspectCard({ prospect, isSelected, onClick, onQuickApproach }: ProspectCardProps) {
  const scoreClass =
    prospect.score >= 85 ? { bg: '#0A2218', border: '#00D4AA', color: '#00D4AA' } :
    prospect.score >= 75 ? { bg: '#1C1800', border: '#F4C842', color: '#F4C842' } :
                           { bg: '#1A0A00', border: '#FB923C', color: '#FB923C' }

  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? '#0A1A24' : '#111827',
        border: `1px solid ${isSelected ? '#00D4AA' : '#1E2D45'}`,
        borderRadius: 8,
        padding: '12px 14px',
        marginBottom: 8,
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#1E3A5F'
          e.currentTarget.style.background = '#131F33'
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#1E2D45'
          e.currentTarget.style.background = '#111827'
        }
      }}
    >
      {/* Score ring */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 500,
          flexShrink: 0,
          background: scoreClass.bg,
          border: `1.5px solid ${scoreClass.border}`,
          color: scoreClass.color,
        }}
      >
        {prospect.score}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: '#E5E7EB',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 140,
            }}
          >
            {prospect.name}
          </span>
          {prospect.signals.slice(0, 1).map((sig, i) => {
            const style = SIGNAL_STYLES[sig.type]
            return (
              <span
                key={i}
                style={{
                  padding: '1px 6px',
                  borderRadius: 3,
                  fontSize: 9,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  background: style.bg,
                  color: style.color,
                  border: `1px solid ${style.border}`,
                }}
              >
                {sig.label}
              </span>
            )
          })}
        </div>

        <div
          style={{
            fontSize: 11,
            color: '#6B7280',
            marginBottom: 5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {prospect.sector} · {prospect.region}
        </div>

        <span
          style={{
            padding: '1px 6px',
            borderRadius: 3,
            fontSize: 9,
            fontWeight: 500,
            background: '#0A1F1F',
            color: '#67E8F9',
            border: '1px solid #155E75',
          }}
        >
          {prospect.detail.filiere}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#F4C842',
            whiteSpace: 'nowrap',
          }}
        >
          {prospect.capex}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onQuickApproach() }}
          style={{
            padding: '4px 8px',
            background: 'transparent',
            border: '1px solid #1E3A5F',
            borderRadius: 4,
            color: '#6B7280',
            fontSize: 10,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#00D4AA'
            e.currentTarget.style.color = '#00D4AA'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#1E3A5F'
            e.currentTarget.style.color = '#6B7280'
          }}
        >
          <Send size={10} /> Email
        </button>
      </div>
    </div>
  )
}
