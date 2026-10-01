import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/shared/Bits";
import { FOUNDERS, founderBySlug } from "@/lib/founders";

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
    <Page className="max-w-6xl py-8 sm:py-14">
      <div>
        <Link
          to="/team"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-lime"
        >
          <ArrowLeft className="size-4" /> All founders
        </Link>
        <section className="mt-6 grid overflow-hidden rounded-2xl border border-border lg:grid-cols-[0.8fr_1.2fr]">
          <div className="surface-panel relative flex min-h-[360px] flex-col justify-between overflow-hidden p-6 sm:min-h-[480px] sm:p-10">
            <div className="profile-banner-lines pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative z-10 flex items-start justify-between gap-4">
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-surface-foreground/65">
                KheloLocal · Founders
              </p>
              <span className="font-num text-sm font-bold text-lime">
                {String(FOUNDERS.indexOf(founder) + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="relative z-10 mt-10 flex flex-1 flex-col justify-end">
              <div className="founder-profile-photo mb-8 size-40 overflow-hidden rounded-2xl border border-surface-foreground/20 bg-surface-foreground/10 sm:size-52">
                {founder.image ? (
                  <img
                    src={founder.image}
                    alt={`${founder.name} profile`}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center font-display text-8xl font-black text-lime">
                    {founder.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <p className="font-display text-4xl font-black uppercase leading-none text-surface-foreground sm:text-6xl">
                {founder.name}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-card p-6 sm:p-10 lg:p-12">
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
              Role · {founder.focus}
            </p>
            <h1 className="mt-4 max-w-xl font-display text-4xl font-black uppercase leading-[0.95] sm:text-6xl">
              {founder.role}
            </h1>
            <p className="mt-8 max-w-xl text-xl font-semibold leading-8 text-foreground">
              {founder.headline}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              {founder.bio}
            </p>
            <p className="mt-8 border-l-2 border-lime pl-5 text-base font-bold leading-7">
              {founder.impact}
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-8 border-t border-border py-8 sm:grid-cols-[0.7fr_1.3fr] sm:gap-12 sm:py-10">
          <div>
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Focus in practice
            </p>
            <h2 className="mt-3 font-display text-3xl font-black uppercase">{founder.focus}</h2>
          </div>
          <ol className="divide-y divide-border">
            {founder.contributions.map((contribution, index) => (
              <li key={contribution} className="flex gap-5 py-4 first:pt-0 last:pb-0">
                <span className="font-num text-xs font-bold text-lime">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold leading-6 sm:text-base">{contribution}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Building a stronger sporting network, together.
          </p>
          <Button asChild variant="outline">
            <a href="mailto:khelolocal@gmail.com?subject=KheloLocal%20founders%20team">
              <Mail className="size-4" /> Connect with the team
            </a>
          </Button>
        </div>
      </div>
    </Page>
  );
}
