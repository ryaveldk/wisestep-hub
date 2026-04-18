// Wisestep Hub — public config.
// Supabase anon key er OK at committe — Row Level Security beskytter data.

export const SUPABASE_URL = 'https://mfrdpvnhbdankggvkycg.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcmRwdm5oYmRhbmtnZ3ZreWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0OTQyNzQsImV4cCI6MjA5MjA3MDI3NH0.x05zAdZ88j74rE6Y0CrXPCpkb3gbhIYjGBGXY4SbnzA';

// Kendte deployment-URLs. Runtime vælger den der matcher current origin/path.
const KNOWN_SITES = [
  'https://ryaveldk.github.io/wisestep-hub/',
];

export function getSiteBaseUrl() {
  const here = window.location.origin + window.location.pathname;
  const match = KNOWN_SITES.find((u) => here.startsWith(u.replace(/\/$/, '')));
  if (match) return match;
  // Lokal dev: brug current page's mappe.
  const { origin, pathname } = window.location;
  return origin + pathname.replace(/[^/]*$/, '');
}

export const SITE_URL = getSiteBaseUrl();
