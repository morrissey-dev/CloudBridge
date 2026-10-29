import { sourceGovernanceQuestions } from "./az900GovernanceQuestions.ts"
export type AZ900Category =
  | "Cloud concepts"
  | "Azure architecture and services"
  | "Azure management and governance"

export type AZ900Difficulty = "easy" | "medium" | "challenging"

export type AZ900Question = {
  id: string
  category: AZ900Category
  objective: string
  difficulty: AZ900Difficulty
  question: string
  options: [string, string, string, string]
  correctAnswer: string
  explanation: string
  verificationStatus?: "needs-verification"
}

const originalAZ900ExamQuestions: AZ900Question[] = [
  {
    id: "cloud-01",
    category: "Cloud concepts",
    objective: "Define cloud computing",
    difficulty: "easy",
    question:
      "A startup needs computing power this week but does not want to buy servers or build a datacenter. Which approach best meets its need?",
    options: [
      "Rent computing services over the internet from a cloud provider",
      "Purchase enough hardware for the startup's largest possible future workload",
      "Move all work to a private office network without hosted services",
      "Replace its application with a spreadsheet stored on one laptop",
    ],
    correctAnswer: "Rent computing services over the internet from a cloud provider",
    explanation:
      "Cloud computing delivers services such as compute, storage, and networking over the internet on demand. Buying hardware is an upfront-capital approach, not cloud consumption.",
  },
  {
    id: "cloud-02",
    category: "Cloud concepts",
    objective: "Apply the shared responsibility model",
    difficulty: "medium",
    question:
      "A team runs a virtual machine in Azure IaaS. Which security task remains the team's responsibility rather than Microsoft's?",
    options: [
      "Protecting the physical host hardware",
      "Maintaining power and cooling in the datacenter",
      "Patching the guest operating system on the virtual machine",
      "Securing the physical network in the Azure datacenter",
    ],
    correctAnswer: "Patching the guest operating system on the virtual machine",
    explanation:
      "With IaaS, Microsoft secures the underlying datacenter and hosts, while the customer manages the guest operating system and its applications. The customer also remains responsible for its data, identities, and access.",
  },
  {
    id: "cloud-03",
    category: "Cloud concepts",
    objective: "Compare public cloud use cases",
    difficulty: "easy",
    question:
      "A small company wants to launch a public website quickly without owning or maintaining the underlying datacenter. Which cloud model is the most direct fit?",
    options: [
      "Private cloud dedicated to that company",
      "Public cloud capacity provided by a third party",
      "On-premises infrastructure with no cloud services",
      "A hybrid cloud that must keep every workload private",
    ],
    correctAnswer: "Public cloud capacity provided by a third party",
    explanation:
      "A public cloud provides shared provider-operated capacity that customers can purchase and use without owning the datacenter. A private cloud is dedicated to one organization.",
  },
  {
    id: "cloud-04",
    category: "Cloud concepts",
    objective: "Identify private cloud use cases",
    difficulty: "medium",
    question:
      "An organization requires a cloud environment dedicated to itself and wants direct control over infrastructure configuration, accepting more operational responsibility. Which model fits best?",
    options: [
      "Public cloud",
      "Private cloud",
      "Multicloud",
      "Consumption-based public cloud only",
    ],
    correctAnswer: "Private cloud",
    explanation:
      "A private cloud is dedicated to one organization and can provide greater control, usually with more cost and maintenance. Multicloud means using multiple public cloud providers.",
  },
  {
    id: "cloud-05",
    category: "Cloud concepts",
    objective: "Choose a hybrid cloud model",
    difficulty: "medium",
    question:
      "A company keeps a regulated database in its private environment but uses Azure to add capacity for seasonal web traffic. Which model is it using?",
    options: ["Public cloud only", "Private cloud only", "Hybrid cloud", "Multicloud"],
    correctAnswer: "Hybrid cloud",
    explanation:
      "Hybrid cloud connects private and public cloud environments so workloads can be placed in either. Multicloud instead refers to using more than one public cloud provider.",
  },
  {
    id: "cloud-06",
    category: "Cloud concepts",
    objective: "Explain consumption-based pricing",
    difficulty: "easy",
    question:
      "A development team deletes test resources after each exercise and pays for the resources it used. Which cloud-pricing idea does this demonstrate?",
    options: [
      "A fixed hardware purchase regardless of use",
      "Consumption-based, pay-as-you-go pricing",
      "A private cloud license that includes unlimited capacity",
      "A resource lock that stops billing",
    ],
    correctAnswer: "Consumption-based, pay-as-you-go pricing",
    explanation:
      "Consumption-based pricing charges for resources used, and releasing resources can prevent paying for idle capacity. A lock protects a resource from certain changes; it does not stop its charges.",
  },
  {
    id: "cloud-07",
    category: "Cloud concepts",
    objective: "Distinguish scalability and elasticity",
    difficulty: "medium",
    question:
      "An online store automatically adds application instances when demand spikes and removes them when traffic drops. Which cloud characteristic is most directly shown?",
    options: ["Elasticity", "Data residency", "Resource governance", "Capital expenditure"],
    correctAnswer: "Elasticity",
    explanation:
      "Elasticity adjusts capacity up or down as demand changes. Scalability is the broader ability to increase capacity; the automatic adjustment in both directions is elasticity.",
  },
  {
    id: "cloud-08",
    category: "Cloud concepts",
    objective: "Describe high availability and reliability",
    difficulty: "medium",
    question:
      "A service is designed so that a failure in one datacenter location does not make the entire application unavailable. Which goal is the design primarily addressing?",
    options: ["High availability", "Consumption billing", "Data classification", "Vertical scaling"],
    correctAnswer: "High availability",
    explanation:
      "High availability aims to keep a service accessible despite component or location failures. Reliability is the broader ability of a system to perform consistently over time.",
  },
  {
    id: "cloud-09",
    category: "Cloud concepts",
    objective: "Explain cloud agility and economies of scale",
    difficulty: "medium",
    question:
      "A product team provisions a test environment in minutes and uses capacity from a provider that operates infrastructure for many customers. Which pair of cloud benefits is illustrated?",
    options: [
      "Agility from rapid provisioning and economies of scale from shared provider infrastructure",
      "A requirement to purchase peak capacity and manage a private datacenter",
      "Elimination of customer security responsibilities and guaranteed zero downtime",
      "A fixed hardware purchase and resource locking",
    ],
    correctAnswer:
      "Agility from rapid provisioning and economies of scale from shared provider infrastructure",
    explanation:
      "On-demand provisioning improves agility, while a provider's shared infrastructure can benefit from economies of scale. Cloud services do not remove customer security responsibilities or guarantee zero downtime.",
  },
  {
    id: "cloud-10",
    category: "Cloud concepts",
    objective: "Explain predictability and cloud pricing models",
    difficulty: "challenging",
    question:
      "A company has a steady workload it expects to run for several years. It wants to compare pay-as-you-go charges with commitment-based discounts and forecast its spending. Which approach is most appropriate?",
    options: [
      "Estimate the workload with the Pricing Calculator and compare eligible reservation pricing",
      "Use Azure Service Health to lock in a lower compute price",
      "Choose Archive storage for every virtual machine disk",
      "Create a resource group because resource groups guarantee a fixed bill",
    ],
    correctAnswer:
      "Estimate the workload with the Pricing Calculator and compare eligible reservation pricing",
    explanation:
      "The Pricing Calculator estimates planned service costs, and eligible reservations can reduce cost for predictable long-running usage. Neither resource groups nor Service Health set a fixed price.",
  },
  {
    id: "cloud-11",
    category: "Cloud concepts",
    objective: "Describe sustainability through efficient resource use",
    difficulty: "medium",
    question:
      "A team finds nonproduction compute sitting idle overnight, right-sizes it, and schedules it to stop when it is not needed. Which sustainability practice is it applying?",
    options: [
      "Reduce unnecessary resource consumption by matching capacity to actual demand",
      "Keep all compute at peak size so capacity is always available",
      "Assume moving to cloud automatically makes a workload sustainable",
      "Use a resource lock to stop an idle virtual machine from consuming resources",
    ],
    correctAnswer:
      "Reduce unnecessary resource consumption by matching capacity to actual demand",
    explanation:
      "Right-sizing and stopping unused compute can reduce idle resource waste. Cloud hosting alone does not make a workload sustainable; its architecture and operations still affect resource consumption.",
  },
  {
    id: "arch-01",
    category: "Azure architecture and services",
    objective: "Describe Azure regions and region pairs",
    difficulty: "medium",
    question:
      "A disaster-recovery team deploys resources in one Azure region and copies important data to its paired region. What should the team assume about failover?",
    options: [
      "Every Azure service automatically fails over to the paired region",
      "The team must configure and test recovery for services that do not fail over automatically",
      "A region pair is the same thing as a resource group",
      "The paired region removes the need for backups",
    ],
    correctAnswer:
      "The team must configure and test recovery for services that do not fail over automatically",
    explanation:
      "Region pairs support broader resilience, but customers still need to configure replication and recovery where a service does not fail over automatically. A paired region is not a backup by itself.",
  },
  {
    id: "arch-02",
    category: "Azure architecture and services",
    objective: "Describe availability zones",
    difficulty: "easy",
    question:
      "A hospital wants two application instances in physically separate datacenter locations within the same supported Azure region. Which feature should it use?",
    options: ["Availability zones", "Management groups", "Resource tags", "Billing scopes"],
    correctAnswer: "Availability zones",
    explanation:
      "Availability zones are physically separate locations within a region with independent power, cooling, and networking, helping isolate a single-location failure.",
  },
  {
    id: "arch-03",
    category: "Azure architecture and services",
    objective: "Describe the Azure resource hierarchy",
    difficulty: "easy",
    question:
      "A company wants a policy to apply consistently to several subscriptions belonging to the same division. Where should the policy be assigned?",
    options: ["A management group above those subscriptions", "A single virtual machine", "An availability zone", "A storage container"],
    correctAnswer: "A management group above those subscriptions",
    explanation:
      "Management groups sit above subscriptions, and policy assignments can be inherited by the subscriptions and resources below them.",
  },
  {
    id: "arch-04",
    category: "Azure architecture and services",
    objective: "Choose resource group and subscription scopes",
    difficulty: "medium",
    question:
      "A temporary training environment contains a VM, virtual network, and storage account that should be managed and removed together. What is the most suitable container?",
    options: ["A resource group", "A region pair", "An availability zone", "A management group"],
    correctAnswer: "A resource group",
    explanation:
      "A resource group organizes related resources for management and lifecycle actions. Deleting the group also deletes its resources, so the team should verify the contents first.",
  },
  {
    id: "arch-05",
    category: "Azure architecture and services",
    objective: "Select an Azure compute hosting option",
    difficulty: "medium",
    question:
      "A company must install custom operating-system software and manage the guest OS for a legacy application. Which Azure compute option gives it the most control?",
    options: ["Azure Virtual Machines", "Azure Functions", "Azure App Service", "Azure Blob Storage"],
    correctAnswer: "Azure Virtual Machines",
    explanation:
      "Virtual machines provide control over the guest operating system and installed software, along with more customer management responsibility than managed hosting options.",
  },
  {
    id: "arch-06",
    category: "Azure architecture and services",
    objective: "Select managed web application hosting",
    difficulty: "easy",
    question:
      "A team needs to host a web application and REST API without managing the underlying operating system. Which service is the best fit?",
    options: ["Azure App Service", "Azure Virtual Network", "Azure Data Box", "Azure Policy"],
    correctAnswer: "Azure App Service",
    explanation:
      "App Service is a managed platform for web apps and REST APIs. A virtual network provides connectivity, not application hosting.",
  },
  {
    id: "arch-07",
    category: "Azure architecture and services",
    objective: "Select event-driven serverless compute",
    difficulty: "medium",
    question:
      "A photo-processing task should run only when a new image arrives in storage and scale with the number of uploads. Which compute option is most appropriate?",
    options: ["Azure Functions", "Azure Virtual Machines", "Azure Files", "Azure DNS"],
    correctAnswer: "Azure Functions",
    explanation:
      "Functions runs event-driven code in response to triggers and can scale with demand, making it suitable for work that occurs when an event happens.",
  },
  {
    id: "arch-08",
    category: "Azure architecture and services",
    objective: "Choose container hosting options",
    difficulty: "challenging",
    question:
      "A team has a small containerized API and wants managed scaling without operating a Kubernetes cluster. Which service is the better fit?",
    options: ["Azure Container Apps", "Azure Kubernetes Service", "Azure Virtual Desktop", "Azure Files"],
    correctAnswer: "Azure Container Apps",
    explanation:
      "Container Apps offers managed scaling for container applications without requiring the team to operate a full Kubernetes platform. AKS is appropriate when Kubernetes orchestration is needed.",
  },
  {
    id: "arch-09",
    category: "Azure architecture and services",
    objective: "Describe virtual networks and network security groups",
    difficulty: "medium",
    question:
      "A web subnet should accept HTTPS traffic, while direct internet traffic to a database subnet should be blocked. Which Azure feature provides rules for this traffic filtering?",
    options: ["Network Security Groups", "Resource tags", "Azure Advisor", "Availability sets"],
    correctAnswer: "Network Security Groups",
    explanation:
      "NSGs use inbound and outbound rules based on addresses, ports, and protocols. They can allow HTTPS to the web tier while restricting traffic to the database tier.",
  },
  {
    id: "arch-10",
    category: "Azure architecture and services",
    objective: "Choose hybrid network connectivity",
    difficulty: "medium",
    question:
      "A branch office needs an encrypted connection to an Azure virtual network over the public internet. Which service should it use?",
    options: ["VPN Gateway", "Azure DNS", "Azure Front Door", "Application Insights"],
    correctAnswer: "VPN Gateway",
    explanation:
      "VPN Gateway creates encrypted tunnels over the public internet for connections such as site-to-site VPNs. ExpressRoute is a private connectivity option that does not send traffic over the public internet.",
  },
  {
    id: "arch-11",
    category: "Azure architecture and services",
    objective: "Choose Azure storage services",
    difficulty: "easy",
    question:
      "A media company needs highly scalable object storage for images and video files. Which Azure storage service is the most direct fit?",
    options: ["Azure Blob Storage", "Azure DNS", "Azure Policy", "Azure Virtual Network"],
    correctAnswer: "Azure Blob Storage",
    explanation:
      "Blob Storage is designed for large amounts of unstructured object data such as images and video. DNS and virtual networks provide different capabilities.",
  },
  {
    id: "arch-12",
    category: "Azure architecture and services",
    objective: "Compare storage redundancy options",
    difficulty: "challenging",
    question:
      "A workload needs storage copies distributed synchronously across availability zones within its primary region. Which redundancy option matches this requirement?",
    options: ["Zone-redundant storage (ZRS)", "Locally redundant storage (LRS)", "Archive access tier", "A resource lock"],
    correctAnswer: "Zone-redundant storage (ZRS)",
    explanation:
      "ZRS synchronously copies data across availability zones in the primary region. LRS keeps copies in one datacenter, while Archive is an access tier rather than a redundancy option.",
  },
  {
    id: "arch-13",
    category: "Azure architecture and services",
    objective: "Choose between Azure database services",
    difficulty: "medium",
    question:
      "A customer-facing application needs a managed NoSQL database for flexible document data that it can distribute across regions. Which Azure service is the most appropriate?",
    options: ["Azure Cosmos DB", "Azure SQL Database", "Azure Blob Storage", "Azure Data Box"],
    correctAnswer: "Azure Cosmos DB",
    explanation:
      "Azure Cosmos DB is a fully managed NoSQL database designed for flexible data models and global distribution. Azure SQL Database is a managed relational service suited to relational tables and SQL queries.",
  },
  {
    id: "arch-14",
    category: "Azure architecture and services",
    objective: "Choose Azure AI services",
    difficulty: "easy",
    question:
      "A support application needs a prebuilt speech-to-text capability through an API rather than a custom model trained by its team. What should it evaluate?",
    options: ["Azure AI services", "Azure Policy", "Azure Arc", "Azure Cost Management"],
    correctAnswer: "Azure AI services",
    explanation:
      "Azure AI services provide prebuilt capabilities such as speech, language, vision, and document processing through APIs. Azure Machine Learning is used to build and manage custom models.",
  },
  {
    id: "arch-15",
    category: "Azure architecture and services",
    objective: "Choose IoT services",
    difficulty: "medium",
    question:
      "Thousands of devices must securely send telemetry to Azure and receive commands in return. Which service is designed for this device-to-cloud communication?",
    options: ["Azure IoT Hub", "Azure App Service", "Azure Advisor", "Azure Files"],
    correctAnswer: "Azure IoT Hub",
    explanation:
      "IoT Hub provides secure two-way communication between IoT devices and the cloud. IoT Central offers a higher-level managed IoT application experience.",
  },
  {
    id: "arch-16",
    category: "Azure architecture and services",
    objective: "Select a data transfer solution",
    difficulty: "challenging",
    question:
      "A company must move tens of terabytes to Azure, but its available network bandwidth makes an online transfer impractical. Which solution is designed for this situation?",
    options: ["Azure Data Box", "Azure DNS", "Azure Advisor", "Azure Functions"],
    correctAnswer: "Azure Data Box",
    explanation:
      "Data Box uses a secure physical device to transfer very large datasets when network transfer is impractical. It is not a compute or name-resolution service.",
  },
  {
    id: "gov-01",
    category: "Azure management and governance",
    objective: "Estimate and manage Azure costs",
    difficulty: "easy",
    question:
      "Before deploying a new solution, a project manager wants to estimate the cost of selected Azure services and configurations. Which tool should they use?",
    options: ["Azure Pricing Calculator", "Azure Service Health", "Microsoft Purview", "Azure Resource Health"],
    correctAnswer: "Azure Pricing Calculator",
    explanation:
      "The Pricing Calculator estimates the potential cost of planned Azure services and configurations. It does not deploy resources or create charges.",
  },
  {
    id: "gov-02",
    category: "Azure management and governance",
    objective: "Use budgets and cost alerts",
    difficulty: "medium",
    question:
      "A department wants a notification when monthly spending approaches its target so it can investigate before exceeding expectations. What should it configure?",
    options: [
      "A Cost Management budget with an alert threshold",
      "A Delete lock on the subscription",
      "An availability zone",
      "An Application Insights availability test",
    ],
    correctAnswer: "A Cost Management budget with an alert threshold",
    explanation:
      "Cost Management budgets define expected spending limits and can trigger alerts at configured thresholds. A budget does not automatically prevent all charges.",
  },
  {
    id: "gov-03",
    category: "Azure management and governance",
    objective: "Describe Microsoft Purview",
    difficulty: "medium",
    question:
      "A data-governance team needs to discover sensitive data, classify it, and understand its lineage across systems. Which Microsoft service is designed for these capabilities?",
    options: ["Microsoft Purview", "Azure Advisor", "Azure VPN Gateway", "Azure Functions"],
    correctAnswer: "Microsoft Purview",
    explanation:
      "Purview provides data-governance capabilities such as discovery, classification, and lineage across data environments. Advisor provides recommendations for Azure resources.",
  },
  {
    id: "gov-04",
    category: "Azure management and governance",
    objective: "Apply Azure Policy",
    difficulty: "easy",
    question:
      "An organization wants to prevent storage accounts from being deployed outside approved Azure regions. Which control should it use?",
    options: ["Azure Policy", "Azure Advisor", "Azure Monitor", "Microsoft Service Trust Portal"],
    correctAnswer: "Azure Policy",
    explanation:
      "Azure Policy can audit, deny, or remediate resource configurations against organizational rules. Advisor recommends improvements but does not enforce deployment rules.",
  },
  {
    id: "gov-05",
    category: "Azure management and governance",
    objective: "Use resource locks and tags",
    difficulty: "medium",
    question:
      "A production database should remain editable by its operators, but accidental deletion must be blocked. Which action best meets this requirement?",
    options: [
      "Apply a Delete lock to the database",
      "Apply a ReadOnly lock to the entire subscription",
      "Add a CostCenter tag",
      "Move the database to another availability zone",
    ],
    correctAnswer: "Apply a Delete lock to the database",
    explanation:
      "A Delete lock blocks deletion while allowing authorized changes. ReadOnly blocks both updates and deletion; a tag is metadata and does not protect a resource.",
  },
  {
    id: "gov-06",
    category: "Azure management and governance",
    objective: "Locate compliance and audit documentation",
    difficulty: "easy",
    question:
      "A compliance officer needs Microsoft's security, privacy, and compliance documentation for an audit. Where should they look?",
    options: [
      "Microsoft Service Trust Portal",
      "Azure Pricing Calculator",
      "Azure Cloud Shell",
      "Azure Virtual Network",
    ],
    correctAnswer: "Microsoft Service Trust Portal",
    explanation:
      "The Service Trust Portal provides resources about Microsoft's security, privacy, compliance controls, and audit practices. Some protected materials require sign-in.",
  },
  {
    id: "gov-07",
    category: "Azure management and governance",
    objective: "Select Azure management tools",
    difficulty: "medium",
    question:
      "An administrator is using a borrowed computer and needs an authenticated browser-based environment with Azure CLI and Azure PowerShell available without local installation. Which tool fits?",
    options: ["Azure Cloud Shell", "Azure Advisor", "Azure Arc", "Azure Resource Health"],
    correctAnswer: "Azure Cloud Shell",
    explanation:
      "Cloud Shell is an authenticated browser-based shell with Azure CLI and PowerShell available. Advisor and Resource Health are service experiences, not command environments.",
  },
  {
    id: "gov-08",
    category: "Azure management and governance",
    objective: "Describe Azure Arc and infrastructure as code",
    difficulty: "challenging",
    question:
      "A company wants to bring on-premises servers under Azure management and define repeatable deployments in a concise declarative language that deploys through Azure Resource Manager. Which pair is appropriate?",
    options: ["Azure Arc and Bicep", "Azure Service Health and Log Analytics", "Microsoft Purview and Azure Policy", "Application Insights and Azure Advisor"],
    correctAnswer: "Azure Arc and Bicep",
    explanation:
      "Azure Arc projects supported resources outside Azure into Azure Resource Manager for consistent management. Bicep is a declarative infrastructure-as-code language that deploys through ARM; ARM templates provide a JSON-based alternative.",
  },
  {
    id: "gov-09",
    category: "Azure management and governance",
    objective: "Differentiate Advisor, Service Health, and Monitor",
    difficulty: "medium",
    question:
      "An administrator needs recommendations to improve a deployed workload's reliability, security, performance, operations, and cost. Which service provides these recommendations?",
    options: ["Azure Advisor", "Azure Service Health", "Azure Monitor", "Microsoft Service Trust Portal"],
    correctAnswer: "Azure Advisor",
    explanation:
      "Advisor analyzes resources and provides recommendations in categories including reliability, security, performance, operational excellence, and cost. Service Health reports service events affecting the customer.",
  },
  {
    id: "gov-10",
    category: "Azure management and governance",
    objective: "Use monitoring logs and application insights",
    difficulty: "challenging",
    question:
      "A web team wants to trace slow requests through application dependencies and see failures and response times. Which monitoring capability is the most targeted fit?",
    options: ["Application Insights", "Azure Policy", "Microsoft Purview", "Azure Pricing Calculator"],
    correctAnswer: "Application Insights",
    explanation:
      "Application Insights monitors application requests, dependencies, response times, failures, and availability. Log Analytics is used to query collected log data, while Azure Monitor provides the broader monitoring platform.",
  },
  {
    id: "gov-11",
    category: "Azure management and governance",
    objective: "Distinguish authentication, Conditional Access, and RBAC",
    difficulty: "medium",
    question:
      "An employee signs in successfully, but access to an application should require MFA when the sign-in comes from an unfamiliar location. Which capability evaluates signals and applies that access requirement?",
    options: ["Microsoft Entra Conditional Access", "Azure resource tags", "Azure Pricing Calculator", "Azure availability sets"],
    correctAnswer: "Microsoft Entra Conditional Access",
    explanation:
      "Conditional Access evaluates signals such as identity, location, device, and application, then can allow, block, or require MFA. RBAC controls authorization to Azure resources after identity is established.",
  },
  {
    id: "gov-12",
    category: "Azure management and governance",
    objective: "Apply Zero Trust and defense in depth",
    difficulty: "challenging",
    question:
      "A security design verifies each access request, grants only required permissions, encrypts data in transit and at rest, and uses multiple independent safeguards. Which principles does this most closely apply?",
    options: [
      "Zero Trust and defense in depth",
      "Consumption-based billing and elasticity",
      "Public cloud and multicloud",
      "Availability sets and resource groups",
    ],
    correctAnswer: "Zero Trust and defense in depth",
    explanation:
      "Zero Trust verifies access explicitly and applies least privilege, while defense in depth uses multiple protective layers. Encryption in transit and at rest is one important layer alongside controls such as MFA, RBAC, and Defender for Cloud.",
  },
  {
    id: "gov-13",
    category: "Azure management and governance",
    objective: "Protect secrets and assess cloud security posture",
    difficulty: "challenging",
    question:
      "An application needs to retrieve a database password securely, and its security team wants prioritized recommendations and threat alerts for its cloud resources. Which pair of services best fits?",
    options: [
      "Azure Key Vault and Microsoft Defender for Cloud",
      "Azure DNS and Azure Data Box",
      "Azure Advisor and Azure Pricing Calculator",
      "Azure Policy and Microsoft Service Trust Portal",
    ],
    correctAnswer: "Azure Key Vault and Microsoft Defender for Cloud",
    explanation:
      "Key Vault stores and controls access to secrets, keys, and certificates. Defender for Cloud assesses security posture and helps protect workloads with recommendations and threat alerts.",
  },
]

// These questions cover identity, access, or security, which belong to
// AZ-900 "Azure architecture and services" (skills measured July 20, 2026).
const identityAndSecurityIds = new Set(["gov-11", "gov-12", "gov-13", "added-162", "added-163", "added-164", "added-165", "added-166", "added-167", "added-168", "added-169", "added-170", "added-171", "added-196", "added-197", "added-200", "added-201", "added-202"])

export const az900ExamQuestions: AZ900Question[] = [
  ...originalAZ900ExamQuestions,
  ...additionalAZ900Questions,
  ...sourceGovernanceQuestions,
].map((question) => identityAndSecurityIds.has(question.id)
  ? { ...question, category: "Azure architecture and services" as AZ900Category }
  : question)

import { additionalAZ900Questions } from "./az900AdditionalQuestions.ts"
