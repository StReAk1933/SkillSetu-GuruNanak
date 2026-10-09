import { useState, useEffect } from 'react'
import {
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
  Loader2,
  Send,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react'

export default function AiAssessmentModal({
  path,
  employee,
  onClose,
  onSubmitEvidenceForReview,
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [gradeError, setGradeError] = useState(null)
  const [retryAttempt, setRetryAttempt] = useState(0)
  const [quizData, setQuizData] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [grading, setGrading] = useState(false)
  const [gradeResult, setGradeResult] = useState(null)
  const [evidenceSubmitted, setEvidenceSubmitted] = useState(false)

  // Fetch or generate quiz from server
  useEffect(() => {
    let isMounted = true

    async function loadQuiz() {
      setLoading(true)
      setError(null)
      setGradeError(null)
      setQuizData(null)
      setSelectedAnswers({})
      setGradeResult(null)
      setEvidenceSubmitted(false)

      const competency = employee.competencies?.find((item) => item.skillId === path.skillId)
      try {
        const res = await fetch('/api/quiz/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pathId: path.id,
            employeeId: employee.id,
            employeeCompetency: {
              level: competency?.level ?? 0,
              status: competency?.status || (competency?.verified ? 'verified' : competency ? 'unverified' : 'missing'),
            },
            difficulty: path.assessment?.difficulty || 'Intermediate',
          }),
        })

        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const data = await res.json()
        if (isMounted) {
          setQuizData(data)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load assessment')
          setLoading(false)
        }
      }
    }

    loadQuiz()

    return () => {
      isMounted = false
    }
  }, [path.id, path.skillId, path.assessment?.difficulty, employee.id, employee.competencies, retryAttempt])

  const handleSelect = (questionId, optionIndex) => {
    if (gradeResult) return // Locked once graded
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  const handleSubmitQuiz = async () => {
    if (!quizData) return
    const answers = Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }))

    if (answers.length < quizData.questions.length) {
      alert(`Please answer all ${quizData.questions.length} questions before submitting.`)
      return
    }

    setGrading(true)
    setGradeError(null)
    try {
      const res = await fetch('/api/quiz/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quizData.quizId,
          answers,
        }),
      })

      if (!res.ok) throw new Error(`Grading error ${res.status}`)
      const result = await res.json()
      setGradeResult(result)
    } catch {
      setGradeError('We could not grade this assessment. Please try submitting again.')
    } finally {
      setGrading(false)
    }
  }

  const handleSendAsEvidence = () => {
    if (!gradeResult || evidenceSubmitted) return
    onSubmitEvidenceForReview?.(path.skillId, {
      type: 'Technical assessment',
      verificationScore: gradeResult.score,
      source: 'SkillSetu Demo Assessment',
      issuer: 'SkillSetu prototype',
      credentialId: `DEMO-ASSESS-${path.skillId.toUpperCase()}-${Date.now().toString().slice(-5)}`,
      summary: `Completed the demo assessment for ${path.title}. Scored ${gradeResult.score}% (${gradeResult.correctCount}/${gradeResult.totalQuestions} questions correct).`,
      artifacts: [
        {
          name: `Demo Assessment Scorecard (${gradeResult.score}%)`,
          type: 'assessment-result',
          ref: 'local-demo',
        },
      ],
    })
    setEvidenceSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Dialog container */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <Award size={19} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-950">
                  {path.title}
                </h3>
                {quizData?.isAiGenerated ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                    <Sparkles size={11} /> Gemini 2.5 Flash
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  Built-in demo questions
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {employee.name} • Target Level {path.targetLevel || 4} Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 size={32} className="animate-spin text-emerald-600" />
              <p className="mt-3 text-sm font-bold text-slate-700">Generating assessment questions...</p>
              <p className="mt-1 text-xs text-slate-400">Grounded in SkillSetu competency standards</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
              <p className="font-bold">Failed to initialize assessment:</p>
              <p className="mt-1">{error}</p>
              <button
                type="button"
                onClick={() => setRetryAttempt((attempt) => attempt + 1)}
                className="mt-3 rounded-lg bg-rose-700 px-3 py-2 font-bold text-white hover:bg-rose-800"
              >
                Retry assessment
              </button>
            </div>
          )}

          {!loading && quizData && !gradeResult && (
            <div className="space-y-6">
              {gradeError && (
                <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                  {gradeError}
                </div>
              )}
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs text-blue-900">
                <p className="font-bold flex items-center gap-1.5">
                  <HelpCircle size={15} /> Assessment Instructions:
                </p>
                <p className="mt-1 text-[11px] leading-5 text-blue-800">
                  Select the best answer for each question. A score of <strong>70% or higher</strong> can be submitted as supporting evidence for reviewer signoff.
                </p>
              </div>

              {quizData.questions.map((q, qIndex) => (
                <div key={q.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Question {qIndex + 1} of {quizData.questions.length}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{q.question}</p>

                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedAnswers[q.id] === optIndex
                      return (
                        <button
                          key={optIndex}
                          type="button"
                          onClick={() => handleSelect(q.id, optIndex)}
                          className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50/80 font-bold text-emerald-950 ring-1 ring-emerald-400'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'border border-slate-300 bg-slate-100 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grade Results Screen */}
          {gradeResult && (
            <div className="space-y-5">
              <div
                className={`rounded-2xl border p-5 text-center ${
                  gradeResult.passed
                    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
                    : 'border-rose-200 bg-rose-50/70 text-rose-950'
                }`}
              >
                <span
                  className={`mx-auto grid size-12 place-items-center rounded-2xl ${
                    gradeResult.passed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {gradeResult.passed ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </span>
                <h4 className="mt-3 text-xl font-black">
                  {gradeResult.passed ? 'Assessment Passed!' : 'Assessment Incomplete'}
                </h4>
                <p className="mt-1 text-3xl font-black tracking-tight">
                  {gradeResult.score}%
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Answered {gradeResult.correctCount} of {gradeResult.totalQuestions} questions correctly (Pass threshold: 70%)
                </p>

                {gradeResult.passed ? (
                  <div className="mt-4 rounded-xl bg-white/90 p-3.5 text-xs text-slate-800 border border-emerald-200">
                    <p className="font-bold text-emerald-800">
                      ✓ Ready for Competency Verification Submission
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-600">
                      Completing this assessment does <strong>not automatically verify</strong> the competency. You can submit this verified score to the reviewer queue where an authorized lead will inspect and sign off.
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-rose-700">
                    Review the learning modules and retry the assessment to achieve a passing score.
                  </p>
                )}
              </div>

              {/* Explanations Breakdown */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Question Review & Explanations
                </h5>
                {gradeResult.details.map((d, i) => (
                  <div
                    key={d.questionId}
                    className={`rounded-xl border p-3 text-xs ${
                      d.isCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-900">
                        {i + 1}. {d.question}
                      </p>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          d.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {d.isCorrect ? '✓ Correct' : '✕ Incorrect'}
                      </span>
                    </div>
                    {d.explanation && (
                      <p className="mt-1.5 text-[11px] text-slate-600 leading-4 italic">
                        Explanation: {d.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            {gradeResult ? 'Close' : 'Cancel'}
          </button>

          {!gradeResult ? (
            <button
              type="button"
              disabled={loading || grading || !quizData}
              onClick={handleSubmitQuiz}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
            >
              {grading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Evaluating answers...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>Submit & Grade Assessment</span>
                </>
              )}
            </button>
          ) : gradeResult.passed ? (
            <button
              type="button"
              disabled={evidenceSubmitted}
              onClick={handleSendAsEvidence}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:bg-emerald-200 disabled:text-emerald-800"
            >
              {evidenceSubmitted ? (
                <>
                  <Clock size={14} />
                  <span>Submitted (Pending Review) ✓</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Submit as Verification Evidence</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setGradeResult(null)
                setSelectedAnswers({})
              }}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              Retry Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
