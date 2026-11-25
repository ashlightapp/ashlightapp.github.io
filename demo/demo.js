// src/demo/mock.ts
var handlers = [];
var deliver = (data) => setTimeout(() => handlers.forEach((fn) => fn({ data })), 0);
var event = (name, ...args) => deliver({ e: name, p: args });
var toParent = (message) => parent.postMessage({ ttool: true, ...message }, location.origin);
window.ttoolDemo = true;
var query = new URLSearchParams(location.search);
if (query.has("livechat"))
  window.ttoolLiveChat = true;
var SONGS = [
  { title: "Example Song", artist: "Example Artist", album: "Demo", duration: 214000 },
  { title: "Second Track", artist: "Another Artist", album: "Demo", duration: 187000 },
  { title: "Third Track", artist: "Example Artist", album: "Demo", duration: 241000 }
];
var song = 0;
var playing = true;
var position = 42000;
var positionAt = Date.now();
var art = new URL("../assets/logo.png", location.href).href;
var sendMedia = () => {
  const s = SONGS[song];
  event("media", { ...s, playing, position, updated: positionAt, art, source: "Spotify" });
};
var monitorTimer = null;
var monitor = () => event("monitor", {
  cpu: 14 + Math.random() * 18,
  ramUsed: 11.2 * 1024 ** 3 + Math.random() * 200000000,
  ramTotal: 32 * 1024 ** 3,
  ping: Math.round(14 + Math.random() * 8),
  gpu: { load: 62 + Math.random() * 30, temp: 58 + Math.random() * 6, vramUsed: 5400 + Math.random() * 300, vramTotal: 12288, power: 180 + Math.random() * 60, name: "Example GPU" }
});
function colourFilter(settingsJson) {
  try {
    const c = JSON.parse(settingsJson).color;
    const sat = c.saturation / 100 * (1 + c.vibrance / 200);
    const parts = [`saturate(${sat})`, `contrast(${c.contrast / 100})`, `brightness(${1 + c.brightness / 100 + (c.gamma - 1) * 0.25 + c.shadows / 400})`];
    if (c.hue)
      parts.push(`hue-rotate(${c.hue}deg)`);
    if (c.filter === "gray")
      parts.push("grayscale(1)");
    if (c.filter === "sepia")
      parts.push("sepia(0.8)");
    if (c.filter === "invert")
      parts.push("invert(1)");
    if (c.temperature > 0)
      parts.push(`sepia(${c.temperature / 250})`);
    return parts.join(" ");
  } catch {
    return "none";
  }
}
var DEMO_GAMES = [
  ["252490", "Rust", Math.floor(Date.now() / 1000) - 3600],
  ["730", "Counter-Strike 2", Math.floor(Date.now() / 1000) - 86400],
  ["1172470", "Apex Legends", Math.floor(Date.now() / 1000) - 3 * 86400],
  ["578080", "PUBG: BATTLEGROUNDS", 0],
  ["1085660", "Destiny 2", 0],
  ["322170", "Geometry Dash", 0]
];
var MODES = [[3840, 2160], [2560, 1440], [1920, 1080], [1680, 1050], [1600, 900], [1440, 1080], [1280, 1024], [1280, 960], [1280, 720], [1024, 768]].flatMap(([width, height]) => [240, 144, 60].map((hz) => ({ width, height, hz })));
var demoBackups = new Map;
function liveLogin() {
  try {
    return JSON.parse(sessionStorage.getItem("livechat:" + query.get("name")) ?? "{}");
  } catch {
    return {};
  }
}
async function answer(m) {
  const p = m.p;
  switch (m.a) {
    case "boot":
      setTimeout(() => event("engineReady", { recovered: false, mouseSpeed: 10, vibrancePercent: 0 }), 30);
      return { settings: JSON.stringify({ app: { welcomed: true, lastVersion: "demo" }, hud: { lyricsOnline: false }, ...query.has("livechat") ? { share: { server: query.get("server") ?? "" }, profile: { name: query.get("name") ?? "Tester", avatar: "", source: "local" }, social: liveLogin() } : {} }), version: "demo", primary: { width: 1920, height: 1080, scale: 1 }, hidden: false };
    case "engine": {
      const text = String(p[0]);
      if (text.startsWith("settings:"))
        toParent({ filter: colourFilter(text.slice(9)) });
      if (text === "compare:1")
        toParent({ filter: "none", compare: true });
      if (text === "compare:0")
        toParent({ compare: false });
      return null;
    }
    case "media":
      if (p[0])
        sendMedia();
      return null;
    case "mediaCommand":
      if (p[0] === "play") {
        position += playing ? Date.now() - positionAt : 0;
        positionAt = Date.now();
        playing = !playing;
      } else {
        song = (song + (p[0] === "next" ? 1 : SONGS.length - 1)) % SONGS.length;
        position = 0;
        positionAt = Date.now();
        playing = true;
      }
      sendMedia();
      return null;
    case "monitor":
      if (p[0] && !monitorTimer) {
        monitor();
        monitorTimer = setInterval(monitor, 1200);
      } else if (!p[0] && monitorTimer) {
        clearInterval(monitorTimer);
        monitorTimer = null;
      }
      return null;
    case "discord":
      setTimeout(() => event("discord", p[0] ? "connected" : "off"), 300);
      if (p[0])
        setTimeout(() => event("discordReady", { evt: "READY", data: { user: { id: "100000000000000000", username: "gamer", global_name: "Gamer", avatar: null } } }), 350);
      return null;
    case "devices":
      return ["\\\\.\\DISPLAY1"];
    case "modes":
      return { modes: MODES, current: { width: 2560, height: 1440, hz: 144 } };
    case "applyMode":
      return true;
    case "fetchText": {
      const url = String(p[0]);
      const local = url.endsWith("/announce.json") ? "../announce.json" : url.endsWith("/latest.json") ? "../updates/latest.json" : "";
      if (!local)
        return null;
      try {
        const r = await fetch(local, { cache: "no-store" });
        return r.ok ? await r.text() : null;
      } catch {
        return null;
      }
    }
    case "pickBackground":
      return p[0] === "video" ? null : "clouds.jpg";
    case "windowGlass":
      toParent({ glass: !!p[0] });
      return null;
    case "selfHash":
      return null;
    case "scanTemp":
    case "cleanTemp":
      return { bytes: 734 * 1024 * 1024, files: 1203 };
    case "flushDns":
      return true;
    case "pingNow":
      return Math.round(12 + Math.random() * 14);
    case "openUrl":
      if (/^https:\/\//.test(String(p[0])))
        window.open(String(p[0]), "_blank", "noopener");
      return null;
    case "hide":
    case "quit":
      toParent({ window: "closed" });
      return null;
    case "minimize":
      toParent({ window: "minimized" });
      return null;
    case "maximize":
      toParent({ window: "maximize" });
      return null;
    case "steamPath":
      return "C:\\Steam";
    case "listDir":
      return String(p[0]).endsWith("steamapps") ? DEMO_GAMES.map(([id]) => `appmanifest_${id}.acf`) : [];
    case "readFile": {
      const id = String(p[0]).match(/appmanifest_(\d+)\.acf$/)?.[1];
      const game = DEMO_GAMES.find(([g]) => g === id);
      return game ? `"AppState" { "appid" "${game[0]}" "name" "${game[1]}" "LastPlayed" "${game[2]}" }` : "";
    }
    case "launch":
      return true;
    case "pickExe":
      return null;
    case "backups":
      return [...demoBackups.keys()];
    case "backupRead":
      return demoBackups.get(String(p[0])) ?? null;
    case "backupWrite":
      demoBackups.set(String(p[0]), String(p[1]));
      return true;
    case "backupDelete":
      return demoBackups.delete(String(p[0]));
    case "exportFile": {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([String(p[0])], { type: "application/json" }));
      link.download = String(p[1]);
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      return true;
    }
    case "importFile":
      return new Promise((done) => {
        const input = Object.assign(document.createElement("input"), { type: "file", accept: ".json,.txt" });
        input.addEventListener("change", async () => done(input.files?.[0] ? await input.files[0].text() : null));
        input.addEventListener("cancel", () => done(null));
        input.click();
      });
    case "save":
      if (query.has("livechat"))
        try {
          const social = JSON.parse(String(p[0])).social;
          if (social?.secret)
            sessionStorage.setItem("livechat:" + query.get("name"), JSON.stringify(social));
        } catch {}
      return null;
    case "pickPluginManifest":
      return null;
    case "pluginsDir":
      return "C:\\Plugins";
    case "pluginInstall":
    case "pluginInstallLocal":
    case "pluginUninstall":
      return { ok: false, error: "Plugins work in the installed app, right on your PC." };
    case "pluginOpenFolder":
      return null;
    default:
      return null;
  }
}
window.chrome = {
  webview: {
    addEventListener: (_, fn) => handlers.push(fn),
    postMessage: (text) => {
      const m = JSON.parse(text);
      answer(m).then((r) => deliver({ id: m.id, r }));
    }
  }
};
addEventListener("message", (e) => {
  if (e.origin === location.origin && e.data?.ttool && e.data.show)
    event("windowShown", true);
});

// node_modules/lucide/dist/esm/defaultAttributes.mjs
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};

// node_modules/lucide/dist/esm/createElement.mjs
var createSVGElement = ([tag, attrs, children]) => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.keys(attrs).forEach((name) => {
    element.setAttribute(name, String(attrs[name]));
  });
  if (children?.length) {
    children.forEach((child) => {
      const childElement = createSVGElement(child);
      element.appendChild(childElement);
    });
  }
  return element;
};
var createElement = (iconNode, customAttrs = {}) => {
  const tag = "svg";
  const attrs = {
    ...defaultAttributes,
    ...customAttrs
  };
  return createSVGElement([tag, attrs, iconNode]);
};

// node_modules/lucide/dist/esm/icons/archive-arrow-up.mjs
var ArchiveArrowUp = [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h2" }],
  ["path", { d: "M20 8v11a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "m9 15 3-3 3 3" }],
  ["path", { d: "M12 12v9" }]
];

// node_modules/lucide/dist/esm/icons/arrow-right.mjs
var ArrowRight = [
  ["path", { d: "M5 12h14" }],
  ["path", { d: "m12 5 7 7-7 7" }]
];

// node_modules/lucide/dist/esm/icons/bell.mjs
var Bell = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
    }
  ]
];

// node_modules/lucide/dist/esm/icons/brush.mjs
var Brush = [
  ["path", { d: "m11 10 3 3" }],
  ["path", { d: "M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z" }],
  ["path", { d: "M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031" }]
];

// node_modules/lucide/dist/esm/icons/camera.mjs
var Camera = [
  [
    "path",
    {
      d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3" }]
];

// node_modules/lucide/dist/esm/icons/check.mjs
var Check = [["path", { d: "M20 6 9 17l-5-5" }]];

// node_modules/lucide/dist/esm/icons/copy.mjs
var Copy = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]
];

// node_modules/lucide/dist/esm/icons/crosshair.mjs
var Crosshair = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["line", { x1: "22", x2: "18", y1: "12", y2: "12" }],
  ["line", { x1: "6", x2: "2", y1: "12", y2: "12" }],
  ["line", { x1: "12", x2: "12", y1: "6", y2: "2" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "18" }]
];

// node_modules/lucide/dist/esm/icons/download.mjs
var Download = [
  ["path", { d: "M12 15V3" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
  ["path", { d: "m7 10 5 5 5-5" }]
];

// node_modules/lucide/dist/esm/icons/file-down.mjs
var FileDown = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5" }],
  ["path", { d: "M12 18v-6" }],
  ["path", { d: "m9 15 3 3 3-3" }]
];

// node_modules/lucide/dist/esm/icons/file-up.mjs
var FileUp = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5" }],
  ["path", { d: "M12 12v6" }],
  ["path", { d: "m15 15-3-3-3 3" }]
];

// node_modules/lucide/dist/esm/icons/folder-open.mjs
var FolderOpen = [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"
    }
  ]
];

// node_modules/lucide/dist/esm/icons/gamepad-2.mjs
var Gamepad2 = [
  ["line", { x1: "6", x2: "10", y1: "11", y2: "11" }],
  ["line", { x1: "8", x2: "8", y1: "9", y2: "13" }],
  ["line", { x1: "15", x2: "15.01", y1: "12", y2: "12" }],
  ["line", { x1: "18", x2: "18.01", y1: "10", y2: "10" }],
  [
    "path",
    {
      d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"
    }
  ]
];

// node_modules/lucide/dist/esm/icons/gauge.mjs
var Gauge = [
  ["path", { d: "m12 14 4-4" }],
  ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0" }]
];

// node_modules/lucide/dist/esm/icons/globe.mjs
var Globe = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }],
  ["path", { d: "M2 12h20" }]
];

// node_modules/lucide/dist/esm/icons/house.mjs
var House = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
    }
  ]
];

// node_modules/lucide/dist/esm/icons/image-up.mjs
var ImageUp = [
  [
    "path",
    {
      d: "M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21"
    }
  ],
  ["path", { d: "m14 19.5 3-3 3 3" }],
  ["path", { d: "M17 22v-5.5" }],
  ["circle", { cx: "9", cy: "9", r: "2" }]
];

// node_modules/lucide/dist/esm/icons/image.mjs
var Image2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["circle", { cx: "9", cy: "9", r: "2" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]
];

// node_modules/lucide/dist/esm/icons/info.mjs
var Info = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M12 16v-4" }],
  ["path", { d: "M12 8h.01" }]
];

// node_modules/lucide/dist/esm/icons/keyboard.mjs
var Keyboard = [
  ["path", { d: "M10 8h.01" }],
  ["path", { d: "M12 12h.01" }],
  ["path", { d: "M14 8h.01" }],
  ["path", { d: "M16 12h.01" }],
  ["path", { d: "M18 8h.01" }],
  ["path", { d: "M6 8h.01" }],
  ["path", { d: "M7 16h10" }],
  ["path", { d: "M8 12h.01" }],
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }]
];

// node_modules/lucide/dist/esm/icons/layers.mjs
var Layers = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
    }
  ],
  ["path", { d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" }],
  ["path", { d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" }]
];

// node_modules/lucide/dist/esm/icons/lightbulb.mjs
var Lightbulb = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
    }
  ],
  ["path", { d: "M9 18h6" }],
  ["path", { d: "M10 22h4" }]
];

// node_modules/lucide/dist/esm/icons/log-out.mjs
var LogOut = [
  ["path", { d: "m16 17 5-5-5-5" }],
  ["path", { d: "M21 12H9" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
];

// node_modules/lucide/dist/esm/icons/maximize-2.mjs
var Maximize2 = [
  ["path", { d: "M15 3h6v6" }],
  ["path", { d: "m21 3-7 7" }],
  ["path", { d: "m3 21 7-7" }],
  ["path", { d: "M9 21H3v-6" }]
];

// node_modules/lucide/dist/esm/icons/megaphone.mjs
var Megaphone = [
  [
    "path",
    {
      d: "M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
    }
  ],
  ["path", { d: "M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" }],
  ["path", { d: "M8 6v8" }]
];

// node_modules/lucide/dist/esm/icons/minus.mjs
var Minus = [["path", { d: "M5 12h14" }]];

// node_modules/lucide/dist/esm/icons/monitor.mjs
var Monitor = [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21" }]
];

// node_modules/lucide/dist/esm/icons/moon.mjs
var Moon = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
    }
  ]
];

// node_modules/lucide/dist/esm/icons/mouse-pointer-2.mjs
var MousePointer2 = [
  [
    "path",
    {
      d: "M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
    }
  ]
];

// node_modules/lucide/dist/esm/icons/move.mjs
var Move = [
  ["path", { d: "M12 2v20" }],
  ["path", { d: "m15 19-3 3-3-3" }],
  ["path", { d: "m19 9 3 3-3 3" }],
  ["path", { d: "M2 12h20" }],
  ["path", { d: "m5 9-3 3 3 3" }],
  ["path", { d: "m9 5 3-3 3 3" }]
];

// node_modules/lucide/dist/esm/icons/palette.mjs
var Palette = [
  [
    "path",
    {
      d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"
    }
  ],
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor" }]
];

// node_modules/lucide/dist/esm/icons/pause.mjs
var Pause = [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1" }]
];

// node_modules/lucide/dist/esm/icons/pipette.mjs
var Pipette = [
  [
    "path",
    {
      d: "m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"
    }
  ],
  ["path", { d: "m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z" }],
  ["path", { d: "m2 22 .414-.414" }]
];

// node_modules/lucide/dist/esm/icons/play.mjs
var Play = [
  [
    "path",
    { d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" }
  ]
];

// node_modules/lucide/dist/esm/icons/plus.mjs
var Plus = [
  ["path", { d: "M5 12h14" }],
  ["path", { d: "M12 5v14" }]
];

// node_modules/lucide/dist/esm/icons/puzzle.mjs
var Puzzle = [
  [
    "path",
    {
      d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"
    }
  ]
];

// node_modules/lucide/dist/esm/icons/refresh-cw.mjs
var RefreshCw = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }],
  ["path", { d: "M21 3v5h-5" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }],
  ["path", { d: "M8 16H3v5" }]
];

// node_modules/lucide/dist/esm/icons/rocket.mjs
var Rocket = [
  ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" }],
  [
    "path",
    {
      d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"
    }
  ],
  [
    "path",
    {
      d: "M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"
    }
  ],
  ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" }]
];

// node_modules/lucide/dist/esm/icons/rotate-ccw-clock.mjs
var RotateCcwClock = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
  ["path", { d: "M3 3v5h5" }],
  ["path", { d: "M12 7v5l4 2" }]
];

// node_modules/lucide/dist/esm/icons/rotate-ccw.mjs
var RotateCcw = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
  ["path", { d: "M3 3v5h5" }]
];

// node_modules/lucide/dist/esm/icons/send.mjs
var Send = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939" }]
];

// node_modules/lucide/dist/esm/icons/settings.mjs
var Settings = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3" }]
];

// node_modules/lucide/dist/esm/icons/shield-check.mjs
var ShieldCheck = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4" }]
];

// node_modules/lucide/dist/esm/icons/skip-back.mjs
var SkipBack = [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"
    }
  ],
  ["path", { d: "M3 20V4" }]
];

// node_modules/lucide/dist/esm/icons/skip-forward.mjs
var SkipForward = [
  ["path", { d: "M21 4v16" }],
  [
    "path",
    { d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z" }
  ]
];

// node_modules/lucide/dist/esm/icons/sliders-vertical.mjs
var SlidersVertical = [
  ["path", { d: "M10 8h4" }],
  ["path", { d: "M12 21v-9" }],
  ["path", { d: "M12 8V3" }],
  ["path", { d: "M17 16h4" }],
  ["path", { d: "M19 12V3" }],
  ["path", { d: "M19 21v-5" }],
  ["path", { d: "M3 14h4" }],
  ["path", { d: "M5 10V3" }],
  ["path", { d: "M5 21v-7" }]
];

// node_modules/lucide/dist/esm/icons/sparkles.mjs
var Sparkles = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
    }
  ],
  ["path", { d: "M20 2v4" }],
  ["path", { d: "M22 4h-4" }],
  ["circle", { cx: "4", cy: "20", r: "2" }]
];

// node_modules/lucide/dist/esm/icons/square.mjs
var Square = [["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }]];

// node_modules/lucide/dist/esm/icons/store.mjs
var Store = [
  ["path", { d: "M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" }],
  [
    "path",
    {
      d: "M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244"
    }
  ],
  ["path", { d: "M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" }]
];

// node_modules/lucide/dist/esm/icons/sun-medium.mjs
var SunMedium = [
  ["circle", { cx: "12", cy: "12", r: "4" }],
  ["path", { d: "M12 3v1" }],
  ["path", { d: "M12 20v1" }],
  ["path", { d: "M3 12h1" }],
  ["path", { d: "M20 12h1" }],
  ["path", { d: "m18.364 5.636-.707.707" }],
  ["path", { d: "m6.343 17.657-.707.707" }],
  ["path", { d: "m5.636 5.636.707.707" }],
  ["path", { d: "m17.657 17.657.707.707" }]
];

// node_modules/lucide/dist/esm/icons/trash.mjs
var Trash = [
  ["path", { d: "M10 11v6" }],
  ["path", { d: "M14 11v6" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
  ["path", { d: "M3 6h18" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
];

// node_modules/lucide/dist/esm/icons/user-round.mjs
var UserRound = [
  ["circle", { cx: "12", cy: "8", r: "5" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0" }]
];

// node_modules/lucide/dist/esm/icons/wifi.mjs
var Wifi = [
  ["path", { d: "M12 20h.01" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }]
];

// node_modules/lucide/dist/esm/icons/wrench.mjs
var Wrench = [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"
    }
  ]
];

// node_modules/lucide/dist/esm/icons/x.mjs
var X = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }]
];
// src/shared/controls.ts
var DROPPER = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/></svg>`;
var el = (tag, className = "") => {
  const node = document.createElement(tag);
  if (className)
    node.className = className;
  return node;
};
function watchValue(input, proto, changed) {
  const native = Object.getOwnPropertyDescriptor(proto, "value");
  Object.defineProperty(input, "value", {
    configurable: true,
    get: () => native.get.call(input),
    set: (v) => {
      native.set.call(input, v);
      changed();
    }
  });
}
function placeNear(pop, anchor, matchWidth) {
  const a = anchor.getBoundingClientRect();
  if (matchWidth)
    pop.style.minWidth = `${a.width}px`;
  const b = pop.getBoundingClientRect();
  const below = a.bottom + 6 + b.height <= innerHeight - 8;
  pop.style.left = `${Math.max(8, Math.min(innerWidth - b.width - 8, a.left))}px`;
  pop.style.top = `${below ? a.bottom + 6 : Math.max(8, a.top - b.height - 6)}px`;
  pop.style.transformOrigin = below ? "top left" : "bottom left";
}
var closeOpen = null;
function openPopup(pop, anchor, matchWidth, onClose) {
  closeOpen?.();
  document.body.append(pop);
  placeNear(pop, anchor, matchWidth);
  requestAnimationFrame(() => pop.classList.add("show"));
  const outside = (e) => {
    if (!pop.contains(e.target) && !anchor.contains(e.target))
      close();
  };
  const scrolled = (e) => {
    if (!pop.contains(e.target))
      close();
  };
  const keys = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      anchor.focus();
    }
  };
  function close() {
    closeOpen = null;
    removeEventListener("pointerdown", outside, true);
    removeEventListener("scroll", scrolled, true);
    removeEventListener("resize", close);
    removeEventListener("keydown", keys, true);
    pop.remove();
    pop.classList.remove("show");
    onClose?.();
  }
  addEventListener("pointerdown", outside, true);
  addEventListener("scroll", scrolled, true);
  addEventListener("resize", close);
  addEventListener("keydown", keys, true);
  closeOpen = close;
  return close;
}
var clamp01 = (v) => Math.min(1, Math.max(0, v));
var toHex = ([r, g, b]) => `#${[r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("")}`;
var fromHex = (hex) => {
  let t = hex.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(t))
    t = t.replace(/./g, "$&$&");
  if (!/^[0-9a-f]{6}$/i.test(t))
    return null;
  const n = parseInt(t, 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255];
};
function hsvToRgb(h, s, v) {
  const f = (n) => {
    const k = (n + h / 60) % 6;
    return 255 * v * (1 - s * Math.max(0, Math.min(k, 4 - k, 1)));
  };
  return [f(5), f(3), f(1)];
}
function rgbToHsv([r, g, b]) {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), d = max - Math.min(R, G, B);
  let h = 0;
  if (d)
    h = max === R ? ((G - B) / d + 6) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
  return [h * 60, max ? d / max : 0, max];
}
var PRESETS = ["#ffffff", "#c9cdd4", "#ff3b3b", "#ff8a3b", "#ffe23b", "#3bff6f", "#3be8ff", "#3b7bff", "#a56bff", "#ff4fd8", "#1a1c1f", "#000000"];
var RECENT_KEY = "ttool.recentColours";
var readRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
};
function remember(color) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify([color, ...readRecent().filter((c) => c !== color)].slice(0, 12)));
  } catch {}
}
function dragArea(area, moved, done) {
  let pending = null;
  const flush = () => {
    if (!pending)
      return;
    const r = area.getBoundingClientRect();
    moved(clamp01((pending.clientX - r.left) / r.width), clamp01((pending.clientY - r.top) / r.height));
    pending = null;
  };
  area.addEventListener("pointerdown", (e) => {
    area.setPointerCapture(e.pointerId);
    area.classList.add("dragging");
    pending = e;
    flush();
  });
  area.addEventListener("pointermove", (e) => {
    if (!area.hasPointerCapture(e.pointerId))
      return;
    const first = !pending;
    pending = e;
    if (first)
      requestAnimationFrame(flush);
  });
  const end = (e) => {
    if (!area.classList.contains("dragging"))
      return;
    area.classList.remove("dragging");
    pending = e;
    flush();
    done();
  };
  area.addEventListener("pointerup", end);
  area.addEventListener("pointercancel", end);
}
function colorPicker(input) {
  const root = el("span", "cp-wrap");
  const button = el("button", "cp-btn");
  button.type = "button";
  button.setAttribute("aria-label", input.getAttribute("aria-label") ?? "Pick a colour");
  if (input.dataset.tip) {
    button.dataset.tip = input.dataset.tip;
    delete input.dataset.tip;
  }
  const dot = el("i");
  button.append(dot);
  input.style.display = "none";
  root.append(input, button);
  const paintButton = () => button.style.setProperty("--c", input.value);
  watchValue(input, HTMLInputElement.prototype, paintButton);
  paintButton();
  button.addEventListener("click", () => {
    if (button.classList.contains("open"))
      return closeOpen?.();
    let [hue, sat, val] = rgbToHsv(fromHex(input.value) ?? [255, 255, 255]);
    const pop = el("div", "cp-pop");
    const sv = el("div", "cp-sv");
    const svThumb = el("i", "cp-thumb");
    sv.append(svThumb);
    const hueBar = el("div", "cp-hue");
    const hueThumb = el("i", "cp-thumb");
    hueBar.append(hueThumb);
    const preview = el("i", "cp-preview");
    const hexField = el("input", "cp-field cp-hex");
    hexField.spellcheck = false;
    hexField.maxLength = 7;
    hexField.setAttribute("aria-label", "Hex colour");
    const rgbFields = ["R", "G", "B"].map((name) => {
      const field = el("input", "cp-field");
      field.inputMode = "numeric";
      field.maxLength = 3;
      field.setAttribute("aria-label", name);
      const box = el("label", "cp-rgb");
      const caption = el("span");
      caption.textContent = name;
      box.append(field, caption);
      return { field, box };
    });
    const top = el("div", "cp-row");
    top.append(preview, hexField);
    if ("EyeDropper" in window) {
      const pick = el("button", "cp-drop");
      pick.type = "button";
      pick.innerHTML = DROPPER;
      pick.setAttribute("aria-label", "Pick a colour from your screen");
      pick.addEventListener("click", async () => {
        try {
          const { sRGBHex } = await new window.EyeDropper().open();
          const rgb = fromHex(sRGBHex);
          if (rgb) {
            [hue, sat, val] = rgbToHsv(rgb);
            commit(true);
            remember(toHex(rgb));
          }
        } catch {}
      });
      top.append(pick);
    }
    const rgbRow = el("div", "cp-row cp-rgbs");
    rgbRow.append(...rgbFields.map((f) => f.box));
    const row = (colors) => {
      const list = el("div", "cp-swatches");
      for (const color of colors) {
        const s = el("button", "cp-swatch");
        s.type = "button";
        s.style.setProperty("--c", color);
        s.setAttribute("aria-label", color);
        s.addEventListener("click", () => {
          [hue, sat, val] = rgbToHsv(fromHex(color));
          commit(true);
        });
        list.append(s);
      }
      return list;
    };
    pop.append(sv, hueBar, top, rgbRow, row(PRESETS));
    const recent = readRecent();
    if (recent.length)
      pop.append(row(recent));
    const paint = (fields) => {
      const rgb = hsvToRgb(hue, sat, val);
      const hex = toHex(rgb);
      sv.style.setProperty("--hue", `hsl(${hue} 100% 50%)`);
      svThumb.style.left = `${sat * 100}%`;
      svThumb.style.top = `${(1 - val) * 100}%`;
      svThumb.style.setProperty("--c", hex);
      hueThumb.style.left = `${hue / 360 * 100}%`;
      hueThumb.style.setProperty("--c", `hsl(${hue} 100% 50%)`);
      preview.style.setProperty("--c", hex);
      if (fields) {
        hexField.value = hex;
        rgbFields.forEach((f, i) => f.field.value = String(Math.round(rgb[i])));
      }
      return hex;
    };
    const commit = (fields) => {
      const hex = paint(fields);
      if (hex === input.value.toLowerCase())
        return;
      input.value = hex;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };
    dragArea(sv, (x, y) => {
      sat = x;
      val = 1 - y;
      commit(true);
    }, () => remember(input.value));
    dragArea(hueBar, (x) => {
      hue = x * 360;
      commit(true);
    }, () => remember(input.value));
    hexField.addEventListener("input", () => {
      const rgb = fromHex(hexField.value);
      if (!rgb)
        return;
      [hue, sat, val] = rgbToHsv(rgb);
      const hex = commit;
      hex(false);
      rgbFields.forEach((f, i) => f.field.value = String(rgb[i]));
    });
    hexField.addEventListener("blur", () => paint(true));
    rgbFields.forEach((f) => {
      f.field.addEventListener("input", () => {
        const values = rgbFields.map((x) => Math.min(255, Number(x.field.value.replace(/\D/g, "")) || 0));
        [hue, sat, val] = rgbToHsv(values);
        commit(false);
        hexField.value = toHex(values);
      });
      f.field.addEventListener("blur", () => paint(true));
    });
    paint(true);
    button.classList.add("open");
    openPopup(pop, button, false, () => {
      button.classList.remove("open");
      remember(input.value);
    });
  });
  return root;
}

// src/shared/smoke.ts
var FRAG = `precision mediump float;
uniform vec2 res; uniform float t; uniform vec3 tint; uniform float strength;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(.8,.6,-.6,.8);for(int i=0;i<4;i++){v+=a*noise(p);p=m*p*2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/res; vec2 p=uv*vec2(res.x/res.y,1.)*1.6;
  vec2 q=vec2(fbm(p+vec2(0.,t*.035)),fbm(p+vec2(5.2,1.3-t*.03)));
  float f=fbm(p+1.6*q+vec2(t*.015,0.));
  float a=smoothstep(.35,.95,f*1.1)*strength;
  gl_FragColor=vec4(tint*a,a);
}`;
function startSmoke(canvas, opts) {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true });
  if (!gl)
    return () => {};
  const shader = (type, source) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram();
  gl.attachShader(program, shader(gl.VERTEX_SHADER, "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}"));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    return () => {};
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(gl.getAttribLocation(program, "a"), 2, gl.FLOAT, false, 0, 0);
  const u = (n) => gl.getUniformLocation(program, n);
  const uRes = u("res"), uT = u("t"), uTint = u("tint"), uStrength = u("strength");
  gl.uniform1f(uStrength, opts.strength);
  const resize = () => {
    const box = canvas.getBoundingClientRect();
    canvas.width = Math.max(160, Math.round(box.width / 4));
    canvas.height = Math.max(100, Math.round(box.height / 4));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  resize();
  addEventListener("resize", resize);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const draw = (now) => {
    const [r, g, b] = opts.tint();
    gl.uniform3f(uTint, r, g, b);
    gl.uniform1f(uT, reduced ? 20 : now / 1000);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  let onScreen = true;
  const watcher = new IntersectionObserver(([e]) => onScreen = !!e?.isIntersecting);
  watcher.observe(canvas);
  let running = true, last = 0;
  const frame = (now) => {
    if (!running)
      return;
    if (onScreen && !document.hidden && now - last > 33) {
      last = now;
      draw(now);
    }
    if (!reduced)
      requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  return () => {
    running = false;
    watcher.disconnect();
    removeEventListener("resize", resize);
  };
}
// release.config.json
var release_config_default = {
  updateUrl: "https://ashlightapp.github.io/updates",
  repo: "ashlightapp/ashlightapp.github.io"
};

// src/shared/settings.ts
var NO_KEY = { vk: 0, name: "None" };
var key = (vk, name) => ({ vk, name });
var DEFAULT_MOUSE_SPEED = 10;
var defaultColor = () => ({
  vibrance: 0,
  saturation: 100,
  hue: 0,
  contrast: 100,
  brightness: 0,
  gamma: 1,
  highlights: 0,
  shadows: 0,
  blacks: 0,
  whites: 0,
  shadowTint: 0,
  highlightTint: 0,
  temperature: 0,
  tint: 0,
  red: 100,
  green: 100,
  blue: 100,
  filter: "none",
  nvidia: false
});
var defaults = () => ({
  color: defaultColor(),
  darken: { enabled: false, color: "#00ff00", amount: 45, complement: 0 },
  aspect: { enabled: false, mode: "stretch", w: 4, h: 3, key: { ...NO_KEY }, onlyGames: true },
  crosshair: {
    enabled: false,
    show: "aim",
    aimKey: key(2, "Right mouse"),
    toggleKey: key(119, "F8"),
    aimDelay: 200,
    onlyRust: false,
    style: "rustholo",
    color: "#ff3b3b",
    size: 14,
    thickness: 2,
    gap: 3,
    opacity: 100,
    glow: 40,
    outline: false,
    offsetX: 0,
    offsetY: 0,
    cover: 0,
    coverColor: "#1a1c1f",
    image: "",
    fitScreen: true,
    dynamic: false
  },
  hud: {
    enabled: false,
    corner: "tr",
    x: -1,
    y: -1,
    scale: 100,
    opacity: 100,
    layout: "card",
    lyricAnim: "slide",
    gradientText: true,
    textColor: "#ffffff",
    background: 100,
    artBlur: 28,
    radius: 20,
    lyricSize: 17,
    lyricGlow: false,
    showProgress: true,
    showArt: true,
    showLyrics: true,
    lines: 3,
    lyricsOnline: true,
    lyricOffset: 0,
    hideWhenPaused: false,
    artColor: true,
    toggleKey: { ...NO_KEY },
    playKey: { ...NO_KEY },
    nextKey: { ...NO_KEY },
    prevKey: { ...NO_KEY }
  },
  stats: {
    enabled: false,
    corner: "tl",
    scale: 100,
    opacity: 100,
    background: 100,
    layout: "bar",
    color: "#ffffff",
    meters: true,
    cpu: true,
    gpu: true,
    temp: true,
    ram: true,
    vram: false,
    power: false,
    ping: false,
    session: false,
    clock: true,
    pingHost: "1.1.1.1"
  },
  tools: {
    noMouseAccel: false,
    highPerformance: false,
    keepAwake: false,
    mouseSpeed: DEFAULT_MOUSE_SPEED,
    gameMode: false,
    noGameCapture: false
  },
  macro: {
    enabled: false,
    key: { ...NO_KEY },
    sendKey: false,
    gameKey: { ...NO_KEY },
    startDelay: 25,
    confirmRelease: false,
    confirmDelay: 20,
    onlyGame: true
  },
  discord: { enabled: true },
  app: {
    closeToTray: true,
    startWithWindows: false,
    autoUpdate: true,
    theme: "graphite",
    accent: "#ffffff",
    windowButtons: "mac",
    buttonsSide: "right",
    intro: true,
    lastVersion: "",
    seenAnnouncement: "",
    startMinimized: false,
    hideFromCapture: false,
    quickKey: { ...NO_KEY },
    updateEveryHours: 2
  },
  profile: { name: "", avatar: "", source: "none" },
  library: { custom: [], hidden: [], played: {} },
  games: {
    auto: true,
    profiles: [],
    seen: [],
    active: { exe: "", base: {} }
  },
  suggest: { sent: [], withName: false },
  social: { id: "", secret: "" },
  share: { server: SHARE_SERVER, quality: "1080p60", audio: true },
  ui: {
    background: "none",
    file: "",
    dim: 40,
    blur: 0,
    glassPanels: false,
    panelOpacity: 22,
    mode: "dark",
    scale: 100,
    font: "mono",
    motion: true,
    pauseVideo: true,
    smoke: true,
    navFolded: []
  },
  plugins: {}
});
var PROFILE_SECTIONS = {
  color: { label: "Colour", keys: ["color", "darken"] },
  aspect: { label: "Aspect ratio", keys: ["aspect"] },
  crosshair: { label: "Crosshair", keys: ["crosshair"] }
};
var DISCORD_APP_ID = "1554975548944420904";
var SHARE_SERVER = "https://app-804a9dc99f9869a8.up.railway.app";
var THEMES = [
  { id: "graphite", name: "Graphite", a: "70, 70, 70", b: "32, 32, 32", glow1: "218, 218, 218", glow2: "150, 150, 150" },
  { id: "sky", name: "Sky", a: "44, 98, 162", b: "18, 38, 84", glow1: "130, 210, 255", glow2: "80, 130, 250" },
  { id: "aurora", name: "Aurora", a: "20, 110, 120", b: "56, 34, 126", glow1: "90, 255, 210", glow2: "190, 110, 255" },
  { id: "sunset", name: "Sunset", a: "154, 62, 96", b: "64, 32, 100", glow1: "255, 170, 95", glow2: "255, 80, 150" },
  { id: "ocean", name: "Ocean", a: "14, 118, 148", b: "10, 50, 96", glow1: "90, 240, 255", glow2: "40, 150, 230" },
  { id: "lavender", name: "Lavender", a: "108, 84, 170", b: "48, 40, 100", glow1: "220, 200, 255", glow2: "165, 130, 245" },
  { id: "rose", name: "Rose", a: "162, 70, 112", b: "80, 34, 72", glow1: "255, 175, 205", glow2: "235, 100, 165" },
  { id: "forest", name: "Forest", a: "38, 116, 90", b: "16, 56, 56", glow1: "120, 245, 185", glow2: "60, 185, 145" },
  { id: "ember", name: "Ember", a: "164, 78, 46", b: "86, 36, 32", glow1: "255, 170, 90", glow2: "255, 95, 60" },
  { id: "midnight", name: "Midnight", a: "40, 52, 128", b: "16, 20, 66", glow1: "145, 160, 255", glow2: "100, 85, 235" },
  { id: "mint", name: "Mint", a: "36, 132, 120", b: "22, 74, 88", glow1: "150, 255, 220", glow2: "70, 215, 190" },
  { id: "slate", name: "Slate", a: "72, 82, 100", b: "36, 42, 58", glow1: "180, 200, 230", glow2: "120, 140, 180" },
  { id: "crimson", name: "Crimson", a: "128, 24, 44", b: "32, 14, 20", glow1: "255, 120, 130", glow2: "220, 50, 70" },
  { id: "gold", name: "Gold", a: "150, 112, 30", b: "58, 44, 20", glow1: "255, 220, 130", glow2: "250, 170, 60" }
];
var RANGES = {
  "color.vibrance": [0, 200, 1],
  "color.highlights": [-100, 100, 1],
  "color.shadows": [-100, 100, 1],
  "color.blacks": [-100, 100, 1],
  "color.whites": [-100, 100, 1],
  "color.shadowTint": [-100, 100, 1],
  "color.highlightTint": [-100, 100, 1],
  "darken.amount": [0, 100, 1],
  "darken.complement": [0, 100, 1],
  "ui.dim": [0, 90, 1],
  "ui.blur": [0, 40, 1],
  "ui.panelOpacity": [0, 100, 1],
  "ui.scale": [85, 115, 5],
  "app.updateEveryHours": [1, 24, 1],
  "color.saturation": [0, 300, 1],
  "color.hue": [-180, 180, 1],
  "color.contrast": [50, 150, 1],
  "color.brightness": [-40, 40, 1],
  "color.gamma": [0.5, 2.5, 0.01],
  "color.temperature": [-100, 100, 1],
  "color.tint": [-100, 100, 1],
  "color.red": [50, 150, 1],
  "color.green": [50, 150, 1],
  "color.blue": [50, 150, 1],
  "macro.startDelay": [0, 100, 5],
  "macro.confirmDelay": [0, 150, 5],
  "crosshair.aimDelay": [0, 600, 10],
  "crosshair.size": [1, 60, 1],
  "crosshair.thickness": [1, 10, 1],
  "crosshair.gap": [0, 40, 1],
  "crosshair.opacity": [10, 100, 1],
  "crosshair.glow": [0, 100, 1],
  "crosshair.offsetX": [-40, 40, 1],
  "crosshair.offsetY": [-40, 40, 1],
  "crosshair.cover": [0, 40, 1],
  "hud.scale": [60, 180, 5],
  "hud.opacity": [20, 100, 1],
  "hud.background": [0, 100, 1],
  "hud.artBlur": [0, 60, 1],
  "hud.radius": [0, 32, 1],
  "hud.lyricSize": [12, 28, 1],
  "hud.lines": [1, 5, 1],
  "hud.lyricOffset": [-2000, 2000, 50],
  "stats.scale": [60, 180, 5],
  "stats.opacity": [20, 100, 1],
  "stats.background": [0, 100, 1],
  "tools.mouseSpeed": [1, 20, 1],
  "aspect.w": [1, 8192, 1],
  "aspect.h": [1, 8192, 1]
};
function getPath(root, path) {
  return path.split(".").reduce((node, k) => node?.[k], root);
}
function setPath(root, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const parent2 = keys.reduce((node, k) => node?.[k], root);
  if (parent2 && typeof parent2 === "object")
    parent2[last] = value;
}
var clamp = (v, min, max) => Math.min(max, Math.max(min, v));
function clampSetting(path, value) {
  const range = RANGES[path];
  return range ? clamp(value, range[0], range[1]) : value;
}
var CONFIG_VERSION = 2;
function migrate(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    return raw;
  const from = typeof raw.v === "number" ? raw.v : 1;
  if (from < 2) {
    if (raw.ui?.background === "desktop")
      raw.ui.background = "none";
  }
  raw.v = CONFIG_VERSION;
  return raw;
}
function looksLikeSettings(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    return false;
  const known = Object.keys(defaults());
  return Object.keys(raw).filter((k) => known.includes(k) && raw[k] && typeof raw[k] === "object").length >= 3;
}
var HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
function sanitize(saved) {
  const merged = defaults();
  const walk = (target, source, prefix) => {
    if (!source || typeof source !== "object")
      return;
    for (const k of Object.keys(target)) {
      const path = prefix ? `${prefix}.${k}` : k;
      const value = source[k];
      if (value === undefined || value === null || typeof value !== typeof target[k])
        continue;
      if (Array.isArray(target[k])) {
        if (Array.isArray(value))
          target[k] = value;
        continue;
      }
      if (typeof value === "object" && Object.keys(target[k]).length === 0)
        target[k] = value;
      else if (typeof value === "object")
        walk(target[k], value, path);
      else if (typeof value === "number") {
        if (Number.isFinite(value))
          target[k] = clampSetting(path, value);
      } else if (typeof value === "string" && HEX.test(target[k]) && !HEX.test(value)) {} else
        target[k] = value;
    }
  };
  walk(merged, saved, "");
  return merged;
}

// src/renderer/core.ts
var webview = window.chrome.webview;
var SITE = release_config_default.updateUrl.replace(/\/updates$/, "");
var OVERLAY_BOX = 400;
var HUD_MARGIN = 24;
var nextId = 1;
var waiting = new Map;
var eventHandlers = new Map;
var listeners = new Map;
function host(action, ...params) {
  return new Promise((resolve) => {
    const id = nextId++;
    waiting.set(id, resolve);
    webview.postMessage(JSON.stringify({ id, a: action, p: params }));
  });
}
var onHost = (name, fn) => eventHandlers.set(name, fn);
var emit = (channel, ...args) => listeners.get(channel)?.forEach((fn) => fn(...args));
webview.addEventListener("message", (e) => {
  const m = e.data;
  if (m.id !== undefined) {
    waiting.get(m.id)?.(m.r);
    waiting.delete(m.id);
  } else if (m.e)
    eventHandlers.get(m.e)?.(...m.p ?? []);
});
var settings = defaults();
var live = { nvidia: false, colorOk: true, gammaOk: true, gammaAccepted: 1, boostOn: false, aspectOn: false, lensError: false, firing: false, zoomOn: false, crosshairVisible: false, rust: false, game: false, front: "", powerError: "" };
var media = null;
var lyrics = [];
var lyricsFor = "";
var discord = "off";
var update = { status: "idle" };
var announcement = null;
var whatsNew = null;
var discordUser = null;
var version = "";
var recovered = false;
var primary = { width: 1920, height: 1080, scale: 1 };
var visible = false;
var firstRun = false;
var notice = "";
var originalMouseSpeed = DEFAULT_MOUSE_SPEED;
var hudHidden = false;
var hudMoving = false;
var resolveReady;
var ready = new Promise((resolve) => resolveReady = resolve);
var overlayOpen = new Set;
var saveTimer = null;
var settingsText = () => JSON.stringify({ v: CONFIG_VERSION, ...settings }, null, 2);
var saveNow = () => void host("save", settingsText());
var BACKUP_KEEP = 20;
var BACKUP_NAME = /^(\d{4})-(\d\d)-(\d\d)_(\d\d)-(\d\d)-(\d\d)-(\d{3})_([a-z-]+)\.json$/;
var pad = (n) => String(n).padStart(2, "0");
var today = () => {
  const d = new Date;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
async function backupNames() {
  const all = await host("backups") ?? [];
  return all.filter((n) => BACKUP_NAME.test(n)).sort().reverse();
}
async function makeBackup(reason, text = settingsText()) {
  const d = new Date;
  const name = `${today()}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}-${String(d.getMilliseconds()).padStart(3, "0")}_${reason}.json`;
  const ok = await host("backupWrite", name, text);
  for (const old of (await backupNames()).slice(BACKUP_KEEP))
    await host("backupDelete", old);
  return ok ? name : null;
}
async function replaceAll(raw, reason) {
  if (!looksLikeSettings(raw))
    return "This doesn't look like Ashlight settings.";
  if (!await makeBackup(reason))
    return "Couldn't make a backup first, so nothing was changed.";
  const wasStartup = settings.app.startWithWindows;
  const social = settings.social;
  settings = sanitize(migrate(raw));
  settings = ownSettings();
  settings.social = social;
  settings.app.lastVersion = version;
  if (settings.app.startWithWindows !== wasStartup)
    host("startup", settings.app.startWithWindows);
  saveNow();
  pushSettings();
  syncCrosshair();
  syncHud();
  syncStats();
  host("discord", settings.discord.enabled, DISCORD_APP_ID);
  return null;
}
function parseSettings(text) {
  if (typeof text !== "string" || !text.trim() || text.length > 1024 * 1024)
    return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
function scheduleSave() {
  if (saveTimer)
    clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 400);
}
function pushSettings() {
  const { image: _image, ...crosshair } = settings.crosshair;
  host("engine", `settings:${JSON.stringify({ ...settings, crosshair })}`);
}
var px = (value) => Math.round(value * primary.scale);
function cornerPosition(corner, width, height) {
  const margin = px(HUD_MARGIN);
  return {
    x: corner.endsWith("l") ? margin : primary.width - width - margin,
    y: corner.startsWith("t") ? margin : primary.height - height - margin
  };
}
function openOverlay(kind, page) {
  if (overlayOpen.has(kind))
    return;
  overlayOpen.add(kind);
  host("overlayCreate", kind, page);
}
function closeOverlay(kind) {
  if (!overlayOpen.delete(kind))
    return;
  host("overlayDestroy", kind);
}
var sendOverlay = (kind, channel, ...args) => {
  if (overlayOpen.has(kind))
    host("overlaySend", kind, JSON.stringify({ c: channel, a: args }));
};
function placeCrosshair() {
  const size = px(OVERLAY_BOX);
  const x = settings.crosshair;
  host("overlayPlace", "crosshair", Math.round((primary.width - size) / 2 + px(x.offsetX)), Math.round((primary.height - size) / 2 + px(x.offsetY)), size, size);
}
var sendCrosshair = () => sendOverlay("crosshair", "crosshair", settings.crosshair, live.crosshairVisible, live.firing);
function syncCrosshair() {
  if (settings.crosshair.enabled) {
    const fresh = !overlayOpen.has("crosshair");
    openOverlay("crosshair", "overlay/overlay.html");
    if (!fresh) {
      placeCrosshair();
      sendCrosshair();
    }
  } else
    closeOverlay("crosshair");
}
function hudSize() {
  const h = settings.hud;
  const scale = h.scale / 100 * primary.scale;
  const lineHeight = h.lyricSize * 2;
  const lines = h.showLyrics || h.layout === "lyrics" ? h.lines : 0;
  const body = lines ? lines * lineHeight + 14 : 0;
  if (h.layout === "line")
    return { width: Math.round(620 * scale), height: Math.round(64 * scale) };
  return { width: Math.round(400 * scale), height: Math.round(((h.layout === "lyrics" ? 16 : 104) + body) * scale) };
}
function placeHud() {
  const size = hudSize();
  const h = settings.hud;
  const position2 = h.x >= 0 && h.y >= 0 ? { x: h.x, y: h.y } : cornerPosition(h.corner, size.width, size.height);
  host("overlayPlace", "hud", position2.x, position2.y, size.width, size.height);
}
var sendHud = () => sendOverlay("hud", "hud", settings.hud, media, hudHidden, hudMoving);
var sendLyrics = () => {
  sendOverlay("hud", "lyrics", lyrics);
  emit("lyrics", lyrics);
};
function syncHud() {
  if (settings.hud.enabled) {
    const fresh = !overlayOpen.has("hud");
    openOverlay("hud", "hud/hud.html");
    if (!fresh) {
      placeHud();
      sendHud();
    }
  } else {
    closeOverlay("hud");
    hudMoving = false;
  }
  syncMedia();
}
function placeStats() {
  const s = settings.stats;
  const items = [s.cpu, s.gpu, s.temp, s.ram, s.vram, s.power, s.ping, s.session, s.clock].filter(Boolean).length;
  const scale = s.scale / 100 * primary.scale;
  const count = Math.max(1, items);
  let width, height;
  if (s.layout === "list") {
    width = Math.round(190 * scale);
    height = Math.round((count * (s.meters ? 30 : 22) + 22) * scale);
  } else if (s.layout === "mini") {
    width = Math.round(count * 72 * scale + 16);
    height = Math.round(34 * scale);
  } else {
    width = Math.round(count * 74 * scale + 20);
    height = Math.round((s.meters ? 66 : 58) * scale);
  }
  const position2 = cornerPosition(s.corner, width, height);
  host("overlayPlace", "stats", position2.x, position2.y, width, height);
}
function syncStats() {
  if (false) {} else
    closeOverlay("stats");
  syncMonitor();
}
var quickOpen = false;
var QUICK = { width: 320, height: 268 };
function toggleQuick() {
  quickOpen = !quickOpen;
  if (quickOpen)
    openOverlay("quick", "quick/quick.html");
  else
    closeOverlay("quick");
}
onHost("quickSet", (message) => {
  if (!message.path?.startsWith("color.") || typeof message.value !== "number")
    return;
  applySetting(message.path, message.value);
  emit("changed", message.path);
});
onHost("overlayReady", (kind) => {
  if (kind === "quick") {
    const w = px(QUICK.width), h = px(QUICK.height);
    host("overlayPlace", "quick", primary.width - w - px(HUD_MARGIN), Math.round((primary.height - h) / 2), w, h);
    host("overlayInteractive", "quick", true);
    sendOverlay("quick", "quick", settings.color);
  }
  if (kind === "crosshair") {
    placeCrosshair();
    sendCrosshair();
  } else if (kind === "hud") {
    placeHud();
    sendHud();
    sendOverlay("hud", "lyrics", lyrics);
  } else if (kind === "stats") {
    placeStats();
    sendOverlay("stats", "stats", settings.stats);
  }
});
onHost("overlayMoved", (x, y) => {
  if (!hudMoving)
    return;
  settings.hud.x = Math.max(0, x);
  settings.hud.y = Math.max(0, y);
  scheduleSave();
});
function syncMedia() {
  const keys = settings.hud.playKey.vk || settings.hud.nextKey.vk || settings.hud.prevKey.vk;
  host("media", !!(settings.hud.enabled || visible || keys));
}
function parseLrc(text) {
  const lines = [];
  for (const row of text.split(/\r?\n/)) {
    const stamps = [...row.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];
    if (stamps.length === 0)
      continue;
    const words = row.replace(/\[[^\]]*\]/g, "").trim();
    for (const s of stamps)
      lines.push({ time: (Number(s[1]) * 60 + Number(s[2])) * 1000, text: words });
  }
  return lines.sort((a, b) => a.time - b.time);
}
var lyricCache = new Map;
async function fetchLyrics(m) {
  if (lyricCache.size > 60)
    lyricCache.clear();
  const id = `${m.artist}|${m.title}`;
  const cached = lyricCache.get(id);
  if (cached)
    return cached;
  const params = new URLSearchParams({ track_name: m.title, artist_name: m.artist });
  let synced = "";
  try {
    const exact = new URLSearchParams(params);
    if (m.album)
      exact.set("album_name", m.album);
    if (m.duration)
      exact.set("duration", String(Math.round(m.duration / 1000)));
    const response = await fetch(`https://lrclib.net/api/get?${exact}`, { signal: AbortSignal.timeout(8000) });
    if (response.ok)
      synced = (await response.json()).syncedLyrics ?? "";
    if (!synced) {
      const search = await fetch(`https://lrclib.net/api/search?${params}`, { signal: AbortSignal.timeout(8000) });
      if (search.ok)
        synced = (await search.json()).find((r) => r.syncedLyrics)?.syncedLyrics ?? "";
    }
  } catch {
    return [];
  }
  const lines = parseLrc(synced);
  lyricCache.set(id, lines);
  return lines;
}
function refreshLyrics() {
  const id = media ? `${media.artist}|${media.title}` : "";
  if (id === lyricsFor)
    return;
  lyricsFor = id;
  lyrics = [];
  sendLyrics();
  if (media && settings.hud.lyricsOnline) {
    const asked = id;
    fetchLyrics(media).then((lines) => {
      if (lyricsFor !== asked)
        return;
      lyrics = lines;
      sendLyrics();
    });
  }
}
onHost("media", (raw) => {
  if (raw.none || !raw.title || /\.localhost$|^https?:/i.test(raw.title))
    media = null;
  else {
    const now = Date.now();
    const position2 = raw.playing && raw.updated ? raw.position + Math.max(0, now - raw.updated) : raw.position;
    media = { title: raw.title, artist: raw.artist ?? "", album: raw.album ?? "", playing: !!raw.playing, position: position2, duration: raw.duration ?? 0, at: now, art: raw.art ?? "", source: raw.source ?? "" };
  }
  emit("media", media);
  sendHud();
  refreshLyrics();
});
var syncMonitor = () => void host("monitor", false, "", false);
onHost("monitor", (m) => {
  emit("monitor", m);
  sendOverlay("stats", "monitor", m);
});
function setUpdate(next) {
  update = next;
  emit("update", update);
}
var updateInfo = null;
var downloadedFile = "";
var newer = (a, b) => {
  const x = a.split(".").map(Number), y = b.split(".").map(Number);
  for (let i = 0;i < 3; i++)
    if ((x[i] ?? 0) !== (y[i] ?? 0))
      return (x[i] ?? 0) > (y[i] ?? 0);
  return false;
};
async function checkUpdate() {
  setUpdate({ status: "checking" });
  try {
    const text = await host("fetchText", `${release_config_default.updateUrl}/latest.json`);
    if (!text)
      throw new Error("unreachable");
    updateInfo = JSON.parse(text);
    if (!updateInfo)
      return setUpdate({ status: "latest" });
    if (updateInfo.version === version && settings.app.lastVersion && settings.app.lastVersion !== version && updateInfo.notes) {
      whatsNew = { version, notes: updateInfo.notes };
      emit("whatsNew", whatsNew);
    }
    if (settings.app.lastVersion !== version) {
      settings.app.lastVersion = version;
      scheduleSave();
    }
    if (!newer(updateInfo.version, version))
      return setUpdate({ status: "latest" });
    setUpdate({ status: "available", version: updateInfo.version, notes: updateInfo.notes });
    if (!visible)
      host("notify", `Ashlight ${updateInfo.version} is out`, updateInfo.notes || "Open Ashlight to update.");
    if (settings.app.autoUpdate)
      await downloadUpdate();
  } catch {
    setUpdate({ status: "error" });
  }
}
async function downloadUpdate() {
  if (!updateInfo)
    return;
  setUpdate({ status: "downloading", version: updateInfo.version, percent: 0 });
  const file = await host("downloadUpdate", `${release_config_default.updateUrl}/${updateInfo.file}`, updateInfo.sha256);
  if (!file)
    return setUpdate({ status: "error" });
  downloadedFile = file;
  setUpdate({ status: "ready", version: updateInfo.version, notes: updateInfo.notes });
}
var lastAnnounceCheck = 0;
async function checkAnnouncement() {
  if (release_config_default.updateUrl.includes("localhost"))
    return;
  lastAnnounceCheck = Date.now();
  const text = await host("fetchText", `${SITE}/announce.json`);
  let next = null;
  try {
    const raw = text ? JSON.parse(text) : null;
    if (raw && typeof raw.id === "string" && raw.id && typeof raw.title === "string") {
      const level = ["info", "update", "important"].includes(raw.level) ? raw.level : "info";
      next = { id: raw.id.slice(0, 64), title: raw.title.slice(0, 80), text: String(raw.text ?? "").slice(0, 600), level };
      if (typeof raw.url === "string" && /^https:\/\/[^\s]+$/.test(raw.url))
        next.url = raw.url;
      if (typeof raw.expires === "string" && Date.parse(raw.expires) < Date.now())
        next = null;
    }
  } catch {
    next = null;
  }
  if (next && next.id === settings.app.seenAnnouncement)
    next = null;
  const fresh = !!next && next.id !== announcement?.id;
  announcement = next;
  emit("announce", announcement);
  if (fresh && !visible && next)
    host("notify", next.title, next.text);
}
setInterval(() => void checkAnnouncement(), 30 * 60 * 1000);
var updateTimer = null;
function scheduleUpdates() {
  if (updateTimer)
    clearInterval(updateTimer);
  updateTimer = setInterval(() => {
    if (settings.app.autoUpdate && update.status !== "ready" && update.status !== "downloading")
      checkUpdate();
  }, settings.app.updateEveryHours * 3600 * 1000);
}
function applySetting(path, value) {
  const finalValue = typeof value === "number" ? clampSetting(path, value) : value;
  setPath(settings, path, finalValue);
  if (path === "color.vibrance" && !settings.color.nvidia) {
    settings.color.nvidia = true;
    emit("changed", "color.nvidia");
  }
  if (path === "hud.corner") {
    settings.hud.x = -1;
    settings.hud.y = -1;
  }
  scheduleSave();
  const forEngine = !/^(ui|discord|stats|library|profile|share|social|games|suggest|decompiler)\./.test(path) && !(path.startsWith("app.") && path !== "app.quickKey") && !(path.startsWith("hud.") && !path.endsWith("Key"));
  if (forEngine)
    pushSettings();
  if (path === "app.startWithWindows")
    host("startup", !!finalValue);
  if (path === "app.hideFromCapture")
    host("overlayHidden", !!finalValue);
  if (path === "app.updateEveryHours")
    scheduleUpdates();
  if (path.startsWith("crosshair."))
    syncCrosshair();
  if (path.startsWith("hud.")) {
    syncHud();
    if (path === "hud.lyricsOnline" && finalValue) {
      lyricsFor = "";
      refreshLyrics();
    }
  }
  if (path.startsWith("stats."))
    syncStats();
  if (path.startsWith("discord."))
    host("discord", settings.discord.enabled, DISCORD_APP_ID);
}
function pickReticleImage() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/webp,image/jpeg,image/gif";
    input.addEventListener("cancel", () => resolve(null));
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file)
        return resolve(null);
      if (file.size > 2 * 1024 * 1024)
        return resolve({ error: "Use an image under 2 MB." });
      const reader = new FileReader;
      reader.onload = () => resolve({ image: String(reader.result) });
      reader.onerror = () => resolve({ error: "Could not read that image." });
      reader.readAsDataURL(file);
    });
    input.click();
  });
}
var actions = {
  windowAction: (action) => {
    if (action === "minimize")
      host("minimize");
    if (action === "maximize")
      host("maximize");
    if (action === "close")
      closeRequested();
  },
  openFolder: () => host("openFolder"),
  openUrl: (url) => host("openUrl", url),
  resetColor: () => {
    settings.color = defaults().color;
    scheduleSave();
    pushSettings();
  },
  resetAll: async () => {
    await makeBackup("before-reset");
    if (settings.app.startWithWindows)
      host("startup", false);
    const social = settings.social;
    settings = defaults();
    settings.social = social;
    settings.app.lastVersion = version;
    settings.tools.mouseSpeed = originalMouseSpeed;
    saveNow();
    pushSettings();
    syncCrosshair();
    syncHud();
    syncStats();
    host("discord", settings.discord.enabled, DISCORD_APP_ID);
    host("windowGlass", false);
    return settings;
  },
  compare: (on) => host("engine", on ? "compare:1" : "compare:0"),
  capture: (on) => host("engine", on ? "capture:1" : "capture:0"),
  devices: () => host("devices"),
  modes: (device) => host("modes", device),
  applyMode: (device, mode, scaling) => host("applyMode", device, mode, scaling),
  resetMode: (device) => host("resetMode", device),
  mediaCommand: (name) => host("mediaCommand", name),
  hudMove: (on) => {
    hudMoving = on;
    host("overlayInteractive", "hud", on);
    sendHud();
  },
  pickReticleImage,
  flushDns: () => host("flushDns"),
  pingNow: (target) => host("pingNow", target),
  listDir: (dir) => host("listDir", dir),
  readFile: (path) => host("readFile", path),
  steamPath: () => host("steamPath"),
  pickExe: () => host("pickExe"),
  audioPeak: () => host("audioPeak"),
  pluginsDir: () => host("pluginsDir"),
  pickPluginManifest: () => host("pickPluginManifest"),
  pluginOpenFolder: (id) => host("pluginOpenFolder", String(id)),
  pluginInstall: (id, url) => host("pluginInstall", String(id), String(url)),
  pluginInstallLocal: (id, folder) => host("pluginInstallLocal", String(id), String(folder)),
  pluginUninstall: (id) => host("pluginUninstall", String(id)),
  fetchText: (url) => host("fetchText", String(url)),
  launch: (target) => host("launch", target),
  notify: (title, text) => !visible && host("notify", String(title).slice(0, 60), String(text).slice(0, 200)),
  officialBuild: async () => {
    const text = await host("fetchText", `${release_config_default.updateUrl}/latest.json`);
    try {
      const info = text ? JSON.parse(text) : null;
      return info ? { version: String(info.version), appSha256: String(info.appSha256 ?? "") } : null;
    } catch {
      return null;
    }
  },
  openSettings: (page) => host("openSettings", page),
  dismissAnnouncement: () => {
    if (!announcement)
      return;
    settings.app.seenAnnouncement = announcement.id;
    scheduleSave();
    announcement = null;
    emit("announce", null);
  },
  dismissWhatsNew: () => {
    whatsNew = null;
    emit("whatsNew", null);
  },
  scanTemp: () => host("scanTemp"),
  cleanTemp: () => host("cleanTemp"),
  checkUpdate: () => checkUpdate(),
  pickBackground: (kind) => host("pickBackground", kind),
  selfHash: () => host("selfHash"),
  diagnostics: async () => {
    const lines = [
      `Ashlight ${version}`,
      navigator.userAgent,
      `Main screen: ${primary.width} x ${primary.height} at ${Math.round(primary.scale * 100)}%`,
      `NVIDIA vibrance: ${live.nvidia ? "yes" : "no"}`,
      `Colour layer: ${live.colorOk ? "ok" : "unavailable"}`,
      `Gamma: ${live.gammaOk ? `ok, ${Math.round(live.gammaAccepted * 100)}% accepted` : "unavailable"}`,
      `Discord: ${discord}`,
      `Update check: ${update.status}`,
      `Overlays open: ${[...overlayOpen].join(", ") || "none"}`,
      `Recovered from a crash: ${recovered}`
    ];
    return lines.join(`
`);
  },
  exportSettings: () => {
    const own = ownSettings();
    return JSON.stringify({ ttool: true, v: CONFIG_VERSION, ...own, crosshair: { ...own.crosshair, image: "" }, social: { id: "", secret: "" } }, null, 2);
  },
  importSettings: async (text) => {
    const raw = parseSettings(text);
    return raw ? replaceAll(raw, "before-import") : "Your clipboard doesn't hold Ashlight settings.";
  },
  importFromFile: async () => {
    const text = await host("importFile");
    if (text === null)
      return "cancelled";
    if (text === "too big")
      return "That file is too big to be Ashlight settings.";
    const raw = parseSettings(text);
    return raw ? replaceAll(raw, "before-import") : "That file isn't Ashlight settings.";
  },
  exportToFile: async () => host("exportFile", actions.exportSettings(), `Ashlight settings ${today()}.json`),
  backups: async () => (await backupNames()).map((name) => {
    const m = BACKUP_NAME.exec(name);
    return { name, time: new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6], +m[7]).getTime(), reason: m[8] };
  }),
  backupNow: () => makeBackup("manual"),
  saveProfile: (exe, parts) => {
    exe = cleanExe(exe);
    parts = parts.filter((p) => (p in PROFILE_SECTIONS));
    if (!/^[\w .()+-]{1,60}\.exe$/.test(exe) || !parts.length)
      return false;
    if (settings.games.active.exe)
      switchProfile("");
    const anySettings = settings;
    const values = {};
    for (const k of sectionKeys(parts))
      values[k] = clone(anySettings[k]);
    settings.games.profiles = [...settings.games.profiles.filter((p) => p.exe !== exe), { exe, parts, values }];
    saveNow();
    emit("games");
    return true;
  },
  deleteProfile: (exe) => {
    if (settings.games.active.exe === exe)
      switchProfile("");
    settings.games.profiles = settings.games.profiles.filter((p) => p.exe !== exe);
    saveNow();
    emit("games");
  },
  pickGame: async () => {
    const path = await host("pickExe");
    return path ? cleanExe(path) : null;
  },
  restoreBackup: async (name) => {
    const raw = parseSettings(await host("backupRead", name));
    return raw ? replaceAll(raw, "before-restore") : "That backup can't be read.";
  },
  deleteBackup: (name) => host("backupDelete", name),
  installUpdate: () => {
    if (update.status === "available")
      downloadUpdate();
    else if (update.status === "ready" && downloadedFile) {
      saveNow();
      host("runUpdate", downloadedFile);
    }
  }
};
function closeAnimation() {
  const on = settings.ui.motion && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!on)
    return false;
  document.body.classList.add("closing");
  setTimeout(() => document.body.classList.remove("closing"), 400);
  return true;
}
function closeRequested() {
  const animate = closeAnimation();
  if (settings.app.closeToTray) {
    visible = false;
    host("hide", animate);
    syncMedia();
    syncMonitor();
  } else {
    saveNow();
    host("quit", animate);
  }
}
onHost("live", (next) => {
  const changed = live.crosshairVisible !== next.crosshairVisible || live.firing !== next.firing;
  const frontChanged = live.front !== next.front || live.game !== next.game;
  live = next;
  emit("live", live);
  if (changed)
    sendCrosshair();
  if (frontChanged)
    onFront(next.front ?? "", !!next.game);
});
var clone = (v) => JSON.parse(JSON.stringify(v));
var sectionKeys = (parts) => parts.flatMap((p) => [...PROFILE_SECTIONS[p]?.keys ?? []]);
var cleanExe = (exe) => exe.trim().toLowerCase().replace(/^.*[\\/]/, "");
var frontTimer = null;
function onFront(exe, game) {
  exe = cleanExe(exe);
  if (game && exe && exe !== "ashlight.exe" && exe !== "explorer.exe" && !settings.games.seen.includes(exe)) {
    settings.games.seen = [exe, ...settings.games.seen].slice(0, 8);
    scheduleSave();
    emit("games");
  }
  if (frontTimer)
    clearTimeout(frontTimer);
  frontTimer = setTimeout(() => {
    const want = settings.games.auto && settings.games.profiles.some((p) => p.exe === exe) ? exe : "";
    if (want !== settings.games.active.exe)
      switchProfile(want);
  }, 700);
}
function switchProfile(exe) {
  const active = settings.games.active;
  const anySettings = settings;
  if (active.exe) {
    for (const [k, v] of Object.entries(active.base))
      if (k in anySettings)
        anySettings[k] = clone(v);
    settings.games.active = { exe: "", base: {} };
  }
  const profile = settings.games.profiles.find((p) => p.exe === exe);
  if (profile) {
    const base = {};
    const cleaned = sanitize(clone(profile.values));
    for (const k of sectionKeys(profile.parts)) {
      base[k] = clone(anySettings[k]);
      anySettings[k] = cleaned[k];
    }
    settings.games.active = { exe, base };
  }
  saveNow();
  pushSettings();
  syncCrosshair();
  emit("profile", settings.games.active.exe);
}
function restoreAfterCrash() {
  if (!settings.games.active.exe)
    return;
  settings = ownSettings();
  saveNow();
}
function ownSettings() {
  const own = clone(settings);
  const anyOwn = own;
  for (const [k, v] of Object.entries(own.games.active.base))
    if (k in anyOwn && k !== "games")
      anyOwn[k] = v;
  own.games.active = { exe: "", base: {} };
  return own;
}
onHost("hotkey", (name) => {
  if (name === "hudToggle") {
    hudHidden = !hudHidden;
    sendHud();
  } else if (name === "quick")
    toggleQuick();
  else
    host("mediaCommand", name);
});
onHost("discordReady", (ready2) => {
  const u = ready2?.data?.user;
  if (!u || !/^\d{5,22}$/.test(String(u.id)))
    return;
  const avatar = typeof u.avatar === "string" && /^[a-z0-9_]{6,64}$/i.test(u.avatar) ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128` : "";
  discordUser = { name: String(u.global_name || u.username || "").slice(0, 40), avatar };
  emit("discordUser", discordUser);
});
onHost("discord", (status) => {
  discord = status;
  emit("discord", status);
});
onHost("closeRequested", closeRequested);
onHost("windowShown", () => {
  visible = true;
  if (Date.now() - lastAnnounceCheck > 5 * 60 * 1000)
    checkAnnouncement();
  syncMedia();
  syncMonitor();
});
onHost("displayChanged", (next) => {
  primary = next;
  if (overlayOpen.has("crosshair"))
    placeCrosshair();
  if (overlayOpen.has("hud"))
    placeHud();
  if (overlayOpen.has("stats"))
    placeStats();
});
onHost("engineReady", (info) => {
  recovered = info.recovered;
  originalMouseSpeed = clampSetting("tools.mouseSpeed", info.mouseSpeed);
  if (firstRun) {
    settings.color.vibrance = info.vibrancePercent;
    settings.tools.mouseSpeed = originalMouseSpeed;
  }
  pushSettings();
  syncCrosshair();
  syncHud();
  syncStats();
  host("discord", settings.discord.enabled, DISCORD_APP_ID);
  resolveReady();
});
var bridge = {
  get: async () => {
    await ready;
    const shown = notice;
    notice = "";
    return { settings, live, version, recovered, media, lyrics, discord, update, announcement, whatsNew, discordUser, notice: shown };
  },
  set: applySetting,
  call: async (action, ...args) => actions[action]?.(...args),
  on: (channel, fn) => {
    if (!listeners.has(channel))
      listeners.set(channel, []);
    listeners.get(channel).push(fn);
  }
};
window.ttool = bridge;
addEventListener("mousedown", (e) => {
  if (e.button !== 0)
    return;
  const target = e.target;
  if (target.closest("button, a, input, select, label, nav") || !target.closest(".titlebar, .side"))
    return;
  host("drag");
});
async function bootCore() {
  const boot = await host("boot");
  version = boot.version;
  primary = boot.primary;
  firstRun = boot.settings === null;
  let upgraded = false;
  if (!firstRun) {
    const raw = parseSettings(boot.settings);
    if (raw && typeof raw === "object") {
      upgraded = raw.v !== CONFIG_VERSION || raw.app?.lastVersion !== version;
      settings = sanitize(migrate(raw));
    } else {
      settings = defaults();
      notice = "Your settings file couldn't be read, so Ashlight started fresh. The old file is saved in Settings, Backups.";
      makeBackup("unreadable", String(boot.settings));
    }
  } else {
    settings.app.lastVersion = version;
  }
  settings.games.profiles = (Array.isArray(settings.games.profiles) ? settings.games.profiles : []).filter((p) => p && typeof p.exe === "string" && Array.isArray(p.parts) && p.values && typeof p.values === "object").map((p) => ({ exe: cleanExe(p.exe), parts: p.parts.filter((x) => (x in PROFILE_SECTIONS)), values: p.values })).slice(0, 50);
  settings.games.seen = settings.games.seen.filter((x) => typeof x === "string").slice(0, 8);
  settings.hud.enabled = false;
  settings.aspect.enabled = false;
  restoreAfterCrash();
  await ready;
  if (!firstRun)
    (async () => {
      if (upgraded) {
        await makeBackup("before-update", String(boot.settings));
        saveNow();
      } else if (!(await backupNames()).some((n) => n.startsWith(today())))
        await makeBackup("daily");
    })();
  host("overlayHidden", settings.app.hideFromCapture);
  if (!settings.share.server)
    settings.share.server = SHARE_SERVER;
  scheduleUpdates();
  if (!boot.hidden && !settings.app.startMinimized) {
    visible = true;
    host("show");
  }
  syncMedia();
  syncMonitor();
  if (!release_config_default.updateUrl.includes("localhost")) {
    checkUpdate();
    checkAnnouncement();
  }
}

// src/shared/reticle.ts
function drawReticle(ctx, cx, cy, r, scale, image, spread = 0) {
  const size = r.size * scale * (1 + 0.18 * spread);
  const t = Math.max(1, Math.round(r.thickness * scale));
  const gap = r.gap * scale + spread * (r.size * 0.55 + 3) * scale;
  const strokes = new Path2D;
  const fills = new Path2D;
  const bar = (x, y, w, h) => fills.rect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  const arms = (top, length = size, g = gap) => {
    bar(cx - g - length, cy - t / 2, length, t);
    bar(cx + g, cy - t / 2, length, t);
    bar(cx - t / 2, cy + g, t, length);
    if (top)
      bar(cx - t / 2, cy - g - length, t, length);
  };
  const dot = (radius) => {
    fills.moveTo(cx + radius, cy);
    fills.arc(cx, cy, radius, 0, Math.PI * 2);
  };
  const ring = (radius) => {
    strokes.moveTo(cx + radius, cy);
    strokes.arc(cx, cy, radius, 0, Math.PI * 2);
  };
  switch (r.style) {
    case "rustholo":
      ring(size);
      dot(Math.max(1.2 * scale, t * 0.8));
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        strokes.moveTo(cx + dx * size, cy + dy * size);
        strokes.lineTo(cx + dx * size * 0.72, cy + dy * size * 0.72);
      }
      break;
    case "rustdot":
      dot(Math.max(1, size / 6));
      break;
    case "rustcross":
      arms(true, size * 0.45, Math.max(gap, 2 * scale));
      break;
    case "holo":
      ring(size);
      dot(Math.max(1.2 * scale, t * 0.9));
      break;
    case "dot":
      dot(Math.max(1, size / 4));
      break;
    case "cross":
      arms(true);
      break;
    case "crossdot":
      arms(true);
      dot(t * 0.75);
      break;
    case "tee":
      arms(false);
      break;
    case "ring":
      ring(size);
      break;
    case "chevron":
      strokes.moveTo(cx - size, cy + size * 0.8);
      strokes.lineTo(cx, cy + gap * 0.25);
      strokes.lineTo(cx + size, cy + size * 0.8);
      break;
    case "triangle":
      strokes.moveTo(cx, cy - size);
      strokes.lineTo(cx + size * 0.87, cy + size * 0.5);
      strokes.lineTo(cx - size * 0.87, cy + size * 0.5);
      strokes.closePath();
      break;
    case "x":
      for (const [dx, dy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
        const k = Math.SQRT1_2;
        strokes.moveTo(cx + dx * gap * k, cy + dy * gap * k);
        strokes.lineTo(cx + dx * (gap + size) * k, cy + dy * (gap + size) * k);
      }
      break;
    case "square":
      strokes.rect(cx - size * 0.7, cy - size * 0.7, size * 1.4, size * 1.4);
      dot(Math.max(1, t * 0.8));
      break;
    case "diamond":
      strokes.moveTo(cx, cy - size);
      strokes.lineTo(cx + size, cy);
      strokes.lineTo(cx, cy + size);
      strokes.lineTo(cx - size, cy);
      strokes.closePath();
      dot(Math.max(1, t * 0.8));
      break;
    case "brackets": {
      const e = size * 0.9, l = size * 0.45;
      for (const [dx, dy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
        strokes.moveTo(cx + dx * e, cy + dy * (e - l));
        strokes.lineTo(cx + dx * e, cy + dy * e);
        strokes.lineTo(cx + dx * (e - l), cy + dy * e);
      }
      dot(Math.max(1, t * 0.7));
      break;
    }
    case "ringcross":
      ring(size);
      arms(true, size * 0.55, Math.max(gap, size * 0.35));
      break;
    case "sniper": {
      const long = size * 2.6;
      const thin = Math.max(1, Math.round(t * 0.6));
      fills.rect(Math.round(cx - long), Math.round(cy - thin / 2), Math.round(long * 2), thin);
      fills.rect(Math.round(cx - thin / 2), Math.round(cy - long), thin, Math.round(long * 2));
      for (let i = 1;i <= 3; i++) {
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const px2 = cx + dx * i * size * 0.7, py = cy + dy * i * size * 0.7;
          fills.moveTo(px2 + t * 0.9, py);
          fills.arc(px2, py, Math.max(1.2, t * 0.9), 0, Math.PI * 2);
        }
      }
      break;
    }
    case "image":
      break;
  }
  ctx.save();
  if (r.cover > 0) {
    ctx.fillStyle = r.coverColor;
    ctx.beginPath();
    ctx.arc(cx, cy, r.cover * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = r.opacity / 100;
  if (r.style === "image") {
    if (image?.complete && image.naturalWidth > 0) {
      const box = size * 2;
      const ratio = image.naturalWidth / image.naturalHeight;
      const w = ratio >= 1 ? box : box * ratio;
      const h = ratio >= 1 ? box / ratio : box;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(image, cx - w / 2, cy - h / 2, w, h);
    }
    ctx.restore();
    return;
  }
  ctx.lineWidth = t;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (r.outline) {
    ctx.strokeStyle = "rgba(0,0,0,0.85)";
    ctx.lineWidth = t + 2 * scale;
    ctx.stroke(strokes);
    ctx.lineWidth = 2 * scale;
    ctx.stroke(fills);
    ctx.lineWidth = t;
  }
  ctx.strokeStyle = r.color;
  ctx.fillStyle = r.color;
  if (r.glow > 0) {
    ctx.shadowColor = r.color;
    ctx.shadowBlur = r.glow / 100 * 14 * scale;
  }
  ctx.stroke(strokes);
  ctx.fill(fills);
  ctx.restore();
}

// src/renderer/app.ts
var api = window.ttool;
var settings2;
var live2;
var media2 = null;
var lyrics2 = [];
var discordStatus = "off";
var updateState = { status: "idle" };
var version2 = "";
var announcement2 = null;
var whatsNew2 = null;
var discordUser2 = null;
function h(tag, props = {}, ...children) {
  const el2 = document.createElement(tag);
  for (const [key2, value] of Object.entries(props)) {
    if (key2 === "class")
      el2.className = String(value);
    else if (key2 === "tip")
      el2.dataset.tip = String(value);
    else if (key2.startsWith("on"))
      el2.addEventListener(key2.slice(2), value);
    else if (key2.startsWith("aria-") || key2 === "role")
      el2.setAttribute(key2, String(value));
    else
      el2[key2] = value;
  }
  for (const child of children)
    if (child)
      el2.append(child);
  return el2;
}
var icon = (node) => {
  const svg = createElement(node);
  svg.classList.add("lucide");
  return svg;
};
var card = (title, ic, ...children) => h("section", { class: "card" }, title ? h("h2", { class: "card-title" }, ic && icon(ic), title) : null, ...children);
var head = (title, ...actions2) => h("div", { class: "page-head" }, h("h1", {}, title), actions2.length ? h("div", { class: "spread" }, ...actions2) : null);
var grid = (...children) => h("div", { class: "grid" }, ...children);
var stack = (...children) => h("div", { class: "stack" }, ...children);
var watchers = new Map;
var watch = (path, fn) => {
  if (!watchers.has(path))
    watchers.set(path, new Set);
  watchers.get(path).add(fn);
};
var notify = (path) => watchers.get(path)?.forEach((fn) => fn());
var queued = new Map;
var flushing = false;
function set(path, value) {
  setPath(settings2, path, value);
  notify(path);
  queued.set(path, value);
  if (!flushing) {
    flushing = true;
    requestAnimationFrame(() => {
      flushing = false;
      queued.forEach((v, p) => api.set(p, v));
      queued.clear();
    });
  }
}
function toast(text) {
  const el2 = document.getElementById("toast");
  el2.textContent = text;
  el2.classList.add("show");
  clearTimeout(el2.timer);
  el2.timer = setTimeout(() => el2.classList.remove("show"), 2600);
}
function slider(path, title, opts = {}) {
  const [min, max, step] = RANGES[path];
  const reset = getPath(defaults(), path);
  const format = (v) => v.toFixed(opts.decimals ?? 0) + (opts.unit ?? "");
  const value = h("span", { class: "value" });
  const input = h("input", { type: "range", min, max, step, "aria-label": title });
  const paint = () => {
    const v = Number(input.value);
    value.textContent = (min < 0 && v > 0 ? "+" : "") + format(v);
    const pos = (v - min) / (max - min) * 100;
    const zero = min < 0 ? (0 - min) / (max - min) * 100 : 0;
    input.style.setProperty("--a", `${Math.min(pos, zero)}%`);
    input.style.setProperty("--b", `${Math.max(pos, zero)}%`);
  };
  const load = () => {
    input.value = String(getPath(settings2, path));
    paint();
  };
  load();
  watch(path, load);
  input.addEventListener("input", () => {
    paint();
    set(path, Number(input.value));
    opts.onChange?.();
  });
  input.addEventListener("dblclick", () => {
    set(path, reset);
    opts.onChange?.();
  });
  value.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (value.querySelector("input"))
      return;
    let finished = false;
    const field = h("input", { class: "value-edit", value: String(Number(input.value)), inputMode: "decimal", "aria-label": `${title} value` });
    const done = (keep) => {
      if (finished)
        return;
      finished = true;
      const n = Number(field.value.replace(",", ".").replace(/[^\d.+-]/g, ""));
      if (keep && field.value.trim() !== "" && Number.isFinite(n)) {
        const v = Math.min(max, Math.max(min, Math.round(n / step) * step));
        set(path, Number(v.toFixed(6)));
        opts.onChange?.();
      }
      paint();
    };
    field.addEventListener("keydown", (k) => {
      k.stopPropagation();
      if (k.key === "Enter")
        done(true);
      if (k.key === "Escape")
        done(false);
    });
    field.addEventListener("blur", () => done(true));
    field.addEventListener("click", (c) => c.preventDefault());
    value.replaceChildren(field);
    field.focus();
    field.select();
  });
  return h("label", { class: `slider${opts.hero ? " hero" : ""}`, tip: `${opts.tip ? `${opts.tip} ` : ""}Click the number to type one. Double-click the slider to reset.` }, h("div", { class: "top" }, h("span", {}, title), opts.hero ? opts.marks ? h("small", {}, opts.marks) : null : value), opts.hero ? h("div", { class: "hero-value" }, value) : null, input);
}
function toggle(path, title, onChange) {
  const button = h("button", { class: "switch", role: "switch", "aria-label": title });
  const load = () => button.setAttribute("aria-checked", String(getPath(settings2, path)));
  load();
  watch(path, load);
  button.addEventListener("click", () => {
    set(path, !getPath(settings2, path));
    onChange?.();
  });
  return button;
}
var labeledToggle = (path, title) => h("span", { class: "inline-toggle" }, toggle(path, title), h("span", {}, title));
var rowOf = (title, tip, control, ic) => h("div", { class: `row${tip ? " tipped" : ""}`, ...tip ? { tip } : {} }, h("div", { class: "row-label" }, ic && icon(ic), h("span", {}, title)), control);
var toggleRow = (path, title, tip, onChange, ic) => rowOf(title, tip, toggle(path, title, onChange), ic);
function segmented(path, options, onChange) {
  const thumb = h("span", { class: "thumb" });
  const root = h("div", { class: "seg", role: "radiogroup" }, thumb);
  const buttons = options.map(([value, text]) => {
    const b = h("button", { role: "radio", onclick: () => {
      set(path, value);
      onChange?.();
    } }, text);
    root.append(b);
    return b;
  });
  const paint = () => {
    const index = options.findIndex(([v]) => v === getPath(settings2, path));
    buttons.forEach((b, i) => {
      b.classList.toggle("on", i === index);
      b.setAttribute("aria-checked", String(i === index));
    });
    thumb.style.width = `calc((100% - 6px) / ${options.length})`;
    thumb.style.transform = `translateX(${index * 100}%)`;
  };
  paint();
  watch(path, paint);
  return root;
}
function chips(path, options) {
  const root = h("div", { class: "chips" });
  const buttons = options.map(([value, text, tip]) => {
    const b = h("button", { class: "chip", tip, onclick: () => set(path, value) }, text);
    b.dataset.v = value;
    root.append(b);
    return b;
  });
  const paint = () => buttons.forEach((b) => b.classList.toggle("on", b.dataset.v === getPath(settings2, path)));
  paint();
  watch(path, paint);
  return root;
}
var KEY_NAMES = {
  ShiftLeft: "Left Shift",
  ShiftRight: "Right Shift",
  ControlLeft: "Left Ctrl",
  ControlRight: "Right Ctrl",
  AltLeft: "Left Alt",
  AltRight: "Right Alt",
  Space: "Space",
  Backquote: "`",
  Minus: "-",
  Equal: "=",
  BracketLeft: "[",
  BracketRight: "]",
  Backslash: "\\",
  Semicolon: ";",
  Quote: "'",
  Comma: ",",
  Period: ".",
  Slash: "/",
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  CapsLock: "Caps Lock",
  Enter: "Enter",
  Tab: "Tab",
  Insert: "Insert",
  Home: "Home",
  End: "End",
  PageUp: "Page Up",
  PageDown: "Page Down"
};
var keyName = (e) => {
  const code = e.code;
  if (KEY_NAMES[code])
    return KEY_NAMES[code];
  if (code.startsWith("Key"))
    return code.slice(3);
  if (code.startsWith("Digit"))
    return code.slice(5);
  if (code.startsWith("Numpad"))
    return `Num ${code.slice(6).replace("Decimal", ".").replace("Add", "+").replace("Subtract", "-").replace("Multiply", "*").replace("Divide", "/")}`;
  return code.replace(/([a-z])([A-Z])/g, "$1 $2") || e.key;
};
var MOUSE = {
  1: { vk: 4, name: "Middle mouse" },
  2: { vk: 2, name: "Right mouse" },
  3: { vk: 5, name: "Mouse 4" },
  4: { vk: 6, name: "Mouse 5" }
};
var KEYBINDS = [
  ["crosshair.aimKey", "Crosshair aim"],
  ["crosshair.toggleKey", "Crosshair toggle"],
  ["hud.playKey", "Play or pause"],
  ["hud.nextKey", "Next track"],
  ["hud.prevKey", "Previous track"],
  ["app.quickKey", "Quick panel"],
  ["macro.key", "Edit Macro"],
  ["macro.gameKey", "Edit Macro: game key"]
];
var NONE = { vk: 0, name: "None" };
function keyButton(path) {
  const cap = h("span", { class: "keycap" });
  const hint = h("span", { class: "key-hint" });
  const button = h("button", { class: "btn key", tip: "Click, then press a key or mouse button. Esc clears it so you can press a new one." }, icon(Keyboard), cap, hint);
  let listening = false;
  let swallowClick = false;
  let timer = null;
  const show = () => {
    const k = getPath(settings2, path);
    cap.textContent = k.vk ? k.name : listening ? "None" : "Not set";
    button.classList.toggle("unset", !k.vk);
    hint.textContent = listening ? "Press a key" : "";
  };
  const stop = () => {
    if (!listening)
      return;
    listening = false;
    if (timer)
      clearTimeout(timer);
    button.classList.remove("listening");
    removeEventListener("keydown", onKey, true);
    removeEventListener("keyup", onKeyUp, true);
    removeEventListener("mousedown", onMouse, true);
    removeEventListener("mouseup", block, true);
    removeEventListener("auxclick", block, true);
    removeEventListener("blur", stop);
    api.call("capture", false);
    show();
  };
  const wait = () => {
    if (timer)
      clearTimeout(timer);
    timer = setTimeout(stop, 1e4);
  };
  const bind = (key2) => {
    for (const [other, label] of KEYBINDS) {
      if (other !== path && getPath(settings2, other).vk === key2.vk) {
        set(other, { ...NONE });
        toast(`${key2.name} was on ${label}, so that one is now unset.`);
      }
    }
    set(path, key2);
    stop();
  };
  const block = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onKey = (e) => {
    block(e);
    if (e.repeat || e.code === "PrintScreen")
      return;
    if (e.code === "Escape" || e.code === "Backspace" || e.code === "Delete") {
      set(path, { ...NONE });
      show();
      wait();
      return;
    }
    bind({ vk: e.keyCode, name: keyName(e) });
  };
  const onKeyUp = (e) => {
    if (e.code !== "PrintScreen")
      return;
    block(e);
    bind({ vk: 44, name: "Print Screen" });
  };
  const onMouse = (e) => {
    if (e.button === 0) {
      if (button.contains(e.target)) {
        block(e);
        swallowClick = true;
      }
      stop();
      return;
    }
    block(e);
    const key2 = MOUSE[e.button];
    if (key2)
      bind(key2);
  };
  button.addEventListener("contextmenu", (e) => e.preventDefault());
  button.addEventListener("click", () => {
    if (swallowClick) {
      swallowClick = false;
      return;
    }
    if (listening)
      return;
    listening = true;
    button.classList.add("listening");
    show();
    api.call("capture", true);
    addEventListener("keydown", onKey, true);
    addEventListener("keyup", onKeyUp, true);
    addEventListener("mousedown", onMouse, true);
    addEventListener("mouseup", block, true);
    addEventListener("auxclick", block, true);
    addEventListener("blur", stop);
    wait();
  });
  show();
  watch(path, show);
  return button;
}
function swatches(path, colors, onChange) {
  const root = h("div", { class: "swatches" });
  const custom = h("input", { type: "color", class: "color-input", tip: "Pick any colour", "aria-label": "Custom colour" });
  const paint = () => {
    const current = String(getPath(settings2, path)).toLowerCase();
    root.querySelectorAll(".swatch").forEach((s) => s.classList.toggle("on", s.dataset.c === current));
    custom.value = current;
  };
  const pick = (color) => {
    set(path, color);
    onChange?.();
  };
  for (const color of colors) {
    const s = h("button", { class: "swatch", "aria-label": `Colour ${color}`, onclick: () => pick(color) });
    s.dataset.c = color;
    s.style.setProperty("--c", color);
    root.append(s);
  }
  custom.addEventListener("input", () => pick(custom.value));
  root.append(colorPicker(custom));
  paint();
  watch(path, paint);
  return root;
}
var position2 = () => {
  if (!media2)
    return 0;
  return media2.position + (media2.playing ? Date.now() - media2.at : 0);
};
function featureTile(path, name, ic, tip) {
  const state = h("small", {});
  const b = h("button", { class: "tile", tip, onclick: () => set(path, !getPath(settings2, path)) }, h("span", { class: "tile-icon" }, icon(ic)), h("span", { class: "tile-text" }, h("b", {}, name), state));
  const load = () => {
    const on = !!getPath(settings2, path);
    b.setAttribute("aria-pressed", String(on));
    state.textContent = on ? "On" : "Off";
  };
  load();
  watch(path, load);
  return b;
}
var notice2 = (ic, title, text, action, kind = "") => h("section", { class: `card notice ${kind}` }, h("span", { class: "notice-icon" }, icon(ic)), h("div", { class: "notice-text" }, h("b", {}, title), text ? h("p", {}, text) : null), action);
function notices() {
  const root = h("div", { class: "notices" });
  const paint = () => {
    const items = [];
    const u = updateState;
    if (u.status === "available" || u.status === "downloading" || u.status === "ready") {
      const button = h("button", { class: "btn primary", onclick: () => void api.call("installUpdate") }, u.status === "ready" ? "Restart and update" : u.status === "available" ? "Update" : `Downloading`);
      button.disabled = u.status === "downloading";
      items.push(notice2(Download, `Ashlight ${u.version} ${u.status === "ready" ? "is ready to install" : "is out"}`, u.notes ?? "", button));
    }
    if (whatsNew2)
      items.push(notice2(Sparkles, `New in ${whatsNew2.version}`, whatsNew2.notes, h("button", { class: "btn icon", "aria-label": "Dismiss", onclick: () => void api.call("dismissWhatsNew") }, icon(X))));
    const a = announcement2;
    if (a) {
      items.push(notice2(a.level === "update" ? Download : a.level === "important" ? Info : Megaphone, a.title, a.text, h("div", { class: "spread" }, a.url ? h("button", { class: "btn", onclick: () => void api.call("openUrl", a.url) }, "Open", icon(ArrowRight)) : null, h("button", { class: "btn icon", "aria-label": "Dismiss", onclick: () => void api.call("dismissAnnouncement") }, icon(X))), a.level));
    }
    root.replaceChildren(...items);
  };
  paint();
  updateListeners.add(paint);
  announceListeners.add(paint);
  return root;
}
function homePage() {
  const bg = h("img", { class: "player-bg", alt: "" });
  const art2 = h("img", { class: "player-art", alt: "" });
  const title = h("div", { class: "player-title" });
  const sub = h("div", { class: "player-sub" });
  const lyric = h("div", { class: "player-lyric" });
  const playIcon = h("span", { style: "display:contents" });
  const update2 = () => {
    title.textContent = media2?.title || "Nothing playing";
    sub.textContent = media2 ? media2.artist : "Play something in Spotify or any music app";
    if (media2?.art) {
      art2.src = bg.src = media2.art;
      bg.classList.add("on");
      art2.style.display = "";
    } else {
      bg.classList.remove("on");
      art2.style.display = "none";
    }
    playIcon.replaceChildren(icon(media2?.playing ? Pause : Play));
  };
  update2();
  mediaListeners.add(update2);
  homeTimer = setInterval(() => {
    if (!media2 || lyrics2.length === 0) {
      lyric.textContent = "";
      return;
    }
    const t = position2() + settings2.hud.lyricOffset;
    let current = "";
    for (const line of lyrics2) {
      if (line.time <= t)
        current = line.text;
      else
        break;
    }
    if (lyric.textContent !== current)
      lyric.textContent = current;
  }, 250);
  const controls = h("div", { class: "spread" }, h("button", { class: "btn icon", "aria-label": "Previous", onclick: () => void api.call("mediaCommand", "prev") }, icon(SkipBack)), h("button", { class: "btn icon primary", "aria-label": "Play or pause", onclick: () => void api.call("mediaCommand", "play") }, playIcon), h("button", { class: "btn icon", "aria-label": "Next", onclick: () => void api.call("mediaCommand", "next") }, icon(SkipForward)));
  const greeting = h("h1", {});
  const paintGreeting = () => {
    const hour = new Date().getHours();
    const part = hour < 5 ? "Good night" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    greeting.textContent = settings2.profile.name ? `${part}, ${settings2.profile.name}` : "Home";
  };
  paintGreeting();
  watch("profile.name", paintGreeting);
  return [
    h("div", { class: "page-head" }, greeting),
    stack(notices(), h("section", { class: "card player" }, bg, art2, h("div", { class: "player-meta" }, title, sub, lyric), controls), h("div", { class: "tiles" }, featureTile("crosshair.enabled", "Crosshair", Crosshair, "Your reticle on top of the game."), featureTile("macro.enabled", "Edit Macro", Gamepad2, "Holds a click for you while you hold a key. Some games ban for this."), featureTile("tools.keepAwake", "Keep Awake", SunMedium, "No sleep or screen-off while Ashlight runs.")))
  ];
}
function colorPage() {
  return [
    head("Colour", (() => {
      const compare = h("button", { class: "btn", tip: "Hold to see your picture without Ashlight." }, icon(Layers), "Compare");
      compare.addEventListener("pointerdown", (e) => {
        compare.setPointerCapture(e.pointerId);
        api.call("compare", true);
      });
      for (const end of ["pointerup", "pointercancel", "lostpointercapture"])
        compare.addEventListener(end, () => void api.call("compare", false));
      return compare;
    })(), h("button", { class: "btn", onclick: () => {
      settings2.color = defaults().color;
      api.call("resetColor");
      for (const key2 of Object.keys(settings2.color))
        notify(`color.${key2}`);
    } }, icon(RotateCcw), "Reset")),
    h("div", { class: "grid hero-row" }, h("section", { class: "card" }, slider("color.saturation", "Saturation", { unit: "%", hero: true, marks: "100 is normal", tip: "100 is the picture as it is. 0 is black and white." })), h("section", { class: "card" }, slider("color.vibrance", "Vibrance", { unit: "%", hero: true, marks: "Past 100 adds software boost", tip: "Uses NVIDIA's own control up to 100. Past that, it continues as extra saturation.", onChange: () => !settings2.color.nvidia && set("color.nvidia", true) }), toggleRow("color.nvidia", "Control NVIDIA vibrance", "Off leaves your NVIDIA setting exactly as it is. Moving the slider turns this on."))),
    h("div", { class: "grid gap" }, stack(card("Light", SunMedium, h("div", { class: "pair" }, slider("color.brightness", "Brightness"), slider("color.contrast", "Contrast", { unit: "%" }), slider("color.gamma", "Gamma", { decimals: 2, tip: "Above 1 lifts mid-tones, below 1 deepens them." }), slider("color.shadows", "Shadows", { tip: "Plus lifts dark areas, minus deepens them." }), slider("color.highlights", "Highlights", { tip: "Minus brings back bright areas, plus makes them brighter." }), slider("color.blacks", "Blacks", { tip: "Plus raises the darkest parts, minus crushes them." }), slider("color.whites", "Whites", { tip: "Plus pushes the brightest parts up, minus pulls them down." }))), card("Colour", Palette, h("div", { class: "pair" }, slider("color.temperature", "Temperature", { tip: "Minus is cooler and bluer, plus is warmer and more orange." }), slider("color.tint", "Tint", { tip: "Minus is greener, plus is more magenta." }), slider("color.shadowTint", "Shadow tint", { tip: "Colours only the dark areas. Minus is cool, plus is warm." }), slider("color.highlightTint", "Highlight tint", { tip: "Colours only the bright areas. Minus is cool, plus is warm." }), slider("color.hue", "Hue", { unit: "°", tip: "Rotates every colour around the wheel." })))), stack(card("Red, green, blue", SlidersVertical, slider("color.red", "Red", { unit: "%" }), slider("color.green", "Green", { unit: "%" }), slider("color.blue", "Blue", { unit: "%" })), card("Filter", Sparkles, chips("color.filter", [
      ["none", "None", "No filter."],
      ["protan", "Protan", "Helps red-weak colour vision."],
      ["deutan", "Deutan", "Helps green-weak colour vision."],
      ["tritan", "Tritan", "Helps blue-weak colour vision."],
      ["gray", "Mono", "Black and white."],
      ["sepia", "Sepia", "Warm vintage tone."],
      ["invert", "Invert", "Flips all colours."]
    ]), h("div", { class: "gap" }), h("div", { class: "strip rainbow" }), h("div", { class: "strip steps", tip: "Every step should be visible without the black looking washed out." }, ...["#000", "#050505", "#0a0a0a", "#101010", "#181818", "#202020", "#2c2c2c", "#3a3a3a", "#505050", "#707070", "#a0a0a0", "#fff"].map((c) => {
      const i = h("i");
      i.style.setProperty("--c", c);
      return i;
    }))), monitorCard()))
  ];
}
function macroPage() {
  return [
    head("Edit Macro"),
    grid(card(null, null, toggleRow("macro.enabled", "Enable", "Clicks down as soon as the key is confirmed held, and up the instant you let go."), rowOf("Hold this key", "Works alongside whatever that key already does in the game.", keyButton("macro.key")), h("div", { class: "gap" }), toggleRow("macro.sendKey", "Also press a game key", "For a key the game itself never sees, like a spare mouse button."), rowOf("Game key", undefined, keyButton("macro.gameKey")), h("div", { class: "gap" }), slider("macro.startDelay", "Start delay", { unit: "ms", tip: "A short wait before it clicks, so the game's own menu has time to open." }), toggleRow("macro.confirmRelease", "Click again on release"), slider("macro.confirmDelay", "Confirm delay", { unit: "ms" }), h("div", { class: "gap" }), toggleRow("macro.onlyGame", "Only while a game is in front", "Stays off in your desktop, browser or Discord.")), h("div", { class: "note warn" }, "Holding a key for you is a macro. Most games ban for this if it's noticed - check the game's rules before using it online."))
  ];
}
var STYLES = [
  ["rustholo", "Rust holo"],
  ["rustdot", "Rust dot"],
  ["rustcross", "Rust cross"],
  ["holo", "Holo ring"],
  ["dot", "Dot"],
  ["cross", "Cross"],
  ["crossdot", "Cross and dot"],
  ["tee", "T"],
  ["ring", "Ring"],
  ["chevron", "Chevron"],
  ["triangle", "Triangle"],
  ["x", "X"],
  ["square", "Square"],
  ["diamond", "Diamond"],
  ["brackets", "Brackets"],
  ["ringcross", "Ring and cross"],
  ["sniper", "Sniper"],
  ["image", "Your image"]
];
var CROSSHAIR_LOOK = ["style", "color", "size", "thickness", "gap", "opacity", "glow", "outline", "offsetX", "offsetY", "cover", "coverColor", "fitScreen", "dynamic"];
var crosshairCode = () => `TTX1-${btoa(JSON.stringify(Object.fromEntries(CROSSHAIR_LOOK.map((k) => [k, settings2.crosshair[k]]))))}`;
function applyCrosshairCode(text) {
  const m = /TTX1-([A-Za-z0-9+/=]{8,2000})/.exec(text);
  if (!m)
    return false;
  let raw;
  try {
    raw = JSON.parse(atob(m[1]));
  } catch {
    return false;
  }
  if (!raw || typeof raw !== "object")
    return false;
  const clean = sanitize({ crosshair: raw }).crosshair;
  const keys = CROSSHAIR_LOOK.filter((k) => (k in raw) && typeof raw[k] === typeof clean[k] && (typeof raw[k] !== "string" || raw[k] === clean[k]));
  if (!keys.length)
    return false;
  for (const k of keys)
    set(`crosshair.${k}`, clean[k]);
  return true;
}
function crosshairPage() {
  const reticleImage = new Image;
  const preview = h("canvas");
  const paintPreview = () => {
    const scale = devicePixelRatio;
    const box = preview.parentElement?.clientWidth || 300;
    preview.width = box * scale;
    preview.height = 260 * scale;
    const ctx = preview.getContext("2d");
    ctx.clearRect(0, 0, preview.width, preview.height);
    drawReticle(ctx, preview.width / 2, preview.height / 2, settings2.crosshair, scale, reticleImage);
  };
  reticleImage.onload = () => paintPreview();
  if (settings2.crosshair.image)
    reticleImage.src = settings2.crosshair.image;
  const stylesRoot = h("div", { class: "styles" });
  const paintStyles = () => {
    stylesRoot.querySelectorAll(".style").forEach((b) => {
      const on = b.dataset.s === settings2.crosshair.style;
      b.classList.toggle("on", on);
      const canvas = b.querySelector("canvas");
      if (!canvas)
        return;
      canvas.width = canvas.height = 64 * devicePixelRatio;
      const s = canvas.width / 2;
      drawReticle(canvas.getContext("2d"), s, s, {
        style: b.dataset.s,
        color: "#ffffff",
        size: 11,
        thickness: 2,
        gap: 3,
        opacity: on ? 100 : 75,
        glow: 0,
        outline: false,
        cover: 0,
        coverColor: "#000000"
      }, devicePixelRatio);
    });
  };
  const changed = () => {
    paintPreview();
    paintStyles();
    syncShow();
  };
  const pickImage = async () => {
    const result = await api.call("pickReticleImage");
    if (result?.error)
      return toast(result.error);
    if (!result?.image)
      return;
    reticleImage.src = result.image;
    set("crosshair.image", result.image);
    set("crosshair.style", "image");
    changed();
  };
  for (const [style, name] of STYLES) {
    const b = h("button", { class: "style", tip: name, "aria-label": name, onclick: () => {
      if (style === "image" && !settings2.crosshair.image)
        return void pickImage();
      set("crosshair.style", style);
      changed();
    } }, style === "image" ? icon(ImageUp) : h("canvas"));
    b.dataset.s = style;
    stylesRoot.append(b);
  }
  const PRESETS2 = [
    ["Clean dot", { style: "dot", color: "#ffffff", size: 4, thickness: 2, gap: 0, glow: 0, outline: true }],
    ["Classic cross", { style: "cross", color: "#00ff88", size: 10, thickness: 2, gap: 4, glow: 20, outline: true }],
    ["Tight cross", { style: "crossdot", color: "#00e5ff", size: 7, thickness: 1.5, gap: 3, glow: 30, outline: false }],
    ["Red holo", { style: "holo", color: "#ff3b3b", size: 14, thickness: 2, gap: 3, glow: 50, outline: false }],
    ["Ring", { style: "ringcross", color: "#ffd84a", size: 12, thickness: 1.5, gap: 4, glow: 25, outline: false }],
    ["Sniper", { style: "sniper", color: "#ffffff", size: 20, thickness: 1, gap: 6, glow: 0, outline: true }]
  ];
  const presets = h("div", { class: "presets" }, ...PRESETS2.map(([name, look]) => h("button", { class: "preset", onclick: () => {
    for (const [k, v] of Object.entries(look))
      set(`crosshair.${k}`, v);
    changed();
    toast(`${name} applied.`);
  } }, name)));
  const aimRow = rowOf("Aim key", "Hold this to show the reticle.", keyButton("crosshair.aimKey"));
  const delayRow = h("div", { class: "gap" }, slider("crosshair.aimDelay", "Aim delay", { unit: " ms", tip: "Waits for the sight to come up. Rust's holosight takes about 200 ms." }));
  const toggleKeyRow = rowOf("Toggle key", undefined, keyButton("crosshair.toggleKey"));
  const syncShow = () => {
    const aiming = settings2.crosshair.show === "aim";
    aimRow.style.display = delayRow.style.display = aiming ? "" : "none";
    toggleKeyRow.style.display = settings2.crosshair.show === "toggle" ? "" : "none";
  };
  requestAnimationFrame(changed);
  const opts = { onChange: changed };
  pageRefresh.set("crosshair", changed);
  return [
    head("Crosshair", h("button", { class: "btn", tip: "Copies a short code for this crosshair's look, to share or keep.", onclick: async () => {
      try {
        await navigator.clipboard.writeText(crosshairCode());
        toast("Crosshair code copied.");
      } catch {
        toast("Couldn't reach the clipboard.");
      }
    } }, icon(Copy), "Copy code"), h("button", { class: "btn", tip: "Uses a crosshair code from your clipboard. Your keys and image stay as they are.", onclick: async () => {
      let text = "";
      try {
        text = await navigator.clipboard.readText();
      } catch {}
      toast(applyCrosshairCode(text) ? "Crosshair loaded." : "Your clipboard doesn't hold a crosshair code.");
    } }, icon(Download), "Paste code"), h("button", { class: "btn", tip: "Use a PNG with a transparent background as your reticle.", onclick: () => void pickImage() }, icon(ImageUp), "Image")),
    grid(stack(card(null, null, toggleRow("crosshair.enabled", "Show crosshair", "Rust's own reticle can't be changed without modifying the game, which risks a ban, so yours is drawn on top. Run the game in borderless window."), rowOf("When", undefined, segmented("crosshair.show", [["aim", "Aiming"], ["always", "Always"], ["toggle", "Toggle"]], changed)), aimRow, delayRow, toggleKeyRow, toggleRow("crosshair.onlyRust", "Only in Rust", "Shows only while Rust is the window in front.")), darkenerCard(), card("Hide Rust's reticle", Layers, slider("crosshair.cover", "Cover size", { tip: "A solid disc under your reticle that covers the game's dot. Keep it small, because it also hides what's behind it.", ...opts }), rowOf("Cover colour", undefined, swatches("crosshair.coverColor", ["#1a1c1f", "#000000", "#3a3f36", "#5a5f66"], changed))), card("Position", Move, slider("crosshair.offsetX", "Left and right", { tip: "Nudges the reticle if it isn't perfectly on the sight." }), slider("crosshair.offsetY", "Up and down"))), stack(h("section", { class: "card preview" }, h("div", { class: "scene" }), preview), card("Reticle", Crosshair, presets, stylesRoot, slider("crosshair.size", "Size", opts), slider("crosshair.thickness", "Thickness", opts), slider("crosshair.gap", "Gap", opts), slider("crosshair.opacity", "Opacity", { unit: "%", ...opts }), slider("crosshair.glow", "Glow", { unit: "%", ...opts }), toggleRow("crosshair.outline", "Black outline", undefined, changed), toggleRow("crosshair.fitScreen", "Fit to screen", "Same size on screen at 1080p, 1440p or 4K."), toggleRow("crosshair.dynamic", "Dynamic", "Opens up while you hold left mouse, then settles back."), rowOf("Colour", undefined, swatches("crosshair.color", ["#ff3b3b", "#ffffff", "#3bff6f", "#3be8ff", "#ffe23b", "#ff4fd8"], changed)))))
  ];
}
function monitorCard() {
  const monitorRow = h("div", { class: "chips" });
  const resRow = h("div", { class: "chips" });
  const hzRow = h("div", { class: "chips" });
  const currentText = h("div", { class: "note" });
  const status = h("div", { class: "note" });
  let devices = [];
  let device = "";
  let modes = [];
  let current = null;
  let resKey = "";
  let selected = null;
  let revertTimer = null;
  const applyButton = h("button", { class: "btn primary", onclick: () => void apply() }, icon(Monitor), "Apply");
  const resetButton = h("button", { class: "btn ghost", onclick: () => void reset(true) }, "Reset to Windows' setting");
  function stopRevertTimer() {
    if (revertTimer)
      clearInterval(revertTimer);
    revertTimer = null;
    status.textContent = "";
  }
  async function reset(announce) {
    stopRevertTimer();
    if (!device)
      return;
    await api.call("resetMode", device);
    if (announce)
      toast("Back to Windows' own setting.");
    await loadModes();
  }
  async function apply() {
    if (!device || !selected)
      return;
    stopRevertTimer();
    const ok = await api.call("applyMode", device, selected, "default");
    if (!ok) {
      status.textContent = "That monitor wouldn't accept this mode.";
      return;
    }
    let left = 15;
    const keep = h("button", { class: "btn primary", onclick: () => stopRevertTimer() }, "Keep this");
    const revertNow = h("button", { class: "btn ghost", onclick: () => void reset(false) }, "Revert now");
    const paint = () => status.replaceChildren(h("span", {}, `If this looks wrong, it reverts in ${left}s. `), keep, revertNow);
    paint();
    revertTimer = setInterval(() => {
      left -= 1;
      if (left <= 0) {
        reset(false);
        return;
      }
      paint();
    }, 1000);
    await loadModes();
  }
  function paintHz() {
    const group = modes.filter((m) => `${m.width}x${m.height}` === resKey).sort((a, b) => b.hz - a.hz);
    hzRow.replaceChildren(...group.map((m) => {
      const isCurrent = current?.width === m.width && current?.height === m.height && current?.hz === m.hz;
      const b = h("button", { class: `chip${selected?.hz === m.hz ? " on" : ""}`, onclick: () => {
        selected = m;
        paintHz();
      } }, `${m.hz} Hz${isCurrent ? " · current" : ""}`);
      return b;
    }));
  }
  function paintRes() {
    const keys = [...new Set(modes.map((m) => `${m.width}x${m.height}`))].sort((a, b) => {
      const [aw, ah] = a.split("x").map(Number);
      const [bw, bh] = b.split("x").map(Number);
      return bw * bh - aw * ah;
    });
    resRow.replaceChildren(...keys.map((key2) => {
      const b = h("button", { class: `chip${key2 === resKey ? " on" : ""}`, onclick: () => {
        resKey = key2;
        selected = modes.find((m) => `${m.width}x${m.height}` === key2 && m.hz === current?.hz) ?? modes.find((m) => `${m.width}x${m.height}` === key2) ?? null;
        paintRes();
        paintHz();
      } }, key2.replace("x", " x "));
      return b;
    }));
  }
  async function loadModes() {
    resRow.replaceChildren(h("div", { class: "note" }, "Loading…"));
    hzRow.replaceChildren();
    const r = await api.call("modes", device);
    modes = r?.modes ?? [];
    current = r?.current ?? null;
    selected = current;
    resKey = current ? `${current.width}x${current.height}` : "";
    currentText.textContent = current ? `Current: ${current.width} x ${current.height} at ${current.hz} Hz` : "Couldn't read this monitor's modes.";
    paintRes();
    paintHz();
  }
  function paintMonitors() {
    monitorRow.replaceChildren(...devices.map((d, i) => {
      const b = h("button", { class: `chip${d === device ? " on" : ""}`, tip: d, onclick: () => {
        device = d;
        paintMonitors();
        loadModes();
      } }, `Monitor ${i + 1}`);
      return b;
    }));
  }
  (async () => {
    devices = await api.call("devices") ?? [];
    if (!devices.length) {
      monitorRow.replaceChildren(h("div", { class: "note" }, "No monitors found."));
      return;
    }
    device = devices[0];
    paintMonitors();
    await loadModes();
  })();
  return card("Monitor", Monitor, h("div", { class: "note" }, "Resolution and refresh rate, for this session only - Windows' own setting comes back after a restart, or right away with Reset."), monitorRow, h("div", { class: "gap" }), currentText, resRow, h("div", { class: "gap" }), hzRow, h("div", { class: "gap" }), h("div", { class: "row", style: "gap:8px" }, applyButton, resetButton), status);
}
var BOOST_TOOLS = [
  ["tools.highPerformance", "Top power plan", Gauge, "Stops Windows lowering CPU speed to save power."],
  ["tools.gameMode", "Game Mode", Gamepad2, "Turns on Windows Game Mode."],
  ["tools.noGameCapture", "Xbox capture off", Camera, "Stops Game Bar's background recording, which can cost FPS."],
  ["tools.noMouseAccel", "Raw mouse", MousePointer2, "Turns off Enhance Pointer Precision, so aim depends only on distance moved."],
  ["tools.keepAwake", "Keep awake", SunMedium, "No sleep or screen-off while Ashlight runs."]
];
var toolCard = (ic, title, text, ...actions2) => h("section", { class: "card tool" }, h("div", { class: "tool-head" }, h("span", { class: "tool-icon" }, icon(ic)), h("b", {}, title)), h("div", { class: "tool-text" }, text), h("div", { class: "spread tool-actions" }, ...actions2));
function toolsPage() {
  const powerNote = h("div", { class: "note warn" });
  const refreshPower = () => {
    powerNote.textContent = live2.powerError;
    powerNote.style.display = live2.powerError ? "" : "none";
  };
  refreshPower();
  liveListeners.add(refreshPower);
  const boostState = h("p", {});
  const boostButton = h("button", { class: "btn primary big", onclick: () => {
    const all = BOOST_TOOLS.every(([p]) => getPath(settings2, p));
    for (const [p] of BOOST_TOOLS)
      set(p, !all);
    toast(all ? "Everything is back to how Windows had it." : "Boost is on. It all goes back when Ashlight closes.");
  } });
  const hero = h("section", { class: "card boost-hero" }, h("span", { class: "boost-icon" }, icon(Rocket)), h("div", { class: "boost-text" }, h("h2", {}, "Game boost"), boostState), boostButton);
  const paintBoost = () => {
    const on = BOOST_TOOLS.filter(([p]) => getPath(settings2, p)).length;
    const all = on === BOOST_TOOLS.length;
    boostButton.textContent = all ? "Turn off" : "Boost now";
    boostState.textContent = all ? "All on" : `${on} of ${BOOST_TOOLS.length} on`;
    hero.classList.toggle("on", all);
  };
  for (const [p] of BOOST_TOOLS)
    watch(p, paintBoost);
  paintBoost();
  const pingText = h("span", {}, "");
  const pingInput = h("input", { class: "text", value: settings2.stats.pingHost, "aria-label": "Server to test" });
  pingInput.addEventListener("change", () => set("stats.pingHost", pingInput.value.trim() || "1.1.1.1"));
  const pingButton = h("button", { class: "btn", onclick: async () => {
    pingButton.disabled = true;
    pingText.textContent = "Testing";
    const results = [];
    for (let i = 0;i < 3; i++) {
      const ms = Number(await api.call("pingNow", pingInput.value.trim() || "1.1.1.1"));
      if (ms >= 0)
        results.push(ms);
    }
    pingText.textContent = results.length ? `${Math.min(...results)} ms best, ${Math.round(results.reduce((x, y) => x + y, 0) / results.length)} ms average` : "No answer from that server.";
    pingButton.disabled = false;
  } }, icon(Wifi), "Test");
  const tempText = h("span", {}, "");
  let scanned = false;
  const tempButton = h("button", { class: "btn" }, icon(Trash), h("span", {}, "Scan"));
  const tempLabel = tempButton.querySelector("span");
  tempButton.addEventListener("click", async () => {
    tempButton.disabled = true;
    if (!scanned) {
      const r = await api.call("scanTemp");
      tempText.textContent = `${(r.bytes / 1024 ** 2).toFixed(0)} MB in ${r.files} files can go.`;
      tempLabel.textContent = "Delete";
      scanned = r.files > 0;
      tempButton.classList.toggle("primary", scanned);
    } else {
      const r = await api.call("cleanTemp");
      toast(`Freed ${(r.bytes / 1024 ** 2).toFixed(0)} MB.`);
      tempText.textContent = "";
      tempLabel.textContent = "Scan";
      tempButton.classList.remove("primary");
      scanned = false;
    }
    tempButton.disabled = false;
  });
  const shortcut = (label, page) => h("button", { class: "chip", onclick: () => void api.call("openSettings", page) }, label);
  return [
    head("Utilities"),
    stack(hero, h("div", { class: "tiles five" }, ...BOOST_TOOLS.map(([p, name, ic, tip]) => featureTile(p, name, ic, `${tip} Back to normal when Ashlight closes.`))), powerNote, h("div", { class: "tools" }, toolCard(Wifi, "Ping test", h("div", {}, pingInput, h("div", { class: "gap" }, pingText)), pingButton), toolCard(Globe, "Flush DNS", "", h("button", { class: "btn", onclick: async () => toast(await api.call("flushDns") ? "DNS cache cleared." : "Could not clear the DNS cache.") }, icon(Globe), "Flush")), toolCard(Trash, "Clean temp files", tempText, tempButton), toolCard(MousePointer2, "Pointer speed", slider("tools.mouseSpeed", "Speed", { tip: "10 is one-to-one with your mouse." })), toolCard(Settings, "Windows settings", "", shortcut("Graphics", "ms-settings:display-advancedgraphics"), shortcut("Game Mode", "ms-settings:gaming-gamemode"), shortcut("Display", "ms-settings:display"), shortcut("Sound", "ms-settings:sound"))))
  ];
}
var DISCORD_TEXT = {
  off: "Off",
  "needs-id": "Not set up",
  connecting: "Looking for Discord",
  connected: "Showing on your Discord profile",
  "no-discord": "Discord isn't running",
  "bad-id": "Discord didn't accept Ashlight"
};
var UPDATE_TEXT = (u) => ({
  idle: "Not checked yet",
  dev: "Updates work in the installed app",
  checking: "Checking",
  latest: "You're on the latest version",
  available: `Version ${u.version} is available`,
  downloading: `Downloading ${Math.round(u.percent ?? 0)}%`,
  ready: `Version ${u.version} is ready to install`,
  error: "Couldn't reach the update server"
})[u.status];
function applyTheme() {
  const root = document.documentElement.style;
  const accent = settings2.app.accent;
  const n = parseInt(accent.slice(1), 16);
  const lum = (0.2126 * (n >> 16 & 255) + 0.7152 * (n >> 8 & 255) + 0.0722 * (n & 255)) / 255;
  root.setProperty("--accent", accent);
  root.setProperty("--on-accent", lum > 0.55 ? "#17181b" : "#ffffff");
  const theme = THEMES.find((t) => t.id === settings2.app.theme) ?? THEMES[0];
  root.setProperty("--bg-a", theme.a);
  root.setProperty("--bg-b", theme.b);
  root.setProperty("--glow-1", theme.glow1);
  root.setProperty("--glow-2", theme.glow2);
}
function themePicker() {
  const root = h("div", { class: "themes" });
  const buttons = THEMES.map((theme) => {
    const b = h("button", { class: "theme", tip: theme.name, "aria-label": theme.name, onclick: () => {
      set("app.theme", theme.id);
      applyTheme();
    } });
    b.style.setProperty("--c1", `rgb(${theme.a})`);
    b.style.setProperty("--c2", `rgb(${theme.b})`);
    b.style.setProperty("--c3", `rgb(${theme.glow1})`);
    b.dataset.v = theme.id;
    root.append(b);
    return b;
  });
  const paint = () => buttons.forEach((b) => b.classList.toggle("on", b.dataset.v === settings2.app.theme));
  paint();
  watch("app.theme", paint);
  return root;
}
function hueToHex(hue) {
  const f = (n) => {
    const k = (n + hue / 60) % 6;
    return Math.round(255 * (1 - Math.max(0, Math.min(k, 4 - k, 1)))).toString(16).padStart(2, "0");
  };
  return `#${f(5)}${f(3)}${f(1)}`;
}
function hexToHue(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
  if (d === 0)
    return 0;
  const raw = max === r ? (g - b) / d % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (raw * 60 + 360) % 360;
}
var HUE_NAMES = [[0, "Red"], [30, "Orange"], [60, "Yellow"], [120, "Green"], [180, "Cyan"], [240, "Blue"], [300, "Magenta"], [360, "Red"]];
var hueName = (hue) => HUE_NAMES.reduce((best, x) => Math.abs(x[0] - hue) < Math.abs(best[0] - hue) ? x : best)[1];
function darkenerCard() {
  const thumb = h("i", { class: "wheel-thumb" });
  const swatch = h("i", { class: "wheel-swatch" });
  const percent = h("b", {});
  const name = h("span", {});
  const wheel = h("div", { class: "wheel", role: "slider", "aria-label": "Colour to darken", tabIndex: 0 }, thumb, h("div", { class: "wheel-center" }, swatch, percent, name));
  const custom = h("input", { type: "color", class: "color-input", tip: "Pick an exact colour", "aria-label": "Exact colour" });
  const paint = () => {
    const d = settings2.darken;
    const hue = hexToHue(d.color);
    const angle = (hue - 90) * Math.PI / 180;
    thumb.style.left = `${50 + 43.5 * Math.cos(angle)}%`;
    thumb.style.top = `${50 + 43.5 * Math.sin(angle)}%`;
    thumb.style.setProperty("--c", d.color);
    swatch.style.setProperty("--c", d.color);
    percent.textContent = d.amount >= 100 ? "Full" : `${d.amount}%`;
    name.textContent = `${hueName(hue)} darker`;
    custom.value = d.color;
    wheel.classList.toggle("off", !d.enabled);
  };
  const pick = (color) => {
    if (!settings2.darken.enabled)
      set("darken.enabled", true);
    set("darken.color", color);
    paint();
  };
  const fromPointer = (e) => {
    const r = wheel.getBoundingClientRect();
    const hue = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI + 90;
    pick(hueToHex((hue + 360) % 360));
  };
  wheel.addEventListener("pointerdown", (e) => {
    wheel.setPointerCapture(e.pointerId);
    fromPointer(e);
  });
  wheel.addEventListener("pointermove", (e) => {
    if (wheel.hasPointerCapture(e.pointerId))
      fromPointer(e);
  });
  wheel.addEventListener("keydown", (e) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowUp" ? 5 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -5 : 0;
    if (!step)
      return;
    e.preventDefault();
    pick(hueToHex((hexToHue(settings2.darken.color) + step + 360) % 360));
  });
  custom.addEventListener("input", () => pick(custom.value));
  for (const path of ["darken.amount", "darken.enabled", "darken.color"])
    watch(path, paint);
  paint();
  const fromScreen = h("button", { class: "btn primary", onclick: async () => {
    if (!("EyeDropper" in window))
      return toast("Picking from the screen isn't available here.");
    api.call("compare", true);
    try {
      const { sRGBHex } = await new window.EyeDropper().open();
      pick(String(sRGBHex).toLowerCase());
      toast(`Darkening ${String(sRGBHex).toLowerCase()}.`);
    } catch {} finally {
      api.call("compare", false);
    }
  } }, icon(Pipette), "Pick from screen");
  const hexText = h("code", { class: "hex-tag" });
  watch("darken.color", () => hexText.textContent = settings2.darken.color);
  hexText.textContent = settings2.darken.color;
  const quick = h("div", { class: "swatches" }, ...[["Red", "#ff0000"], ["Yellow", "#ffff00"], ["Green", "#00ff00"], ["Cyan", "#00ffff"], ["Blue", "#0000ff"], ["Magenta", "#ff00ff"]].map(([label, color]) => {
    const s = h("button", { class: "swatch", tip: label, "aria-label": label, onclick: () => pick(color) });
    s.style.setProperty("--c", color);
    return s;
  }), colorPicker(custom));
  return card("Colour darkener", Moon, toggleRow("darken.enabled", "Darken a colour", "Darkens the chosen colour across your whole screen, so a bright reticle or sight can be dimmed. Things nearby in that colour dim too."), h("div", { class: "spread" }, fromScreen, hexText), h("div", { class: "wheel-box" }, wheel), quick, h("div", { class: "gap" }), slider("darken.amount", "How dark", { unit: "%", onChange: paint, tip: "100 is full dark for the pure colour." }), slider("darken.complement", "Opposite colour", { unit: "%", tip: "Also darkens the colour across the wheel." }), h("div", { class: "spread gap" }, h("button", { class: "btn", onclick: () => {
    if (!settings2.darken.enabled)
      set("darken.enabled", true);
    set("darken.amount", 100);
    paint();
  } }, "Full dark"), h("button", { class: "btn", onclick: () => {
    set("darken.amount", 45);
    set("darken.complement", 0);
    paint();
  } }, icon(RotateCcw), "Reset")));
}
var bgUrl = (file) => window.ttoolDemo ? `../assets/${encodeURIComponent(file)}` : `https://ttool-data.local/${encodeURIComponent(file)}`;
var readableListener = null;
function checkReadable(source) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 48;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(source, 0, 0, 48, 48);
    const d = ctx.getImageData(0, 0, 48, 48).data;
    let brightest = 0;
    for (let i = 0;i < d.length; i += 4) {
      const lum2 = 0.2126 * (d[i] / 255) ** 2.2 + 0.7152 * (d[i + 1] / 255) ** 2.2 + 0.0722 * (d[i + 2] / 255) ** 2.2;
      brightest = Math.max(brightest, lum2);
    }
    const u = settings2.ui;
    const behind = u.glassPanels ? 1 - u.panelOpacity / 100 : 0.06;
    const lum = brightest * (1 - u.dim / 100) * behind + 0.01;
    const ratio = 1.05 / (lum + 0.05);
    readableListener?.(`${ratio >= 4.5 ? "Readable" : "Hard to read"} ${ratio.toFixed(1)} : 1`, ratio >= 4.5);
  } catch {
    readableListener?.("Couldn't measure this file", true);
  }
}
var stopSmoke = null;
var themeGlow = () => {
  const theme = THEMES.find((t) => t.id === settings2.app.theme) ?? THEMES[0];
  const [r, g, b] = theme.glow1.split(",").map((n) => Number(n) / 255);
  return [r, g, b];
};
function applyBackground() {
  const u = settings2.ui;
  const layer = document.getElementById("bg");
  const root = document.documentElement;
  const desktop = u.background === "desktop";
  const has = desktop || u.background !== "none" && !!u.file;
  document.body.classList.toggle("has-bg", has);
  document.body.classList.toggle("see-desktop", desktop);
  document.body.classList.toggle("glass-panels", desktop);
  document.body.classList.toggle("mode-light", u.mode === "light");
  document.body.classList.toggle("mode-win10", u.mode === "win10");
  document.body.classList.toggle("font-sans", u.font === "sans");
  document.body.classList.toggle("no-motion", !u.motion);
  document.body.classList.toggle("smoky", u.smoke && u.motion);
  if (u.smoke && u.motion && !stopSmoke)
    stopSmoke = startSmoke(document.getElementById("smoke"), { tint: themeGlow, strength: 0.55 });
  if (!(u.smoke && u.motion) && stopSmoke) {
    stopSmoke();
    stopSmoke = null;
  }
  root.style.setProperty("--bg-dim", String(u.dim / 100));
  root.style.setProperty("--bg-blur", `${u.blur}px`);
  root.style.setProperty("--panel-o", String(u.panelOpacity / 100));
  root.style.zoom = String(u.scale / 100);
  const current = layer.firstElementChild;
  if (!has || desktop) {
    layer.replaceChildren();
    readableListener?.(desktop ? "Depends on what's behind the window" : "Solid window, nothing behind the text", true);
    return;
  }
  const url = bgUrl(u.file);
  if (current?.dataset.url === url) {
    checkReadable(current);
    return;
  }
  if (u.background === "video") {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.dataset.url = url;
    video.src = url;
    video.addEventListener("loadeddata", () => checkReadable(video), { once: true });
    layer.replaceChildren(video);
  } else {
    const img = new Image;
    img.crossOrigin = "anonymous";
    img.alt = "";
    img.dataset.url = url;
    img.addEventListener("load", () => checkReadable(img), { once: true });
    img.src = url;
    layer.replaceChildren(img);
  }
}
var PLUGIN_PERMISSIONS = [
  { id: "storage", label: "Save its own settings", hint: "A small amount of data, private to this plugin, saved with the rest of Ashlight's settings." },
  { id: "network", label: "Check a ping", hint: "Can ask Ashlight to measure the ping to a server address it names." },
  { id: "theme", label: "Read the current theme", hint: "Can see which theme and mode Ashlight is set to, to match its own look. Read-only." }
];
var KNOWN_PERMISSIONS = new Set(PLUGIN_PERMISSIONS.map((p) => p.id));
var safeManifest = (raw, fallbackId) => {
  if (!raw)
    return null;
  try {
    const m = JSON.parse(raw);
    const id = String(m.id ?? fallbackId ?? "").trim();
    if (!/^[A-Za-z0-9_-]{1,60}$/.test(id))
      return null;
    const permissions = Array.isArray(m.permissions) ? m.permissions.filter((p) => typeof p === "string" && KNOWN_PERMISSIONS.has(p)) : [];
    return {
      id,
      name: String(m.name ?? id).slice(0, 80),
      version: String(m.version ?? "0.0.0").slice(0, 20),
      author: m.author ? String(m.author).slice(0, 60) : undefined,
      description: m.description ? String(m.description).slice(0, 300) : undefined,
      permissions,
      main: /^[\w.-]{1,80}\.js$/.test(String(m.main ?? "")) ? String(m.main) : "main.js"
    };
  } catch {
    return null;
  }
};
var pluginsRoot = null;
var pluginsDirPath = async () => pluginsRoot ??= await api.call("pluginsDir");
async function listInstalledPlugins() {
  const root = await pluginsDirPath();
  const names = await api.call("listDir", root) ?? [];
  const rows = [];
  for (const id of names) {
    const raw = await api.call("readFile", `${root}\\${id}\\plugin.json`);
    const manifest = safeManifest(raw, id);
    if (!manifest)
      continue;
    const state = settings2.plugins[id] ?? { enabled: false, granted: [] };
    rows.push({ manifest, state });
  }
  return rows;
}
var pluginToast = (id, text) => toast(`${id}: ${String(text).slice(0, 200)}`);
function savePluginState(id, patch) {
  const current = settings2.plugins[id] ?? { enabled: false, granted: [] };
  set("plugins", { ...settings2.plugins, [id]: { ...current, ...patch } });
}
var runningPlugins = new Map;
function startPlugin(row, mainJs) {
  const { manifest, state } = row;
  const granted = new Set(state.granted);
  const handle = async (e) => {
    if (e.source !== frame.contentWindow || !e.data)
      return;
    if (e.data.t === "ready")
      return void frame.contentWindow?.postMessage({ t: "init", code: mainJs }, "*");
    if (e.data.t !== "call")
      return;
    const { id: callId, method, args } = e.data;
    const reply = (value, err) => frame.contentWindow?.postMessage({ t: "reply", id: callId, value, err }, "*");
    try {
      if (method === "notify")
        return reply(undefined, undefined), pluginToast(manifest.name, String(args[0] ?? ""));
      if (method === "storage.get") {
        if (!granted.has("storage"))
          return reply(undefined, "Permission denied: storage");
        return reply((settings2.plugins[manifest.id]?.data ?? {})[String(args[0])] ?? null);
      }
      if (method === "storage.set") {
        if (!granted.has("storage"))
          return reply(undefined, "Permission denied: storage");
        const data = { ...settings2.plugins[manifest.id]?.data ?? {}, [String(args[0])]: args[1] };
        savePluginState(manifest.id, { data });
        return reply(true);
      }
      if (method === "network.ping") {
        if (!granted.has("network"))
          return reply(undefined, "Permission denied: network");
        return reply(await api.call("pingNow", String(args[0])));
      }
      if (method === "theme.get") {
        if (!granted.has("theme"))
          return reply(undefined, "Permission denied: theme");
        return reply({ mode: settings2.ui.mode, themeId: settings2.app.theme, colors: THEMES.find((t) => t.id === settings2.app.theme) ?? null });
      }
      reply(undefined, "Unknown method");
    } catch (err) {
      reply(undefined, err instanceof Error ? err.message : "Plugin call failed.");
    }
  };
  const frame = h("iframe", { sandbox: "allow-scripts", style: "display:none", src: "https://ashlight-sandbox.local/renderer/sandbox.html" });
  addEventListener("message", handle);
  document.body.append(frame);
  return { frame, destroy: () => {
    removeEventListener("message", handle);
    frame.remove();
  } };
}
var syncChain = Promise.resolve();
function syncPlugins() {
  const next = syncChain.then(syncPluginsNow);
  syncChain = next.catch(() => {});
  return next;
}
async function syncPluginsNow() {
  const rows = await listInstalledPlugins();
  const wanted = new Set(rows.filter((r) => r.state.enabled).map((r) => r.manifest.id));
  for (const [id, running] of runningPlugins) {
    if (!wanted.has(id)) {
      running.destroy();
      runningPlugins.delete(id);
    }
  }
  const root = await pluginsDirPath();
  for (const row of rows) {
    if (!row.state.enabled || runningPlugins.has(row.manifest.id))
      continue;
    const mainJs = await api.call("readFile", `${root}\\${row.manifest.id}\\${row.manifest.main}`);
    if (typeof mainJs !== "string") {
      pluginToast(row.manifest.name, "Couldn't read its main script.");
      savePluginState(row.manifest.id, { enabled: false });
      continue;
    }
    runningPlugins.set(row.manifest.id, startPlugin(row, mainJs));
  }
}
function permissionRow(id, checked, requested, onChange) {
  const meta = PLUGIN_PERMISSIONS.find((p) => p.id === id);
  const box = h("input", { type: "checkbox", disabled: !requested });
  box.checked = checked && requested;
  box.addEventListener("change", () => onChange(box.checked));
  return h("label", { class: "inline-toggle", tip: meta.hint, style: requested ? "" : "opacity:.4" }, box, h("span", {}, meta.label));
}
function pluginCard(row, onChange) {
  const { manifest, state } = row;
  const perms = h("div", { class: "chips" }, ...PLUGIN_PERMISSIONS.filter((p) => manifest.permissions.includes(p.id)).map((p) => permissionRow(p.id, state.granted.includes(p.id), true, (on) => {
    savePluginState(manifest.id, { granted: on ? [...new Set([...state.granted, p.id])] : state.granted.filter((g) => g !== p.id) });
    onChange();
  })));
  const enableToggle = h("button", { class: "switch", role: "switch", "aria-label": `Turn on ${manifest.name}` });
  enableToggle.setAttribute("aria-checked", String(state.enabled));
  enableToggle.addEventListener("click", () => {
    savePluginState(manifest.id, { enabled: !state.enabled });
    onChange();
  });
  return h("div", { class: "plugin-card" }, h("div", { class: "plugin-card-head" }, icon(Puzzle), h("div", { class: "plugin-card-text" }, h("b", {}, manifest.name), h("span", {}, `v${manifest.version}${manifest.author ? ` by ${manifest.author}` : ""}`)), enableToggle), manifest.description ? h("div", { class: "plugin-card-body" }, h("p", {}, manifest.description)) : null, manifest.permissions.length ? h("div", { class: "plugin-card-body" }, h("p", {}, "Permissions:"), perms) : null, h("div", { class: "row", style: "gap:8px" }, h("button", { class: "btn ghost", onclick: () => void api.call("pluginOpenFolder", manifest.id) }, icon(FolderOpen), "Open folder"), h("button", { class: "btn ghost", onclick: async () => {
    await api.call("pluginUninstall", manifest.id);
    const rest = { ...settings2.plugins };
    delete rest[manifest.id];
    set("plugins", rest);
    onChange();
  } }, icon(Trash), "Uninstall")));
}
function pluginsPage() {
  const intro = h("div", { class: "note" }, "Plugins run sandboxed, with no access to files, other processes or the registry - only the small API a plugin asks for and you approve below. Loading your own plugin while you build it copies its folder in; re-load after you change its code.");
  const list = h("div", { class: "stack" });
  const status = h("div", { class: "note" });
  const refresh = async () => {
    list.replaceChildren(h("div", { class: "note" }, "Loading…"));
    await syncPlugins();
    const rows = await listInstalledPlugins();
    list.replaceChildren(...rows.length ? rows.map((r) => pluginCard(r, () => void refresh())) : [h("div", { class: "note" }, "No plugins installed yet. Load one of your own below, or get one from the Marketplace.")]);
  };
  const loadButton = h("button", { class: "btn primary", onclick: async () => {
    const manifestPath = await api.call("pickPluginManifest");
    if (!manifestPath)
      return;
    const raw = await api.call("readFile", manifestPath);
    const manifest = safeManifest(raw);
    if (!manifest) {
      status.textContent = `That plugin.json isn't valid (needs at least an id like "my-plugin").`;
      return;
    }
    const folder = manifestPath.replace(/\\plugin\.json$/i, "");
    const r = await api.call("pluginInstallLocal", manifest.id, folder);
    if (!r?.ok) {
      status.textContent = r?.error || "Couldn't load that plugin.";
      return;
    }
    if (!settings2.plugins[manifest.id])
      savePluginState(manifest.id, { enabled: false, granted: [] });
    status.textContent = `Loaded ${manifest.name}. Turn it on and grant what it needs above.`;
    refresh();
  } }, icon(FolderOpen), "Load plugin from folder");
  refresh();
  return [head("Plugins"), card(null, null, intro, loadButton, status), list];
}
function marketCard(entry, installed, onInstalled) {
  const busy = { v: false };
  const button = h("button", { class: "btn primary" }, icon(Download), installed ? installed.manifest.version === entry.version ? "Installed" : "Update" : "Install");
  const status = h("div", { class: "note" });
  button.addEventListener("click", async () => {
    if (busy.v)
      return;
    busy.v = true;
    button.setAttribute("disabled", "");
    button.replaceChildren(icon(Download), "Installing…");
    const r = await api.call("pluginInstall", entry.id, entry.download);
    busy.v = false;
    if (!r?.ok) {
      status.textContent = r?.error || "That plugin couldn't be installed.";
      button.replaceChildren(icon(Download), "Install");
      button.removeAttribute("disabled");
      return;
    }
    if (!settings2.plugins[entry.id])
      savePluginState(entry.id, { enabled: false, granted: [] });
    status.textContent = `Installed. Turn it on from Plugins.`;
    button.replaceChildren(icon(Check), "Installed");
    onInstalled();
  });
  return h("div", { class: "plugin-card" }, h("div", { class: "plugin-card-head" }, icon(Store), h("div", { class: "plugin-card-text" }, h("b", {}, entry.name), h("span", {}, `v${entry.version}${entry.author ? ` by ${entry.author}` : ""}`)), button), entry.description ? h("div", { class: "plugin-card-body" }, h("p", {}, entry.description)) : null, entry.permissions.length ? h("div", { class: "plugin-card-body" }, h("p", {}, `Asks for: ${entry.permissions.map((p) => PLUGIN_PERMISSIONS.find((m) => m.id === p)?.label ?? p).join(", ")}`)) : null, status);
}
function marketplacePage() {
  const intro = h("div", { class: "note" }, "Plugins published here were put up by their own developers, not reviewed line by line by Ashlight. Installing one only downloads and unpacks its folder - it still can't do anything until you turn it on and grant it permissions, on the Plugins page.");
  const list = h("div", { class: "stack" });
  const refreshButton = h("button", { class: "btn ghost", onclick: () => void load() }, icon(RefreshCw), "Refresh");
  async function load() {
    list.replaceChildren(h("div", { class: "note" }, "Loading the marketplace…"));
    try {
      const text = await api.call("fetchText", `${release_config_default.updateUrl.replace(/\/updates$/, "")}/plugins.json`);
      const entries = text ? JSON.parse(text) : [];
      const installedRows = await listInstalledPlugins();
      if (!entries.length) {
        list.replaceChildren(h("div", { class: "note" }, "Nothing's published yet."));
        return;
      }
      list.replaceChildren(...entries.map((e) => marketCard(e, installedRows.find((r) => r.manifest.id === e.id), () => void load())));
    } catch {
      list.replaceChildren(h("div", { class: "note" }, "Couldn't reach the marketplace. Check your internet and try again."));
    }
  }
  load();
  return [head("Marketplace", refreshButton), card(null, null, intro), list];
}
function customizePage() {
  const readable = h("span", {});
  const readableIcon = h("span", { class: "read-icon" });
  readableListener = (text, ok) => {
    readable.textContent = text;
    readableIcon.classList.toggle("bad", !ok);
    readableIcon.replaceChildren(icon(ok ? Check : Info));
  };
  const typeChips = h("div", { class: "chips" });
  const fileName = h("div", { class: "note" });
  const paintType = () => {
    const current = settings2.ui.background === "desktop" ? "desktop" : settings2.ui.file ? settings2.ui.background : "none";
    typeChips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c.dataset.v === current));
    fileName.textContent = current === "desktop" ? "The app is see-through: whatever is behind the window shows, with no blur." : settings2.ui.file ? `${settings2.ui.background === "video" ? "Video" : "Picture"} set. Only you see it, nothing is uploaded.` : "No background. The window stays plain.";
  };
  const choose = async (kind) => {
    const file = await api.call("pickBackground", kind);
    if (!file)
      return;
    set("ui.background", kind);
    set("ui.file", file);
    paintType();
    applyBackground();
  };
  for (const [id, text] of [["none", "None"], ["image", "Picture or GIF"], ["video", "Video"]]) {
    const c = h("button", { class: "chip", onclick: () => {
      if (id === "none") {
        set("ui.background", id);
        set("ui.file", "");
        paintType();
        applyBackground();
      } else
        choose(id);
    } }, text);
    c.dataset.v = id;
    typeChips.append(c);
  }
  paintType();
  const onUi = { onChange: applyBackground };
  requestAnimationFrame(applyBackground);
  return [
    head("Customize"),
    grid(stack(card("Background", Image2, typeChips, h("div", { class: "gap" }, fileName), h("div", { class: "gap" }), slider("ui.dim", "Dim", { unit: "%", ...onUi, tip: "Darkens the background so text stays easy to read." }), slider("ui.blur", "Blur", { unit: "px", ...onUi, tip: "Softens the picture itself. Panels never blur." }), toggleRow("ui.pauseVideo", "Pause video when not in front", "Saves your GPU while you are in another window."))), stack(card("Theme", Sparkles, themePicker()), card("Style", Palette, rowOf("Accent", "Colour of buttons, sliders and hovers.", swatches("app.accent", ["#ffffff", "#c9cdd4", "#ffb86b", "#ff6b6b", "#c9a6ff", "#6fb7ff"], applyTheme)), rowOf("Mode", undefined, segmented("ui.mode", [["dark", "Dark"], ["light", "Light"], ["win10", "Windows 10"]], applyBackground)), h("div", { class: "gap" }), slider("ui.scale", "Interface size", { unit: "%", ...onUi }), toggleRow("ui.motion", "Animations", undefined, applyBackground), toggleRow("ui.smoke", "Liquid background", "A soft, slow-moving liquid light behind the app, tinted to your theme. It stops while Ashlight is hidden.", applyBackground))))
  ];
}
function confirmClick(ask, run) {
  let armed = 0;
  return (e) => {
    const button = e.currentTarget;
    if (Date.now() - armed < 4000) {
      armed = 0;
      button.classList.remove("armed");
      run();
      return;
    }
    armed = Date.now();
    const label = button.lastChild;
    const before = label.textContent;
    label.textContent = ask;
    button.classList.add("armed");
    setTimeout(() => {
      label.textContent = before;
      button.classList.remove("armed");
    }, 4000);
  };
}
var BACKUP_REASONS = {
  daily: "Daily",
  manual: "Saved by you",
  "before-import": "Before an import",
  "before-restore": "Before a restore",
  "before-reset": "Before a reset",
  "before-update": "Before an update",
  unreadable: "Unreadable file"
};
var STATUS_LABEL = { pending: "Waiting", accepted: "Accepted", declined: "Not planned", done: "Added" };
function suggestCard() {
  const box = h("textarea", { class: "text suggest-box", rows: 3, maxlength: 1000, placeholder: "A feature, a fix, anything you'd like in Ashlight" });
  const list = h("div", { class: "suggest-list" });
  const statuses = new Map;
  const base = () => settings2.share.server.trim().replace(/\/+$/, "");
  const paint = () => {
    const sent = [...settings2.suggest.sent].reverse().slice(0, 8);
    list.replaceChildren(...sent.map((s) => {
      const st = statuses.get(s.id);
      return h("div", { class: "suggest-row" }, h("span", { class: "suggest-text" }, s.text), h("i", { class: `suggest-status ${st?.status ?? "pending"}` }, STATUS_LABEL[st?.status ?? "pending"] ?? "Waiting"), st?.reply ? h("span", { class: "note suggest-reply" }, st.reply) : null);
    }));
  };
  const refresh = async () => {
    const ids = settings2.suggest.sent.map((s) => s.id).slice(-50);
    if (!ids.length || isDemo() || !/^https?:\/\//.test(base()))
      return paint();
    try {
      const r = await fetch(`${base()}/suggest/status?ids=${ids.join(",")}`, { cache: "no-store" });
      if (r.ok)
        for (const row of await r.json())
          statuses.set(row.id, row);
    } catch {}
    paint();
  };
  const sendButton = h("button", { class: "btn primary", onclick: async () => {
    const text = box.value.trim();
    if (text.length < 5)
      return toast("Write a little more first.");
    sendButton.disabled = true;
    try {
      let id = "";
      if (isDemo())
        id = Math.random().toString(16).slice(2, 18).padEnd(16, "0");
      else {
        const r = await fetch(`${base()}/suggest`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, name: settings2.suggest.withName ? settings2.profile.name : "" }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j.id)
          throw new Error(j.error || "Couldn't send it. Try again in a bit.");
        id = j.id;
      }
      set("suggest.sent", [...settings2.suggest.sent, { id, text: text.slice(0, 1000), at: Date.now() }].slice(-50));
      box.value = "";
      toast("Thanks! Sent to the Ashlight team.");
      paint();
    } catch (e) {
      toast(e.message || "Couldn't send it.");
    } finally {
      sendButton.disabled = false;
    }
  } }, icon(Send), "Send");
  let checked = 0;
  new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting))
      return;
    if (Date.now() - checked < 30000)
      return paint();
    checked = Date.now();
    refresh();
  }).observe(list);
  paint();
  return card("Suggest something", Lightbulb, box, h("div", { class: "spread suggest-foot" }, labeledToggle("suggest.withName", "Include my name"), sendButton), h("span", { class: "note" }, "Only what you write is sent, plus your name if you tick it."), list);
}
function backupsCard(replaced, copy) {
  const list = h("div", { class: "backup-list" }, h("div", { class: "note" }, "Loading"));
  let showAll = false;
  const paint = async () => {
    const items = await api.call("backups");
    if (!items.length)
      return list.replaceChildren(h("div", { class: "note" }, "No backups yet."));
    const when = (t) => new Date(t).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    const shown = showAll ? items : items.slice(0, 5);
    list.replaceChildren(...shown.map((b) => h("div", { class: "backup-row" }, h("span", { class: "backup-when" }, when(b.time)), h("span", { class: "backup-why" }, BACKUP_REASONS[b.reason] ?? b.reason), h("button", { class: "btn small", tip: "Puts these settings back. Your current ones are backed up first.", onclick: confirmClick("Restore?", () => replaced(api.call("restoreBackup", b.name), `Settings from ${when(b.time)} are back.`)) }, icon(ArchiveArrowUp), "Restore"))), ...items.length <= 5 ? [] : [h("button", { class: "link-btn", onclick: () => {
      showAll = !showAll;
      paint();
    } }, showAll ? "Show fewer" : `Show all ${items.length}`)]);
  };
  paint();
  return card("Backups", RotateCcwClock, h("div", { class: "spread wrap" }, h("button", { class: "btn", tip: "Saves all your settings to a file you choose.", onclick: async () => {
    if (await api.call("exportToFile"))
      toast("Settings saved.");
  } }, icon(FileDown), "Save to file"), h("button", { class: "btn", tip: "Loads settings from a file. Your current ones are backed up first.", onclick: () => void replaced(api.call("importFromFile"), "Settings loaded.") }, icon(FileUp), "Open file"), h("button", { class: "btn", tip: "Copies your settings as text. Your chat account is never included.", onclick: async () => copy(await api.call("exportSettings"), "Settings copied.") }, icon(Copy), "Copy"), h("button", { class: "btn", tip: "Uses settings you copied earlier. Your current ones are backed up first.", onclick: async () => {
    let text = "";
    try {
      text = await navigator.clipboard.readText();
    } catch {}
    await replaced(api.call("importSettings", text), "Settings pasted.");
  } }, icon(Download), "Paste")), h("div", { class: "backup-head" }, h("span", { class: "note" }, "Made daily and before big changes. Kept on this PC only."), h("button", { class: "btn small", onclick: async () => {
    if (await api.call("backupNow")) {
      toast("Backup saved.");
      paint();
    } else
      toast("Couldn't save a backup.");
  } }, icon(Plus), "Back up now")), list);
}
function settingsPage() {
  const discordText = h("span", { class: "note" });
  const paintDiscord = () => discordText.textContent = DISCORD_TEXT[discordStatus];
  paintDiscord();
  discordListeners.add(paintDiscord);
  const updateText = h("span", { class: "note" });
  const updateButton = h("button", { class: "btn" }, icon(Download), h("span", {}, "Check"));
  const paintUpdate = () => {
    updateText.textContent = UPDATE_TEXT(updateState);
    updateButton.querySelector("span").textContent = updateState.status === "ready" ? "Restart and install" : updateState.status === "available" ? "Download" : "Check";
    updateButton.disabled = ["dev", "checking", "downloading"].includes(updateState.status);
    updateButton.classList.toggle("primary", updateState.status === "ready");
  };
  paintUpdate();
  updateListeners.add(paintUpdate);
  updateButton.addEventListener("click", () => {
    if (updateState.status === "ready" || updateState.status === "available")
      api.call("installUpdate");
    else
      api.call("checkUpdate");
  });
  const hashText = h("code", { class: "hash" }, "Working it out");
  const verdict = h("div", { class: "verdict" }, h("span", {}, "Checking"));
  let hash = "";
  (async () => {
    hash = await api.call("selfHash") ?? "";
    hashText.textContent = hash || "Couldn't read this copy";
    const official = await api.call("officialBuild");
    const say = (ok, text) => {
      verdict.className = `verdict ${ok === true ? "good" : ok === false ? "bad" : ""}`;
      verdict.replaceChildren(icon(ok === true ? Check : Info), h("span", {}, text));
    };
    if (!hash)
      say(null, "Couldn't read this copy");
    else if (!official)
      say(null, "Couldn't reach the website to compare");
    else if (official.version !== version2)
      say(null, `Compared only for the newest version, ${official.version}. Update first.`);
    else if (!official.appSha256)
      say(null, "The website doesn't list this version's fingerprint");
    else if (official.appSha256.toLowerCase() === hash.toLowerCase())
      say(true, "Official build. Matches the website exactly.");
    else
      say(false, "Doesn't match the official build. Reinstall from the website.");
  })();
  const copy = async (text, done) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = h("textarea", { value: text });
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    toast(done);
  };
  const afterReplace = async (done) => {
    settings2 = (await api.get()).settings;
    applyTheme();
    applyBackground();
    rebuildPages();
    showPage("settings", true);
    toast(done);
  };
  const replaced = async (result, done) => {
    const problem = await result;
    if (problem === "cancelled")
      return;
    if (problem)
      return toast(problem);
    await afterReplace(done);
  };
  return [
    head("Settings", h("button", { class: "btn", onclick: () => void api.call("openFolder") }, icon(FolderOpen), "Config"), h("button", { class: "btn", tip: "Sets everything back to default. A backup is made first.", onclick: confirmClick("Reset all?", async () => {
      await api.call("resetAll");
      await afterReplace("Everything is back to default. Your old settings are in Backups.");
    }) }, icon(RotateCcw), "Reset all")),
    grid(stack(accountCard(), card("Window", Monitor, rowOf("Buttons", undefined, segmented("app.windowButtons", [["mac", "macOS"], ["windows", "Windows"]], mountWindowButtons)), rowOf("Side", undefined, segmented("app.buttonsSide", [["left", "Left"], ["right", "Right"]], mountWindowButtons)), toggleRow("app.intro", "Intro when opening")), card("App", Settings, toggleRow("app.startWithWindows", "Start with Windows", "Starts in the tray and puts your look back."), toggleRow("app.startMinimized", "Start hidden in the tray"), toggleRow("app.closeToTray", "Keep running in tray", "Closing the window keeps effects and HUDs running.")), card("Keybinds", Keyboard, ...KEYBINDS.map(([path, label]) => rowOf(label, undefined, keyButton(path)))), card("Recording and streaming", Camera, toggleRow("app.hideFromCapture", "Hide overlays from recordings", "Your crosshair and HUDs stay on your screen but won't appear in OBS, Discord or screenshots.")), backupsCard(replaced, copy)), stack(suggestCard(), card("Discord", Gamepad2, toggleRow("discord.enabled", "Show Ashlight on my profile"), h("div", { class: "row gap" }, discordText)), card("Updates", Bell, toggleRow("app.autoUpdate", "Update automatically"), h("div", { class: "gap" }), slider("app.updateEveryHours", "Check every", { unit: " h" }), h("div", { class: "row gap" }, updateText, updateButton), h("div", { class: "note gap" }, `Ashlight ${version2}`)), card("Verify this copy", ShieldCheck, verdict, h("div", { class: "gap" }, hashText), h("div", { class: "spread gap" }, h("button", { class: "btn", onclick: () => hash && void copy(hash, "Fingerprint copied.") }, icon(Copy), "Copy SHA-256"))), card("Diagnostics", Wrench, h("div", { class: "spread" }, h("button", { class: "btn", tip: "Copies your Ashlight version, screen and feature status, for reporting a problem. Nothing is sent anywhere.", onclick: async () => copy(await api.call("diagnostics"), "Diagnostics copied.") }, icon(Copy), "Copy diagnostics")))))
  ];
}
var chat = {
  ws: null,
  status: "offline",
  me: null,
  ice: [],
  servers: [],
  dms: [],
  friends: [],
  users: new Map,
  messages: new Map,
  voice: new Map,
  typing: new Map,
  unread: new Map,
  ring: null,
  place: "home",
  channel: "",
  homeTab: "online",
  retry: 0
};
var isDemo = () => !!window.ttoolDemo && !window.ttoolLiveChat;
var call = {
  channel: "",
  mic: null,
  cam: null,
  screen: null,
  muted: false,
  deaf: false,
  peers: new Map,
  levels: new Map,
  rejoin: false
};
var meters = new Map;
setInterval(() => {
  if (!call.channel)
    return;
  const buffer = new Uint8Array(256);
  for (const [user, node] of meters) {
    node.getByteTimeDomainData(buffer);
    let sum = 0;
    for (const v of buffer)
      sum += (v - 128) ** 2;
    const talking = Math.sqrt(sum / buffer.length) > 6 && !(user === chat.me?.id && call.muted);
    document.querySelectorAll(`[data-voice-user="${user}"]`).forEach((el2) => el2.classList.toggle("speaking", talking));
  }
}, 100);
var GROUPS = [
  ["", [{ id: "home", title: "Home", icon: House, build: homePage }]],
  ["Display", [
    { id: "color", title: "Colour", icon: Palette, build: colorPage }
  ]],
  ["Overlay", [
    { id: "crosshair", title: "Crosshair", icon: Crosshair, build: crosshairPage, features: ["crosshair.enabled"] },
    { id: "macro", title: "Edit Macro", icon: Gamepad2, build: macroPage, features: ["macro.enabled"] }
  ]],
  ["System", [
    { id: "tools", title: "Utilities", icon: Wrench, build: toolsPage },
    { id: "customize", title: "Customize", icon: Brush, build: customizePage },
    { id: "settings", title: "Settings", icon: Settings, build: settingsPage }
  ]],
  ["Developer", [
    { id: "plugins", title: "Plugins", icon: Puzzle, build: pluginsPage },
    { id: "marketplace", title: "Marketplace", icon: Store, build: marketplacePage }
  ]]
];
var PAGES = GROUPS.flatMap(([, pages]) => pages);
var mediaListeners = new Set;
var announceListeners = new Set;
var homeTimer = null;
var monitorListeners = new Set;
var liveListeners = new Set;
var discordListeners = new Set;
var updateListeners = new Set;
var pageRefresh = new Map;
var built = new Map;
var activePage = "";
function rebuildPages() {
  built.clear();
  watchers.clear();
  mediaListeners.clear();
  announceListeners.clear();
  if (homeTimer)
    clearInterval(homeTimer);
  monitorListeners.clear();
  liveListeners.clear();
  discordListeners.clear();
  updateListeners.clear();
  pageRefresh.clear();
  wireNavDots();
  document.getElementById("page").replaceChildren();
  activePage = "";
}
var pageOrder = (id) => PAGES.findIndex((p) => p.id === id);
function setupTilt() {
  let active = null;
  const reset = () => {
    if (active)
      active.style.transform = "";
    active = null;
  };
  document.addEventListener("pointermove", (e) => {
    const t = e.target?.closest(".tile, .theme") ?? null;
    if (t !== active)
      reset();
    if (!t || !settings2.ui.motion || settings2.ui.mode === "win10")
      return;
    active = t;
    const r = t.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    t.style.transform = `perspective(700px) rotateX(${(-y * 7).toFixed(1)}deg) rotateY(${(x * 9).toFixed(1)}deg) translateZ(4px)`;
  });
  document.addEventListener("pointerleave", reset);
}
function startBeatGlow() {
  const logo = document.querySelector(".brand img");
  if (!logo)
    return;
  let avg = 0;
  let glow = 0;
  let busy = false;
  setInterval(async () => {
    if (busy || document.hidden || !settings2.ui.motion)
      return;
    busy = true;
    const peak = Number(await api.call("audioPeak")) || 0;
    busy = false;
    avg = avg * 0.9 + peak * 0.1;
    const kick = Math.max(0, peak - avg * 1.15) * 3.2;
    glow = Math.max(glow * 0.72, Math.min(1, kick + peak * 0.35));
    logo.style.setProperty("--beat", glow.toFixed(3));
  }, 50);
}
function movePill() {
  const el2 = document.querySelector(".nav-item.on");
  const pill = document.getElementById("pill");
  const hidden = !!el2?.closest(".nav-fold.folded");
  pill.style.opacity = el2 && !hidden ? "" : "0";
  if (el2 && !hidden)
    pill.style.transform = `translateY(${el2.offsetTop}px)`;
}
function showPage(id, instant = false) {
  if (id === activePage)
    return;
  document.body.classList.toggle("chat-mode", id === "chat");
  const wrap = document.getElementById("page");
  const direction = pageOrder(id) >= pageOrder(activePage) ? 1 : -1;
  const old = built.get(activePage);
  let page = built.get(id);
  if (!page) {
    page = h("div", { class: "page" }, ...PAGES[pageOrder(id)].build());
    built.set(id, page);
  }
  activePage = id;
  document.querySelectorAll(".nav-item").forEach((el2) => {
    const on = el2.dataset.page === id;
    el2.classList.toggle("on", on);
    if (on) {
      el2.setAttribute("aria-current", "page");
    } else
      el2.removeAttribute("aria-current");
  });
  movePill();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const enter = () => {
    wrap.replaceChildren(page);
    wrap.scrollTop = 0;
    pageRefresh.get(id)?.();
    if (instant || reduced)
      return;
    page.animate([{ opacity: 0, transform: `translate3d(${direction * 18}px, 0, 0)` }, { opacity: 1, transform: "none" }], { duration: 300, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
  };
  if (old && !instant && !reduced) {
    const out = old.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translate3d(${direction * -12}px, 0, 0)` }], { duration: 90, easing: "ease-in", fill: "forwards" });
    let entered = false;
    const finish = () => {
      if (entered)
        return;
      entered = true;
      out.cancel();
      if (activePage === id)
        enter();
    };
    out.onfinish = finish;
    setTimeout(finish, 160);
  } else
    enter();
}
function wireNavDots() {
  document.querySelectorAll(".nav-item").forEach((el2) => {
    const page = PAGES.find((p) => p.id === el2.dataset.page);
    for (const path of page?.features ?? []) {
      const paint = () => el2.classList.toggle("active-feature", !!getPath(settings2, path));
      paint();
      watch(path, paint);
    }
  });
}
function setupTooltips() {
  const box = document.getElementById("tooltip");
  let timer = null;
  let target = null;
  const hide = () => {
    if (timer)
      clearTimeout(timer);
    target = null;
    box.classList.remove("show");
  };
  addEventListener("pointerover", (e) => {
    const next = e.target.closest?.("[data-tip]");
    if (next === target)
      return;
    hide();
    if (!next)
      return;
    target = next;
    timer = setTimeout(() => {
      if (!target?.isConnected)
        return;
      box.textContent = target.dataset.tip ?? "";
      const r = target.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      const x = Math.min(innerWidth - b.width - 12, Math.max(12, r.left));
      const below = r.bottom + 8 + b.height < innerHeight;
      box.style.left = `${x}px`;
      box.style.top = `${below ? r.bottom + 8 : r.top - b.height - 8}px`;
      box.classList.add("show");
    }, 380);
  }, { passive: true });
  addEventListener("pointerdown", hide, { passive: true });
  addEventListener("blur", hide);
}
async function start() {
  bootCore();
  const state = await api.get();
  settings2 = state.settings;
  live2 = state.live;
  version2 = state.version;
  media2 = state.media;
  lyrics2 = state.lyrics;
  discordStatus = state.discord;
  updateState = state.update;
  applyTheme();
  applyBackground();
  const nav = document.getElementById("nav");
  for (const [group, pages] of GROUPS) {
    const items = pages.map((page) => {
      const button = h("button", { class: "nav-item", onclick: () => showPage(page.id) }, icon(page.icon), page.title);
      button.dataset.page = page.id;
      return button;
    });
    if (!group) {
      nav.append(...items);
      continue;
    }
    const folded = () => settings2.ui.navFolded.includes(group);
    const box = h("div", { class: "nav-fold" }, h("div", { class: "nav-fold-inner" }, ...items));
    const header = h("button", { class: "nav-group", onclick: () => {
      set("ui.navFolded", folded() ? settings2.ui.navFolded.filter((g) => g !== group) : [...settings2.ui.navFolded, group]);
      paint();
      movePill();
      setTimeout(movePill, 300);
    } }, group, h("i", { class: "nav-chev" }));
    const paint = () => {
      header.classList.toggle("folded", folded());
      header.setAttribute("aria-expanded", String(!folded()));
      box.classList.toggle("folded", folded());
    };
    paint();
    nav.append(header, box);
  }
  discordUser2 = state.discordUser;
  mountWindowButtons();
  mountProfile();
  api.on("discordUser", (next) => {
    discordUser2 = next;
    if (settings2.profile.source === "discord")
      useDiscordProfile();
    profileListeners.forEach((fn) => fn());
  });
  if (settings2.app.intro && settings2.ui.motion && !matchMedia("(prefers-reduced-motion: reduce)").matches)
    playIntro();
  setupTooltips();
  startBeatGlow();
  setupTilt();
  syncPlugins();
  watch("plugins", () => void syncPlugins());
  for (const p of ["ui.glassPanels", "ui.background", "ui.panelOpacity"])
    watch(p, applyBackground);
  api.on("live", (next) => {
    live2 = next;
    liveListeners.forEach((fn) => fn());
  });
  api.on("media", (next) => {
    media2 = next;
    mediaListeners.forEach((fn) => fn());
  });
  api.on("lyrics", (next) => lyrics2 = next);
  api.on("changed", (path) => notify(path));
  const videoPlayback = (playing2) => {
    const video = document.querySelector("#bg video");
    if (!video)
      return;
    if (playing2 || !settings2.ui.pauseVideo)
      video.play().catch(() => {});
    else
      video.pause();
  };
  addEventListener("focus", () => videoPlayback(true));
  addEventListener("blur", () => videoPlayback(false));
  api.on("monitor", (m) => monitorListeners.forEach((fn) => fn(m)));
  api.on("discord", (next) => {
    discordStatus = next;
    discordListeners.forEach((fn) => fn());
  });
  api.on("update", (next) => {
    updateState = next;
    updateListeners.forEach((fn) => fn());
    document.querySelector('.nav-item[data-page="settings"]')?.classList.toggle("active-feature", ["available", "ready"].includes(next.status));
  });
  announcement2 = state.announcement;
  whatsNew2 = state.whatsNew;
  if (state.notice)
    setTimeout(() => toast(state.notice), 1200);
  api.on("announce", (next) => {
    announcement2 = next;
    announceListeners.forEach((fn) => fn());
  });
  api.on("whatsNew", (next) => {
    whatsNew2 = next;
    announceListeners.forEach((fn) => fn());
  });
  wireNavDots();
  showPage("home", true);
  if (state.recovered)
    toast("Ashlight closed unexpectedly last time. Your original settings were restored.");
}
function mountWindowButtons() {
  const left = document.getElementById("lights"), right = document.getElementById("lightsRight");
  left.replaceChildren();
  right.replaceChildren();
  const mac = settings2.app.windowButtons === "mac";
  const target = settings2.app.buttonsSide === "left" ? left : right;
  document.body.classList.toggle("buttons-left", settings2.app.buttonsSide === "left");
  const list = mac ? [["close", X, "Close", "close"], ["min", Minus, "Minimize", "minimize"], ["max", Maximize2, "Maximize", "maximize"]] : [["min", Minus, "Minimize", "minimize"], ["max", Square, "Maximize", "maximize"], ["close", X, "Close", "close"]];
  if (mac && target === right)
    list.reverse();
  for (const [id, ic, label, action] of list) {
    target.append(h("button", { class: `${mac ? "light" : "wbtn"} ${id}`, "aria-label": label, onclick: () => void api.call("windowAction", action) }, icon(ic)));
  }
  target.className = `lights ${mac ? "mac" : "win"}`;
}
var profileListeners = new Set;
function useDiscordProfile() {
  if (!discordUser2)
    return false;
  set("profile.name", discordUser2.name);
  set("profile.avatar", discordUser2.avatar);
  set("profile.source", "discord");
  profileListeners.forEach((fn) => fn());
  return true;
}
function avatarOf(size) {
  const img = h("img", { class: `avatar ${size}`, alt: "" });
  img.src = settings2.profile.avatar || "logo.png";
  img.addEventListener("error", () => img.src = "logo.png", { once: true });
  return img;
}
function mountProfile() {
  const button = document.getElementById("profile");
  const paint = () => {
    const p = settings2.profile;
    button.replaceChildren(p.name ? avatarOf("small") : h("span", { class: "avatar small empty" }, icon(UserRound)), h("span", { class: "profile-text" }, h("b", {}, p.name || "Sign in"), h("small", {}, p.source === "discord" ? "Discord" : p.name ? "On this PC" : "Optional")));
  };
  paint();
  profileListeners.add(paint);
  button.onclick = () => showPage("settings");
}
function accountCard() {
  const body = h("div", {});
  const nameInput = h("input", { class: "text", placeholder: "Your name", maxLength: 24, "aria-label": "Your name" });
  nameInput.addEventListener("change", () => {
    const name = nameInput.value.trim();
    set("profile.name", name);
    set("profile.source", name ? "local" : "none");
    set("profile.avatar", "");
    profileListeners.forEach((fn) => fn());
  });
  const paint = () => {
    const p = settings2.profile;
    nameInput.value = p.source === "local" ? p.name : "";
    const discordButton = h("button", { class: "btn primary", onclick: () => {
      if (!useDiscordProfile())
        toast("Open Discord, then try again.");
    } }, icon(Gamepad2), discordUser2 ? `Continue as ${discordUser2.name}` : "Sign in with Discord");
    body.replaceChildren(p.name ? h("div", { class: "account" }, avatarOf("big"), h("div", { class: "account-text" }, h("b", {}, p.name), h("small", {}, p.source === "discord" ? "Signed in with Discord" : "Name on this PC")), h("button", { class: "btn icon", "aria-label": "Sign out", tip: "Sign out", onclick: () => {
      set("profile.name", "");
      set("profile.avatar", "");
      set("profile.source", "none");
      profileListeners.forEach((fn) => fn());
    } }, icon(LogOut))) : h("div", { class: "stack" }, discordButton, h("div", { class: "or" }, "or"), nameInput));
  };
  paint();
  profileListeners.add(paint);
  return card("Account", UserRound, body);
}
function playIntro() {
  const word = h("b", {});
  const intro = h("div", { class: "intro" }, h("img", { src: "logo.png", alt: "" }), word);
  document.body.append(intro);
  document.body.classList.add("entering");
  let n = 0;
  const typing = setInterval(() => {
    word.textContent = "Ashlight".slice(0, ++n);
    if (n >= 5)
      clearInterval(typing);
  }, 70);
  setTimeout(() => {
    intro.classList.add("out");
    document.body.classList.remove("entering");
    document.body.classList.add("entered");
  }, 900);
  setTimeout(() => {
    intro.remove();
    document.body.classList.remove("entered");
  }, 1600);
}
start();
