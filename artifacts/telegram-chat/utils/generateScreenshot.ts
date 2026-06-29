import { Message } from "@/context/ProfileContext";
// @ts-ignore
import html2canvas from "html2canvas";
import { RandomUser } from "./randomData";

const W = 390;
const H = 844;

const STATUS_H = 0;   // No status bar in automation screenshots
const HEADER_H = 72;
const INPUT_H  = 62;
const NAV_H    = 32;

// ─── Time seed per user ───────────────────────────────────────────────────────
const TIMES = ["5:55", "6:14", "7:45", "8:12", "9:03", "10:24", "11:07", "12:30"];
function seedTime(phone: string): string {
  const d = parseInt(phone.replace(/\D/g, "").slice(-2) || "0");
  return TIMES[d % TIMES.length];
}

const LAST_SEEN = [
  "last seen recently",
  "last seen 2 hours ago",
  "last seen today at 1:30 PM",
  "last seen yesterday",
  "last seen Jun 26 at 10:11 AM",
];
function seedLastSeen(phone: string): string {
  const d = Math.abs(parseInt(phone.replace(/\D/g, "").slice(-2) || "0"));
  return LAST_SEEN[d % LAST_SEEN.length];
}

// ─── Inline SVG icons (matching @expo/vector-icons used in /chat) ─────────────

const SVG_ARROW_BACK = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.5 5L7.5 11L13.5 17" stroke="#1a1a1a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="7.5" y1="11" x2="18.5" y2="11" stroke="#1a1a1a" stroke-width="2.2" stroke-linecap="round"/>
</svg>`;

const SVG_PHONE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.67 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.43 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
</svg>`;

const SVG_THREE_DOTS = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#1a1a1a" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="5"  r="1.5"/>
  <circle cx="12" cy="12" r="1.5"/>
  <circle cx="12" cy="19" r="1.5"/>
</svg>`;

const SVG_VOLUME_OFF = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <line x1="23" y1="9" x2="17" y2="15" stroke="#e53935" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="17" y1="9" x2="23" y2="15" stroke="#e53935" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const SVG_SMILEY = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="13" cy="13" r="11" stroke="#8a8a8a" stroke-width="1.7"/>
  <circle cx="9.5" cy="10.5" r="1.4" fill="#8a8a8a"/>
  <circle cx="16.5" cy="10.5" r="1.4" fill="#8a8a8a"/>
  <path d="M8.5 15.5 Q13 19.5 17.5 15.5" stroke="#8a8a8a" stroke-width="1.7" stroke-linecap="round" fill="none"/>
</svg>`;

const SVG_PAPERCLIP = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
</svg>`;

const SVG_MIC = `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="9" y="2" width="6" height="11" rx="3" fill="white"/>
  <path d="M5 10a7 7 0 0 0 14 0" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="12" y1="19" x2="12" y2="23" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="8" y1="23" x2="16" y2="23" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const SVG_CHECK_DONE_READ = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 12l5 5L18 5" stroke="#3390ec" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7 12l5 5L23 5" stroke="#3390ec" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const SVG_CHECK_DONE_UNREAD = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 12l5 5L18 5" stroke="#8ab88a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7 12l5 5L23 5" stroke="#8ab88a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// ─── Status bar HTML ──────────────────────────────────────────────────────────
function buildStatusBar(phone: string): string {
  const time = seedTime(phone);
  return `
    <div style="position:absolute;top:0;left:0;right:0;height:${STATUS_H}px;display:flex;align-items:center;padding:0 14px;box-sizing:border-box;">
      <span style="color:#fff;font-size:13px;font-weight:700;font-family:'Inter_700Bold','Inter',sans-serif;">${time}</span>
    </div>`;
}

// ─── Header HTML ──────────────────────────────────────────────────────────────
function buildHeader(user: RandomUser): string {
  const initial = user.name.charAt(0).toUpperCase();
  const lastSeen = seedLastSeen(user.phone);
  return `
    <div style="position:absolute;top:${STATUS_H}px;left:0;right:0;height:${HEADER_H}px;display:flex;align-items:center;padding:0 10px;gap:8px;box-sizing:border-box;">

      <!-- Back circle -->
      <div style="width:48px;height:48px;border-radius:24px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,0.13);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        ${SVG_ARROW_BACK}
      </div>

      <!-- Center pill -->
      <div style="flex:1;display:flex;align-items:center;background:#fff;border-radius:999px;padding:8px 14px 8px 8px;gap:10px;min-height:52px;box-shadow:0 1px 4px rgba(0,0,0,0.13);box-sizing:border-box;overflow:hidden;">
        <!-- Avatar -->
        <div style="width:36px;height:36px;border-radius:18px;background:${user.avatarColor};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="color:#fff;font-size:16px;font-weight:700;font-family:'Inter_700Bold','Inter',sans-serif;">${initial}</span>
        </div>
        <!-- Name + status -->
        <div style="flex:1;overflow:hidden;">
          <div style="display:flex;align-items:center;">
            <span style="font-size:15px;font-weight:700;color:#0a0a0a;font-family:'Inter_700Bold','Inter',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${user.name}</span>
          </div>
          <div style="font-size:12px;color:#777;font-family:'Inter_400Regular','Inter',sans-serif;margin-top:1px;">${lastSeen}</div>
        </div>
      </div>

      <!-- Right pill -->
      <div style="display:flex;align-items:center;background:#fff;border-radius:999px;padding:10px 6px;box-shadow:0 1px 4px rgba(0,0,0,0.13);">
        <div style="padding:2px 8px;display:flex;align-items:center;">${SVG_PHONE}</div>
        <div style="width:1px;height:18px;background:#e0e0e0;margin:0 2px;"></div>
        <div style="padding:2px 8px;display:flex;align-items:center;">${SVG_THREE_DOTS}</div>
      </div>

    </div>`;
}

// ─── Message bubble HTML ──────────────────────────────────────────────────────
function buildBubble(msg: Message): string {
  const sentBg   = "#dcf8c6";
  const recvBg   = "#ffffff";
  const bg       = msg.sent ? sentBg : recvBg;
  const timeCol  = msg.sent ? "#6a9a6a" : "#999";
  const br       = msg.sent
    ? "border-radius:18px;border-bottom-right-radius:4px;"
    : "border-radius:18px;border-bottom-left-radius:4px;";
  const align    = msg.sent ? "flex-end" : "flex-start";
  const tick     = msg.sent
    ? (msg.read ? SVG_CHECK_DONE_READ : SVG_CHECK_DONE_UNREAD)
    : "";

  const textHtml = msg.text
    ? `<div style="font-size:15px;line-height:20px;color:#0a0a0a;font-family:'Inter_400Regular','Inter',sans-serif;word-break:break-word;">${escHtml(msg.text)}</div>`
    : "";

  return `
    <div style="display:flex;justify-content:${align};padding:1px 8px;box-sizing:border-box;">
      <div style="max-width:82%;background:${bg};${br}padding:7px 10px 5px 10px;box-shadow:0 1px 2px rgba(0,0,0,0.08);box-sizing:border-box;">
        ${textHtml}
        <div style="display:flex;justify-content:flex-end;align-items:center;gap:2px;margin-top:2px;">
          <span style="font-size:11px;color:${timeCol};font-family:'Inter_400Regular','Inter',sans-serif;">${escHtml(msg.time)}</span>
          ${tick}
        </div>
      </div>
    </div>`;
}

// ─── Input bar HTML ───────────────────────────────────────────────────────────
function buildInputBar(): string {
  return `
    <div style="position:absolute;bottom:${NAV_H}px;left:0;right:0;height:${INPUT_H}px;display:flex;align-items:center;padding:0 10px;box-sizing:border-box;">
      <!-- Single pill — emoji | text | paperclip | mic circle — all inside (matches ChatInput.tsx) -->
      <div style="flex:1;display:flex;align-items:center;background:#fff;border-radius:999px;padding-left:6px;padding-right:4px;min-height:50px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <!-- Emoji button -->
        <div style="padding:4px 8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${SVG_SMILEY}
        </div>
        <!-- Placeholder text -->
        <div style="flex:1;font-size:16px;color:#b0b0b0;font-family:'Inter_400Regular','Inter',sans-serif;">Message</div>
        <!-- Paperclip -->
        <div style="padding:4px 8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${SVG_PAPERCLIP}
        </div>
        <!-- Blue mic circle — INSIDE pill (matching screen layout in ChatInput.tsx) -->
        <div style="width:42px;height:42px;border-radius:21px;background:#3390ec;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 6px rgba(51,144,236,0.35);">
          ${SVG_MIC}
        </div>
      </div>
    </div>`;
}

// ─── Nav bar HTML ─────────────────────────────────────────────────────────────
function buildNavBar(): string {
  return `
    <div style="position:absolute;bottom:0;left:0;right:0;height:${NAV_H}px;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:space-around;">
      <!-- Squares (recent apps) -->
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
        <rect x="11" y="1" width="6" height="6" rx="1" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
        <rect x="1" y="11" width="6" height="6" rx="1" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
        <rect x="11" y="11" width="6" height="6" rx="1" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
      </svg>
      <!-- Home circle -->
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
      </svg>
      <!-- Back chevron -->
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M11 4L6 9L11 14" stroke="rgba(255,255,255,0.6)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>`;
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ─── Filler messages to fill empty space ─────────────────────────────────────
const FILLER_MSGS: { sent: boolean; text: string }[] = [
  { sent: true,  text: "Theek hai yaar 👍" },
  { sent: false, text: "Haan bilkul" },
  { sent: true,  text: "Okay" },
  { sent: false, text: "Chal baat karte hain baad mein" },
  { sent: true,  text: "Sure, talk later!" },
  { sent: false, text: "Haan, bye 😊" },
];

function padMessages(messages: Message[], minCount: number): Message[] {
  if (messages.length >= minCount) return messages;
  const padded = [...messages];
  let fi = 0;
  const baseHour = 15;
  while (padded.length < minCount) {
    const f = FILLER_MSGS[fi % FILLER_MSGS.length];
    const idx = padded.length;
    padded.push({
      id: `filler_${idx}`,
      text: f.text,
      sent: f.sent,
      time: `${baseHour}:${(idx * 6) % 60 < 10 ? "0" : ""}${(idx * 6) % 60} PM`,
      read: f.sent,
    });
    fi++;
  }
  return padded;
}

// ─── Load pre-rendered pattern PNG → HTMLCanvasElement ───────────────────────
// Uses a static PNG (pattern-bg.png) pre-generated from the SVG.
// PNG is same-origin → no canvas taint → toDataURL() always works.
async function renderPatternToCanvas(targetW: number, targetH: number): Promise<HTMLCanvasElement | null> {
  return new Promise<HTMLCanvasElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0, targetW, targetH);
      resolve(canvas);
    };
    img.onerror = () => resolve(null);
    img.src = "/pattern-bg.png";
  });
}

// ─── Main builder ─────────────────────────────────────────────────────────────
function buildChatHtml(user: RandomUser, messages: Message[], patternPngUrl: string | null): string {
  const msgAreaTop    = HEADER_H;
  const msgAreaBottom = INPUT_H + NAV_H;

  const filled      = padMessages(messages, 14);
  const bubblesHtml = filled.map(buildBubble).join("");

  // patternPngUrl is a real PNG data URL — html2canvas renders this perfectly
  const patternHtml = patternPngUrl
    ? `<img src="${patternPngUrl}"
           style="position:absolute;inset:0;width:100%;height:100%;opacity:0.55;object-fit:cover;pointer-events:none;" />`
    : "";

  return `
    <!-- Solid green background matching chat.tsx (#7ab870) -->
    <div style="position:absolute;inset:0;background:#7ab870;"></div>

    <!-- Pattern overlay — real PNG rendered from SVG, html2canvas handles PNG perfectly -->
    ${patternHtml}

    <!-- Header -->
    ${buildHeader(user)}

    <!-- Messages area — flex-end so messages anchor at bottom, overflow hidden at top -->
    <div style="position:absolute;top:${msgAreaTop}px;left:0;right:0;bottom:${msgAreaBottom}px;
                display:flex;flex-direction:column;justify-content:flex-end;padding:8px 0 4px;
                overflow:hidden;box-sizing:border-box;">
      ${bubblesHtml}
    </div>

    <!-- Input bar -->
    ${buildInputBar()}

    <!-- Nav bar -->
    ${buildNavBar()}
  `;
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function generateChatScreenshot(
  user: RandomUser,
  messages: Message[],
  _myName: string,
): Promise<string> {
  const SCALE = 2;

  // Step 1: Render the chat UI (NO pattern — pure HTML/CSS only)
  const container = document.createElement("div");
  container.style.cssText = [
    `position:fixed`,
    `left:-9999px`,
    `top:0`,
    `width:${W}px`,
    `height:${H}px`,
    `overflow:hidden`,
    `box-sizing:border-box`,
    `font-family:'Inter_400Regular','Inter',-apple-system,sans-serif`,
  ].join(";");

  container.innerHTML = buildChatHtml(user, messages, null);
  document.body.appendChild(container);

  await document.fonts.ready;
  await new Promise<void>((r) => setTimeout(r, 120));

  let chatCanvas: HTMLCanvasElement;
  try {
    chatCanvas = await html2canvas(container, {
      width:  W,
      height: H,
      scale:  SCALE,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#7ab870",
      logging: false,
    });
  } finally {
    if (container.parentNode) document.body.removeChild(container);
  }

  // Step 2: Render SVG pattern to its own canvas (completely separate from html2canvas)
  const patternCanvas = await renderPatternToCanvas(W * SCALE, H * SCALE);

  // Step 3: Composite — green bg + pattern (opacity 0.55) + chat UI on top
  const final = document.createElement("canvas");
  final.width  = W * SCALE;
  final.height = H * SCALE;
  const ctx = final.getContext("2d")!;

  // Green background
  ctx.fillStyle = "#7ab870";
  ctx.fillRect(0, 0, final.width, final.height);

  // Pattern at 0.55 opacity (if rendered successfully)
  if (patternCanvas) {
    ctx.globalAlpha = 0.55;
    ctx.drawImage(patternCanvas, 0, 0, final.width, final.height);
    ctx.globalAlpha = 1.0;
  }

  // Chat UI (messages, header, bubbles) on top — solid
  ctx.drawImage(chatCanvas, 0, 0);

  return final.toDataURL("image/png");
}
