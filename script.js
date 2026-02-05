"use strict";

const PUBS_URL = "publications.json";

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "className") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null) continue;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAuthors(authors) {

  return authors.map(a => (a.toLowerCase() === "xiangchi yuan" ? `<b>${escapeHtml(a)}</b>` : escapeHtml(a))).join(", ");
}

function renderPublications(pubs, typeFilter = "all") {
  const list = document.getElementById("pubList");
  const status = document.getElementById("pubStatus");
  list.innerHTML = "";

  const filtered = (typeFilter === "all") ? pubs : pubs.filter(p => p.type === typeFilter);

  if (filtered.length === 0) {
    status.textContent = "No publications match this filter.";
    return;
  }

  status.textContent = `Showing ${filtered.length} publication(s).`;

  filtered.sort((a, b) => (b.year - a.year) || (String(a.title).localeCompare(String(b.title))));

  for (const p of filtered) {
    const thumb = el("img", {
      src: p.thumb || "images/gt-seal_0.png",
      alt: p.title ? `Thumbnail for ${p.title}` : "Publication thumbnail"
    });

    const linksRow = el("div", { className: "row" });
    if (Array.isArray(p.links)) {
      for (const L of p.links) {
        if (!L?.url || !L?.label) continue;
        linksRow.appendChild(el("a", { href: L.url, target: "_blank", rel: "noopener noreferrer" }, L.label));
      }
    }

    const meta = el("div", { className: "pub-meta" });
    meta.innerHTML = `
      <div><span class="tag">${escapeHtml(p.venue || "Publication")}</span><span class="tag">${escapeHtml(p.year || "")}</span></div>
      <div style="margin-top:6px;">${formatAuthors(p.authors || [])}</div>
    `;

    const card = el("div", { className: "pub" },
      el("div", {}, thumb),
      el("div", {},
        el("p", { className: "pub-title" }, p.title || "(untitled)"),
        meta,
        linksRow
      )
    );

    list.appendChild(card);
  }
}

function renderYearSvg(pubs) {
  // Build counts per year
  const counts = new Map();
  for (const p of pubs) {
    const y = Number(p.year);
    if (!Number.isFinite(y)) continue;
    counts.set(y, (counts.get(y) || 0) + 1);
  }

  const years = Array.from(counts.keys()).sort((a, b) => a - b);
  const svg = document.getElementById("pubsYearSvg");

  while (svg.firstChild) svg.removeChild(svg.firstChild);


  if (years.length === 0) {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", "10");
    t.setAttribute("y", "30");
    t.textContent = "No year data found in publications.json";
    svg.appendChild(t);
    return;
  }


  const W = svg.viewBox?.baseVal?.width || Number(svg.getAttribute("width")) || 860;
  const H = svg.viewBox?.baseVal?.height || Number(svg.getAttribute("height")) || 220;

  const padL = 44, padR = 20, padT = 18, padB = 46;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const maxCount = Math.max(...years.map(y => counts.get(y)));
  const barW = innerW / years.length;

  const NS = "http://www.w3.org/2000/svg";

  function add(tag, attrs = {}, text = null) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
    if (text != null) n.textContent = text;
    svg.appendChild(n);
    return n;
  }


  add("line", { x1: padL, y1: padT + innerH, x2: padL + innerW, y2: padT + innerH, stroke: "#bbb" });


  years.forEach((y, i) => {
    const c = counts.get(y);
    const h = (c / maxCount) * innerH;
    const x = padL + i * barW + barW * 0.15;
    const w = barW * 0.7;
    const yTop = padT + (innerH - h);


    add("rect", { x, y: yTop, width: w, height: h, rx: 6, ry: 6, fill: "#d9d9d9", stroke: "#bdbdbd" });


    add("text", { x: x + w / 2, y: yTop - 6, "text-anchor": "middle", "font-size": "12" }, String(c));


    add("text", {
      x: x + w / 2,
      y: padT + innerH + 24,
      "text-anchor": "middle",
      "font-size": "12"
    }, String(y));
  });

  add("text", { x: padL, y: 14, "font-size": "12", fill: "#444" }, "Publications per year");
}

async function main() {
  const status = document.getElementById("pubStatus");
  const filter = document.getElementById("pubFilter");

  try {
    const res = await fetch(PUBS_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${PUBS_URL}: HTTP ${res.status}`);
    const pubs = await res.json();

    if (!Array.isArray(pubs)) throw new Error(`${PUBS_URL} must contain a JSON array.`);

    renderPublications(pubs, "all");
    renderYearSvg(pubs);

    filter.addEventListener("change", () => renderPublications(pubs, filter.value));
  } catch (err) {
    console.error(err);
    status.textContent = `Error: ${err.message}`;
  }
}

document.addEventListener("DOMContentLoaded", main);
