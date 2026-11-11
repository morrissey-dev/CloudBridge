import assert from "node:assert/strict"
import test from "node:test"

import { modules } from "./curriculum.ts"
import { v1LessonIdCrosswalk } from "./lessonIdentity.ts"

// Frozen approval fixture: module ID, original lesson title, permanent lesson ID.
const approvedLessonRegistry = [
  ["cloud-concepts", "Cloud computing", "az900-cloud-computing"],
  ["cloud-concepts", "Consumption-based model", "az900-consumption-based-model"],
  ["cloud-concepts", "Shared responsibility", "az900-shared-responsibility"],
  ["cloud-concepts", "IaaS, PaaS, and SaaS responsibility", "az900-iaas-paas-saas-responsibility"],
  ["cloud-concepts", "Public cloud", "az900-public-cloud"],
  ["cloud-concepts", "Private cloud", "az900-private-cloud"],
  ["cloud-concepts", "Hybrid cloud", "az900-hybrid-cloud"],
  ["cloud-concepts", "Multicloud", "az900-multicloud"],
  ["cloud-concepts", "Resource type and settings", "az900-resource-type-and-settings"],
  ["cloud-concepts", "Consumption and maintenance", "az900-consumption-and-maintenance"],
  ["cloud-concepts", "Geography, traffic, and billing zones", "az900-geography-traffic-and-billing-zones"],
  ["cloud-concepts", "Subscription type and Azure Marketplace", "az900-subscription-type-and-azure-marketplace"],
  ["cloud-concepts", "Azure Pricing Calculator", "az900-azure-pricing-calculator"],
  ["cloud-concepts", "Microsoft Cost Management", "az900-microsoft-cost-management"],
  ["cloud-concepts", "Resource tags", "az900-resource-tags"],
  ["cloud-concepts", "Reservations", "az900-reservations"],
  ["cloud-concepts", "Azure savings plan for compute", "az900-azure-savings-plan-for-compute"],
  ["cloud-concepts", "Spot pricing", "az900-spot-pricing"],
  ["cloud-concepts", "High availability", "az900-high-availability"],
  ["cloud-concepts", "Vertical and horizontal scalability", "az900-vertical-and-horizontal-scalability"],
  ["cloud-concepts", "Reliability", "az900-reliability"],
  ["cloud-concepts", "Performance and cost predictability", "az900-performance-and-cost-predictability"],
  ["cloud-concepts", "Security and governance", "az900-security-and-governance"],
  ["cloud-concepts", "Management of and in the cloud", "az900-management-of-and-in-the-cloud"],
  ["cloud-concepts", "Sustainability", "az900-sustainability"],
  ["azure-architecture", "Azure datacenters", "az900-azure-datacenters"],
  ["azure-architecture", "Azure regions", "az900-azure-regions"],
  ["azure-architecture", "Availability zones", "az900-availability-zones"],
  ["azure-architecture", "Zonal, zone-redundant, and non-regional services", "az900-zonal-zone-redundant-and-non-regional-services"],
  ["azure-architecture", "Region pairs", "az900-region-pairs"],
  ["azure-architecture", "Sovereign regions", "az900-sovereign-regions"],
  ["azure-architecture", "Azure resources", "az900-azure-resources"],
  ["azure-architecture", "Resource groups", "az900-resource-groups"],
  ["azure-architecture", "Azure subscriptions", "az900-azure-subscriptions"],
  ["azure-architecture", "Management groups", "az900-management-groups"],
  ["azure-architecture", "The Azure hierarchy", "az900-azure-hierarchy"],
  ["azure-services", "Azure Virtual Machines", "az900-azure-virtual-machines"],
  ["azure-services", "VM size families and resources", "az900-vm-size-families-and-resources"],
  ["azure-services", "Virtual Machine Scale Sets", "az900-virtual-machine-scale-sets"],
  ["azure-services", "Availability Sets", "az900-availability-sets"],
  ["azure-services", "Azure Container Instances", "az900-azure-container-instances"],
  ["azure-services", "Container Apps and AKS", "az900-container-apps-and-aks"],
  ["azure-services", "Azure Functions", "az900-azure-functions"],
  ["azure-services", "Azure App Service", "az900-azure-app-service"],
  ["azure-services", "Choosing a hosting option", "az900-choosing-a-hosting-option"],
  ["azure-services", "Azure AI services and Azure OpenAI", "az900-azure-ai-services-and-azure-openai"],
  ["azure-services", "Azure Machine Learning", "az900-azure-machine-learning"],
  ["azure-services", "IoT Hub, IoT Central, and IoT Edge", "az900-iot-hub-iot-central-iot-edge"],
  ["azure-services", "Agentic AI pattern", "az900-agentic-ai-pattern"],
  ["azure-services", "Virtual networks and subnets", "az900-virtual-networks-and-subnets"],
  ["azure-services", "Public and private endpoints", "az900-public-and-private-endpoints"],
  ["azure-services", "Network Security Groups", "az900-network-security-groups"],
  ["azure-services", "User-defined routes", "az900-user-defined-routes"],
  ["azure-services", "VNet peering and basic access", "az900-vnet-peering-and-basic-access"],
  ["azure-services", "VPN Gateway", "az900-vpn-gateway"],
  ["azure-services", "Policy-based and route-based VPNs", "az900-policy-based-and-route-based-vpns"],
  ["azure-services", "VPN high availability", "az900-vpn-high-availability"],
  ["azure-services", "Azure ExpressRoute", "az900-azure-expressroute"],
  ["azure-services", "Global Reach and BGP", "az900-global-reach-and-bgp"],
  ["azure-services", "Azure DNS", "az900-azure-dns"],
  ["azure-services", "Storage accounts and types", "az900-storage-accounts-and-types"],
  ["azure-services", "Blob Storage", "az900-blob-storage"],
  ["azure-services", "Azure Files", "az900-azure-files"],
  ["azure-services", "Queues, Disks, and Tables", "az900-queues-disks-and-tables"],
  ["azure-services", "Hot, Cool, Cold, and Archive tiers", "az900-hot-cool-cold-and-archive-tiers"],
  ["azure-services", "LRS and ZRS", "az900-lrs-and-zrs"],
  ["azure-services", "GRS, GZRS, RA-GRS, and RA-GZRS", "az900-grs-gzrs-ra-grs-ra-gzrs"],
  ["azure-services", "AzCopy", "az900-azcopy"],
  ["azure-services", "Azure Storage Explorer", "az900-azure-storage-explorer"],
  ["azure-services", "Azure File Sync", "az900-azure-file-sync"],
  ["azure-services", "Azure Migrate", "az900-azure-migrate"],
  ["azure-services", "Azure Data Box", "az900-azure-data-box"],
  ["governance-security", "Azure portal", "az900-azure-portal"],
  ["governance-security", "Azure Cloud Shell", "az900-azure-cloud-shell"],
  ["governance-security", "Azure CLI and Azure PowerShell", "az900-azure-cli-and-azure-powershell"],
  ["governance-security", "Azure Arc", "az900-azure-arc"],
  ["governance-security", "Azure Resource Manager", "az900-azure-resource-manager"],
  ["governance-security", "ARM templates and Bicep", "az900-arm-templates-and-bicep"],
  ["governance-security", "Azure Advisor", "az900-azure-advisor"],
  ["governance-security", "Azure Status, Service Health, and Resource Health", "az900-azure-status-service-health-and-resource-health"],
  ["governance-security", "Azure Monitor", "az900-azure-monitor"],
  ["governance-security", "Log Analytics and Alerts", "az900-log-analytics-and-alerts"],
  ["governance-security", "Application Insights", "az900-application-insights"],
  ["governance-security", "Microsoft Purview", "az900-microsoft-purview"],
  ["governance-security", "Azure Policy", "az900-azure-policy"],
  ["governance-security", "Policy initiatives and guardrails", "az900-policy-initiatives-and-guardrails"],
  ["governance-security", "Resource locks", "az900-resource-locks"],
  ["governance-security", "Service Trust Portal", "az900-service-trust-portal"],
  ["governance-security", "Microsoft Entra ID", "az900-microsoft-entra-id"],
  ["governance-security", "Microsoft Entra Domain Services", "az900-microsoft-entra-domain-services"],
  ["governance-security", "Single Sign-On", "az900-single-sign-on"],
  ["governance-security", "Multifactor Authentication", "az900-multifactor-authentication"],
  ["governance-security", "Passwordless authentication", "az900-passwordless-authentication"],
  ["governance-security", "External identities", "az900-external-identities"],
  ["governance-security", "Conditional Access", "az900-conditional-access"],
  ["governance-security", "Azure RBAC", "az900-azure-rbac"],
  ["governance-security", "Zero Trust", "az900-zero-trust"],
  ["governance-security", "Defense in depth", "az900-defense-in-depth"],
  ["governance-security", "Encryption at rest and in transit", "az900-encryption-at-rest-and-in-transit"],
  ["governance-security", "Azure Key Vault", "az900-azure-key-vault"],
  ["governance-security", "Microsoft Defender for Cloud", "az900-microsoft-defender-for-cloud"],
  ["governance-security", "Assess, Secure, and Defend", "az900-assess-secure-and-defend"],
  ["governance-security", "Secure Score and security alerts", "az900-secure-score-and-security-alerts"],
] as const

test("curriculum has 103 complete, unique permanent lesson IDs", () => {
  const lessons = modules.flatMap((module) =>
    module.sections.flatMap((section) => section.concepts),
  )
  const ids = lessons.map((lesson) => lesson.id)

  assert.equal(lessons.length, 103)
  assert.ok(ids.every((id) => /^az900-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)))
  assert.equal(new Set(ids).size, ids.length)
})

test("permanent lesson IDs match the approved titles, modules, and original order", () => {
  const actualRegistry = modules.flatMap((module) =>
    module.sections.flatMap((section) =>
      section.concepts.map((lesson) => [module.id, lesson.title, lesson.id] as const),
    ),
  )

  assert.deepEqual(actualRegistry, approvedLessonRegistry)
})

test("V1 lesson-index crosswalk explicitly maps every original position", () => {
  const actualCrosswalk = modules.flatMap((module) => {
    let lessonIndex = 0

    return module.sections.flatMap((section) =>
      section.concepts.map((lesson) => {
        const location = {
          moduleId: module.id,
          lessonIndex,
          lessonId: lesson.id,
        }
        lessonIndex += 1
        return location
      }),
    )
  })

  assert.equal(v1LessonIdCrosswalk.length, 103)
  assert.deepEqual(v1LessonIdCrosswalk, actualCrosswalk)
})

test("the original four modules and lesson counts remain unchanged", () => {
  const summary = modules.map((module) => ({
    id: module.id,
    lessonCount: module.sections.reduce(
      (count, section) => count + section.concepts.length,
      0,
    ),
  }))

  assert.deepEqual(summary, [
    { id: "cloud-concepts", lessonCount: 25 },
    { id: "azure-architecture", lessonCount: 11 },
    { id: "azure-services", lessonCount: 36 },
    { id: "governance-security", lessonCount: 31 },
  ])
})
