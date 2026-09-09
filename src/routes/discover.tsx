import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy discovery URL retained for shared links. */
export const Route = createFileRoute("/discover")({
  beforeLoad: () => {
    throw redirect({ to: "/athletes" });
  },
  component: () => null,
});
