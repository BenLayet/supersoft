import { describe, expect, it } from "vitest";
import {
  hasRole,
  isCustomer,
  isDomainExpert,
  isMaker,
  type Participant,
} from "./participant";

const maker: Participant = { id: "p1", name: "Alex", roles: ["maker"], level: "builder" };

describe("roles", () => {
  it("lets one person hold several roles at once", () => {
    const founder: Participant = {
      id: "p2",
      name: "Camille",
      roles: ["customer", "domainExpert", "endUser"],
      level: "editor",
    };
    expect(isCustomer(founder)).toBe(true);
    expect(isDomainExpert(founder)).toBe(true);
    expect(isMaker(founder)).toBe(false);
  });

  it("does not make the maker a customer", () => {
    expect(isMaker(maker)).toBe(true);
    expect(isCustomer(maker)).toBe(false);
  });

  it("reports a role nobody holds as absent", () => {
    expect(hasRole(maker, "endUser")).toBe(false);
  });
});
