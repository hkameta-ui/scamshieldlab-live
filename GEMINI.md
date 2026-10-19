# Project Rules & Quality Mandates: ScamShield AI

All code, content, and architecture in this project MUST strictly comply with these four foundational rules at all times.

---

## ⚡ Rule 1: High Performance Mandate
1. **Target Web Vitals**:
   - Largest Contentful Paint (LCP) < 1.2s.
   - First Input Delay (FID) / Interaction to Next Paint (INP) < 100ms.
   - Cumulative Layout Shift (CLS) = 0.
2. **Asset Optimization**:
   - All images must include explicit `width` and `height` dimensions or aspect ratio constraints to eliminate layout shifts.
   - Non-critical images must specify `loading="lazy"` and `decoding="async"`.
   - Fonts must use `font-display: swap` to prevent Flash of Invisible Text (FOIT).
3. **Execution & Script Efficiency**:
   - Zero heavy external JavaScript dependencies or unnecessary frameworks.
   - DOM updates must be batched; avoid layout thrashing and repeated style calculations.
   - Client-side heuristic calculations must be non-blocking and optimized for instant response.

---

## 🔒 Rule 2: Security Standards as per OWASP & Industry Best Practices
1. **Cross-Site Scripting (XSS) Prevention**:
   - User-supplied input from text areas or URL parameters MUST NEVER be injected into the DOM using raw `innerHTML`.
   - All dynamic strings must pass through an HTML entity escaping sanitizer (`escapeHtml`) or use `textContent` / `innerText`.
2. **Content Security Policy (CSP)**:
   - Pages must declare strict Content Security Policies restricting executable scripts, styles, frames, and object embeds to verified sources and self.
3. **Security Headers & Flags**:
   - Enforce `nosniff` via `<meta http-equiv="X-Content-Type-Options" content="nosniff">`.
   - Enforce `strict-origin-when-cross-origin` referrer policy.
   - All external anchor tags must specify `rel="noopener noreferrer"` or `rel="noopener sponsored"`.
4. **Data Privacy & Zero Retention**:
   - Analysis tools operate 100% in-browser on the client side. No personal communication, phone numbers, or passwords are ever logged, sent to servers, or persisted without explicit user action.

---

## 🕊️ Rule 3: Content Standards — 100% Non-Offensive, Family-Safe & Ethical
1. **Google AdSense & SafeSearch Compliance**:
   - Zero tolerance for profanity, vulgarity, hate speech, harassment, sexually explicit material, discriminatory language, or violence.
   - Content must strictly comply with the **Google Publisher Policies** and **Google AdSense Content Guidelines** to protect monetization status and ad inventory quality.
2. **Empathetic & Professional Tone**:
   - Scam victims often experience severe emotional stress and financial anxiety. Content, tool outputs, and checklists must maintain a supportive, authoritative, calm, and objective demeanor.
   - Never blame or shame victims ("victim-blaming"). Frame all guidance constructively around adversary deception tactics.
3. **Accuracy & Ethical Integrity**:
   - All threat intelligence, statistics, and legal procedures must be factually verifiable (referencing FBI IC3, FTC, CISA, or peer-reviewed studies).
   - Clear FTC-compliant affiliate disclosures must accompany all monetized recommendations. No deceptive claims, no fake reviews, no deceptive urgency.

---

## 🌐 Rule 4: Universal Availability & Accessibility (WCAG 2.1 AA)
1. **Accessible to All Users (a11y)**:
   - Adhere to **WCAG 2.1 AA** accessibility standards.
   - Full keyboard navigability: Every interactive element (buttons, links, form controls, accordion headers, quiz cards) must be focusable with high-visibility `:focus-visible` indicators.
   - Screen Reader Optimization: Dynamic state updates (e.g. scan results, quiz scores, live alert ticker) must declare appropriate ARIA roles (`role="alert"`, `role="status"`, `aria-live="polite"`).
   - Form inputs must have explicit `<label>` tags with matching `for` attributes.
   - Contrast Ratios: Text against backgrounds must meet or exceed a 4.5:1 contrast ratio for normal text and 3:1 for large text.
2. **Universal Device & Network Availability**:
   - Responsive design adapting fluidly from small mobile screens (320px) to ultra-wide displays (4K).
   - Fast, reliable degradation: All informational content remains readable and functional even with reduced bandwidth or script latency.
   - A dedicated "Skip to main content" link must be present on all pages for screen-reader and keyboard users.

---

## 🌿 Rule 5: Feature Branch Workflow & Merge Approval Mandate
1. **Feature Branch Isolation**:
   - Never commit or write modifications directly to the `main` branch.
   - All feature work, UI enhancements, and refactoring MUST be carried out on dedicated feature branches (e.g., `feature/...`).
2. **Mandatory Automated Verification**:
   - All changes must pass unit and validation tests (syntax, layout, heuristics, and responsiveness) before any merge proposal.
3. **Strict Explicit Approval Gate Before Merge & Upload**:
   - Antigravity MUST NEVER automatically merge feature branches into `main` or push to production remote.
   - Antigravity must present test outcomes, verify readiness, and wait for the user to explicitly say "go" / "approved" before merging to `main` and uploading to remote.

