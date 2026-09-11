import { createFileRoute } from "@tanstack/react-router";
import { Page, SectionHeading } from "@/components/shared/Bits";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy | KheloLocal" },
      { name: "description", content: "Privacy policy for KheloLocal." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <Page className="max-w-4xl py-14 sm:py-24">
      <SectionHeading
        eyebrow="Legal"
        title="Privacy policy"
        subtitle="Last updated: September 2026"
      />
      <div className="prose-content mt-12 space-y-10 text-sm leading-7 text-muted-foreground">
        <section>
          <h2>What we collect</h2>
          <p>
            Depending on how you use KheloLocal, we may store your name, email address, city, role,
            sporting profile, tournament participation, and records you or an authorized organizer
            submit.
          </p>
        </section>
        <section>
          <h2>How we use it</h2>
          <p>
            We use this information to provide profiles, tournament discovery, registration,
            verification workflows, and connections between local sports participants. We do not
            sell personal information.
          </p>
        </section>
        <section>
          <h2>Visibility and control</h2>
          <p>
            Only information needed for sporting discovery should be made public. Avoid adding
            sensitive personal information to a profile. Contact us to ask about correcting or
            removing information.
          </p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            For privacy questions or requests, email khelolocal@gmail.com. We will review requests
            in the context of verification, safety, and legitimate platform records.
          </p>
        </section>
      </div>
    </Page>
  );
}
