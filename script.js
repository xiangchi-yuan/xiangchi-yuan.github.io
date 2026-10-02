"use strict";
const escapeHtml = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
function formatAuthors(authors = []) {
  return authors.map(author => author.toLowerCase().startsWith("xiangchi yuan") ? `<strong>${escapeHtml(author)}</strong>` : escapeHtml(author)).join(", ");
}
function renderPaper(paper) {
  const links = (paper.links || []).map(link => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`).join('<span class="link-separator"> / </span>');
  const primary = paper.links.find(link => link.label !== "Code");
  const title = primary ? `<a href="${escapeHtml(primary.url)}">${escapeHtml(paper.title)}</a>` : escapeHtml(paper.title);
  return `<article class="publication"><a class="figure-link" href="${escapeHtml(paper.thumb)}"><img class="pub-thumb" src="${escapeHtml(paper.thumb)}" alt="Method figure for ${escapeHtml(paper.title)}" loading="lazy"></a><div><h3 class="pub-title">${title}</h3><p class="pub-authors">${formatAuthors(paper.authors)}</p><p class="pub-venue">${escapeHtml(paper.venue)}</p><div class="pub-links">${links}</div>${paper.description ? `<p class="pub-description">${escapeHtml(paper.description)}</p>` : ""}</div></article>`;
}
function renderPublications(papers) {
  for (const [section, id] of [["preprint", "preprintList"], ["publication", "pubList"], ["collaboration", "collaborationList"]]) {
    document.getElementById(id).innerHTML = papers.filter(paper => paper.section === section).map(renderPaper).join("");
  }
  document.getElementById("pubStatus").hidden = true;
}
fetch("publications.json", { cache: "no-store" }).then(response => {
  if (!response.ok) throw new Error(response.status);
  return response.json();
}).then(renderPublications).catch(error => {
  document.getElementById("pubStatus").textContent = `Unable to load publications (${error.message}).`;
});
