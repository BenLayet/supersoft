import { isAgreed, openPointsOf, stateOf, statementById } from "@supersoft/domain";
import { inMemoryProjectFiles, type FilesInMemory } from "@supersoft/project-files";
import { describe, expect, it } from "vitest";
import { readSpecification } from "./read";
import { revisionOf } from "./revision";

const dunning = "Un membre en relance de paiement garde tous ses accès.";

const adhesions = `# Adhésions

## Vocabulaire

- **Membre** : toute personne connue de l'association, qu'elle soit adhérente ou non.

## Règles

1. L'adhésion est mensuelle et reconduite tacitement jusqu'à résiliation. <!-- @adhesions-r1 -->
2. ${dunning} <!-- @adhesions-r2 -->
3. Le paiement peut se faire par prélèvement ou par virement. <!-- @adhesions-r3 -->
`;

const declaration =
  "specification:\n  documents: docs/domaine\n  statements: Règles\n  terms: Vocabulaire\n";

function project(files: FilesInMemory = {}) {
  return inMemoryProjectFiles({
    "supersoft.yaml": declaration,
    "docs/domaine/adhesions.md": adhesions,
    ...files,
  });
}

describe("readSpecification, on a specification written by hand", () => {
  it("reads the rules of every document as statements", async () => {
    const read = await readSpecification(project());
    expect(read.specification.statements.map((statement) => statement.id)).toEqual([
      "adhesions-r1",
      "adhesions-r2",
      "adhesions-r3",
    ]);
    expect(read.problems).toEqual([]);
  });

  it("reads the terms the rules are written in", async () => {
    const read = await readSpecification(project());
    expect(read.specification.terms[0]?.name).toBe("Membre");
  });

  it("leaves every statement proposed when nothing else is recorded", async () => {
    const read = await readSpecification(project());
    expect(read.specification.statements.every((statement) => statement.state === "proposed")).toBe(
      true,
    );
  });

  it("computes each revision from the text of the statement itself", async () => {
    const read = await readSpecification(project());
    expect(statementById(read.specification, "adhesions-r2")?.revision).toBe(revisionOf(dunning));
  });

  it("says where each statement is written", async () => {
    const read = await readSpecification(project());
    expect(read.origins.get("adhesions-r2")).toEqual({
      document: "docs/domaine/adhesions.md",
      line: 10,
    });
  });
});

describe("readSpecification, on what the sidecar records", () => {
  it("gives a statement the state recorded for it", async () => {
    const read = await readSpecification(
      project({
        "docs/domaine/adhesions.spec.yaml":
          "statements:\n  adhesions-r2:\n    state: to_confirm\n",
      }),
    );
    expect(statementById(read.specification, "adhesions-r2")?.state).toBe("to_confirm");
    expect(statementById(read.specification, "adhesions-r1")?.state).toBe("proposed");
  });

  it("makes a statement to confirm an open point of the project", async () => {
    const read = await readSpecification(
      project({
        "docs/domaine/adhesions.spec.yaml":
          "statements:\n  adhesions-r2:\n    state: to_confirm\n",
      }),
    );
    expect(openPointsOf(read.specification.statements, [])).toEqual([
      { kind: "statement_to_confirm", statementId: "adhesions-r2" },
    ]);
  });

  it("keeps the reason a statement was withdrawn", async () => {
    const read = await readSpecification(
      project({
        "docs/domaine/adhesions.spec.yaml":
          "statements:\n  adhesions-r3:\n    state: withdrawn\n    withdrawalReason: L'association n'accepte plus les virements.\n",
      }),
    );
    const withdrawn = statementById(read.specification, "adhesions-r3");
    expect(withdrawn?.state === "withdrawn" && withdrawn.withdrawalReason).toContain("virements");
  });

  it("says so when an entry names a statement the document does not carry", async () => {
    const read = await readSpecification(
      project({
        "docs/domaine/adhesions.spec.yaml": "statements:\n  adhesions-r9:\n    state: questioned\n",
      }),
    );
    expect(read.problems).toEqual([
      {
        kind: "entry_without_statement",
        statementId: "adhesions-r9",
        sidecar: "docs/domaine/adhesions.spec.yaml",
      },
    ]);
  });
});

describe("readSpecification, on agreements", () => {
  const agreementOn = (revision: string) =>
    `agreements:\n  - statementId: adhesions-r2\n    revision: ${revision}\n    givenBy: marie\n    on: 2026-09-01\n`;

  it("holds a statement agreed while its words are the ones that were agreed to", async () => {
    const read = await readSpecification(
      project({ "docs/agreements/2026-09.yaml": agreementOn(revisionOf(dunning)) }),
    );
    const statement = statementById(read.specification, "adhesions-r2");
    expect(statement && isAgreed(statement, read.agreements)).toBe(true);
    expect(statement && stateOf(statement, read.agreements)).toBe("agreed");
  });

  it("stops holding it agreed the moment the rule is reworded", async () => {
    // The identity of the rule survives the edit; the agreement does not.
    // This is the whole point of ADR 0004 and ADR 0006.
    const reworded = adhesions.replace(dunning, "Un membre en relance de paiement garde ses accès.");
    const read = await readSpecification(
      inMemoryProjectFiles({
        "supersoft.yaml": declaration,
        "docs/domaine/adhesions.md": reworded,
        "docs/agreements/2026-09.yaml": agreementOn(revisionOf(dunning)),
      }),
    );
    const statement = statementById(read.specification, "adhesions-r2");
    expect(statement?.id).toBe("adhesions-r2");
    expect(statement && stateOf(statement, read.agreements)).toBe("proposed");
  });

  it("keeps it agreed when a rule is inserted above it", async () => {
    // Position is not identity: one insertion must invalidate nothing.
    const withAnInsertion = adhesions.replace(
      "1. L'adhésion",
      "1. Toute personne peut devenir membre. <!-- @adhesions-r0 -->\n2. L'adhésion",
    );
    const read = await readSpecification(
      inMemoryProjectFiles({
        "supersoft.yaml": declaration,
        "docs/domaine/adhesions.md": withAnInsertion,
        "docs/agreements/2026-09.yaml": agreementOn(revisionOf(dunning)),
      }),
    );
    const statement = statementById(read.specification, "adhesions-r2");
    expect(statement && stateOf(statement, read.agreements)).toBe("agreed");
  });

  it("says so when an agreement names a statement no document carries", async () => {
    const read = await readSpecification(
      project({
        "docs/agreements/2026-09.yaml":
          "agreements:\n  - statementId: adhesions-r9\n    revision: sha256:11223344aabbccdd\n    givenBy: marie\n    on: 2026-09-01\n",
      }),
    );
    expect(read.problems).toEqual([
      {
        kind: "agreement_without_statement",
        statementId: "adhesions-r9",
        file: "docs/agreements/2026-09.yaml",
      },
    ]);
  });
});

describe("readSpecification, on what it cannot read", () => {
  it("reads the rules it can and reports a rule nobody has named", async () => {
    const read = await readSpecification(
      project({
        "docs/domaine/formations.md":
          "# Formations\n\n## Règles\n\n1. Une formation a un nombre de places.\n",
      }),
    );
    expect(read.specification.statements).toHaveLength(3);
    expect(read.problems).toEqual([
      {
        kind: "statement_without_identifier",
        document: "docs/domaine/formations.md",
        line: 5,
        text: "Une formation a un nombre de places.",
      },
    ]);
  });

  it("keeps the first of two rules sharing an identifier, and names both places", async () => {
    const read = await readSpecification(
      project({
        "docs/domaine/formations.md":
          "# Formations\n\n## Règles\n\n1. Une formation a un nombre de places. <!-- @adhesions-r1 -->\n",
      }),
    );
    expect(read.specification.statements).toHaveLength(3);
    expect(read.problems[0]).toMatchObject({
      kind: "identifier_used_twice",
      statementId: "adhesions-r1",
      document: "docs/domaine/formations.md",
      firstIn: "docs/domaine/adhesions.md",
    });
  });

  it("says so when a term is defined twice, in one document or two", async () => {
    const read = await readSpecification(
      project({
        "docs/domaine/formations.md":
          "# Formations\n\n## Vocabulaire\n\n- **Membre** : une autre définition.\n",
      }),
    );
    expect(read.problems[0]).toMatchObject({
      kind: "term_defined_twice",
      term: "Membre",
      firstIn: "docs/domaine/adhesions.md",
    });
  });

  it("reads a project that declares nothing, with the defaults", async () => {
    const read = await readSpecification(
      inMemoryProjectFiles({
        "docs/domain/membership.md": "# Membership\n\n## Rules\n\n1. A rule. <!-- @m-r1 -->\n",
      }),
    );
    expect(read.layout.documents).toBe("docs/domain");
    expect(read.specification.statements.map((statement) => statement.id)).toEqual(["m-r1"]);
  });

  it("reads an empty project as an empty specification", async () => {
    const read = await readSpecification(inMemoryProjectFiles({}));
    expect(read.specification).toEqual({ statements: [], terms: [] });
    expect(read.problems).toEqual([]);
  });
});
