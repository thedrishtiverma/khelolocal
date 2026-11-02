import { describe, expect, it } from "vitest";
import { createSeedDatabase } from "@/data/seed";
import { effectiveTournamentStatus, searchTournaments } from "./selectors";

describe("tournament selectors", () => {
  it("does not include drafts in public tournament searches", () => {
    const database = createSeedDatabase();
    const draft = database.tournaments[0];
    if (!draft) throw new Error("Seed data must include a tournament");
    database.tournaments = [
      { ...draft, id: "draft", name: "Private draft", status: "DRAFT" },
      { ...draft, id: "listed", name: "Indore Open", status: "REGISTRATION_OPEN" },
    ];

    expect(searchTournaments(database, { query: "Indore" }).map(({ id }) => id)).toEqual([
      "listed",
    ]);
  });

  it("derives the live status from the event date", () => {
    const tournament = createSeedDatabase().tournaments[0];
    if (!tournament) throw new Error("Seed data must include a tournament");

    expect(
      effectiveTournamentStatus(
        {
          ...tournament,
          status: "UPCOMING",
          startDate: "2026-11-02",
          endDate: "2026-11-03",
        },
        "2026-11-02",
      ),
    ).toBe("LIVE");
  });
});
