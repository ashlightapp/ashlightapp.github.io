// release.config.json
var release_config_default = {
  updateUrl: "https://ashlightapp.github.io/updates",
  repo: "ashlightapp/ashlightapp.github.io"
};

// src/shared/settings.ts
var SHARE_SERVER = "https://app-804a9dc99f9869a8.up.railway.app";

// src/panel/panel.ts
var API = "https://api.github.com";
var REPO = release_config_default.repo;
var OWNER = REPO.split("/")[0];
var SITE = release_config_default.updateUrl.replace(/\/updates$/, "");
var FILE = "announce.json";
var KEY = "ttool.panel.token";
var TOKEN_URL = `https://github.com/settings/personal-access-tokens/new?${new URLSearchParams({
  name: "Ashlight panel",
  description: "Sends messages to Ashlight from the admin panel.",
  target_name: OWNER,
  expires_in: "366",
  contents: "write",
  administration: "read",
  pages: "read"
})}`;
var $ = (id) => document.getElementById(id);
var TEMPLATES = {
  update: { level: "update", title: "A new Ashlight is out", text: "Open Ashlight and press Update to get it." },
  maintenance: { level: "info", title: "Heads up", text: "Some features may be unavailable for a short while." },
  important: { level: "important", title: "Important", text: "" },
  thanks: { level: "info", title: "Thanks for using Ashlight", text: "Tell your friends, it's free." }
};
var store = {
  get: () => {
    try {
      return sessionStorage.getItem(KEY) || localStorage.getItem(KEY) || "";
    } catch {
      return "";
    }
  },
  set: (token, remember) => {
    try {
      sessionStorage.setItem(KEY, token);
      if (remember)
        localStorage.setItem(KEY, token);
    } catch {}
  },
  clear: () => {
    try {
      sessionStorage.removeItem(KEY);
      localStorage.removeItem(KEY);
    } catch {}
  }
};
var token = "";
var current = null;
var level = "info";
var gh = (path, init = {}) => fetch(`${API}${path}`, {
  ...init,
  headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`, "X-GitHub-Api-Version": "2022-11-28", ...init.headers ?? {} }
});
var b64 = (text) => btoa(String.fromCharCode(...new TextEncoder().encode(text)));
var unb64 = (data) => new TextDecoder().decode(Uint8Array.from(atob(data.replace(/\s/g, "")), (c) => c.charCodeAt(0)));
function status(text, bad = false) {
  const el = $("status");
  el.textContent = text;
  el.classList.toggle("bad", bad);
  el.classList.add("show");
  clearTimeout(el.timer);
  el.timer = setTimeout(() => el.classList.remove("show"), 5000);
}
async function signIn(candidate, remember) {
  token = candidate.trim();
  if (!token)
    return;
  $("signInButton").textContent = "Checking";
  $("signInError").textContent = "";
  try {
    const r = await gh(`/repos/${REPO}`);
    const repo = r.ok ? await r.json() : null;
    if (!repo?.permissions?.push) {
      token = "";
      store.clear();
      $("signInError").textContent = r.status === 401 ? "GitHub doesn't accept that token. Make a new one." : r.status === 404 ? "That token can't see Ashlight's site. Pick the ttool repository when making it." : "That token can't change Ashlight's site.";
      return;
    }
    if (!location.hash.startsWith("#local="))
      store.set(token, remember);
    const me = await gh("/user");
    if (me.ok) {
      const user = await me.json();
      $("who").textContent = user.login;
      $("whoAvatar").src = user.avatar_url;
    }
    $("signIn").hidden = true;
    $("dash").hidden = false;
    await refresh();
  } catch {
    $("signInError").textContent = "Couldn't reach GitHub. Check your connection.";
  } finally {
    $("signInButton").textContent = "Sign in";
  }
}
async function loadFile() {
  const r = await gh(`/repos/${REPO}/contents/${FILE}?ref=main`);
  if (r.status === 404)
    return null;
  if (!r.ok)
    throw new Error(String(r.status));
  const j = await r.json();
  return { sha: j.sha, data: JSON.parse(unb64(j.content)) };
}
async function loadCurrent() {
  const file = await loadFile();
  return file && file.data.id ? { sha: file.sha, data: file.data } : null;
}
var LEVEL_ICON = { info: "i", update: "↓", important: "!" };
function previewCard(a) {
  const card = document.createElement("div");
  card.className = `notice ${a.level ?? "info"}`;
  const icon = document.createElement("span");
  icon.className = "notice-icon";
  icon.textContent = LEVEL_ICON[a.level ?? "info"];
  const text = document.createElement("div");
  const title = document.createElement("b");
  title.textContent = a.title || "Your title";
  const body = document.createElement("p");
  body.textContent = a.text || "";
  text.append(title, body);
  card.append(icon, text);
  if (a.url) {
    const open = document.createElement("span");
    open.className = "fake-btn";
    open.textContent = "Open";
    card.append(open);
  }
  return card;
}
function renderLive() {
  const box = $("live");
  box.replaceChildren();
  const expired = current?.data.expires && new Date(current.data.expires) < new Date;
  if (!current) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "Nothing is showing.";
    box.append(p);
  } else {
    box.append(previewCard(current.data));
    const when = document.createElement("p");
    when.className = "muted";
    const until = current.data.expires ? ` · ${expired ? "ended" : "until"} ${new Date(current.data.expires).toLocaleString()}` : "";
    when.textContent = `${current.data.site ? "App and website" : "App only"}${until}`;
    box.append(when);
  }
  $("liveActions").hidden = !current;
}
async function loadHistory() {
  const list = $("history");
  list.replaceChildren();
  const r = await gh(`/repos/${REPO}/commits?path=${FILE}&per_page=10`);
  if (!r.ok)
    return;
  const commits = await r.json();
  for (const c of commits) {
    const li = document.createElement("li");
    const t = document.createElement("span");
    t.textContent = c.commit.message.split(`
`)[0].replace(/^Announcement: /, "");
    const d = document.createElement("time");
    d.textContent = new Date(c.commit.author.date).toLocaleDateString();
    li.append(t, d);
    list.append(li);
  }
  if (!commits.length) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "Nothing sent yet.";
    list.append(li);
  }
}
async function loadStats() {
  try {
    const latest = await (await fetch(`${SITE}/updates/latest.json?${Date.now()}`, { cache: "no-store" })).json();
    $("statVersion").textContent = latest.version;
    $("statNotes").textContent = latest.notes ?? "";
  } catch {
    $("statVersion").textContent = "?";
  }
  const [pages, views] = await Promise.all([gh(`/repos/${REPO}/pages`), gh(`/repos/${REPO}/traffic/views`)]);
  $("statSite").textContent = pages.ok ? (await pages.json()).status === "built" ? "Online" : "Updating" : "Online";
  $("statViews").textContent = views.ok ? String((await views.json()).uniques ?? 0) : "—";
}
var suggestFilter = "pending";
async function loadSuggestions() {
  const list = $("suggestions");
  try {
    const r = await fetch(`${SHARE_SERVER}/suggestions${suggestFilter ? `?status=${suggestFilter}` : ""}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!r.ok)
      throw new Error(r.status === 403 ? "Only the owner's GitHub account can see suggestions." : `The server answered ${r.status}.`);
    const rows = await r.json();
    list.replaceChildren();
    if (!rows.length) {
      const li = document.createElement("li");
      li.className = "muted";
      li.textContent = suggestFilter === "pending" ? "Nothing new." : "None here.";
      list.append(li);
    }
    for (const s of rows)
      list.append(suggestionRow(s));
  } catch (e) {
    list.replaceChildren(Object.assign(document.createElement("li"), { className: "muted", textContent: e.message || "Couldn't reach the Ashlight server." }));
  }
}
function suggestionRow(s) {
  const li = document.createElement("li");
  const text = document.createElement("p");
  text.textContent = s.text;
  const meta = document.createElement("small");
  meta.className = "muted";
  meta.textContent = `${s.name || "Someone"} · ${new Date(s.created).toLocaleString()} · ${s.status}${s.reply ? ` · "${s.reply}"` : ""}`;
  const actions = document.createElement("div");
  actions.className = "row";
  const button = (label, status2, primary = false) => {
    const b = document.createElement("button");
    b.className = `small-btn ${primary ? "primary" : "ghost"}`;
    b.textContent = label;
    b.addEventListener("click", async () => {
      const reply = status2 === "declined" ? prompt("A short reason they'll see (optional)", "") ?? "" : "";
      b.disabled = true;
      const r = await fetch(`${SHARE_SERVER}/suggestions/${s.id}`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(status2 === "delete" ? { delete: true } : { status: status2, reply }) });
      status_(r.ok ? "Saved." : "The server refused that.", !r.ok);
      await loadSuggestions();
    });
    return b;
  };
  if (s.status !== "accepted")
    actions.append(button("Accept", "accepted", true));
  if (s.status === "accepted")
    actions.append(button("Mark added", "done", true));
  if (s.status !== "declined")
    actions.append(button("Decline", "declined"));
  if (s.status !== "pending")
    actions.append(button("Back to new", "pending"));
  actions.append(button("Delete", "delete"));
  li.append(text, meta, actions);
  return li;
}
var status_ = (text, bad = false) => status(text, bad);
async function refresh() {
  loadSuggestions();
  try {
    current = await loadCurrent();
    renderLive();
    await Promise.all([loadHistory(), loadStats()]);
  } catch {
    status("Couldn't load from GitHub.", true);
  }
}
function setLevel(next) {
  level = next;
  document.querySelectorAll("#levels button").forEach((b) => b.classList.toggle("on", b.dataset.level === next));
  paintPreview();
}
function form() {
  const days = Number($("expires").value);
  const data = {
    id: Date.now().toString(36),
    title: $("title").value.trim().slice(0, 80),
    text: $("text").value.trim().slice(0, 600),
    level,
    site: $("site").checked,
    at: new Date().toISOString()
  };
  const url = $("url").value.trim();
  if (url)
    data.url = url;
  if (days > 0)
    data.expires = new Date(Date.now() + days * 86400000).toISOString();
  return data;
}
function fill(a) {
  $("title").value = a.title ?? "";
  $("text").value = a.text ?? "";
  $("url").value = a.url ?? "";
  if (a.site !== undefined)
    $("site").checked = a.site;
  setLevel(a.level ?? "info");
  $("title").focus();
}
function paintPreview() {
  $("preview").replaceChildren(previewCard(form()));
  $("count").textContent = `${$("text").value.length} / 600`;
}
async function send() {
  const data = form();
  if (!data.title)
    return status("Add a title first.", true);
  if (data.url && !/^https:\/\/\S+$/.test(data.url))
    return status("Links must start with https://", true);
  $("send").setAttribute("disabled", "");
  $("send").textContent = "Sending";
  try {
    const latest = await loadFile();
    const r = await gh(`/repos/${REPO}/contents/${FILE}`, {
      method: "PUT",
      body: JSON.stringify({ author: { name: "Ashlight", email: "bot@ashlightapp.invalid" }, committer: { name: "Ashlight", email: "bot@ashlightapp.invalid" }, message: `Announcement: ${data.title}`, content: b64(`${JSON.stringify(data, null, 2)}
`), branch: "main", ...latest ? { sha: latest.sha } : {} })
    });
    if (!r.ok)
      throw new Error(String(r.status));
    status("Sent. Apps show it within 30 minutes, or right away when opened.");
    fill({});
    await refresh();
  } catch {
    status("GitHub refused that. Sign in again and retry.", true);
  } finally {
    $("send").removeAttribute("disabled");
    $("send").textContent = "Send to everyone";
  }
}
async function clear() {
  if (!current)
    return;
  if (!confirm("Stop showing this message?"))
    return;
  const r = await gh(`/repos/${REPO}/contents/${FILE}`, { method: "PUT", body: JSON.stringify({ author: { name: "Ashlight", email: "bot@ashlightapp.invalid" }, committer: { name: "Ashlight", email: "bot@ashlightapp.invalid" }, message: "Announcement cleared", content: b64(`{}
`), sha: current.sha, branch: "main" }) });
  if (r.ok) {
    status("Stopped. Apps hide it at their next check.");
    await refresh();
  } else
    status("GitHub refused that.", true);
}
async function localSignIn() {
  const key = location.hash.match(/^#local=([a-f0-9]{32})$/)?.[1];
  if (!key || location.hostname !== "127.0.0.1")
    return false;
  try {
    const r = await fetch(`/session/${key}`, { cache: "no-store" });
    if (!r.ok)
      return false;
    await signIn(await r.text(), false);
    history.replaceState(null, "", location.pathname);
    return true;
  } catch {
    return false;
  }
}
function start() {
  $("repo").textContent = REPO;
  $("makeToken").href = TOKEN_URL;
  $("openSite").href = `${SITE}/`;
  $("signInForm").addEventListener("submit", (e) => {
    e.preventDefault();
    signIn($("token").value, $("remember").checked);
    $("token").value = "";
  });
  $("token").addEventListener("paste", () => setTimeout(() => $("signInForm").dispatchEvent(new Event("submit", { cancelable: true })), 0));
  for (const id of ["title", "text", "url", "expires", "site"])
    $(id).addEventListener("input", paintPreview);
  document.querySelectorAll("#levels button").forEach((b) => b.addEventListener("click", () => setLevel(b.dataset.level)));
  document.querySelectorAll("#suggestFilter button").forEach((b) => b.addEventListener("click", () => {
    suggestFilter = b.dataset.f ?? "";
    document.querySelectorAll("#suggestFilter button").forEach((x) => x.classList.toggle("on", x === b));
    loadSuggestions();
  }));
  document.querySelectorAll("#templates button").forEach((b) => b.addEventListener("click", () => fill(TEMPLATES[b.dataset.template])));
  $("send").addEventListener("click", () => void send());
  $("clear").addEventListener("click", () => void clear());
  $("edit").addEventListener("click", () => current && fill(current.data));
  $("reload").addEventListener("click", () => void refresh());
  $("signOut").addEventListener("click", () => {
    store.clear();
    token = "";
    location.reload();
  });
  setLevel("info");
  (async () => {
    if (await localSignIn())
      return;
    const saved = store.get();
    if (saved)
      signIn(saved, false);
  })();
}
start();
