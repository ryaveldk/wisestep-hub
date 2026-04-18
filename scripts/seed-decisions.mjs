#!/usr/bin/env node
// Wisestep Hub — seed initial decisions i Supabase.
// KØRSEL:  SUPABASE_SERVICE_KEY=... node scripts/seed-decisions.mjs
//
// Service-role key findes i Supabase Dashboard → Project Settings → API → service_role (secret).
// Denne key har bypass på Row Level Security og må ALDRIG committes. Kør kun lokalt.
// Scriptet er idempotent: det upserter på slug, så det er sikkert at køre flere gange.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mfrdpvnhbdankggvkycg.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_KEY;

if (!KEY) {
  console.error('❌ Mangler SUPABASE_SERVICE_KEY.');
  console.error('   Hent key fra: Supabase Dashboard → Project Settings → API → service_role (secret).');
  console.error('   Kør med:    SUPABASE_SERVICE_KEY=xxx node scripts/seed-decisions.mjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, KEY, { auth: { persistSession: false } });

const DECISIONS = [
  {
    slug: 'virksomhedsstruktur',
    title: 'Virksomhedsstruktur',
    phase: 'Fase 0',
    description: 'ApS vs. enkeltmandsvirksomhed. Påvirker beskatning, ansvarsbegrænsning, fradragsmuligheder.',
    blocking: true,
    status: 'Afventer',
  },
  {
    slug: 'apple-developer',
    title: 'Apple Developer enrollment',
    phase: 'Fase 0',
    description: 'Enroll virksomhed eller personligt. Blokerer al teknisk test på enhed.',
    blocking: true,
    status: 'Afventer',
  },
  {
    slug: 'ai-stemmeleverandor',
    title: 'AI-stemmeleverandør',
    phase: 'Fase 2',
    description: 'Vælg leverandør med kommerciel licens der tillader salg og dramatisering af historiske personer.',
    blocking: true,
    status: 'Afventer',
  },
  {
    slug: 'mvp-sprog',
    title: 'Sprog ved launch',
    phase: 'Fase 1',
    description: 'Dansk eller engelsk først? Påvirker målgruppe og produktion.',
    blocking: true,
    status: 'Afventer',
  },
  {
    slug: 'gruppelytning-scope',
    title: 'Gruppelytning i MVP eller v1.1',
    phase: 'Fase 1',
    description: 'Anbefaling: v1.1. Reducerer MVP-kompleksitet markant.',
    blocking: true,
    status: 'Afventer',
  },
  {
    slug: 'mvp-omfang',
    title: 'MVP-omfang',
    phase: 'Fase 1',
    description: 'Kierkegaards København som eneste tour ved launch, 45 min, 6 stop.',
    blocking: true,
    status: 'Afventer',
  },
  {
    slug: 'paraply-brand',
    title: 'App-navn / paraply-brand',
    phase: 'Fase 0',
    description: 'Vælg paraply-navn der ikke låser til én tur (ikke "Kierkegaards København" som app-navn).',
    blocking: true,
    status: 'Afventer',
  },
];

async function main() {
  console.log(`Seeder ${DECISIONS.length} beslutninger til ${SUPABASE_URL} …`);
  const { data, error } = await supabase
    .from('decisions')
    .upsert(DECISIONS, { onConflict: 'slug' })
    .select();
  if (error) {
    console.error('❌ Upsert fejl:', error);
    process.exit(1);
  }
  console.log(`✔ Seeded ${data.length} rows:`);
  for (const d of data) {
    console.log(`  · [${d.phase}] ${d.title}  (${d.slug})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
