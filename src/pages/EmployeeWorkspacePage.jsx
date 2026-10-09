import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Play,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'

import { useAppContext } from '../context/useAppContext'
import { calculateEmployeeMatch } from '../utils/matching'

function KpiCard({ icon: Icon, label, value, note, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between">
        <span className={`rounded-xl p-2.5 ${tone}`}>
          <Icon size={18} />
        </span>
        <TrendingUp size={16} className="text-emerald-500" />
      </div>
      <p className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-bold text-slate-700">{label}</p>
      <p className="mt-1 text-xs text-slate-400">{note}</p>
    </div>
  )
}

function SkillGapCard({ competencies = [] }) {
  const primaryGap = competencies.find((c) => !c.verified) || competencies[0]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
            My competency profile
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-slate-950">Skill gap snapshot</h2>
          <p className="mt-1 text-xs text-slate-500">Current proficiency and verification status against role expectations.</p>
        </div>
        <span className="rounded-lg bg-slate-100 p-2 text-slate-500">
          <Target size={17} />
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {competencies.map((comp) => {
          const pct = Math.round((comp.level / 5) * 100)
          const isVerified = comp.status === 'verified' || comp.verified
          const isPending = comp.status === 'pending'
          const isRejected = comp.status === 'rejected'

          const tone = isVerified
            ? 'bg-emerald-500'
            : isPending
            ? 'bg-amber-400'
            : isRejected
            ? 'bg-rose-400'
            : 'bg-slate-300'

          return (
            <div key={comp.skillId}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  {comp.skill || comp.skillName || comp.skillId}
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-extrabold uppercase ${
                      isVerified
                        ? 'bg-emerald-50 text-emerald-700'
                        : isPending
                        ? 'bg-amber-50 text-amber-700'
                        : isRejected
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isVerified ? '✓ Verified' : isPending ? 'Pending' : isRejected ? 'Revision' : 'Unverified'}
                  </span>
                </span>
                <span className="font-mono font-extrabold text-slate-700">
                  Level {comp.level}/5 ({pct}%)
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${tone} transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {primaryGap && (
        <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
          <CircleAlert size={14} className="text-amber-500 shrink-0" />
          <span>
            <strong>{primaryGap.skill || primaryGap.skillId}</strong> is an unverified growth area requiring proof.
          </span>
        </div>
      )}
    </section>
  )
}

function LearningCard({ employee, learningPaths, learningRecords, onStartLearning }) {
  const [started, setStarted] = useState(false)
  const empRecords = learningRecords[employee?.id] || {}
  const targetPath = learningPaths[0]
  const record = empRecords[targetPath?.id] || { progress: 0 }

  const handleStart = () => {
    setStarted(true)
    onStartLearning?.(targetPath.id)
  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-slate-900 p-5 text-white shadow-sm sm:p-6 flex flex-col justify-between">
      <div className="absolute -right-8 -top-8 size-32 rounded-full border-[18px] border-emerald-400/10" />
      <div className="relative">
        <div className="flex items-center gap-2 text-emerald-300">
          <span className="rounded-lg bg-emerald-400/15 p-2">
            <Sparkles size={17} />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
            Recommended Learning Path
          </span>
        </div>
        <h2 className="mt-4 max-w-sm text-2xl font-extrabold tracking-tight">
          {targetPath?.title || 'Cybersecurity & Compliance'}
        </h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
          {targetPath?.reason ||
            'Recommended because this is a critical requirement for open public sector projects.'}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-400 cursor-pointer shadow-sm"
          >
            {started || record.progress > 0 ? <CheckCircle2 size={16} /> : <Play size={16} />}
            <span>
              {record.progress > 0 ? `Continue Learning (${record.progress}%)` : 'Start Learning'}
            </span>
          </button>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Clock3 size={14} />
            {targetPath?.duration || '4 weeks · 8 modules'}
          </span>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-800 pt-3">
        <p className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5">
          <CheckCircle2 size={13} />
          <span>Complete modules and submit assessment evidence to earn verified status.</span>
        </p>
      </div>
    </section>
  )
}

function VerificationSection({ competencies = [] }) {
  const verifiedCount = competencies.filter((c) => c.status === 'verified' || c.verified).length

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
            Evidence layer
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-slate-950">Competency verification</h2>
          <p className="mt-1 text-xs text-slate-500">
            Your verified skills carry 15% bonus weight in real-work project matching.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
          {verifiedCount} of {competencies.length} verified
        </span>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {competencies.map((comp) => {
          const isVerified = comp.status === 'verified' || comp.verified
          const isPending = comp.status === 'pending'
          const isRejected = comp.status === 'rejected'

          return (
            <div
              key={comp.skillId}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                {isVerified ? (
                  <BadgeCheck size={18} className="shrink-0 text-emerald-500" />
                ) : isPending ? (
                  <CircleAlert size={18} className="shrink-0 text-amber-500 animate-pulse" />
                ) : isRejected ? (
                  <CircleAlert size={18} className="shrink-0 text-rose-500" />
                ) : (
                  <CircleAlert size={18} className="shrink-0 text-slate-400" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800">{comp.skill || comp.skillId}</p>
                  <p className="truncate text-[11px] text-slate-400">
                    {comp.evidence?.type || comp.verificationType || 'Self reported'}
                  </p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  isVerified
                    ? 'bg-emerald-50 text-emerald-700'
                    : isPending
                    ? 'bg-amber-50 text-amber-700'
                    : isRejected
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isVerified ? 'Verified' : isPending ? 'Pending' : isRejected ? 'Revision' : 'Unverified'}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function RecommendedWork({ employee, projects = [] }) {
  const matchResult = useMemo(() => {
    if (!employee || projects.length === 0) return null
    return calculateEmployeeMatch(employee, projects[0])
  }, [employee, projects])

  const project = projects[0]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
            Next opportunity
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-slate-950">Recommended work</h2>
          <p className="mt-1 text-xs text-slate-500">
            Staffing match dynamically calculated from your verified competency profile.
          </p>
        </div>
        <BriefcaseBusiness size={19} className="text-slate-400" />
      </div>

      {project && matchResult && (
        <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {matchResult.finalScore}% match
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {project.status}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-slate-950">{project.name}</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {project.client} · {project.timeline}
              </p>
            </div>
            <ArrowUpRight size={20} className="text-emerald-600" />
          </div>

          <div className="mt-5 grid gap-4 border-t border-emerald-100 pt-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Matched verified skills ({matchResult.verifiedSkills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.verifiedSkills.map((skill) => (
                  <span key={skill.skillId} className="rounded-md bg-white px-2 py-1 text-[11px] font-bold text-emerald-700">
                    ✓ {skill.skillId}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Growth skills ({matchResult.weakSkills.length + matchResult.missingSkills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[...matchResult.weakSkills, ...matchResult.missingSkills].map((skill) => (
                  <span key={skill.skillId} className="rounded-md bg-white px-2 py-1 text-[11px] font-bold text-amber-700">
                    ! {skill.skillId}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-bold text-slate-700">Algorithm Breakdown:</span>
            <span>Coverage {matchResult.scoreBreakdown.skillCoverage}% + Verification {matchResult.scoreBreakdown.verification}% + Availability {matchResult.scoreBreakdown.availability}%</span>
          </div>
        </div>
      )}
    </section>
  )
}

function EmployeeWorkspacePage() {
  const { currentEmployee, projects, learningPaths, learningRecords, updateLearningProgress } = useAppContext()

  const comps = currentEmployee?.competencies || []
  const verifiedCount = comps.filter((c) => c.status === 'verified' || c.verified).length
  const totalCount = comps.length || 1
  const avgLevel = comps.length > 0 ? (comps.reduce((acc, c) => acc + c.level, 0) / comps.length).toFixed(1) : '3.0'
  const overallPct = Math.round((Number(avgLevel) / 5) * 100)

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-slate-900 text-lg font-black text-white">
              {currentEmployee?.avatar || 'AS'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                  Employee workspace
                </p>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
                  {currentEmployee?.id || 'EMP001'}
                </span>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
                {currentEmployee?.name || 'Aarav Sharma'}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {currentEmployee?.role} <span className="mx-1 text-slate-300">/</span> {currentEmployee?.department}
              </p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Your personal view of capability, learning paths, evidence verification, and project staffing matches.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Profile live & synced with matching algorithm</span>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Target}
          label="Overall Competency"
          value={`${overallPct}%`}
          note={`Average level ${avgLevel} / 5`}
          tone="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          icon={TrendingUp}
          label="Verified Trust Rate"
          value={`${Math.round((verifiedCount / totalCount) * 100)}%`}
          note="Backed by validated proof"
          tone="bg-blue-50 text-blue-600"
        />
        <KpiCard
          icon={BadgeCheck}
          label="Verified Skills"
          value={`${verifiedCount}/${totalCount}`}
          note="Eligible for matching bonus"
          tone="bg-violet-50 text-violet-600"
        />
        <KpiCard
          icon={BookOpen}
          label="Learning Paths"
          value={learningPaths.length}
          note="Targeted to closed gaps"
          tone="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <SkillGapCard competencies={comps} />
        <LearningCard
          employee={currentEmployee}
          learningPaths={learningPaths}
          learningRecords={learningRecords}
          onStartLearning={(pathId) =>
            updateLearningProgress({
              employeeId: currentEmployee.id,
              pathId,
              progressDelta: 25,
            })
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <VerificationSection competencies={comps} />
        <RecommendedWork employee={currentEmployee} projects={projects} />
      </div>
    </div>
  )
}

export default EmployeeWorkspacePage
