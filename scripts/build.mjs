#!/usr/bin/env node
// Wisestep Hub — markdown → HTML builder
// Læser /content/**/*.md og skriver HTML-sider til /docs/.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const OUT_DIR = path.join(ROOT, 'docs');

// ---------- helpers ----------

const slugify = (s) =>
  s
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ø/g, 'o')
    .replace(/æ/g, 'ae')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

marked.setOptions({ gfm: true, breaks: false });

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '');
}

// Post-process: giv h2/h3 auto-id og tilføj kommentar-anker på h2.
function enhanceHeadings(html) {
  html = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner) => {
    const id = slugify(stripTags(inner));
    return `<h2 id="${id}" class="section-heading" data-section-id="${id}">
      <span class="heading-text">${inner}</span>
      <button class="comment-anchor" data-section-id="${id}" aria-label="Vis kommentarer">💬</button>
    </h2>`;
  });
  html = html.replace(/<h3>([\s\S]*?)<\/h3>/g, (_, inner) => {
    const id = slugify(stripTags(inner));
    return `<h3 id="${id}">${inner}</h3>`;
  });
  return html;
}

// Erstat 🔒 og 🔄 med stylede badges. Ét pass via alternation.
function enhanceMarkers(html) {
  return html.replace(/🔒\s*blokerende|🔒|🔄\s*løbende|🔄/gi, (m) => {
    if (m.startsWith('🔒')) {
      const label = m.length > 2 ? '🔒 blokerende' : '🔒';
      return `<span class="marker marker-blocking" title="Blokerende">${label}</span>`;
    }
    const label = m.length > 2 ? '🔄 løbende' : '🔄';
    return `<span class="marker marker-ongoing" title="Løbende">${label}</span>`;
  });
}

// ---------- template ----------

function layout({ title, bodyHtml, pageSlug, nav, breadcrumbs, relRoot }) {
  return `<!doctype html>
<html lang="da">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <title>${title} — Wisestep Hub</title>
  <link rel="stylesheet" href="${relRoot}css/style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
</head>
<body data-page-slug="${pageSlug}">
  <div id="app" class="app-shell" hidden>
    <header class="topbar">
      <button class="menu-toggle" aria-label="Menu" aria-controls="sidebar">☰</button>
      <a class="brand" href="${relRoot}index.html"><span class="brand-mark"></span><span class="brand-text">Wisestep Hub</span></a>
      <div class="auth-slot" id="auth-slot"></div>
    </header>

    <aside class="sidebar" id="sidebar" aria-label="Sektioner">
      <nav>${nav}</nav>
    </aside>

    <main class="content-shell">
      <nav class="breadcrumbs" aria-label="Sti">${breadcrumbs}</nav>
      <article class="prose">
${bodyHtml}
      </article>
      <aside class="comments-rail" id="comments-rail" aria-label="Kommentarer"></aside>
    </main>

    <div class="comments-drawer" id="comments-drawer" hidden></div>
  </div>

  <div class="login-gate" id="login-gate">
    <div class="login-card">
      <h1>Wisestep Hub</h1>
      <p>Privat arbejdsrum. Log ind for at fortsætte.</p>
      <button id="login-google" class="btn btn-primary">Log ind med Google</button>
      <p class="login-hint">Kun whitelistede e-mails har adgang.</p>
    </div>
  </div>

  <script type="module" src="${relRoot}js/app.js"></script>
</body>
</html>
`;
}

// ---------- navigation ----------

const NAV_STRUCTURE = [
  { label: 'Forside', slug: 'index', href: 'index.html' },
  {
    label: 'Faser',
    children: [
      { label: '0 — Fundamenter', slug: 'faser/00-fundamenter', href: 'faser/00-fundamenter.html' },
      { label: '1 — Produktdefinition', slug: 'faser/01-produktdefinition', href: 'faser/01-produktdefinition.html' },
      { label: '2 — Jura', slug: 'faser/02-jura', href: 'faser/02-jura.html' },
      { label: '3 — Indhold', slug: 'faser/03-indhold', href: 'faser/03-indhold.html' },
      { label: '4 — Teknik', slug: 'faser/04-teknik', href: 'faser/04-teknik.html' },
      { label: '5 — App Store', slug: 'faser/05-appstore', href: 'faser/05-appstore.html' },
      { label: '6 — Test', slug: 'faser/06-test', href: 'faser/06-test.html' },
      { label: '7 — Lancering', slug: 'faser/07-lancering', href: 'faser/07-lancering.html' },
      { label: '8 — Post-launch', slug: 'faser/08-postlaunch', href: 'faser/08-postlaunch.html' },
    ],
  },
  { label: 'Beslutninger', slug: 'beslutninger', href: 'beslutninger.html' },
  { label: 'Manuskripter', slug: 'manuskripter/index', href: 'manuskripter/index.html' },
];

function renderNav(relRoot, activeSlug) {
  const item = (n) => {
    const isActive = n.slug === activeSlug;
    return `<li${isActive ? ' class="active"' : ''}><a href="${relRoot}${n.href}">${n.label}</a></li>`;
  };
  const group = (g) => {
    const items = g.children.map(item).join('');
    return `<li class="nav-group"><span class="nav-group-label">${g.label}</span><ul>${items}</ul></li>`;
  };
  const lis = NAV_STRUCTURE.map((n) => (n.children ? group(n) : item(n))).join('');
  return `<ul class="nav-root">${lis}</ul>`;
}

function renderBreadcrumbs(relRoot, slug, title) {
  const parts = [];
  parts.push(`<a href="${relRoot}index.html">Wisestep Hub</a>`);
  if (slug.startsWith('faser/')) parts.push('<span>Faser</span>');
  else if (slug === 'beslutninger') parts.push('<span>Beslutninger</span>');
  else if (slug.startsWith('manuskripter')) parts.push('<span>Manuskripter</span>');
  if (slug !== 'index') parts.push(`<span aria-current="page">${title}</span>`);
  return parts.join('<span class="crumb-sep">›</span>');
}

// ---------- build ----------

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function slugFromContentPath(mdPath) {
  const rel = path.relative(CONTENT_DIR, mdPath).replace(/\\/g, '/');
  const noExt = rel.replace(/\.md$/, '');
  if (noExt === 'manuskripter/README') return 'manuskripter/index';
  return noExt;
}

function outPathFromSlug(slug) {
  return path.join(OUT_DIR, `${slug}.html`);
}

function relRootFromSlug(slug) {
  const depth = slug.split('/').length - 1;
  return depth === 0 ? '' : '../'.repeat(depth);
}

async function ensureDir(p) {
  await fs.mkdir(path.dirname(p), { recursive: true });
}

async function buildPage(mdPath) {
  const raw = await fs.readFile(mdPath, 'utf8');
  const { data, content } = matter(raw);
  const slug = slugFromContentPath(mdPath);
  let html = marked.parse(content);
  html = enhanceHeadings(html);
  html = enhanceMarkers(html);
  const title = data.title || content.match(/^#\s+(.+)$/m)?.[1] || slug;
  const relRoot = relRootFromSlug(slug);
  const nav = renderNav(relRoot, slug);
  const breadcrumbs = renderBreadcrumbs(relRoot, slug, title);
  const page = layout({ title, bodyHtml: html, pageSlug: slug, nav, breadcrumbs, relRoot });
  const out = outPathFromSlug(slug);
  await ensureDir(out);
  await fs.writeFile(out, page);
  return { slug, title, out };
}

async function main() {
  const files = await walk(CONTENT_DIR);
  const results = [];
  for (const f of files) {
    results.push(await buildPage(f));
  }
  console.log(`✔ Byggede ${results.length} sider`);
  for (const r of results) {
    console.log(`  · ${r.slug} → ${path.relative(ROOT, r.out)}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
