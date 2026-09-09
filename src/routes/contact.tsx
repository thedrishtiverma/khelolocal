import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";

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
    <Page className="py-14 sm:py-24">
      <SectionHeading eyebrow="Get in touch" title="Let’s make local sport easier to find." subtitle="Have a tournament, a team, an institution, or an idea for KheloLocal? We would like to hear from you." />
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <a href="mailto:hello@khelolocal.in" className="flex items-start gap-4 border-t border-border py-5 hover:text-lime">
            <Mail className="mt-1 size-5" />
            <span><span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Email</span><span className="mt-2 block font-semibold">hello@khelolocal.in</span></span>
          </a>
          <div className="flex items-start gap-4 border-t border-border py-5">
            <MapPin className="mt-1 size-5" />
            <span><span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Based in</span><span className="mt-2 block font-semibold">Indore, Madhya Pradesh</span></span>
          </div>
        </div>
        <div className="border-t-2 border-primary bg-secondary/40 p-7 sm:p-10">
          <h2 className="font-display text-3xl font-black uppercase">For organizers and institutions</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">Tell us what you run, who you serve, and what would make your sports workflow easier. We are onboarding the first local partners city by city.</p>
          <a href="mailto:hello@khelolocal.in?subject=KheloLocal%20partnership" className="mt-8 inline-flex font-semibold text-foreground underline decoration-lime decoration-2 underline-offset-4 hover:text-lime">Start a conversation</a>
        </div>
      </div>
    </Page>
  );
}
