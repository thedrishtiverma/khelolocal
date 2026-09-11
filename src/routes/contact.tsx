import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | KheloLocal" },
      { name: "description", content: "Contact the KheloLocal team in Indore." },
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
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Email
                </span>
                <span className="mt-2 block font-semibold">khelolocal@gmail.com</span>
              </span>
            </a>
            <div className="flex items-start gap-4 border-t border-border py-5">
              <MapPin className="mt-1 size-5" />
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Based in
                </span>
                <span className="mt-2 block font-semibold">Indore, Madhya Pradesh</span>
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
          <SectionHeading eyebrow="Follow the local game" title="KheloLocal online" />
          <div className="grid gap-3 sm:grid-cols-2">
            <a href="https://www.instagram.com/khelolocal" target="_blank" rel="noreferrer" className="data-card flex items-center gap-4 rounded-xl p-5 hover:text-lime">
              <Instagram className="size-6 text-lime" />
              <span><strong className="block">Instagram</strong><span className="text-sm text-muted-foreground">Daily sport, people and places from Indore.</span></span>
            </a>
            <a href="https://www.linkedin.com/company/khelolocal" target="_blank" rel="noreferrer" className="data-card flex items-center gap-4 rounded-xl p-5 hover:text-lime">
              <Linkedin className="size-6 text-lime" />
              <span><strong className="block">LinkedIn</strong><span className="text-sm text-muted-foreground">The people and partners building KheloLocal.</span></span>
            </a>
          </div>
        </section>
      </Page>
    </div>
  );
}
