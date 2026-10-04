'use client';
import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, TOPICS, QUESTIONS, COMPANY_QUESTIONS, COMPANIES, Question } from '@/lib/content';
import { toggleQuestionSolved, isQuestionSolved, saveProgressStore, getProgressStore } from '@/lib/progress';

export default function TopicDetailPage({ params }: { params: Promise<{ category: string; topic: string }> }) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.category;
  const topicId = resolvedParams.topic;

  const category = CATEGORIES.find((c) => c.id === categoryId);
  const topic = TOPICS.find((t) => t.id === topicId && t.categoryId === categoryId);

  if (!category || !topic) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'companies' | 'quiz'>('learn');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setRefreshTrigger((prev) => prev + 1);
    window.addEventListener('progress_updated', handleUpdate);
    return () => window.removeEventListener('progress_updated', handleUpdate);
  }, []);

  // Filter questions for this topic
  const topicQuestions = QUESTIONS.filter((q) => q.topicIds.includes(topic.id));
  const practiceQuestions = topicQuestions.filter((q) =>
    selectedDifficulty === 'All' || q.difficulty === selectedDifficulty
  );

  // Company questions for this topic
  const companyQs = COMPANY_QUESTIONS.filter((cq) =>
    topicQuestions.some((q) => q.id === cq.questionId)
  );

  // Quiz questions (MCQs)
  const quizQuestions = topicQuestions.filter((q) => q.type === 'mcq' && q.options && q.options.length > 0);

  const handleToggleSolved = (qId: string) => {
    toggleQuestionSolved(qId, topic.id);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleQuizOptionSelect = (optionIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [quizIndex]: optionIdx }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctOption) score++;
    });
    return score;
  };

  const handleFinishQuiz = () => {
    setQuizSubmitted(true);
    const score = calculateQuizScore();
    const store = getProgressStore();
    if (!store.topicProgress[topic.id]) {
      store.topicProgress[topic.id] = { topicId: topic.id, solvedQuestionIds: [] };
    }
    store.topicProgress[topic.id].quizScore = {
      score,
      total: quizQuestions.length,
      date: new Date().toISOString(),
    };
    saveProgressStore(store);
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setUserAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="dashboard-container">
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-3)' }}>
        <Link href="/prep" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Placement Prep</Link>
        <span>/</span>
        <Link href={`/prep/${category.id}`} style={{ color: 'var(--text-3)', textDecoration: 'none' }}>{category.name}</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-1)', fontWeight: '600' }}>{topic.name}</span>
      </div>

      {/* Topic Banner */}
      <div className="dashboard-hero-card" style={{ borderLeft: `4px solid ${category.color}` }}>
        <div className="hero-content-group">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <span className={`pill-${topic.level.toLowerCase()}`} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '4px' }}>
              {topic.level}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
              Priority: <strong style={{ color: topic.importance === 'Critical' ? '#f04438' : 'var(--text-1)' }}>{topic.importance}</strong>
            </span>
          </div>

          <h1 className="hero-title">{topic.name}</h1>
          <p className="hero-subtitle" style={{ maxWidth: '750px' }}>
            {topic.description}
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 16px', borderRadius: '6px', fontSize: '12px' }}>
              Questions Available: <strong style={{ color: 'var(--text-1)' }}>{topicQuestions.length}</strong>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 16px', borderRadius: '6px', fontSize: '12px' }}>
              Company PYQs: <strong style={{ color: 'var(--accent)' }}>{companyQs.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Interactive Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', margin: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'learn', label: '📖 1. Learn & Theory' },
          { id: 'practice', label: `💻 2. Practice Questions (${topicQuestions.length})` },
          { id: 'companies', label: `🏢 3. Company PYQs (${companyQs.length})` },
          { id: 'quiz', label: `🎯 4. Topic Quiz (${quizQuestions.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`btn ${activeTab === tab.id ? 'btn-violet' : 'btn-ghost'}`}
            style={{ padding: '8px 18px', fontSize: '13px', borderRadius: '8px', whiteSpace: 'nowrap' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: LEARN & THEORY */}
      {activeTab === 'learn' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="dashboard-widget-card">
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '14px' }}>
              💡 Key Concepts & Takeaways
            </h3>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-2)', lineHeight: '1.8', fontSize: '14px' }}>
              {topic.keyPoints.map((kp, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--text-1)' }}>{kp.split(':')[0]}</strong>
                  {kp.includes(':') ? `: ${kp.split(':')[1]}` : ''}
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-widget-card">
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '14px' }}>
              📌 Subtopics & Study Outline
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {topic.subtopics.map((sub, idx) => (
                <div key={idx} style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--text-1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{idx + 1}.</span> {sub}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button onClick={() => setActiveTab('practice')} className="btn btn-violet">
              Proceed to Practice Questions →
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PRACTICE QUESTIONS */}
      {activeTab === 'practice' && (
        <div>
          {/* Difficulty Filter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`btn ${selectedDifficulty === diff ? 'btn-violet' : 'btn-ghost'}`}
                  style={{ padding: '4px 12px', fontSize: '12px' }}
                >
                  {diff}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
              Showing {practiceQuestions.length} of {topicQuestions.length} questions
            </span>
          </div>

          {/* Question List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {practiceQuestions.length === 0 ? (
              <div className="dashboard-widget-card" style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: 'var(--text-3)' }}>No questions found matching the selected difficulty filter.</p>
              </div>
            ) : (
              practiceQuestions.map((q) => {
                const solved = isQuestionSolved(q.id);
                const isExpanded = expandedQuestionId === q.id;

                return (
                  <div key={q.id} className="dashboard-widget-card" style={{ padding: '16px 20px', borderLeft: solved ? '3px solid var(--green)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: '1' }}>
                        <input
                          type="checkbox"
                          checked={solved}
                          onChange={() => handleToggleSolved(q.id)}
                          style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer', accentColor: 'var(--green)' }}
                        />
                        <div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: solved ? 'var(--text-3)' : 'var(--text-1)', textDecoration: solved ? 'line-through' : 'none' }}>
                              {q.title}
                            </h4>
                            <span className={`pill-${q.difficulty.toLowerCase()}`} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px' }}>
                              {q.difficulty}
                            </span>
                            <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '4px', color: 'var(--text-3)' }}>
                              {q.type.toUpperCase()}
                            </span>
                          </div>

                          <p style={{ fontSize: '13px', color: 'var(--text-2)', margin: '4px 0 8px 0', lineHeight: '1.4' }}>
                            {q.description}
                          </p>

                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {q.tags.map((tag, idx) => (
                              <span key={idx} style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(99, 91, 255, 0.1)', color: 'var(--accent)', borderRadius: '3px' }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          className="btn btn-ghost"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          {isExpanded ? 'Hide Solution' : 'View Solution & Hint'}
                        </button>

                        <Link
                          href={`/workspace?problem=${encodeURIComponent(q.title)}`}
                          className="btn btn-violet"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Solve in Workspace →
                        </Link>
                      </div>
                    </div>

                    {/* Solution & Hint Drawer */}
                    {isExpanded && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase' }}>💡 Solution Hint</span>
                          <p style={{ fontSize: '13px', color: 'var(--text-1)', marginTop: '4px' }}>{q.solutionHint}</p>
                        </div>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: '700', textTransform: 'uppercase' }}>📖 Detailed Explanation</span>
                          <p style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '4px', lineHeight: '1.5' }}>{q.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: COMPANY PYQs */}
      {activeTab === 'companies' && (
        <div className="dashboard-widget-card">
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '8px' }}>
            🏢 Past Interview Questions for {topic.name}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '20px' }}>
            These questions were reported in actual technical interviews by top tech companies.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {companyQs.length === 0 ? (
              <p style={{ color: 'var(--text-3)', fontStyle: 'italic' }}>No company-specific interview tags logged yet for this topic.</p>
            ) : (
              companyQs.map((cq, idx) => {
                const q = QUESTIONS.find((item) => item.id === cq.questionId);
                const company = COMPANIES.find((c) => c.id === cq.companyId);
                if (!q || !company) return null;

                return (
                  <div key={idx} style={{
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        {company.logo}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-1)' }}>{company.name}</h4>
                          <span style={{ fontSize: '11px', color: 'var(--text-3)', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '4px' }}>
                            {cq.round || 'Technical Round'} ({cq.year || '2025'})
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '2px' }}>
                          {q.title} — <span style={{ color: 'var(--text-3)' }}>{q.description}</span>
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '11px', color: '#f0a500', background: 'rgba(240, 165, 0, 0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' }}>
                        Asked {cq.frequency} times
                      </span>
                      <Link href={`/companies/${company.id}`} className="btn btn-ghost" style={{ fontSize: '12px', padding: '4px 10px' }}>
                        View {company.name} Guide →
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: QUIZ & TEST */}
      {activeTab === 'quiz' && (
        <div className="dashboard-widget-card">
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '6px' }}>
            🎯 Interactive Quiz: {topic.name}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '20px' }}>
            Test your conceptual knowledge under non-interactive quiz conditions.
          </p>

          {quizQuestions.length === 0 ? (
            <p style={{ color: 'var(--text-3)' }}>No MCQ quiz questions available for this topic yet.</p>
          ) : quizSubmitted ? (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                {calculateQuizScore() === quizQuestions.length ? '🎉' : '📊'}
              </div>
              <h2 style={{ fontSize: '24px', color: 'var(--text-1)', fontWeight: '700' }}>
                Quiz Result: {calculateQuizScore()} / {quizQuestions.length}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-2)', margin: '8px 0 20px 0' }}>
                {calculateQuizScore() === quizQuestions.length
                  ? 'Perfect Score! You have mastered the theory of this topic.'
                  : 'Good effort! Review the incorrect answers below to strengthen your understanding.'}
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '30px' }}>
                <button onClick={handleResetQuiz} className="btn btn-violet">Retake Quiz</button>
                <button onClick={() => setActiveTab('practice')} className="btn btn-ghost">Practice Problems</button>
              </div>

              {/* Review */}
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {quizQuestions.map((q, idx) => {
                  const userAns = userAnswers[idx];
                  const isCorrect = userAns === q.correctOption;
                  return (
                    <div key={q.id} style={{
                      padding: '14px 18px',
                      borderRadius: '8px',
                      background: isCorrect ? 'rgba(62, 207, 142, 0.08)' : 'rgba(240, 68, 56, 0.08)',
                      border: `1px solid ${isCorrect ? 'var(--green)' : 'var(--red)'}`
                    }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-1)', marginBottom: '6px' }}>
                        {idx + 1}. {q.title}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '4px' }}>
                        Your answer: <strong style={{ color: isCorrect ? 'var(--green)' : 'var(--red)' }}>
                          {userAns !== undefined && q.options ? q.options[userAns] : 'Not answered'}
                        </strong>
                      </div>
                      {!isCorrect && (
                        <div style={{ fontSize: '13px', color: 'var(--green)' }}>
                          Correct answer: <strong>{q.options ? q.options[q.correctOption || 0] : ''}</strong>
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '6px' }}>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              {/* Question Stepper */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '12px', color: 'var(--text-3)' }}>
                <span>Question {quizIndex + 1} of {quizQuestions.length}</span>
                <span>Topic: {topic.name}</span>
              </div>

              {/* Active Quiz Question */}
              {quizQuestions[quizIndex] && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-1)', marginBottom: '16px', lineHeight: '1.4' }}>
                    {quizIndex + 1}. {quizQuestions[quizIndex].title}
                  </h4>

                  <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '20px' }}>
                    {quizQuestions[quizIndex].description}
                  </p>

                  {/* Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {quizQuestions[quizIndex].options?.map((opt, optIdx) => {
                      const isSelected = userAnswers[quizIndex] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleQuizOptionSelect(optIdx)}
                          style={{
                            textAlign: 'left',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: isSelected ? 'rgba(99, 91, 255, 0.2)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
                            color: 'var(--text-1)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <strong style={{ color: isSelected ? 'var(--accent)' : 'var(--text-3)', marginRight: '8px' }}>
                            {String.fromCharCode(65 + optIdx)}.
                          </strong>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      disabled={quizIndex === 0}
                      onClick={() => setQuizIndex((prev) => prev - 1)}
                      className="btn btn-ghost"
                      style={{ opacity: quizIndex === 0 ? 0.5 : 1 }}
                    >
                      ← Previous
                    </button>

                    {quizIndex === quizQuestions.length - 1 ? (
                      <button onClick={handleFinishQuiz} className="btn btn-violet">
                        Submit & View Score
                      </button>
                    ) : (
                      <button onClick={() => setQuizIndex((prev) => prev + 1)} className="btn btn-violet">
                        Next Question →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
