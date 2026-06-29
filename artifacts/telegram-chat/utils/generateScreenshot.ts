import { Message } from "@/context/ProfileContext";
import { RandomUser } from "./randomData";

const W = 390;
const H = 844;

const STATUS_H = 28;
const HEADER_H = 72;
const INPUT_H  = 62;
const NAV_H    = 32;
const CHAT_TOP = STATUS_H + HEADER_H;
const CHAT_BOT = H - INPUT_H - NAV_H;

const SENT_BG   = "#c8efaa";
const RECV_BG   = "#ffffff";
const SENT_TIME = "#6aaa55";
const RECV_TIME = "#aaaaaa";

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

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

function whitePill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.save();
  ctx.shadowColor   = "rgba(0,0,0,0.13)";
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

// ─── Geometric icon helpers ───────────────────────────────────────────────────

function iconArrowBack(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const s = size * 0.42;
  ctx.beginPath();
  ctx.moveTo(cx + s, cy - s);
  ctx.lineTo(cx - s * 0.3, cy);
  ctx.lineTo(cx + s, cy + s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.3, cy);
  ctx.lineTo(cx + s * 1.1, cy);
  ctx.stroke();
  ctx.restore();
}

function iconPhone(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const s = size * 0.38;
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.9, cy - s * 0.2);
  ctx.quadraticCurveTo(cx - s, cy - s, cx - s * 0.3, cy - s * 1.1);
  ctx.quadraticCurveTo(cx, cy - s * 1.3, cx + s * 0.1, cy - s * 0.8);
  ctx.lineTo(cx - s * 0.1, cy - s * 0.5);
  ctx.quadraticCurveTo(cx + s * 0.5, cy, cx + s * 0.8, cy - s * 0.1);
  ctx.lineTo(cx + s * 1.1, cy - s * 0.3);
  ctx.quadraticCurveTo(cx + s * 1.3, cy, cx + s * 1.1, cy + s * 0.3);
  ctx.quadraticCurveTo(cx + s, cy + s * 0.9, cx + s * 0.2, cy + s);
  ctx.quadraticCurveTo(cx - s * 0.5, cy + s * 1.1, cx - s, cy + s * 0.5);
  ctx.stroke();
  ctx.restore();
}

function iconThreeDots(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  [-7, 0, 7].forEach((dy) => {
    ctx.beginPath();
    ctx.arc(cx, cy + dy, 2.2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function iconMute(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  const s = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, s, -Math.PI * 0.75, Math.PI * 0.75);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - s);
  ctx.lineTo(cx, cy + s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 1.5, cy + s + 2);
  ctx.lineTo(cx + 1.5, cy + s + 2);
  ctx.stroke();
  ctx.strokeStyle = "#e53935";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(cx - s * 1.2, cy - s * 0.8);
  ctx.lineTo(cx + s * 1.2, cy + s * 0.8);
  ctx.stroke();
  ctx.restore();
}

function iconSmiley(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx - r * 0.3, cy - r * 0.2, 1.2, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
  ctx.beginPath(); ctx.arc(cx + r * 0.3, cy - r * 0.2, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy + r * 0.1, r * 0.5, 0, Math.PI); ctx.stroke();
  ctx.restore();
}

function iconPaperclip(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.7;
  ctx.lineCap = "round";
  const s = 7;
  ctx.beginPath();
  ctx.moveTo(cx + s * 0.5, cy - s * 0.7);
  ctx.arcTo(cx + s, cy - s * 0.2, cx + s, cy + s * 0.3, s * 0.5);
  ctx.arcTo(cx + s, cy + s * 0.8, cx + s * 0.5, cy + s, s * 0.5);
  ctx.lineTo(cx - s * 0.5, cy + s * 0.7);
  ctx.arcTo(cx - s, cy + s * 0.2, cx - s, cy - s * 0.3, s * 0.5);
  ctx.arcTo(cx - s, cy - s * 1.2, cx, cy - s * 1.2, s * 0.8);
  ctx.arcTo(cx + s * 0.5, cy - s * 1.2, cx + s * 0.5, cy - s * 0.7, s * 0.5);
  ctx.stroke();
  ctx.restore();
}

function iconMic(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  const mw = 4, mh = 7, mr = 2;
  rrect(ctx, cx - mw / 2, cy - mh - 2, mw, mh, mr);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy - 2, mw + 2, 0, Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy + mw);
  ctx.lineTo(cx, cy + mw + 3);
  ctx.moveTo(cx - 3, cy + mw + 3);
  ctx.lineTo(cx + 3, cy + mw + 3);
  ctx.stroke();
  ctx.restore();
}

function iconNavSquares(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  const s = 4, gap = 2;
  [[-s - gap / 2, -s - gap / 2], [gap / 2, -s - gap / 2], [-s - gap / 2, gap / 2], [gap / 2, gap / 2]].forEach(([dx, dy]) => {
    ctx.strokeRect(cx + dx, cy + dy, s, s);
  });
  ctx.restore();
}

function iconNavHome(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const s = 7;
  ctx.beginPath();
  ctx.moveTo(cx - s, cy + s * 0.3);
  ctx.lineTo(cx, cy - s * 0.7);
  ctx.lineTo(cx + s, cy + s * 0.3);
  ctx.moveTo(cx - s * 0.6, cy + s * 0.3);
  ctx.lineTo(cx - s * 0.6, cy + s);
  ctx.lineTo(cx + s * 0.6, cy + s);
  ctx.lineTo(cx + s * 0.6, cy + s * 0.3);
  ctx.stroke();
  ctx.restore();
}

function iconNavBack(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const s = 6;
  ctx.beginPath();
  ctx.moveTo(cx + s, cy - s * 0.7);
  ctx.lineTo(cx - s * 0.4, cy);
  ctx.lineTo(cx + s, cy + s * 0.7);
  ctx.stroke();
  ctx.restore();
}

// ─── Status bar ───────────────────────────────────────────────────────────────
function drawStatusBar(ctx: CanvasRenderingContext2D, phone: string) {
  const times = ["5:55", "6:14", "7:45", "8:12", "9:03", "10:24", "11:07", "12:30"];
  const seed  = parseInt(phone2seed(phone));
  const time  = times[seed % times.length];

  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 13px -apple-system,sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(time, 14, STATUS_H / 2);

  const by = STATUS_H / 2;

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(phone, W / 2, by);

  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(W - 34, by - 5.5, 20, 11);
  ctx.beginPath(); ctx.arc(W - 14, by, 1.5, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  ctx.fillRect(W - 33, by - 4.5, 15, 9);

  const sbx = W - 42;
  [4, 6, 9, 12].forEach((bh, i) => {
    ctx.globalAlpha = i < 2 ? 0.5 : 1;
    ctx.fillRect(sbx - 16 + i * 5, by + 6 - bh, 3.5, bh);
  });
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.3;
  ctx.lineCap = "round";
  const wx = sbx - 28;
  [5, 9, 13].forEach((r2, i) => {
    ctx.globalAlpha = i === 0 ? 0.4 : i === 1 ? 0.65 : 1;
    ctx.beginPath();
    ctx.arc(wx, by + 5, r2, Math.PI * 1.2, Math.PI * 1.8);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.arc(wx, by + 5, 1.8, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ─── Header ───────────────────────────────────────────────────────────────────
function drawHeader(ctx: CanvasRenderingContext2D, user: RandomUser) {
  const hy = STATUS_H;
  const CY = hy + HEADER_H / 2;

  const CR = 23;
  const backX = 10;
  whitePill(ctx, backX, CY - CR, CR * 2, CR * 2, CR);
  iconArrowBack(ctx, backX + CR, CY, CR * 2, "#1a1a1a");

  const RPW = 82, RPH = 48;
  const RPX = W - RPW - 10;
  whitePill(ctx, RPX, CY - RPH / 2, RPW, RPH, RPH / 2);
  iconPhone(ctx, RPX + 22, CY, 20, "#1a1a1a");

  ctx.save();
  ctx.strokeStyle = "#e0e0e0"; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(RPX + 42, CY - 12); ctx.lineTo(RPX + 42, CY + 12);
  ctx.stroke();
  ctx.restore();

  iconThreeDots(ctx, RPX + 62, CY, "#1a1a1a");

  const LE  = backX + CR * 2 + 8;
  const RE  = RPX - 8;
  const CPW = RE - LE;
  const CPH = 52;
  whitePill(ctx, LE, CY - CPH / 2, CPW, CPH, CPH / 2);

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

  const TX = AVX + AVR + 9;
  ctx.save();
  ctx.fillStyle = "#0a0a0a";
  ctx.font = "bold 14px -apple-system,sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(user.name, TX, CY - 7);

  iconMute(ctx, TX + ctx.measureText(user.name).width + 14, CY - 7, "#888");

  const lsOpts = [
    "last seen recently",
    "last seen 2 hours ago",
    "last seen today at 1:30 PM",
    "last seen yesterday",
    "last seen Jun 26 at 10:11 AM",
  ];
  const lsi = Math.abs(parseInt(phone2seed(user.phone)) % lsOpts.length);
  ctx.font = "11px -apple-system,sans-serif";
  ctx.fillStyle = "#888";
  ctx.textBaseline = "middle";
  ctx.fillText(lsOpts[lsi], TX, CY + 8);
  ctx.restore();
}

// ─── Bubble path ──────────────────────────────────────────────────────────────
function bubblePath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, sent: boolean) {
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

function iconDoubleCheck(ctx: CanvasRenderingContext2D, x: number, y: number, read: boolean) {
  ctx.save();
  ctx.strokeStyle = read ? "#4fc3f7" : "#8ab88a";
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  [[x, y], [x + 4, y]].forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy + 3);
    ctx.lineTo(cx + 3, cy + 6);
    ctx.lineTo(cx + 7, cy);
    ctx.stroke();
  });
  ctx.restore();
}

function drawBubble(ctx: CanvasRenderingContext2D, msg: Message, y: number): number {
  const SPAD = 12, VPAD = 8, LINE_H = 20, TIME_H = 16;
  const maxBW = 260;

  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  const lines = wrapText(ctx, msg.text, maxBW - SPAD * 2 - 40);

  ctx.font = "11px sans-serif";
  const timeW = ctx.measureText(msg.time).width + (msg.sent ? 22 : 0) + 4;
  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  const maxLW = Math.max(...lines.map(l => ctx.measureText(l).width));
  const bw = Math.min(Math.max(maxLW + SPAD * 2 + 4, timeW + SPAD * 2), maxBW);
  const bh = VPAD + lines.length * LINE_H + TIME_H + VPAD - 2;
  const bx = msg.sent ? W - 10 - bw : 10;

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

  const tY = y + bh - TIME_H;
  ctx.font = "11px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle = msg.sent ? SENT_TIME : RECV_TIME;
  const tickOff = msg.sent ? 20 : 0;
  ctx.fillText(msg.time, bx + bw - SPAD - tickOff, tY + 2);

  if (msg.sent) {
    iconDoubleCheck(ctx, bx + bw - SPAD - 16, tY + 2, !!msg.read);
  }

  ctx.restore();
  return bh + 6;
}

// ─── Input bar ────────────────────────────────────────────────────────────────
function drawInputBar(ctx: CanvasRenderingContext2D) {
  const iy    = H - INPUT_H - NAV_H;
  const CY    = iy + INPUT_H / 2;
  const PAD   = 10;
  const PILL_H = 48;
  const MIC_R  = 22;
  const MIC_CX = W - PAD - MIC_R;

  ctx.save();

  const pillW = MIC_CX - MIC_R - 6 - PAD;
  whitePill(ctx, PAD, CY - PILL_H / 2, pillW, PILL_H, PILL_H / 2);

  iconSmiley(ctx, PAD + 22, CY, 10, "#8a8a8a");

  ctx.fillStyle = "#b0b0b0";
  ctx.font = "15px -apple-system,'Segoe UI',sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("Message", PAD + 42, CY);

  iconPaperclip(ctx, PAD + pillW - 22, CY, "#8a8a8a");

  ctx.fillStyle = "#3390ec";
  ctx.shadowColor   = "rgba(51,144,236,0.4)";
  ctx.shadowBlur    = 10;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.arc(MIC_CX, CY, MIC_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;

  iconMic(ctx, MIC_CX, CY + 1, "#ffffff");

  ctx.restore();
}

// ─── Nav bar ─────────────────────────────────────────────────────────────────
function drawNavBar(ctx: CanvasRenderingContext2D) {
  const ny = H - NAV_H;
  const CY = ny + NAV_H / 2;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(0, ny, W, NAV_H);

  const iconColor = "rgba(255,255,255,0.6)";
  iconNavSquares(ctx, W / 2 - 90, CY, iconColor);
  ctx.strokeStyle = iconColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(W / 2, CY, 7, 0, Math.PI * 2); ctx.stroke();
  iconNavBack(ctx, W / 2 + 90, CY, iconColor);

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

  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0,    "#b2d4a8");
  bgGrad.addColorStop(0.45, "#6aab6a");
  bgGrad.addColorStop(1,    "#4a8a4a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  const pat = await loadPattern();
  if (pat) {
    ctx.save();
    ctx.globalAlpha = 0.16;
    const scale = Math.max(W / 1440, H / 2960);
    const dw = 1440 * scale, dh = 2960 * scale;
    ctx.drawImage(pat, (W - dw) / 2, (H - dh) / 2, dw, dh);
    ctx.restore();
  }

  drawStatusBar(ctx, user.phone);
  drawHeader(ctx, user);

  let cursor = CHAT_TOP + 8;
  const visible = messages.slice(-10);
  for (const msg of visible) {
    const mh = drawBubble(ctx, msg, cursor);
    cursor += mh;
    if (cursor > CHAT_BOT - 10) break;
  }

  drawInputBar(ctx);
  drawNavBar(ctx);

  return canvas.toDataURL("image/png");
}
