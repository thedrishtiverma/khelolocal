import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tournaments/create")({
  beforeLoad: () => {
    throw redirect({ to: "/organizer/create" });
  },
});
