# Rule 5: Feature Branch Workflow & Merge Approval Mandate

1. **Feature Branch Isolation**:
   - Never commit or write modifications directly to the `main` branch.
   - All feature work, UI enhancements, and refactoring MUST be carried out on dedicated feature branches (e.g., `feature/...`).

2. **Mandatory Automated Verification**:
   - All changes must pass unit and validation tests (syntax, layout, heuristics, and responsiveness) before any merge proposal.

3. **Strict Explicit Approval Gate Before Merge & Upload**:
   - Antigravity MUST NEVER automatically merge feature branches into `main` or push to production remote.
   - Antigravity must present test outcomes, verify readiness, and wait for the user to explicitly say "go" / "approved" before merging to `main` and uploading to remote.
