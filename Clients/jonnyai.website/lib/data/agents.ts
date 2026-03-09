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
  tier: string;
  philosophy?: string;
}

export const agents: Agent[] = [
  { handle: "@marcus", name: "Marcus Cole", nickname: ""The Maestro"", role: ""The Maestro" — Command", tier: "Command" },
  { handle: "@jasper", name: "Jasper Cole", nickname: ""The Closer"", role: ""The Closer" — Additional Specialists", tier: "Additional Specialists" },
  { handle: "@felix", name: "Felix Morgan", nickname: ""The Alchemist"", role: ""The Alchemist" — Growth & Marketing", tier: "Growth" },
  { handle: "@julian", name: "Julian West", nickname: ""The Conductor"", role: ""The Conductor" — Operations & Support", tier: "Operations" },
  { handle: "@hannah", name: "Hannah Park", nickname: ""The Fixer"", role: ""The Fixer" — Operations & Support", tier: "Operations" },
  { handle: "@vigil", name: "Vigil Chen", nickname: ""The Eye"", role: ""The Eye" — Quality & Verification", tier: "Quality" },
  { handle: "@rowan", name: "Rowan", nickname: ""The Beast"", role: ""The Beast" — Quality & Verification", tier: "Quality" },
  { handle: "@scholar", name: "Dr. Elias Thorne", nickname: ""The Professor"", role: ""The Professor" — Intelligence & Research", tier: "Intelligence" },
  { handle: "@intelhub", name: "—", nickname: "—", role: "— — Intelligence & Research", tier: "Intelligence" },
  { handle: "@sebastian", name: "Sebastian Cross", nickname: ""The Architect"", role: ""The Architect" — Development", tier: "Development" },
  { handle: "@diana", name: "Diana Chen", nickname: ""The Vault"", role: ""The Vault" — Database Architect", tier: "Database Architect" },
  { handle: "@syncmaster", name: "Silas Vane", nickname: ""The Pulse"", role: ""The Pulse" — Memory Propagation", tier: "Memory Propagation" },
  { handle: "@sam", name: "Sam Blackwood", nickname: ""The Gatekeeper"", role: ""The Gatekeeper" — Development", tier: "Development" },
  { handle: "@milo", name: "Milo Chen", nickname: ""The Optimizer"", role: ""The Optimizer" — Development", tier: "Development" },
  { handle: "@owen", name: "Owen Stinger", nickname: ""The Hornet"", role: ""The Hornet" — Development", tier: "Development" },
  { handle: "@parser", name: "Kieran Vale", nickname: ""The Decoder"", role: ""The Decoder" — Intelligence & Research", tier: "Intelligence" },
  { handle: "@gareth", name: "Gareth Williams", nickname: ""The Tactician"", role: ""The Tactician" — Betting Ecosystem", tier: "Betting Ecosystem" },
  { handle: "@sterling", name: "Sterling Brooks", nickname: ""The Bookie"", role: ""The Bookie" — Betting Ecosystem", tier: "Betting Ecosystem" },
  { handle: "@daniel", name: "Dr. Daniel Rossi", nickname: ""The Doctor"", role: ""The Doctor" — Betting Ecosystem", tier: "Betting Ecosystem" },
  { handle: "@terry", name: "Terry Taylor", nickname: ""The 180 King"", role: ""The 180 King" — Betting Ecosystem", tier: "Betting Ecosystem" },
  { handle: "@harry", name: "Harry Holt", nickname: ""The Form Master"", role: ""The Form Master" — Betting Ecosystem", tier: "Betting Ecosystem" },
  { handle: "@genesis", name: "Genesis Nova", nickname: ""The Cloner"", role: ""The Cloner" — Specialized Ecosystems", tier: "Specialized Ecosystems" },
  { handle: "@dreamer", name: "Davey Butcha", nickname: ""The Gravy"", role: ""The Gravy" — Specialized Ecosystems", tier: "Specialized Ecosystems" },
  { handle: "@derek", name: "Derek O'Brien", nickname: ""The Engine"", role: ""The Engine" — Development", tier: "Development" },
  { handle: "@blaise", name: "Blaise Moreau", nickname: ""The Artisan"", role: ""The Artisan" — Design & Creative", tier: "Design" },
  { handle: "@victor", name: "Victor Reyes", nickname: ""The Locksmith"", role: ""The Locksmith" — Legal & Safety", tier: "Legal" },
  { handle: "@design-manager", name: "[Automated Logic]", nickname: ""The Overseer"", role: ""The Overseer" — Command", tier: "Command" },
  { handle: "@executor", name: "Rex Carver", nickname: ""The Closer"", role: ""The Closer" — Management & Automation", tier: "Management" },
  { handle: "@finops", name: "[Automated Ledger]", nickname: ""The Treasurer"", role: ""The Treasurer" — Operations & Support", tier: "Operations" },
  { handle: "@qualityguard", name: "Quinn Reyes", nickname: ""The Validator"", role: ""The Validator" — Quality & Verification", tier: "Quality" },
  { handle: "@watcher", name: "Vigil Chen", nickname: ""The Eye"", role: ""The Eye" — Quality & Verification", tier: "Quality" },
  { handle: "@riskguard", name: "Lena Voss", nickname: ""The Sentinel"", role: ""The Sentinel" — Legal & Safety", tier: "Legal" },
  { handle: "@contentforge", name: "Aria Voss", nickname: ""The Story Engine"", role: ""The Story Engine" — Growth & Marketing", tier: "Growth" },
  { handle: "@adrian", name: "Adrian Cross", nickname: ""The Welder"", role: ""The Welder" — Development", tier: "Development" },
  { handle: "@steve", name: "Steve Harrison", nickname: ""The Schema Whisperer"", role: ""The Schema Whisperer" — Development", tier: "Development" },
  { handle: "@chronos", name: "Theo Kronos", nickname: ""The Timekeeper"", role: ""The Timekeeper" — Operations & Support", tier: "Operations" },
  { handle: "@priya", name: "Priya Sharma", nickname: ""The Perfectionist"", role: ""The Perfectionist" — Design & Creative", tier: "Design" },
  { handle: "@vivienne", name: "Vivienne Frost", nickname: ""The Visionary"", role: ""The Visionary" — Design & Creative", tier: "Design" },
  { handle: "@elena", name: "Elena Vasquez", nickname: ""The Voice"", role: ""The Voice" — Design & Creative", tier: "Design" },
  { handle: "@alex", name: "Alex Torres", nickname: ""The Machine"", role: ""The Machine" — Operations & Support", tier: "Operations" },
  { handle: "@arthur", name: "Arthur Webb", nickname: ""The Librarian"", role: ""The Librarian" — Operations & Support", tier: "Operations" },
  { handle: "@carlos", name: "Carlos Mendez", nickname: ""The Hook"", role: ""The Hook" — Growth & Marketing", tier: "Growth" },
  { handle: "@boyce", name: "Boyce Jones", nickname: ""Gold Rush"", role: ""Gold Rush" — Growth & Marketing", tier: "Growth" },
  { handle: "@rocket", name: "Ricky Hazbin", nickname: ""Launchpad"", role: ""Launchpad" — Growth & Marketing", tier: "Growth" },
  { handle: "@luna", name: "Luna Sterling", nickname: ""The Shield"", role: ""The Shield" — Legal & Safety", tier: "Legal" },
  { handle: "@grace", name: "Grace Liu", nickname: ""The Ranker"", role: ""The Ranker" — Growth & Marketing", tier: "Growth" },
  { handle: "@mason", name: "Mason Drake", nickname: ""The Bridgemaster"", role: ""The Bridgemaster" — Operations & Support", tier: "Operations" },
  { handle: "@maya", name: "Maya Singh", nickname: ""The Oracle"", role: ""The Oracle" — Growth & Marketing", tier: "Growth" },
  { handle: "@monty", name: "Monty Carlo", nickname: ""The Mathematician"", role: ""The Mathematician" — Betting Ecosystem", tier: "Betting Ecosystem" },
  { handle: "@nina", name: "Nina Patel", nickname: ""The Analyst"", role: ""The Analyst" — Management & Automation", tier: "Management" },
  { handle: "@hugo", name: "Hugo Reeves", nickname: ""The Crawler"", role: ""The Crawler" — Intelligence & Research", tier: "Intelligence" },
  { handle: "@patrick", name: "Patrick Nguyen", nickname: ""The Surgeon"", role: ""The Surgeon" — Intelligence & Research", tier: "Intelligence" },
  { handle: "@sophie", name: "Sophie Reid", nickname: ""The Hawk"", role: ""The Hawk" — Intelligence & Research", tier: "Intelligence" },
  { handle: "@pietro", name: "Pietro Rossi", nickname: ""The Strategist"", role: ""The Strategist" — Betting Ecosystem", tier: "Betting Ecosystem" },
  { handle: "@quinn", name: "Quinn Harper", nickname: ""The Catalyst"", role: ""The Catalyst" — Management & Automation", tier: "Management" },
  { handle: "@theo", name: "Theo Martinez", nickname: ""The Architect"", role: ""The Architect" — Management & Automation", tier: "Management" },
  { handle: "@trotter", name: "Derek Trotter", nickname: ""The Trader"", role: ""The Trader" — Specialized Ecosystems", tier: "Specialized Ecosystems" },
  { handle: "@winston", name: "Winston Hayes", nickname: ""Whiz"", role: ""Whiz" — Specialized Ecosystems", tier: "Specialized Ecosystems" },
  { handle: "@redeye", name: "Redeye", nickname: ""The Night Owl"", role: ""The Night Owl" — Betting Ecosystem", tier: "Betting Ecosystem" },
  { handle: "@quartermaster", name: "Quinn Masters", nickname: ""The Allocator"", role: ""The Allocator" — Operations & Support", tier: "Operations" },
  { handle: "@successbot", name: "Aria Solace", nickname: ""The Ambassador"", role: ""The Ambassador" — Operations & Support", tier: "Operations" },
  { handle: "@coursewright", name: "Nia Sterling", nickname: ""The Curriculum Architect"", role: ""The Curriculum Architect" — Education & Course Design", tier: "Education" },
  { handle: "@dashboard", name: "Mila-Honey", nickname: ""The Dashboard Architect"", role: ""The Dashboard Architect" — Management & Automation", tier: "Management" },
  { handle: "@delegator", name: "Cassian Hart", nickname: ""Control Room"", role: ""Control Room" — Command", tier: "Command" },
  { handle: "@eleven", name: "Sienna "L" Leclerc", nickname: ""The Voice Architect"", role: ""The Voice Architect" — Specialized Ecosystems", tier: "Specialized Ecosystems" },
  { handle: "@nathan", name: "Nathan Robinson", nickname: ""The Automation"", role: ""The Automation" — Operations & Support", tier: "Operations" },
  { handle: "@neo", name: "Morpheus Anderson", nickname: ""The Architect of Minds"", role: ""The Architect of Minds" — Specialized Ecosystems", tier: "Specialized Ecosystems" },
  { handle: "@pipeline-guardian", name: "Sienna Cross", nickname: ""The Guardian"", role: ""The Guardian" — Operations & Support", tier: "Operations" },
  { handle: "@validator", name: "Naomi Kline", nickname: ""Checksum"", role: ""Checksum" — Quality & Verification", tier: "Quality" },
];
