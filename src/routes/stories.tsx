import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, MapPin, Trophy, Users } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { useKhelo } from "@/lib/services/store";
import { formatDate, sportLabel } from "@/lib/format";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Community stories | KheloLocal" },
      {
        name: "description",
        content:
          "Stories from athletes, organizers, institutions and the local sports community in Indore.",
      },
    ],
  }),
  component: StoriesPage,
});

function StoriesPage() {
  const { db } = useKhelo();
  const featuredAthlete =
    db.athletes.find((athlete) => athlete.verificationStatus === "VERIFIED") ?? db.athletes[0];
  const featuredTournament =
    db.tournaments.find((tournament) => tournament.status === "LIVE") ?? db.tournaments[0];
  const featuredAchievement = db.achievements.find((achievement) => achievement.verified);
  const college = db.colleges[0];

  const stories = [
    {
      eyebrow: "Athlete record",
      title: `${featuredAthlete?.name ?? "Local athletes"} is building a record that travels beyond the final whistle.`,
      body: `${featuredAthlete ? `${sportLabel(featuredAthlete.primarySport)} · ${featuredAthlete.cityName}` : "Verified local sport"}. Every match, result and achievement becomes part of a sporting identity that teams can discover.`,
      icon: Users,
      tone: "field",
      href: featuredAthlete ? `/athletes/${featuredAthlete.id}` : "/discover",
      cta: "Open athlete profile",
    },
    {
      eyebrow: "On the ground",
      title: `${featuredTournament?.name ?? "Local tournaments"} shows why city sport needs a home.`,
      body: `${featuredTournament?.venue ?? "Indore grounds"} · ${featuredTournament ? formatDate(featuredTournament.startDate) : "This season"}. Local competitions become easier to find, join and remember.`,
      icon: Trophy,
      tone: "accent",
      href: featuredTournament ? `/tournaments/${featuredTournament.id}` : "/tournaments",
      cta: "See the tournament",
    },
    {
      eyebrow: "Proof matters",
      title: featuredAchievement
        ? `${featuredAchievement.title} is more than a highlight. It is verified evidence.`
        : "Verified records make local sport more trustworthy.",
      body: featuredAchievement
        ? `${featuredAchievement.description} Verified by ${featuredAchievement.verifiedBy}.`
        : "Organizers and institutions help turn scattered results into records athletes can carry forward.",
      icon: BadgeCheck,
      tone: "navy",
      href: "/vision",
      cta: "Why verification matters",
    },
  ];

  return (
    <div>
      <NetworkHero
        tone="community"
        eyebrow="Community / stories"
        title={
          <>
            The people behind the <span className="text-lime">score.</span>
          </>
        }
        description="Local sport is not only fixtures and tables. It is athletes, volunteers, institutions and organizers making a city play."
        highlights={["Athletes", "Organizers", "Community"]}
      />
      <Page className="py-14 sm:py-24">
        <SectionHeading
          eyebrow="From Indore"
          title="Small stories. A stronger network."
          subtitle={`${college?.shortName ?? "Local institutions"} and the wider sports community are building the first layer of a city-wide record.`}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {stories.map(({ eyebrow, title, body, icon: Icon, tone, href, cta }) => (
            <article
              key={title}
              className={`story-card story-card-${tone} data-card flex min-h-[360px] flex-col rounded-2xl p-7 sm:p-8`}
            >
              <Icon className="size-7" />
              <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {eyebrow}
              </p>
              <h2 className="mt-3 font-display text-2xl font-black uppercase leading-tight">
                {title}
              </h2>
              <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">{body}</p>
              <Link
                to={href as "/vision"}
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-lime"
              >
                {cta} <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-16 grid gap-6 border-t border-border pt-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Have a story?
            </p>
            <p className="mt-2 text-lg font-semibold">
              Tell us about the game, person or place that makes your part of Indore play.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 font-semibold hover:text-lime"
          >
            Share with KheloLocal <ArrowRight className="size-4" />
          </Link>
        </div>
      </Page>
    </div>
  );
}
