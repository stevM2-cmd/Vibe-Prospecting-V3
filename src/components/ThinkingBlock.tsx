'use client'

import { useEffect, useState } from 'react'
import { Brain, Database, Newspaper, Factory, BarChart3, MessageSquare } from 'lucide-react'
import { THINKING_STEPS } from '@/lib/data'

const STEP_ICONS = [Database, Newspaper, Factory, BarChart3, MessageSquare]

interface ThinkingBlockProps {
  visible: boolean
  query: string
}

export default function ThinkingBlock({ visible, query }: ThinkingBlockProps) {
  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => {
    if (!visible) {
      setActiveStep(-1)
      return
    }

    const delays = [0, 900, 1700, 2500, 3200]
    const timers = delays.map((d, i) =>
      setTimeout(() => setActiveStep(i), d)
    )
    return () => timers.forEach(clearTimeout)
  }, [visible])

  if (!visible) return null

  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid #1E2D45',
        borderRadius: 8,
        padding: '14px 16px',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: '#00D4AA',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Brain size={13} className="pulse-dot" />
        Analyse : &ldquo;{query.slice(0, 60)}...&rdquo;
      </div>

      <ul style={{ listStyle: 'none' }}>
        {THINKING_STEPS.map((step, i) => {
          const Icon = STEP_ICONS[i]
          const isDone = i < activeStep
          const isActive = i === activeStep
          const isPending = i > activeStep

          return (
            <li
              key={i}
              style={{
                fontSize: 11,
                padding: '3px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: isDone ? '#6B7280' : isActive ? '#E5E7EB' : '#374151',
                transition: 'color 0.3s',
              }}
            >
              <Icon
                size={12}
                color={isDone ? '#374151' : isActive ? '#00D4AA' : '#1E3A5F'}
                style={{ flexShrink: 0, transition: 'color 0.3s' }}
              />
              <span style={{ textDecoration: isDone ? 'line-through' : 'none' }}>
                {step.label}
              </span>
              {isActive && (
                <span
                  className="cursor-blink"
                  style={{
                    display: 'inline-block',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#00D4AA',
                    marginLeft: 2,
                  }}
                />
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
