'use client'

import { useState, useCallback } from 'react'
import { Radar, SortAsc, TrendingDown, AlignLeft } from 'lucide-react'
import Topbar from '@/components/Topbar'
import Sidebar from '@/components/Sidebar'
import PromptBar from '@/components/PromptBar'
import ThinkingBlock from '@/components/ThinkingBlock'
import ProspectCard from '@/components/ProspectCard'
import DetailPanel from '@/components/DetailPanel'
import { EXAMPLE_QUERIES, Prospect, HistoryItem, Filiere } from '@/lib/data'

type SortMode = 'score' | 'capex' | 'alpha'

export default function Home() {
  const [query, setQuery] = useState(EXAMPLE_QUERIES[0].query)
  const [activeExample, setActiveExample] = useState<number | null>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [hasResults, setHasResults] = useState(false)
  const [currentQuery, setCurrentQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('score')
  const [querySummary, setQuerySummary] = useState('')
  const [apiError, setApiError] = useState<string | null>(null)

  const sortProspects = useCallback((data: Prospect[], mode: SortMode): Prospect[] => {
    const sorted = [...data]
    if (mode === 'score') return sorted.sort((a, b) => b.score - a.score)
    if (mode === 'capex') return sorted.sort((a, b) => b.capexRaw - a.capexRaw)
    return sorted.sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const runProspecting = async (q: string, filieres: Filiere[]) => {
    if (isLoading) return
    setIsLoading(true)
    setHasResults(false)
    setSelectedId(null)
    setCurrentQuery(q)
    setProspects([])
    setApiError(null)

    const histItem: HistoryItem = {
      id: Date.now().toString(),
      query: q,
      count: 0,
      timestamp: new Date(),
    }

    try {
      const res = await fetch('/api/prospect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, filieres }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error ?? `Erreur API (${res.status})`)
      }

      const json = await res.json()
      const data: Prospect[] = json.prospects ?? []
      const sorted = sortProspects(data, sortMode)
      setProspects(sorted)
      setQuerySummary(json.query_summary ?? '')
      histItem.count = sorted.length
      setHistory(prev => [histItem, ...prev].slice(0, 10))
      setHasResults(true)
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (mode: SortMode) => {
    setSortMode(mode)
    setProspects(prev => sortProspects(prev, mode))
  }

  const handleSelectExample = (idx: number) => {
    setActiveExample(idx)
    setQuery(EXAMPLE_QUERIES[idx].query)
  }

  const handleSelectHistory = (q: string) => {
    setQuery(q)
    setActiveExample(null)
  }

  const selectedProspect = prospects.find(p => p.id === selectedId) ?? null

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#0A0F1E',
        overflow: 'hidden',
      }}
    >
      <Topbar prospects={hasResults ? prospects : []} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          activeExample={activeExample}
          history={history}
          onSelectExample={handleSelectExample}
          onSelectHistory={handleSelectHistory}
        />

        {/* Center */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <PromptBar
            value={query}
            onChange={v => { setQuery(v); setActiveExample(null) }}
            onSubmit={runProspecting}
            isLoading={isLoading}
          />

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
            {/* Empty state */}
            {!isLoading && !hasResults && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '60px 20px',
                  color: '#374151',
                  gap: 10,
                  textAlign: 'center',
                }}
              >
                <Radar size={48} color="#1E2D45" />
                <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  Lance une requête en langage naturel<br />
                  pour explorer ton terrain commercial.
                </p>
                <p style={{ fontSize: 11, color: '#1E3A5F', margin: 0 }}>
                  Utilise ⌘+Entrée pour soumettre rapidement
                </p>
              </div>
            )}

            {/* Thinking */}
            <ThinkingBlock visible={isLoading} query={currentQuery} />

            {/* Error state */}
            {apiError && !isLoading && (
              <div
                style={{
                  margin: '20px 0',
                  padding: '14px 16px',
                  background: '#1A0808',
                  border: '1px solid #7F1D1D',
                  borderRadius: 8,
                  color: '#FCA5A5',
                  fontSize: 12,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4, color: '#F87171' }}>
                  Erreur lors de la recherche
                </div>
                <div style={{ marginBottom: 8 }}>{apiError}</div>
                <div style={{ color: '#9CA3AF', fontSize: 11 }}>
                  Vérifiez que la variable <code style={{ background: '#2D1515', padding: '1px 5px', borderRadius: 3 }}>ANTHROPIC_API_KEY</code> est bien définie dans les variables d&apos;environnement de votre déploiement.
                </div>
              </div>
            )}

            {/* Results */}
            {hasResults && !isLoading && (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontSize: 12, color: '#6B7280' }}>
                    <span style={{ color: '#00D4AA', fontWeight: 600 }}>
                      {prospects.length} prospects
                    </span>
                    {querySummary ? ` · ${querySummary}` : ' identifiés'}
                  </div>

                  <div style={{ display: 'flex', gap: 4 }}>
                    {([
                      { mode: 'score' as SortMode, icon: <TrendingDown size={10} />, label: 'Score' },
                      { mode: 'capex' as SortMode, icon: <SortAsc size={10} />, label: 'CAPEX' },
                      { mode: 'alpha' as SortMode, icon: <AlignLeft size={10} />, label: 'A–Z' },
                    ]).map(({ mode, icon, label }) => (
                      <button
                        key={mode}
                        onClick={() => handleSort(mode)}
                        style={{
                          padding: '3px 8px',
                          fontSize: 10,
                          border: `1px solid ${sortMode === mode ? '#F4C842' : '#1E2D45'}`,
                          borderRadius: 4,
                          background: 'transparent',
                          color: sortMode === mode ? '#F4C842' : '#6B7280',
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          transition: 'all 0.15s',
                        }}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {prospects.map(p => (
                  <ProspectCard
                    key={p.id}
                    prospect={p}
                    isSelected={p.id === selectedId}
                    onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
                    onQuickApproach={() => setSelectedId(p.id)}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        <DetailPanel prospect={selectedProspect} />
      </div>
    </div>
  )
}
