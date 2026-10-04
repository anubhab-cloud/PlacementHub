/**
 * lib/progress.ts — User Progress & Analytics Store (localStorage based)
 */

import { CATEGORIES, TOPICS, QUESTIONS, COMPANIES, Company, Question } from './content';

export interface UserTopicProgress {
  topicId: string;
  solvedQuestionIds: string[];
  notes?: string;
  lastPracticedAt?: string;
  quizScore?: { score: number; total: number; date: string };
}

export interface UserProgressStore {
  topicProgress: Record<string, UserTopicProgress>;
  targetCompanyIds: string[];
  bookmarkedQuestionIds: string[];
  dailyStreak: number;
  lastActiveDate: string;
}

const STORAGE_KEY = 'placementhub_user_progress';

export function getProgressStore(): UserProgressStore {
  if (typeof window === 'undefined') {
    return {
      topicProgress: {},
      targetCompanyIds: ['tcs', 'google', 'amazon'],
      bookmarkedQuestionIds: [],
      dailyStreak: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaultStore: UserProgressStore = {
        topicProgress: {
          'dsa-arrays': {
            topicId: 'dsa-arrays',
            solvedQuestionIds: ['q-arr-1', 'q-arr-2'],
            lastPracticedAt: new Date().toISOString(),
          },
          'dbms-keys': {
            topicId: 'dbms-keys',
            solvedQuestionIds: ['q-dbms-1'],
            lastPracticedAt: new Date().toISOString(),
          },
        },
        targetCompanyIds: ['tcs', 'google', 'amazon', 'infosys'],
        bookmarkedQuestionIds: ['q-arr-1', 'q-sql-1'],
        dailyStreak: 5,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStore));
      return defaultStore;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading progress store', e);
    return {
      topicProgress: {},
      targetCompanyIds: ['tcs', 'google', 'amazon'],
      bookmarkedQuestionIds: [],
      dailyStreak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
  }
}

export function saveProgressStore(store: UserProgressStore) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    // Dispatch event so active components re-render if needed
    window.dispatchEvent(new Event('progress_updated'));
  } catch (e) {
    console.error('Error saving progress store', e);
  }
}

export function toggleQuestionSolved(questionId: string, topicId?: string) {
  const store = getProgressStore();
  
  // Find which topics this question belongs to if not provided
  let targetTopicIds: string[] = topicId ? [topicId] : [];
  if (targetTopicIds.length === 0) {
    const q = QUESTIONS.find((item) => item.id === questionId);
    if (q) targetTopicIds = q.topicIds;
  }

  targetTopicIds.forEach((tId) => {
    if (!store.topicProgress[tId]) {
      store.topicProgress[tId] = {
        topicId: tId,
        solvedQuestionIds: [],
        lastPracticedAt: new Date().toISOString(),
      };
    }
    const currentList = store.topicProgress[tId].solvedQuestionIds;
    if (currentList.includes(questionId)) {
      store.topicProgress[tId].solvedQuestionIds = currentList.filter((id) => id !== questionId);
    } else {
      store.topicProgress[tId].solvedQuestionIds.push(questionId);
      store.topicProgress[tId].lastPracticedAt = new Date().toISOString();
    }
  });

  saveProgressStore(store);
}

export function isQuestionSolved(questionId: string): boolean {
  const store = getProgressStore();
  return Object.values(store.topicProgress).some((tp) => tp.solvedQuestionIds.includes(questionId));
}

export function toggleBookmarkQuestion(questionId: string) {
  const store = getProgressStore();
  if (store.bookmarkedQuestionIds.includes(questionId)) {
    store.bookmarkedQuestionIds = store.bookmarkedQuestionIds.filter((id) => id !== questionId);
  } else {
    store.bookmarkedQuestionIds.push(questionId);
  }
  saveProgressStore(store);
}

export function toggleTargetCompany(companyId: string) {
  const store = getProgressStore();
  if (store.targetCompanyIds.includes(companyId)) {
    store.targetCompanyIds = store.targetCompanyIds.filter((id) => id !== companyId);
  } else {
    store.targetCompanyIds.push(companyId);
  }
  saveProgressStore(store);
}

// ─────────────────────────────────────────────────────────────────
// ANALYTICS & CALCULATIONS
// ─────────────────────────────────────────────────────────────────

export function getCategoryProgress(categoryId: string) {
  const store = getProgressStore();
  const categoryTopics = TOPICS.filter((t) => t.categoryId === categoryId);
  const categoryQuestions = QUESTIONS.filter((q) => q.categoryId === categoryId);
  
  if (categoryQuestions.length === 0) {
    return { solved: 0, total: 0, percentage: 0, topicsCompleted: 0, totalTopics: categoryTopics.length };
  }

  const solvedSet = new Set<string>();
  Object.values(store.topicProgress).forEach((tp) => {
    tp.solvedQuestionIds.forEach((qId) => {
      const q = QUESTIONS.find((item) => item.id === qId);
      if (q && q.categoryId === categoryId) {
        solvedSet.add(qId);
      }
    });
  });

  let topicsCompleted = 0;
  categoryTopics.forEach((topic) => {
    const topicQs = QUESTIONS.filter((q) => q.topicIds.includes(topic.id));
    if (topicQs.length > 0) {
      const solvedInTopic = topicQs.filter((q) => solvedSet.has(q.id)).length;
      if (solvedInTopic === topicQs.length) topicsCompleted++;
    }
  });

  const percentage = Math.round((solvedSet.size / categoryQuestions.length) * 100);

  return {
    solved: solvedSet.size,
    total: categoryQuestions.length,
    percentage: isNaN(percentage) ? 0 : percentage,
    topicsCompleted,
    totalTopics: categoryTopics.length,
  };
}

export function getCompanyReadiness(company: Company): number {
  const store = getProgressStore();
  
  // Find all questions associated with this company
  const companyQs = QUESTIONS.filter((q) => 
    q.tags.some((tag) => tag.toLowerCase() === company.name.toLowerCase()) ||
    company.focusTopics.some((ft) => q.topicIds.includes(ft))
  );

  if (companyQs.length === 0) return company.readiness || 45;

  let solvedCount = 0;
  companyQs.forEach((q) => {
    if (isQuestionSolved(q.id)) solvedCount++;
  });

  const basePct = Math.round((solvedCount / companyQs.length) * 100);
  // Blend base dataset readiness with user progress
  return Math.min(100, Math.max(15, Math.round((basePct * 0.7) + ((company.readiness || 40) * 0.3))));
}

export function getOverallStats() {
  const store = getProgressStore();
  const totalQuestions = QUESTIONS.length;
  
  const allSolvedSet = new Set<string>();
  Object.values(store.topicProgress).forEach((tp) => {
    tp.solvedQuestionIds.forEach((qId) => allSolvedSet.add(qId));
  });

  const totalSolved = allSolvedSet.size;
  const overallPercentage = Math.round((totalSolved / (totalQuestions || 1)) * 100);

  return {
    totalSolved,
    totalQuestions,
    overallPercentage,
    streakDays: store.dailyStreak || 5,
    targetCompaniesCount: store.targetCompanyIds.length,
    bookmarkedCount: store.bookmarkedQuestionIds.length,
  };
}
