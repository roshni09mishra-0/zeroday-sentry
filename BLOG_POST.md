# How We Built ZeroDay Sentry on Switch: Taming Dependency Alert Fatigue with AI Teammates

*A deep dive into how we used Switch (`sandbox-quantum/switch`) to connect two autonomous security agents into our team chat, eliminate scanner noise, and automate safe dependency upgrades.*

---

If you have ever maintained a production repository, you already know the sinking feeling of Monday morning: you open your email or Slack, and Dependabot has dumped 18 new security alerts into your lap. 

Most of them are marked "High" or "Critical," but when you actually look into them:
1. **The vulnerability is in dead code:** The advisory flags a broken function in a utility library like `lodash`, but your code only imports `debounce` and `isEqual`. The vulnerable method is never called in production.
2. **Upgrading breaks your app:** You try bumping a minor package like `axios`, but the new major version ships as pure ES Modules (ESM) while your test suite runs on CommonJS Jest. Suddenly your build crashes with `Cannot use import statement outside a module`.
3. **Alert fatigue sets in:** Because checking call paths and fixing broken syntax takes hours, the alerts sit in backlog purgatory. And when a truly reachable, dangerous zero-day vulnerability lands, it gets lost in the noise.

For the **Flip the Switch Hackathon (Track 1: Best Business Workflow)**, we wanted to fix this once and for all. We built **ZeroDay Sentry**—a workflow powered by **Switch** that puts two specialized AI agents into our team's `#security-war-room` to answer two simple questions: **Do we actually call it, and can we upgrade safely?**

Here is the story of how we designed it, how Switch made it possible, and what we learned along the way.

---

## The Concept: "The Site is the War Room"

Instead of building another dashboard that developers have to remember to log into, we wanted our tool to live where the team already talks: Slack, Teams, Discord, or Mattermost.

We split the workflow into distinct roles:
* **The Scanner (Dependabot / Snyk):** Triggers the alert when an advisory is published.
* **`@cve-analyst` (Switch Agent):** A read-only investigator that inspects the repository's Abstract Syntax Tree (AST) to check if the vulnerable function or setting is reachable from production entrypoints.
* **`@patch-crafter` (Switch Agent):** A sandboxed engineer that branches the repo, upgrades the package, rewrites breaking syntax (like Jest CJS module mappings), and runs the test suite until green.
* **Lead Developer (Human):** Reviews the 3-file diff in the thread and approves. Nothing merges without a human sign-off.

```
[Dependabot Alert] 
       │
       ▼
[@cve-analyst]   ──> "lodash: NOT REACHABLE. axios: REACHABLE at client.js:42"
       │
       ▼
[@patch-crafter] ──> Bumps axios to 1.6.8, maps Jest CJS, 18/18 tests pass green
       │
       ▼
[Lead Developer] ──> "Read the diff. Approved." (1-click squash merge to main)
```

---

## How Switch Made This Surprisingly Simple

Before discovering Switch, building something like this meant writing custom Slack bot boilerplate, wrestling with OAuth scopes, setting up WebSocket listeners, managing ngrok tunnels, and repeating the entire process if you wanted to support Microsoft Teams or Discord.

Switch completely flips this model through three core ideas:

### 1. Declarative Room Templates
With Switch, you define your entire collaborative environment in a single YAML template (`security-war-room.template.yaml`):

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

Switch reads this specification and handles the bridge binding. Whether your team uses Slack, Discord, or Mattermost, the agents show up with their own avatar and permissions automatically.

### 2. The Local Mattermost Advantage
One huge friction point in hackathons is getting permissions: how do you test Slack bots if you don't own your company's workspace? 

Switch Console ships with a local Mattermost container out of the box. We were able to spin up local agents, trigger mock alerts, and test multi-agent interactions directly on our laptop with zero cloud credentials required.

### 3. Server-Sent Events (SSE) Agent Protocol
Our backend runs a lightweight FastAPI service backed by SQLite. Because Switch speaks a clean HTTP/SSE protocol (Server-Sent Events inbound, HTTP outbound), connecting our Gemini-powered reachability engine was as simple as streaming responses into the room's event feed.

---

## A Real Walkthrough: Triage on `acme/checkout-web`

To prove the concept on real-world dependencies, we benchmarked ZeroDay Sentry against two real CVEs in a demo checkout service:

### Alert 1: `lodash 4.17.20` (CVE-2021-23337 · High 7.2)
* **What scanners say:** "Vulnerable to command injection via template compilation!"
* **What `@cve-analyst` discovered:** It crawled all 41 files in `src/`. `lodash` was imported in 6 files, but only for `debounce`, `get`, and `isEqual`. There were zero calls to `_.template`.
* **Action taken:** Marked **NOT REACHABLE**. Sentry deferred the bump to the next routine sprint update, saving the team from an emergency false-alarm fire drill.

### Alert 2: `axios 0.27.2` (CVE-2023-45857 · Medium 6.5)
* **What scanners say:** "Cross-origin XSRF token disclosure."
* **What `@cve-analyst` discovered:** It found that `src/api/client.js:42` created an axios instance with `withCredentials: true`, while `src/api/rates.js:9` sent requests to `partner-rates.example.com` (a cross-origin endpoint). On axios 0.27, this leaks the sensitive session token.
* **The Verdict:** Marked **REACHABLE AT client.js:42**. Sentry immediately handed the incident over to `@patch-crafter`.

### The Autonomous Fix & Test Repair
Upgrading axios from `0.27` to `1.6.8` isn't a simple version bump. When `@patch-crafter` ran the test suite on branch `fix/axios-cve-2023-45857`, Test Run 1 failed with:
```text
SyntaxError: Cannot use import statement outside a module
```
Because axios 1.x ships pure ES Modules while the project's Jest setup uses CommonJS, the app crashed. 

Rather than giving up, `@patch-crafter`:
1. Updated `jest.config.js` to map `axios` to its CommonJS build: `moduleNameMapper: { '^axios$': 'axios/dist/browser/axios.cjs' }`.
2. Refactored deprecated `axios.all` / `axios.spread` calls in `checkout.js` to modern `Promise.all`.
3. Reran the tests: **18 of 18 test suites passed green**.
4. Opened Draft PR #23 with a concise 3-file diff (`+7 -4 lines`) and posted it into the war room thread.

### The Human Sign-off
Our lead engineer Meera checked the diff right in the chat thread and typed:
> *"Read the diff. Approved."*

Switch triggered a 1-click squash merge to `main`, recorded the commit hash (`4b9a12e`) into our persistent SQLite audit ledger, and closed the CVE incident.

---

## Tips for First-Time Switch Builders

If you are planning to build with Switch, here are three lessons we learned that will save you hours:

1. **Keep Agent Scopes Narrow:** Don't try to build one "do-everything" agent. Giving one agent read-only audit duties (`@cve-analyst`) and giving the other isolated branch editing duties (`@patch-crafter`) prevented hallucination loops and made permission boundaries crisp.
2. **Use `addressing: owner-agents` for Chains:** To prevent two agents from talking in an infinite loop, set one agent to listen only when tagged or handed an action item by an upstream teammate.
3. **Preserve Human Control:** Security tools that auto-merge PRs without human approval will never be adopted by enterprise tech leads. Always build a human sign-off gate into your chat workflow.

---

## Measuring Business Impact

In our ROI calculation model based on mid-sized engineering teams (20 developers receiving ~25 scanner alerts per week):
* **Dev Hours Reclaimed:** ~80 developer hours saved per month by eliminating dead-code research.
* **Mean Time to Remediate (MTTR):** Cut from an average of 4.2 business days down to under 16 minutes from ingest to merged PR.
* **Zero Disruption:** Real vulnerabilities are patched autonomously with green unit tests before engineers even start their morning standup.

---

## Live Links & Code

* **Live Interactive App & War Room:** [https://web-phi-livid-58sfauope0.vercel.app/](https://web-phi-livid-58sfauope0.vercel.app/)
* **2-Minute Demo Video Walkthrough (Loom):** [Watch on Loom](https://www.loom.com/share/a784a8fbe22e49bc88bfcfabb4443852)
* **GitHub Repository:** [roshni09mishra-0/zeroday-sentry](https://github.com/roshni09mishra-0/zeroday-sentry)
* **Documentation Artboards:**
  * [Page 1: Home](https://web-phi-livid-58sfauope0.vercel.app/index.dc.html)
  * [Page 2: How It Works](https://web-phi-livid-58sfauope0.vercel.app/how-it-works.dc.html)
  * [Page 3: Demo Run](https://web-phi-livid-58sfauope0.vercel.app/demo-run.dc.html)
  * [Page 4: FAQ & Architecture](https://web-phi-livid-58sfauope0.vercel.app/faq.dc.html)

Huge shoutout to the **WeMakeDevs**, **DevTools Academy**, and **Switch AI** teams for putting together such an inspiring hackathon. Building real agentic workflows that live right alongside your teammates is the future of developer tooling!
