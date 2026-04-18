// Wisestep Hub — public config.
// Supabase anon key er OK at committe — Row Level Security beskytter data.

export const SUPABASE_URL = 'https://mfrdpvnhbdankggvkycg.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcmRwdm5oYmRhbmtnZ3ZreWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0OTQyNzQsImV4cCI6MjA5MjA3MDI3NH0.x05zAdZ88j74rE6Y0CrXPCpkb3gbhIYjGBGXY4SbnzA';

// Afleder hub-roden ud fra .brand-linket (peger altid på index.html i roden).
// Det virker uanset om siden serveres på /wisestep-hub/, /, eller et custom domæne.
export function getSiteBaseUrl() {
  const brand = document.querySelector('a.brand');
  if (brand) {
    // href på <a> auto-resolveres til absolut URL af browseren.
    const u = new URL(brand.href);
    // Strip index.html hvis til stede → vi vil have mappe-roden.
    const pathname = u.pathname.replace(/\/?index\.html?$/, '/');
    return u.origin + pathname;
  }
  // Fallback: current page's folder
  const { origin, pathname } = window.location;
  const folder = pathname.replace(/[^/]*$/, '');
  return origin + folder;
}

export const SITE_URL = getSiteBaseUrl();
