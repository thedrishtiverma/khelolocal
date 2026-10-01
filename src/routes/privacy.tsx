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
        title={
          <>
            Privacy <span className="text-lime">policy</span>
          </>
        }
        subtitle="Last updated: September 2026"
      />
      <div className="prose-content mt-12 space-y-10 text-sm leading-7 text-muted-foreground">
        <section>
          <h2>What we collect</h2>
          <p>
            Depending on how you use KheloLocal, we may store your name, email address, city, role,
            date of birth for athlete age eligibility, sporting profile, tournament participation,
            and records you or an authorized organizer submit.
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
          <h2>Young athletes and guardian consent</h2>
          <p>
            Athletes under 18 must have permission from a parent or legal guardian to create an
            account and publish a sporting profile. Athlete signup records this acknowledgment, but
            the current prototype does not verify age or guardian identity and does not provide
            guardian account management. Profiles for under-18 athletes and athletes whose age
            cannot be established are withheld from public discovery. Do not add a young athlete's
            personal contact details or other sensitive information. Verified guardian and age-based
            profile controls are required before public discovery for minors is enabled.
          </p>
        </section>
        <section>
          <h2>Prototype storage</h2>
          <p>
            This prototype stores account and sporting data in the current browser's local storage.
            It is not a shared production account or a secure long-term record system. Do not use it
            for confidential or sensitive information.
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
