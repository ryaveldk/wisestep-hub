// Wisestep Hub — Google-login + session-handling via Supabase Auth.
import { supabase, getUserDisplayName, getUserInitials } from './supabase.js';
import { SITE_URL } from './config.js';

let currentUser = null;
const listeners = new Set();

export function onAuthChange(fn) {
  listeners.add(fn);
  // fire initial
  fn(currentUser);
  return () => listeners.delete(fn);
}

function emit() {
  for (const fn of listeners) fn(currentUser);
}

export function getUser() {
  return currentUser;
}

async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: SITE_URL,
    },
  });
  if (error) {
    console.error('Login-fejl', error);
    alert('Kunne ikke starte Google-login: ' + error.message);
  }
}

async function logout() {
  await supabase.auth.signOut();
  currentUser = null;
  emit();
  renderAuth();
  renderGate();
}

function renderAuth() {
  const slot = document.getElementById('auth-slot');
  if (!slot) return;
  if (!currentUser) {
    slot.innerHTML = '';
    return;
  }
  const name = getUserDisplayName(currentUser);
  const initials = getUserInitials(currentUser);
  slot.innerHTML = `
    <span class="user-badge" title="${currentUser.email}">
      <span class="user-avatar">${initials}</span>
      <span class="user-name">${escapeHtml(name)}</span>
    </span>
    <button class="btn btn-ghost" id="logout-btn">Log ud</button>
  `;
  document.getElementById('logout-btn')?.addEventListener('click', logout);
}

function renderGate() {
  const gate = document.getElementById('login-gate');
  const app = document.getElementById('app');
  if (!gate || !app) return;
  if (currentUser) {
    gate.hidden = true;
    app.hidden = false;
  } else {
    gate.hidden = false;
    app.hidden = true;
  }
}

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

export async function initAuth() {
  // Login-knap
  document.getElementById('login-google')?.addEventListener('click', loginWithGoogle);

  // Første session-hent
  const { data: { session } } = await supabase.auth.getSession();
  currentUser = session?.user ?? null;
  renderAuth();
  renderGate();
  emit();

  // Abonnér på auth-state-ændringer
  supabase.auth.onAuthStateChange((_evt, session) => {
    currentUser = session?.user ?? null;
    renderAuth();
    renderGate();
    emit();
  });
}
