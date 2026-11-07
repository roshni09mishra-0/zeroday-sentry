import { CVEAlert, SlackMessage, ExecutionLog } from './types';

export const INITIAL_CVES: CVEAlert[] = [
  {
    id: 'CVE-2026-3114',
    library: 'jsonwebtoken',
    currentVersion: '8.5.1',
    patchedVersion: '9.0.2',
    severity: 'CRITICAL',
    isReachable: true,
    reachableLocation: 'src/auth.js:42',
    exploitVector: 'Missing algorithm whitelist allows signature bypass via alg:none header',
    status: 'patch_generated',
    linesRewritten: 3,
    testSuiteResult: '18/18 tests pass',
    prNumber: 142
  },
  {
    id: 'CVE-2026-1980',
    library: 'axios',
    currentVersion: '0.27.2',
    patchedVersion: '1.7.4',
    severity: 'HIGH',
    isReachable: true,
    reachableLocation: 'src/api/client.ts:88',
    exploitVector: 'Custom redirect handler forwards auth headers across foreign origins (SSRF)',
    status: 'vulnerable',
    linesRewritten: 2,
    testSuiteResult: '24/24 tests pass',
    prNumber: 143
  },
  {
    id: 'CVE-2026-0812',
    library: 'lodash',
    currentVersion: '4.17.20',
    patchedVersion: '4.17.21',
    severity: 'MEDIUM',
    isReachable: false,
    reachableLocation: 'Dead code (used only in archived build script scripts/legacy-pack.js)',
    exploitVector: 'Prototype pollution in _.template — never invoked in HTTP request lifecycle',
    status: 'false_positive',
    linesRewritten: 0,
    testSuiteResult: 'Filtered out — zero production impact',
  }
];

export const INITIAL_SLACK_MESSAGES: SlackMessage[] = [
  {
    id: 'msg-0',
    sender: 'system',
    authorName: 'Switch Gateway',
    tag: 'system',
    timestamp: '10:14 AM',
    content: 'Connected to #security-war-room via Switch bridge. Listening on api-backend-core repository.'
  },
  {
    id: 'msg-1',
    sender: 'analyst',
    authorName: 'cve-analyst',
    tag: '@cve-analyst',
    timestamp: '10:15 AM',
    content: 'Heads up @team: Dependabot flagged CVE-2026-3114 on jsonwebtoken. Traced our AST call graph from GET /api/v1/auth down to the handler:',
    quoteBox: 'Yes, we use the vulnerable method at auth.js:42'
  },
  {
    id: 'msg-2',
    sender: 'crafter',
    authorName: 'patch-crafter',
    tag: '@patch-crafter',
    timestamp: '10:16 AM',
    content: 'Bumped to v9.0.2. v9 breaks backwards compatibility by requiring explicit algorithm arrays. Updated options in auth.js and ran our unit tests:',
    quoteBox: 'Rewrote 3 lines to v2 syntax. All 18 tests passing. Here is the PR.',
    actions: [
      { label: 'Approved (Merge PR #142)', action: 'approve', variant: 'yellow' },
      { label: 'Inspect AST Diff', action: 'diff', variant: 'white' },
      { label: 'Snooze 24h', action: 'reject', variant: 'white' }
    ]
  }
];

export const INITIAL_EXECUTION_LOGS: ExecutionLog[] = [
  {
    id: 'log-1',
    timestamp: '10:15:01',
    level: 'AST',
    command: 'ast-grep --pattern "jwt.verify($$$)" src/',
    output: 'Match: src/auth.js:42 -> verifyToken(req, res, next)'
  },
  {
    id: 'log-2',
    timestamp: '10:15:02',
    level: 'REACHABILITY',
    command: 'trace-callpath --entrypoint src/routes/api.ts --target src/auth.js:42',
    output: 'REACHABLE in production pipeline: GET /api/v1/auth -> authMiddleware -> jwt.verify'
  },
  {
    id: 'log-3',
    timestamp: '10:16:10',
    level: 'PATCH',
    command: 'npm install jsonwebtoken@9.0.2 && git apply patches/cve-2026-3114.diff',
    output: 'Updated package.json & src/auth.js: injected algorithms: ["HS256"]'
  },
  {
    id: 'log-4',
    timestamp: '10:16:15',
    level: 'TEST',
    command: 'npm test -- --testPathPattern=auth.test.ts',
    output: 'PASS tests/auth.test.ts (18 passed, 0 failed, 100% assertions green)'
  }
];
