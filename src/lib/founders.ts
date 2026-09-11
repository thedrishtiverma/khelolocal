export interface Founder {
  slug: string;
  name: string;
  role: string;
  focus: string;
  bio: string;
  impact: string;
}

export const FOUNDERS: Founder[] = [
  {
    slug: "drishti-verma",
    name: "Drishti Verma",
    role: "Team lead · Product and sports network",
    focus: "Product direction",
    bio: "Drishti leads the product vision behind a trusted, city-by-city sporting network built around the games people already play.",
    impact: "Turning everyday local games into visible sporting opportunities.",
  },
  {
    slug: "arpita-jamra",
    name: "Arpita Jamra",
    role: "Research · Athlete experience",
    focus: "Athlete experience",
    bio: "Arpita researches what athletes need before, during and after competition so KheloLocal stays useful on the ground.",
    impact: "Making every athlete's next step easier to find.",
  },
  {
    slug: "prince-dhakad",
    name: "Prince Dhakad",
    role: "Product · Community workflows",
    focus: "Community workflows",
    bio: "Prince shapes the product flows that help organizers, volunteers and players contribute to one connected sports network.",
    impact: "Helping local communities organize with less friction.",
  },
  {
    slug: "gaurav-madavi",
    name: "Gaurav Madavi",
    role: "Technology · Platform development",
    focus: "Platform development",
    bio: "Gaurav develops the platform foundations that keep profiles, tournaments and verified records connected as the network grows.",
    impact: "Building dependable digital infrastructure for grassroots sport.",
  },
  {
    slug: "darshna-jain",
    name: "Darshna Jain",
    role: "Research · Institutional partnerships",
    focus: "Institutional partnerships",
    bio: "Darshna works on the research and relationships that help institutions give student athletes lasting sporting records.",
    impact: "Connecting campus sport to opportunity beyond the event.",
  },
  {
    slug: "roshni-chouhan",
    name: "Roshni Chouhan",
    role: "Sports data · Athlete records",
    focus: "Sports data",
    bio: "Roshni focuses on how sporting data becomes clear, useful evidence for athletes, organizers and the wider local network.",
    impact: "Giving good performances a record that can travel.",
  },
];

export function founderBySlug(slug: string) {
  return FOUNDERS.find((founder) => founder.slug === slug);
}
