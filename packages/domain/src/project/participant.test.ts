import { describe, expect, it } from "vitest";
import { hasRole, type Participant } from "./participant";

const maker: Participant = { id: "p1", name: "Alex", roles: ["maker"] };

describe("roles", () => {
  it("lets one person hold several at once", () => {
    const founder: Participant = {
      id: "p2",
      name: "Camille",
      roles: ["customer", "domainExpert", "endUser"],
    };
    expect(hasRole(founder, "customer")).toBe(true);
    expect(hasRole(founder, "domainExpert")).toBe(true);
    expect(hasRole(founder, "maker")).toBe(false);
  });

  it("reports a role nobody holds as absent", () => {
    expect(hasRole(maker, "endUser")).toBe(false);
  });
});
