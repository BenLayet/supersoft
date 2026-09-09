import { describe, expect, it } from "vitest";
import { isOpenPoint, type Statement } from "./statement";

const proposed: Statement = {
  id: "s1",
  revision: "r1",
  text: "Members can cancel up to 48 hours before.",
  state: "proposed",
};

describe("isOpenPoint", () => {
  it("counts a statement that is to confirm", () => {
    expect(isOpenPoint({ ...proposed, state: "to_confirm" })).toBe(true);
  });

  it("counts a questioned statement", () => {
    expect(isOpenPoint({ ...proposed, state: "questioned" })).toBe(true);
  });

  it("leaves proposed and withdrawn statements out", () => {
    expect(isOpenPoint(proposed)).toBe(false);
    expect(
      isOpenPoint({ ...proposed, state: "withdrawn", withdrawalReason: "Replaced by s2." }),
    ).toBe(false);
  });
});

describe("a withdrawn statement", () => {
  it("keeps the reason it was withdrawn", () => {
    const withdrawn: Statement = {
      ...proposed,
      state: "withdrawn",
      withdrawalReason: "The association stopped taking bookings by phone.",
    };
    // The reason is reachable only after narrowing on the state, which is
    // what makes "kept, with the reason" impossible to forget.
    expect(withdrawn.state === "withdrawn" && withdrawn.withdrawalReason).toContain("phone");
  });
});
