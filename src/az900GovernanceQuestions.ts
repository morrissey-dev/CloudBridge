import type { AZ900Question } from "./az900Exam.ts"

/** Additional original, notes-based governance study questions.
 * They retain a needs-verification flag until independently reviewed.
 */
export const sourceGovernanceQuestions: AZ900Question[] = [
  {
    "id": "added-gov-source-001",
    "category": "Azure management and governance",
    "objective": "Cost and region selection",
    "difficulty": "medium",
    "question": "A team deploys two otherwise identical virtual machines in different Azure regions and sees different estimated charges. Which factor best explains this?",
    "options": [
      "Azure regions may have different service pricing",
      "Resource groups have a fixed mandatory monthly fee",
      "Every virtual machine has the same global price",
      "Deployment in a second region always removes license charges"
    ],
    "correctAnswer": "Azure regions may have different service pricing",
    "explanation": "Azure resource pricing can vary by region because costs and charges differ geographically; compare region-specific estimates.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-002",
    "category": "Azure management and governance",
    "objective": "Network transfer charges",
    "difficulty": "medium",
    "question": "A team is evaluating large volumes of data moving from an Azure-hosted application to customers on the internet. Which cost should it review?",
    "options": [
      "A storage account tag fee",
      "Outbound data transfer or bandwidth charges",
      "A resource lock fee",
      "A charge for each Azure portal sign-in"
    ],
    "correctAnswer": "Outbound data transfer or bandwidth charges",
    "explanation": "Outbound data transfer may incur bandwidth charges depending on the zones and services involved.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-003",
    "category": "Azure management and governance",
    "objective": "Choose reservations",
    "difficulty": "medium",
    "question": "A company operates the same eligible production workload continuously with predictable capacity for three years. Which option is designed to reduce its cost through a resource commitment?",
    "options": [
      "Azure Spot Virtual Machines",
      "An Azure resource lock",
      "Azure Reservations",
      "An Azure Policy audit rule"
    ],
    "correctAnswer": "Azure Reservations",
    "explanation": "Azure Reservations can reduce eligible charges for predictable resource usage with one- or three-year commitments.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-004",
    "category": "Azure management and governance",
    "objective": "Choose savings plans",
    "difficulty": "medium",
    "question": "An organization has predictable compute expenditure but switches among eligible compute services. Which discount option commits to an hourly spend rather than one specific VM configuration?",
    "options": [
      "A resource group budget",
      "Azure Spot pricing",
      "A storage archive tier",
      "An Azure savings plan for compute"
    ],
    "correctAnswer": "An Azure savings plan for compute",
    "explanation": "Savings plans for compute are based on a committed hourly spend across eligible compute usage.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-005",
    "category": "Azure management and governance",
    "objective": "Choose Spot pricing",
    "difficulty": "easy",
    "question": "A media company runs a restartable, non-urgent image-processing job and wants the lowest available compute price while accepting interruption. Which option fits?",
    "options": [
      "Azure Spot Virtual Machines",
      "Dedicated production virtual machines with a resource lock",
      "A guaranteed always-on service-level agreement",
      "An Azure reserved IP address"
    ],
    "correctAnswer": "Azure Spot Virtual Machines",
    "explanation": "Spot VMs use spare Azure capacity at lower prices but can be evicted, so they are suited to interruptible jobs.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-006",
    "category": "Azure management and governance",
    "objective": "Understand Azure Pricing Calculator",
    "difficulty": "easy",
    "question": "A project manager adds a virtual machine and storage to the Azure Pricing Calculator. What happens?",
    "options": [
      "The resources are created and start billing immediately",
      "An estimated cost is generated without deploying those resources",
      "The resources are automatically reserved for three years",
      "A subscription budget is created and enforced"
    ],
    "correctAnswer": "An estimated cost is generated without deploying those resources",
    "explanation": "The Pricing Calculator estimates costs; adding resources there does not provision them or create charges.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-007",
    "category": "Azure management and governance",
    "objective": "Understand budgets and alerts",
    "difficulty": "medium",
    "question": "A monthly Azure budget reaches its configured alert threshold. What is the normal result without additional automation?",
    "options": [
      "All subscription resources automatically shut down",
      "All resource locks are removed",
      "An alert is generated for configured recipients",
      "The subscription billing currency changes"
    ],
    "correctAnswer": "An alert is generated for configured recipients",
    "explanation": "Budget thresholds can trigger alerts. Automated shutdown or changes require additional configuration.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-008",
    "category": "Azure management and governance",
    "objective": "Describe resource tags",
    "difficulty": "easy",
    "question": "A business wants to attribute resource costs to departments without changing network access. Which approach is most suitable?",
    "options": [
      "Create a virtual network peering link",
      "Enable Azure Monitor Application Insights",
      "Apply ReadOnly resource locks",
      "Add CostCenter and Department resource tags"
    ],
    "correctAnswer": "Add CostCenter and Department resource tags",
    "explanation": "Tags are key-value metadata used for categorization, cost allocation, operations, and governance.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-009",
    "category": "Azure management and governance",
    "objective": "Use Azure Policy",
    "difficulty": "easy",
    "question": "A company requires new storage accounts to be deployed only in approved regions. Which Azure capability is designed to enforce or audit that rule?",
    "options": [
      "Azure Policy",
      "Azure Advisor",
      "Azure ExpressRoute",
      "Azure DNS"
    ],
    "correctAnswer": "Azure Policy",
    "explanation": "Azure Policy evaluates resource configuration and can restrict non-compliant deployments based on policy definitions.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-010",
    "category": "Azure management and governance",
    "objective": "Describe Azure Policy initiatives",
    "difficulty": "easy",
    "question": "An administrator wants to assign a group of related policy definitions for a single compliance goal. What should they create?",
    "options": [
      "A subscription quota",
      "An Azure Policy initiative",
      "A virtual machine availability set",
      "A DNS zone"
    ],
    "correctAnswer": "An Azure Policy initiative",
    "explanation": "An Azure Policy initiative groups policy definitions to manage broader compliance objectives.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-011",
    "category": "Azure management and governance",
    "objective": "Understand resource locks",
    "difficulty": "medium",
    "question": "A production storage account must remain readable and modifiable by authorized users but must not be deleted accidentally. Which lock fits?",
    "options": [
      "ReadOnly lock",
      "Conditional Access rule",
      "Delete lock",
      "An Azure budget"
    ],
    "correctAnswer": "Delete lock",
    "explanation": "A Delete lock prevents deletion but permits other allowed changes; ReadOnly also prevents updates.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-012",
    "category": "Azure management and governance",
    "objective": "Find service compliance evidence",
    "difficulty": "medium",
    "question": "An auditor requests Microsoft cloud compliance and security assurance documents. Where should the team begin?",
    "options": [
      "Azure DNS",
      "Azure Resource Manager",
      "Azure Portal Cloud Shell",
      "Microsoft Service Trust Portal"
    ],
    "correctAnswer": "Microsoft Service Trust Portal",
    "explanation": "The Service Trust Portal provides access to Microsoft security, privacy, and compliance documentation.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-013",
    "category": "Azure management and governance",
    "objective": "Use Azure Cloud Shell",
    "difficulty": "easy",
    "question": "A student wants to run Azure CLI commands in a browser without installing CLI software locally. Which tool supports this?",
    "options": [
      "Azure Cloud Shell",
      "Application Insights",
      "Azure Advisor",
      "Microsoft Purview"
    ],
    "correctAnswer": "Azure Cloud Shell",
    "explanation": "Azure Cloud Shell provides browser-based Azure CLI and PowerShell environments.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-014",
    "category": "Azure management and governance",
    "objective": "Describe Azure Resource Manager",
    "difficulty": "medium",
    "question": "A deployment is requested from the Azure portal, CLI, or an API. What common management service processes and authorizes these resource-management requests?",
    "options": [
      "Azure Storage Explorer",
      "Azure Resource Manager",
      "Azure ExpressRoute",
      "Azure Data Box"
    ],
    "correctAnswer": "Azure Resource Manager",
    "explanation": "Azure Resource Manager is the management layer through which Azure resource deployment and management requests pass.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-015",
    "category": "Azure management and governance",
    "objective": "Describe Bicep templates",
    "difficulty": "medium",
    "question": "A team wants readable, declarative infrastructure-as-code definitions for Azure deployments with a streamlined syntax. Which option best fits?",
    "options": [
      "An Azure DNS zone file",
      "A manually maintained virtual machine inventory",
      "Bicep",
      "An Azure Service Health notification"
    ],
    "correctAnswer": "Bicep",
    "explanation": "Bicep is a declarative language for Azure resource deployment that compiles to Azure Resource Manager templates.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-016",
    "category": "Azure management and governance",
    "objective": "Use Azure Advisor",
    "difficulty": "medium",
    "question": "An administrator wants personalized recommendations to improve Azure reliability, cost, security, and performance. Which service should they inspect?",
    "options": [
      "Azure Service Health",
      "Microsoft Cost Management only",
      "Azure DNS",
      "Azure Advisor"
    ],
    "correctAnswer": "Azure Advisor",
    "explanation": "Azure Advisor analyses resources and offers best-practice recommendations including cost, performance, reliability, and security.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-017",
    "category": "Azure management and governance",
    "objective": "Use Azure Service Health",
    "difficulty": "medium",
    "question": "A service owner needs information about an Azure incident or planned maintenance potentially affecting the owner's subscribed services. Which tool is most relevant?",
    "options": [
      "Azure Service Health",
      "Azure Pricing Calculator",
      "Azure Storage Explorer",
      "Azure Resource Manager templates"
    ],
    "correctAnswer": "Azure Service Health",
    "explanation": "Azure Service Health provides personalized information about service incidents, planned maintenance, and advisories.",
    "verificationStatus": "needs-verification"
  },
  {
    "id": "added-gov-source-018",
    "category": "Azure management and governance",
    "objective": "Use Application Insights",
    "difficulty": "medium",
    "question": "An application team wants to investigate request failures, latency, and dependencies in its running web app. Which Azure Monitor capability is designed for this?",
    "options": [
      "Azure Advisor",
      "Application Insights",
      "Azure Policy initiatives",
      "Azure File Sync"
    ],
    "correctAnswer": "Application Insights",
    "explanation": "Application Insights is an application-performance monitoring capability within Azure Monitor.",
    "verificationStatus": "needs-verification"
  }
]
