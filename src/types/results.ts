import { QuestionOption, QuestionType, TestType } from './test';

export interface AnswerReviewItem {
  question_id: string;
  number: number;
  type: QuestionType;
  content: string;
  options?: QuestionOption[];
  user_answer: string | null;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
  difficulty?: string;
}

export interface ComparisonStats {
  avg_score: number;
  median_score: number;
  your_rank: number;
  total_participants: number;
  p25: number;
  p75: number;
  p90: number;
}

export interface TestResult {
  session_id: string;
  test_type: TestType;
  subtest: string;
  total_questions: number;
  correct_count: number;
  wrong_count: number;
  unanswered_count: number;
  score: number;
  percentile: number;
  time_spent_sec: number;
  created_at: string;
  answers?: AnswerReviewItem[];
  comparison?: ComparisonStats;
}

export interface ScoreDistributionBucket {
  range: string;
  count: number;
}

export interface ScoreTrendItem {
  attempt: number;
  score: number;
  date: string;
}

export interface SubtestStat {
  subtest: string;
  total_attempts: number;
  avg_score: number;
  best_score: number;
  worst_score: number;
  avg_accuracy: number;
  avg_time_spent_sec: number;
  trend: ScoreTrendItem[];
}

export interface RecentTestItem {
  session_id: string;
  test_type: TestType;
  subtest: string;
  score: number;
  date: string;
}

export interface UserStats {
  total_tests_taken: number;
  average_score: number;
  highest_score: number;
  subtests: SubtestStat[];
  recent_tests: RecentTestItem[];
}

export interface LeaderboardEntry {
  rank: number;
  user_name: string;
  best_score: number;
  total_attempts: number;
}
