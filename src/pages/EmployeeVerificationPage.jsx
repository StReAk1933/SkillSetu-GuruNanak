import { useState } from 'react'
import {
  BadgeCheck,
  CheckCircle2,
  CircleAlert,
  Clock,
  FileCheck2,
  Send,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react'

import { useAppContext } from '../context/useAppContext'

function VerificationItem({ comp, onSubmit, onResubmit, isSubmitting }) {
  const isVerified = comp.status === 'verified' || comp.verified
  const isPending = comp.status === 'pending'
  const isRejected = comp.status === 'rejected'

  const statusLabel = isVerified
    ? 'Verified'
    : isPending
    ? 'Pending Review'
    : isRejected
    ? 'Revision Needed'
    : 'Needs Verification'

  const statusTone = isVerified
    ? 'bg-emerald-50 text-emerald-700'
    : isPending
    ? 'bg-amber-50 text-amber-700'
    : isRejected
    ? 'bg-rose-50 text-rose-700'
    : 'bg-slate-100 text-slate-600'

  const iconTone = isVerified
    ? 'bg-emerald-50 text-emerald-600'
    : isPending
    ? 'bg-amber-50 text-amber-600'
    : isRejected
    ? 'bg-rose-50 text-rose-600'
    : 'bg-slate-100 text-slate-500'

  const pct = Math.round((comp.level / 5) * 100)

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${iconTone}`}>
          {isVerified ? (
            <BadgeCheck size={20} />
          ) : isPending ? (
            <Clock size={20} className="animate-pulse" />
          ) : isRejected ? (
            <CircleAlert size={20} />
          ) : (
            <CircleAlert size={20} />
          )}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-800">
              {comp.skill || comp.skillName || comp.skillId}
            </h3>
            <span className="font-mono text-xs font-bold text-slate-400">
              Level {comp.level} ({pct}%)
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Evidence: {comp.evidence?.type || comp.verificationType || 'Not submitted yet'}
          </p>
          {isRejected && comp.evidence?.reviewReason && (
            <p className="mt-1 text-xs font-semibold text-rose-600">
              Reason: {comp.evidence.reviewReason}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:shrink-0">
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusTone}`}>
          {statusLabel}
        </span>

        {/* Show submit button only for unverified skills */}
        {!isVerified && !isPending && !isRejected && (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onSubmit(comp.skillId)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-600 disabled:opacity-40 cursor-pointer shadow-xs"
          >
            <Send size={13} />
            Submit Proof
          </button>
        )}

        {/* Show resubmit button for rejected skills */}
        {isRejected && (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onResubmit(comp.skillId)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 transition hover:bg-amber-100 disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw size={13} />
            Resubmit
          </button>
        )}
      </div>
    </div>
  )
}

function EmployeeVerificationPage() {
  const { currentEmployee, submitEvidence, resubmitEvidence } = useAppContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const comps = currentEmployee?.competencies || []
  const verifiedCount = comps.filter((c) => c.status === 'verified' || c.verified).length
  const pendingCount = comps.filter((c) => c.status === 'pending').length
  const rejectedCount = comps.filter((c) => c.status === 'rejected').length
  const unverifiedCount = comps.filter(
    (c) => c.status === 'unverified' || (!c.verified && c.status !== 'pending' && c.status !== 'rejected'),
  ).length
  const totalCount = comps.length || 1
  const verifiedPct = Math.round((verifiedCount / totalCount) * 100)

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleSubmit = (skillId) => {
    setIsSubmitting(true)
    const comp = comps.find((c) => c.skillId === skillId)
    submitEvidence({
      employeeId: currentEmployee.id,
      skillId,
      evidenceData: {
        type: 'Self-initiated evidence submission',
        source: 'SkillSetu Employee Portal',
        summary: `${currentEmployee.name} submitted proof for ${comp?.skill || skillId}. Awaiting reviewer approval.`,
      },
    })
    triggerToast(`✓ Evidence for ${comp?.skill || skillId} submitted! Awaiting reviewer approval.`)
    setTimeout(() => setIsSubmitting(false), 500)
  }

  const handleResubmit = (skillId) => {
    setIsSubmitting(true)
    const comp = comps.find((c) => c.skillId === skillId)
    resubmitEvidence({
      employeeId: currentEmployee.id,
      skillId,
      updatedEvidenceData: {
        type: 'Revised evidence submission',
        source: 'SkillSetu Employee Portal',
        summary: `${currentEmployee.name} resubmitted revised proof for ${comp?.skill || skillId} after revision.`,
      },
    })
    triggerToast(`✓ Revised evidence for ${comp?.skill || skillId} resubmitted for review!`)
    setTimeout(() => setIsSubmitting(false), 500)
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-slate-950 p-4 text-xs font-bold text-emerald-300 shadow-2xl">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                My Verification
              </p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                {currentEmployee?.name} · {currentEmployee?.id}
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
              My Skill Verification
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Build trusted evidence for the skills in your competency profile. Submit proof and track reviewer decisions.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
            <ShieldCheck size={15} />
            Personal evidence record
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="inline-flex rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
            <BadgeCheck size={18} />
          </span>
          <p className="mt-4 text-2xl font-extrabold text-slate-950">
            {verifiedCount}/{totalCount}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-700">Verified Skills</p>
          <p className="mt-1 text-xs text-slate-400">Trusted competencies</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="inline-flex rounded-xl bg-blue-50 p-2.5 text-blue-600">
            <ShieldCheck size={18} />
          </span>
          <p className="mt-4 text-2xl font-extrabold text-slate-950">{verifiedPct}%</p>
          <p className="mt-1 text-sm font-bold text-slate-700">Verification Progress</p>
          <p className="mt-1 text-xs text-slate-400">Evidence-backed profile</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="inline-flex rounded-xl bg-amber-50 p-2.5 text-amber-600">
            <Clock size={18} />
          </span>
          <p className="mt-4 text-2xl font-extrabold text-slate-950">{pendingCount}</p>
          <p className="mt-1 text-sm font-bold text-slate-700">Pending Review</p>
          <p className="mt-1 text-xs text-slate-400">Awaiting reviewer decision</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="inline-flex rounded-xl bg-rose-50 p-2.5 text-rose-600">
            <CircleAlert size={18} />
          </span>
          <p className="mt-4 text-2xl font-extrabold text-slate-950">
            {unverifiedCount + rejectedCount}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-700">Needs Proof</p>
          <p className="mt-1 text-xs text-slate-400">
            {rejectedCount > 0 ? `${rejectedCount} returned for revision` : 'Submit evidence'}
          </p>
        </div>
      </div>

      {/* Competency Evidence List */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
              Evidence layer
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-950">
              My competency evidence
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Which of your skills are trusted and what still needs proof.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {verifiedCount} of {totalCount} trusted
          </span>
        </div>
        <div className="space-y-3">
          {comps.map((comp) => (
            <VerificationItem
              key={comp.skillId}
              comp={comp}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onResubmit={handleResubmit}
            />
          ))}
        </div>
      </section>

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-800">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
        <p>
          <span className="font-bold">Verification Rule:</span> Submitting evidence creates a{' '}
          <strong>Pending Review</strong> record. Only a reviewer can approve or reject it.
          Verified skills carry a 15% matching bonus in project staffing.
        </p>
      </div>

      {/* Evidence explainer for submitted items */}
      {comps.some((c) => c.evidence?.auditTrail?.length > 0) && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileCheck2 size={16} className="text-slate-500" />
            <h3 className="text-sm font-extrabold text-slate-950">Recent Evidence Activity</h3>
          </div>
          <div className="space-y-2">
            {comps
              .filter((c) => c.evidence?.auditTrail?.length > 0)
              .flatMap((c) =>
                (c.evidence.auditTrail || []).slice(-2).map((entry, idx) => (
                  <div
                    key={`${c.skillId}-trail-${idx}`}
                    className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span className="font-bold text-slate-700 truncate">
                        {c.skill || c.skillId}
                      </span>
                      <span className="text-slate-500 truncate">{entry.action}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {entry.date}
                    </span>
                  </div>
                )),
              )}
          </div>
        </section>
      )}
    </div>
  )
}

export default EmployeeVerificationPage
