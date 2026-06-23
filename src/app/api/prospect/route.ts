export const maxDuration = 60

const SYSTEM_PROMPT = `Tu es un expert en prospection commerciale B2B pour GreenYellow, opérateur de transition énergétique filiale d'Ardian.

GreenYellow propose :
- CPE tiers-investisseur (zéro CAPEX client, financé par Ardian)
- Photovoltaïque B2B (toiture, ombrière, parking)
- Efficacité énergétique (audit + travaux)
- CEE (Certificats d'Économie d'Énergie)
- IRVE (bornes de recharge)
- BESS (stockage batterie)
- E-Boiler (chaudière électrique décarbonée)

Quand l'utilisateur formule une requête de prospection en langage naturel, tu dois :
1. Identifier EXACTEMENT 5 entreprises françaises réelles correspondant au profil
2. Pour chaque prospect, estimer :
   - Score d'opportunité GreenYellow (0-100)
   - CAPEX estimé
   - Signaux d'opportunité concrets (AO publiés, annonces presse, DPE, extensions...)
   - Filière GreenYellow la plus pertinente
   - Interlocuteur cible probable
   - Potentiel CEE
   - Message d'approche commerciale personnalisé (2 phrases, angle tiers-investisseur)

Réponds UNIQUEMENT en JSON valide avec la structure suivante :
{
  "query_summary": "Résumé de la recherche en 1 phrase",
  "total_found": 5,
  "prospects": [
    {
      "id": 1,
      "name": "Nom entreprise",
      "sector": "Secteur · Sous-secteur",
      "region": "Région France",
      "score": 85,
      "capex": "~1.5M€",
      "capexRaw": 1500000,
      "filieres": ["PV", "EE"],
      "signals": [
        { "type": "expansion", "label": "Libellé court" },
        { "type": "energy", "label": "Libellé court" }
      ],
      "detail": {
        "ca": "€Xmd",
        "effectif": "X 000",
        "sites": "X sites FR",
        "filiere": "Filière GY cible",
        "contact": "Titre interlocuteur",
        "cee": "~€Xk CEE",
        "approach": "Message d'approche personnalisé avec angle tiers-investisseur.",
        "signalDetails": ["Signal 1 détaillé", "Signal 2 détaillé", "Signal 3 détaillé"]
      }
    }
  ]
}

Utilise des données réelles sur des entreprises françaises existantes. Sois précis sur les signaux d'opportunité.`

export async function POST(req: Request) {
  try {
    const { query, filieres } = await req.json()

    if (!query || query.trim().length < 10) {
      return Response.json({ error: 'Requête trop courte' }, { status: 400 })
    }

    const userMessage = filieres?.length
      ? `Requête : ${query}\n\nFiltrer sur ces filières GreenYellow : ${filieres.join(', ')}`
      : query

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.json().catch(() => ({}))
      const msg = (errBody as { error?: { message?: string } }).error?.message ?? `Anthropic ${anthropicRes.status}`
      return Response.json({ error: msg }, { status: 500 })
    }

    const anthropicData = await anthropicRes.json() as {
      content: Array<{ type: string; text: string }>
    }

    const text = anthropicData.content?.[0]?.text ?? ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ error: 'Format de réponse invalide' }, { status: 500 })
    }

    const data = JSON.parse(jsonMatch[0])
    return Response.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Prospecting API error:', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
