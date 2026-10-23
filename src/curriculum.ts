export type Concept = {
  title: string
  definition: string
  example: string
}

export type LessonSection = {
  title: string
  concepts: Concept[]
}

export type CourseModule = {
  id: string
  number: string
  title: string
  shortTitle: string
  description: string
  duration: string
  objectives: string[]
  sections: LessonSection[]
  caseStudy: {
    title: string
    context: string
    steps: string[]
    takeaway: string
  }
}

const concept = (
  title: string,
  definition: string,
  example: string,
): Concept => ({ title, definition, example })

export const modules: CourseModule[] = [
  {
    id: "cloud-concepts",
    number: "01",
    title: "Cloud Concepts, Benefits & Cost Management",
    shortTitle: "Cloud concepts",
    description:
      "Understand what cloud computing is, how responsibilities and costs work, and why organizations choose cloud services.",
    duration: "4 lessons · 28 concepts",
    objectives: [
      "Define cloud computing and the consumption-based model.",
      "Explain shared responsibility across IaaS, PaaS, and SaaS.",
      "Choose between public, private, hybrid, and multicloud models.",
      "Recognize Azure cost factors, tools, tags, and optimization options.",
      "Explain availability, scale, reliability, predictability, security, governance, manageability, and sustainability.",
    ],
    sections: [
      {
        title: "Cloud foundations",
        concepts: [
          concept(
            "Cloud computing",
            "Cloud computing is the delivery of computing services over the internet. Services include virtual machines, storage, databases, networking, AI, machine learning, and IoT.",
            "A retailer launches an online store without building a datacenter. It rents computing power and storage online, then expands them when customer demand rises.",
          ),
          concept(
            "Consumption-based model",
            "Cloud resources follow a pay-as-you-go model. You rent resources, use them when needed, and release them when demand falls. Cloud spending is normally an operational expense rather than an upfront capital expense.",
            "A startup pays for 200 GB of storage this month and 300 GB next month instead of buying enough hardware for its possible five-year growth on day one.",
          ),
          concept(
            "Shared responsibility",
            "Microsoft always protects physical datacenters, networks, and hosts. Customers always protect their data, connected devices, accounts, and identities. Responsibility for operating systems, applications, and network controls changes with the service model.",
            "A secure office landlord protects the building, power, and entrance. The tenant still controls employee keys, protects records, and decides who may enter each room.",
          ),
          concept(
            "IaaS, PaaS, and SaaS responsibility",
            "IaaS gives the customer the most control and responsibility, including the operating system and installed software. PaaS shares more responsibility with the provider. SaaS places most platform and application responsibility with the provider, while the customer still manages data and access.",
            "With a rented empty shop you furnish and operate it yourself, like IaaS. A fitted market stall is like PaaS. A fully managed business service is like SaaS, but you still control your customers and records.",
          ),
        ],
      },
      {
        title: "Cloud models",
        concepts: [
          concept(
            "Public cloud",
            "A public cloud is built, controlled, and maintained by a third-party provider. Anyone who purchases the service can access shared cloud capacity.",
            "A new delivery company uses Azure to launch quickly without buying servers, paying only for the resources its application consumes.",
          ),
          concept(
            "Private cloud",
            "A private cloud is dedicated to one organization. It offers greater control but normally requires more cost and maintenance than a public cloud.",
            "A regulated institution keeps a dedicated cloud environment for systems that require direct control over infrastructure and security settings.",
          ),
          concept(
            "Hybrid cloud",
            "A hybrid cloud connects private and public cloud environments, allowing an organization to decide where each workload runs and to use public capacity for temporary demand.",
            "A bank keeps core records in its private environment but uses Azure to add temporary public-cloud capacity when month-end transaction traffic rises.",
          ),
          concept(
            "Multicloud",
            "A multicloud environment uses services from two or more public cloud providers. Teams must manage resources and security across those providers.",
            "A media company keeps an existing analytics service with one provider while using Azure identity and application services during a gradual migration.",
          ),
        ],
      },
      {
        title: "Costs and optimization",
        concepts: [
          concept(
            "Resource type and settings",
            "Azure cost changes with the service type and its configuration. VM processors, memory, disks, operating-system licenses, storage performance, and redundancy choices all affect price.",
            "Two virtual machines in the same region cost differently when one has more CPU, memory, premium disks, and a licensed operating system.",
          ),
          concept(
            "Consumption and maintenance",
            "Using more resources costs more. Teams also control costs by finding and removing unused disks, addresses, and other resources that can remain after a main resource is deleted.",
            "A test VM is removed, but its attached disk remains. A monthly cleanup routine finds and deletes that unused disk before it creates another bill.",
          ),
          concept(
            "Geography, traffic, and billing zones",
            "Prices can differ by Azure region because power, labor, taxes, and fees vary. Network charges can also depend on where data moves. Billing zones group regions for data-transfer pricing and are different from availability zones.",
            "A streaming service compares regions close to its users and checks outbound data costs before choosing where to host large video files.",
          ),
          concept(
            "Subscription type and Azure Marketplace",
            "Subscription offers can include allowances or credits. Marketplace solutions can add a third-party vendor charge on top of the Azure resources they use.",
            "A team uses free-account credits for a prototype, then checks both Azure infrastructure and vendor licensing before buying a preconfigured Marketplace firewall.",
          ),
          concept(
            "Azure Pricing Calculator",
            "The Pricing Calculator estimates the potential cost of selected Azure services and settings. It does not deploy resources or create charges.",
            "Before approving a new web application, a project manager compares estimates for two VM sizes and three storage options.",
          ),
          concept(
            "Microsoft Cost Management",
            "Cost Management helps teams analyze, monitor, and control Azure spending. Cost analysis groups spending by subscription, resource group, service, or region. Alerts report thresholds, and budgets define expected spending limits.",
            "A department creates a monthly budget and receives an email at 80% so it can right-size resources before exceeding its target.",
          ),
          concept(
            "Resource tags",
            "Tags add name-value metadata to resources. They support organization, cost allocation, operations, security classification, governance, and automation. Common tags include Environment, Owner, CostCenter, and Workload.",
            "A company tags every resource with its department and environment, then produces separate cost reports for Finance-Prod and Marketing-Test.",
          ),
          concept(
            "Reservations",
            "Reservations reduce cost for stable, predictable workloads by committing to specific eligible capacity for one or three years.",
            "A production database runs every hour of the year with stable demand, so the company chooses a reservation instead of paying the flexible rate.",
          ),
          concept(
            "Azure savings plan for compute",
            "A savings plan commits to an hourly compute spend for one or three years while allowing more flexibility across eligible compute services than a resource-specific reservation.",
            "A company has steady compute spending but regularly changes VM families, so an hourly savings commitment fits better than one fixed VM reservation.",
          ),
          concept(
            "Spot pricing",
            "Spot Virtual Machines use unused Azure capacity at a lower price, but Azure can reclaim that capacity. Spot is suitable only for interruptible workloads.",
            "A retailer runs restartable overnight image-processing jobs on Spot VMs but keeps its checkout system on stable capacity.",
          ),
        ],
      },
      {
        title: "Cloud benefits",
        concepts: [
          concept(
            "High availability",
            "High availability focuses on keeping services accessible despite disruptions. Azure services provide availability commitments through service-level agreements.",
            "An online payment service uses redundant resources so customers can continue paying when one component fails.",
          ),
          concept(
            "Vertical and horizontal scalability",
            "Vertical scaling changes the CPU or memory of one resource. Horizontal scaling adds or removes resource instances. Scaling up or out adds capacity; scaling down or in removes it.",
            "A store makes one server larger for a short-term need, then later adds several servers behind a load balancer to handle a national sale.",
          ),
          concept(
            "Reliability",
            "Reliability is a system's ability to recover from failures and continue functioning. Azure's distributed regions support resilient designs.",
            "A public-service application keeps a recovery copy in another region so citizens can regain access after a regional disaster.",
          ),
          concept(
            "Performance and cost predictability",
            "Performance predictability estimates the resources needed for a good user experience. Cost predictability uses monitoring, analytics, and estimates to forecast spending.",
            "A ticketing platform uses autoscaling to keep response times steady and the Pricing Calculator plus usage trends to forecast the event-month bill.",
          ),
          concept(
            "Security and governance",
            "Cloud services offer security controls, templates, auditing, policy, and compliance tools. Responsibility still depends on the chosen service model.",
            "A health organization applies approved templates and policies so every new storage account meets its encryption and location rules.",
          ),
          concept(
            "Management of and in the cloud",
            "Management of the cloud includes scaling, deployment templates, health monitoring, and alerts. Management in the cloud means using the portal, command line, APIs, or PowerShell to control resources.",
            "An operations team deploys from a template, watches health in the portal, and uses a CLI script to shut down test resources every evening.",
          ),
          concept(
            "Sustainability",
            "Cloud efficiency improves when teams right-size resources, scale down unused capacity, automate shutdowns, monitor usage, and avoid overprovisioning.",
            "A development environment automatically stops overnight and on weekends, reducing both unnecessary spending and resource consumption.",
          ),
        ],
      },
    ],
    caseStudy: {
      title: "Holiday retail surge without new hardware",
      context:
        "A regional retailer expects five times its normal online traffic during a holiday campaign but does not want to buy servers that will sit idle afterward.",
      steps: [
        "Use horizontal scaling to add application instances during peak demand and scale them in when the sale ends.",
        "Increase selected VM capacity vertically only where one workload needs more CPU or memory.",
        "Run restartable catalog-image processing on Spot VMs, while keeping checkout on stable capacity.",
        "Tag resources with Workload=HolidaySale, Owner=Commerce, and Environment=Prod for cost reporting.",
        "Create a Cost Management budget and alert, then review cost analysis after the campaign.",
      ],
      takeaway:
        "Elastic capacity, the right pricing option, and clear tags let the retailer serve more customers without buying permanent physical infrastructure.",
    },
  },
  {
    id: "azure-architecture",
    number: "02",
    title: "Azure Physical & Management Architecture",
    shortTitle: "Azure architecture",
    description:
      "Learn how Azure is arranged physically around the world and how organizations structure resources, access, policy, and billing.",
    duration: "2 lessons · 11 concepts",
    objectives: [
      "Describe datacenters, regions, region pairs, sovereign regions, and availability zones.",
      "Distinguish zonal, zone-redundant, and non-regional services.",
      "Describe resources, resource groups, subscriptions, and management groups.",
      "Explain billing and access boundaries and the full management hierarchy.",
    ],
    sections: [
      {
        title: "Physical infrastructure",
        concepts: [
          concept(
            "Azure datacenters",
            "Datacenters contain physical servers, power, cooling, and networking. Customers normally choose a region or zone rather than an individual datacenter.",
            "A company chooses an Azure region for its application while Azure manages the individual buildings and hardware inside that region.",
          ),
          concept(
            "Azure regions",
            "A region is a geographic area containing one or more nearby datacenters connected by a low-latency network. Most resources require a deployment region.",
            "A business places an application in a region close to its main customers to reduce delay and meet data-location needs.",
          ),
          concept(
            "Availability zones",
            "Availability zones are physically separate datacenter locations within a region, each with independent power, cooling, and networking. They provide isolation from a single-zone failure.",
            "A hospital runs application instances in two zones so an electrical problem in one location does not stop patient access.",
          ),
          concept(
            "Zonal, zone-redundant, and non-regional services",
            "A zonal resource is pinned to a selected zone. A zone-redundant service replicates across zones automatically. A non-regional service is designed to be resilient beyond an individual region.",
            "A team pins VMs to separate zones, selects zone-redundant storage for automatic copies, and uses Microsoft Entra ID as a global identity service.",
          ),
          concept(
            "Region pairs",
            "Most regions are paired with another region in the same geography for broader resilience, staged updates, and data-residency support. Customers must still configure replication for services that do not fail over automatically.",
            "A disaster-recovery team copies critical data to the paired region and tests its own recovery process instead of assuming every service will move automatically.",
          ),
          concept(
            "Sovereign regions",
            "Sovereign regions are isolated Azure environments used for legal or compliance needs. Examples include US government regions and China regions operated through the 21Vianet partnership.",
            "A government agency selects an isolated US Government region because its workload requires screened operations and specific compliance controls.",
          ),
        ],
      },
      {
        title: "Management infrastructure",
        concepts: [
          concept(
            "Azure resources",
            "A resource is a manageable item created in Azure, such as a virtual machine, virtual network, database, or storage account.",
            "A web solution contains an App Service, database, storage account, and virtual network; each is a separate Azure resource.",
          ),
          concept(
            "Resource groups",
            "Every resource belongs to exactly one resource group. Groups organize related resources and provide a scope for access, policy, and lifecycle actions. Deleting a group deletes its resources.",
            "A temporary training environment keeps its VM, network, and storage in one group so the entire environment can be removed together.",
          ),
          concept(
            "Azure subscriptions",
            "A subscription is a management, billing, and scale boundary. Separate subscriptions can produce separate billing reports and enforce different access rules.",
            "A company uses separate Dev and Production subscriptions so developers have broad sandbox access without gaining the same permissions in production.",
          ),
          concept(
            "Management groups",
            "Management groups sit above subscriptions. Policies and role assignments made at a management group are inherited by subscriptions and resources below it.",
            "A global organization applies an allowed-region policy once at a Europe management group, and every European subscription inherits it.",
          ),
          concept(
            "The Azure hierarchy",
            "The Tenant Root Group is the top level. Management groups can nest up to six levels below it, followed by subscriptions, resource groups, and individual resources. Each management group and subscription has one parent.",
            "A company structures Tenant Root → Continent → Business Unit → Environment management groups, then places Dev, Test, and Prod subscriptions under the right environment.",
          ),
        ],
      },
    ],
    caseStudy: {
      title: "A multinational Dev, Test, and Prod structure",
      context:
        "A company operates in several regions, with separate Finance, Retail, and Research teams that need different access and compliance rules.",
      steps: [
        "Use the Tenant Root Group as the common top-level governance point.",
        "Create regional management groups, then business-unit and environment groups below them.",
        "Place Dev, Test, and Prod subscriptions under their matching environment groups.",
        "Apply broad location and compliance policy at regional groups and stricter access at Prod.",
        "Organize each workload into resource groups so teams can manage lifecycle and access together.",
      ],
      takeaway:
        "The hierarchy separates bills and access while allowing governance to flow consistently from parent management groups to every child resource.",
    },
  },
  {
    id: "azure-services",
    number: "03",
    title: "Azure Compute, Networking & Storage Services",
    shortTitle: "Azure services",
    description:
      "Compare the services used to run applications, connect systems, store data, and move existing workloads into Azure.",
    duration: "6 lessons · 35 concepts",
    objectives: [
      "Compare VMs, containers, Functions, App Service, AI, ML, and IoT services.",
      "Choose VM scale, availability, sizing, disks, operating systems, and networking.",
      "Explain virtual networks, VPN Gateway, ExpressRoute, DNS, and basic access.",
      "Compare storage services, account types, tiers, and redundancy.",
      "Choose AzCopy, Storage Explorer, File Sync, Azure Migrate, or Data Box.",
    ],
    sections: [
      {
        title: "Compute and application hosting",
        concepts: [
          concept(
            "Azure Virtual Machines",
            "Azure VMs provide IaaS servers with control over the operating system, installed software, and configuration. Customers still manage the guest operating system and patches.",
            "A company moves an older payroll application to an Azure VM because it needs the same custom Windows configuration used on-premises.",
          ),
          concept(
            "VM size families and resources",
            "B-series is burstable, D general purpose, E memory optimized, F compute optimized, M large memory, L storage optimized, and N GPU enabled. A VM also needs an OS image, disks, networking, and appropriate CPU and RAM.",
            "A small test server uses B-series, an in-memory database uses E-series, and an AI graphics workload uses an N-series GPU VM.",
          ),
          concept(
            "Virtual Machine Scale Sets",
            "Scale sets create and manage groups of identical, load-balanced VMs and can automatically add or remove instances as demand changes.",
            "A ticketing website automatically adds matching web-server VMs when concert sales open, then removes them after traffic falls.",
          ),
          concept(
            "Availability Sets",
            "Availability Sets spread VMs across fault domains, which separate shared failure points, and update domains, which separate planned maintenance groups.",
            "Two finance VMs are placed in different fault and update domains so one hardware issue or maintenance restart does not stop both.",
          ),
          concept(
            "Azure Container Instances",
            "ACI runs containers quickly without managing virtual machines or a full orchestration platform.",
            "A developer runs a short-lived data conversion container for a few hours, then removes it when the job finishes.",
          ),
          concept(
            "Container Apps and AKS",
            "Azure Container Apps adds managed scaling and load balancing for container applications. Azure Kubernetes Service manages the lifecycle of larger container fleets.",
            "A small API uses Container Apps for simple managed scaling, while a large microservices platform uses AKS to coordinate many services.",
          ),
          concept(
            "Azure Functions",
            "Azure Functions is event-driven serverless compute. Code runs when triggered, scales with demand, and can release resources after execution.",
            "A function creates a thumbnail whenever a new clinic scan is uploaded, with no server kept running while there are no uploads.",
          ),
          concept(
            "Azure App Service",
            "App Service hosts web apps, REST APIs, mobile back ends, and WebJobs without requiring the customer to manage the hosting infrastructure.",
            "A delivery business hosts its customer website, driver API, scheduled cleanup WebJob, and mobile back end in one managed App Service platform.",
          ),
          concept(
            "Choosing a hosting option",
            "Use VMs for maximum operating-system control, containers for portable isolated application components, Functions for event-driven work, and App Service for managed web-oriented applications.",
            "A solution keeps a legacy server on a VM, deploys a portable API in a container, processes messages with Functions, and hosts its website on App Service.",
          ),
        ],
      },
      {
        title: "AI, machine learning, and IoT",
        concepts: [
          concept(
            "Azure AI services and Azure OpenAI",
            "Azure AI services provide prebuilt language, speech, vision, and document capabilities through APIs. Azure OpenAI supports governed generative-AI scenarios such as chat and content generation.",
            "A support application adds speech transcription with a prebuilt API and uses a governed language model to draft replies for human review.",
          ),
          concept(
            "Azure Machine Learning",
            "Azure Machine Learning supports building, training, experimenting with, and managing custom machine-learning models.",
            "An agricultural company trains its own crop-yield model from local weather and soil data rather than using only a prebuilt API.",
          ),
          concept(
            "IoT Hub, IoT Central, and IoT Edge",
            "IoT Hub provides secure two-way device communication. IoT Central is a simplified SaaS IoT platform. IoT Edge runs selected cloud capabilities close to devices.",
            "Farm sensors send readings through IoT Hub, a managed IoT Central dashboard shows device health, and IoT Edge analyzes urgent readings where connectivity is limited.",
          ),
          concept(
            "Agentic AI pattern",
            "Agentic AI is an application pattern, not a separate compute service. It combines an AI model with instructions, context, tools, and application logic to complete multistep goals.",
            "A service agent reads a request, checks an approved knowledge source, calls a ticketing tool, and asks a human before a high-impact action.",
          ),
        ],
      },
      {
        title: "Virtual networking",
        concepts: [
          concept(
            "Virtual networks and subnets",
            "A VNet is a private network space for Azure resources. Subnets divide that address space into smaller segments for organization and control.",
            "A hospital places web servers in one subnet and patient databases in another so it can apply different access rules.",
          ),
          concept(
            "Public and private endpoints",
            "A public endpoint uses a public IP and can be reached from the internet. A private endpoint uses a private address inside a VNet.",
            "A public appointment website has an internet endpoint, while its patient database uses a private endpoint reachable only inside the network.",
          ),
          concept(
            "Network Security Groups",
            "NSGs contain inbound and outbound rules that allow or block traffic based on source, destination, port, and protocol.",
            "An NSG allows HTTPS traffic to a web subnet but blocks direct internet access to the database subnet.",
          ),
          concept(
            "User-defined routes",
            "UDRs customize how traffic moves between subnets, virtual networks, the internet, or network appliances.",
            "A company sends all outbound application traffic through a firewall appliance before it can reach the internet.",
          ),
          concept(
            "VNet peering and basic access",
            "VNet peering connects virtual networks privately over Microsoft's backbone. Basic access combines the correct subnet, endpoint, NSG rules, and routing.",
            "Two application teams peer their VNets so services communicate privately, then allow only the required application port in their NSGs.",
          ),
        ],
      },
      {
        title: "Hybrid connectivity and DNS",
        concepts: [
          concept(
            "VPN Gateway",
            "VPN Gateway creates encrypted tunnels over the public internet for site-to-site, point-to-site, or VNet-to-VNet connectivity.",
            "A branch office uses a site-to-site VPN to reach private Azure systems, while a remote administrator uses a point-to-site VPN.",
          ),
          concept(
            "Policy-based and route-based VPNs",
            "Policy-based VPNs select tunnels using defined IP-address policies. Route-based VPNs use routing tables and virtual interfaces, support more connection patterns, and are generally preferred for changing topologies.",
            "A growing company selects a route-based VPN because it expects new subnets, multiple sites, and future ExpressRoute coexistence.",
          ),
          concept(
            "VPN high availability",
            "Azure VPN gateways normally use active/standby instances. Active/active uses two public IPs and tunnels. Zone-redundant gateways separate instances across availability zones.",
            "A bank configures active/active tunnels and a second on-premises VPN device so one gateway or device failure does not remove connectivity.",
          ),
          concept(
            "Azure ExpressRoute",
            "ExpressRoute provides private connectivity to Microsoft cloud services without sending traffic over the public internet. It is useful for predictable latency, high throughput, and strict connectivity requirements.",
            "A hospital transfers large clinical datasets through a private ExpressRoute circuit rather than a public-internet VPN.",
          ),
          concept(
            "Global Reach and BGP",
            "ExpressRoute Global Reach links on-premises locations through their circuits. Border Gateway Protocol exchanges routes dynamically between local networks and Microsoft.",
            "Offices in two countries use Global Reach to communicate through Microsoft's network while BGP updates routes when networks change.",
          ),
          concept(
            "Azure DNS",
            "Azure DNS hosts public DNS domains on Microsoft's global name-server network and supports RBAC, logs, alias records, and private DNS domains for VNets.",
            "A public website uses global Azure DNS records, while internal application names resolve through a private DNS zone that is visible only inside its VNet.",
          ),
        ],
      },
      {
        title: "Storage services, tiers, and redundancy",
        concepts: [
          concept(
            "Storage accounts and types",
            "A storage account creates a unique Azure namespace. General-purpose v2 supports blobs, files, queues, and tables. Premium account types specialize in block blobs, file shares, or page blobs.",
            "A normal business application uses general-purpose v2, while a high-performance file workload chooses a premium file-share account.",
          ),
          concept(
            "Blob Storage",
            "Blob Storage stores large amounts of unstructured text or binary data such as images, documents, video, logs, backups, and analytics data.",
            "A media company stores millions of photographs and video clips as blobs that applications access through secure URLs.",
          ),
          concept(
            "Azure Files",
            "Azure Files provides managed SMB or NFS file shares that cloud and on-premises systems can mount.",
            "Several branch offices use the same managed file share without maintaining a separate file server in every office.",
          ),
          concept(
            "Queues, Disks, and Tables",
            "Queue Storage holds messages for asynchronous processing. Managed Disks provide block storage for VMs. Table Storage is a NoSQL store for structured, non-relational data.",
            "An order enters a queue for background processing, the worker VM uses a managed disk, and simple device records are stored in a table.",
          ),
          concept(
            "Hot, Cool, Cold, and Archive tiers",
            "Hot is for frequent access, Cool for infrequent access stored at least 30 days, Cold for at least 90 days, and Archive for rarely accessed data stored at least 180 days with slower rehydration.",
            "Current customer documents stay Hot, completed-year records move to Cool or Cold, and seven-year compliance backups move to Archive.",
          ),
          concept(
            "LRS and ZRS",
            "LRS keeps three copies in one datacenter and is the lowest-cost primary-region option. ZRS copies data synchronously across three availability zones for stronger in-region resilience.",
            "A replaceable test dataset uses LRS, while an important booking system uses ZRS to remain available after one zone fails.",
          ),
          concept(
            "GRS, GZRS, RA-GRS, and RA-GZRS",
            "GRS copies LRS data to a secondary region. GZRS combines primary-region zone replication with secondary-region replication. RA options allow reads from the secondary region before failover.",
            "A critical archive uses GZRS for zone and regional protection, then enables read access when reporting must continue from the secondary copy.",
          ),
        ],
      },
      {
        title: "File movement and migration",
        concepts: [
          concept(
            "AzCopy",
            "AzCopy is a command-line tool for uploading, downloading, copying, and one-way synchronizing blobs or files.",
            "An administrator scripts a nightly one-way upload of generated reports from a local server to Blob Storage.",
          ),
          concept(
            "Azure Storage Explorer",
            "Storage Explorer is a graphical desktop application for managing Azure files and blobs and uses AzCopy for transfer operations.",
            "A support worker who prefers a visual tool drags a folder of approved documents into the correct storage account.",
          ),
          concept(
            "Azure File Sync",
            "File Sync centralizes shares in Azure Files while keeping synchronized caches on Windows Servers. Frequently used files can stay local while older files remain in the cloud.",
            "A company keeps fast local access at each branch while Azure Files holds the central copy and cloud tiering saves local disk space.",
          ),
          concept(
            "Azure Migrate",
            "Azure Migrate is a hub for discovering, assessing, and migrating on-premises servers, databases, and applications to Azure.",
            "Before moving a datacenter, a team inventories servers, checks readiness and sizing, and tracks each migration from one portal.",
          ),
          concept(
            "Azure Data Box",
            "Data Box is a secure physical device for transferring very large datasets when network transfer would be too slow or expensive.",
            "A hospital copies tens of terabytes of historical scans to a Data Box and ships it securely for upload into Azure.",
          ),
        ],
      },
    ],
    caseStudy: {
      title: "Healthcare records migration and long-term retention",
      context:
        "A healthcare provider must move decades of medical scans from legacy storage while keeping recent records fast and older records for compliance.",
      steps: [
        "Use Azure Migrate to assess the existing application and connected server workloads.",
        "Transfer the large historical dataset with Azure Data Box because the available network link is too slow.",
        "Import the files into Blob Storage and use a suitable redundancy option for the required resilience.",
        "Keep recently accessed records in Hot, move older records to Cold, and place long-term compliance records in Archive.",
        "Expose the storage through private network access and permit only required traffic with an NSG.",
      ],
      takeaway:
        "Azure migration, network, storage, tiering, and redundancy services work together to move the records securely and control long-term cost.",
    },
  },
  {
    id: "governance-security",
    number: "04",
    title: "Management, Governance, Security & Identity",
    shortTitle: "Governance & security",
    description:
      "Operate, govern, monitor, and protect Azure environments with consistent tools, identity controls, and layered security.",
    duration: "7 lessons · 35 concepts",
    objectives: [
      "Use the portal, Cloud Shell, CLI, PowerShell, Arc, ARM, templates, and Bicep.",
      "Explain Advisor, Service Health, Monitor, Log Analytics, Alerts, and Application Insights.",
      "Use Purview, Policy, initiatives, resource locks, and the Service Trust Portal.",
      "Explain Entra services, authentication, external identities, Conditional Access, and RBAC.",
      "Apply Zero Trust, defense-in-depth, encryption, Key Vault, and Defender for Cloud.",
    ],
    sections: [
      {
        title: "Management and deployment",
        concepts: [
          concept(
            "Azure portal",
            "The Azure portal is a web-based graphical console for building, managing, and monitoring Azure resources and dashboards.",
            "A new administrator creates a resource group visually, checks its activity log, and pins its most important metrics to a dashboard.",
          ),
          concept(
            "Azure Cloud Shell",
            "Cloud Shell is an authenticated browser-based shell with Azure CLI and Azure PowerShell available without a local installation.",
            "An administrator opens Cloud Shell from a borrowed computer and safely runs an authenticated command without installing tools.",
          ),
          concept(
            "Azure CLI and Azure PowerShell",
            "Azure CLI uses Bash-style commands, while Azure PowerShell uses cmdlets. Both call Azure APIs and can automate repeatable management work.",
            "A Linux-focused team uses CLI scripts, while a Windows operations team uses PowerShell cmdlets to create the same standardized resources.",
          ),
          concept(
            "Azure Arc",
            "Azure Arc projects non-Azure servers, Kubernetes clusters, and supported data services into Azure Resource Manager for consistent hybrid and multicloud governance.",
            "A company views Azure VMs, on-premises servers, and another cloud's servers in one inventory and applies common policy.",
          ),
          concept(
            "Azure Resource Manager",
            "ARM is Azure's deployment and management layer. It authenticates and authorizes requests, then sends them to the correct Azure service.",
            "Whether a resource is created from the portal, CLI, PowerShell, or an SDK, ARM processes the request through the same management layer.",
          ),
          concept(
            "ARM templates and Bicep",
            "ARM templates use declarative JSON to define a desired deployment. Bicep provides a simpler declarative syntax that deploys through ARM. Both support repeatable, dependency-aware infrastructure as code.",
            "A team defines one network and application environment in Bicep, then deploys matching Dev, Test, and Prod environments consistently.",
          ),
        ],
      },
      {
        title: "Monitoring and health",
        concepts: [
          concept(
            "Azure Advisor",
            "Advisor reviews resources and recommends improvements in reliability, security, performance, operational excellence, and cost.",
            "Advisor finds an underused VM for cost savings and a configuration risk that could reduce application reliability.",
          ),
          concept(
            "Azure Status, Service Health, and Resource Health",
            "Azure Status shows global service conditions. Service Health shows events affecting the services and regions you use. Resource Health explains the condition of an individual resource.",
            "During an outage, an operator checks global Status, sees a relevant Service Health advisory, then confirms whether one production VM is affected in Resource Health.",
          ),
          concept(
            "Azure Monitor",
            "Azure Monitor collects, analyzes, and acts on logs and metrics from Azure, applications, operating systems, on-premises resources, and other clouds.",
            "An operations dashboard combines VM CPU, application errors, and network data so the team can see one service problem end to end.",
          ),
          concept(
            "Log Analytics and Alerts",
            "Log Analytics runs queries against collected monitoring data. Alert rules watch metrics or logs, and action groups decide who or what is notified.",
            "A query finds repeated sign-in errors, while an alert sends email and triggers automation when failures exceed a threshold.",
          ),
          concept(
            "Application Insights",
            "Application Insights monitors web application requests, response times, failures, dependencies, page loads, users, sessions, and availability.",
            "A mobile-money web team traces slow payment requests to one external dependency and creates an availability test for the checkout endpoint.",
          ),
        ],
      },
      {
        title: "Governance and compliance",
        concepts: [
          concept(
            "Microsoft Purview",
            "Purview combines risk and compliance capabilities with unified data governance, including discovery, classification, lineage, and insight across on-premises, cloud, and SaaS data.",
            "A healthcare organization discovers where patient data is stored, marks sensitive fields, and traces how that data moves between systems.",
          ),
          concept(
            "Azure Policy",
            "Azure Policy creates, assigns, and manages rules that audit, deny, or remediate resource configurations. Assignments can inherit from management groups, subscriptions, and resource groups.",
            "A policy blocks storage accounts outside approved regions and automatically adds a required Owner tag when it is missing.",
          ),
          concept(
            "Policy initiatives and guardrails",
            "An initiative groups related policy definitions for one wider goal, such as monitoring or a security baseline. Policy continues to enforce standards whether a change comes from a human, pipeline, Copilot, or automation.",
            "A monitoring initiative checks encryption, endpoint protection, and vulnerabilities, while an AI-generated deployment is still blocked if it chooses an unapproved SKU.",
          ),
          concept(
            "Resource locks",
            "A Delete lock blocks deletion but allows authorized changes. ReadOnly blocks updates and deletion. Locks apply regardless of RBAC; they must be removed before a blocked change can occur.",
            "A production database receives a Delete lock. Even its owner must deliberately remove the lock before deleting it, reducing accidental loss.",
          ),
          concept(
            "Service Trust Portal",
            "The Service Trust Portal provides documents and resources about Microsoft security, privacy, compliance controls, and audit practices. Some protected documents require sign-in and an agreement.",
            "A compliance officer uses the portal to gather Microsoft control documentation for an external audit.",
          ),
        ],
      },
      {
        title: "Directory and authentication",
        concepts: [
          concept(
            "Microsoft Entra ID",
            "Microsoft Entra ID is Microsoft's cloud identity and access management service. It provides authentication, SSO, application management, and device-related access controls.",
            "Employees use one managed identity to access approved Microsoft and custom cloud applications.",
          ),
          concept(
            "Microsoft Entra Domain Services",
            "Domain Services provides managed domain join, group policy, LDAP, and Kerberos/NTLM without customer-managed domain controllers. Identity data synchronizes one way from Entra ID to the managed domain.",
            "A legacy application moves to Azure and keeps its domain-join and LDAP requirements without the team patching domain controllers.",
          ),
          concept(
            "Single Sign-On",
            "SSO lets one authenticated identity access multiple trusted applications, reducing password sprawl. Its security depends on the strength of the initial authentication.",
            "An employee signs in once at the start of a shift and opens payroll, email, and the service desk without three separate passwords.",
          ),
          concept(
            "Multifactor Authentication",
            "MFA requires more than one factor: something known, something possessed, or something inherent to the user.",
            "A finance manager enters a password and then confirms a number in the Authenticator app before opening a sensitive report.",
          ),
          concept(
            "Passwordless authentication",
            "Passwordless options replace passwords with a trusted device plus a PIN or biometric. Entra ID supports Windows Hello for Business, Microsoft Authenticator, and FIDO2 security keys.",
            "A field worker signs in with a FIDO2 hardware key, while an office employee uses Windows Hello fingerprint recognition.",
          ),
        ],
      },
      {
        title: "External access and authorization",
        concepts: [
          concept(
            "External identities",
            "B2B collaboration represents invited partners as guests. B2B direct connect creates mutual trust for supported cross-tenant collaboration. Entra External ID for customers manages identities for customer-facing applications.",
            "A supplier joins a project as a guest, two companies share a Teams channel through direct connect, and retail customers sign in to a shopping application through External ID.",
          ),
          concept(
            "Conditional Access",
            "Conditional Access collects signals such as identity, location, device, and application, makes an access decision, then enforces allow, block, or an additional requirement such as MFA.",
            "A normal office sign-in is allowed, but an administrator on an unmanaged device in an unexpected location must use MFA or is blocked.",
          ),
          concept(
            "Azure RBAC",
            "RBAC assigns roles with allowed actions at a scope: management group, subscription, resource group, or resource. Parent-scope permissions are inherited by children, and multiple allowed roles combine.",
            "Auditors receive Reader at the subscription scope, while one database team receives a narrower management role only on its resource group.",
          ),
        ],
      },
      {
        title: "Security models and data protection",
        concepts: [
          concept(
            "Zero Trust",
            "Zero Trust follows three principles: verify explicitly using available signals, use least-privilege access, and assume breach so impact is contained.",
            "A request from inside the office is not trusted automatically; the system still checks identity, device state, risk, and minimum required access.",
          ),
          concept(
            "Defense in depth",
            "Defense in depth protects data through physical, identity and access, perimeter, network, compute, application, and data layers so one failed control does not expose everything.",
            "A financial app combines datacenter controls, MFA, DDoS protection, network segmentation, patched VMs, secure code, and encrypted databases.",
          ),
          concept(
            "Encryption at rest and in transit",
            "Encryption at rest protects stored databases, disks, and storage. Encryption in transit protects data moving between services, applications, and users.",
            "Patient records are encrypted in Azure Storage and also protected while moving from a clinic device to the application API.",
          ),
          concept(
            "Azure Key Vault",
            "Key Vault securely stores secrets, encryption keys, and certificates. It supports access control, rotation, auditing, and retrieval through managed identities instead of hard-coded credentials.",
            "An application retrieves its database secret from Key Vault at runtime, while an alert warns the team before its certificate expires.",
          ),
        ],
      },
      {
        title: "Cloud security posture",
        concepts: [
          concept(
            "Microsoft Defender for Cloud",
            "Defender for Cloud monitors Azure, hybrid, and multicloud resources for security posture and threats. It can extend to non-Azure machines through Azure Arc.",
            "A security team reviews Azure, on-premises, AWS, and GCP recommendations from one control plane.",
          ),
          concept(
            "Assess, Secure, and Defend",
            "Defender for Cloud continuously assesses vulnerabilities, secures workloads with prioritized recommendations and policy, and defends resources with alerts and threat protection.",
            "A vulnerable VM lowers the secure score, generates a recommendation to patch, and later raises an alert when suspicious access is detected.",
          ),
          concept(
            "Secure Score and security alerts",
            "Secure Score summarizes posture and helps prioritize improvements. Security alerts identify affected resources, explain threats, suggest remediation, and can trigger automated responses.",
            "A team first fixes high-impact recommendations that improve Secure Score, then sends critical alerts to a response workflow for immediate investigation.",
          ),
        ],
      },
    ],
    caseStudy: {
      title: "Layered protection for a financial institution",
      context:
        "A financial institution must protect customer data from stolen credentials, excessive permissions, noncompliant deployments, and accidental deletion.",
      steps: [
        "Use Conditional Access to evaluate identity, device, location, and risk before each sensitive sign-in.",
        "Require MFA for administrators and high-risk requests.",
        "Assign RBAC roles at the narrowest useful scope so staff receive only the access needed for their work.",
        "Apply Azure Policy to require approved regions, encryption, tags, and security settings.",
        "Place Delete locks on critical databases so a permitted user cannot remove them accidentally without a deliberate unlock step.",
      ],
      takeaway:
        "Identity checks, strong authentication, least-privilege authorization, policy guardrails, and locks protect against different risks and reinforce one another.",
    },
  },
]
