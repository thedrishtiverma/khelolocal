import { createFileRoute } from "@tanstack/react-router";
import { CityPage } from "./cities.$city";

export const Route = createFileRoute("/cities/indore")({
  head: () => ({
    meta: [
      { title: "Indore City | KheloLocal" },
      {
        name: "description",
        content: "Explore the people, places and sporting events of Indore.",
      },
    ],
  }),
  component: IndorePage,
});

function IndorePage() {
  return <CityPage cityId="indore" />;
}
