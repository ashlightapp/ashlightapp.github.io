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

// node_modules/lucide/dist/esm/icons/file-code.mjs
var FileCode = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5" }],
  ["path", { d: "M10 12.5 8 15l2 2.5" }],
  ["path", { d: "m14 12.5 2 2.5-2 2.5" }]
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

// node_modules/lucide/dist/esm/icons/moon.mjs
var Moon = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
    }
  ]
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

// node_modules/lucide/dist/esm/icons/zoom-in.mjs
var ZoomIn = [
  ["circle", { cx: "11", cy: "11", r: "8" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65" }],
  ["line", { x1: "11", x2: "11", y1: "8", y2: "14" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11" }]
];
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
          const px = cx + dx * i * size * 0.7, py = cy + dy * i * size * 0.7;
          fills.moveTo(px + t * 0.9, py);
          fills.arc(px, py, Math.max(1.2, t * 0.9), 0, Math.PI * 2);
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

// src/shared/controls.ts
var CHEVRON = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
var TICK = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
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
function dropdown(select) {
  const root = el("span", "dd-wrap");
  const button = el("button", "dd");
  button.type = "button";
  button.setAttribute("aria-haspopup", "listbox");
  button.setAttribute("aria-expanded", "false");
  const label = select.getAttribute("aria-label");
  if (label)
    button.setAttribute("aria-label", label);
  const text = el("span", "dd-text");
  const arrow = el("span", "dd-arrow");
  arrow.innerHTML = CHEVRON;
  button.append(text, arrow);
  select.style.display = "none";
  root.append(select, button);
  const paint = () => {
    text.textContent = select.selectedOptions[0]?.textContent ?? "";
  };
  watchValue(select, HTMLSelectElement.prototype, paint);
  new MutationObserver(paint).observe(select, { childList: true, subtree: true });
  paint();
  const open = () => {
    const pop = el("div", "dd-pop");
    pop.setAttribute("role", "listbox");
    const options = [...select.options];
    let active = Math.max(0, select.selectedIndex);
    const rows = options.map((option, i) => {
      const row = el("button", "dd-row");
      row.type = "button";
      row.setAttribute("role", "option");
      const name = el("span");
      name.textContent = option.textContent;
      const tick = el("i");
      tick.innerHTML = TICK;
      row.append(name, tick);
      row.classList.toggle("on", i === select.selectedIndex);
      row.setAttribute("aria-selected", String(i === select.selectedIndex));
      row.addEventListener("click", () => pick(i));
      row.addEventListener("pointermove", () => mark(i));
      pop.append(row);
      return row;
    });
    const mark = (i) => {
      active = i;
      rows.forEach((r, n) => r.classList.toggle("active", n === i));
    };
    const pick = (i) => {
      select.selectedIndex = i;
      paint();
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
      close();
      button.focus();
    };
    let typed = "", typedAt = 0;
    const onKey = (e) => {
      const move = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
      if (move) {
        e.preventDefault();
        mark(Math.max(0, Math.min(rows.length - 1, active + move)));
        rows[active]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pick(active);
      } else if (e.key.length === 1) {
        typed = Date.now() - typedAt < 700 ? typed + e.key.toLowerCase() : e.key.toLowerCase();
        typedAt = Date.now();
        const found = options.findIndex((o) => o.textContent.toLowerCase().startsWith(typed));
        if (found >= 0) {
          mark(found);
          rows[found]?.scrollIntoView({ block: "nearest" });
        }
      }
    };
    addEventListener("keydown", onKey, true);
    button.setAttribute("aria-expanded", "true");
    button.classList.add("open");
    const close = openPopup(pop, button, true, () => {
      removeEventListener("keydown", onKey, true);
      button.setAttribute("aria-expanded", "false");
      button.classList.remove("open");
    });
    mark(active);
    rows[active]?.scrollIntoView({ block: "center" });
  };
  button.addEventListener("click", () => button.classList.contains("open") ? closeOpen?.() : open());
  button.addEventListener("keydown", (e) => {
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !button.classList.contains("open")) {
      e.preventDefault();
      open();
    }
  });
  return root;
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

// website/site.ts
var $ = (id) => document.getElementById(id);
var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
var ICONS = {
  palette: Palette,
  "zoom-in": ZoomIn,
  crosshair: Crosshair,
  moon: Moon,
  "file-code": FileCode,
  "shield-check": ShieldCheck,
  rocket: Rocket,
  sparkles: Sparkles,
  "gamepad-2": Gamepad2,
  download: Download
};
function setupIcons() {
  document.querySelectorAll("[data-icon]").forEach((el2) => {
    const node = ICONS[el2.dataset.icon];
    if (!node)
      return;
    const svg = createElement(node);
    svg.classList.add("lucide");
    if (el2.tagName === "ARTICLE") {
      const box = document.createElement("span");
      box.className = "icon";
      box.append(svg);
      el2.prepend(box);
    } else
      el2.prepend(svg);
  });
}
function heroIntro() {
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("ready")));
}
function setupSpotlight() {
  document.querySelectorAll(".bento article, .download, .controls").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - box.left}px`);
      card.style.setProperty("--my", `${e.clientY - box.top}px`);
    });
  });
}
function setupApp() {
  const stage = $("stage"), win = $("stageWindow"), reopen = $("reopen");
  let frame = null;
  const load = () => {
    if (frame)
      return;
    frame = document.createElement("iframe");
    frame.title = "Ashlight, running live";
    frame.src = "demo/index.html";
    frame.allow = "clipboard-write";
    win.replaceChildren(frame);
  };
  win.innerHTML = '<div class="stage-load">Loading Ashlight</div>';
  new IntersectionObserver(([e]) => e?.isIntersecting && load(), { rootMargin: "400px" }).observe(stage);
  let pending = null;
  addEventListener("message", (e) => {
    if (e.origin !== location.origin || !e.data?.ttool)
      return;
    const d = e.data;
    if (typeof d.filter === "string") {
      const first = pending === null;
      pending = d.filter;
      if (first)
        requestAnimationFrame(() => {
          stage.style.filter = pending === "none" ? "" : pending;
          pending = null;
        });
    }
    if (d.compare === true)
      stage.style.filter = "";
    if (typeof d.glass === "boolean")
      stage.classList.toggle("glass", d.glass);
    if (d.window === "closed" || d.window === "minimized") {
      stage.classList.add("closed");
      reopen.hidden = false;
    }
    if (d.window === "maximize")
      stage.classList.toggle("maxed");
  });
  reopen.addEventListener("click", () => {
    stage.classList.remove("closed");
    reopen.hidden = true;
    frame?.contentWindow?.postMessage({ ttool: true, show: true }, location.origin);
  });
}
function setupTabs() {
  const tabs = [...$("tabs").querySelectorAll("button")];
  const pill = $("tabPill");
  const place = () => {
    const on = tabs.find((t) => t.getAttribute("aria-selected") === "true");
    if (!on)
      return;
    pill.style.width = `${on.offsetWidth}px`;
    pill.style.transform = `translateX(${on.offsetLeft}px)`;
  };
  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        $(t.dataset.panel).hidden = !on;
        $(t.dataset.panel).classList.add("in");
      });
      place();
      if (tab.dataset.panel === "p-cross")
        paintCross();
    });
  }
  place();
  addEventListener("resize", place);
  document.fonts?.ready.then(place);
}
function paintCross() {
  const canvas = $("crossCanvas");
  const box = canvas.getBoundingClientRect();
  if (box.width === 0)
    return;
  const scale = devicePixelRatio || 1;
  canvas.width = box.width * scale;
  canvas.height = box.height * scale;
  const value = (id) => $(id).value;
  drawReticle(canvas.getContext("2d"), canvas.width / 2, canvas.height / 2, {
    style: value("crossStyle"),
    color: value("crossColor"),
    size: Number(value("crossSize")),
    thickness: Number(value("crossThick")),
    gap: Number(value("crossGap")),
    opacity: 100,
    glow: Number(value("crossGlow")),
    outline: false,
    cover: 0,
    coverColor: "#000000"
  }, scale);
}
function setupCross() {
  for (const id of ["crossStyle", "crossColor", "crossSize", "crossThick", "crossGap", "crossGlow"]) {
    $(id).addEventListener("input", paintCross);
    $(id).addEventListener("change", paintCross);
  }
  new ResizeObserver(paintCross).observe($("crossCanvas"));
}
function setupColor() {
  const scene = $("landscape");
  const value = (id) => $(id).value;
  let queued = false;
  const apply = () => {
    if (queued)
      return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      scene.style.filter = `saturate(${value("fSat")}%) contrast(${value("fCon")}%) brightness(${value("fBri")}%) hue-rotate(${value("fHue")}deg)`;
    });
  };
  for (const id of ["fSat", "fCon", "fBri", "fHue"])
    $(id).addEventListener("input", apply);
}
function setupControls() {
  document.querySelectorAll(".controls select").forEach((s) => {
    const parent = s.parentElement;
    parent.append(dropdown(s));
  });
  document.querySelectorAll('.controls input[type="color"]').forEach((c) => c.parentElement.append(colorPicker(c)));
}
async function setupDownload(latest) {
  const button = $("dlButton");
  const meta = $("dlMeta");
  const file = latest?.file ?? "Ashlight-Setup.exe";
  const url = `updates/${file}`;
  button.href = url;
  button.setAttribute("download", file);
  let size = 0;
  try {
    size = Number((await fetch(url, { method: "HEAD", cache: "no-store" })).headers.get("content-length")) || 0;
  } catch {}
  meta.textContent = [latest ? `Version ${latest.version}` : "", size ? `${(size / 1048576).toFixed(1)} MB` : "", "Windows 10 and 11"].filter(Boolean).join("  ·  ");
  if (!latest)
    return;
  $("dlHash").textContent = latest.sha256;
  $("copyHash").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(latest.sha256);
    } catch {
      const area = document.createElement("textarea");
      area.value = latest.sha256;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    $("copyHash").textContent = "Copied";
    setTimeout(() => $("copyHash").textContent = "Copy", 1600);
  });
  if (!/Windows/i.test(navigator.userAgent) || /Phone|Android/i.test(navigator.userAgent))
    $("dlElsewhere").hidden = false;
}
function setupLog() {
  const el2 = (tag, cls, text = "") => Object.assign(document.createElement(tag), { className: cls, textContent: text });
  const points = (notes) => notes.split(/(?<=[.!])\s+(?=[A-Z0-9])/).map((x) => x.trim()).filter(Boolean);
  const list = (notes) => {
    const ul = el2("ul", "points");
    for (const p of points(notes))
      ul.append(el2("li", "", p));
    return ul;
  };
  const date = (iso) => {
    const d = new Date(`${iso}T12:00:00`);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };
  fetch("changelog.json", { cache: "no-store" }).then((r) => r.json()).then((entries) => {
    const log = $("log");
    const older = el2("div", "older");
    entries.forEach((entry, i) => {
      const row = el2("details", i === 0 ? "release latest" : "release");
      row.open = i === 0;
      const summary = el2("summary", "");
      const head = el2("span", "head");
      head.append(el2("b", "badge", `v${entry.version}`), el2("time", "date", date(entry.date)));
      if (i === 0)
        head.append(el2("i", "tag", "Latest"));
      summary.append(el2("span", "node"), head, el2("span", "gist", points(entry.notes)[0] ?? ""), el2("span", "chev"));
      const body = el2("div", "body");
      body.append(list(entry.notes));
      row.append(summary, body);
      (i <= 4 ? log : older).append(row);
    });
    if (older.childElementCount) {
      const more = el2("button", "more", `Show ${older.childElementCount} older releases`);
      more.type = "button";
      more.addEventListener("click", () => {
        more.replaceWith(older);
      });
      log.append(more);
    }
  }).catch(() => {});
}
function setupAnnouncement() {
  fetch("announce.json", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((a) => {
    if (!a?.site || !a.title)
      return;
    const bar = $("announce");
    const title = document.createElement("b");
    title.textContent = a.title;
    bar.append(title);
    if (a.text)
      bar.append(document.createTextNode(a.text));
    if (a.url && /^https:\/\//.test(a.url)) {
      const link = document.createElement("a");
      link.href = a.url;
      link.rel = "noopener";
      link.textContent = "Open";
      bar.append(link);
    }
    bar.hidden = false;
  }).catch(() => {});
}
function setupNav() {
  const nav = $("nav"), pill = $("navPill"), button = $("menuButton");
  const links = [...nav.querySelectorAll("a")];
  const mark = (link) => {
    links.forEach((l) => l.classList.toggle("on", l === link));
    if (!link || innerWidth <= 760) {
      pill.style.opacity = "0";
      return;
    }
    pill.style.opacity = "1";
    pill.style.width = `${link.offsetWidth}px`;
    pill.style.transform = `translateX(${link.offsetLeft}px)`;
  };
  const sections = links.map((l) => document.querySelector(l.hash));
  const spy = () => {
    document.body.classList.toggle("scrolled", scrollY > 12);
    let current = null;
    sections.forEach((s, i) => {
      if (s && s.getBoundingClientRect().top < innerHeight * 0.4)
        current = links[i];
    });
    mark(current);
  };
  addEventListener("scroll", spy, { passive: true });
  addEventListener("resize", spy);
  spy();
  const close = () => {
    document.body.classList.remove("menu-open");
    button.setAttribute("aria-expanded", "false");
  };
  button.addEventListener("click", () => {
    const open = !document.body.classList.contains("menu-open");
    document.body.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", String(open));
  });
  links.forEach((l) => l.addEventListener("click", close));
}
function setupReveal() {
  const items = [...document.querySelectorAll(".reveal")];
  items.forEach((el2) => {
    if (el2.parentElement?.classList.contains("bento"))
      el2.style.setProperty("--d", `${[...el2.parentElement.children].indexOf(el2) % 4 * 70}ms`);
  });
  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((el2) => el2.classList.add("in"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    for (const e of entries)
      if (e.isIntersecting) {
        e.target.classList.add("in");
        observer.unobserve(e.target);
      }
  }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
  items.forEach((el2) => observer.observe(el2));
}
setupIcons();
startSmoke($("smoke"), { tint: () => [0.86, 0.88, 0.92], strength: 0.42 });
heroIntro();
setupApp();
setupTabs();
setupControls();
setupCross();
setupSpotlight();
setupColor();
setupLog();
setupAnnouncement();
setupReveal();
setupNav();
fetch("updates/latest.json", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).catch(() => null).then((latest) => {
  if (latest)
    $("version").textContent = `v${latest.version}`;
  setupDownload(latest);
});
