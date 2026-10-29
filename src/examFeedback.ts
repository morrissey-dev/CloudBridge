import type { AZ900Question } from "./az900Exam.ts"

/**
 * Authored option-specific feedback, based primarily on the supplied Microsoft Azure notes.
 * These explanations are study aids, NOT independent approval of answer keys or distractors.
 * Indexes follow the canonical bank's authored option ordering (not the shuffled UI order).
 */
type FeedbackEntry = {
  choices: readonly [string, string, string, string]
  reference?: string
}

export const answerFeedback: Record<string, FeedbackEntry> = {
  "added-gov-source-001": {
    choices: [
      "Region is one of the factors that can change an Azure resource's estimated price, even for the same VM configuration.",
      "Resource groups organise resources. They do not add a fixed mandatory monthly charge for being created.",
      "Service prices are not necessarily uniform worldwide; geography can affect Azure rates.",
      "Choosing a region does not automatically waive any applicable software or licensing charges.",
    ],
  },
  "added-gov-source-002": {
    choices: [
      "Tags are metadata for categorisation and allocation; applying one does not create a special data-egress fee.",
      "Outbound network traffic can generate bandwidth or data-transfer charges, so the team should estimate egress volume.",
      "Locks restrict certain management operations; they are not the relevant network-transfer cost.",
      "The Azure portal is a management interface; customer-facing outbound data is not priced by portal sign-ins.",
    ],
  },
  "added-gov-source-003": {
    choices: [
      "Spot capacity can be reclaimed. That interruption risk makes Spot unsuitable as the commitment option described.",
      "A resource lock prevents selected resource changes; it is not a long-term purchasing discount.",
      "Reservations provide commitment-based discounts on eligible, stable resource usage for one or three years.",
      "An audit policy checks configurations. It does not itself provide reserved-capacity pricing.",
    ],
    reference: "https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/decide-between-savings-plan-reservation",
  },
  "added-gov-source-004": {
    choices: [
      "Budgets monitor or alert about spending; they are not a discounted hourly compute spending commitment.",
      "Spot pricing discounts spare, interruptible capacity rather than using a fixed hourly spend commitment.",
      "Archive is a blob-storage access tier, not a commitment across compute services.",
      "Savings plans for compute are tied to a committed hourly spend on eligible compute rather than one fixed VM configuration.",
    ],
    reference: "https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview",
  },
  "added-gov-source-005": {
    choices: [
      "Spot VMs can be evicted and are suited to restartable jobs that can tolerate interruptions.",
      "A lock protects resources from accidental management changes; it does not by itself create low-priced interruptible compute.",
      "A guaranteed always-on commitment conflicts with the scenario's acceptance of interruptions.",
      "A reserved IP address addresses networking needs, not the discounted processing capacity described.",
    ],
  },
  "added-gov-source-006": {
    choices: [
      "Choosing an item in the Pricing Calculator does not provision it, so no deployment starts from that action alone.",
      "The calculator estimates the cost of a chosen configuration without deploying its resources.",
      "A cost estimate is not a reservation purchase or a three-year resource commitment.",
      "Creating an estimate does not automatically configure subscription budgets or enforcement.",
    ],
    reference: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/pricing-calculator",
  },
  "added-gov-source-007": {
    choices: [
      "An Azure budget threshold normally sends an alert; shutting down resources requires separately configured automation.",
      "Budget alerts do not remove resource locks, which are managed through Resource Manager controls.",
      "A configured budget threshold produces an alert for its recipients, without automatically stopping services.",
      "A budget threshold does not change the subscription's billing currency.",
    ],
  },
  "added-gov-source-008": {
    choices: [
      "VNet peering connects networks; it does not classify spending by business department.",
      "Application Insights monitors application performance; it is not the departmental resource cost label in this situation.",
      "ReadOnly locks restrict resource changes; they do not label departments for cost reporting.",
      "CostCenter and Department tags attach metadata that can help group and allocate resource costs, subject to tagging support.",
    ],
    reference: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data",
  },
  "added-gov-source-009": {
    choices: [
      "Azure Policy can audit or deny resources that violate allowed-location rules.",
      "Azure Advisor gives recommendations; it does not serve as the resource-policy enforcement mechanism.",
      "ExpressRoute provides private connectivity between networks, not approved-region governance.",
      "Azure DNS hosts DNS zones and records, not deployment-location restrictions.",
    ],
  },
  "added-gov-source-010": {
    choices: [
      "A quota limits allowed consumption of some resources; it is not a container for policy definitions.",
      "An Azure Policy initiative groups related policy definitions toward a wider compliance goal.",
      "Availability sets distribute virtual machines to reduce correlated hardware failures.",
      "DNS zones contain name-resolution records, not governance policy definitions.",
    ],
    reference: "https://learn.microsoft.com/en-us/azure/governance/policy/concepts/initiative-definition-structure",
  },
  "added-gov-source-011": {
    choices: [
      "ReadOnly prevents management updates as well as deletion, so it is stricter than the stated requirement.",
      "Conditional Access governs sign-in/access conditions, not accidental resource deletion in the management plane.",
      "A Delete (CanNotDelete) lock blocks resource deletion while still allowing authorised management updates.",
      "An Azure budget can alert about spending but does not stop resource deletion.",
    ],
    reference: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/lock-resources",
  },
  "added-gov-source-012": {
    choices: [
      "Azure DNS manages DNS records; it does not provide Microsoft's compliance assurance reports.",
      "Resource Manager manages and deploys Azure resources rather than acting as the compliance-document library.",
      "Cloud Shell provides browser-based command-line tools, not the requested assurance documents.",
      "The Service Trust Portal provides Microsoft's security, privacy and compliance assurance resources.",
    ],
  },
  "added-gov-source-013": {
    choices: [
      "Azure Cloud Shell runs CLI and PowerShell commands in a browser, without a local CLI installation.",
      "Application Insights investigates app telemetry and performance; it is not a shell.",
      "Azure Advisor recommends improvements but does not provide an interactive CLI terminal.",
      "Microsoft Purview supports data governance and compliance, not an Azure CLI shell.",
    ],
  },
  "added-gov-source-014": {
    choices: [
      "Storage Explorer manages Azure storage data, not the common management layer for all resource requests.",
      "Azure Resource Manager authenticates and authorises management requests and routes them to Azure services.",
      "ExpressRoute enables private network connectivity, not resource management request processing.",
      "Azure Data Box supports offline data transfer, rather than authorising Azure resource deployments.",
    ],
  },
  "added-gov-source-015": {
    choices: [
      "DNS zone files define DNS records, not general-purpose Azure resource deployments.",
      "An inventory describes existing equipment; it does not declaratively provision Azure infrastructure.",
      "Bicep is a concise, declarative language for deploying Azure resources through Resource Manager.",
      "Service Health notifications report service incidents and planned maintenance; they are not IaC definitions.",
    ],
  },
  "added-gov-source-016": {
    choices: [
      "Service Health reports outages and maintenance that may affect services; it is not the broad optimisation recommender.",
      "Cost Management analyses spending, but the question asks for cross-cutting optimisation recommendations.",
      "Azure DNS resolves domain names, rather than assessing reliability, cost, security and performance.",
      "Azure Advisor provides personalised recommendations spanning reliability, cost, security and performance.",
    ],
  },
  "added-gov-source-017": {
    choices: [
      "Azure Service Health reports incidents, advisories and planned maintenance relevant to the subscriber's services.",
      "Pricing Calculator predicts costs; it does not report service incidents or maintenance.",
      "Storage Explorer manages data in storage accounts; it does not give subscription service-health updates.",
      "ARM templates describe deployments, rather than showing Microsoft service-incident information.",
    ],
  },
  "added-gov-source-018": {
    choices: [
      "Azure Advisor gives resource optimisation recommendations, not detailed per-request application telemetry.",
      "Application Insights collects and helps analyse web app requests, failures, latency and dependencies.",
      "Policy initiatives group governance rules; they do not trace web application requests.",
      "Azure File Sync synchronises file shares, not application requests and their dependencies.",
    ],
  },
}

export function getAuthoredChoiceFeedback(question: AZ900Question, selectedOption: string): string | null {
  const entry = answerFeedback[question.id]
  if (!entry) return null
  const index = question.options.indexOf(selectedOption)
  // Do not attach feedback when an answer string is absent or the bank changed.
  if (index < 0 || entry.choices.length !== 4) return null
  return entry.choices[index]?.trim() || null
}

export function getFurtherReading(question: AZ900Question): string | null {
  return answerFeedback[question.id]?.reference ?? null
}

export function hasCompleteAuthoredFeedback(question: AZ900Question): boolean {
  return question.options.length === 4 && question.options.every(option => Boolean(getAuthoredChoiceFeedback(question, option)))
}

export function getFeedbackCoverage(questions: readonly AZ900Question[]) {
  const fullyExplained = questions.filter(hasCompleteAuthoredFeedback)
  return {
    total: questions.length,
    withAuthoredFeedback: fullyExplained.length,
    awaitingDetailedFeedback: questions.length - fullyExplained.length,
    withOfficialReadingLinks: questions.filter(q => getFurtherReading(q) !== null).length,
  }
}
