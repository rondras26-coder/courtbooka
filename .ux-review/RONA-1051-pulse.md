# RONA-1051 — Courtbooka UX / design pulse

**Verified surfaces (this run):** Home (`/`) — Chrome headless screenshots at **1440×900** and **390×844** (`rona-1051-home-*.png`). Dev verified with Supabase env cleared so middleware short-circuits; with real Supabase vars, `getUser()` currently risks exceeding **Doherty Threshold** on cold requests (connection hung until restart).

---

## 1. Top gaps vs a world-class sports / facility booking product

Core booking, training-slot management, and team admin **do not exist as routes or flows yet** — only the bootstrap home shell is shipped. Against a strong competitor baseline (Picktime, Playtomic-club flows, generic court-booking SaaS):

| Area | Gap | Lens |
|------|-----|------|
| **Wayfinding & IA** | No app chrome (nav, sections for Book / Train / Teams / Account). Users cannot form a **mental model** of where they are beyond a single centered card. | Information Scent, Jakob's Law |
| **Booking loop** | No resource picker, calendar/grid, duration, price, or confirmation — the heart of **Goal-Gradient** and completion anxiety is untested. | Jobs-to-Be-Done, Hick's Law (needs chunked steps) |
| **Trust & recovery** | No policies, cancellation copy, receipts, or **Forgiveness** paths (undo, amend booking). | Emotional & trust, Nielsen #9 |
| **Density & dashboards** | Ops-side scheduling (training slots, roster) will need **density matched to context** — today everything is marketing-sparse; dashboards cannot inherit this layout blindly. | Visual quality bar — density matches context |
| **Accessibility readiness** | Single screen uses semantic heading and external links; future grids/tables/forms must ship with labeled controls, focus order, contrast on interactive maps — **WCAG POUR** not exercised yet. | Accessibility |

---

## 2. `.ux-review/` artifact status

**Updated:** Added this pulse doc plus fresh **`rona-1051-home-1440x900.png`** and **`rona-1051-home-390x844.png`** for audit trail. Older captures (`desktop-*`, `rona-1032-*`, `rona-1037-*`) remain for regression comparison.

---

## 3. Prioritized UX / design follow-ups (concrete)

1. **[P0] IA + shell** — Ship persistent navigation (Book · Programs/training · Teams · Profile), responsive drawer on mobile (**Fitts's Law** / thumb zones), and route placeholders so **Recognition over Recall** applies across journeys.

2. **[P0] Booking MVP wireframes → UI** — Linear wizard: venue/resource → date → slot → confirm; inline validation and skeleton loading (**Progressive Disclosure**, perceived performance).

3. **[P1] Auth boundary UX** — Ensure middleware/session refresh never blocks first paint beyond ~400ms; use optimistic shell or streaming layout (**Doherty Threshold**, **Zeigarnik** via visible progress).

4. **[P1] Brand & differentiation** — Replace generic grayscale bootstrap with facility-aware accent tokens (still via CSS variables — **no one-off hex**); strengthens **Visceral** level and **Aesthetic-Usability Effect**.

---

## Residual risks

- Visual verdicts on auth-gated flows remain **blocked** until those surfaces exist or stubs are reachable without secrets.
- Production `.env` with Supabase must be paired with timeout/fail-open behavior or SSR caching strategy — documented hang observed during pulse.
