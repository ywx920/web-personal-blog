const root = document.documentElement;
const themeButton = document.getElementById("theme-toggle");
function syncThemeButton() {
  if (!themeButton) return;
  const label = root.dataset.theme === "dark" ? "切换浅色模式" : "切换深色模式";
  themeButton.setAttribute("aria-label", label);
  themeButton.title = label;
}
syncThemeButton();
themeButton?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("notes-theme", root.dataset.theme); } catch (_) {}
  syncThemeButton();
  renderDiagrams();
});
const preferredTheme = matchMedia("(prefers-color-scheme: dark)");
preferredTheme.addEventListener("change", event => {
  let saved = null;
  try { saved = localStorage.getItem("notes-theme"); } catch (_) {}
  if (!saved) {
    root.dataset.theme = event.matches ? "dark" : "light";
    syncThemeButton();
    renderDiagrams();
  }
});

const searchDialog = document.getElementById("search-dialog");
const searchOpen = document.getElementById("search-open");
const searchClose = document.getElementById("search-close");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const searchStatus = document.getElementById("search-status");
let searchPromise = null;
function searchData() {
  if (!searchPromise) {
    searchPromise = fetch(document.body.dataset.searchUrl, {credentials: "same-origin"})
      .then(response => {
        if (!response.ok) throw new Error("Search index unavailable");
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error("Invalid search data");
        return data;
      })
      .catch(error => { searchPromise = null; throw error; });
  }
  return searchPromise;
}
async function renderSearch() {
  if (!searchInput || !searchResults || !searchStatus) return;
  const query = searchInput.value.trim().toLocaleLowerCase();
  searchStatus.textContent = "正在查找…";
  try {
    const data = await searchData();
    if (query !== searchInput.value.trim().toLocaleLowerCase()) return;
    const terms = query.split(/\s+/).filter(Boolean);
    const matches = data.filter(item => {
      const text = [item.title, item.description, ...(item.tags || [])].join(" ").toLocaleLowerCase();
      return terms.every(term => text.includes(term));
    }).sort((a, b) => {
      if (!query) return 0;
      const aTitle = String(a.title).toLocaleLowerCase().includes(query) ? 1 : 0;
      const bTitle = String(b.title).toLocaleLowerCase().includes(query) ? 1 : 0;
      return bTitle - aTitle;
    });
    searchResults.replaceChildren();
    searchStatus.textContent = query ? "找到 " + matches.length + " 条结果" : "最近笔记与精选项目";
    for (const item of matches.slice(0, 12)) {
      let url;
      try { url = new URL(item.url, location.origin); } catch (_) { continue; }
      if (url.origin !== location.origin || !["https:", "http:"].includes(url.protocol)) continue;
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.className = "search-result";
      link.href = url.href;
      const heading = document.createElement("span");
      heading.className = "search-result-heading";
      const title = document.createElement("span");
      title.className = "search-result-title";
      title.textContent = item.title;
      const kind = document.createElement("span");
      kind.className = "search-result-type";
      kind.textContent = item.type === "项目" ? "项目" : "笔记";
      const description = document.createElement("span");
      description.className = "search-result-description";
      description.textContent = item.description || "";
      heading.append(title, kind);
      link.append(heading, description);
      li.append(link);
      searchResults.append(li);
    }
    if (!matches.length) {
      const li = document.createElement("li");
      li.className = "empty-state";
      li.textContent = "没有找到结果，试试芯片型号、协议或项目名称。";
      searchResults.append(li);
    }
  } catch (_) {
    searchStatus.textContent = "搜索暂时不可用，请稍后重试。也可以从“项目”或“笔记”导航浏览。";
    searchResults.replaceChildren();
  }
}
function openSearch() {
  if (!searchDialog || !searchInput) return;
  if (!searchDialog.open) searchDialog.showModal();
  searchInput.focus();
  renderSearch();
}
searchOpen?.addEventListener("click", openSearch);
searchClose?.addEventListener("click", () => searchDialog.close());
searchDialog?.addEventListener("close", () => searchOpen?.focus());
searchDialog?.addEventListener("click", event => {
  if (event.target !== searchDialog) return;
  const bounds = searchDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) searchDialog.close();
});
let searchTimer;
searchInput?.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(renderSearch, 160);
});
searchInput?.addEventListener("keydown", event => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    searchResults.querySelector("a")?.focus();
  } else if (event.key === "Enter") {
    const first = searchResults.querySelector("a");
    if (first) { event.preventDefault(); first.click(); }
  }
});
document.addEventListener("keydown", event => {
  const element = document.activeElement;
  const editing = element?.matches("input,textarea,select") || element?.isContentEditable;
  if (event.key === "/" && !editing && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    openSearch();
  }
});

function initProjectFilters() {
  const input = document.getElementById("project-query");
  const buttons = [...document.querySelectorAll("[data-project-filter]")];
  const cards = [...document.querySelectorAll("[data-project-card]")];
  const counter = document.getElementById("project-count");
  const empty = document.getElementById("project-empty");
  if (!input || !buttons.length || !counter) return;
  let kind = "all";
  function update() {
    const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const card of cards) {
      const text = card.textContent.toLocaleLowerCase();
      const visible = (kind === "all" || card.dataset.kind === kind) && terms.every(term => text.includes(term));
      card.hidden = !visible;
      if (visible) shown += 1;
    }
    counter.textContent = "显示 " + shown + " / " + cards.length + " 个项目";
    if (empty) empty.hidden = shown > 0;
    for (const button of buttons) {
      const active = button.dataset.projectFilter === kind;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    }
  }
  input.addEventListener("input", update);
  for (const button of buttons) button.addEventListener("click", () => {
    kind = button.dataset.projectFilter;
    update();
  });
  function revealHashTarget() {
    if (!location.hash.startsWith("#project-")) return;
    kind = "all";
    input.value = "";
    update();
    const id = decodeURIComponent(location.hash.slice(1));
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({block: "start"}));
  }
  window.addEventListener("hashchange", revealHashTarget);
  update();
  revealHashTarget();
}
initProjectFilters();

function initOutline() {
  const body = document.getElementById("article-body");
  const navs = [...document.querySelectorAll("[data-toc-nav]")];
  if (!body || !navs.length) return;
  const headings = [...body.querySelectorAll("h2,h3")];
  for (const [index, heading] of headings.entries()) {
    if (!heading.id) heading.id = "section-" + (index + 1);
  }
  for (const nav of navs) {
    const list = document.createElement("ul");
    for (const heading of headings) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#" + heading.id;
      link.textContent = heading.textContent;
      link.className = "toc-link" + (heading.tagName === "H3" ? " is-subheading" : "");
      link.dataset.heading = heading.id;
      li.append(link);
      list.append(li);
    }
    nav.append(list);
  }
  if (!headings.length) {
    document.querySelector(".mobile-toc")?.setAttribute("hidden", "");
    return;
  }
  function activate(id) {
    for (const link of document.querySelectorAll(".toc-link")) {
      const active = link.dataset.heading === id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }
  activate(headings[0].id);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (visible.length) activate(visible[visible.length - 1].target.id);
    }, {rootMargin: "-10% 0px -65% 0px", threshold: 0});
    for (const heading of headings) observer.observe(heading);
  }
}
initOutline();

const diagramSources = [];
for (const element of document.querySelectorAll(".language-mermaid")) {
  if (element.closest(".mermaid")) continue;
  const source = element.querySelector("code")?.textContent || element.textContent;
  const host = element.closest(".highlighter-rouge") || element.closest("pre") || element;
  if (!host.isConnected) continue;
  const container = document.createElement("pre");
  container.className = "mermaid";
  container.textContent = source;
  host.replaceWith(container);
  diagramSources.push({node: container, source});
}
let mermaidPromise;
let diagramQueue = Promise.resolve();
function renderDiagrams() {
  if (!diagramSources.length) return diagramQueue;
  diagramQueue = diagramQueue.then(async () => {
    try {
      mermaidPromise ||= import("https://cdn.jsdelivr.net/npm/mermaid@12.2.0/dist/mermaid.esm.min.mjs");
      const mermaid = (await mermaidPromise).default;
      const dark = root.dataset.theme === "dark";
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: dark ? "dark" : "neutral",
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans SC, sans-serif",
        flowchart: {useMaxWidth: true, htmlLabels: false, curve: "linear"}
      });
      for (const {node, source} of diagramSources) {
        node.removeAttribute("data-processed");
        node.textContent = source;
      }
      await mermaid.run({nodes: diagramSources.map(item => item.node)});
    } catch (_) {
      for (const {node, source} of diagramSources) {
        node.removeAttribute("data-processed");
        node.textContent = source;
      }
    }
  });
  return diagramQueue;
}
renderDiagrams();

for (const block of document.querySelectorAll(".highlighter-rouge")) {
  if (block.classList.contains("language-mermaid")) continue;
  const code = block.querySelector("pre");
  if (!code) continue;
  const button = document.createElement("button");
  button.className = "copy-code";
  button.type = "button";
  button.textContent = "复制";
  button.setAttribute("aria-label", "复制代码");
  button.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(code.textContent); button.textContent = "已复制"; }
    catch (_) { button.textContent = "复制失败"; }
    setTimeout(() => { button.textContent = "复制"; }, 1600);
  });
  block.append(button);
}

// Retire only this blog's previous theme service worker, never other sites' scopes.
if ("serviceWorker" in navigator && document.body.dataset.siteRoot) {
  const ownScope = new URL(document.body.dataset.siteRoot, location.origin).href;
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      if (registration.scope === ownScope) registration.unregister();
    }
  }).catch(() => {});
}
