import type { AZ900Category } from "./az900Exam.ts"
import { sourceLearningObjectives } from "./learningObjectives.ts"
import { scenarioQuestionsV14 } from "./scenarioQuestionsV14.ts"
import { scenarioQuestionsV15 } from "./scenarioQuestionsV15.ts"
import { scenarioQuestionsV16 } from "./scenarioQuestionsV16.ts"

/** Original scenarios written for CloudBridge using the user's supplied Azure
 * Fundamentals notes and learning-objective list. Not official Microsoft questions.
 * Each entry needs editorial review when the underlying Microsoft guidance changes.
 */
export type ScenarioQuestion = {
  id: string
  category: AZ900Category
  objectiveId: string
  title: string
  situation: string
  question: string
  choices: readonly [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
  takeaway: string
}

export const scenarioQuestions: readonly ScenarioQuestion[] = [
  {
    id: "scenario-cloud-01", category: "Cloud concepts", objectiveId: "LO-002",
    title: "Who's responsible for patching?",
    situation: "A college hosts its student registration system on an Azure virtual machine. Microsoft runs the physical datacenter, but the college installed and manages the guest operating system.",
    question: "Who is responsible for installing security updates to the guest operating system?",
    choices: ["Microsoft, because Azure owns the datacenter", "The college, because it manages the guest OS", "The internet provider connecting the campus", "Nobody; guest operating systems patch themselves by default"],
    correctIndex: 1,
    explanation: "Under IaaS, the cloud provider handles physical infrastructure, while the customer is responsible for guest operating system patches, installed software, data and access decisions.",
    takeaway: "Shared responsibility changes with the cloud service model.",
  },
  {
    id: "scenario-cloud-02", category: "Cloud concepts", objectiveId: "LO-004",
    title: "A phased move to the cloud",
    situation: "A hospital keeps a sensitive internal application in its own datacenter but runs its new public appointment website on Azure. Both environments need to exchange authorised information.",
    question: "Which deployment model best describes this design?",
    choices: ["Public cloud only", "Private cloud only", "Hybrid cloud", "A single on-premises environment"],
    correctIndex: 2,
    explanation: "A hybrid cloud combines interconnected private or on-premises resources with public cloud services. Keeping some workloads on-site while integrating Azure is a typical hybrid use case.",
    takeaway: "Choose deployment models based on workload needs and constraints.",
  },
  {
    id: "scenario-cloud-03", category: "Cloud concepts", objectiveId: "LO-007",
    title: "Busy registration week",
    situation: "A university's registration website becomes slow during the first week of semester. Its operations team wants to add more application instances when traffic rises, then remove them when demand falls.",
    question: "Which scaling approach is being described?",
    choices: ["Vertical scaling by adding RAM to one server", "Horizontal scaling by changing the number of instances", "Archiving old backups", "Changing the Azure subscription owner"],
    correctIndex: 1,
    explanation: "Horizontal scaling adds or removes instances. Vertical scaling changes the capacity of an individual instance, such as its CPU or memory.",
    takeaway: "Scale out/in changes instance count; scale up/down changes instance size.",
  },
  {
    id: "scenario-cloud-04", category: "Cloud concepts", objectiveId: "LO-005",
    title: "Release test resources",
    situation: "A team creates temporary cloud resources for a software demonstration and deletes them after the event. They prefer not to purchase hardware for occasional use.",
    question: "Which cloud benefit does this purchasing approach illustrate?",
    choices: ["A guaranteed fixed total cost", "Consumption-based spending on used resources", "Elimination of all software maintenance", "A permanent allocation of spare servers"],
    correctIndex: 1,
    explanation: "Consumption-based cloud services support paying for eligible usage instead of buying capacity in advance. Charges depend on the specific services and resources used.",
    takeaway: "Review what is still provisioned; deleting one resource may leave billable dependencies.",
  },
  {
    id: "scenario-arch-01", category: "Azure architecture and services", objectiveId: "LO-031",
    title: "Protect against a datacenter outage",
    situation: "A company deploys its application within one Azure region. It wants its application to tolerate the failure of one physical datacenter location where supported.",
    question: "Which Azure concept provides distinct datacenter locations within an eligible region?",
    choices: ["Availability zones", "Resource tags", "Azure Cost Management", "Azure Cloud Shell"],
    correctIndex: 0,
    explanation: "Availability zones are separate physical locations in a supported Azure region, designed with independent power, cooling and networking to help improve resilience.",
    takeaway: "High availability requires deliberate architecture; not every service or region has identical zone support.",
  },
  {
    id: "scenario-arch-02", category: "Azure architecture and services", objectiveId: "LO-037",
    title: "An event-driven photo processor",
    situation: "A startup wants code to run when a user uploads an image. It has no requirement to maintain a continuously running virtual machine.",
    question: "Which service type is most closely suited to this event-driven task?",
    choices: ["A dedicated VM that always runs", "Azure Functions", "Azure DNS", "Azure Policy"],
    correctIndex: 1,
    explanation: "Azure Functions supports event-driven code execution. It can be useful for short tasks triggered by events, such as processing an uploaded file.",
    takeaway: "Match compute services to execution pattern, control needs and running costs.",
  },
  {
    id: "scenario-arch-03", category: "Azure architecture and services", objectiveId: "LO-047",
    title: "Separate the application tiers",
    situation: "A team places a web tier and a database tier in an Azure virtual network. They want separate address ranges and controls for each tier.",
    question: "Which virtual networking feature should they use to divide the network?",
    choices: ["Resource locks", "A pricing estimate", "Subnets", "A storage access tier"],
    correctIndex: 2,
    explanation: "Subnets divide an Azure virtual network into address ranges. The team can then apply suitable network controls to traffic entering or leaving subnet resources.",
    takeaway: "A VNet provides network isolation; subnets support segmentation within it.",
  },
  {
    id: "scenario-arch-04", category: "Azure architecture and services", objectiveId: "LO-059",
    title: "Grant just enough access",
    situation: "An IT intern needs to view one resource group's configurations but should not modify resources or manage access for others.",
    question: "Which Azure approach best supports this requirement?",
    choices: ["Assign Owner at the subscription level", "Assign Reader at the resource-group scope", "Give the intern a shared administrator password", "Disable identity checks for the portal"],
    correctIndex: 1,
    explanation: "Azure RBAC assigns roles at defined scopes. Reader at the resource-group scope allows viewing resources without granting permissions to change them.",
    takeaway: "Follow least privilege: grant the appropriate role at the narrowest practical scope.",
  },
  {
    id: "scenario-gov-01", category: "Azure management and governance", objectiveId: "LO-015",
    title: "Understand departmental cloud spend",
    situation: "A company wants to group Azure resource costs by the department that owns each application, while keeping existing resources in their current resource groups.",
    question: "Which approach best adds consistent cost-allocation metadata?",
    choices: ["Assign resource tags such as CostCenter and Owner", "Place a delete lock on every resource", "Move every resource to another Azure region", "Disable all alerts in Azure Monitor"],
    correctIndex: 0,
    explanation: "Azure tags provide key-value metadata such as CostCenter and Owner. They can support cost analysis and organising resources without changing deployment hierarchy.",
    takeaway: "Tags describe ownership and purpose; policies can help enforce required tags.",
  },
  {
    id: "scenario-gov-02", category: "Azure management and governance", objectiveId: "LO-018",
    title: "Enforce allowed regions",
    situation: "An organisation wants newly created Azure resources to use approved geographic regions and to flag or prevent noncompliant deployments.",
    question: "Which Azure service is designed to define and enforce these rules?",
    choices: ["Azure Advisor", "Azure Service Health", "Azure Policy", "Azure Functions"],
    correctIndex: 2,
    explanation: "Azure Policy allows organisations to define, assign and evaluate rules across Azure resources, including restrictions on deployment locations.",
    takeaway: "Azure Policy is for organisational guardrails, not role-based access permissions.",
  },
  {
    id: "scenario-gov-03", category: "Azure management and governance", objectiveId: "LO-021",
    title: "Prevent accidental deletion",
    situation: "A team has the necessary Azure RBAC permissions to operate a production resource, but the organisation wants to prevent its accidental deletion.",
    question: "Which control most directly protects that resource from deletion?",
    choices: ["A CanNotDelete resource lock", "A cost-analysis report", "A read-only dashboard", "A new resource tag"],
    correctIndex: 0,
    explanation: "A CanNotDelete resource lock prevents deletion even by users who otherwise have sufficient RBAC permissions, until the lock is removed by an authorised person.",
    takeaway: "Resource locks help protect against accidental changes; they do not replace security roles.",
  },
  {
    id: "scenario-gov-04", category: "Azure management and governance", objectiveId: "LO-029",
    title: "Investigate application performance",
    situation: "A team wants to understand application response times, failed requests and operational telemetry after deploying a web application on Azure.",
    question: "Which Azure monitoring capability is most directly useful for application performance telemetry?",
    choices: ["Azure Pricing Calculator", "Application Insights in Azure Monitor", "Azure Service Trust Portal", "Azure resource locks"],
    correctIndex: 1,
    explanation: "Application Insights is part of Azure Monitor and helps collect and analyse application telemetry, including performance and request failures.",
    takeaway: "Use monitoring data to investigate performance rather than guessing at causes.",
  },
  ...scenarioQuestionsV14,
  ...scenarioQuestionsV15,
  ...scenarioQuestionsV16,
]

export function validateScenarioBank(): string[] {
  const errors: string[] = []
  const seen = new Set<string>()
  for (const item of scenarioQuestions) {
    if (seen.has(item.id)) errors.push(`Duplicate scenario id: ${item.id}`)
    seen.add(item.id)
    if (!sourceLearningObjectives.some((objective) => objective.id === item.objectiveId)) {
      errors.push(`Unmapped objective ${item.objectiveId} for ${item.id}`)
    }
    if (item.choices.length !== 4 || new Set(item.choices).size !== 4) {
      errors.push(`Invalid choices: ${item.id}`)
    }
    if (item.correctIndex < 0 || item.correctIndex >= item.choices.length) {
      errors.push(`Invalid answer index: ${item.id}`)
    }
  }
  return errors
}
