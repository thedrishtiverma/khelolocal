import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/team")({
  component: TeamLayout,
});

function TeamLayout() {
  return <Outlet />;
}
