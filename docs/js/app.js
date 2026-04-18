// Wisestep Hub — app entry point. Binder sidebar-toggle, init auth, comments, decisions.
import { initAuth } from './auth.js';
import { initComments } from './comments.js';
import { initDecisions } from './decisions.js';

function wireSidebar() {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  // Luk sidebar ved klik på link (mobile)
  sidebar.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') sidebar.classList.remove('open');
  });
}

async function main() {
  wireSidebar();
  await initAuth();
  initComments();
  initDecisions();
}

main().catch((e) => {
  console.error('App init fejl', e);
});
