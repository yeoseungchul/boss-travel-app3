# Boss Travel App — Product Specification

**Document type:** Functional specification (mobile-first)  
**Stack reference:** Next.js, Tailwind CSS  
**Audience:** Product, design, and engineering

---

## 1. Overview

A refined, minimal **mobile-only** travel companion application for agency leadership and VIP clients. The interface prioritizes **video and iconography** over dense copy, with a **premium navy** visual language and generous spacing.

---

## 2. Destination Video — Macau & Shanghai

### 2.1 Purpose

Surface **high-impact destination storytelling** through full-width or hero-style video for **Macau** and **Shanghai**, enabling quick emotional context and sales support without long text.

### 2.2 Requirements

- Dedicated **video surfaces** (hero cards or carousel) for each destination.
- Support for **looping preview**, **tap-to-play full screen** (or inline expanded), and **muted autoplay** where platform policy allows (with user-controlled audio).
- **Poster images** or branded frames before playback.
- Graceful **fallback** (static image + play control) when video fails to load or autoplay is blocked.

### 2.3 Non-goals (initial)

- Full CMS for arbitrary destinations (can be phased later).

---

## 3. Human Support → AI Handoff (5-Minute No-Response Rule)

### 3.1 Purpose

If a **human agent** does not respond within **5 minutes**, the session **automatically switches to AI assistance** so the user is never left hanging.

### 3.2 Requirements

- **Timer:** Start when the user sends a message or opens a support thread (exact trigger to be aligned with chat product rules).
- **Threshold:** **300 seconds** of agent inactivity → transition state **“AI active”**.
- **User-visible state:** Clear indicator (icon + short label) for **Human**, **Waiting**, and **AI**.
- **Transparency:** Optional one-line system notice when handoff occurs (configurable; keep copy minimal per brand guidelines).
- **Recovery:** If a human joins later, define whether AI pauses or hands back (default: **human takes priority** once online).

### 3.3 Edge cases

- App backgrounded: timer behavior follows platform best practices (pause vs. continue — specify in implementation).
- Network loss: show **offline / retry** without resetting user expectations ambiguously.

---

## 4. SOS Button

### 4.1 Purpose

One-tap access to **emergency / urgent assistance** flows (agency hotline, local emergency numbers, or triage screen).

### 4.2 Requirements

- **Persistent, highly visible** control on main navigation or header (icon-first; label optional).
- **Confirmation** step for non-emergency mis-taps (e.g., bottom sheet: “Call now” / “Cancel”) — tune for speed vs. false positives.
- **Localization-ready** numbers and instructions.
- **Accessibility:** Large touch target, screen reader name (e.g., “Emergency help”).

### 4.3 Compliance note

Legal and liability copy for true emergency services (e.g., 112/911) must be reviewed by counsel per operating regions.

---

## 5. Multi-Language Support (i18n)

### 5.1 Purpose

Serve international travelers and staff with **in-app language switching** without relying on device locale alone.

### 5.2 Requirements

- **Language selector** entry point (globe icon) available from main shell.
- **Runtime language change** with immediate UI update for supported strings.
- **Persistence** of user preference (local storage or profile).
- **Locale-aware** formats: dates, times, numbers where applicable.
- **Fallback:** Default language when a translation key is missing.

### 5.3 Initial language set

To be confirmed with stakeholders (placeholder: **Korean, English**, expandable).

---

## 6. My Page (Profile & Account)

### 6.1 Purpose

Central hub for **personal settings**, **trip history**, **preferences**, and **language** — optimized for quick access with minimal scrolling on mobile.

### 6.2 Requirements

- **Profile summary** (avatar or initials, name optional on minimal UI).
- **Settings:** notifications, language, privacy (as product scope allows).
- **Support entry:** link or icon to help / chat.
- **Sign-in / sign-out** (if auth is in scope).

### 6.3 Design note

Match global **premium navy** system; prefer **icons + single-line labels** over paragraphs.

---

## 7. Non-Functional — Mobile & Performance

- **Viewport:** Mobile-first; primary layouts target **320–430px** width.
- **Touch targets:** Minimum **44×44px** for primary actions.
- **Performance:** Lazy-load heavy video assets; prefer compressed encodings (e.g., H.264/HEVC policies per platform).
- **Security:** No secrets in client bundles; SOS and chat integrations via secure APIs.

---

## 8. Out of Scope (unless added later)

- Desktop-optimized layouts as a first-class experience.
- Offline maps engine (can integrate via third-party SDK later).

---

## 9. Revision History

| Version | Date       | Notes                    |
|---------|------------|--------------------------|
| 0.1     | 2026-04-11 | Initial specification    |
