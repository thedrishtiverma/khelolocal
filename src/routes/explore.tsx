import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore local sport | KheloLocal" },
      {
        name: "description",
        content:
          "Discover tournaments, athletes, sports and verified sporting opportunities around Indore.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  return <Navigate to="/map" replace />;
}
