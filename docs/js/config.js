// Wisestep Hub — public config.
// Supabase anon key er OK at committe — Row Level Security beskytter data.

export const SUPABASE_URL = 'https://mfrdpvnhbdankggvkycg.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcmRwdm5oYmRhbmtnZ3ZreWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0OTQyNzQsImV4cCI6MjA5MjA3MDI3NH0.x05zAdZ88j74rE6Y0CrXPCpkb3gbhIYjGBGXY4SbnzA';

// Afleder site-roden ud fra nuværende side. Robust overfor både lokal dev (/), GitHub Pages-subpath og custom domain.
export function getSiteBaseUrl() {
  const { origin, pathname } = window.location;
  // Hvis vi står på /foo/bar/baz.html eller /foo/bar/ → base er /foo/ (toppen af projektet).
  // For GitHub Pages er første path-segment typisk repo-navn; for custom domain er det blot /.
  const segs = pathname.split('/').filter(Boolean);
  if (segs.length === 0) return origin + '/';
  // Hvis vi er under /faser/... eller /manuskripter/... → fjern ikke første segment.
  // Nemmere: hop op til vi finder en sti der ser ud som hub-roden (hvor index.html ligger).
  // Praktisk heuristik: roden har enten "index.html" eller en kendt top-fil. Vi leverer fallback.
  const known = ['faser', 'manuskripter', 'css', 'js'];
  const idx = segs.findIndex((s) => known.includes(s));
  const baseSegs = idx === -1 ? segs.slice(0, -1) : segs.slice(0, idx);
  return origin + '/' + (baseSegs.length ? baseSegs.join('/') + '/' : '');
}

export const SITE_URL = getSiteBaseUrl();
