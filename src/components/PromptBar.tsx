'use client'

import { useState, useRef, useEffect } from 'react'
import { Zap } from 'lucide-react'
import { Filiere } from '@/lib/data'

const FILIERES: Filiere[] = ['PV', 'EE', 'BESS', 'CPE', 'IRVE', 'E-BOILER']

interface PromptBarProps {
  value: string
  onChange: (v: string) => void
  onSubmit: (query: string, filieres: Filiere[]) => void
  isLoading: boolean
}

export default function PromptBar({ value, onChange, onSubmit, isLoading }: PromptBarProps) {
  const [activeFilters, setActiveFilters] = useState<Filiere[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 80) + 'px'
    }
  }, [value])

  const toggleFilter = (f: Filiere) => {
    setActiveFilters(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (!isLoading && value.trim().length >= 10) {
        onSubmit(value, activeFilters)
      }
    }
  }

  return (
    <div
      style={{
        padding: '14px 16px',
        background: '#111827',
        borderBottom: '1px solid #1E2D45',
        flexShrink: 0,
      }}
    >
      {/* Prompt input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          background: '#0A0F1E',
          border: `1px solid ${isLoading ? '#00D4AA' : '#1E3A5F'}`,
          borderRadius: 8,
          padding: '10px 12px',
          transition: 'border-color 0.2s',
          boxShadow: isLoading ? '0 0 0 2px rgba(0,212,170,0.1)' : 'none',
        }}
      >
        <span
          className={isLoading ? 'cursor-blink' : ''}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            color: '#00D4AA',
            flexShrink: 0,
            paddingTop: 1,
            userSelect: 'none',
          }}
        >
          ›
        </span>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Ex: Trouve les 50 industriels agroalimentaires en France avec des besoins en récupération de chaleur et CAPEX énergie >500k€..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: '#E5E7EB',
            resize: 'none',
            lineHeight: 1.5,
            minHeight: 36,
            maxHeight: 80,
          }}
        />
      </div>

      {/* Filters + submit */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 8,
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {FILIERES.map(f => {
            const active = activeFilters.includes(f)
            return (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  border: `1px solid ${active ? '#00D4AA' : '#1E3A5F'}`,
                  color: active ? '#00D4AA' : '#6B7280',
                  cursor: 'pointer',
                  background: active ? '#0F2238' : 'transparent',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.15s',
                }}
              >
                {f}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <button
            onClick={() => !isLoading && value.trim().length >= 10 && onSubmit(value, activeFilters)}
            disabled={isLoading || value.trim().length < 10}
            style={{
              padding: '6px 14px',
              background: isLoading || value.trim().length < 10 ? '#1E3A5F' : '#00D4AA',
              border: 'none',
              borderRadius: 6,
              color: isLoading || value.trim().length < 10 ? '#4B5563' : '#0A0F1E',
              fontWeight: 600,
              fontSize: 12,
              cursor: isLoading || value.trim().length < 10 ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            <Zap size={13} />
            {isLoading ? 'Analyse...' : 'Explorer'}
          </button>
          <span style={{ fontSize: 9, color: '#374151' }}>⌘+Entrée</span>
        </div>
      </div>
    </div>
  )
}
