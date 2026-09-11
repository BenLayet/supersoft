import { stateOf } from "@supersoft/domain";
import { inMemoryProjectFiles, type FilesInMemory } from "@supersoft/project-files";
import { describe, expect, it } from "vitest";
import { assignIdentifiers, planIdentifiers, withIdentifiers } from "./assign";
import { defaultLayout, type SpecificationLayout } from "./layout";
import { readSpecification } from "./read";
import { revisionOf } from "./revision";

const inFrench: SpecificationLayout = {
  documents: "docs/domaine",
  statements: "Règles",
  terms: "Vocabulaire",
};

const declaration =
  "specification:\n  documents: docs/domaine\n  statements: Règles\n  terms: Vocabulaire\n";

/** A specification as it is written by hand: rules, and nothing else. */
const adhesions = `# Adhésions

## Vocabulaire

- **Membre** : toute personne connue de l'association.

## Règles

1. L'adhésion est mensuelle et reconduite tacitement jusqu'à résiliation.
2. Un membre en relance de paiement garde tous ses accès.
3. La résiliation fait perdre l'accès aux contenus réservés, mais le membre
   reste connu de l'association.

## Questions ouvertes

- Quelle est la durée maximale d'une relance de paiement ?
`;

/** The property ADR 0008 asks for: nothing but the comments was added. */
function withoutIdentifiers(text: string): string {
  return text.replace(/ <!-- @[A-Za-z0-9][A-Za-z0-9._-]* -->/g, "");
}

function project(files: FilesInMemory = {}) {
  return inMemoryProjectFiles({
    "supersoft.yaml": declaration,
    "docs/domaine/adhesions.md": adhesions,
    ...files,
  });
}

describe("withIdentifiers", () => {
  it("names every rule that has none, in the order they are written", () => {
    let next = 0;
    const written = withIdentifiers(
      "docs/domaine/adhesions.md",
      adhesions,
      inFrench,
      () => `adhesions-r${++next}`,
    );
    expect(written.assigned.map((one) => one.statementId)).toEqual([
      "adhesions-r1",
      "adhesions-r2",
      "adhesions-r3",
    ]);
    expect(written.text).toContain(
      "1. L'adhésion est mensuelle et reconduite tacitement jusqu'à résiliation. <!-- @adhesions-r1 -->",
    );
  });

  it("writes the identifier on the line the rule ends on", () => {
    let next = 0;
    const written = withIdentifiers(
      "docs/domaine/adhesions.md",
      adhesions,
      inFrench,
      () => `adhesions-r${++next}`,
    );
    // The third rule is wrapped over two lines: the name goes at its end.
    expect(written.text).toContain("   reste connu de l'association. <!-- @adhesions-r3 -->");
    expect(written.assigned[2]?.line).toBe(12);
  });

  it("changes nothing else in the document, byte for byte", () => {
    let next = 0;
    const written = withIdentifiers(
      "docs/domaine/adhesions.md",
      adhesions,
      inFrench,
      () => `adhesions-r${++next}`,
    );
    expect(withoutIdentifiers(written.text)).toBe(adhesions);
  });

  it("keeps line endings and a missing final newline exactly as they were", () => {
    const crlf = "# Rules\r\n\r\n## Rules\r\n\r\n1. A rule.\r\n2. Another rule.";
    let next = 0;
    const written = withIdentifiers("docs/domain/rules.md", crlf, defaultLayout, () => `r-r${++next}`);
    expect(written.assigned).toHaveLength(2);
    expect(withoutIdentifiers(written.text)).toBe(crlf);
    expect(written.text).toContain("1. A rule. <!-- @r-r1 -->\r\n");
  });

  it("writes before the trailing spaces that make a hard line break", () => {
    const hardBreak = "## Rules\n\n1. A rule.  \n   Continued on the next line.\n";
    const written = withIdentifiers("docs/domain/rules.md", hardBreak, defaultLayout, () => "r-r1");
    expect(withoutIdentifiers(written.text)).toBe(hardBreak);
    expect(written.text).toContain("Continued on the next line. <!-- @r-r1 -->");
  });

  it("names a rule that ends a document with no final newline", () => {
    // Real hand-written documents end that way, and adding a newline would
    // be an edit to a file the tooling does not own.
    const noFinalNewline = "## Rules\n\n1. A rule.\n2. The last rule of the file.";
    let next = 0;
    const written = withIdentifiers(
      "docs/domain/rules.md",
      noFinalNewline,
      defaultLayout,
      () => `rules-r${++next}`,
    );
    expect(written.text.endsWith("2. The last rule of the file. <!-- @rules-r2 -->")).toBe(true);
    expect(withoutIdentifiers(written.text)).toBe(noFinalNewline);
  });

  it("leaves a rule that is already named alone", () => {
    const named = "## Rules\n\n1. A named rule. <!-- @kept-forever -->\n2. An unnamed rule.\n";
    const written = withIdentifiers("docs/domain/rules.md", named, defaultLayout, () => "rules-r1");
    expect(written.assigned.map((one) => one.text)).toEqual(["An unnamed rule."]);
    expect(written.text).toContain("1. A named rule. <!-- @kept-forever -->");
  });

  it("leaves a fenced example alone", () => {
    const withExample = "## Rules\n\n```\n1. Not a rule.\n```\n\n1. A rule.\n";
    const written = withIdentifiers("docs/domain/rules.md", withExample, defaultLayout, () => "r-r1");
    expect(written.assigned).toHaveLength(1);
    expect(written.text).toContain("```\n1. Not a rule.\n```");
  });

  it("has nothing to write in a document with no rules section", () => {
    const index = "# The domain\n\nAn index of the documents.\n";
    const written = withIdentifiers("docs/domain/README.md", index, defaultLayout, () => "r-r1");
    expect(written.assigned).toEqual([]);
    expect(written.text).toBe(index);
  });
});

describe("assignIdentifiers", () => {
  it("writes the identifiers into the document, and says what it named", async () => {
    const files = project();
    const done = await assignIdentifiers(files);

    expect(done.assigned.map((one) => one.statementId)).toEqual([
      "adhesions-r1",
      "adhesions-r2",
      "adhesions-r3",
    ]);
    expect(done.documentsWritten).toEqual(["docs/domaine/adhesions.md"]);
    expect(withoutIdentifiers((await files.read("docs/domaine/adhesions.md")) ?? "")).toBe(
      adhesions,
    );
  });

  it("makes the specification readable: every rule is then a statement", async () => {
    const files = project();
    const before = await readSpecification(files);
    expect(before.specification.statements).toHaveLength(0);
    expect(before.problems).toHaveLength(3);

    await assignIdentifiers(files);

    const after = await readSpecification(files);
    expect(after.problems).toEqual([]);
    expect(after.specification.statements.map((statement) => statement.id)).toEqual([
      "adhesions-r1",
      "adhesions-r2",
      "adhesions-r3",
    ]);
  });

  it("does nothing at all the second time, and writes no document", async () => {
    const files = project();
    await assignIdentifiers(files);
    const written = files.snapshot();

    const again = await assignIdentifiers(files);
    expect(again.assigned).toEqual([]);
    expect(again.documentsWritten).toEqual([]);
    expect(files.snapshot()).toEqual(written);
  });

  it("leaves a document with nothing to assign untouched", async () => {
    const files = project({
      "docs/domaine/formations.md":
        "# Formations\n\n## Règles\n\n1. Une formation a un nombre de places. <!-- @formations-r1 -->\n",
    });
    const done = await assignIdentifiers(files);
    expect(done.documentsWritten).toEqual(["docs/domaine/adhesions.md"]);
  });

  it("counts above the numbers a sidecar and an agreement still mention", async () => {
    // Both name statements whose rules are gone from the prose. Their numbers
    // are spent for good.
    const files = project({
      "docs/domaine/adhesions.spec.yaml":
        "statements:\n  adhesions-r4:\n    state: withdrawn\n    withdrawalReason: L'association n'accepte plus les virements.\n",
      "docs/agreements/2026-09.yaml":
        "agreements:\n  - statementId: adhesions-r9\n    revision: sha256:11223344aabbccdd\n    givenBy: marie\n    on: 2026-09-01\n",
    });
    const done = await assignIdentifiers(files);
    expect(done.assigned.map((one) => one.statementId)).toEqual([
      "adhesions-r10",
      "adhesions-r11",
      "adhesions-r12",
    ]);
  });

  it("gives each document its own slug, and each rule the next free number", async () => {
    const files = project({
      "docs/domaine/formations.md":
        "# Formations\n\n## Règles\n\n1. Une formation a un nombre de places.\n2. Une formation a un formateur.\n",
    });
    const done = await assignIdentifiers(files);
    expect(done.assigned.map((one) => one.statementId)).toEqual([
      "adhesions-r1",
      "adhesions-r2",
      "adhesions-r3",
      "formations-r1",
      "formations-r2",
    ]);
  });

  it("keeps an agreement given before the pass, since not a word changed", async () => {
    const named = adhesions.replace(
      "2. Un membre en relance de paiement garde tous ses accès.",
      "2. Un membre en relance de paiement garde tous ses accès. <!-- @adhesions-r2 -->",
    );
    const agreedRevision = revisionOf("Un membre en relance de paiement garde tous ses accès.");
    const files = project({
      "docs/domaine/adhesions.md": named,
      "docs/agreements/2026-09.yaml": `agreements:\n  - statementId: adhesions-r2\n    revision: ${agreedRevision}\n    givenBy: marie\n    on: 2026-09-01\n`,
    });

    const before = await readSpecification(files);
    const agreedBefore = before.specification.statements.find((one) => one.id === "adhesions-r2");
    expect(agreedBefore && stateOf(agreedBefore, before.agreements)).toBe("agreed");

    await assignIdentifiers(files);

    // The pass added a comment to the two rules around it. A revision is the
    // hash of a statement's own text, so nothing the agreement rests on moved.
    const after = await readSpecification(files);
    const agreedAfter = after.specification.statements.find((one) => one.id === "adhesions-r2");
    expect(agreedAfter && stateOf(agreedAfter, after.agreements)).toBe("agreed");
    expect(after.specification.statements).toHaveLength(3);
  });
});

describe("planIdentifiers", () => {
  it("says what would be written, and writes nothing", async () => {
    const files = project();
    const plan = await planIdentifiers(files);

    expect(plan.documents).toHaveLength(1);
    expect(plan.documents[0]?.assigned).toHaveLength(3);
    expect(await files.read("docs/domaine/adhesions.md")).toBe(adhesions);
  });

  it("reports what it could not read while looking for spent numbers", async () => {
    const plan = await planIdentifiers(
      project({ "docs/domaine/adhesions.spec.yaml": "statements: : :\n" }),
    );
    expect(plan.problems[0]?.kind).toBe("file_not_understood");
  });
});
