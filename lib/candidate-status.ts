export const CANDIDATE_STATUSES = ["pending", "accepted", "rejected"] as const
export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number]

export const STATUS_LABEL: Record<CandidateStatus, string> = {
  pending: "En attente",
  accepted: "Retenu",
  rejected: "Non retenu",
}

export const STATUS_TONE: Record<CandidateStatus, string> = {
  pending: "bg-slate-100 text-slate-600",
  accepted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
}

export const isCandidateStatus = (value: unknown): value is CandidateStatus =>
  typeof value === "string" && (CANDIDATE_STATUSES as readonly string[]).includes(value)
