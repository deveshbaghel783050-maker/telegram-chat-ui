import { Message } from "@/context/ProfileContext";
import { RandomUser } from "./randomData";

// ─── Canvas dimensions (exact phone screen) ───────────────────────────────────
const W = 390;
const H = 844;

// ─── Layout ───────────────────────────────────────────────────────────────────
const STATUS_H = 28;
const HEADER_H = 72;
const INPUT_H  = 58;
const NAV_H    = 30;
const CHAT_TOP = STATUS_H + HEADER_H;
const CHAT_BOT = H - INPUT_H - NAV_H;

// ─── Colors ───────────────────────────────────────────────────────────────────
const SENT_BG   = "#c8efaa";
const RECV_BG   = "#ffffff";
const SENT_TIME = "#6aaa55";
const RECV_TIME = "#aaaaaa";

// ─── SVG pattern cache ────────────────────────────────────────────────────────
let _patternCache: HTMLImageElement | null = null;

function loadPattern(): Promise<HTMLImageElement | null> {
  if (_patternCache) return Promise.resolve(_patternCache);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload  = () => { _patternCache = img; resolve(img); };
    img.onerror = () => resolve(null);
    img.src = "/pattern.svg";
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function rrect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  const R = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + R, y);
  ctx.lineTo(x + w - R, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + R);
  ctx.lineTo(x + w, y + h - R);
  ctx.quadraticCurveTo(x + w, y + h, x + w - R, y + h);
  ctx.lineTo(x + R, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - R);
  ctx.lineTo(x, y + R);
  ctx.quadraticCurveTo(x, y, x + R, y);
  ctx.closePath();
}

function whitePill(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.save();
  ctx.shadowColor   = "rgba(0,0,0,0.15)";
  ctx.shadowBlur    = 8;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = "#ffffff";
  rrect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.restore();
}

function phone2seed(phone: string): string {
  return phone.replace(/\D/g, "").slice(-2) || "0";
}

function darken(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `rgb(${r},${g},${b})`;
}

// ─── Status bar ───────────────────────────────────────────────────────────────
function drawStatusBar(ctx: CanvasRenderingContext2D, phone: string) {
  const times = ["5:55", "6:14", "7:45", "8:12", "9:03", "10:24", "11:07", "12:30"];
  const seed  = parseInt(phone2seed(phone));
  const time  = times[seed % times.length];

  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 13.5px -apple-system,sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(time, 12, STATUS_H / 2);

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "8px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(phone, W / 2, STATUS_H / 2);

  const by = STATUS_H / 2;

  // Battery
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(W - 34, by - 6, 22, 12);
  ctx.strokeRect(W - 12, by - 3, 2.5, 6);
  ctx.fillRect(W - 33, by - 5, 17, 10);

  // Signal bars
  const sbx = W - 42;
  [4, 7, 10, 13].forEach((bh, i) => {
    ctx.fillRect(sbx - 18 + i * 5, by + 6 - bh, 3.5, bh);
  });

  // Wifi
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.3;
  ctx.lineCap = "round";
  const wx = sbx - 30;
  [5, 9, 13].forEach((r2, i) => {
    ctx.globalAlpha = i < 2 ? 0.5 : 1;
    ctx.beginPath();
    ctx.arc(wx, by + 5, r2, Math.PI * 1.25, Math.PI * 1.75);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(wx, by + 5, 2, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ─── Header ───────────────────────────────────────────────────────────────────
function drawHeader(ctx: CanvasRenderingContext2D, user: RandomUser) {
  const hy = STATUS_H;
  const CY = hy + HEADER_H / 2;

  // Back circle
  const CR = 23;
  const backX = 10;
  whitePill(ctx, backX, CY - CR, CR * 2, CR * 2, CR);
  ctx.save();
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("←", backX + CR, CY);
  ctx.restore();

  // Right pill
  const RPW = 78, RPH = 48;
  const RPX = W - RPW - 10;
  whitePill(ctx, RPX, CY - RPH / 2, RPW, RPH, RPH / 2);

  ctx.save();
  ctx.font = "17px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("📞", RPX + 20, CY);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "#ddd"; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(RPX + 40, CY - 12); ctx.lineTo(RPX + 40, CY + 12);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#111";
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⋮", RPX + 59, CY);
  ctx.restore();

  // Centre pill
  const LE  = backX + CR * 2 + 8;
  const RE  = RPX - 8;
  const CPW = RE - LE;
  const CPH = 52;
  whitePill(ctx, LE, CY - CPH / 2, CPW, CPH, CPH / 2);

  // Avatar
  const AVR = 18;
  const AVX = LE + AVR + 8;
  ctx.save();
  const grad = ctx.createRadialGradient(AVX - 4, CY - 4, 2, AVX, CY, AVR);
  grad.addColorStop(0, user.avatarColor);
  grad.addColorStop(1, darken(user.avatarColor, -40));
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(AVX, CY, AVR, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px -apple-system,sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(user.name.charAt(0).toUpperCase(), AVX, CY);
  ctx.restore();

  // Name + mute + last seen
  const TX = AVX + AVR + 9;
  ctx.save();
  ctx.fillStyle = "#0a0a0a";
  ctx.font = "bold 14px -apple-system,sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(user.name, TX, CY - 3);
  const nw = ctx.measureText(user.name).width;
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#666";
  ctx.fillText("🔕", TX + nw + 4, CY - 3);

  const lsOpts = [
    "last seen recently",
    "last seen 2 hours ago",
    "last seen today at 1:30 PM",
    "last seen yesterday",
    "last seen Jun 26 at 10:11 AM",
  ];
  const lsi = Math.abs(parseInt(phone2seed(user.phone)) % lsOpts.length);
  ctx.font = "10.5px -apple-system,sans-serif";
  ctx.fillStyle = "#888";
  ctx.textBaseline = "top";
  ctx.fillText(lsOpts[lsi], TX, CY + 6);
  ctx.restore();
}

// ─── Bubble path ─────────────────────────────────────────────────────────────
function bubblePath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, sent: boolean
) {
  const r = 16, tail = 4;
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
  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawBubble(
  ctx: CanvasRenderingContext2D,
  msg: Message,
  y: number
): number {
  const SPAD = 12, VPAD = 8, LINE_H = 20, TIME_H = 16;
  const maxBW = 260;

  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  const lines = wrapText(ctx, msg.text, maxBW - SPAD * 2 - 40);

  ctx.font = "11px sans-serif";
  const timeW = ctx.measureText(msg.time).width + (msg.sent ? 18 : 0) + 4;
  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  const maxLW = Math.max(...lines.map(l => ctx.measureText(l).width));
  const bw    = Math.min(Math.max(maxLW + SPAD * 2 + 4, timeW + SPAD * 2), maxBW);
  const bh    = VPAD + lines.length * LINE_H + TIME_H + VPAD - 2;
  const bx    = msg.sent ? W - 10 - bw : 10;

  ctx.save();
  ctx.shadowColor   = "rgba(0,0,0,0.10)";
  ctx.shadowBlur    = 5;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = msg.sent ? SENT_BG : RECV_BG;
  bubblePath(ctx, bx, y, bw, bh, msg.sent);
  ctx.fill();
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;

  ctx.fillStyle = "#111";
  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  lines.forEach((l, i) => ctx.fillText(l, bx + SPAD, y + VPAD + i * LINE_H));

  if (msg.edited) {
    ctx.font = "italic 9.5px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText("edited", bx + SPAD, y + VPAD + lines.length * LINE_H);
  }

  const tY = y + bh - TIME_H;
  ctx.font = "11px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle = msg.sent ? SENT_TIME : RECV_TIME;
  const tickOff = msg.sent ? 18 : 0;
  ctx.fillText(msg.time, bx + bw - SPAD - tickOff, tY + 2);

  if (msg.sent) {
    ctx.fillStyle = msg.read ? "#4fc3f7" : "#8ab88a";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText("✓✓", bx + bw - SPAD + 2, tY + 2);
  }

  ctx.restore();
  return bh + 6;
}

// ─── Input bar ────────────────────────────────────────────────────────────────
function drawInputBar(ctx: CanvasRenderingContext2D) {
  const iy = H - INPUT_H - NAV_H;
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, iy, W, INPUT_H);
  ctx.strokeStyle = "#e8e8e8";
  ctx.lineWidth   = 0.5;
  ctx.beginPath(); ctx.moveTo(0, iy); ctx.lineTo(W, iy); ctx.stroke();

  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🙂", 24, iy + INPUT_H / 2);

  ctx.fillStyle = "#f0f0f0";
  rrect(ctx, 46, iy + 10, W - 46 - 50, INPUT_H - 20, 20);
  ctx.fill();
  ctx.fillStyle = "#bbb";
  ctx.font = "14px -apple-system,sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("Message", 62, iy + INPUT_H / 2);

  ctx.fillStyle = "#999";
  ctx.font = "19px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("📎", W - 38, iy + INPUT_H / 2);

  // Blue mic button (Telegram style)
  ctx.fillStyle = "#3390ec";
  ctx.shadowColor   = "rgba(51,144,236,0.35)";
  ctx.shadowBlur    = 8;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.arc(W - 16, iy + INPUT_H / 2, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
  ctx.fillStyle = "#fff";
  ctx.font = "13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🎤", W - 16, iy + INPUT_H / 2 + 1);

  ctx.restore();
}

// ─── Nav bar ─────────────────────────────────────────────────────────────────
function drawNavBar(ctx: CanvasRenderingContext2D) {
  const ny = H - NAV_H;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.fillRect(0, ny, W, NAV_H);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("≡",  W / 2 - 90, ny + NAV_H / 2);
  ctx.fillText("○",  W / 2,      ny + NAV_H / 2);
  ctx.fillText("←",  W / 2 + 90, ny + NAV_H / 2);
  ctx.restore();
}

// ─── Scroll button ────────────────────────────────────────────────────────────
function drawScrollBtn(ctx: CanvasRenderingContext2D) {
  const bx = W - 44;
  const by = H - INPUT_H - NAV_H - 48;
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.shadowColor   = "rgba(0,0,0,0.18)";
  ctx.shadowBlur    = 8;
  ctx.shadowOffsetY = 2;
  ctx.beginPath(); ctx.arc(bx, by, 16, 0, Math.PI * 2); ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#555";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("∨", bx, by + 1);
  ctx.restore();
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function generateChatScreenshot(
  user: RandomUser,
  messages: Message[],
  _myName: string
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // 1. Green gradient — exact Telegram green
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0,    "#b2d4a8");
  bgGrad.addColorStop(0.45, "#6aab6a");
  bgGrad.addColorStop(1,    "#4a8a4a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Real SVG doodle pattern (from /pattern.svg)
  const pat = await loadPattern();
  if (pat) {
    ctx.save();
    ctx.globalAlpha = 0.16;
    const scaleX = W / 1440;
    const scaleY = H / 2960;
    const scale  = Math.max(scaleX, scaleY);
    const dw = 1440 * scale, dh = 2960 * scale;
    ctx.drawImage(pat, (W - dw) / 2, (H - dh) / 2, dw, dh);
    ctx.restore();
  }

  // 3. Status bar
  drawStatusBar(ctx, user.phone);

  // 4. Header (pill-style exactly like reference)
  drawHeader(ctx, user);

  // 5. Messages
  let cursor = CHAT_TOP + 8;
  const visible = messages.slice(-10);
  for (const msg of visible) {
    const mh = drawBubble(ctx, msg, cursor);
    cursor += mh;
    if (cursor > CHAT_BOT - 10) break;
  }

  // 6. Scroll button
  drawScrollBtn(ctx);

  // 7. Input bar
  drawInputBar(ctx);

  // 8. Nav bar
  drawNavBar(ctx);

  return canvas.toDataURL("image/png");
}
