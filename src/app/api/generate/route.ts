import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 30

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { prospect, type } = await req.json()

    const prompts: Record<string, string> = {
      email: `Rédige un email de prospection B2B pour GreenYellow à destination de ${prospect.name}.
        
Contexte :
- Secteur : ${prospect.sector}
- Région : ${prospect.region}
- Filière GreenYellow cible : ${prospect.detail.filiere}
- Interlocuteur cible : ${prospect.detail.contact}
- CAPEX estimé : ${prospect.capex}
- CEE potentiel : ${prospect.detail.cee}
- Signaux d'opportunité : ${prospect.detail.signalDetails?.join(', ')}

Angle clé : GreenYellow = tiers-investisseur Ardian, zéro CAPEX pour ${prospect.name}.

Rédige un email professionnel, percutant, de 150-200 mots maximum. Inclure :
- Objet accrocheur
- Accroche personnalisée sur un signal identifié
- Valeur proposition GreenYellow (zéro CAPEX + expertise sectorielle)
- Call-to-action pour un RDV diagnostic de 30 min
- Signature Steven [Nom] - Responsable Partenariats, GreenYellow`,

      qualification: `Qualifie l'opportunité commerciale GreenYellow pour ${prospect.name} :

Données :
- Score actuel : ${prospect.score}/100
- Filière : ${prospect.detail.filiere}
- CAPEX : ${prospect.capex}
- Signaux : ${prospect.detail.signalDetails?.join('; ')}

Analyse :
1. Forces du dossier (2-3 points)
2. Risques et objections probables (2-3 points)
3. Concurrents probables (Engie, EDF, Eiffage Énergie, etc.)
4. Plan d'action 30 jours (3 étapes concrètes)
5. Recommandation GO / WATCH / NO-GO avec justification`,

      salesforce: `Prépare une fiche de qualification Salesforce pour ${prospect.name} :

Rédige un résumé structuré pour créer un compte dans Salesforce CRM avec :
- Nom compte : ${prospect.name}
- Secteur : ${prospect.sector}
- Région : ${prospect.region}
- Score opportunité : ${prospect.score}/100
- CAPEX estimé : ${prospect.capex}
- CEE potentiel : ${prospect.detail.cee}
- Filière GY : ${prospect.detail.filiere}
- CA estimé : ${prospect.detail.ca}
- Effectif : ${prospect.detail.effectif}
- Contact cible : ${prospect.detail.contact}
- Signaux identifiés : ${prospect.detail.signalDetails?.join('; ')}
- Prochaine action : [à définir]
- Statut : Prospect froid → à qualifier

Format : liste claire et structurée, prête à copier-coller dans Salesforce.`,
    }

    const prompt = prompts[type] || prompts.email

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Réponse invalide' }, { status: 500 })
    }

    return NextResponse.json({ result: content.text })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Generate API error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
