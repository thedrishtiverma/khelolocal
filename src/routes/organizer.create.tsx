import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy organizer creation URL retained for shared links. */
export const Route = createFileRoute("/organizer/create")({
  beforeLoad: () => {
    throw redirect({ to: "/tournaments/create" });
  },
  component: () => null,
});
