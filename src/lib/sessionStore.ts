import { TestType } from '@/types/test';
import { TestResult } from '@/types/results';

export interface StoredSession {
  id: string;
  user_id: string;
  test_type: TestType;
  subtest: string;
  time_limit_sec: number;
  started_at: string;
  finished_at: string | null;
  status: 'in_progress' | 'completed' | 'timed_out';
  question_ids: string[];
  saved_answers: Record<string, string>;
  result?: TestResult;
}

// Global variable survives HMR in development
declare global {
  // eslint-disable-next-line no-var
  var __NEXAM_SESSIONS__: Map<string, StoredSession> | undefined;
}

if (!global.__NEXAM_SESSIONS__) {
  global.__NEXAM_SESSIONS__ = new Map();
}

export const sessionsCache = global.__NEXAM_SESSIONS__;
