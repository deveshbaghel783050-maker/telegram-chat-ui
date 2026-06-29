# Telegram Chat UI — Dev Notes

## Project Overview

Fake Telegram chat screenshot generator. User apna naam, contact name set karta hai, messages type karta hai ya automation se bulk screenshots generate karta hai — exactly real Telegram jaisa dikhta hai.

---

## Artifact Info

| Artifact | Kind | Path | Preview |
|---|---|---|---|
| Telegram Chat UI | mobile (Expo) | `artifacts/telegram-chat` | `/` |
| API Server | api (Express) | `artifacts/api-server` | `/api` |
| Canvas | design | `artifacts/mockup-sandbox` | `/__mockup` |

---

## Key Files

```
artifacts/telegram-chat/
├── app/
│   ├── chat.tsx              ← Main chat screen (background, messages, input)
│   ├── index.tsx             ← Home / landing page
│   ├── editor.tsx            ← Profile editor (name, avatar, etc.)
│   └── _layout.tsx           ← Root layout
├── components/
│   ├── ChatHeader.tsx        ← Top header (back, avatar, name, call, dots)
│   ├── ChatInput.tsx         ← Bottom input bar (emoji, text, paperclip, mic)
│   ├── MessageBubble.tsx     ← Individual message bubble
│   └── AutomationModal.tsx   ← Bulk screenshot automation modal
├── utils/
│   ├── generateScreenshot.ts ← HTML canvas screenshot generator (automation)
│   └── randomData.ts         ← Random names, messages, avatars for automation
├── context/
│   ├── ProfileContext.tsx    ← Global state: myName, theirName, messages
│   └── AutomationContext.tsx ← Automation projects/folders state
└── assets/images/
    └── pattern.svg           ← Telegram background doodle pattern SVG
```

---

## Background — How It Works

### `/chat` page (`chat.tsx`)

```tsx
// Solid green base
<View style={[StyleSheet.absoluteFillObject, { backgroundColor: "#7ab870" }]} />

// Pattern overlay — darker green doodles on top
<View style={[StyleSheet.absoluteFillObject, { opacity: 0.55 }]} pointerEvents="none">
  <PatternSvg fill="#559e4e" width="100%" height="100%" ... />
</View>
```

- Background color: `#7ab870` (medium green)
- Pattern fill: `#559e4e` (same hue, darker — creates subtle outline effect)
- Pattern opacity: `0.55`
- Pattern file: `assets/images/pattern.svg` (746 lines, large SVG with doodle paths — bird, ghost, mushroom, rocket, cherries etc.)

### Automation screenshots (`generateScreenshot.ts`)

Same look replicated in HTML/CSS for `html2canvas`:

```js
// Background
<div style="position:absolute;inset:0;background:#7ab870;"></div>

// Pattern — inject fill="#559e4e", convert to data URL, render as <img>
// IMPORTANT: html2canvas does NOT render inline SVG reliably.
// Must use data URL in <img> tag — this is the only approach that works.
const patternWithFill = svgText.replace(/<svg([^>]*)>/, (_, a) => `<svg${a} fill="#559e4e">`);
const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(patternWithFill)}`;
<img src={dataUrl} style="opacity:0.55;object-fit:cover;..." />
```

Pattern SVG is fetched from `/pattern.svg` (served as static file). `web/pattern.svg` is the web-served copy.

**Critical**: Messages area must use `justify-content:flex-end` so messages anchor at the bottom. If `flex-start` is used, overflow messages get cut at the bottom (visible as half-message). With `flex-end`, overflow is hidden at the top (not visible).

---

## Input Bar Layout

### Real Telegram style:
```
[ 😊  Message...  📎 ]  [🎤]
    ← pill →          ↑ separate blue circle
```

### In `ChatInput.tsx`:
- Pill contains: emoji btn + TextInput + paperclip btn + blue mic/send circle (all inside one pill)
- On web: hidden `<input type="file">` for image upload

### In `generateScreenshot.ts` (automation HTML):
- Pill contains: emoji + "Message" placeholder + paperclip
- Blue mic circle is **separate** element outside the pill (to match real Telegram)

---

## Automation — How Screenshots Are Generated

1. User opens AutomationModal → sets project name + count
2. `getUniqueRandomUsers(n)` → random Indian names, phone numbers, avatar colors
3. `getRandomConversation(user)` → seeded conversation messages
4. `generateChatScreenshot(user, messages, myName)`:
   - Builds full HTML string (header + bubbles + input + nav bar)
   - Injects into off-screen `div` at `left:-9999px`
   - Runs `html2canvas` → PNG data URL
   - Auto-downloads each file as `{projectName}-{n}-{UserName}.png`

---

## Issues Fixed (Session Log)

### 1. Background pattern not visible
- **Problem**: Pattern opacity was `0.18` — too faint
- **Fix**: Increased to `0.28`, then reworked to `fill="#559e4e"` + opacity `0.55`

### 2. Chat messages hard-cut at bottom
- **Problem**: Messages behind input bar appeared cut off (hard edge)
- **Fix tried**: LinearGradient fade overlay — caused white transparent band artifact
- **Final fix**: Removed gradient entirely — messages naturally end above input

### 3. Background color mismatch
- **Problem**: Old gradient `["#b2d4a8", "#6aab6a", "#4a8a4a"]` — too dark/different from real Telegram
- **Fix**: Plain solid `#7ab870` + pattern doodles in `#559e4e`

### 4. Automation screenshots had old background
- **Problem**: `generateScreenshot.ts` still had old gradient colors + opacity `0.18`
- **Fix**: Updated to solid `#7ab870` + pattern with `fill="#559e4e"` at `0.55` opacity

### 5. Mic icon looked different in automation
- **Problem**: In automation HTML, mic blue circle was inside input pill
- **Fix**: Moved mic circle outside the pill as separate element (real Telegram layout)

### 6. Pattern not showing in automation screenshots (multiple attempts — FINAL FIX)
- **Problem**: `html2canvas` does NOT render SVGs in ANY form (inline, data URL img src, blob URL img src) — always blank
- **FINAL approach** — 3-step canvas composite AFTER html2canvas:
  1. html2canvas renders chat WITHOUT pattern (solid green bg only)
  2. `renderPatternToCanvas(W, H)` → fetch SVG → inject fill → Blob URL → drawImage → returns real `HTMLCanvasElement`
  3. Composite canvas: draw green bg + pattern at 0.55 opacity + chat canvas on top
- **Key rule**: NEVER pass SVG to html2canvas. Do pattern as a SEPARATE canvas step and composite manually.

### 7. Last opponent message cut off at bottom in automation
- **Problem**: Messages area used `justify-content:flex-start` — messages filled from top, overflow cut at bottom (visible as half-message)
- **Fix**: Changed to `justify-content:flex-end` — messages anchor at bottom, any overflow is hidden at top (not visible)

---

## Colors Reference

| Element | Color |
|---|---|
| Chat background | `#7ab870` |
| Pattern doodles | `#559e4e` |
| Sent message bubble | `#dcf8c6` (light green) |
| Received message bubble | `#ffffff` |
| Sent message tick (read) | `#3390ec` (blue) |
| Sent message tick (unread) | `#8ab88a` (muted green) |
| Mic/Send button | `#3390ec` (Telegram blue) |
| Header pill background | `#ffffff` |

---

## Stack

- Expo (React Native) — web preview via Metro
- `expo-linear-gradient` — gradients
- `react-native-svg` + SVG transformer — pattern SVG as component
- `html2canvas` — browser-side screenshot generation
- `expo-image-picker` / web file input — image upload in chat
- `expo-haptics` — haptic feedback on send
- `react-native-keyboard-controller` — keyboard avoiding view
- `react-native-safe-area-context` — safe area insets

---

## How to Run

```bash
# Start expo dev server
pnpm --filter @workspace/telegram-chat run dev

# Full typecheck
pnpm run typecheck

# API server
pnpm --filter @workspace/api-server run dev
```

## Important Notes

- `pattern.svg` must be available at `/pattern.svg` for automation screenshots to work (served via `web/pattern.svg`)
- `html2canvas` has limitations with external images — always use `useCORS: true` + `allowTaint: true`
- Do NOT add `PatternSvg` to the automation HTML directly — use inline SVG text via `loadPatternSvgText()` fetch
- Background color in `chat.tsx` and `generateScreenshot.ts` must always match — update both together
