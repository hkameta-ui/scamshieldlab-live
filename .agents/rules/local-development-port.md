# Local Development & Server Port Mandate (Rule 7)

## 🖥️ Local Preview & Port Allocation Rules
1. **Port 8080 Strict Prohibition**:
   - Port `8080` is strictly reserved for the user's external/other project.
   - Antigravity MUST NEVER launch servers, bind sockets, or run preview services on port `8080`.
2. **Designated Local Port**:
   - The primary local preview port for ScamShield AI is **`5050`** (fallback: `5055`).
   - Default local server command:
     ```bash
     python -m http.server 5050
     ```
3. **Local Testing URLs**:
   - Home: `http://localhost:5050/`
   - About: `http://localhost:5050/about.html`
   - Terms: `http://localhost:5050/terms.html`
   - Privacy: `http://localhost:5050/privacy.html`
