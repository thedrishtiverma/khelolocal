import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { BrandName } from "@/components/shared/BrandName";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback | KheloLocal" },
      { name: "description", content: "Help KheloLocal improve local sport discovery." },
    ],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <NetworkHero
        tone="community"
        eyebrow={
          <>
            Help shape <BrandName />
          </>
        }
        title={
          <>
            Make the next version <span className="text-lime">better.</span>
          </>
        }
        description="Tell us what would make finding, playing or following local sport easier for you."
        highlights={["Your voice", "Better flow", "Local impact"]}
      />
      <Page className="max-w-3xl py-14 sm:py-20">
        {sent ? (
          <div className="data-card rounded-2xl p-8 text-center">
            <MessageSquare className="mx-auto size-8 text-lime" />
            <h1 className="mt-5 font-display text-3xl font-black uppercase">
              Thanks for the signal.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your feedback has been noted by the KheloLocal team.
            </p>
          </div>
        ) : (
          <form
            className="data-card rounded-2xl p-7 sm:p-10"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
              toast.success("Feedback received");
            }}
          >
            <SectionHeading
              eyebrow="Feedback form"
              title="What should we improve?"
              subtitle="A quick note is enough. The form is currently a demo and does not publish your response."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Name
                <Input required name="name" className="mt-2" placeholder="Your name" />
              </label>
              <label className="text-sm font-semibold">
                Email
                <Input
                  required
                  type="email"
                  name="email"
                  className="mt-2"
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <label className="mt-5 block text-sm font-semibold">
              Your feedback
              <textarea
                required
                name="feedback"
                className="mt-2 min-h-36 w-full rounded-md border border-input bg-background px-3 py-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Tell us what you noticed..."
              />
            </label>
            <Button type="submit" className="mt-6">
              <Send className="size-4" /> Send feedback
            </Button>
          </form>
        )}
      </Page>
    </div>
  );
}
