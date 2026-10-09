import {
  CheckCircle2,
  CircleAlert,
  Compass,
  Target,
  TrendingUp,
  UserRound,
} from 'lucide-react'

import { useAppContext } from '../context/useAppContext'

function ScoreCard({ icon: Icon, label, value, note, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className={`inline-flex rounded-xl p-2.5 ${tone}`}>
        <Icon size={18} />
      </span>
      <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-bold text-slate-700">{label}</p>
      <p className="mt-1 text-xs text-slate-400">{note}</p>
    </div>
  )
}

function EmployeeCompetencyPage() {
  const { currentEmployee } = useAppContext()
  const comps = currentEmployee?.competencies || []
  const totalCount = comps.length || 1
  const avgLevel =
    comps.length > 0
      ? (comps.reduce((acc, c) => acc + c.level, 0) / comps.length).toFixed(1)
      : '0.0'
  const overallPct = Math.round((Number(avgLevel) / 5) * 100)
  const verifiedCount = comps.filter((c) => c.status === 'verified' || c.verified).length
  const roleReadiness = Math.min(
    100,
    Math.round(overallPct * 0.6 + (verifiedCount / totalCount) * 40),
  )

  // Identify strengths (level >= 4 or verified) and gaps (level < 3 or unverified)
  const strengths = comps.filter((c) => c.level >= 4 || (c.verified && c.level >= 3))
  const gaps = comps
    .filter((c) => c.level < 3 || (!c.verified && c.status !== 'pending'))
    .sort((a, b) => a.level - b.level)
  const primaryGap = gaps[0]

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-slate-900 text-lg font-black text-white">
              {currentEmployee?.avatar ||
                (currentEmployee?.name || 'EM').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                  My Competency
                </p>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {currentEmployee?.id}
                </span>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
                My Competency
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {currentEmployee?.name}{' '}
                <span className="mx-1 text-slate-300">/</span>{' '}
                {currentEmployee?.role}
              </p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Understand how your current capabilities map to your target role and where to
                improve next.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
            <span className="size-2 rounded-full bg-blue-500" />
            Personal competency profile
          </div>
        </div>
      </section>

      {/* KPI Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <ScoreCard
          icon={Target}
          label="Overall Competency"
          value={`${overallPct}%`}
          note={`Average level ${avgLevel} / 5 across ${totalCount} skills`}
          tone="bg-emerald-50 text-emerald-600"
        />
        <ScoreCard
          icon={TrendingUp}
          label="Role Readiness"
          value={`${roleReadiness}%`}
          note={`${currentEmployee?.role || 'Target role'} · ${verifiedCount} verified of ${totalCount}`}
          tone="bg-blue-50 text-blue-600"
        />
      </div>

      {/* Main Content: Skills + Role readiness */}
      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        {/* Skills list */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                My competency profile
              </p>
              <h2 className="mt-1 text-lg font-extrabold text-slate-950">Skill levels</h2>
              <p className="mt-1 text-xs text-slate-500">
                Your current proficiency across the capabilities used in your target role.
              </p>
            </div>
            <UserRound size={18} className="text-slate-400" />
          </div>
          <div className="mt-6 space-y-5">
            {comps.map((comp) => {
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
                : pct >= 70
                ? 'bg-emerald-500'
                : pct >= 55
                ? 'bg-amber-400'
                : 'bg-rose-400'

              return (
                <div key={comp.skillId}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-700 flex items-center gap-2">
                      {comp.skill || comp.skillName || comp.skillId}
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-700'
                            : isPending
                            ? 'bg-amber-50 text-amber-700'
                            : isRejected
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isVerified
                          ? '✓ Verified'
                          : isPending
                          ? 'Pending'
                          : isRejected
                          ? 'Revision'
                          : 'Unverified'}
                      </span>
                    </span>
                    <span
                      className={`font-extrabold ${
                        pct >= 70
                          ? 'text-emerald-600'
                          : pct >= 55
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${tone} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Role readiness */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-blue-600" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                Target role
              </p>
              <h2 className="mt-1 text-lg font-extrabold text-slate-950">Role readiness</h2>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
            <p className="text-xs font-semibold text-slate-400">{currentEmployee?.role}</p>
            <p className="mt-2 text-4xl font-black">
              {roleReadiness}
              <span className="text-xl text-emerald-400">%</span>
            </p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{ width: `${roleReadiness}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-300">
              {roleReadiness >= 80
                ? 'Excellent readiness. Continue building verified evidence to maintain confidence.'
                : primaryGap
                ? `Closing the ${primaryGap.skill || primaryGap.skillId} gap will improve your readiness.`
                : 'Building verified competency evidence will improve your readiness.'}
            </p>
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-xs font-semibold leading-5 text-blue-700">
            <TrendingUp size={15} className="shrink-0" />
            Target role readiness is based on your current skill levels and verified evidence.
          </div>
        </section>
      </div>

      {/* Strengths, Gaps, Next Steps */}
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-emerald-800">
            <CheckCircle2 size={17} />
            Strengths
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Capabilities already supporting your role.
          </p>
          <div className="mt-4 space-y-2">
            {strengths.length > 0 ? (
              strengths.map((c) => (
                <div
                  key={c.skillId}
                  className="rounded-xl bg-white/80 px-3 py-3 text-sm font-bold text-slate-700"
                >
                  {c.skill || c.skillId}
                  <span className="float-right text-emerald-700">
                    {Math.round((c.level / 5) * 100)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">
                Build and verify skills to see your strengths here.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-rose-800">
            <CircleAlert size={17} />
            Skill gaps
          </h2>
          <p className="mt-1 text-xs text-slate-500">Priority capabilities to strengthen.</p>
          <div className="mt-4 space-y-2">
            {gaps.length > 0 ? (
              gaps.slice(0, 4).map((c) => (
                <div
                  key={c.skillId}
                  className="rounded-xl bg-white/80 px-3 py-3 text-sm font-bold text-slate-700"
                >
                  {c.skill || c.skillId}
                  <span
                    className={`float-right ${
                      c.level <= 2 ? 'text-rose-700' : 'text-amber-700'
                    }`}
                  >
                    {Math.round((c.level / 5) * 100)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">
                No significant gaps detected. Keep building!
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-950">What to improve next</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            A focused next step for your target role.
          </p>
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            {primaryGap ? (
              <>
                <p className="text-sm font-bold text-slate-800">
                  Build {primaryGap.skill || primaryGap.skillId} fundamentals
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  This is your largest current gap at Level {primaryGap.level} and can unlock
                  stronger project readiness.
                </p>
                <span className="mt-3 inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700">
                  Highest priority
                </span>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-slate-800">
                  Maintain and verify current skills
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Your skill levels are strong. Focus on submitting evidence for
                  reviewer verification.
                </p>
                <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Well positioned
                </span>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default EmployeeCompetencyPage
