import type { Mode } from '@/context/ModeContext';

export interface PageCopy {
  // Hero
  heroBadge: string;
  heroLine1: string;
  heroLine2: string;
  heroSub: string;
  heroCta1: string;
  heroCta2: string;
  // Problem
  problemLabel: string;
  problemHeading: string;
  problemOldTitle: string;
  problemOld: string[];
  problemNewTitle: string;
  problemNew: string[];
  // Agents
  agentsLabel: string;
  agentsHeading: string;
  agentsSub: string;
  // How it works
  howLabel: string;
  howHeading: string;
  howSteps: { num: string; icon: string; title: string; desc: string }[];
  // Final CTA
  ctaLabel: string;
  ctaLine1: string;
  ctaLine2: string;
  ctaSub: string;
  ctaButton: string;
}

const copy: Record<Mode, PageCopy> = {
  nerds: {
    heroBadge: 'AI Product Engine — Now Live',
    heroLine1: 'Stop Waiting Months',
    heroLine2: 'for Software.',
    heroSub: 'Build at the Speed of Thought.',
    heroCta1: 'Brief The Conductor',
    heroCta2: 'View 50% Off Menu ↓',
    problemLabel: 'The Problem',
    problemHeading: 'Traditional Dev\nis Broken.',
    problemOldTitle: '✕  The Old Way',
    problemOld: [
      '3–6 months to launch anything',
      '£50,000+ for a basic MVP',
      'Endless scope creep and change requests',
      'Agencies that ghost after the deposit',
      'Zero visibility into what\'s being built',
      'Broken promises and missed deadlines',
    ],
    problemNewTitle: '✓  The AI Product Engine',
    problemNew: [
      '48-hour delivery on your first milestone',
      'Crystal clear pricing — zero surprises',
      'Real-time Glass Box dashboard — watch it live',
      '68+ specialist agents on your project now',
      'Every commit, every decision — fully visible',
      'Pay per milestone. Cancel if we miss.',
    ],
    agentsLabel: 'The Workforce',
    agentsHeading: 'Not a Wrapper.\nAn Orchestra.',
    agentsSub: '68+ specialist agents. Hired, trained, and deployed by Jonny. On your project in 48 hours.',
    howLabel: 'How It Works',
    howHeading: 'From Idea to Live\nin 3 Steps.',
    howSteps: [
      { num: '01', icon: '💬', title: 'Chat with Marcus', desc: 'Free 15-minute scope session. Marcus maps your idea into a 3-phase technical roadmap — fixed price, no fluff.' },
      { num: '02', icon: '📋', title: 'Review Milestones', desc: 'Approve your roadmap. Crystal clear deliverables, timeline, and fixed price per phase. Zero scope creep.' },
      { num: '03', icon: '🚀', title: 'Fund & Watch', desc: 'Pay per milestone. Watch your product being built live in the Glass Box dashboard. Ship when it\'s done.' },
    ],
    ctaLabel: 'The Decision',
    ctaLine1: 'Stop Burning Time.',
    ctaLine2: 'Start Shipping.',
    ctaSub: 'Free scope session. No commitment. Marcus maps your project in 15 minutes and gives you a fixed-price roadmap on the spot.',
    ctaButton: 'Start Your Free Project Scope Now',
  },

  public: {
    heroBadge: 'Professional Dev Team — Ready Now',
    heroLine1: 'Your Website or App.',
    heroLine2: 'Built in 48 Hours.',
    heroSub: 'No waiting months. No agency runaround. Just results.',
    heroCta1: 'Get a Free Quote',
    heroCta2: 'See Our Prices ↓',
    problemLabel: 'The Problem',
    problemHeading: 'Traditional Agencies\nCost Too Much.',
    problemOldTitle: '✕  The Old Way',
    problemOld: [
      '3–6 months just to launch something basic',
      '£50,000+ before you\'ve even tested your idea',
      'Agencies that keep changing the scope',
      'You pay upfront and then hear nothing for weeks',
      'No idea what\'s actually being built',
      'Missed deadlines with no consequences',
    ],
    problemNewTitle: '✓  The JonnyAi Way',
    problemNew: [
      'Your first deliverable in 48 hours',
      'Fixed, transparent pricing — no surprises',
      'Real-time dashboard — watch it being built',
      '68 specialist professionals on your project',
      'Every decision documented and visible to you',
      'Pay per milestone — stop anytime if we miss',
    ],
    agentsLabel: 'The Team',
    agentsHeading: '67 Specialists.\nOne Unified Team.',
    agentsSub: 'Every skill you need — design, development, SEO, security, copywriting — all under one roof. On your project within 48 hours.',
    howLabel: 'How It Works',
    howHeading: 'Simple as\n1, 2, 3.',
    howSteps: [
      { num: '01', icon: '💬', title: 'Have a Free Chat', desc: 'Tell Marcus what you need in 15 minutes. He\'ll give you a clear plan with fixed pricing — no sales pitch, no obligation.' },
      { num: '02', icon: '📋', title: 'Agree the Plan', desc: 'Review your project roadmap. You know exactly what\'s being built, when it\'s due, and what it costs. No surprises.' },
      { num: '03', icon: '🚀', title: 'Watch It Get Built', desc: 'Pay per stage. Watch progress live in your dashboard. We deliver, you approve, done.' },
    ],
    ctaLabel: 'Ready?',
    ctaLine1: 'Let\'s Build',
    ctaLine2: 'Something Great.',
    ctaSub: 'Free 15-minute conversation. Marcus maps your project and gives you a clear plan with fixed pricing. No obligation whatsoever.',
    ctaButton: 'Get Your Free Quote Now',
  },

  idiots: {
    heroBadge: '🚀 Website Making Machine — Beep Boop',
    heroLine1: 'Jonny Makes Websites',
    heroLine2: 'Super Duper Fast. 🚀',
    heroSub: 'Like, REALLY fast. Faster than you can say "I need a wee".',
    heroCta1: 'Tell Jonny What You Want 🎉',
    heroCta2: 'How Much Is It? 👀',
    problemLabel: 'Uh Oh',
    problemHeading: 'Other Agencies\nAre Very Slow. 😴',
    problemOldTitle: '✕  The Sleepy Way',
    problemOld: [
      'Takes AGES (like 3 whole swimming lessons worth of waiting)',
      'Costs ALL your pocket money. FOREVER.',
      'They keep changing the rules of the game mid-match',
      'They take your money and then... bye bye! 👋',
      'You can\'t see ANYTHING happening (it\'s all secret)',
      'They promise things and then do a big whoops',
    ],
    problemNewTitle: '✓  The Jonny Way (Fast!) 🏎️',
    problemNew: [
      'Your website in 2 sleeps ✓ (48 hours!)',
      'You know EXACTLY how much it costs. No sneaky bits.',
      'You can WATCH it being made, like telly but better 📺',
      '67 very clever robots all working at the same time',
      'Every single thing you asked for — pinky promise 🤙',
      'If Jonny messes up, you don\'t pay. Fair\'s fair.',
    ],
    agentsLabel: '🤖 Jonny\'s Robot Friends',
    agentsHeading: '68 Robot Friends.\nThey All Have Jobs.',
    agentsSub: 'One does pretty colours. One writes the words. One makes sure it doesn\'t break. One keeps the bad guys out. They never sleep, never ask for biscuits, and they\'re ALL working on your thing RIGHT NOW.',
    howLabel: 'How Does It Work',
    howHeading: 'It\'s Actually\nReally Simple! 🌟',
    howSteps: [
      { num: '01', icon: '💬', title: 'Have a Little Chat', desc: 'Tell Marcus (he\'s the boss robot) what you want. Like telling a really clever friend. He won\'t laugh, promise.' },
      { num: '02', icon: '📋', title: 'Look at the Plan', desc: 'Marcus shows you EXACTLY what\'s going to happen and how many pennies it costs. No surprises! No hidden biscuits.' },
      { num: '03', icon: '🎉', title: 'Watch and Go Yay!', desc: 'You sit back and watch your website being made! Then it\'s done! You did it! (Well, Jonny did. But still!)' },
    ],
    ctaLabel: '🎊 Go On Then',
    ctaLine1: 'Ready?',
    ctaLine2: 'Let\'s Do This! 🎉',
    ctaSub: 'It\'s free to have a chat with Marcus. He\'s very friendly and won\'t bite. Tell him what you want and he\'ll sort everything out.',
    ctaButton: 'Tell Marcus What You Want! 🎉',
  },
};

export const pageCopy = (mode: Mode): PageCopy => copy[mode];
