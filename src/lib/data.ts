export type Filiere = 'PV' | 'EE' | 'BESS' | 'CPE' | 'IRVE' | 'E-BOILER'

export type SignalType = 'expansion' | 'energy' | 'tender' | 'cpe' | 'bess'

export interface Signal {
  type: SignalType
  label: string
}

export interface ProspectDetail {
  ca: string
  effectif: string
  sites: string
  filiere: string
  contact: string
  cee: string
  approach: string
  signalDetails: string[]
}

export interface Prospect {
  id: number
  name: string
  sector: string
  region: string
  score: number
  capex: string
  capexRaw: number
  filieres: Filiere[]
  signals: Signal[]
  detail: ProspectDetail
}

export interface HistoryItem {
  id: string
  query: string
  count: number
  timestamp: Date
}

export const EXAMPLE_QUERIES: { tag: Filiere; label: string; query: string }[] = [
  {
    tag: 'PV',
    label: 'Retail · Ombrières PV',
    query: "Enseignes retail possédant plus de 20 magasins avec parkings adaptés à l'ombrière photovoltaïque — cible ombrières PV 200 à 800 kWc par site",
  },
  {
    tag: 'EE',
    label: 'Agro · Froid industriel',
    query: "Industriels agroalimentaires avec forte consommation froid industriel >2 GWh/an, éligibles récupération chaleur et CPE tiers-investissement",
  },
  {
    tag: 'BESS',
    label: 'BESS Retrofit',
    query: "Sites industriels avec installation PV existante >500 kWc sans stockage BESS — opportunité retrofit batterie + arbitrage spot FCR/aFRR",
  },
  {
    tag: 'IRVE',
    label: 'Logistique · IRVE',
    query: "Groupes logistique ayant annoncé des extensions d'entrepôts dans les 12 derniers mois — besoin IRVE flottes + PV toiture",
  },
  {
    tag: 'CPE',
    label: 'Agro · CPE tiers-invest.',
    query: "Usines agroalimentaires éligibles à un projet d'efficacité énergétique en tiers-financement — CAPEX énergie estimé >500k€, décret tertiaire",
  },
  {
    tag: 'E-BOILER',
    label: 'Industrie · E-Boiler',
    query: "Industriels avec chaudières gaz >500 kW en zone de mix électrique favorable — conversion E-Boiler avec CEE chaleur renouvelable",
  },
]

export const MOCK_PROSPECTS: Prospect[] = [
  {
    id: 1,
    name: 'Lactalis Groupe',
    sector: 'Agroalimentaire · Lait',
    region: 'Pays de Loire',
    score: 92,
    capex: '~2.4M€',
    capexRaw: 2400000,
    filieres: ['CPE', 'EE', 'BESS'],
    signals: [
      { type: 'energy', label: 'Audit DPE 2024' },
      { type: 'expansion', label: 'Extension Laval +12k m²' },
    ],
    detail: {
      ca: '€23Md',
      effectif: '83 000',
      sites: '240 sites FR',
      filiere: 'CPE Chaleur + EE + BESS',
      contact: 'Dir. Énergie Groupe',
      cee: '~€480k CEE éligibles',
      approach:
        "Lactalis a engagé un plan de réduction CO₂ -30% d'ici 2030. Angle tiers-investisseur : zéro CAPEX sur les 8 GWh/an de froid industriel Laval = économies immédiates + CEE.\n\nInterlocuteur cible : Jean-Marc Tessier, Dir. Achats & Énergie Groupe.",
      signalDetails: [
        "Plan énergie groupe -30% CO₂ annoncé mars 2024",
        "Extension Laval : +12 000 m² process sous froid",
        "Appel d'offres bureau d'études énergie Q3 2024",
      ],
    },
  },
  {
    id: 2,
    name: 'E.Leclerc (SCAEST)',
    sector: 'Retail alimentaire',
    region: 'Grand Est',
    score: 87,
    capex: '~1.8M€',
    capexRaw: 1800000,
    filieres: ['PV', 'CPE'],
    signals: [
      { type: 'expansion', label: '5 ouvertures 2024' },
      { type: 'cpe', label: 'Parkings >2 000 places' },
    ],
    detail: {
      ca: '€56Md FR',
      effectif: '130 000',
      sites: '700 hypermarchés FR',
      filiere: 'Ombrières PV 300–600 kWc/site',
      contact: 'Resp. Patrimoine Régional',
      cee: 'Inclus TREC 2024',
      approach:
        "5 hypermarchés SCAEST ouverts en 2024, chacun avec parking 400–800 places idéal ombrière. Schéma proposé : ombrière PV tiers-investisseur, 0€ CAPEX, revenu parking optimisé.\n\nCible : Patrick Hoffmann, Directeur Patrimoine EST.",
      signalDetails: [
        "5 ouvertures hypermarchés Grand Est 2024",
        "Parkings 400–800 places par site",
        "Charte RSE Leclerc : 100% EnR 2030",
      ],
    },
  },
  {
    id: 3,
    name: 'ID Logistics',
    sector: 'Logistique 3PL',
    region: 'Rhône-Alpes',
    score: 81,
    capex: '~3.1M€',
    capexRaw: 3100000,
    filieres: ['IRVE', 'PV'],
    signals: [
      { type: 'expansion', label: 'Extension Lyon +30k m²' },
      { type: 'tender', label: 'AO IRVE Q4 2024' },
    ],
    detail: {
      ca: '€2.5Md',
      effectif: '38 000',
      sites: '400 entrepôts monde',
      filiere: 'IRVE DC fast + PV toiture',
      contact: 'Dir. Technique France',
      cee: 'CEE IRVE mobilité',
      approach:
        "ID Logistics construit une plateforme de 30 000 m² à Corbas (69). 200 quais de déchargement = 200 véhicules électriques potentiels. Offre groupée IRVE + PV toiture 800 kWc en financement tiers.\n\nInterlocuteur : Mathieu Bruneau, Dir. Infrastructure France.",
      signalDetails: [
        "Permis de construire Corbas 30 000 m² (PC 2024-0342)",
        "Appel d'offres IRVE publié nov. 2024",
        "Engagement zéro émission flotte 2030",
      ],
    },
  },
  {
    id: 4,
    name: 'Bonduelle Industries',
    sector: 'Agroalimentaire · Légumes',
    region: 'Nord · Hauts-de-France',
    score: 78,
    capex: '~900k€',
    capexRaw: 900000,
    filieres: ['EE', 'CPE'],
    signals: [{ type: 'energy', label: 'DPE tertiaire 2024' }],
    detail: {
      ca: '€2.1Md',
      effectif: '15 000',
      sites: '57 usines monde, 12 FR',
      filiere: 'CPE Efficacité Énergétique + CEE',
      contact: 'Dir. Développement Durable',
      cee: '~€220k CEE',
      approach:
        "Bonduelle est soumis au décret tertiaire sur 8 sites FR. Potentiel CEE industriel + CPE efficacité sur éclairage, compression air, récupération chaleur process.\n\nCible : Nicolas Leprêtre, Dir. Énergie & Développement Durable.",
      signalDetails: [
        "Rapport RSE : -20% consommation énergie objectif 2025",
        "3 sites en zone décret tertiaire >2000m²",
        "Investissement compression air Estrées en attente",
      ],
    },
  },
  {
    id: 5,
    name: 'Sofidel France',
    sector: 'Papier · Hygiène',
    region: 'Normandie',
    score: 74,
    capex: '~1.5M€',
    capexRaw: 1500000,
    filieres: ['BESS', 'PV'],
    signals: [
      { type: 'energy', label: 'Forte conso électrique' },
      { type: 'expansion', label: 'Extension Rouen' },
    ],
    detail: {
      ca: '€2.0Md (Groupe)',
      effectif: '6 000',
      sites: '3 usines FR',
      filiere: 'BESS 2 MWh + PV toiture 1 MWc',
      contact: 'Responsable Sites FR',
      cee: 'Eligible CEE industrie',
      approach:
        "Sofidel consomme ~85 GWh/an sur le site de Rouen. Extension 2024 porte la puissance souscrite à 8 MVA. Opportunité stockage BESS 2 MWh + PV 1 MWc toiture pour lisser les pics et réduire la facture d'écrêtement.\n\nCible : Dir. Technique site Rouen.",
      signalDetails: [
        "Puissance souscrite +2 MVA Rouen 2024",
        "Contrat EDF Industrie expirant mars 2025",
        "Marché travaux électriques publié nov. 2024",
      ],
    },
  },
]

export const THINKING_STEPS = [
  { icon: '🗄', label: 'Croisement bases SIRENE + bilans publics' },
  { icon: '📰', label: 'Analyse signaux presse & appels d\'offres' },
  { icon: '🏭', label: 'Identification critères sectoriels GreenYellow' },
  { icon: '📊', label: 'Scoring opportunité tiers-investisseur' },
  { icon: '✉️', label: 'Génération messages d\'approche personnalisés' },
]
