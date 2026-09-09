import { createFileRoute } from "@tanstack/react-router";
import { Page, SectionHeading } from "@/components/shared/Bits";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms | KheloLocal" }, { name: "description", content: "Terms of use for KheloLocal." }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <Page className="max-w-4xl py-14 sm:py-24">
      <SectionHeading eyebrow="Legal" title="Terms of use" subtitle="Last updated: September 2026" />
      <div className="prose-content mt-12 space-y-10 text-sm leading-7 text-muted-foreground">
        <section><h2>Using KheloLocal</h2><p>KheloLocal helps people discover local sports opportunities, athletes, organizers, teams, and institutions. Use the service lawfully and provide information that is accurate to the best of your knowledge.</p></section>
        <section><h2>Records and verification</h2><p>Profiles and results may contain self-reported or organizer-submitted information. A verification label describes the source of a record; it is not a guarantee of future performance or an endorsement of every claim.</p></section>
        <section><h2>Respect and safety</h2><p>Do not use KheloLocal to harass, impersonate, discriminate against, or put another person at risk. Report inaccurate, unsafe, or abusive content to the KheloLocal team.</p></section>
        <section><h2>Changes</h2><p>We may improve the product and update these terms as the network grows. Continued use after an update means you accept the revised terms.</p></section>
      </div>
    </Page>
  );
}
