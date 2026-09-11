import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Github, Instagram, Linkedin, Mail, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { founderBySlug } from "@/lib/founders";

export const Route = createFileRoute("/team/$member")({
  head: ({ params }) => {
    const founder = founderBySlug(params.member);
    return { meta: [{ title: founder ? `${founder.name} | KheloLocal` : "Founder | KheloLocal" }] };
  },
  component: FounderProfilePage,
});

function FounderProfilePage() {
  const { member } = Route.useParams();
  const founder = founderBySlug(member);
  if (!founder) throw notFound();

  return (
    <div>
      <NetworkHero
        tone="community"
        eyebrow={`Founders team / ${founder.focus}`}
        title={
          <>
            {founder.name.split(" ")[0]} <span className="text-lime">at KheloLocal.</span>
          </>
        }
        description={founder.role}
        highlights={[founder.focus, "Indore / 01", "Grassroots sport"]}
      />
      <Page className="py-14 sm:py-20">
        <Link
          to="/team"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-lime"
        >
          <ArrowLeft className="size-4" /> All founders
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <aside className="surface-panel founder-profile-card rounded-2xl p-7 sm:p-8">
            <div className="founder-profile-photo mb-7 overflow-hidden rounded-2xl border border-surface-foreground/15 bg-surface-foreground/10">
              {founder.image ? (
                <img
                  src={founder.image}
                  alt={`${founder.name} profile`}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center font-display text-7xl font-black text-lime">
                  {founder.name.slice(0, 1)}
                </div>
              )}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime">Focus</p>
            <Target className="mt-6 size-8 text-lime" />
            <p className="mt-5 font-display text-3xl font-black uppercase">{founder.focus}</p>
          </aside>
          <article className="data-card rounded-2xl p-7 sm:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Building KheloLocal
            </p>
            <h2 className="mt-4 font-display text-4xl font-black uppercase leading-none">
              Local sport deserves infrastructure.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{founder.bio}</p>
            <p className="mt-7 border-l-2 border-lime pl-5 text-base font-semibold leading-7">
              {founder.impact}
            </p>
            <Button asChild variant="outline" className="mt-9">
              <a href="mailto:khelolocal@gmail.com?subject=KheloLocal%20founders%20team">
                <Mail className="size-4" /> Connect with the team
              </a>
            </Button>
            <div className="mt-7 flex flex-wrap gap-4 border-t border-border pt-5 text-sm font-semibold">
              {founder.socials?.github ? (
                <a
                  href={founder.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-lime"
                >
                  <Github className="size-4" /> GitHub
                </a>
              ) : null}
              {founder.socials?.linkedin ? (
                <a
                  href={founder.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-lime"
                >
                  <Linkedin className="size-4" /> LinkedIn
                </a>
              ) : null}
              {founder.socials?.instagram ? (
                <a
                  href={founder.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-lime"
                >
                  <Instagram className="size-4" /> Instagram
                </a>
              ) : null}
            </div>
          </article>
        </div>
      </Page>
    </div>
  );
}
