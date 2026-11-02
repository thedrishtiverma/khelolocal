import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/cities")({
  component: CitiesLayout,
});

function CitiesLayout() {
  return <Outlet />;
}
