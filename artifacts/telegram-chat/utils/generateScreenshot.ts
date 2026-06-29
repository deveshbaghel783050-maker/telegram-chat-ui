import { Message } from "@/context/ProfileContext";
import { RandomUser } from "./randomData";

// ─── Phone frame dimensions ───────────────────────────────────────────────────
const FRAME_W   = 432;  // total canvas width
const FRAME_H   = 940;  // total canvas height

// Bezel padding around screen
const BEZ_X     = 18;   // left/right bezel
const BEZ_TOP   = 44;   // top bezel (includes top edge + some)
const BEZ_BOT   = 24;   // bottom bezel
const FRAME_R   = 46;   // phone corner radius

// Screen area inside the frame
const SW = FRAME_W - BEZ_X * 2;       // 396
const SH = FRAME_H - BEZ_TOP - BEZ_BOT; // 872

// ─── Chat layout inside the screen ───────────────────────────────────────────
const STATUS_H = 28;
const HEADER_H = 70;
const INPUT_H  = 58;
const NAV_H    = 30;
const CHAT_TOP = STATUS_H + HEADER_H;
const CHAT_BOT = SH - INPUT_H - NAV_H;

// ─── Colors ──────────────────────────────────────────────────────────────────
const SENT_BG    = "#c8efaa";
const RECV_BG    = "#ffffff";
const SENT_TIME  = "#6a9a55";
const RECV_TIME  = "#aaaaaa";
const BUBBLE_SHD = "rgba(0,0,0,0.11)";

// ─── SVG pattern cache ────────────────────────────────────────────────────────
let _patternImgCache: HTMLImageElement | null = null;

function loadPatternImage(): Promise<HTMLImageElement | null> {
  if (_patternImgCache) return Promise.resolve(_patternImgCache);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload  = () => { _patternImgCache = img; resolve(img); };
    img.onerror = () => resolve(null);
    img.src = "/pattern.svg";
  });
}

// ─── Rounded rect path ───────────────────────────────────────────────────────
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

// ─── Draw phone frame ─────────────────────────────────────────────────────────
function drawPhoneFrame(ctx: CanvasRenderingContext2D) {
  // Outer phone body
  ctx.save();

  // Drop shadow under the whole phone
  ctx.shadowColor   = "rgba(0,0,0,0.45)";
  ctx.shadowBlur    = 28;
  ctx.shadowOffsetY = 10;
  ctx.shadowOffsetX = 0;

  // Phone body gradient (dark navy/black, slight blue tint like real phone)
  const bodyGrad = ctx.createLinearGradient(0, 0, FRAME_W, FRAME_H);
  bodyGrad.addColorStop(0,   "#1e2433");
  bodyGrad.addColorStop(0.4, "#1a1f2e");
  bodyGrad.addColorStop(1,   "#141822");
  ctx.fillStyle = bodyGrad;
  rrect(ctx, 0, 0, FRAME_W, FRAME_H, FRAME_R);
  ctx.fill();
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;

  // Inner thin bezel ring (slightly lighter)
  ctx.strokeStyle = "rgba(255,255,255,0.09)";
  ctx.lineWidth   = 1.5;
  rrect(ctx, 2, 2, FRAME_W - 4, FRAME_H - 4, FRAME_R - 2);
  ctx.stroke();

  // Side buttons — volume (left side)
  ctx.fillStyle = "#0e1220";
  rrect(ctx, 0, 130, 5, 36, 2);
  ctx.fill();
  rrect(ctx, 0, 176, 5, 36, 2);
  ctx.fill();

  // Power button (right side)
  rrect(ctx, FRAME_W - 5, 160, 5, 52, 2);
  ctx.fill();

  ctx.restore();
}

// ─── Clip to screen area ──────────────────────────────────────────────────────
function clipToScreen(ctx: CanvasRenderingContext2D) {
  rrect(ctx, BEZ_X, BEZ_TOP, SW, SH, 10);
  ctx.clip();
}

// ─── Draw camera notch pill (punch-hole) ─────────────────────────────────────
function drawCameraNotch(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.fillStyle = "#111827";
  const pw = 90, ph = 20, px = BEZ_X + (SW - pw) / 2, py = BEZ_TOP + 4;
  rrect(ctx, px, py, pw, ph, ph / 2);
  ctx.fill();

  // Camera dot inside pill
  ctx.fillStyle = "#1a2030";
  ctx.beginPath();
  ctx.arc(px + pw - 14, py + ph / 2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ─── Draw real SVG pattern ────────────────────────────────────────────────────
function drawPattern(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null) {
  if (!img) return;
  ctx.save();
  ctx.globalAlpha = 0.16;
  const scaleX = SW / 1440;
  const scaleY = SH / 2960;
  const scale  = Math.max(scaleX, scaleY);
  const dw = 1440 * scale;
  const dh = 2960 * scale;
  // offset relative to screen top-left
  ctx.drawImage(img, BEZ_X + (SW - dw) / 2, BEZ_TOP + (SH - dh) / 2, dw, dh);
  ctx.restore();
}

// ─── Helpers: translate (x,y) into screen-space ──────────────────────────────
// All drawing functions below use SX/SY to position inside the screen
const SX = BEZ_X;   // screen left
const SY = BEZ_TOP; // screen top

// ─── White pill ───────────────────────────────────────────────────────────────
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
  const times = ["5:55", "7:45", "8:12", "9:03", "10:24", "11:07", "6:14", "12:30"];
  const seed  = parseInt(phone.replace(/\D/g, "").slice(-2) || "0");
  const time  = times[seed % times.length];
  const ry    = SY;

  ctx.save();

  // Time left
  ctx.fillStyle = "#fff";
  ctx.font = "bold 13px -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(time, SX + 12, ry + STATUS_H / 2);

  // Phone number center (tiny)
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "8px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(phone, SX + SW / 2, ry + STATUS_H / 2);

  // Right icons
  const by = ry + STATUS_H / 2;

  // Battery
  ctx.strokeStyle = "#fff";
  ctx.lineWidth   = 1.2;
  ctx.strokeRect(SX + SW - 34, by - 6, 22, 12);
  ctx.strokeRect(SX + SW - 12, by - 3, 2.5, 6);
  ctx.fillStyle = "#fff";
  ctx.fillRect(SX + SW - 33, by - 5, 16, 10);

  // Signal bars
  const sbx = SX + SW - 42;
  [4, 7, 10, 13].forEach((h, i) => {
    ctx.fillRect(sbx - 16 + i * 5, by + 6 - h, 3.5, h);
  });

  // Wifi
  ctx.strokeStyle = "#fff";
  ctx.lineWidth   = 1.3;
  ctx.lineCap     = "round";
  const wx = sbx - 28;
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

// ─── Header ───────────────────────────────────────────────────────────────────
function drawHeader(ctx: CanvasRenderingContext2D, user: RandomUser) {
  const hy = SY + STATUS_H;
  const CY = hy + HEADER_H / 2;

  // Back circle
  const CR = 22;
  const CX = SX + 10;
  drawWhitePill(ctx, CX, CY - CR, CR * 2, CR * 2, CR);
  ctx.save();
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 17px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("←", CX + CR, CY);
  ctx.restore();

  // Right pill
  const RPW = 72, RPH = 46, RPX = SX + SW - RPW - 10;
  drawWhitePill(ctx, RPX, CY - RPH / 2, RPW, RPH, RPH / 2);
  ctx.save();
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("📞", RPX + 18, CY);
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = "#e0e0e0"; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(RPX + 36, CY - 11); ctx.lineTo(RPX + 36, CY + 11);
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⋮", RPX + 54, CY);
  ctx.restore();

  // Centre pill
  const LE  = CX + CR * 2 + 8;
  const RE  = RPX - 8;
  const CPW = RE - LE;
  const CPH = 50;
  drawWhitePill(ctx, LE, CY - CPH / 2, CPW, CPH, CPH / 2);

  // Avatar circle
  const AVR = 17;
  const AVX = LE + AVR + 7;
  ctx.save();
  const grad = ctx.createRadialGradient(AVX - 4, CY - 4, 2, AVX, CY, AVR);
  grad.addColorStop(0, user.avatarColor);
  grad.addColorStop(1, darken(user.avatarColor, -40));
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(AVX, CY, AVR, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 13px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(user.name.charAt(0).toUpperCase(), AVX, CY);
  ctx.restore();

  // Name + mute + last seen
  const TX = AVX + AVR + 9;
  ctx.save();
  ctx.fillStyle = "#0a0a0a";
  ctx.font = "bold 13.5px -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const nw = ctx.measureText(user.name).width;
  ctx.fillText(user.name, TX, CY - 4);
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#666";
  ctx.fillText("🔕", TX + nw + 4, CY - 4);

  const lsOpts = [
    "last seen recently",
    "last seen 2 hours ago",
    "last seen today at 1:30 PM",
    "last seen yesterday",
    "last seen Jun 26 at 10:11 AM",
  ];
  const lsi = Math.abs(parseInt(phone2seed(user.phone)) % lsOpts.length);
  ctx.font = "10.5px -apple-system, sans-serif";
  ctx.fillStyle = "#777";
  ctx.textBaseline = "top";
  ctx.fillText(lsOpts[lsi], TX, CY + 5);
  ctx.restore();
}

function phone2seed(p: string) { return p.replace(/\D/g, "").slice(-2) || "0"; }
function darken(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `rgb(${r},${g},${b})`;
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function bubblePath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, sent: boolean
) {
  const r = 15, tail = 4;
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
  ctx.font = "14.5px -apple-system,'Segoe UI',sans-serif";
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
  const SPAD = 11, VPAD = 7, MAX_W = SW - 40, LINE_H = 19, TIME_H = 15;
  const maxBW = Math.min(MAX_W * 0.78, 260);
  const isSent = msg.sent;

  ctx.font = "14.5px -apple-system,'Segoe UI',sans-serif";
  const lines = wrapText(ctx, msg.text, maxBW - SPAD * 2 - 44);

  ctx.font = "10.5px sans-serif";
  const timeW = ctx.measureText(msg.time).width + (isSent ? 18 : 0) + 6;

  ctx.font = "14.5px -apple-system,'Segoe UI',sans-serif";
  const maxLW  = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const bw     = Math.min(Math.max(maxLW + SPAD * 2 + 4, timeW + SPAD * 2), maxBW);
  const bh     = VPAD + lines.length * LINE_H + TIME_H + VPAD - 2;
  const bx     = isSent ? SX + SW - 10 - bw : SX + 10;

  ctx.save();
  ctx.shadowColor   = BUBBLE_SHD;
  ctx.shadowBlur    = 5;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = isSent ? SENT_BG : RECV_BG;
  bubblePath(ctx, bx, y, bw, bh, isSent);
  ctx.fill();
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;

  ctx.fillStyle = "#111";
  ctx.font = "14.5px -apple-system,'Segoe UI',sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  lines.forEach((l, i) => ctx.fillText(l, bx + SPAD, y + VPAD + i * LINE_H));

  if (msg.edited) {
    ctx.font = "italic 9.5px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText("edited", bx + SPAD, y + VPAD + lines.length * LINE_H);
  }

  const tY = y + bh - TIME_H;
  ctx.font = "10.5px sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle = isSent ? SENT_TIME : RECV_TIME;
  const tickOff = isSent ? 18 : 0;
  ctx.fillText(msg.time, bx + bw - SPAD - tickOff, tY + 2);

  if (isSent) {
    ctx.fillStyle = msg.read ? "#4fc3f7" : "#7aaa7a";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText("✓✓", bx + bw - SPAD + 2, tY + 2);
  }

  ctx.restore();
  return bh + 5;
}

// ─── Input bar ────────────────────────────────────────────────────────────────
function drawInputBar(ctx: CanvasRenderingContext2D) {
  const iy = SY + SH - INPUT_H - NAV_H;
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(SX, iy, SW, INPUT_H);
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth   = 0.5;
  ctx.beginPath(); ctx.moveTo(SX, iy); ctx.lineTo(SX + SW, iy); ctx.stroke();

  ctx.font = "19px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🙂", SX + 22, iy + INPUT_H / 2);

  ctx.fillStyle = "#f0f0f0";
  rrect(ctx, SX + 42, iy + 9, SW - 42 - 50, INPUT_H - 18, 20);
  ctx.fill();
  ctx.fillStyle = "#bbb";
  ctx.font = "13.5px -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("Message", SX + 58, iy + INPUT_H / 2);

  ctx.fillStyle = "#888";
  ctx.font = "18px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("📎", SX + SW - 38, iy + INPUT_H / 2);

  ctx.fillStyle = "#3390ec";
  ctx.shadowColor   = "rgba(51,144,236,0.3)";
  ctx.shadowBlur    = 8;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.arc(SX + SW - 15, iy + INPUT_H / 2, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
  ctx.fillStyle = "#fff";
  ctx.font = "13px sans-serif";
  ctx.fillText("🎤", SX + SW - 15, iy + INPUT_H / 2 + 1);

  ctx.restore();
}

// ─── Android nav bar ─────────────────────────────────────────────────────────
function drawNavBar(ctx: CanvasRenderingContext2D) {
  const ny = SY + SH - NAV_H;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(SX, ny, SW, NAV_H);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const mx = SX + SW / 2;
  ctx.fillText("≡",  mx - 90, ny + NAV_H / 2);
  ctx.fillText("○",  mx,      ny + NAV_H / 2);
  ctx.fillText("←",  mx + 90, ny + NAV_H / 2);
  ctx.restore();
}

// ─── Scroll button ────────────────────────────────────────────────────────────
function drawScrollBtn(ctx: CanvasRenderingContext2D) {
  const bx = SX + SW - 44;
  const by = SY + SH - INPUT_H - NAV_H - 48;
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.shadowColor   = "rgba(0,0,0,0.2)";
  ctx.shadowBlur    = 8;
  ctx.shadowOffsetY = 2;
  ctx.beginPath(); ctx.arc(bx, by, 16, 0, Math.PI * 2); ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#555";
  ctx.font = "bold 13px sans-serif";
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
  canvas.width  = FRAME_W;
  canvas.height = FRAME_H;
  const ctx = canvas.getContext("2d")!;

  // 1. Transparent / white background (outside the phone)
  ctx.clearRect(0, 0, FRAME_W, FRAME_H);

  // 2. Phone frame body
  drawPhoneFrame(ctx);

  // 3. Clip to screen area
  ctx.save();
  clipToScreen(ctx);

  // 4. Green gradient background (exact Telegram green)
  const bgGrad = ctx.createLinearGradient(SX, SY, SX, SY + SH);
  bgGrad.addColorStop(0,    "#b2d4a8");
  bgGrad.addColorStop(0.45, "#6aab6a");
  bgGrad.addColorStop(1,    "#4a8a4a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(SX, SY, SW, SH);

  // 5. Real SVG pattern
  const patternImg = await loadPatternImage();
  drawPattern(ctx, patternImg);

  // 6. Status bar
  drawStatusBar(ctx, user.phone);

  // 7. Header
  drawHeader(ctx, user);

  // 8. Messages
  let cursor = SY + CHAT_TOP + 8;
  const visibleMsgs = messages.slice(-10);
  for (const msg of visibleMsgs) {
    const mh = drawBubble(ctx, msg, cursor);
    cursor += mh;
    if (cursor > SY + CHAT_BOT - 10) break;
  }

  // 9. Scroll button
  drawScrollBtn(ctx);

  // 10. Input bar
  drawInputBar(ctx);

  // 11. Nav bar
  drawNavBar(ctx);

  ctx.restore(); // end screen clip

  // 12. Camera notch on top of everything
  drawCameraNotch(ctx);

  // 13. Screen glare overlay (top-left highlight to simulate glass)
  ctx.save();
  clipToScreen(ctx);
  const glare = ctx.createLinearGradient(SX, SY, SX + SW * 0.6, SY + SH * 0.35);
  glare.addColorStop(0,   "rgba(255,255,255,0.06)");
  glare.addColorStop(0.5, "rgba(255,255,255,0.01)");
  glare.addColorStop(1,   "rgba(255,255,255,0)");
  ctx.fillStyle = glare;
  ctx.fillRect(SX, SY, SW, SH);
  ctx.restore();

  return canvas.toDataURL("image/png");
}
