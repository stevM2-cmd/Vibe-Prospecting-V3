# Vibe Prospecting V3 · GreenYellow

Terminal de prospection commerciale IA pour GreenYellow — filiale Ardian.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Anthropic Claude Sonnet 4.6** (prospection + génération emails)
- **Lucide React** (icônes)
- **Vercel** (déploiement)

## Fonctionnalités

- Prompt en langage naturel → liste de prospects scorés
- 6 filières GreenYellow : PV, EE, BESS, CPE, IRVE, E-Boiler
- Animation "thinking" (5 étapes de raisonnement IA)
- Scoring 0–100 par opportunité
- Génération email / qualification / fiche Salesforce via IA
- Export TSV → Excel
- Historique des requêtes (localStorage)
- Mode démo (mock data) si pas de clé API

## Installation

```bash
# 1. Cloner / décompresser le projet
cd vibe-prospecting-v3

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.local.example .env.local
# Éditer .env.local et renseigner ANTHROPIC_API_KEY

# 4. Lancer en dev
npm run dev
# → http://localhost:3000
```

## Mode démo (sans clé API)

Pour tester sans clé API, créer `.env.local` avec :
```
NEXT_PUBLIC_USE_MOCK=true
```

L'app utilise alors les données mock (5 prospects préchargés).

## Déploiement Vercel

```bash
# Via CLI
npm i -g vercel
vercel

# Variables d'environnement à configurer dans Vercel Dashboard :
# ANTHROPIC_API_KEY = sk-ant-...
```

## Structure

```
src/
  app/
    page.tsx          # Page principale
    layout.tsx        # Layout root
    globals.css       # Styles globaux
    api/
      prospect/       # API → Claude (prospection)
      generate/       # API → Claude (email, qualification, CRM)
  components/
    Topbar.tsx        # Barre du haut + export
    Sidebar.tsx       # Exemples GY + historique
    PromptBar.tsx     # Input terminal + filtres filières
    ThinkingBlock.tsx # Animation raisonnement IA
    ProspectCard.tsx  # Carte prospect
    DetailPanel.tsx   # Panneau détail + actions IA
  lib/
    data.ts           # Types + données mock + constantes
```

## Personnalisation

**Ajouter des exemples :** `src/lib/data.ts` → `EXAMPLE_QUERIES`

**Modifier le prompt IA :** `src/app/api/prospect/route.ts` → `SYSTEM_PROMPT`

**Ajouter une filière :** `src/lib/data.ts` → type `Filiere`

## Auteur

Steven — Responsable Partenariats France, GreenYellow
