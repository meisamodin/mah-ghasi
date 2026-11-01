# MahGhasi (ماه قاسی) — developer notes

Single-file Persian RTL PWA (period / pregnancy / baby tracker). Everything is in `index.html` (vanilla JS, no build step). Hosted on GitHub Pages: https://meisamodin.github.io/mah-ghasi/ . Data lives only in the user's localStorage (`S`, saved with `save()`).

## Files
- `index.html` — the whole app (source of truth). Same file as `mahbanoo.html` in the working outputs.
- `sw.js` — service worker, network-first, cache name `mah-ghasi-vN` (bump with every release).
- `manifest.webmanifest`, `icon-*.png`, `screenshot-*.png` — PWA assets (APK is built by the owner with PWABuilder; keep `signing.keystore` safe, it is NOT in this repo).
- `privacy.html` — public privacy policy (needed for stores).
- `dev/tests/` — Playwright scripts used for regression checks (they load `/mnt/user-data/outputs/mahbanoo.html` via a routed fake host `http://t.local/`; change the path if you run them elsewhere).

## Release (current: v73)
1. Edit `index.html`.
2. Bump `const APPV='vN'` in index.html and `mah-ghasi-vN` in sw.js.
3. Run `node dev/tests/t17.js` (boot/page-error check) plus the feature tests.
4. `git add -A && git commit && git push origin main` → GitHub Pages deploys. Users may need to close/reopen the app once (Settings → "Force update").

## Architecture cheatsheet
- State `S`; tabs: home, log, pms, not (notifications), hl (health), tl (tools), set. `draw()` re-renders. Clicks use `data-a="name"` handled in one big `else if(a==='…')` chain: no `return` ⇒ automatic redraw, `return` ⇒ no redraw.
- Tools: `TOOLS` array (priority order) + `toolList()` (mode / baby-aware ordering) + `toolHidden(id)`. Tool views: `XV={s:id,d}`, shared tool state `XS`; `xvDraw` routes `if(s==='id'){...Draw(hd,bk)}`; `xvStop()` stops timers when leaving.
- Tools tab shows the first 8 (`TLQ`) and a "show all" toggle.
- i18n: `TR` dict (full-string keys) + `tx()`; new code uses `oL(fa,en)` / `oP('fa|en')`. Do not rely on `tx()` for partial strings (it does substring replacement and can corrupt text).
- Help: `HPG`/`HPE` entries (every tool needs one `['tl',id,faText,enText]`), `❓` button in each tool header.
- Names (functions, consts, `data-a` handler names, tool ids) must be globally unique: a redeclaration breaks the entire script. Check with `dev/tests/chk.py`/`dup.py` style greps before adding.
- Cycle convention: calendar ovulation day = cycle day `cl-14`; fertile window ovN-5..ovN+1; LH field `L.ot`.
- Always keep cards/tools in priority order in each tab (owner's standing instruction).

## Content caveats
- Medical content is informational; no drug dosing anywhere. Baby fever thresholds, kick count, etc. are general guidance with disclaimers.
- Ramadan dates use Intl umalqura (may differ ±1 day from Iran). Calorie / recipe values are rough estimates.
- Not tested on real phones: notifications, camera OCR, audio, step counter, TV streams, location, touch gestures.

## Ideas not built (owner decided to skip or wait)
AI chat (needs a backend + key; sanctions/privacy issues), news feed, in-app Google search (Wikipedia search or Google CSE were proposed), radio tool (no verified streams).
