/** Opt-in, self-attested work completed outside CloudBridge.
 * No Azure credentials, subscription IDs, resource identifiers, files or screenshots
 * are ever collected by the app; no Azure API calls are made.
 */
export type HandsOnPath = {
  id: "cost-estimate" | "network-nsg"
  title: string
  level: "No Azure deployment" | "Azure sandbox and billing permissions required"
  objectiveRefs: readonly string[]
  description: string
  officialUrl: string
  warning: string
  steps: readonly { id: string; label: string }[]
}

export const handsOnPaths: readonly HandsOnPath[] = [
  {
    id: "cost-estimate",
    title: "Estimate a VM before you deploy",
    level: "No Azure deployment",
    objectiveRefs: ["LO-012", "LO-013", "LO-016"],
    description: "Use Microsoft's public Azure Pricing Calculator to compare sizes, regions and usage assumptions. It creates an estimate, not an Azure resource.",
    officialUrl: "https://azure.microsoft.com/en-us/pricing/calculator/",
    warning: "Prices are estimates and may exclude some dependent costs, taxes or discounts. You should not enter personal payment information into CloudBridge.",
    steps: [
      { id: "select", label: "Choose a VM configuration and region in the official calculator." },
      { id: "compare", label: "Compare two suitable configurations or purchase options, noting the assumptions." },
      { id: "reflect", label: "Explain why the final estimate may differ from actual Azure charges." },
    ],
  },
  {
    id: "network-nsg",
    title: "Filter network traffic with an NSG",
    level: "Azure sandbox and billing permissions required",
    objectiveRefs: ["LO-047", "LO-051", "LO-059"],
    description: "Follow Microsoft's own tutorial, which covers NSG rules and testing network traffic in a virtual network. This path is optional and separate from CloudBridge's simulated network lab.",
    officialUrl: "https://learn.microsoft.com/en-us/azure/virtual-network/tutorial-filter-network-traffic",
    warning: "This Microsoft tutorial may create billable VMs and other resources. Use only an authorised learning subscription, verify your budget and permissions before starting, do not expose RDP/SSH to the public internet, and complete the official clean-up instructions afterward.",
    steps: [
      { id: "budget", label: "Confirm sandbox authorisation, available budget and permitted region before provisioning." },
      { id: "configure", label: "Follow Microsoft's current tutorial to create and associate the NSG and rules." },
      { id: "test", label: "Test expected allowed and denied network traffic as directed by the tutorial." },
      { id: "cleanup", label: "Clean up all resources created for the exercise and confirm no ongoing charges are expected." },
    ],
  },
]

export const handsOnStorageKey = "cloudbridge-hands-on-self-reported-v1"
export type HandsOnProgress = Partial<Record<HandsOnPath["id"], { completedStepIds: string[]; updatedAt: string }>>

export function normalizeHandsOnProgress(data: unknown): HandsOnProgress {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {}
  const source = data as Record<string, unknown>
  const valid: HandsOnProgress = {}
  for (const path of handsOnPaths) {
    const result = source[path.id]
    if (!result || typeof result !== "object" || Array.isArray(result)) continue
    const item = result as Record<string, unknown>
    if (typeof item.updatedAt !== "string" || !Number.isFinite(Date.parse(item.updatedAt))) continue
    if (!Array.isArray(item.completedStepIds) ||
        item.completedStepIds.some((id: unknown) => typeof id !== "string" || !path.steps.some((step) => step.id === id))) continue
    const completed = [...new Set(item.completedStepIds as string[])]
    valid[path.id] = { completedStepIds: completed, updatedAt: item.updatedAt }
  }
  return valid
}

/** A tick records only the learner's claim, never verified hands-on completion. */
export function markHandsOnStep(
  existing: HandsOnProgress,
  pathId: HandsOnPath["id"],
  stepId: string,
  completed: boolean,
  timestamp: string,
): HandsOnProgress {
  const path = handsOnPaths.find((item) => item.id === pathId)
  if (!path?.steps.some((step) => step.id === stepId)) throw new Error("Unknown hands-on step")
  if (!Number.isFinite(Date.parse(timestamp))) throw new Error("Invalid completion timestamp")
  const earlier = existing[pathId]?.completedStepIds ?? []
  const nextIds = completed ? [...new Set([...earlier, stepId])] : earlier.filter((id) => id !== stepId)
  return { ...existing, [pathId]: { completedStepIds: nextIds, updatedAt: timestamp } }
}

export function getHandsOnSummary(progress: HandsOnProgress) {
  return handsOnPaths.map((path) => ({
    id: path.id,
    selfReportedSteps: progress[path.id]?.completedStepIds.length ?? 0,
    totalSteps: path.steps.length,
  }))
}


/** Strict backup validation: preserve only known paths and checklist fields. */
export function isValidHandsOnProgress(data: unknown): data is HandsOnProgress {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false
  return Object.entries(data).every(([pathId, raw]) => {
    const path = handsOnPaths.find((item) => item.id === pathId)
    if (!path || !raw || typeof raw !== "object" || Array.isArray(raw)) return false
    const entry = raw as Record<string, unknown>
    if (Object.keys(entry).sort().join(",") !== "completedStepIds,updatedAt" ||
      typeof entry.updatedAt !== "string" || !Number.isFinite(Date.parse(entry.updatedAt)) ||
      !Array.isArray(entry.completedStepIds)) return false
    return new Set(entry.completedStepIds).size === entry.completedStepIds.length &&
      entry.completedStepIds.every((stepId: unknown) =>
        typeof stepId === "string" && path.steps.some((step) => step.id === stepId))
  })
}
