/* THREADS · shared script
   1. Draws the header, navigation and footer on every page (edit NAV below to change the menu).
   2. Fills any element with data-list="…" from the matching spreadsheet in /data.
   3. Draws the moving gold thread and the strand illustrations. */

const NAV = [
  ["about.html", "About"], ["method.html", "Method"], ["gatherings.html", "Gatherings"],
  ["opera.html", "Opera"], ["film.html", "Film"], ["archive.html", "Archive"],
  ["people.html", "People"], ["publications.html", "Publications"], ["timeline.html", "Timeline"]
];
const NOTICE = "This site is in development. THREADS is a working name.";

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const yes = v => /^(yes|y|true|1)$/i.test(String(v || "").trim());
const shown = r => !/^(no|n|false|0|hide|hidden)$/i.test(String(r.show || "").trim());

/* ---------- header and footer ---------- */
function chrome() {
  const here = (location.pathname.split("/").pop() || "index.html");
  const head = document.getElementById("site-header");
  if (head) {
    head.innerHTML = `
      ${NOTICE ? `<div class="notice gutter">${esc(NOTICE)}</div>` : ""}
      <div class="gutter"><div class="inner">
        <nav class="site-nav" aria-label="Main">
          <a class="mark" href="./">THREADS<small>working name</small></a>
          <button class="menu-btn" aria-expanded="false" aria-controls="menu">Menu</button>
          <ul id="menu">${NAV.map(([h, t]) => `<li><a href="${h}"${here === h ? ' aria-current="page"' : ""}>${t}</a></li>`).join("")}</ul>
        </nav>
      </div></div>`;
    const btn = head.querySelector(".menu-btn"), ul = head.querySelector("ul");
    btn.addEventListener("click", () => { const o = ul.classList.toggle("open"); btn.setAttribute("aria-expanded", String(o)); });
  }
  const foot = document.getElementById("site-footer");
  if (foot) foot.innerHTML = `
    <div class="gutter"><div class="inner"><footer class="site">
      <div><div class="mark">THREADS</div>Led by Dr L. Gre · <a href="https://studiogre.studio">Studio Gre</a></div>
      <div class="funders">
        <img class="logo" src="images/logos/ukri-ahrc.svg" alt="UKRI Arts and Humanities Research Council">
        <img class="logo" src="images/logos/university-of-southampton.svg" alt="University of Southampton">
      </div>
    </footer></div></div>`;
}

/* ---------- spreadsheets ---------- */
function parseCSV(text) {
  text = text.replace(/^﻿/, "");
  const first = text.split(/\r?\n/, 1)[0];
  const delim = first.split(";").length > first.split(",").length ? ";" : ",";
  const rows = []; let row = [], f = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === delim) { row.push(f); f = ""; }
    else if (c === "\n") { row.push(f); rows.push(row); row = []; f = ""; }
    else if (c !== "\r") f += c;
  }
  if (f !== "" || row.length) { row.push(f); rows.push(row); }
  if (!rows.length) return [];
  const head = rows.shift().map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return rows.filter(r => r.some(x => x.trim() !== "")).map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
}
async function sheet(name) {
  const res = await fetch(`data/${name}.csv`, {cache: "no-cache"});
  if (!res.ok) throw new Error(`${name}.csv not found`);
  return parseCSV(await res.text());
}
const link = (href, text, cls = "") => href ? `<a class="${cls}" href="${esc(href)}"${/^https?:/.test(href) ? ' rel="noopener"' : ""}>${esc(text)}</a>` : "";
const paras = t => esc(t).split(/\n+/).filter(Boolean).map(p => `<p>${p}</p>`).join("");

const RENDER = {
  timeline(rows, el) {
    let list = rows.filter(shown);
    if (el.dataset.home !== undefined) list = list.filter(r => yes(r.show_on_home));
    const vertical = el.dataset.vertical !== undefined;
    return `<ol class="timeline${vertical ? " vertical" : ""}">${list.map(r => `
      <li class="${yes(r.current) ? "here" : ""}"><div class="when">${esc(r.date)}</div>
      <div class="what">${esc(r.title)}${vertical && r.strand ? `<span class="strandtag">${esc(r.strand)}</span>` : ""}</div>
      ${vertical && r.detail ? `<div class="detail">${esc(r.detail)}</div>` : ""}</li>`).join("")}</ol>`;
  },
  people(rows) {
    return `<div class="cards">${rows.filter(shown).map(r => `
      <article class="card person"><h3>${esc(r.name)}</h3><div class="role">${esc(r.role)}</div>
      ${r.affiliation ? `<div class="meta">${esc(r.affiliation)}</div>` : ""}${r.bio ? paras(r.bio) : ""}
      ${link(r.link, r.link_text || "More", "more")}</article>`).join("")}</div>`;
  },
  publications(rows) {
    return `<ul class="pubs">${rows.filter(shown).map(r => `
      <li><span class="yr">${esc(r.year)}</span>
      <span><span class="t">${r.link ? link(r.link, r.title) : esc(r.title)}</span>
      <span class="v">${esc([r.authors, r.venue].filter(Boolean).join(" · "))}</span></span>
      <span class="st">${esc(r.type)}${r.status ? " · " + esc(r.status) : ""}</span></li>`).join("")}</ul>`;
  },
  gatherings(rows) {
    return `<div class="cards">${rows.filter(shown).map(r => `
      <article class="card"><div class="meta">${esc(r.date)} · ${esc(r.place)}</div><h3>${esc(r.title)}</h3>
      ${r.summary ? paras(r.summary) : ""}${link(r.page, r.page_text || "Read more", "more")}</article>`).join("")}</div>`;
  },
  updates(rows) {
    return `<ul class="log">${rows.filter(shown).map(r => `
      <li><span class="when">${esc(r.date)}</span><div><h3>${esc(r.title)}</h3>${paras(r.text)}
      ${link(r.link, r.link_text || "Listen / watch", "more")}</div></li>`).join("")}</ul>`;
  },
  screenings(rows) {
    return `<ul class="log">${rows.filter(shown).map(r => `
      <li><span class="when">${esc(r.date)}</span><div><h3>${esc(r.title)}</h3><p>${esc([r.venue, r.city].filter(Boolean).join(", "))}</p>
      ${r.notes ? paras(r.notes) : ""}${link(r.link, r.link_text || "Details", "more")}</div></li>`).join("")}</ul>`;
  },
  archive(rows) {
    return `<div class="gallery">${rows.filter(shown).map(r => {
      const kind = (r.kind || "").toLowerCase(), src = r.file || "";
      let frame = `<span class="kind">${esc(kind || "item")}</span>`;
      if (kind === "photo" && src) frame = `<img src="${esc(src)}" alt="${esc(r.alt || r.title)}" loading="lazy">`;
      const audio = kind === "audio" && src ? `<audio controls preload="none" src="${esc(src)}"></audio>` : "";
      const open = (kind === "video" || kind === "document") && src ? link(src, kind === "video" ? "Watch" : "Open document", "more") : "";
      return `<figure class="item"><div class="frame">${frame}</div>${audio}
        <figcaption><b>${esc(r.title)}</b>${esc([r.date, r.place].filter(Boolean).join(" · "))}
        ${r.caption ? `<br>${esc(r.caption)}` : ""}${r.credit ? `<span class="credit">${esc(r.credit)}</span>` : ""}${open}</figcaption></figure>`;
    }).join("")}</div>`;
  }
};

async function fillLists() {
  for (const el of document.querySelectorAll("[data-list]")) {
    const [kind, file] = el.dataset.list.split(":");
    try {
      const rows = await sheet(file || kind);
      const visible = rows.filter(shown);
      el.innerHTML = visible.length ? RENDER[kind](rows, el) : `<div class="empty">${esc(el.dataset.empty || "Nothing here yet.")}</div>`;
    } catch (e) {
      el.innerHTML = `<div class="empty">This list couldn’t be loaded. ${esc(e.message)}.</div>`;
    }
  }
}

/* ---------- drawings ---------- */
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
function heroThread() {
  const c = document.getElementById("heroThread"); if (!c) return;
  const x = c.getContext("2d"); let t = 0;
  const size = () => { const r = c.getBoundingClientRect(), d = devicePixelRatio || 1; c.width = r.width * d; c.height = r.height * d; x.setTransform(d, 0, 0, d, 0, 0); };
  const line = (w, amp, freq, phase, y0, color, width, alpha) => {
    x.beginPath(); x.strokeStyle = color; x.lineWidth = width; x.globalAlpha = alpha;
    for (let px = 0; px <= w; px += 4) { const y = y0 + Math.sin(px * freq + phase) * amp + Math.sin(px * freq * 2.3 + phase * .7) * amp * .35; px ? x.lineTo(px, y) : x.moveTo(px, y); }
    x.stroke(); x.globalAlpha = 1;
  };
  const frame = () => {
    const r = c.getBoundingClientRect(), w = r.width, h = r.height; x.clearRect(0, 0, w, h);
    line(w, 14, .006, t * .6 + 1.2, h * .30, css("--haint"), 1, .35);
    line(w, 10, .009, t * .4 + 3.1, h * .86, css("--haint"), 1, .25);
    line(w, 22, .0045, t, h * .62, css("--gold"), 1.6, .9);
    if (!reduce) { t += .006; requestAnimationFrame(frame); }
  };
  size(); frame(); addEventListener("resize", () => { size(); if (reduce) frame(); });
}
function plates() {
  document.querySelectorAll("canvas[data-plate]").forEach(cv => {
    const g = cv.getContext("2d"), d = devicePixelRatio || 1, r = cv.getBoundingClientRect();
    cv.width = r.width * d; cv.height = r.height * d; g.scale(d, d);
    const w = r.width, h = r.height, gold = css("--gold"), haint = css("--haint"), fg = css("--muted");
    const kind = cv.dataset.plate;
    if (kind === "voice") {
      for (let i = 0; i < 90; i++) {
        const xx = w * .08 + i * (w * .84 / 90), env = Math.sin(i / 90 * Math.PI) ** 1.4;
        const a = (Math.sin(i * .9) * .5 + Math.sin(i * .23) * .5) * env * h * .32;
        g.fillStyle = i % 9 === 0 ? gold : haint; g.globalAlpha = .85; g.fillRect(xx, h / 2 - Math.abs(a) - 1, 2, Math.abs(a) * 2 + 2);
      }
    } else if (kind === "film") {
      for (let i = 0; i < 5; i++) {
        const fw = w * .16, fx = w * .07 + i * (fw + w * .025), fy = h * .3;
        g.strokeStyle = i === 2 ? gold : fg; g.globalAlpha = i === 2 ? 1 : .5; g.lineWidth = 1.2; g.strokeRect(fx, fy, fw, h * .4);
        if (i === 2) { g.fillStyle = gold; g.globalAlpha = .18; g.fillRect(fx, fy, fw, h * .4); }
      }
      g.globalAlpha = .9; g.strokeStyle = haint; g.beginPath(); g.moveTo(0, h * .82); g.lineTo(w, h * .82); g.stroke();
    } else {
      for (let i = 0; i < 7; i++) { g.strokeStyle = fg; g.globalAlpha = .45 + i * .06; g.lineWidth = 1; g.strokeRect(w * .18 + i * 7, h * .22 + i * 9, w * .5, h * .42); }
      g.globalAlpha = 1; g.strokeStyle = gold; g.lineWidth = 1.6; g.beginPath();
      g.moveTo(0, h * .75); g.bezierCurveTo(w * .35, h * .2, w * .6, h * 1, w, h * .35); g.stroke();
    }
    g.globalAlpha = 1;
  });
}

/* logos: until the official files are in images/logos, show the organisation's name instead */
function logos() {
  document.querySelectorAll("img.logo").forEach(img => {
    const swap = () => { const s = document.createElement("span"); s.className = "logo-text"; s.textContent = img.alt; img.replaceWith(s); };
    if (img.complete && img.naturalWidth === 0) swap(); else img.addEventListener("error", swap);
  });
}

chrome(); logos(); heroThread(); plates(); fillLists();
