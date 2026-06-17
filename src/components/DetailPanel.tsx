'use client'

import { useState } from 'react'
import { Mail, CheckSquare, Database, Signal, Loader2 } from 'lucide-react'
import { Prospect } from '@/lib/data'

interface DetailPanelProps {
  prospect: Prospect | null
}

export default function DetailPanel({ prospect }: DetailPanelProps) {
  const [generating, setGenerating] = useState<string | null>(null)
  const [generatedContent, setGeneratedContent] = useState<{ type: string; content: string } | null>(null)

  const generate = async (type: 'email' | 'qualification' | 'salesforce') => {
    if (!prospect) return
    setGenerating(type)
    setGeneratedContent(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospect, type }),
      })
      const data = await res.json()
      setGeneratedContent({ type, content: data.result || data.error })
    } catch {
      setGeneratedContent({ type, content: 'Erreur lors de la génération.' })
    } finally {
      setGenerating(null)
    }
  }

  if (!prospect) {
    return (
      <div
        style={{
          width: 280,
          background: '#111827',
          borderLeft: '1px solid #1E2D45',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#374151',
          gap: 8,
          padding: 20,
          flexShrink: 0,
        }}
      >
        <Signal size={32} color="#1E2D45" />
        <p style={{ fontSize: 11, textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
          Sélectionne un prospect pour voir le détail et générer les messages.
        </p>
      </div>
    )
  }

  const scoreColor =
    prospect.score >= 85 ? '#00D4AA' :
    prospect.score >= 75 ? '#F4C842' : '#FB923C'

  return (
    <div
      style={{
        width: 280,
        background: '#111827',
        borderLeft: '1px solid #1E2D45',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: 14 }}>
        {/* Header */}
        <div style={{ fontSize: 15, fontWeight: 600, color: '#E5E7EB', marginBottom: 3 }}>
          {prospect.name}
        </div>
        <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 12 }}>
          {prospect.sector} · {prospect.region}
        </div>

        {/* Score */}
        <div
          style={{
            background: '#0A0F1E',
            borderRadius: 6,
            padding: '10px 12px',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 500, color: scoreColor }}>
              {prospect.score}
            </div>
            <div style={{ fontSize: 10, color: '#4B5563' }}>Score GY</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: scoreColor, fontWeight: 500 }}>
              {prospect.score >= 80 ? '✓ GO prospect' : prospect.score >= 70 ? '◐ À qualifier' : '○ WATCH'}
            </div>
            <div style={{ fontSize: 10, color: '#4B5563', marginTop: 2 }}>
              CAPEX est. :{' '}
              <span style={{ color: '#F4C842' }}>{prospect.capex}</span>
            </div>
          </div>
        </div>

        {/* Data */}
        <SectionTitle>Données entreprise</SectionTitle>
        {[
          ['CA', prospect.detail.ca],
          ['Effectif', prospect.detail.effectif],
          ['Sites', prospect.detail.sites],
          ['Filière cible', prospect.detail.filiere],
          ['Contact', prospect.detail.contact],
          ['CEE potentiel', prospect.detail.cee],
        ].map(([k, v]) => (
          <DataRow key={k} label={k} value={v} highlight={k === 'CEE potentiel' || k === 'Filière cible'} />
        ))}

        {/* Signals */}
        <SectionTitle>Signaux d&apos;opportunité</SectionTitle>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {prospect.detail.signalDetails.map((s, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 6,
                padding: '5px 0',
                fontSize: 11,
                color: '#9CA3AF',
                borderBottom: '1px solid #1A2435',
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: '#00D4AA', flexShrink: 0, marginTop: 1 }}>›</span>
              {s}
            </li>
          ))}
        </ul>

        {/* Approach */}
        <div
          style={{
            background: '#0A0F1E',
            border: '1px solid #1E3A5F',
            borderRadius: 6,
            padding: 10,
            marginTop: 14,
          }}
        >
          <div style={{ fontSize: 9, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
            Angle d&apos;approche IA
          </div>
          <div style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.5, fontStyle: 'italic', whiteSpace: 'pre-line' }}>
            {prospect.detail.approach}
          </div>
        </div>

        {/* Generated content */}
        {generatedContent && (
          <div
            style={{
              background: '#0A0F1E',
              border: '1px solid #1E3A5F',
              borderRadius: 6,
              padding: 10,
              marginTop: 12,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: '#00D4AA',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                marginBottom: 6,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>
                {generatedContent.type === 'email' ? 'Email généré' :
                 generatedContent.type === 'qualification' ? 'Qualification' : 'Fiche Salesforce'}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(generatedContent.content)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#4B5563',
                  fontSize: 9,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Copier
              </button>
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#9CA3AF',
                lineHeight: 1.5,
                whiteSpace: 'pre-line',
                maxHeight: 200,
                overflowY: 'auto',
              }}
            >
              {generatedContent.content}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
          <ActionBtn
            icon={<Mail size={12} />}
            label="Générer email complet"
            loading={generating === 'email'}
            primary
            onClick={() => generate('email')}
          />
          <ActionBtn
            icon={<CheckSquare size={12} />}
            label="Qualifier l'opportunité"
            loading={generating === 'qualification'}
            onClick={() => generate('qualification')}
          />
          <ActionBtn
            icon={<Database size={12} />}
            label="Fiche Salesforce"
            loading={generating === 'salesforce'}
            onClick={() => generate('salesforce')}
          />
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.8px',
        color: '#4B5563',
        textTransform: 'uppercase',
        marginBottom: 8,
        marginTop: 14,
      }}
    >
      {children}
    </div>
  )
}

function DataRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '5px 0',
        borderBottom: '1px solid #1A2435',
        fontSize: 11,
        gap: 8,
      }}
    >
      <span style={{ color: '#6B7280', flexShrink: 0 }}>{label}</span>
      <span style={{ color: highlight ? '#00D4AA' : '#E5E7EB', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function ActionBtn({
  icon,
  label,
  loading,
  primary,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  loading: boolean
  primary?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%',
        padding: '8px',
        background: primary ? '#00D4AA' : 'transparent',
        border: primary ? 'none' : '1px solid #1E3A5F',
        borderRadius: 6,
        color: primary ? '#0A0F1E' : '#9CA3AF',
        fontWeight: primary ? 600 : 400,
        fontSize: 12,
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        transition: 'all 0.15s',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : icon}
      {loading ? 'Génération...' : label}
    </button>
  )
}
