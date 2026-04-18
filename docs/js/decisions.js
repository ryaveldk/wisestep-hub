// Wisestep Hub — decisions + voting. Mounter på #decisions-list (findes på beslutninger-siden).
import { supabase, getUserDisplayName } from './supabase.js';
import { getUser, onAuthChange } from './auth.js';

const state = {
  decisions: [],
  votesByDecision: new Map(), // id -> array of votes
  subscribed: false,
};

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

function deriveStatus(decision, votes) {
  // Forventet: to brugere. Vi kigger på seneste stemme per user_id.
  const latestByUser = new Map();
  for (const v of votes) {
    const prev = latestByUser.get(v.user_id);
    if (!prev || new Date(v.created_at) > new Date(prev.created_at)) {
      latestByUser.set(v.user_id, v);
    }
  }
  const choices = Array.from(latestByUser.values()).map((v) => v.vote);
  if (choices.length === 0) return 'Afventer';
  if (choices.includes('reject')) return 'Afvist';
  if (choices.length === 1 && choices[0] === 'accept') {
    // Kun én bruger har stemt accept
    return 'Afventer partner';
  }
  if (choices.length >= 2 && choices.every((c) => c === 'accept')) return 'Godkendt';
  if (choices.includes('discuss')) return 'Diskutér';
  return 'Afventer';
}

async function maybeUpdateDecisionStatus(decision, newStatus) {
  if (decision.status === newStatus) return;
  await supabase.from('decisions').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', decision.id);
}

function voteLabel(v) {
  return { accept: '✓ Accept', reject: '✗ Afvis', discuss: '💬 Diskutér' }[v] || v;
}

function renderCard(d, votes, user) {
  const status = deriveStatus(d, votes);
  const myVote = user && votes.find((v) => v.user_id === user.id);

  const voteBtns = ['accept', 'reject', 'discuss'].map((v) => `
    <button class="vote-btn ${myVote?.vote === v ? 'active' : ''}" data-vote="${v}" data-decision="${d.id}">
      ${voteLabel(v)}
    </button>
  `).join('');

  const votesList = votes.map((v) => `
    <div class="vote-item">
      <span class="vote-author">${escapeHtml(v.user_email?.split('@')[0] || 'Bruger')}</span>
      <span class="vote-choice" data-vote="${v.vote}">${voteLabel(v.vote)}</span>
      ${v.note ? `<span class="vote-note">«${escapeHtml(v.note)}»</span>` : ''}
    </div>
  `).join('');

  return `
    <article class="decision-card" data-id="${d.id}" data-slug="${d.slug}">
      <div class="decision-head">
        <h3>${escapeHtml(d.title)}</h3>
        <span class="badge badge-phase">${escapeHtml(d.phase || '')}</span>
        ${d.blocking ? '<span class="badge badge-blocking">🔒 BLOKERENDE</span>' : ''}
        <span class="badge badge-status" data-status="${status}">${status}</span>
      </div>
      <p class="decision-desc">${escapeHtml(d.description || '')}</p>
      ${user ? `
        <div class="vote-row">${voteBtns}</div>
        <input class="vote-note-input" type="text" placeholder="Note (valgfri)…" data-decision="${d.id}" value="${escapeHtml(myVote?.note || '')}" />
      ` : '<p class="muted">Log ind for at stemme.</p>'}
      <div class="votes-list">${votesList || '<span class="muted">Ingen stemmer endnu.</span>'}</div>
    </article>
  `;
}

function render() {
  const root = document.getElementById('decisions-list');
  if (!root) return;
  const user = getUser();
  if (!state.decisions.length) {
    root.innerHTML = '<p class="muted">Ingen beslutninger endnu. Kør <code>npm run seed</code> for at populere listen.</p>';
    return;
  }
  const cards = state.decisions
    .sort((a, b) => {
      if (a.blocking !== b.blocking) return a.blocking ? -1 : 1;
      return (a.phase || '').localeCompare(b.phase || '');
    })
    .map((d) => renderCard(d, state.votesByDecision.get(d.id) || [], user))
    .join('');
  root.innerHTML = cards;
  wireCards(root);
}

function wireCards(root) {
  root.querySelectorAll('.vote-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const user = getUser();
      if (!user) return alert('Log ind først.');
      const decisionId = btn.dataset.decision;
      const vote = btn.dataset.vote;
      const noteEl = root.querySelector(`input[data-decision="${decisionId}"]`);
      const note = noteEl?.value.trim() || null;
      await castVote(decisionId, vote, note);
    });
  });
}

async function castVote(decisionId, vote, note) {
  const user = getUser();
  if (!user) return;
  // Delete any prior vote from this user first, så vi har "seneste vinder"
  await supabase.from('decision_votes').delete().eq('decision_id', decisionId).eq('user_id', user.id);
  const { error } = await supabase.from('decision_votes').insert({
    decision_id: decisionId,
    user_id: user.id,
    user_email: user.email,
    vote,
    note,
  });
  if (error) {
    alert('Kunne ikke gemme stemme: ' + error.message);
    return;
  }
  // Efter stemme: genberegn status og opdater decisions-rækken
  await refreshDecision(decisionId);
}

async function refreshDecision(decisionId) {
  const { data: votes } = await supabase.from('decision_votes').select('*').eq('decision_id', decisionId);
  state.votesByDecision.set(decisionId, votes || []);
  const decision = state.decisions.find((d) => d.id === decisionId);
  if (decision) {
    const newStatus = deriveStatus(decision, votes || []);
    await maybeUpdateDecisionStatus(decision, newStatus);
    decision.status = newStatus;
  }
  render();
}

async function loadAll() {
  const [{ data: decisions }, { data: votes }] = await Promise.all([
    supabase.from('decisions').select('*'),
    supabase.from('decision_votes').select('*'),
  ]);
  state.decisions = decisions || [];
  state.votesByDecision.clear();
  for (const v of votes || []) {
    if (!state.votesByDecision.has(v.decision_id)) state.votesByDecision.set(v.decision_id, []);
    state.votesByDecision.get(v.decision_id).push(v);
  }
  render();
}

function subscribe() {
  if (state.subscribed) return;
  state.subscribed = true;
  supabase
    .channel('decisions-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'decisions' }, () => loadAll())
    .on('postgres_changes', { event: '*', schema: 'public', table: 'decision_votes' }, () => loadAll())
    .subscribe();
}

export function initDecisions() {
  if (!document.getElementById('decisions-list')) return;
  onAuthChange((user) => {
    if (user) {
      loadAll();
      subscribe();
    } else {
      state.decisions = [];
      render();
    }
  });
}
