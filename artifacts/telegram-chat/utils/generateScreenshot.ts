import { Message } from "@/context/ProfileContext";
import { RandomUser } from "./randomData";

// ─── Canvas dimensions (Android phone screenshot ratio) ─────────────────────
const W = 390;
const H = 844;
const STATUS_H = 24;
const HEADER_H = 62;
const INPUT_H = 62;
const NAV_H = 36;
const CHAT_TOP = STATUS_H + HEADER_H;
const CHAT_BOT = H - INPUT_H - NAV_H;

// ─── Colors ─────────────────────────────────────────────────────────────────
const SENT_BG   = "#d4f5b8";
const RECV_BG   = "#ffffff";
const SENT_TIME = "#7ab65a";
const RECV_TIME = "#aaaaaa";
const TICK_COLOR = "#4fc3f7";   // blue double tick
const BUBBLE_SHADOW = "rgba(0,0,0,0.12)";
const GREEN_HEADER = "#4a8a4a";

// ─── Load the Telegram doodle pattern from /pattern.svg ─────────────────────
let _patternCache: HTMLImageElement | null | "loading" = null;
async function loadPattern(): Promise<HTMLImageElement | null> {
  if (_patternCache instanceof HTMLImageElement) return _patternCache;
  if (_patternCache === "loading") return null;
  _patternCache = "loading";
  try {
    const resp = await fetch("/pattern.svg");
    if (!resp.ok) { _patternCache = null; return null; }
    const text = await resp.text();
    const blob = new Blob([text], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    await new Promise<void>((res) => {
      img.onload  = () => res();
      img.onerror = () => res();
      img.src = url;
    });
    URL.revokeObjectURL(url);
    _patternCache = img.complete && img.naturalWidth > 0 ? img : null;
    return _patternCache;
  } catch {
    _patternCache = null;
    return null;
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function bubblePath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  sent: boolean
) {
  const r = 16;
  const tail = 4; // sharp corner (tail side)
  const tl = sent ? r : tail;
  const tr = sent ? tail : r;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  ctx.font = "15px -apple-system, 'Segoe UI', sans-serif";
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Draw simple decorative shapes when SVG pattern fails to load
function drawFallbackPattern(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.globalAlpha = 0.10;
  ctx.strokeStyle = "#2a5a2a";
  ctx.lineWidth = 1.2;
  ctx.fillStyle = "#2a5a2a";

  const seed = 42;
  function seeded(i: number) { return ((seed * 1664525 + i * 1013904223) & 0xffffffff) / 0xffffffff; }

  for (let i = 0; i < 60; i++) {
    const px = seeded(i * 3) * W;
    const py = seeded(i * 3 + 1) * H;
    const type = Math.floor(seeded(i * 3 + 2) * 4);
    const size = 8 + seeded(i) * 10;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(seeded(i * 7) * Math.PI * 2);
    if (type === 0) {
      // star
      ctx.beginPath();
      for (let p = 0; p < 5; p++) {
        const a = (p * 4 * Math.PI) / 5 - Math.PI / 2;
        const b = (p * 4 * Math.PI) / 5 + (2 * Math.PI) / 5 - Math.PI / 2;
        ctx[p === 0 ? "moveTo" : "lineTo"](Math.cos(a) * size, Math.sin(a) * size);
        ctx.lineTo(Math.cos(b) * size * 0.4, Math.sin(b) * size * 0.4);
      }
      ctx.closePath();
      ctx.stroke();
    } else if (type === 1) {
      // circle
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.stroke();
    } else if (type === 2) {
      // leaf
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.8, -size * 0.2, 0, size * 0.6);
      ctx.quadraticCurveTo(-size * 0.8, -size * 0.2, 0, -size);
      ctx.stroke();
    } else {
      // heart-ish
      ctx.beginPath();
      ctx.moveTo(0, size * 0.3);
      ctx.bezierCurveTo(-size * 0.6, -size * 0.2, -size * 0.6, -size * 0.8, 0, -size * 0.3);
      ctx.bezierCurveTo(size * 0.6, -size * 0.8, size * 0.6, -size * 0.2, 0, size * 0.3);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
}

// ─── Status bar (Android style) ──────────────────────────────────────────────
function drawStatusBar(ctx: CanvasRenderingContext2D, phoneNumber: string) {
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Phone number (tiny, top center, like carrier label)
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(phoneNumber, W / 2, 10);
  ctx.restore();

  // Time on left
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(time, 10, STATUS_H - 5);
  ctx.restore();

  // Right side icons: wifi + battery
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.font = "11px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("WiFi 🔋10", W - 8, STATUS_H - 5);
  ctx.restore();
}

// ─── Telegram header ─────────────────────────────────────────────────────────
function drawHeader(ctx: CanvasRenderingContext2D, user: RandomUser) {
  const y = STATUS_H;
  const cx = W / 2;

  // Semi-transparent header tint
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(0, y, W, HEADER_H);
  ctx.restore();

  // ── Back button (white rounded rect) ────────────────────────────────
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.shadowColor = BUBBLE_SHADOW;
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  drawRoundRect(ctx, 8, y + 11, 36, 36, 18);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#333";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("←", 26, y + 29);
  ctx.restore();

  // ── Avatar circle ───────────────────────────────────────────────────
  const AVA_R = 18;
  const AVA_X = 56;
  const AVA_Y = y + 29;
  ctx.save();
  ctx.shadowColor = BUBBLE_SHADOW;
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;
  // Dark gradient for avatar (like a real profile photo look)
  const grad = ctx.createRadialGradient(AVA_X - 4, AVA_Y - 4, 2, AVA_X, AVA_Y, AVA_R);
  grad.addColorStop(0, user.avatarColor);
  grad.addColorStop(1, "#1a1a1a");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(AVA_X, AVA_Y, AVA_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  // White initial letter
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(user.name.charAt(0).toUpperCase(), AVA_X, AVA_Y);
  ctx.restore();

  // ── Name + status ───────────────────────────────────────────────────
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 15px -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(user.name, 80, y + 24);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "12px sans-serif";
  ctx.fillText("last seen recently", 80, y + 42);
  ctx.restore();

  // ── Mute icon ───────────────────────────────────────────────────────
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const nameW = ctx.measureText(user.name).width;
  ctx.fillText("🔕", 80 + nameW + 4, y + 22);
  ctx.restore();

  // ── Right icons: phone + three dots ─────────────────────────────────
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.font = "19px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Phone icon (white circle)
  ctx.shadowColor = BUBBLE_SHADOW;
  ctx.shadowBlur = 4;
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.arc(W - 52, y + 29, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#fff";
  ctx.font = "16px sans-serif";
  ctx.fillText("📞", W - 52, y + 30);
  // Three dots
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("⋮", W - 22, y + 30);
  ctx.restore();
}

// ─── Draw a single message bubble ────────────────────────────────────────────
function drawBubble(
  ctx: CanvasRenderingContext2D,
  msg: Message,
  x: number, y: number
): number {
  const SIDE_PAD = 12;
  const VERT_PAD = 8;
  const MAX_W   = 258;
  const LINE_H  = 20;
  const TIME_H  = 16;

  const isSent = msg.sent;

  ctx.font = "15px -apple-system, 'Segoe UI', sans-serif";
  const lines = wrapText(ctx, msg.text, MAX_W - SIDE_PAD * 2 - 44);

  // Measure time string width
  ctx.font = "11px sans-serif";
  const timeStr  = msg.time;
  const timeW    = ctx.measureText(timeStr).width + (isSent ? 22 : 0) + 4;

  // Figure out bubble width
  ctx.font = "15px -apple-system, 'Segoe UI', sans-serif";
  const textW = Math.max(
    ...lines.map((l) => ctx.measureText(l).width),
    timeW
  );
  const bubbleW = Math.min(Math.max(textW + SIDE_PAD * 2, timeW + SIDE_PAD * 2 + 8), MAX_W);
  const bubbleH = VERT_PAD + lines.length * LINE_H + TIME_H + VERT_PAD - 4;

  const bx = isSent ? W - 12 - bubbleW : 12;
  const by = y;

  // Shadow
  ctx.save();
  ctx.shadowColor = BUBBLE_SHADOW;
  ctx.shadowBlur  = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = isSent ? SENT_BG : RECV_BG;
  bubblePath(ctx, bx, by, bubbleW, bubbleH, isSent);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur  = 0;

  // Message text
  ctx.fillStyle = "#000";
  ctx.font = "15px -apple-system, 'Segoe UI', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  lines.forEach((line, i) => {
    ctx.fillText(line, bx + SIDE_PAD, by + VERT_PAD + i * LINE_H);
  });

  // Edited label (if applicable)
  const hasEdited = msg.edited;
  if (hasEdited) {
    ctx.font = "italic 10px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText("edited", bx + SIDE_PAD, by + VERT_PAD + lines.length * LINE_H);
  }

  // Timestamp inside bubble (bottom-right)
  const timeY = by + bubbleH - TIME_H;
  ctx.font = "11px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle = isSent ? SENT_TIME : RECV_TIME;
  const tickOffset = isSent ? 20 : 0;
  ctx.fillText(timeStr, bx + bubbleW - SIDE_PAD - tickOffset, timeY + 2);

  // Blue double checkmarks for sent messages
  if (isSent) {
    ctx.fillStyle = TICK_COLOR;
    ctx.font      = "bold 12px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("✓✓", bx + bubbleW - SIDE_PAD + 2, timeY + 1);
  }

  ctx.restore();
  return bubbleH + 6; // return height consumed (bubble + gap)
}

// ─── Input bar ───────────────────────────────────────────────────────────────
function drawInputBar(ctx: CanvasRenderingContext2D) {
  const iy = H - INPUT_H - NAV_H;

  // White background
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, iy, W, INPUT_H);

  // Emoji icon (left)
  ctx.font = "22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🙂", 22, iy + INPUT_H / 2);

  // Gray input field
  ctx.fillStyle = "#f0f0f0";
  drawRoundRect(ctx, 46, iy + 10, W - 46 - 58, INPUT_H - 20, 22);
  ctx.fill();
  ctx.fillStyle = "#bbb";
  ctx.font      = "14px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Message", 62, iy + INPUT_H / 2);

  // Paperclip icon
  ctx.fillStyle = "#888";
  ctx.font      = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("📎", W - 46, iy + INPUT_H / 2);

  // Blue circle mic button
  ctx.fillStyle = "#3390ec";
  ctx.shadowColor = "rgba(51,144,236,0.4)";
  ctx.shadowBlur  = 8;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.arc(W - 20, iy + INPUT_H / 2, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle   = "#fff";
  ctx.font        = "16px sans-serif";
  ctx.fillText("🎤", W - 20, iy + INPUT_H / 2 + 1);

  ctx.restore();
}

// ─── Android nav bar ─────────────────────────────────────────────────────────
function drawNavBar(ctx: CanvasRenderingContext2D) {
  const ny = H - NAV_H;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(0, ny, W, NAV_H);
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font      = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("≡",    W / 2 - 100, ny + NAV_H / 2);
  ctx.fillText("○",    W / 2,        ny + NAV_H / 2);
  ctx.fillText("←",    W / 2 + 100, ny + NAV_H / 2);
  ctx.restore();
}

// ─── Scroll-to-bottom button ─────────────────────────────────────────────────
function drawScrollBtn(ctx: CanvasRenderingContext2D) {
  const bx = W - 52;
  const by = H - INPUT_H - NAV_H - 54;
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.shadowColor = BUBBLE_SHADOW;
  ctx.shadowBlur  = 8;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.arc(bx, by, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle   = "#555";
  ctx.font        = "bold 16px sans-serif";
  ctx.textAlign   = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⌄", bx, by + 1);
  ctx.restore();
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function generateChatScreenshot(
  user: RandomUser,
  messages: Message[],
  _myName: string
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // 1. Green gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0,   "#c5deba");
  bgGrad.addColorStop(0.4, "#6aab6a");
  bgGrad.addColorStop(1,   "#4a8a4a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Pattern overlay
  const patternImg = await loadPattern();
  if (patternImg) {
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.drawImage(patternImg, 0, 0, W, H);
    ctx.restore();
  } else {
    drawFallbackPattern(ctx);
  }

  // 3. Status bar
  drawStatusBar(ctx, user.phone);

  // 4. Header
  drawHeader(ctx, user);

  // 5. Messages — draw bottom-up so most recent are at the bottom
  const visibleMsgs = messages.slice(-9);
  let cursor = CHAT_TOP + 8;
  for (const msg of visibleMsgs) {
    const h = drawBubble(ctx, msg, 0, cursor);
    cursor += h;
    if (cursor > CHAT_BOT - 20) break;
  }

  // 6. Scroll button
  drawScrollBtn(ctx);

  // 7. Input bar
  drawInputBar(ctx);

  // 8. Android nav bar
  drawNavBar(ctx);

  return canvas.toDataURL("image/png");
}
