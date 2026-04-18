// Wisestep Hub — inline comments per (page_slug, section_id).
import { supabase, getUserDisplayName, getUserInitials } from './supabase.js';
import { getUser, onAuthChange } from './auth.js';

const PAGE_SLUG = document.body.dataset.pageSlug || 'unknown';

const state = {
  comments: [],       // array of rows
  sectionIds: [],     // section_ids på siden (inkl. 'page' til page-level)
  subscribed: false,
};

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

function initials(c) {
  const src = c.user_name || c.user_email || '?';
  return src
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || '')
    .join('') || '?';
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString('da-DK', { dateStyle: 'short', timeStyle: 'short' });
}

function groupByWhich(rows) {
  const groups = new Map();
  for (const r of rows) {
    const k = r.section_id || 'page';
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }
  return groups;
}

function sectionTitle(sectionId) {
  if (sectionId === 'page') return 'Hele siden';
  const el = document.getElementById(sectionId);
  if (el) {
    const clone = el.cloneNode(true);
    clone.querySelectorAll('.comment-anchor').forEach((e) => e.remove());
    return clone.textContent.trim();
  }
  return sectionId;
}

function renderRail() {
  const rail = document.getElementById('comments-rail');
  if (!rail) return;
  const user = getUser();
  const groups = groupByWhich(state.comments);

  // Find alle unikke section-ids på siden + 'page'
  const onPageIds = Array.from(document.querySelectorAll('.section-heading'))
    .map((el) => el.dataset.sectionId)
    .filter(Boolean);
  const allIds = ['page', ...onPageIds];

  const parts = allIds.map((sid) => {
    const list = groups.get(sid) || [];
    const title = sectionTitle(sid);
    const items = list.map((c) => renderComment(c, user)).join('');
    const empty = list.length ? '' : `<div class="comments-empty">Ingen kommentarer endnu.</div>`;
    const composer = user ? renderComposer(sid) : `<div class="comments-empty">Log ind for at kommentere.</div>`;
    return `
      <div class="comment-group" data-section-id="${sid}">
        <div class="comment-group-title">${escapeHtml(title)}</div>
        <div class="comment-list">${items || empty}</div>
        <div class="comment-composer">${composer}</div>
      </div>
    `;
  });

  rail.innerHTML = parts.join('');
  wireComposers(rail);
}

function renderComment(c, user) {
  const isMine = user && c.user_id === user.id;
  return `
    <div class="comment ${c.resolved ? 'resolved' : ''}" data-id="${c.id}">
      <span class="comment-avatar">${initials(c)}</span>
      <div class="comment-body">
        <div class="comment-meta">
          <span class="c-author">${escapeHtml(c.user_name || c.user_email || 'Bruger')}</span>
          <span>${formatTime(c.created_at)}</span>
        </div>
        <div class="comment-text">${escapeHtml(c.body)}</div>
        <div class="comment-actions">
          <button class="btn-ghost" data-action="toggle-resolve">${c.resolved ? 'Gen-åbn' : 'Marker løst'}</button>
          ${isMine ? `<button class="btn-ghost" data-action="delete">Slet</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderComposer(sid) {
  return `
    <textarea placeholder="Skriv en kommentar…" data-section-id="${sid}"></textarea>
    <div class="comment-composer-row">
      <button class="btn btn-primary btn-sm" data-action="post" data-section-id="${sid}">Send</button>
    </div>
  `;
}

function wireComposers(root) {
  root.querySelectorAll('[data-action="post"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const sid = btn.dataset.sectionId;
      const ta = root.querySelector(`textarea[data-section-id="${sid}"]`);
      const body = ta?.value.trim();
      if (!body) return;
      btn.disabled = true;
      const ok = await postComment(sid, body);
      btn.disabled = false;
      if (ok) ta.value = '';
    });
  });
  root.querySelectorAll('[data-action="toggle-resolve"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.closest('.comment')?.dataset.id;
      if (!id) return;
      const row = state.comments.find((c) => c.id === id);
      if (!row) return;
      await supabase.from('comments').update({ resolved: !row.resolved }).eq('id', id);
    });
  });
  root.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.closest('.comment')?.dataset.id;
      if (!id) return;
      if (!confirm('Slet kommentar?')) return;
      await supabase.from('comments').delete().eq('id', id);
    });
  });
}

async function postComment(sectionId, body) {
  const user = getUser();
  if (!user) return false;
  const payload = {
    page_slug: PAGE_SLUG,
    section_id: sectionId,
    user_id: user.id,
    user_email: user.email,
    user_name: getUserDisplayName(user),
    body,
    resolved: false,
  };
  const { error } = await supabase.from('comments').insert(payload);
  if (error) {
    console.error('Post fejl', error);
    alert('Kunne ikke sende: ' + error.message);
    return false;
  }
  return true;
}

async function loadComments() {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('page_slug', PAGE_SLUG)
    .order('created_at', { ascending: true });
  if (error) {
    console.error('Load fejl', error);
    return;
  }
  state.comments = data || [];
  renderRail();
}

function subscribe() {
  if (state.subscribed) return;
  state.subscribed = true;
  supabase
    .channel(`comments:${PAGE_SLUG}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'comments', filter: `page_slug=eq.${PAGE_SLUG}` },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          state.comments.push(payload.new);
        } else if (payload.eventType === 'UPDATE') {
          const i = state.comments.findIndex((c) => c.id === payload.new.id);
          if (i >= 0) state.comments[i] = payload.new;
        } else if (payload.eventType === 'DELETE') {
          state.comments = state.comments.filter((c) => c.id !== payload.old.id);
        }
        renderRail();
      }
    )
    .subscribe();
}

function wireAnchorButtons() {
  // På mobile: åbner drawer. På desktop: scroll til relevant comment group.
  document.querySelectorAll('.comment-anchor').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sid = btn.dataset.sectionId;
      const group = document.querySelector(`.comment-group[data-section-id="${sid}"]`);
      if (group && window.innerWidth > 960) {
        group.scrollIntoView({ behavior: 'smooth', block: 'center' });
        group.animate(
          [{ boxShadow: '0 0 0 2px var(--color-accent)' }, { boxShadow: 'var(--shadow-soft)' }],
          { duration: 900, easing: 'ease-out' }
        );
      } else {
        openDrawer(sid);
      }
    });
  });
}

function openDrawer(sid) {
  const drawer = document.getElementById('comments-drawer');
  if (!drawer) return;
  const groups = groupByWhich(state.comments);
  const list = groups.get(sid) || [];
  const user = getUser();
  drawer.innerHTML = `
    <div class="comments-drawer-head">
      <strong>${escapeHtml(sectionTitle(sid))}</strong>
      <button class="btn btn-ghost" id="drawer-close">Luk</button>
    </div>
    <div class="comment-list">${list.map((c) => renderComment(c, user)).join('') || '<div class="comments-empty">Ingen kommentarer endnu.</div>'}</div>
    <div class="comment-composer">${user ? renderComposer(sid) : '<div class="comments-empty">Log ind for at kommentere.</div>'}</div>
  `;
  drawer.hidden = false;
  document.getElementById('drawer-close')?.addEventListener('click', () => (drawer.hidden = true));
  wireComposers(drawer);
}

export function initComments() {
  wireAnchorButtons();
  onAuthChange((user) => {
    if (user) {
      loadComments();
      subscribe();
    } else {
      state.comments = [];
      renderRail();
    }
  });
}
