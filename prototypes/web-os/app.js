const desktop = document.getElementById("desktop");
const startMenu = document.getElementById("start-menu");
const startSearch = document.getElementById("start-search");
const globalSearch = document.getElementById("global-search");
const widgetsPanel = document.getElementById("widgets-panel");
const notificationsPanel = document.getElementById("notifications-panel");
const quickSettings = document.getElementById("quick-settings");
const taskViewPanel = document.getElementById("task-view-panel");
const contextMenu = document.getElementById("context-menu");
const explorerGrid = document.getElementById("explorer-grid");
const explorerMain = document.querySelector(".explorer-main");
const explorerPath = document.getElementById("explorer-path");
const explorerSearch = document.getElementById("explorer-search");
const dropHint = document.getElementById("drop-hint");
const settingsPanel = document.getElementById("settings-panel");
const terminalOutput = document.getElementById("terminal-output");
const terminalInput = document.getElementById("terminal-input");
const aiInput = document.getElementById("ai-input");
const aiOutput = document.getElementById("ai-output");
const archiveInput = document.getElementById("archive-input");
const extractStatus = document.getElementById("extract-status");
const newFolderBtn = document.getElementById("new-folder-btn");
const renameItemBtn = document.getElementById("rename-item-btn");
const bluetoothPanel = document.getElementById("bluetooth-panel");
const browserFrame = document.getElementById("browser-frame");
const browserUrl = document.getElementById("browser-url");
const browserStatusText = document.getElementById("browser-status-text");
const networkStatus = document.getElementById("network-status");

const STORAGE_KEY = "windows11_web_os_preview_v1";

let zTop = 10;
let selectedItem = null;

const state = {
  currentPath: "C:/Users/Demo/",
  search: "",
  desktops: ["Desktop 1", "Desktop 2"],
  activeDesktop: 0,
  windowState: {},
  toggles: {
    wifi: true,
    bluetooth: false,
    darkmode: true,
    nightlight: false,
  },
  brightness: 100,
  volume: 52,
  wallpaper: "win11",
  wallpaperData: "",
  bluetoothDevices: [],
  browserHistory: ["https://example.com"],
  browserIndex: 0,
};

const DEFAULT_FS_MAP = {
  "C:/": [
    { name: "Users", type: "dir", modified: "Today" },
    { name: "Program Files", type: "dir", modified: "Today" },
    { name: "Windows", type: "dir", modified: "Today" },
  ],
  "C:/Users/": [{ name: "Demo", type: "dir", modified: "Today" }],
  "C:/Users/Demo/": [
    { name: "Desktop", type: "dir", modified: "Today" },
    { name: "Documents", type: "dir", modified: "Today" },
    { name: "Downloads", type: "dir", modified: "Today" },
    { name: "Pictures", type: "dir", modified: "Today" },
    { name: "notes.txt", type: "file", ext: "txt", size: 3, modified: "Today", content: "hello" },
  ],
  "C:/Users/Demo/Desktop/": [
    { name: "Roadmap.docx", type: "file", ext: "docx", size: 420, modified: "Today" },
    { name: "Browser.lnk", type: "file", ext: "lnk", size: 2, modified: "Today" },
  ],
  "C:/Users/Demo/Documents/": [
    { name: "Budget.xlsx", type: "file", ext: "xlsx", size: 210, modified: "Today" },
    { name: "Specs.md", type: "file", ext: "md", size: 16, modified: "Today" },
  ],
  "C:/Users/Demo/Downloads/": [
    { name: "setup.exe", type: "file", ext: "exe", size: 8400, modified: "Today" },
    { name: "archive.zip", type: "file", ext: "zip", size: 2350, modified: "Today" },
  ],
  "C:/Users/Demo/Pictures/": [{ name: "wallpaper.jpg", type: "file", ext: "jpg", size: 1600, modified: "Today" }],
  "C:/Program Files/": [{ name: "ExtractX", type: "dir", modified: "Today" }],
};

let fsMap = JSON.parse(JSON.stringify(DEFAULT_FS_MAP));

function persistState() {
  try {
    const payload = {
      fsMap,
      state: {
        currentPath: state.currentPath,
        desktops: state.desktops,
        activeDesktop: state.activeDesktop,
        windowState: state.windowState,
        toggles: state.toggles,
        brightness: state.brightness,
        volume: state.volume,
        wallpaper: state.wallpaper,
        wallpaperData: state.wallpaperData,
        bluetoothDevices: state.bluetoothDevices,
        browserHistory: state.browserHistory,
        browserIndex: state.browserIndex,
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (_) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.fsMap && typeof parsed.fsMap === "object") {
      fsMap = parsed.fsMap;
    }
    if (parsed && parsed.state && typeof parsed.state === "object") {
      if (typeof parsed.state.currentPath === "string") state.currentPath = parsed.state.currentPath;
      if (Array.isArray(parsed.state.desktops) && parsed.state.desktops.length > 0) state.desktops = parsed.state.desktops;
      if (typeof parsed.state.activeDesktop === "number") state.activeDesktop = parsed.state.activeDesktop;
      if (parsed.state.windowState && typeof parsed.state.windowState === "object") state.windowState = parsed.state.windowState;
      if (parsed.state.toggles && typeof parsed.state.toggles === "object") state.toggles = { ...state.toggles, ...parsed.state.toggles };
      if (typeof parsed.state.brightness === "number") state.brightness = parsed.state.brightness;
      if (typeof parsed.state.volume === "number") state.volume = parsed.state.volume;
      if (typeof parsed.state.wallpaper === "string") state.wallpaper = parsed.state.wallpaper;
      if (typeof parsed.state.wallpaperData === "string") state.wallpaperData = parsed.state.wallpaperData;
      if (Array.isArray(parsed.state.bluetoothDevices)) state.bluetoothDevices = parsed.state.bluetoothDevices;
      if (Array.isArray(parsed.state.browserHistory) && parsed.state.browserHistory.length > 0) state.browserHistory = parsed.state.browserHistory;
      if (typeof parsed.state.browserIndex === "number") state.browserIndex = parsed.state.browserIndex;
    }
  } catch (_) {}
}

function applyWallpaper() {
  document.body.classList.remove("wallpaper-win11", "wallpaper-slate", "wallpaper-night");
  if (state.wallpaper === "custom") {
    if (state.wallpaperData) {
      document.body.style.setProperty("--wallpaper-image", `url('${state.wallpaperData}')`);
      document.body.style.setProperty("--wallpaper-opacity", "1");
    }
    return;
  }
  const map = {
    win11: "wallpaper-win11",
    slate: "wallpaper-slate",
    night: "wallpaper-night",
  };
  document.body.classList.add(map[state.wallpaper] || "wallpaper-win11");
}

function setCustomWallpaper(dataUrl) {
  state.wallpaperData = dataUrl;
  document.body.style.setProperty("--wallpaper-image", `url('${dataUrl}')`);
  document.body.style.setProperty("--wallpaper-opacity", "1");
  state.wallpaper = "custom";
  persistState();
}

function norm(path) {
  let p = path.replace(/\\/g, "/");
  if (!p.endsWith("/")) p += "/";
  return p;
}

function joinPath(base, name) {
  return norm(base) + name + "/";
}

function ensureDir(path) {
  const p = norm(path);
  if (!fsMap[p]) fsMap[p] = [];
  if (p === "C:/") return;
  const parts = p.split("/").filter(Boolean);
  const parent = parts.length === 1 ? "C:/" : `${parts.slice(0, -1).join("/")}/`;
  const dirName = parts[parts.length - 1];
  if (!fsMap[parent]) fsMap[parent] = [];
  if (!fsMap[parent].some((i) => i.type === "dir" && i.name === dirName)) {
    fsMap[parent].push({ name: dirName, type: "dir", modified: "Today" });
    persistState();
  }
}

function addFile(fullPath, bytes = 0) {
  const parts = fullPath.replace(/\\/g, "/").split("/").filter(Boolean);
  const fileName = parts[parts.length - 1];
  const parent = `${parts.slice(0, -1).join("/")}/`;
  ensureDir(parent);
  const ext = fileName.includes(".") ? fileName.split(".").pop().toLowerCase() : "file";
  if (!fsMap[parent].some((i) => i.type === "file" && i.name === fileName)) {
    fsMap[parent].push({ name: fileName, type: "file", ext, size: Math.max(1, Math.round(bytes / 1024)), modified: "Today" });
    persistState();
  }
}

function fileIcon(item) {
  if (item.type === "dir") return "icons/explorer.svg";
  if (["exe", "msi", "bat"].includes(item.ext)) return "icons/terminal.svg";
  if (["zip", "rar", "7z", "tar", "gz"].includes(item.ext)) return "icons/extract.svg";
  return "icons/settings.svg";
}

function renderExplorer() {
  if (!fsMap[state.currentPath]) state.currentPath = "C:/Users/Demo/";
  const items = (fsMap[state.currentPath] || []).filter((i) => i.name.toLowerCase().includes(state.search.toLowerCase()));
  explorerPath.textContent = state.currentPath.replace(/\//g, "\\");
  explorerGrid.innerHTML = items
    .map((item) => {
      const full = item.type === "dir" ? joinPath(state.currentPath, item.name) : `${state.currentPath}${item.name}`;
      return `
        <article class="file-item" data-name="${item.name}" data-type="${item.type}" data-path="${full}">
          <div><img src="${fileIcon(item)}" class="app-icon" alt=""> ${item.name}</div>
          <div class="meta">${item.type === "dir" ? "Folder" : `${item.ext.toUpperCase()} ${item.size} KB`} | ${item.modified}</div>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll(".file-item").forEach((node) => {
    node.addEventListener("click", () => {
      selectedItem = { path: node.dataset.path, type: node.dataset.type, name: node.dataset.name };
      document.querySelectorAll(".file-item").forEach((itemNode) => itemNode.classList.remove("selected"));
      node.classList.add("selected");
    });
    node.addEventListener("dblclick", () => openItem(node.dataset.path, node.dataset.type));
    node.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      selectedItem = { path: node.dataset.path, type: node.dataset.type, name: node.dataset.name };
      document.querySelectorAll(".file-item").forEach((itemNode) => itemNode.classList.remove("selected"));
      node.classList.add("selected");
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.style.top = `${e.clientY}px`;
      contextMenu.classList.remove("hidden");
    });
  });
}

function openItem(path, type) {
  if (type === "dir") {
    state.currentPath = norm(path);
    state.search = "";
    explorerSearch.value = "";
    renderExplorer();
    return;
  }
  terminalOutput.textContent += `\nOpened file: ${path.replace(/\//g, "\\")}`;
  openWin("terminal-window");
}

function deleteItem(path, type, name) {
  if (type === "dir") {
    const root = norm(path);
    Object.keys(fsMap).forEach((key) => {
      if (key.startsWith(root)) delete fsMap[key];
    });
    if (state.currentPath.startsWith(root)) state.currentPath = "C:/Users/Demo/";
  }
  fsMap[state.currentPath] = (fsMap[state.currentPath] || []).filter((i) => i.name !== name);
  persistState();
  selectedItem = null;
  renderExplorer();
}

function createNewFolder() {
  const base = "New Folder";
  const existing = new Set((fsMap[state.currentPath] || []).map((i) => i.name));
  let name = base;
  let n = 2;
  while (existing.has(name)) {
    name = `${base} (${n})`;
    n += 1;
  }
  ensureDir(`${state.currentPath}${name}/`);
  renderExplorer();
}

function renameSelectedItem() {
  if (!selectedItem) {
    alert("Select a file or folder first.");
    return;
  }
  const nextName = prompt("Rename item", selectedItem.name);
  if (!nextName || nextName === selectedItem.name) return;
  if (nextName.includes("/") || nextName.includes("\\")) {
    alert("Invalid name.");
    return;
  }

  const normalizedPath = selectedItem.type === "dir" ? norm(selectedItem.path) : selectedItem.path.replace(/\\/g, "/");
  const parts = normalizedPath.split("/").filter(Boolean);
  const parentPath = `${parts.slice(0, -1).join("/")}/`;
  if (!fsMap[parentPath]) return;
  if (fsMap[parentPath].some((i) => i.name === nextName)) {
    alert("An item with that name already exists.");
    return;
  }

  const entry = fsMap[parentPath].find((i) => i.name === selectedItem.name);
  if (!entry) return;
  entry.name = nextName;
  if (entry.type === "file") {
    entry.ext = nextName.includes(".") ? nextName.split(".").pop().toLowerCase() : "file";
  }

  if (selectedItem.type === "dir") {
    const oldRoot = norm(selectedItem.path);
    const newRoot = `${parentPath}${nextName}/`;
    const updates = Object.keys(fsMap)
      .filter((k) => k.startsWith(oldRoot))
      .map((k) => [k, k.replace(oldRoot, newRoot)]);
    updates.forEach(([oldKey, newKey]) => {
      fsMap[newKey] = fsMap[oldKey];
      if (newKey !== oldKey) delete fsMap[oldKey];
    });
  }

  selectedItem = null;
  persistState();
  renderExplorer();
}

function bringFront(el) {
  zTop += 1;
  el.style.zIndex = zTop;
}

function applyDesktopWindows() {
  Object.keys(state.windowState).forEach((id) => {
    const ws = state.windowState[id];
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("hidden", !(ws.visible && ws.desktop === state.activeDesktop));
  });
  renderTaskView();
}

function openWin(id) {
  if (!state.windowState[id]) state.windowState[id] = { desktop: state.activeDesktop, visible: true };
  state.windowState[id].desktop = state.activeDesktop;
  state.windowState[id].visible = true;
  applyDesktopWindows();
  bringFront(document.getElementById(id));
  persistState();
}

function closeWin(id) {
  if (!state.windowState[id]) state.windowState[id] = { desktop: state.activeDesktop, visible: false };
  state.windowState[id].visible = false;
  applyDesktopWindows();
  persistState();
}

function togglePanel(panel) {
  const isHidden = panel.classList.contains("hidden");
  [startMenu, widgetsPanel, notificationsPanel, quickSettings, taskViewPanel].forEach((p) => p.classList.add("hidden"));
  if (isHidden) panel.classList.remove("hidden");
  if (panel === quickSettings && isHidden) renderBluetoothPanel();
}

function renderTaskView() {
  const desktopList = document.getElementById("desktop-list");
  const thumbs = document.getElementById("window-thumbs");
  desktopList.innerHTML = state.desktops
    .map((d, i) => `<button class="desktop-chip ${i === state.activeDesktop ? "active" : ""}" data-desktop="${i}">${d}</button>`)
    .join("");

  thumbs.innerHTML = Object.keys(state.windowState)
    .map((id) => {
      const ws = state.windowState[id];
      const title = id.replace("-window", "");
      return `<div class="thumb">${title}<br><small>${state.desktops[ws.desktop]} | ${ws.visible ? "Open" : "Closed"}</small></div>`;
    })
    .join("");

  document.querySelectorAll(".desktop-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeDesktop = Number(btn.dataset.desktop);
      applyDesktopWindows();
    });
  });
}

function renderTiles() {
  document.querySelectorAll(".tile").forEach((tile) => {
    const on = Boolean(state.toggles[tile.dataset.toggle]);
    tile.classList.toggle("on", on);
    tile.classList.toggle("off", !on);
  });
}

function applyTheme() {
  document.body.style.filter = `brightness(${state.brightness}%)`;
}

function normalizeWebUrl(value) {
  const v = value.trim();
  if (!v) return "https://example.com";
  if (/^https?:\/\//i.test(v)) return v;
  if (v.includes(" ")) return `https://www.bing.com/search?q=${encodeURIComponent(v)}`;
  return `https://${v}`;
}

function updateNetworkStatus() {
  if (!networkStatus) return;
  networkStatus.textContent = navigator.onLine ? "Network: online" : "Network: offline";
}

function navigateBrowser(target, pushHistory = true) {
  const url = normalizeWebUrl(target);
  browserUrl.value = url;
  browserFrame.src = url;
  browserStatusText.textContent = `Loading ${url}`;
  if (pushHistory) {
    state.browserHistory = state.browserHistory.slice(0, state.browserIndex + 1);
    state.browserHistory.push(url);
    state.browserIndex = state.browserHistory.length - 1;
    persistState();
  }
}

function renderBluetoothPanel() {
  if (!bluetoothPanel) return;
  const supported = "bluetooth" in navigator;
  const entries = state.bluetoothDevices.length
    ? state.bluetoothDevices.map((d) => `<div class="device-row"><span>${d.name}</span><span>${d.connected ? "Connected" : "Saved"}</span></div>`).join("")
    : '<div class="small">No paired devices yet.</div>';
  bluetoothPanel.innerHTML = `
    <div class="settings-line">
      <span>${supported ? "Bluetooth available" : "Web Bluetooth not available in this browser"}</span>
      <button id="bluetooth-scan">${supported ? "Pair Device" : "Unavailable"}</button>
    </div>
    ${entries}
  `;
  const scanBtn = document.getElementById("bluetooth-scan");
  if (scanBtn && supported) {
    scanBtn.addEventListener("click", async () => {
      try {
        const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
        if (!state.bluetoothDevices.some((d) => d.id === device.id)) {
          state.bluetoothDevices.push({ id: device.id, name: device.name || "Bluetooth Device", connected: true });
        }
        state.toggles.bluetooth = true;
        renderTiles();
        renderBluetoothPanel();
        persistState();
      } catch (_) {
        bluetoothPanel.insertAdjacentHTML("beforeend", '<div class="small">Pairing was canceled.</div>');
      }
    });
  }
}

const settingsViews = {
  system: () => `
    <h3>System</h3>
    <div class="settings-line"><span>Dark mode</span><input id="set-dark" type="checkbox" ${state.toggles.darkmode ? "checked" : ""}></div>
    <div class="settings-line"><span>Night light</span><input id="set-night" type="checkbox" ${state.toggles.nightlight ? "checked" : ""}></div>
    <div class="settings-line"><span>Brightness</span><input id="set-bright" type="range" min="60" max="125" value="${state.brightness}"></div>
    <div class="settings-line"><span>Volume</span><input id="set-vol" type="range" min="0" max="100" value="${state.volume}"></div>
    <div class="settings-line"><span>Internet</span><span>${navigator.onLine ? "Connected" : "Offline"}</span></div>
    <div class="settings-line"><span>Bluetooth devices</span><span>${state.bluetoothDevices.length}</span></div>
  `,
  personalization: () => `
    <h3>Personalization</h3>
    <div class="settings-line"><span>Taskbar alignment</span><span>Center</span></div>
    <div class="settings-line"><span>Accent color</span><span>Neutral Slate</span></div>
    <div class="settings-line"><span>Transparency effects</span><span>On</span></div>
    <div class="settings-line"><span>Wallpaper</span><span>${state.wallpaper === "win11" ? "Windows 11 Bloom" : state.wallpaper}</span></div>
    <div class="wallpaper-row">
      <button class="wallpaper-btn" data-wallpaper="win11">Windows 11 Bloom</button>
      <button class="wallpaper-btn" data-wallpaper="slate">Slate</button>
      <button class="wallpaper-btn" data-wallpaper="night">Night</button>
      <label class="wallpaper-btn">Custom <input id="wallpaper-file" type="file" accept="image/*" hidden></label>
    </div>
  `,
  apps: () => `
    <h3>Apps</h3>
    <div class="settings-line"><span>Default archive app</span><span>ExtractX</span></div>
    <div class="settings-line"><span>Installed apps</span><span>46 (preview)</span></div>
  `,
  privacy: () => `
    <h3>Privacy</h3>
    <div class="settings-line"><span>Microphone</span><span>Ask every time</span></div>
    <div class="settings-line"><span>Camera</span><span>Ask every time</span></div>
    <div class="settings-line"><span>Telemetry</span><span>Minimal</span></div>
  `,
  update: () => `
    <h3>Windows Update</h3>
    <div class="settings-line"><span>Status</span><span>2 updates pending</span></div>
    <div class="settings-line"><button id="check-updates">Check for updates</button></div>
  `,
};

function renderSettings(section = "system") {
  settingsPanel.innerHTML = settingsViews[section]();
  document.querySelectorAll("[data-settings]").forEach((b) => b.classList.toggle("active", b.dataset.settings === section));

  const sd = document.getElementById("set-dark");
  if (sd) sd.addEventListener("change", (e) => { state.toggles.darkmode = e.target.checked; renderTiles(); persistState(); });
  const sn = document.getElementById("set-night");
  if (sn) sn.addEventListener("change", (e) => { state.toggles.nightlight = e.target.checked; renderTiles(); persistState(); });
  const sb = document.getElementById("set-bright");
  if (sb) sb.addEventListener("input", (e) => {
    state.brightness = Number(e.target.value);
    document.getElementById("brightness").value = String(state.brightness);
    applyTheme();
    persistState();
  });
  const sv = document.getElementById("set-vol");
  if (sv) sv.addEventListener("input", (e) => {
    state.volume = Number(e.target.value);
    document.getElementById("volume").value = String(state.volume);
    persistState();
  });

  const cu = document.getElementById("check-updates");
  if (cu) cu.addEventListener("click", () => { cu.textContent = "Up to date"; });

  document.querySelectorAll("[data-wallpaper]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.wallpaper = btn.dataset.wallpaper;
      if (state.wallpaper !== "custom") {
        state.wallpaperData = "";
        document.body.style.removeProperty("--wallpaper-image");
        document.body.style.removeProperty("--wallpaper-opacity");
      }
      applyWallpaper();
      persistState();
      renderSettings("personalization");
    });
  });

  const wf = document.getElementById("wallpaper-file");
  if (wf) {
    wf.addEventListener("change", async () => {
      const file = wf.files?.[0];
      if (!file) return;
      const dataUrl = await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(file);
      });
      setCustomWallpaper(dataUrl);
      renderSettings("personalization");
    });
  }
}

async function inflateRaw(data) {
  const ds = new DecompressionStream("deflate-raw");
  const stream = new Blob([data]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function extractZipEntries(file) {
  const buf = await file.arrayBuffer();
  const dv = new DataView(buf);
  const u8 = new Uint8Array(buf);

  let eocd = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 66000); i -= 1) {
    if (dv.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("ZIP end record not found");

  const total = dv.getUint16(eocd + 10, true);
  const cdOffset = dv.getUint32(eocd + 16, true);
  let ptr = cdOffset;
  const entries = [];

  for (let idx = 0; idx < total; idx += 1) {
    if (dv.getUint32(ptr, true) !== 0x02014b50) break;
    const method = dv.getUint16(ptr + 10, true);
    const compressedSize = dv.getUint32(ptr + 20, true);
    const nameLen = dv.getUint16(ptr + 28, true);
    const extraLen = dv.getUint16(ptr + 30, true);
    const commentLen = dv.getUint16(ptr + 32, true);
    const lho = dv.getUint32(ptr + 42, true);
    const nameBytes = u8.slice(ptr + 46, ptr + 46 + nameLen);
    const name = new TextDecoder().decode(nameBytes);

    if (dv.getUint32(lho, true) !== 0x04034b50) throw new Error("Invalid local file header");
    const lfNameLen = dv.getUint16(lho + 26, true);
    const lfExtraLen = dv.getUint16(lho + 28, true);
    const dataStart = lho + 30 + lfNameLen + lfExtraLen;
    const compData = u8.slice(dataStart, dataStart + compressedSize);

    let out;
    if (method === 0) out = compData;
    else if (method === 8) out = await inflateRaw(compData);
    else throw new Error(`Unsupported ZIP compression method ${method}`);

    entries.push({ name, bytes: out });
    ptr += 46 + nameLen + extraLen + commentLen;
  }

  return entries;
}

async function extractZipToDownloads(file) {
  try {
    const base = file.name.replace(/\.[^.]+$/, "");
    const outRoot = `C:/Users/Demo/Downloads/Extracted/${base}/`;
    ensureDir("C:/Users/Demo/Downloads/Extracted/");
    ensureDir(outRoot);

    const entries = await extractZipEntries(file);
    let added = 0;

    for (const entry of entries) {
      const clean = entry.name.replace(/^\/+/, "");
      if (!clean) continue;
      if (clean.endsWith("/")) {
        ensureDir(`${outRoot}${clean}`);
        continue;
      }
      const parts = clean.split("/");
      if (parts.length > 1) {
        ensureDir(`${outRoot}${parts.slice(0, -1).join("/")}/`);
      }
      addFile(`${outRoot}${clean}`, entry.bytes.length);
      added += 1;
    }

    extractStatus.textContent = `Extracted ${added} file(s) to ${outRoot.replace(/\//g, "\\")}`;
    state.currentPath = outRoot;
    persistState();
    renderExplorer();
  } catch (err) {
    extractStatus.textContent = `Extraction failed: ${err.message}`;
  }
}

async function handleExtract() {
  const file = archiveInput.files[0];
  if (!file) {
    extractStatus.textContent = "Select an archive first.";
    return;
  }
  const lower = file.name.toLowerCase();
  if (!lower.endsWith(".zip")) {
    extractStatus.textContent = "Only .zip has real extraction in browser preview. Other formats are runtime OS features.";
    return;
  }
  await extractZipToDownloads(file);
}

function wireEvents() {
  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openWin(btn.dataset.open);
      [startMenu, widgetsPanel, notificationsPanel, quickSettings, taskViewPanel].forEach((p) => p.classList.add("hidden"));
    });
  });

  document.querySelectorAll("[data-close]").forEach((btn) => btn.addEventListener("click", () => closeWin(btn.dataset.close)));

  document.querySelectorAll("[data-nav]").forEach((btn) => btn.addEventListener("click", () => {
    state.currentPath = norm(btn.dataset.nav);
    state.search = "";
    explorerSearch.value = "";
    persistState();
    renderExplorer();
  }));

  explorerSearch.addEventListener("input", (e) => {
    state.search = e.target.value;
    renderExplorer();
  });

  newFolderBtn.addEventListener("click", () => {
    createNewFolder();
    persistState();
  });

  renameItemBtn.addEventListener("click", () => {
    renameSelectedItem();
  });

  document.getElementById("start-btn").addEventListener("click", () => togglePanel(startMenu));
  document.getElementById("top-widgets-btn").addEventListener("click", () => togglePanel(widgetsPanel));
  document.getElementById("top-notif-btn").addEventListener("click", () => togglePanel(notificationsPanel));
  document.getElementById("quick-btn").addEventListener("click", () => togglePanel(quickSettings));
  document.getElementById("task-view-btn").addEventListener("click", () => togglePanel(taskViewPanel));

  if (globalSearch) {
    globalSearch.addEventListener("focus", () => {
      startSearch.value = globalSearch.value;
      togglePanel(startMenu);
      startSearch.focus();
    });
    globalSearch.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const q = globalSearch.value.trim().toLowerCase();
      startSearch.value = globalSearch.value;
      togglePanel(startMenu);
      if (q.includes("settings")) openWin("settings-window");
      else if (q.includes("browser") || q.includes("chrome") || q.includes("internet")) openWin("browser-window");
      else if (q.includes("terminal") || q.includes("powershell")) openWin("terminal-window");
      else if (q.includes("explorer") || q.includes("files")) openWin("explorer-window");
      else if (q.includes("extract")) openWin("extract-window");
    });
  }

  if (startSearch) {
    startSearch.addEventListener("input", () => {
      if (globalSearch) globalSearch.value = startSearch.value;
    });
  }

  document.querySelectorAll(".tile").forEach((tile) => tile.addEventListener("click", () => {
    const key = tile.dataset.toggle;
    state.toggles[key] = !state.toggles[key];
    renderTiles();
    renderSettings("system");
    if (key === "bluetooth") renderBluetoothPanel();
    persistState();
  }));

  document.getElementById("brightness").addEventListener("input", (e) => {
    state.brightness = Number(e.target.value);
    applyTheme();
    renderSettings("system");
    persistState();
  });

  document.getElementById("volume").addEventListener("input", (e) => {
    state.volume = Number(e.target.value);
    renderSettings("system");
    persistState();
  });

  document.querySelectorAll("[data-settings]").forEach((btn) => btn.addEventListener("click", () => renderSettings(btn.dataset.settings)));

  document.getElementById("browser-go").addEventListener("click", () => navigateBrowser(browserUrl.value));
  browserUrl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") navigateBrowser(browserUrl.value);
  });
  document.getElementById("browser-back").addEventListener("click", () => {
    if (state.browserIndex <= 0) return;
    state.browserIndex -= 1;
    navigateBrowser(state.browserHistory[state.browserIndex], false);
  });
  document.getElementById("browser-forward").addEventListener("click", () => {
    if (state.browserIndex >= state.browserHistory.length - 1) return;
    state.browserIndex += 1;
    navigateBrowser(state.browserHistory[state.browserIndex], false);
  });
  document.getElementById("browser-refresh").addEventListener("click", () => {
    navigateBrowser(browserUrl.value, false);
  });
  document.getElementById("browser-newtab").addEventListener("click", () => {
    window.open(normalizeWebUrl(browserUrl.value), "_blank", "noopener");
  });
  document.getElementById("browser-download").addEventListener("click", () => {
    const target = normalizeWebUrl(browserUrl.value);
    const a = document.createElement("a");
    a.href = target;
    a.download = "";
    a.rel = "noopener";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
  browserFrame.addEventListener("load", () => {
    browserStatusText.textContent = `Connected: ${browserUrl.value}`;
  });

  window.addEventListener("online", updateNetworkStatus);
  window.addEventListener("offline", updateNetworkStatus);

  document.getElementById("add-desktop").addEventListener("click", () => {
    state.desktops.push(`Desktop ${state.desktops.length + 1}`);
    renderTaskView();
    persistState();
  });

  document.querySelectorAll("[data-snap]").forEach((btn) => btn.addEventListener("click", () => {
    const win = document.getElementById(btn.dataset.target);
    const mode = btn.dataset.snap;
    if (mode === "left") {
      win.style.left = "8px";
      win.style.top = "8px";
      win.style.width = "calc(50vw - 14px)";
      win.style.height = "calc(100vh - 74px)";
    }
    if (mode === "right") {
      win.style.left = "calc(50vw + 6px)";
      win.style.top = "8px";
      win.style.width = "calc(50vw - 14px)";
      win.style.height = "calc(100vh - 74px)";
    }
    if (mode === "max") {
      win.style.left = "8px";
      win.style.top = "8px";
      win.style.width = "calc(100vw - 16px)";
      win.style.height = "calc(100vh - 74px)";
    }
    bringFront(win);
    persistState();
  }));

  document.querySelectorAll(".window").forEach((win) => {
    const bar = win.querySelector(".titlebar");
    let dragging = false;
    let ox = 0;
    let oy = 0;

    bar.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "BUTTON") return;
      dragging = true;
      bringFront(win);
      ox = e.clientX - win.offsetLeft;
      oy = e.clientY - win.offsetTop;
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      win.style.left = `${Math.max(0, e.clientX - ox)}px`;
      win.style.top = `${Math.max(0, e.clientY - oy)}px`;
    });

    window.addEventListener("mouseup", () => { dragging = false; });
    win.addEventListener("mousedown", () => bringFront(win));
  });

  terminalInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const cmd = terminalInput.value.trim();
    terminalInput.value = "";
    let out = "";

    if (cmd === "help") out = "help, dir, cd <path>, start ms-settings, start explorer, start chrome, systeminfo";
    else if (cmd === "dir") out = (fsMap[state.currentPath] || []).map((i) => i.name).join("\n");
    else if (cmd.startsWith("cd ")) {
      const path = norm(cmd.slice(3));
      if (fsMap[path]) {
        state.currentPath = path;
        renderExplorer();
        persistState();
        out = `Current directory: ${path}`;
      } else out = "Path not found.";
    } else if (cmd === "start ms-settings") {
      openWin("settings-window");
      out = "Settings opened.";
    } else if (cmd === "start explorer") {
      openWin("explorer-window");
      out = "Explorer opened.";
    } else if (cmd === "start chrome") {
      openWin("browser-window");
      out = "Aster Chrome opened.";
    } else if (cmd === "systeminfo") out = "Windows 11-style Web Preview Build 0.3";
    else out = `'${cmd}' is not recognized in preview shell.`;

    terminalOutput.textContent += `\nPS C:\\> ${cmd}\n${out}`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  });

  document.getElementById("ai-run").addEventListener("click", () => {
    const q = aiInput.value.toLowerCase();
    if (q.includes("open") && q.includes("settings")) {
      openWin("settings-window");
      aiOutput.textContent = "Opened Settings.";
    } else if (q.includes("find") || q.includes("files")) {
      aiOutput.textContent = `Current folder contains ${(fsMap[state.currentPath] || []).length} items.`;
    } else if (q.includes("optimize")) {
      aiOutput.textContent = "Suggestion: disable two startup apps and run Defender quick scan.";
    } else {
      aiOutput.textContent = "Command understood in preview mode.";
    }
  });

  document.getElementById("extract-btn").addEventListener("click", handleExtract);

  explorerMain.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropHint.classList.remove("hidden");
  });

  explorerMain.addEventListener("dragleave", (e) => {
    if (!explorerMain.contains(e.relatedTarget)) dropHint.classList.add("hidden");
  });

  explorerMain.addEventListener("drop", async (e) => {
    e.preventDefault();
    dropHint.classList.add("hidden");
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".zip")) {
      extractStatus.textContent = "Drop a .zip file for real extraction.";
      return;
    }
    await extractZipToDownloads(file);
  });

  contextMenu.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!selectedItem) return;
      const action = btn.dataset.action;
      if (action === "open") openItem(selectedItem.path, selectedItem.type);
      if (action === "rename") renameSelectedItem();
      if (action === "copy-path") {
        try {
          await navigator.clipboard.writeText(selectedItem.path.replace(/\//g, "\\"));
        } catch (_) {}
      }
      if (action === "delete") deleteItem(selectedItem.path, selectedItem.type, selectedItem.name);
      if (action === "properties") alert(`Name: ${selectedItem.name}\nPath: ${selectedItem.path.replace(/\//g, "\\")}`);
      contextMenu.classList.add("hidden");
      persistState();
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".context-menu")) contextMenu.classList.add("hidden");
    if (e.target.closest(".taskbar") || e.target.closest(".panel")) return;
    [startMenu, widgetsPanel, notificationsPanel, quickSettings, taskViewPanel].forEach((p) => p.classList.add("hidden"));
  });
}

function initWindows() {
  ["explorer-window", "browser-window", "terminal-window", "settings-window", "extract-window", "ai-window"].forEach((id) => {
    if (!state.windowState[id]) {
      const visible = id === "explorer-window";
      state.windowState[id] = { desktop: 0, visible };
    }
  });
  applyDesktopWindows();
}

setInterval(() => {
  const now = new Date();
  document.getElementById("clock").textContent = `${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${now.toLocaleDateString([], { month: "short", day: "numeric" })}`;
}, 1000);

loadState();
wireEvents();
initWindows();
document.getElementById("brightness").value = String(state.brightness);
document.getElementById("volume").value = String(state.volume);
renderTiles();
renderSettings("system");
renderExplorer();
applyTheme();
applyWallpaper();
updateNetworkStatus();
renderBluetoothPanel();
navigateBrowser(state.browserHistory[state.browserIndex] || "https://example.com", false);
