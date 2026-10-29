/** Exact, deduplicated learning objectives from the uploaded Learning objective.docx.
 * Mappings to existing lessons are editorial cross-references (not claims of exam certification).
 * The source repeats its Azure cost objectives; those repeats are intentionally collapsed.
 */
export type SourceLearningObjective = {
  id: string
  text: string
  moduleId: string
  lessonTitle: string
  kind: "concept" | "guided-practice"
}
export const sourceLearningObjectives: SourceLearningObjective[] = [
  {
    "id": "LO-001",
    "text": "Define cloud computing.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Cloud computing",
    "kind": "concept"
  },
  {
    "id": "LO-002",
    "text": "Describe the shared responsibility model.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Shared responsibility",
    "kind": "concept"
  },
  {
    "id": "LO-003",
    "text": "Define cloud models, including public, private, and hybrid.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Public cloud",
    "kind": "concept"
  },
  {
    "id": "LO-004",
    "text": "Identify appropriate use cases for each cloud model.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Hybrid cloud",
    "kind": "concept"
  },
  {
    "id": "LO-005",
    "text": "Describe the consumption-based model.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Consumption-based model",
    "kind": "concept"
  },
  {
    "id": "LO-006",
    "text": "Compare cloud pricing models.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Reservations",
    "kind": "concept"
  },
  {
    "id": "LO-007",
    "text": "Describe the benefits of high availability and scalability in the cloud.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "High availability",
    "kind": "concept"
  },
  {
    "id": "LO-008",
    "text": "Describe the benefits of reliability and predictability in the cloud.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Reliability",
    "kind": "concept"
  },
  {
    "id": "LO-009",
    "text": "Describe the benefits of security and governance in the cloud.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Security and governance",
    "kind": "concept"
  },
  {
    "id": "LO-010",
    "text": "Describe the benefits of manageability in the cloud.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Management of and in the cloud",
    "kind": "concept"
  },
  {
    "id": "LO-011",
    "text": "Describe sustainability considerations and benefits in the cloud.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Sustainability",
    "kind": "concept"
  },
  {
    "id": "LO-012",
    "text": "Describe factors that can affect costs in Azure.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Resource type and settings",
    "kind": "concept"
  },
  {
    "id": "LO-013",
    "text": "Describe the Azure Pricing calculator.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Azure Pricing Calculator",
    "kind": "concept"
  },
  {
    "id": "LO-014",
    "text": "Describe the Microsoft Cost Management Tool.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Microsoft Cost Management",
    "kind": "concept"
  },
  {
    "id": "LO-015",
    "text": "Describe the purpose of tags.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Resource tags",
    "kind": "concept"
  },
  {
    "id": "LO-016",
    "text": "Describe cost optimization options, including Reservations, savings plans, and Spot pricing.",
    "moduleId": "cloud-concepts",
    "lessonTitle": "Reservations",
    "kind": "concept"
  },
  {
    "id": "LO-017",
    "text": "Describe the purpose of Microsoft Purview",
    "moduleId": "governance-security",
    "lessonTitle": "Microsoft Purview",
    "kind": "concept"
  },
  {
    "id": "LO-018",
    "text": "Describe the purpose of Azure Policy",
    "moduleId": "governance-security",
    "lessonTitle": "Azure Policy",
    "kind": "concept"
  },
  {
    "id": "LO-019",
    "text": "How does Azure Policy define policies?",
    "moduleId": "governance-security",
    "lessonTitle": "Azure Policy",
    "kind": "concept"
  },
  {
    "id": "LO-020",
    "text": "What are Azure Policy initiatives?",
    "moduleId": "governance-security",
    "lessonTitle": "Policy initiatives and guardrails",
    "kind": "concept"
  },
  {
    "id": "LO-021",
    "text": "Describe the purpose of resource locks",
    "moduleId": "governance-security",
    "lessonTitle": "Resource locks",
    "kind": "concept"
  },
  {
    "id": "LO-022",
    "text": "Describe the purpose of the Service Trust portal",
    "moduleId": "governance-security",
    "lessonTitle": "Service Trust Portal",
    "kind": "concept"
  },
  {
    "id": "LO-023",
    "text": "Describe the Azure portal.",
    "moduleId": "governance-security",
    "lessonTitle": "Azure portal",
    "kind": "concept"
  },
  {
    "id": "LO-024",
    "text": "Describe Azure Cloud Shell, including Azure CLI and Azure PowerShell.",
    "moduleId": "governance-security",
    "lessonTitle": "Azure Cloud Shell",
    "kind": "concept"
  },
  {
    "id": "LO-025",
    "text": "Describe the purpose of Azure Arc.",
    "moduleId": "governance-security",
    "lessonTitle": "Azure Arc",
    "kind": "concept"
  },
  {
    "id": "LO-026",
    "text": "Describe Azure Resource Manager (ARM), ARM templates, and Bicep.",
    "moduleId": "governance-security",
    "lessonTitle": "ARM templates and Bicep",
    "kind": "concept"
  },
  {
    "id": "LO-027",
    "text": "Describe the purpose of Azure Advisor.",
    "moduleId": "governance-security",
    "lessonTitle": "Azure Advisor",
    "kind": "concept"
  },
  {
    "id": "LO-028",
    "text": "Describe Azure Service Health.",
    "moduleId": "governance-security",
    "lessonTitle": "Azure Status, Service Health, and Resource Health",
    "kind": "concept"
  },
  {
    "id": "LO-029",
    "text": "Describe Azure Monitor, including Azure Log Analytics, Azure Monitor Alerts, and Application Insights.",
    "moduleId": "governance-security",
    "lessonTitle": "Azure Monitor",
    "kind": "concept"
  },
  {
    "id": "LO-030",
    "text": "Describe Azure regions, region pairs, and sovereign regions.",
    "moduleId": "azure-architecture",
    "lessonTitle": "Azure regions",
    "kind": "concept"
  },
  {
    "id": "LO-031",
    "text": "Describe Availability Zones.",
    "moduleId": "azure-architecture",
    "lessonTitle": "Availability zones",
    "kind": "concept"
  },
  {
    "id": "LO-032",
    "text": "Describe Azure datacenters.",
    "moduleId": "azure-architecture",
    "lessonTitle": "Azure datacenters",
    "kind": "concept"
  },
  {
    "id": "LO-033",
    "text": "Describe Azure resources and Resource Groups.",
    "moduleId": "azure-architecture",
    "lessonTitle": "Resource groups",
    "kind": "concept"
  },
  {
    "id": "LO-034",
    "text": "Describe subscriptions.",
    "moduleId": "azure-architecture",
    "lessonTitle": "Azure subscriptions",
    "kind": "concept"
  },
  {
    "id": "LO-035",
    "text": "Describe management groups.",
    "moduleId": "azure-architecture",
    "lessonTitle": "Management groups",
    "kind": "concept"
  },
  {
    "id": "LO-036",
    "text": "Describe the hierarchy of resource groups, subscriptions, and management groups.",
    "moduleId": "azure-architecture",
    "lessonTitle": "The Azure hierarchy",
    "kind": "concept"
  },
  {
    "id": "LO-037",
    "text": "Compare compute types, including container instances, virtual machines, and functions.",
    "moduleId": "azure-services",
    "lessonTitle": "Choosing a hosting option",
    "kind": "concept"
  },
  {
    "id": "LO-038",
    "text": "Describe virtual machine options, including virtual machines (VMs), virtual machine scale sets, and virtual machine availability sets.",
    "moduleId": "azure-services",
    "lessonTitle": "Availability Sets",
    "kind": "concept"
  },
  {
    "id": "LO-039",
    "text": "Describe resources required for virtual machines.",
    "moduleId": "azure-services",
    "lessonTitle": "VM size families and resources",
    "kind": "concept"
  },
  {
    "id": "LO-040",
    "text": "Describe application hosting options, including Azure Web Apps, containers, and virtual machines.",
    "moduleId": "azure-services",
    "lessonTitle": "Azure App Service",
    "kind": "concept"
  },
  {
    "id": "LO-041",
    "text": "Describe AI, machine learning, and IoT/Edge service categories in Azure.",
    "moduleId": "azure-services",
    "lessonTitle": "Azure AI services and Azure OpenAI",
    "kind": "concept"
  },
  {
    "id": "LO-042",
    "text": "Recognize agentic AI as an application pattern built from Azure AI capabilities.",
    "moduleId": "azure-services",
    "lessonTitle": "Agentic AI pattern",
    "kind": "concept"
  },
  {
    "id": "LO-043",
    "text": "Describe Azure virtual networking",
    "moduleId": "azure-services",
    "lessonTitle": "Virtual networks and subnets",
    "kind": "concept"
  },
  {
    "id": "LO-044",
    "text": "Describe Azure virtual private networks",
    "moduleId": "azure-services",
    "lessonTitle": "VPN Gateway",
    "kind": "concept"
  },
  {
    "id": "LO-045",
    "text": "Describe Azure ExpressRoute",
    "moduleId": "azure-services",
    "lessonTitle": "Azure ExpressRoute",
    "kind": "concept"
  },
  {
    "id": "LO-046",
    "text": "Describe Azure DNS",
    "moduleId": "azure-services",
    "lessonTitle": "Azure DNS",
    "kind": "concept"
  },
  {
    "id": "LO-047",
    "text": "Describe Azure virtual networking, including subnets and endpoints.",
    "moduleId": "azure-services",
    "lessonTitle": "Virtual networks and subnets",
    "kind": "concept"
  },
  {
    "id": "LO-048",
    "text": "Describe connectivity options with Azure VPN Gateway.",
    "moduleId": "azure-services",
    "lessonTitle": "VPN Gateway",
    "kind": "concept"
  },
  {
    "id": "LO-049",
    "text": "Describe when to use Azure ExpressRoute.",
    "moduleId": "azure-services",
    "lessonTitle": "Azure ExpressRoute",
    "kind": "concept"
  },
  {
    "id": "LO-050",
    "text": "Describe Azure DNS capabilities.",
    "moduleId": "azure-services",
    "lessonTitle": "Azure DNS",
    "kind": "concept"
  },
  {
    "id": "LO-051",
    "text": "Configure basic network access for an Azure resource.",
    "moduleId": "azure-services",
    "lessonTitle": "VNet peering and basic access",
    "kind": "guided-practice"
  },
  {
    "id": "LO-052",
    "text": "Describe Azure directory services",
    "moduleId": "governance-security",
    "lessonTitle": "Microsoft Entra ID",
    "kind": "concept"
  },
  {
    "id": "LO-053",
    "text": "What does Microsoft Entra ID do?",
    "moduleId": "governance-security",
    "lessonTitle": "Microsoft Entra ID",
    "kind": "concept"
  },
  {
    "id": "LO-054",
    "text": "What is Microsoft Entra Domain Services?",
    "moduleId": "governance-security",
    "lessonTitle": "Microsoft Entra Domain Services",
    "kind": "concept"
  },
  {
    "id": "LO-055",
    "text": "How does Microsoft Entra Domain Services work?",
    "moduleId": "governance-security",
    "lessonTitle": "Microsoft Entra Domain Services",
    "kind": "concept"
  },
  {
    "id": "LO-056",
    "text": "Describe Azure authentication methods",
    "moduleId": "governance-security",
    "lessonTitle": "Multifactor Authentication",
    "kind": "concept"
  },
  {
    "id": "LO-057",
    "text": "Describe Azure external identities",
    "moduleId": "governance-security",
    "lessonTitle": "External identities",
    "kind": "concept"
  },
  {
    "id": "LO-058",
    "text": "Describe Azure conditional access",
    "moduleId": "governance-security",
    "lessonTitle": "Conditional Access",
    "kind": "concept"
  },
  {
    "id": "LO-059",
    "text": "Describe Azure role-based access control",
    "moduleId": "governance-security",
    "lessonTitle": "Azure RBAC",
    "kind": "concept"
  },
  {
    "id": "LO-060",
    "text": "Describe Zero Trust model",
    "moduleId": "governance-security",
    "lessonTitle": "Zero Trust",
    "kind": "concept"
  },
  {
    "id": "LO-061",
    "text": "Describe defense-in-depth",
    "moduleId": "governance-security",
    "lessonTitle": "Defense in depth",
    "kind": "concept"
  },
  {
    "id": "LO-062",
    "text": "Describe encryption and key management in Azure",
    "moduleId": "governance-security",
    "lessonTitle": "Azure Key Vault",
    "kind": "concept"
  },
  {
    "id": "LO-063",
    "text": "Describe Microsoft Defender for Cloud",
    "moduleId": "governance-security",
    "lessonTitle": "Microsoft Defender for Cloud",
    "kind": "concept"
  }
]

export function getObjectivesForModule(moduleId: string): SourceLearningObjective[] {
  return sourceLearningObjectives.filter((objective) => objective.moduleId === moduleId)
}
