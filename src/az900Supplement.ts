/** Supplemental AZ-900 storage outcomes taken from the user's Microsoft Azure.docx
 * notes and the Microsoft AZ-900 study guide (skills effective 20 July 2026).
 * The 63 objectives in Learning objective.docx remain unchanged and separately tracked.
 */
export type SupplementalObjective = {
  id: string
  text: string
  keyIdea: string
  practiceLabId: string
}
export const supplementalStorageObjectives: readonly SupplementalObjective[] = [
  { id: "AZ-ST-01", text: "Compare Azure Storage services", keyIdea: "Blob for object data, Azure Files for managed file shares, Queue for messages and Table for NoSQL key/attribute data.", practiceLabId: "storage" },
  { id: "AZ-ST-02", text: "Describe storage access tiers", keyIdea: "Compare access frequency, storage cost, retrieval charges, and any minimum retention period before choosing a tier.", practiceLabId: "storage" },
  { id: "AZ-ST-03", text: "Describe redundancy options", keyIdea: "LRS stays within a datacenter; ZRS spans zones; GRS and GZRS also maintain asynchronous copies in a secondary region.", practiceLabId: "storage" },
  { id: "AZ-ST-04", text: "Describe storage accounts and storage types", keyIdea: "Account kind, redundancy and supported storage services influence which configuration can be deployed.", practiceLabId: "storage" },
  { id: "AZ-ST-05", text: "Identify file transfer options (AzCopy, Storage Explorer, Azure File Sync)", keyIdea: "AzCopy is a command-line copy tool, Storage Explorer is a GUI, and Azure File Sync synchronises file shares with Windows Server.", practiceLabId: "storage" },
  { id: "AZ-ST-06", text: "Describe migration options (Azure Migrate, Azure Data Box)", keyIdea: "Azure Migrate supports discovery and migration planning; Data Box is for offline transfers of large data volumes.", practiceLabId: "storage" },
]
