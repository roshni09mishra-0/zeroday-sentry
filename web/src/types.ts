export interface CVEAlert {
  id: string; // e.g., 'CVE-2026-3114'
  library: string; // e.g., 'jsonwebtoken'
  currentVersion: string; // e.g., '8.5.1'
  patchedVersion: string; // e.g., '9.0.2'
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  isReachable: boolean;
  reachableLocation: string; // e.g., 'src/auth.js:42'
  exploitVector: string; // e.g., 'Alg None token forgery in verify()'
  status: 'vulnerable' | 'patch_generated' | 'tests_passed' | 'approved' | 'false_positive';
  linesRewritten: number;
  testSuiteResult: string; // e.g., '18/18 tests passing'
  prNumber?: number;
}

export interface SlackMessage {
  id: string;
  sender: 'analyst' | 'crafter' | 'human' | 'system';
  authorName: string;
  tag: string; // e.g., '@cve-analyst', '@patch-crafter', 'You'
  timestamp: string;
  content: string;
  quoteBox?: string;
  actions?: Array<{
    label: string;
    action: string;
    variant: 'yellow' | 'white' | 'black';
  }>;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  level: 'AST' | 'REACHABILITY' | 'PATCH' | 'TEST' | 'PR';
  command: string;
  output: string;
}
