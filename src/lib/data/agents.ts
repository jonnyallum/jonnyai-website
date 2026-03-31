export type AgentTier =
    | "Command"
    | "Development"
    | "Design"
    | "Growth"
    | "Intelligence"
    | "Operations"
    | "Legal"
    | "Specialized"
    | "Quality"
    | "Betting"
    | "Strategy"
    | "Education"
    | "Management"
    | "Additional";

export interface Agent {
    handle: string;
    name: string;
    nickname: string;
    role: string;
    tier: AgentTier;
    philosophy?: string;
}

export const agents: Agent[] = [
    { handle: "@marcus", name: "Marcus Cole", nickname: "The Maestro", role: "Orchestrator & command lead", tier: "Command" },
    { handle: "@design-manager", name: "Design Manager", nickname: "The Overseer", role: "Design systems and QA direction", tier: "Command" },
    { handle: "@delegator", name: "Cassian Hart", nickname: "Control Room", role: "Mission decomposition and routing", tier: "Command" },

    { handle: "@sebastian", name: "Sebastian Cross", nickname: "The Architect", role: "Full-stack architecture and implementation", tier: "Development" },
    { handle: "@diana", name: "Diana Chen", nickname: "The Vault", role: "Database architecture and RLS", tier: "Development" },
    { handle: "@steve", name: "Steve Rivers", nickname: "The Schema Whisperer", role: "Supabase specialist and migrations", tier: "Development" },
    { handle: "@sam", name: "Sam Blackwood", nickname: "The Gatekeeper", role: "Security and release quality", tier: "Development" },
    { handle: "@derek", name: "Derek O'Brien", nickname: "The Engine", role: "Infrastructure and DevOps", tier: "Development" },
    { handle: "@owen", name: "Owen Stinger", nickname: "The Hornet", role: "Deployments and CI/CD", tier: "Development" },
    { handle: "@milo", name: "Milo Chen", nickname: "The Optimizer", role: "Performance and mobile QA", tier: "Development" },
    { handle: "@adrian", name: "Adrian Cross", nickname: "The Welder", role: "MCP server development", tier: "Development" },

    { handle: "@priya", name: "Priya Sharma", nickname: "The Perfectionist", role: "UI and visual design", tier: "Design" },
    { handle: "@vivienne", name: "Vivienne Frost", nickname: "The Visionary", role: "Brand identity and positioning", tier: "Design" },
    { handle: "@blaise", name: "Blaise Moreau", nickname: "The Artisan", role: "Creative direction", tier: "Design" },
    { handle: "@elena", name: "Elena Vasquez", nickname: "The Voice", role: "Copy and brand tone", tier: "Design" },

    { handle: "@felix", name: "Felix Morgan", nickname: "The Alchemist", role: "Monetization and funnel design", tier: "Growth" },
    { handle: "@grace", name: "Grace Liu", nickname: "The Ranker", role: "SEO and schema strategy", tier: "Growth" },
    { handle: "@carlos", name: "Carlos Mendez", nickname: "The Hook", role: "Video editing and retention", tier: "Growth" },
    { handle: "@maya", name: "Maya Singh", nickname: "The Oracle", role: "Analytics and conversion tracking", tier: "Growth" },
    { handle: "@contentforge", name: "Aria Voss", nickname: "The Story Engine", role: "Content scaling and variant generation", tier: "Growth" },
    { handle: "@boyce", name: "Boyce Jones", nickname: "Gold Rush", role: "Sales conversion specialist", tier: "Growth" },
    { handle: "@rocket", name: "Ricky Hazbin", nickname: "Launchpad", role: "Go-to-market orchestration", tier: "Growth" },

    { handle: "@scholar", name: "Dr. Elias Thorne", nickname: "The Professor", role: "Deep research and synthesis", tier: "Intelligence" },
    { handle: "@sophie", name: "Sophie Reid", nickname: "The Hawk", role: "Web intelligence and scraping", tier: "Intelligence" },
    { handle: "@hugo", name: "Hugo Reeves", nickname: "The Crawler", role: "GitHub intelligence and audit", tier: "Intelligence" },
    { handle: "@patrick", name: "Patrick Nguyen", nickname: "The Surgeon", role: "Data extraction and validation", tier: "Intelligence" },
    { handle: "@parser", name: "Kieran Vale", nickname: "The Decoder", role: "Canonical parsing and contracts", tier: "Intelligence" },
    { handle: "@intelhub", name: "Intelhub", nickname: "The Beacon", role: "Continuous trend monitoring", tier: "Intelligence" },

    { handle: "@hannah", name: "Hannah Park", nickname: "The Fixer", role: "Customer success and support", tier: "Operations" },
    { handle: "@arthur", name: "Arthur Webb", nickname: "The Librarian", role: "Knowledge base and runbooks", tier: "Operations" },
    { handle: "@alex", name: "Alex Torres", nickname: "The Machine", role: "Workflow automation", tier: "Operations" },
    { handle: "@mason", name: "Mason Drake", nickname: "The Bridgemaster", role: "MCP integration and config", tier: "Operations" },
    { handle: "@nathan", name: "Nathan Robinson", nickname: "The Automation", role: "Email and n8n automation", tier: "Operations" },
    { handle: "@syncmaster", name: "Silas Vane", nickname: "The Pulse", role: "Memory propagation and sync", tier: "Operations" },
    { handle: "@julian", name: "Julian West", nickname: "The Conductor", role: "Project coordination", tier: "Operations" },
    { handle: "@chronos", name: "Chronos", nickname: "The Watchmaker", role: "Timeline and deadline control", tier: "Operations" },
    { handle: "@quartermaster", name: "Quartermaster", nickname: "The Logistics Officer", role: "Resource forecasting", tier: "Operations" },
    { handle: "@successbot", name: "Successbot", nickname: "The Ambassador", role: "Onboarding and feedback loops", tier: "Operations" },
    { handle: "@finops", name: "Finops", nickname: "The Treasurer", role: "Cashflow and expense monitoring", tier: "Operations" },

    { handle: "@luna", name: "Luna Sterling", nickname: "The Shield", role: "Legal and compliance", tier: "Legal" },
    { handle: "@victor", name: "Victor Reyes", nickname: "The Locksmith", role: "Security and encryption", tier: "Legal" },
    { handle: "@riskguard", name: "Riskguard", nickname: "The Sentinel", role: "Automated risk scoring", tier: "Legal" },

    { handle: "@vigil", name: "Vigil Chen", nickname: "The Eye", role: "Truth verification and audits", tier: "Quality" },
    { handle: "@rowan", name: "Rowan", nickname: "The Beast", role: "Depth and narrative quality", tier: "Quality" },
    { handle: "@watcher", name: "Watcher", nickname: "The Auditor", role: "Continuous improvement scanning", tier: "Quality" },
    { handle: "@qualityguard", name: "Quinn Reyes", nickname: "The Validator", role: "Test orchestration and visual QA", tier: "Quality" },
    { handle: "@validator", name: "Naomi Kline", nickname: "Checksum", role: "Artifact verification", tier: "Quality" },

    { handle: "@gareth", name: "Gareth Williams", nickname: "The Tactician", role: "Football intelligence", tier: "Betting" },
    { handle: "@monty", name: "Monty Carlo", nickname: "The Mathematician", role: "Probability and edge analysis", tier: "Betting" },
    { handle: "@redeye", name: "Redeye", nickname: "The Night Owl", role: "Multi-market betting coordination", tier: "Betting" },
    { handle: "@pietro", name: "Pietro Rossi", nickname: "The Strategist", role: "F1 strategy analysis", tier: "Betting" },
    { handle: "@terry", name: "Terry Taylor", nickname: "The 180 King", role: "Darts analysis", tier: "Betting" },
    { handle: "@harry", name: "Harry Holt", nickname: "The Form Master", role: "Horse racing form analysis", tier: "Betting" },
    { handle: "@daniel", name: "Dr. Daniel Rossi", nickname: "The Doctor", role: "MotoGP analysis", tier: "Betting" },
    { handle: "@sterling", name: "Sterling Brooks", nickname: "The Bookie", role: "Line monitoring systems", tier: "Betting" },

    { handle: "@quinn", name: "Quinn Harper", nickname: "The Catalyst", role: "Product strategy", tier: "Strategy" },
    { handle: "@jasper", name: "Jasper Cole", nickname: "The Closer", role: "Business development", tier: "Strategy" },
    { handle: "@nina", name: "Nina Patel", nickname: "The Analyst", role: "Business intelligence and KPI reporting", tier: "Strategy" },
    { handle: "@theo", name: "Theo Martinez", nickname: "The Architect", role: "System architecture", tier: "Strategy" },
    { handle: "@executor", name: "Rex Carver", nickname: "The Closer", role: "End-to-end autonomous execution", tier: "Strategy" },
    { handle: "@dashboard", name: "Mila-Honey", nickname: "The Dashboard Architect", role: "Dashboard architecture", tier: "Strategy" },
    { handle: "@improver", name: "Mike Litswet", nickname: "The Auditor", role: "Continuous improvement", tier: "Strategy" },
];
