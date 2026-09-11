import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "KheloLocal merch" },
      { name: "description", content: "Wear the local game with KheloLocal merch." },
    ],
  }),
  component: ShopPage,
});

const ITEMS = [
  ["City League Tee", "Soft cotton · Indore / 01", "₹699", "tee"],
  ["Home Ground Cap", "Six-panel cap · Lime stitch", "₹499", "cap"],
  ["Match Day Tote", "Canvas carryall · Local sport", "₹399", "tote"],
  ["KheloLocal Water Bottle", "Steel bottle · 750 ml", "₹799", "bottle"],
] as const;

function ShopPage() {
  return (
    <div>
      <NetworkHero
        tone="shop"
        eyebrow="KheloLocal merch"
        title={
          <>
            Wear the <span className="text-lime">local game.</span>
          </>
        }
        description="Small-batch essentials for people who show up for sport in their city."
        highlights={["Indore / 01", "Small batch", "Made for game day"]}
      />
      <Page className="py-14 sm:py-20">
        <SectionHeading
          eyebrow="First drop"
          title="Built for the home ground."
          subtitle="Demo merch collection — checkout will open soon."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(([name, detail, price, visual]) => (
            <article
              key={name}
              className={`merch-card merch-card-${visual} data-card overflow-hidden rounded-2xl p-0`}
            >
              <div className="merch-card-art">
                <ShoppingBag className="size-10" aria-hidden="true" />
                <span className="font-ui text-[10px] font-bold uppercase tracking-[0.2em]">
                  Khelo<span className="text-lime">Local</span>
                </span>
              </div>
              <div className="p-6">
                <h2 className="font-display text-2xl font-black uppercase">{name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="font-num text-xl font-bold">{price}</span>
                  <Button size="sm" variant="outline">
                    Coming soon
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Page>
    </div>
  );
}
