/** Guided, simulated Azure decision exercises. No real resources are created.
 * Authored from the user's Azure study notes, not official Microsoft exam items.
 */
export type LabChoice = {
  id: string
  prompt: string
  choices: readonly [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
}
export type GuidedLab = {
  id: "storage" | "network"
  title: string
  objectiveRefs: readonly string[]
  context: string
  steps: readonly LabChoice[]
  takeaway: string
}
export const guidedLabs: readonly GuidedLab[] = [
  {
    id: "storage",
    title: "Choose storage for a campus portal",
    objectiveRefs: ["AZ-ST-01", "AZ-ST-02", "AZ-ST-03", "AZ-ST-05", "AZ-ST-06"],
    context: "A college publishes photos and PDFs, keeps shared departmental files and is moving a large archive into Azure. Choose services based on these requirements, not product names alone.",
    steps: [
      { id: "storage-service", prompt: "Which service should store website photos and downloadable PDFs as objects?", choices: ["Azure Blob Storage", "Azure Queue Storage", "Azure DNS", "Azure Policy"], correctIndex: 0, explanation: "Blob Storage is appropriate for unstructured object content such as images and documents. Queues carry messages, DNS resolves names, and Policy enforces governance rules." },
      { id: "storage-files", prompt: "Staff need managed shared folders accessed through standard file-sharing protocols. What fits?", choices: ["Azure Table Storage", "Azure Files", "Azure Monitor", "Azure Data Box"], correctIndex: 1, explanation: "Azure Files offers managed file shares. Data Box is a data-transfer appliance, not a live shared-file service." },
      { id: "storage-redundancy", prompt: "The college requires replicas across availability zones inside its primary region. Which option addresses that need?", choices: ["Locally redundant storage (LRS)", "Geo-redundant storage (GRS)", "Zone-redundant storage (ZRS)", "Archive access tier"], correctIndex: 2, explanation: "ZRS synchronously copies data across availability zones in the primary region, where supported. GRS focuses on replication to a secondary region and LRS does not span zones." },
      { id: "storage-transfer", prompt: "The college has tens of terabytes and unreliable network connectivity. Which migration option offers physical offline transfer to Azure?", choices: ["Azure File Sync", "Azure Storage Explorer", "Azure CLI", "Azure Data Box"], correctIndex: 3, explanation: "Azure Data Box supports transferring large datasets using a physical appliance. Always check regional availability, supported services, and handling procedures." },
    ],
    takeaway: "Storage decisions depend on data type, retrieval patterns, availability targets and transfer constraints. These steps are a simulated exercise, not an Azure deployment.",
  },
  {
    id: "network",
    title: "Plan safe network access for a student app",
    objectiveRefs: ["LO-043", "LO-047", "LO-051", "LO-060"],
    context: "A university runs a student portal with a public HTTPS front end and a private database. Choose a secure conceptual network design. Nothing is deployed or configured in your Azure subscription.",
    steps: [
      { id: "network-subnet", prompt: "The web tier and database need distinct address ranges within one virtual network. Choose the relevant feature.", choices: ["Separate subnets", "Resource tags only", "The pricing calculator", "Azure Policy initiatives"], correctIndex: 0, explanation: "Subnets provide distinct address ranges inside a VNet. Separate network-security controls can then be applied to the tiers." },
      { id: "network-web", prompt: "Users must access the public web front end using HTTPS. Which inbound application port should an appropriate NSG rule allow?", choices: ["3389/TCP (RDP)", "443/TCP (HTTPS)", "22/TCP (SSH)", "1433/TCP (SQL Server)"], correctIndex: 1, explanation: "HTTPS normally uses TCP port 443. Only permit traffic that the intended web application requires; avoid public administrative ports." },
      { id: "network-database", prompt: "Only the application tier should be allowed to reach the database port. Which source restriction best expresses least privilege?", choices: ["All public internet addresses", "Any Azure subscription worldwide", "Only the application subnet or approved application endpoints", "Every device with a browser"], correctIndex: 2, explanation: "Restrict database access to the application tier as narrowly as practical. Validate the actual protocol and network path when deploying." },
      { id: "network-admin", prompt: "Administrators need remote maintenance access without exposing SSH/RDP directly to the entire internet. Which plan is safer?", choices: ["Allow all inbound ports from all addresses", "Disable authentication", "Expose RDP to the public internet", "Use a controlled management route such as Azure Bastion or a VPN"], correctIndex: 3, explanation: "A controlled management path helps avoid exposing administrative ports to the whole internet. Production setups need identity, NSG, routing and application-level checks." },
    ],
    takeaway: "VNet and subnet design, narrowly scoped NSG rules, and secure administration reduce exposure. This is a conceptual lab; it does not validate a live Azure configuration.",
  },
]

export type LabResult = { selected: number[]; completedAt: string }
export type LabProgress = Partial<Record<GuidedLab["id"], LabResult>>
export const labProgressStorageKey = "cloudbridge-lab-progress-v1"

/** Return null for an incomplete lab; no pass prediction is made. */
export function evaluateLab(lab: GuidedLab, selected: readonly (number | null)[]): { correct: number; total: number } | null {
  if (selected.length !== lab.steps.length || selected.some((answer) => answer === null || !Number.isInteger(answer) || Number(answer) < 0 || Number(answer) > 3)) return null
  return { correct: lab.steps.filter((step, index) => step.correctIndex === selected[index]).length, total: lab.steps.length }
}

export function normalizeLabProgress(value: unknown): LabProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  const source = value as Record<string, unknown>
  const result: LabProgress = {}
  for (const lab of guidedLabs) {
    const saved = source[lab.id]
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) continue
    const record = saved as Record<string, unknown>
    if (!Array.isArray(record.selected) || record.selected.length !== lab.steps.length ||
        record.selected.some((index: unknown) => !Number.isInteger(index) || Number(index) < 0 || Number(index) > 3) ||
        typeof record.completedAt !== "string" || !Number.isFinite(Date.parse(record.completedAt))) continue
    result[lab.id] = { selected: [...record.selected] as number[], completedAt: record.completedAt }
  }
  return result
}
