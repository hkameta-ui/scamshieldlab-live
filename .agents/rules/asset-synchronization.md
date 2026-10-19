# Rule: Asset Synchronization & Cache-Busting Mandate

1. **Synchronized Cache-Busting Across All Pages**:
   - Every internal CSS stylesheet link (`css/styles.css`) and JavaScript file link (`js/app.js`, `js/threat-data.js`, `config.js`) across ALL HTML files MUST include an active, matching cache-busting query parameter (e.g., `?v=20261019-cls`).
   - No production HTML file may link unversioned local assets.

2. **Lockstep Version Bumps**:
   - Whenever styles or client scripts are refactored, the version token MUST be bumped uniformly across `index.html`, `about.html`, `privacy.html`, `terms.html`, `guide-voice-cloning.html`, and `guide-pig-butchering.html`.
   - This ensures CDNs (Cloudflare) and mobile/desktop browsers never serve mismatched or stale stylesheets that trigger unexpected Cumulative Layout Shifts (CLS).

3. **Automated Verification**:
   - The test suite (`tests/test_suite.py`) enforces that all HTML files declare identical, active version tokens on internal stylesheet and script tags.
