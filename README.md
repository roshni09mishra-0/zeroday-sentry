# ZeroDay Sentry — Your scanner cries wolf. We find the wolf.
> **Submission for the Flip the Switch Hackathon (Nov 4–7, 2026)**  
> **Track:** Track 1: Best Business Workflow ($2,000 Cash Prize)  
> **Built on:** [Switch AI (`sandbox-quantum/switch`)](https://github.com/sandbox-quantum/switch) x WeMakeDevs x DevTools Academy

---

## ⚡ The Problem: 20 to 30 alerts a week. Nobody reads them.
Security scanners (Dependabot, Snyk, Trivy) bombard engineering teams with dozens of CVE alerts every week. But developers routinely ignore them because:
* **Upgrading breaks code:** Upgrading a major or minor library version changes syntax, breaks APIs, and crashes the app.
* **Crying Wolf:** Most CVEs are in dead code paths or development dependencies that are never called in production.
* **The Danger:** Because developers ignore the flood of false positives, real, critical zero-day vulnerabilities slip right through.

---

## 💡 The Solution: ZeroDay Sentry via Switch
ZeroDay Sentry answers two core questions directly inside your team chat:
1. **Is it really reachable?**
2. **Can we upgrade safely?**

We place two specialized AI agents in your team's `#security-war-room` on Slack, Teams, Discord, or Mattermost:

```
[CVE Alert Ingested]
        │
        ▼
[@cve-analyst] ──> AST Traversal: "Yes, we use the vulnerable method at auth.js:42"
        │
        ▼
[@patch-crafter] ──> Library upgrade + Syntax rewrite + Runs 18/18 Unit Tests
        │
        ▼
[Lead Developer] ──> "Approved." (1-click squash & merge to main)
```

1. **`@cve-analyst` (Switch Agent):** Traverses the repository's Abstract Syntax Tree (AST) and call-graph to prove whether the vulnerable function is actually executed in production endpoints.
2. **`@patch-crafter` (Switch Agent):** Upgrades the dependency, refactors deprecated syntax to adhere to the new API contract, runs the test suite in an isolated sandbox, and posts the verified PR diff.
3. **You (Lead Dev):** One click in the chat thread to approve and ship. Nothing merges without a human in the loop.

---

## 🎨 Creative Interactive Features Added

1. **Interactive "Crying Wolf vs. Finding the Wolf" Comparison:**
   * Toggle between the generic scanner view (42 noisy alerts, devs ignore everything) and ZeroDay Sentry (41 false positives discarded, 1 real wolf highlighted with AST call path).
2. **Interactive Live AST Code Diff Viewer:**
   * Side-by-side / unified diff view demonstrating how `@patch-crafter` upgrades `jsonwebtoken` from v8 to v9 by injecting explicit algorithm whitelists while keeping 18/18 unit tests green.
3. **Multi-Bridge Switch Platform Switcher:**
   * Real-time toggling between **Slack**, **Discord**, and **Microsoft Teams** inside the live War-Room to demonstrate Switch's multi-platform bridge architecture.
4. **Cinematic 30-Second Walkthrough Modal:**
   * Clicking *"Watch 30-sec demo"* triggers an animated step-by-step interactive workflow walkthrough.

---

## 🏗️ Switch Integration (`sandbox-quantum/switch`)

ZeroDay Sentry is natively built on the official Switch template standard (`version: 1`) located at [`switch/examples/agent-templates/security-war-room.template.yaml`](file:///C:/Users/roshu/.gemini/antigravity/scratch/cloudbuster/switch/examples/agent-templates/security-war-room.template.yaml):

```yaml
version: 1

params:
  team:
    type: string
    default: sentry
  bridge:
    type: bridge
    default: [$first]

agents:
  - name: "{team}-cve-analyst"
    description: Performs AST reachability analysis on your codebase to find real wolves
    addressing: anyone
    provider: "{provider}"
  - name: "{team}-patch-crafter"
    description: Upgrades the library, rewrites deprecated code syntax, runs unit tests, and creates PR
    addressing: owner-agents
    provider: "{provider}"

room:
  name: "security-war-room"
  description: Shared context room for CVE Analyst, Patch Crafter, and Lead Developers
  bridge: "{bridge}"
  agents: ["{team}-cve-analyst", "{team}-patch-crafter"]
  users: ["{$creator}"]
```

---

## 🖥️ Web Platform Experience (Live at http://localhost:4173)

Built with a bold **Neo-Brutalist High-Contrast Security Aesthetic** (Electric Yellow `#FFE500`, Deep Black `#000000`, Sharp `#000` 4px drop shadows, Plus Jakarta Sans & JetBrains Mono):

1. **Landing Page (`/`):**
   * Pixel-perfect implementation of the design specification:
   * **Hero:** *"Your scanner cries wolf. We find the wolf."* with `Meet the agents` and `Watch 30-sec demo` buttons.
   * **The Problem Banner:** Electric yellow full-width section *"20 to 30 alerts a week. Nobody reads them."*
   * **The Crew Cards:** Three neo-brutalist cards highlighting `@cve-analyst`, `@patch-crafter`, and `You` with interactive click-to-approve states.
   * **Bring your own agents Banner:** Black section with yellow *"Clone the repo"* action.
2. **Live War-Room (`/war-room`):**
   * Multi-Bridge switcher (Slack / Discord / MS Teams).
   * Real-time conversational AI thread between `@cve-analyst`, `@patch-crafter`, and the lead engineer.
   * Live streaming sandbox execution console showing AST grep matches, test runner output, and PR creation.
3. **AST Reachability Scanner (`/scanner`):**
   * Traversal comparison between the crying wolf (unreachable dead code in `lodash`) vs the real wolf (reachable vulnerability in `jsonwebtoken` at `src/auth.js:42`).
   * Visual HTTP pipeline call-graph diagram.

---

## 🚀 Running Locally

```bash
# 1. Clone repository
git clone https://github.com/sandbox-quantum/switch.git

# 2. Start the web application
cd web
npm run preview
# Open: http://localhost:4173
```

---

## 🏆 Hackathon Compliance Checklist
- [x] **Uses Switch:** Official template specification and room configuration for `sandbox-quantum/switch`.
- [x] **Multi-Agent Collaboration:** `@cve-analyst` and `@patch-crafter` coordinate in a shared room with human-in-the-loop.
- [x] **Track 1 Business Impact:** Solves developer alert fatigue, prevents security vulnerabilities, and cuts down dependency upgrade downtime.
- [x] **Visual Excellence:** Exact neo-brutalist palette, fonts, card shadows, and layout.
