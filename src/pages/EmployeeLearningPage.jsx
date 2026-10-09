import { useState } from 'react'
import {
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Play,
  Target,
  TrendingUp,
} from 'lucide-react'

import { useAppContext } from '../context/useAppContext'
import AiAssessmentModal from '../components/learning/AiAssessmentModal'
import { recommendLearningPaths } from '../data/learningPaths'

function LearningPathCard({ path, record, onAdvanceProgress, onTakeAssessment }) {

  const progress = record?.progress || 0
  const isComplete = progress >= 100
  const assessmentScore = record?.assessmentScore

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="rounded-xl p-2.5 bg-emerald-50 text-emerald-600">
              <BookOpen size={18} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-950">{path.title}</h3>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {path.priority}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 font-mono">
                  Target L{path.targetLevel}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{path.reason}</p>
            </div>
          </div>
          <ArrowUpRight size={18} className="shrink-0 text-slate-300" />
        </div>

        {/* Modules List */}
        <div className="mt-4 space-y-1.5 rounded-xl bg-slate-50 p-3 text-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Curriculum Modules ({path.modules?.length || 4})
          </p>
          <div className="space-y-1">
            {path.modules?.map((m, idx) => {
              const moduleFinished = progress >= ((idx + 1) / path.modules.length) * 100
              return (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <span className={`flex items-center gap-1.5 ${moduleFinished ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                    <span className={`size-1.5 rounded-full ${moduleFinished ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    {m.title || m}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {moduleFinished ? '✓ Done' : m.duration || '40m'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600">Module Progress</span>
            <span className="font-mono font-extrabold text-emerald-600">{progress}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={13} />
              {path.duration}
            </span>
            <span>{isComplete ? 'All Modules Finished' : `${100 - progress}% remaining`}</span>
          </div>
        </div>

        {assessmentScore !== null && assessmentScore !== undefined && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
            <span className="flex items-center gap-1.5">
              <Award size={14} className="text-emerald-600" />
              Latest Assessment Score
            </span>
            <span className="font-mono text-sm">{assessmentScore}%</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onAdvanceProgress(path.id, 25)}
          disabled={isComplete}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-40 cursor-pointer shadow-xs"
        >
          {isComplete ? <CheckCircle2 size={15} /> : <Play size={15} />}
          <span>{isComplete ? 'Modules Complete' : progress > 0 ? 'Advance Next Module' : 'Start Path'}</span>
        </button>

        <button
          type="button"
          onClick={() => onTakeAssessment(path)}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 cursor-pointer shadow-2xs"
        >
          <Award size={15} className="text-emerald-600" />
          <span>{assessmentScore ? 'Retake AI Assessment' : 'Take AI Assessment'}</span>
        </button>
      </div>
    </div>
  )
}

function EmployeeLearningPage() {
  const { currentEmployee, learningPaths, learningRecords, updateLearningProgress, submitEvidence } = useAppContext()
  const [activeModalPath, setActiveModalPath] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const recommendedPaths = recommendLearningPaths(currentEmployee, learningPaths)
  const empRecords = learningRecords[currentEmployee?.id] || {}

  const handleAdvance = (pathId, delta) => {
    updateLearningProgress({
      employeeId: currentEmployee.id,
      pathId,
      progressDelta: delta,
    })
  }

  const handleSubmitEvidenceFromAssessment = (skillId, evidenceData) => {
    submitEvidence({
      employeeId: currentEmployee.id,
      skillId,
      evidenceData,
    })
    updateLearningProgress({
      employeeId: currentEmployee.id,
      pathId: activeModalPath.path.id,
      setAbsoluteProgress: 100,
      assessmentScore: evidenceData.verificationScore,
    })
    setToastMessage(`✓ Assessment score (${evidenceData.verificationScore}%) submitted for verification review!`)
    setTimeout(() => setToastMessage(null), 5000)
  }

  const priorityPath = recommendedPaths[0]

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-slate-950 p-4 text-xs font-bold text-emerald-300 shadow-2xl">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                My Learning Pathways
              </p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
                {currentEmployee?.name} · {currentEmployee?.id}
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
              Personalized Learning Intelligence
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Grounded in your unverified competency gaps. Advance structured modules, take demo assessments, and submit proof for reviewer signoff.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Curriculum Engine Active</span>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <TrendingUp size={18} />
            </span>
            <span className="text-xs font-bold text-emerald-600">Active</span>
          </div>
          <p className="mt-4 text-2xl font-extrabold text-slate-950">{recommendedPaths.length}</p>
          <p className="mt-1 text-sm font-bold text-slate-700">Curated Learning Paths</p>
          <p className="mt-1 text-xs text-slate-400">Aligned with open project requirements</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
              <Target size={18} />
            </span>
            <span className="text-xs font-bold text-rose-600">Priority Gap</span>
          </div>
          <p className="mt-4 text-2xl font-extrabold text-slate-950 truncate">
            {priorityPath?.skillName || 'No outstanding gaps'}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-700">Current Role Focus</p>
          <p className="mt-1 text-xs text-slate-400">
            {priorityPath
              ? `Current level ${priorityPath.currentLevel} · target level ${priorityPath.targetLevel}`
              : 'Your mapped competencies meet their course targets'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Award size={18} />
            </span>
            <span className="text-xs font-bold text-slate-500">Evidence Lifecycle</span>
          </div>
          <p className="mt-4 text-2xl font-extrabold text-slate-950">AI Assessment</p>
          <p className="mt-1 text-sm font-bold text-slate-700">Proctored & Validated</p>
          <p className="mt-1 text-xs text-slate-400">Scores queue for reviewer approval</p>
        </div>
      </div>

      {/* Pathways Grid */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
              AI Recommendations
            </p>
            <h3 className="mt-1 text-xl font-extrabold text-slate-950">
              Recommended paths for {currentEmployee?.name}
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {recommendedPaths.length} recommended
          </span>
        </div>

        {recommendedPaths.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
          {recommendedPaths.map((path) => (
            <LearningPathCard
              key={path.id}
              path={path}
              record={empRecords[path.id]}
              onAdvanceProgress={handleAdvance}
              onTakeAssessment={(target) =>
                setActiveModalPath({ employeeId: currentEmployee.id, path: target })
              }
            />
          ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <CheckCircle2 size={28} className="mx-auto text-emerald-600" />
            <h4 className="mt-3 text-base font-bold text-slate-900">No course-mapped skill gaps</h4>
            <p className="mt-1 text-sm text-slate-500">
              There are no catalogue courses targeting a below-target or unverified competency for this employee.
            </p>
          </div>
        )}
      </section>

      {/* Notice Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-800">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
        <p>
          <span className="font-bold">Verification Rule:</span> Completing a course or assessment creates an evidence record in <strong>Pending Review</strong>. Official competency verification and the 15% matching score contribution only activate after explicit reviewer signoff.
        </p>
      </div>

      {/* Assessment Modal */}
      {activeModalPath?.employeeId === currentEmployee?.id && (
        <AiAssessmentModal
          key={`${activeModalPath.employeeId}:${activeModalPath.path.id}`}
          path={activeModalPath.path}
          employee={currentEmployee}
          onClose={() => setActiveModalPath(null)}
          onSubmitEvidenceForReview={handleSubmitEvidenceFromAssessment}
        />
      )}
    </div>
  )
}

export default EmployeeLearningPage
