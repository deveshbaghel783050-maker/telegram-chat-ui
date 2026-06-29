import { Message } from "@/context/ProfileContext";
import { RandomUser } from "./randomData";

// ─── Canvas dimensions ────────────────────────────────────────────────────────
const W = 390;
const H = 844;
const STATUS_H = 28;
const HEADER_H = 70;
const INPUT_H  = 58;
const NAV_H    = 32;
const CHAT_TOP = STATUS_H + HEADER_H;
const CHAT_BOT = H - INPUT_H - NAV_H;

// ─── Colors ───────────────────────────────────────────────────────────────────
const SENT_BG   = "#d4f5b8";
const RECV_BG   = "#ffffff";
const SENT_TIME = "#7ab65a";
const RECV_TIME = "#aaaaaa";
const BUBBLE_SHD = "rgba(0,0,0,0.13)";

// ─── Load the real Telegram SVG pattern from static web folder ────────────────
let _patternImageCache: HTMLImageElement | null = null;

function loadPatternImage(): Promise<HTMLImageElement | null> {
  if (_patternImageCache) return Promise.resolve(_patternImageCache);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload  = () => { _patternImageCache = img; resolve(img); };
    img.onerror = () => resolve(null);
    // The web/ folder is served at the root in Expo web
    img.src = "/pattern.svg";
  });
}

// ─── Draw real SVG pattern on canvas ─────────────────────────────────────────
function drawPattern(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null) {
  if (!img) return;
  ctx.save();
  ctx.globalAlpha = 0.16;
  // SVG viewBox is 1440x2960; scale to cover our 390x844 canvas
  const scaleX = W / 1440;
  const scaleY = H / 2960;
  const scale  = Math.max(scaleX, scaleY);
  const dw = 1440 * scale;
  const dh = 2960 * scale;
  ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  ctx.restore();
}

// ─── Rounded rect helper ──────────────────────────────────────────────────────
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

// ─── White pill with shadow ───────────────────────────────────────────────────
function drawWhitePill(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.save();
  ctx.shadowColor   = "rgba(0,0,0,0.18)";
  ctx.shadowBlur    = 8;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = "#ffffff";
  rrect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.restore();
}

// ─── Status bar ───────────────────────────────────────────────────────────────
function drawStatusBar(ctx: CanvasRenderingContext2D, phone: string) {
  const times = ["7:45", "8:12", "9:03", "10:24", "11:07", "6:14", "5:55", "12:30"];
  const seed  = parseInt(phone.replace(/\D/g, "").slice(-2) || "0");
  const time  = times[seed % times.length];

  ctx.save();

  // Time — left
  ctx.fillStyle = "#fff";
  ctx.font = "bold 13.5px -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(time, 10, STATUS_H / 2);

  // Phone number — centre (small, dim)
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "8px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(phone, W / 2, STATUS_H / 2);

  // Right — battery rect
  const by = STATUS_H / 2;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth   = 1.2;
  ctx.strokeRect(W - 32, by - 6, 22, 12);
  ctx.strokeRect(W - 10, by - 3, 2.5, 6);
  ctx.fillStyle = "#fff";
  ctx.fillRect(W - 31, by - 5, 16, 10);

  // Signal bars
  const sbx = W - 40;
  [4, 7, 10, 13].forEach((h, i) => {
    ctx.fillRect(sbx - 18 + i * 5, by + 6 - h, 3.5, h);
  });

  // WiFi arcs
  ctx.strokeStyle = "#fff";
  ctx.lineWidth   = 1.3;
  ctx.lineCap     = "round";
  const wx = sbx - 30;
  [5, 9, 13].forEach((r2, i) => {
    ctx.globalAlpha = i < 2 ? 0.5 : 1;
    ctx.beginPath();
    ctx.arc(wx, by + 5, r2, Math.PI * 1.25, Math.PI * 1.75);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.arc(wx, by + 5, 2, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ─── Header — exact pill style ────────────────────────────────────────────────
function drawHeader(ctx: CanvasRenderingContext2D, user: RandomUser) {
  const hy = STATUS_H;
  const CY = hy + HEADER_H / 2;

  // ── Back button: white circle ─────────────────────────────────────────────
  const CR = 24;
  const CX = 10;
  drawWhitePill(ctx, CX, CY - CR, CR * 2, CR * 2, CR);
  ctx.save();
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("←", CX + CR, CY);
  ctx.restore();

  // ── Right pill: phone + divider + three-dots ──────────────────────────────
  const RPW = 76, RPH = 48, RPX = W - RPW - 10;
  drawWhitePill(ctx, RPX, CY - RPH / 2, RPW, RPH, RPH / 2);

  ctx.save();
  ctx.font = "17px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("📞", RPX + 19, CY);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(RPX + 38, CY - 12); ctx.lineTo(RPX + 38, CY + 12);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⋮", RPX + 57, CY);
  ctx.restore();

  // ── Centre pill: avatar + name + mute + last seen ─────────────────────────
  const LE   = CX + CR * 2 + 8;
  const RE   = RPX - 8;
  const CPW  = RE - LE;
  const CPH  = 52;
  drawWhitePill(ctx, LE, CY - CPH / 2, CPW, CPH, CPH / 2);

  // Avatar circle
  const AVR = 18;
  const AVX = LE + AVR + 7;
  ctx.save();
  const grad = ctx.createRadialGradient(AVX - 4, CY - 4, 2, AVX, CY, AVR);
  grad.addColorStop(0, user.avatarColor);
  grad.addColorStop(1, adjustColor(user.avatarColor, -40));
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(AVX, CY, AVR, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(user.name.charAt(0).toUpperCase(), AVX, CY);
  ctx.restore();

  // Name + mute icon
  const TX = AVX + AVR + 9;
  ctx.save();
  ctx.fillStyle = "#0a0a0a";
  ctx.font = "bold 14.5px -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const nameW = ctx.measureText(user.name).width;
  ctx.fillText(user.name, TX, CY - 3);
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#666";
  ctx.fillText("🔕", TX + nameW + 4, CY - 3);

  // Last seen
  const lastSeenOptions = [
    "last seen recently",
    "last seen 2 hours ago",
    "last seen today at 1:30 PM",
    "last seen yesterday",
    "last seen Jun 26 at 10:11 AM",
  ];
  const lsIdx = Math.abs(parseInt(phone2seed(user.phone)) % lastSeenOptions.length);
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillStyle = "#777";
  ctx.textBaseline = "top";
  ctx.fillText(lastSeenOptions[lsIdx], TX, CY + 5);
  ctx.restore();
}

function phone2seed(phone: string): string {
  const d = phone.replace(/\D/g, "");
  return d.slice(-2) || "0";
}

// ─── Darken/lighten hex ───────────────────────────────────────────────────────
function adjustColor(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}

// ─── Bubble path ──────────────────────────────────────────────────────────────
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

// ─── Text wrap ────────────────────────────────────────────────────────────────
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

// ─── Message bubble ───────────────────────────────────────────────────────────
function drawBubble(
  ctx: CanvasRenderingContext2D,
  msg: Message,
  y: number
): number {
  const SPAD = 11, VPAD = 7, MAX_W = 260, LINE_H = 20, TIME_H = 16;
  const isSent = msg.sent;

  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  const lines = wrapText(ctx, msg.text, MAX_W - SPAD * 2 - 46);

  ctx.font = "11px sans-serif";
  const timeW = ctx.measureText(msg.time).width + (isSent ? 20 : 0) + 6;

  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  const maxLineW = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const bubbleW  = Math.min(Math.max(maxLineW + SPAD * 2 + 4, timeW + SPAD * 2), MAX_W);
  const bubbleH  = VPAD + lines.length * LINE_H + TIME_H + VPAD - 2;
  const bx = isSent ? W - 10 - bubbleW : 10;

  ctx.save();
  ctx.shadowColor   = BUBBLE_SHD;
  ctx.shadowBlur    = 5;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = isSent ? SENT_BG : RECV_BG;
  bubblePath(ctx, bx, y, bubbleW, bubbleH, isSent);
  ctx.fill();
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;

  ctx.fillStyle = "#111";
  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  lines.forEach((line, i) => ctx.fillText(line, bx + SPAD, y + VPAD + i * LINE_H));

  if (msg.edited) {
    ctx.font = "italic 10px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText("edited", bx + SPAD, y + VPAD + lines.length * LINE_H);
  }

  const tY = y + bubbleH - TIME_H;
  ctx.font = "11px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle = isSent ? SENT_TIME : RECV_TIME;
  const tickOff = isSent ? 20 : 0;
  ctx.fillText(msg.time, bx + bubbleW - SPAD - tickOff, tY + 2);

  if (isSent) {
    ctx.fillStyle = msg.read ? "#4fc3f7" : "#8ab88a";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText("✓✓", bx + bubbleW - SPAD + 2, tY + 2);
  }

  ctx.restore();
  return bubbleH + 5;
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
  ctx.fillText("🙂", 22, iy + INPUT_H / 2);

  ctx.fillStyle = "#f0f0f0";
  rrect(ctx, 42, iy + 9, W - 42 - 52, INPUT_H - 18, 20);
  ctx.fill();
  ctx.fillStyle = "#bbb";
  ctx.font = "14px -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("Message", 58, iy + INPUT_H / 2);

  ctx.fillStyle = "#888";
  ctx.font = "19px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("📎", W - 40, iy + INPUT_H / 2);

  ctx.fillStyle = "#3390ec";
  ctx.shadowColor   = "rgba(51,144,236,0.35)";
  ctx.shadowBlur    = 8;
  ctx.shadowOffsetY = 2;
  ctx.beginPath(); ctx.arc(W - 17, iy + INPUT_H / 2, 17, 0, Math.PI * 2); ctx.fill();
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
  ctx.fillStyle = "#fff";
  ctx.font = "14px sans-serif";
  ctx.fillText("🎤", W - 17, iy + INPUT_H / 2 + 1);

  ctx.restore();
}

// ─── Android nav bar ─────────────────────────────────────────────────────────
function drawNavBar(ctx: CanvasRenderingContext2D) {
  const ny = H - NAV_H;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.fillRect(0, ny, W, NAV_H);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "15px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("≡", W / 2 - 95, ny + NAV_H / 2);
  ctx.fillText("○", W / 2,      ny + NAV_H / 2);
  ctx.fillText("←", W / 2 + 95, ny + NAV_H / 2);
  ctx.restore();
}

// ─── Scroll button ────────────────────────────────────────────────────────────
function drawScrollBtn(ctx: CanvasRenderingContext2D) {
  const bx = W - 46, by = H - INPUT_H - NAV_H - 50;
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.shadowColor   = "rgba(0,0,0,0.18)";
  ctx.shadowBlur    = 8;
  ctx.shadowOffsetY = 2;
  ctx.beginPath(); ctx.arc(bx, by, 17, 0, Math.PI * 2); ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#555";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⌄", bx, by + 1);
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

  // 1. Green gradient background — exactly matching the reference screenshot
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0,    "#b2d4a8");
  bgGrad.addColorStop(0.45, "#6aab6a");
  bgGrad.addColorStop(1,    "#4a8a4a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Real Telegram SVG pattern (from /pattern.svg static file)
  const patternImg = await loadPatternImage();
  drawPattern(ctx, patternImg);

  // 3. Status bar
  drawStatusBar(ctx, user.phone);

  // 4. Header (pill style)
  drawHeader(ctx, user);

  // 5. Messages
  let cursor = CHAT_TOP + 8;
  const visibleMsgs = messages.slice(-10);
  for (const msg of visibleMsgs) {
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
