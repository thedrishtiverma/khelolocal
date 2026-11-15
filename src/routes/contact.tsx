import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | KheloLocal" },
      { name: "description", content: "Contact the KheloLocal team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div>
      <NetworkHero
        tone="community"
        eyebrow="Get in touch"
        title={
          <>
            Let’s make local sport <span className="text-lime">easier to find.</span>
          </>
        }
        description="Have a tournament, a team, an institution, or an idea for KheloLocal? We would like to hear from you."
        highlights={["Athletes", "Partners", "Ideas"]}
      />
      <Page className="py-14 sm:py-20">
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-5">
            <a
              href="mailto:khelolocal@gmail.com"
              className="flex items-start gap-4 border-t border-border py-5 hover:text-lime"
            >
              <Mail className="mt-1 size-5" />
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Email
                </span>
                <span className="mt-2 block font-semibold">khelolocal@gmail.com</span>
              </span>
            </a>
            <div className="flex items-start gap-4 border-t border-border py-5">
              <MapPin className="mt-1 size-5" />
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Based in
                </span>
                <span className="mt-2 block font-semibold">Indore, Madhya Pradesh, India</span>
              </span>
            </div>
          </div>
          <div className="border-t-2 border-primary bg-secondary/40 p-7 sm:p-10">
            <h2 className="font-display text-3xl font-black uppercase">
              For organizers and institutions
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
              Tell us what you run, who you serve, and what would make your sports workflow easier.
              We are onboarding the first local partners city by city.
            </p>
            <a
              href="mailto:khelolocal@gmail.com?subject=KheloLocal%20partnership"
              className="mt-8 inline-flex font-semibold text-foreground underline decoration-lime decoration-2 underline-offset-4 hover:text-lime"
            >
              Start a conversation
            </a>
          </div>
        </div>
        <section className="mt-16 border-t border-border pt-10">
          <SectionHeading
            eyebrow="Follow the local game"
            title={
              <>
                The game <span className="text-lime">keeps moving.</span>
              </>
            }
            subtitle="Meet the people, places, and moments making grassroots sport impossible to miss."
          />
          <p className="mb-7 max-w-2xl text-base leading-7 text-muted-foreground">
            Follow along for stories from the ground, new tournament finds, and a closer look at the
            community building KheloLocal. Pick your sideline and join the conversation.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="https://www.instagram.com/khelolocal/"
              target="_blank"
              rel="noreferrer"
              className="social-feature social-feature-instagram group rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="social-feature-icon">
                  <Instagram className="size-6" />
                </span>
                <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-lime" />
              </div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Stories from the ground
              </p>
              <strong className="mt-2 block font-display text-3xl font-black uppercase transition-colors group-hover:text-lime">
                Instagram
              </strong>
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                Catch match-day moments, local talent, and the places where the city comes to play.
              </p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold">
                Follow @khelolocal <ArrowUpRight className="size-4" />
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/khelolocal/"
              target="_blank"
              rel="noreferrer"
              className="social-feature social-feature-linkedin group rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="social-feature-icon">
                  <Linkedin className="size-6" />
                </span>
                <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-lime" />
              </div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Building the local game
              </p>
              <strong className="mt-2 block font-display text-3xl font-black uppercase transition-colors group-hover:text-lime">
                LinkedIn
              </strong>
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                Meet the people and partners growing a stronger network for grassroots sport.
              </p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold">
                Connect with KheloLocal <ArrowUpRight className="size-4" />
              </span>
            </a>
          </div>
        </section>
      </Page>
    </div>
  );
}
