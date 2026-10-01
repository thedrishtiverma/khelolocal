export interface Founder {
  slug: string;
  name: string;
  role: string;
  focus: string;
  headline: string;
  bio: string;
  contributions: string[];
  impact: string;
  image?: string;
  socials?: { github?: string; linkedin?: string; instagram?: string };
}

export const FOUNDERS: Founder[] = [
  {
    slug: "thedrishtiverma",
    name: "Drishti Verma",
    role: "Team lead · Product direction",
    focus: "Product direction",
    headline: "Build a clearer path from local play to lasting opportunity.",
    bio: "Drishti shapes KheloLocal's direction, bringing athlete, organizer, and institution needs into one product vision. She focuses on making grassroots sport easier to discover, document, and trust.",
    contributions: [
      "Product direction and priorities",
      "Connected athlete and organizer journeys",
      "A trusted record of grassroots sport",
    ],
    impact: "Turning everyday local games into visible sporting opportunities.",
    image: "/team/drishti-verma.jpeg",
    socials: {
      github: "https://github.com/khelolocal",
      linkedin: "https://www.linkedin.com/company/khelolocal",
      instagram: "https://www.instagram.com/khelolocal",
    },
  },
  {
    slug: "arpita-jamra",
    name: "Arpita Jamra",
    role: "Research · Athlete experience",
    focus: "Athlete experience",
    headline: "Start with the people who show up to play.",
    bio: "Arpita explores what athletes need before, during, and after competition. Her research keeps KheloLocal's experiences grounded in real sporting journeys and the people behind them.",
    contributions: [
      "Athlete needs and feedback",
      "Research across the competition journey",
      "Clearer athlete-facing experiences",
    ],
    impact: "Making every athlete's next step easier to find.",
  },
  {
    slug: "prince-dhakad",
    name: "Prince Dhakad",
    role: "Product · Community workflows",
    focus: "Community workflows",
    headline: "Make participation simple for every side of the game.",
    bio: "Prince shapes the workflows organizers, volunteers, and players use to contribute to a connected sports network. His focus is turning community needs into straightforward ways to take part.",
    contributions: [
      "Community and organizer workflows",
      "Volunteer participation",
      "Smoother handoffs from event to record",
    ],
    impact: "Helping local communities organize with less friction.",
  },
  {
    slug: "gaurav-madavi",
    name: "Gaurav Madavi",
    role: "Sports operations · Event coordination",
    focus: "Sports operations",
    headline: "Help great sporting moments run smoothly.",
    bio: "Gaurav focuses on the coordination that brings athletes, organizers, and institutions together. He helps turn sporting activity into clear, well-run experiences from the first connection through the final result.",
    contributions: [
      "Tournament and event coordination",
      "Clear touchpoints for participants and organizers",
      "Reliable event-to-result handoffs",
    ],
    impact: "Keeping the game moving, on and off the field.",
  },
  {
    slug: "darshna-jain",
    name: "Darshna Jain",
    role: "Research · Institutional partnerships",
    focus: "Institutional partnerships",
    headline: "Give campus sport a record that lasts beyond the event.",
    bio: "Darshna builds understanding and relationships with institutions so student athletes can carry a lasting record of their sporting work. She connects campus participation with opportunities beyond the event.",
    contributions: [
      "Institutional research and relationships",
      "Student athlete records",
      "Campus-to-community connections",
    ],
    impact: "Connecting campus sport to opportunity beyond the event.",
  },
  {
    slug: "roshni-chouhan",
    name: "Roshni Chouhan",
    role: "Sports data · Athlete records",
    focus: "Sports data",
    headline: "Turn performances into clear, useful evidence.",
    bio: "Roshni works on how sporting information is captured and understood. Her focus is making athlete records clear and useful to athletes, organizers, and the wider sports community.",
    contributions: [
      "Athlete record quality",
      "Clear sporting data and context",
      "Evidence that can support future opportunities",
    ],
    impact: "Giving good performances a record that can travel.",
  },
];

export function founderBySlug(slug: string) {
  const canonicalSlug = slug === "drishti-verma" ? "thedrishtiverma" : slug;
  return FOUNDERS.find((founder) => founder.slug === canonicalSlug);
}
