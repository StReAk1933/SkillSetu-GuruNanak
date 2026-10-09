import { useState } from 'react'
import {
  CheckCircle2,
  Clock,
  History,
  RotateCcw,
  ShieldAlert,
  UserCheck,
  X,
  XCircle,
} from 'lucide-react'


import VerificationBadge from './VerificationBadge'

function VerificationDetail({
  competency,
  employee,
  onClose,
  onQuickVerify,
  onApprove,
  onReject,
  onAddEvidence,
  isReviewer = true,
}) {
  const [rejecting, setRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  if (!competency) return null

  const { skill, level, status, verified, evidence } = competency
  const isVerified = status === 'verified' || verified === true
  const isPending = status === 'pending'
  const isRejected = status === 'rejected'

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for returning this evidence for revision.')
      return
    }
    onReject?.(competency, rejectReason)
    setRejecting(false)
    setRejectReason('')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close verification detail modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over Drawer */}
      <aside className="relative z-10 flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-slate-50 shadow-2xl">
        {/* Drawer Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
              Competency Traceability Dossier
            </span>
            <h3 className="mt-0.5 text-lg font-extrabold text-slate-950">
              {skill} — Level {level}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close dossier"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Container */}
        <div className="space-y-5 p-6 sm:p-7">
          {/* Employee & Competency Summary Box */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                  {employee?.avatar || employee?.employeeName?.substring(0, 2).toUpperCase() || employee?.name?.substring(0, 2).toUpperCase() || 'EM'}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{employee?.employeeName || employee?.name}</h4>
                  <p className="text-xs text-slate-500">
                    {employee?.role} • {employee?.department}
                  </p>
                </div>
              </div>
              <VerificationBadge status={status} verified={verified} />
            </div>
          </section>

          {/* Pending Status Alert */}
          {isPending && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <Clock size={16} />
                <span>Pending Reviewer Action</span>
              </div>
              <p className="mt-1 leading-5 text-amber-800">
                Evidence has been submitted and is currently in the review queue. This competency will not count toward verified project matching score until approved by an authorized reviewer.
              </p>
            </div>
          )}

          {/* Rejected Status Alert */}
          {isRejected && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <XCircle size={16} />
                <span>Verification Returned for Revision</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-rose-800">
                Reason: &ldquo;{evidence?.reviewReason || 'Additional proof documentation required'}&rdquo;
              </p>
              {evidence?.reviewedBy && (
                <p className="mt-1 text-[11px] text-rose-600">
                  Reviewed by {evidence.reviewedBy} on {evidence.reviewedAt || 'recently'}
                </p>
              )}
            </div>
          )}

          {/* Evidence Details Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Submitted Verification Artifacts & Source
            </h4>

            {evidence ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5 text-xs sm:grid-cols-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Proof Type</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{evidence.type || 'Project evidence'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{evidence.date || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Score</span>
                    <p className="font-bold text-emerald-700 mt-0.5">{evidence.verificationScore ? `${evidence.verificationScore}%` : 'N/A'}</p>
                  </div>
                </div>

                {evidence.issuer && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Issuing / Evaluating Authority
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">{evidence.issuer}</p>
                  </div>
                )}

                {evidence.summary && (
                  <div>
                    <p className="text-xs font-bold text-slate-900">Verification Rationale & Scope</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100">
                      {evidence.summary}
                    </p>
                  </div>
                )}

                {evidence.verifiedBy && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2.5 text-xs text-slate-700">
                    <UserCheck size={16} className="text-emerald-600 shrink-0" />
                    <span>
                      Reviewer: <strong className="text-slate-900">{evidence.verifiedBy}</strong>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/50 p-5 text-center">
                <ShieldAlert size={28} className="mx-auto text-amber-500" />
                <p className="mt-2 text-sm font-bold text-amber-900">No Verified Evidence Attached</p>
                <p className="mt-1 text-xs text-amber-700 max-w-md mx-auto">
                  This competency is currently based on self-reported capability. To verify it for project matching trust calculations, attach a certification, pull request, or assessment signoff.
                </p>
              </div>
            )}
          </section>

          {/* Audit Trail Timeline */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="grid size-7 place-items-center rounded-lg bg-slate-100 text-slate-700">
                <History size={16} />
              </span>
              <h4 className="text-sm font-bold text-slate-900">Verification History & Audit Trail</h4>
            </div>

            {evidence?.auditTrail && evidence.auditTrail.length > 0 ? (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {evidence.auditTrail.map((event, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-6 top-1 grid size-4 place-items-center rounded-full bg-emerald-500 ring-4 ring-white">
                      <CheckCircle2 size={10} className="text-white" />
                    </span>
                    <p className="text-xs font-bold text-slate-900">{event.action}</p>
                    {event.reason && (
                      <p className="text-[11px] italic text-slate-500 mt-0.5">&ldquo;{event.reason}&rdquo;</p>
                    )}
                    <div className="mt-0.5 flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} className="text-slate-400" />
                        {event.date}
                      </span>
                      <span>By: <strong className="text-slate-700">{event.actor}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No prior audit logs recorded.</p>
            )}
          </section>

          {/* Reviewer Actions for Pending Evidence */}
          {isPending && isReviewer && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Reviewer Decision</h4>
                <p className="text-xs text-slate-600">
                  Approve to verify this competency or reject with an explanation for revision.
                </p>
              </div>

              {!rejecting ? (
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onApprove?.(competency)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={15} />
                    <span>Approve & Verify Competency</span>
                  </button>
                  <button
                    onClick={() => setRejecting(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-700 shadow-xs transition hover:bg-rose-50"
                  >
                    <XCircle size={15} />
                    <span>Reject / Request Revision</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 rounded-xl border border-rose-200 bg-white p-3.5">
                  <label className="block text-xs font-bold text-rose-900">
                    Rejection Reason (Required)
                  </label>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Test coverage insufficient or certificate credential unverified"
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleConfirmReject}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => {
                        setRejecting(false)
                        setRejectReason('')
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action if Rejected: Allow Resubmission */}
          {isRejected && onAddEvidence && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Resubmit Evidence</h4>
                  <p className="text-xs text-slate-500">
                    Upload revised proof or test score to return this competency to Pending Review.
                  </p>
                </div>
                <button
                  onClick={() => onAddEvidence(competency)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 shrink-0"
                >
                  <RotateCcw size={14} />
                  <span>Resubmit Evidence</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Verify Simulation Action if unverified and reviewer */}
          {!isVerified && !isPending && !isRejected && onQuickVerify && isReviewer && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Attestation Signoff (Reviewer)</h4>
                  <p className="text-xs text-emerald-700">
                    Directly attest and verify this competency with official reviewer signature.
                  </p>
                </div>
                <button
                  onClick={() => onQuickVerify(competency)}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 shrink-0"
                >
                  Sign & Verify ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

export default VerificationDetail
