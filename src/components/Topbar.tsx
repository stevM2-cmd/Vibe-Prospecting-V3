'use client'

import { Download, Zap } from 'lucide-react'
import { Prospect } from '@/lib/data'

interface TopbarProps {
  prospects: Prospect[]
}

export default function Topbar({ prospects }: TopbarProps) {
  const handleExport = () => {
    if (prospects.length === 0) return

    const rows = [
      ['Entreprise', 'Secteur', 'Région', 'Score', 'CAPEX', 'Filière', 'Contact', 'CEE', 'Signaux'].join('\t'),
      ...prospects.map(p => [
        p.name,
        p.sector,
        p.region,
        p.score,
        p.capex,
        p.detail.filiere,
        p.detail.contact,
        p.detail.cee,
        p.detail.signalDetails?.join(' | ') ?? '',
      ].join('\t')),
    ].join('\n')

    const blob = new Blob([rows], { type: 'text/tab-separated-values' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vibe-prospects-${new Date().toISOString().slice(0, 10)}.tsv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <header
      style={{
        background: '#111827',
        borderBottom: '1px solid #1E2D45',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        height: 45,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Zap size={16} color="#00D4AA" />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            fontWeight: 500,
            color: '#00D4AA',
            letterSpacing: '0.5px',
          }}
        >
          vibe<span style={{ color: '#6B7280' }}>_</span>prospecting{' '}
          <span style={{ color: '#1E3A5F' }}>|</span>{' '}
          <span style={{ color: '#F4C842' }}>GreenYellow</span>
        </span>
        <span
          style={{
            background: '#0A1A24',
            border: '1px solid #1E3A5F',
            color: '#00D4AA',
            fontSize: 9,
            padding: '2px 6px',
            borderRadius: 3,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.5px',
          }}
        >
          V3
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {prospects.length > 0 && (
          <button
            onClick={handleExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              background: 'transparent',
              border: '1px solid #1E2D45',
              borderRadius: 5,
              color: '#6B7280',
              fontSize: 11,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              const t = e.currentTarget
              t.style.borderColor = '#F4C842'
              t.style.color = '#F4C842'
            }}
            onMouseLeave={e => {
              const t = e.currentTarget
              t.style.borderColor = '#1E2D45'
              t.style.color = '#6B7280'
            }}
          >
            <Download size={12} />
            Export TSV ({prospects.length})
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6B7280' }}>
          <div
            className="pulse-dot"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#00D4AA',
            }}
          />
          Moteur IA actif
        </div>
      </div>
    </header>
  )
}
