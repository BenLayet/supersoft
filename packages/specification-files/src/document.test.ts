import { describe, expect, it } from "vitest";
import { readDocument } from "./document";
import { defaultLayout, type SpecificationLayout } from "./layout";

/** A project writing in its own language declares its own headings. */
const inFrench: SpecificationLayout = {
  documents: "docs/domaine",
  statements: "Règles",
  terms: "Vocabulaire",
};

const document = `# Adhésions

L'association a besoin de savoir qui la soutient et à quelles conditions.

## Vocabulaire

- **Membre** : toute personne connue de l'association, qu'elle soit adhérente ou non.
- **Adhérent à jour** : membre dont l'adhésion est active, y compris pendant une relance.
- Cette liste n'est pas exhaustive.

## Règles

1. L'adhésion est **mensuelle et reconduite tacitement** jusqu'à résiliation. <!-- @adhesions-r1 -->
2. Un membre en relance de paiement garde tous ses accès. <!-- @adhesions-r2 -->
3. La résiliation fait perdre l'accès aux contenus réservés, mais le membre
   reste connu de l'association. <!-- @adhesions-r3 -->
4. Il existe un tarif réduit pour les personnes de ressources modestes.

## Questions ouvertes

- Quelle est la durée maximale d'une relance de paiement ?
`;

describe("readDocument", () => {
  const read = readDocument("docs/domaine/adhesions.md", document, inFrench);

  it("reads one statement per item of the rules list, and nothing else", () => {
    expect(read.statements).toHaveLength(4);
    expect(read.statements[0]?.text).toBe(
      "L'adhésion est **mensuelle et reconduite tacitement** jusqu'à résiliation.",
    );
  });

  it("carries the identifier written in the prose, and keeps it out of the text", () => {
    expect(read.statements[1]?.statementId).toBe("adhesions-r2");
    expect(read.statements[1]?.text).toBe("Un membre en relance de paiement garde tous ses accès.");
  });

  it("reads a rule wrapped over several lines as one rule", () => {
    expect(read.statements[2]?.text).toBe(
      "La résiliation fait perdre l'accès aux contenus réservés, mais le membre reste connu de l'association.",
    );
  });

  it("reads a rule nobody has named yet, with no identifier", () => {
    expect(read.statements[3]?.statementId).toBeUndefined();
  });

  it("says where each rule is, for whoever has to go and fix it", () => {
    expect(read.statements[0]?.line).toBe(13);
  });

  it("reads the terms the rules are written in", () => {
    expect(read.terms).toEqual([
      {
        name: "Membre",
        definition: "toute personne connue de l'association, qu'elle soit adhérente ou non.",
      },
      {
        name: "Adhérent à jour",
        definition: "membre dont l'adhésion est active, y compris pendant une relance.",
      },
    ]);
  });

  it("leaves the prose around the sections alone, and the open questions with it", () => {
    const texts = read.statements.map((statement) => statement.text).join(" ");
    expect(texts).not.toContain("besoin de savoir");
    expect(texts).not.toContain("durée maximale");
  });
});

describe("readDocument, on the shapes a document takes", () => {
  it("matches a heading on its text, at any level and in any case", () => {
    const read = readDocument(
      "docs/domain/membership.md",
      "### RULES\n\n1. Members can cancel. <!-- @m-r1 -->\n",
      defaultLayout,
    );
    expect(read.statements[0]?.statementId).toBe("m-r1");
  });

  it("reads a list numbered with parentheses, or badly numbered", () => {
    const read = readDocument(
      "docs/domain/membership.md",
      "## Rules\n\n1) First. <!-- @m-r1 -->\n1) Second. <!-- @m-r2 -->\n",
      defaultLayout,
    );
    expect(read.statements.map((statement) => statement.statementId)).toEqual(["m-r1", "m-r2"]);
  });

  it("keeps a paragraph indented under a rule as part of it", () => {
    const read = readDocument(
      "docs/domain/membership.md",
      "## Rules\n\n1. Members can cancel. <!-- @m-r1 -->\n\n   Cancelling is free.\n\n2. Payment is monthly. <!-- @m-r2 -->\n",
      defaultLayout,
    );
    expect(read.statements[0]?.text).toBe("Members can cancel. Cancelling is free.");
    expect(read.statements).toHaveLength(2);
  });

  it("reads nothing from a document with no such section, and does not complain", () => {
    const read = readDocument("docs/domain/README.md", "# The domain\n\nAn index.\n", defaultLayout);
    expect(read.statements).toEqual([]);
    expect(read.terms).toEqual([]);
  });

  it("leaves a fenced example alone", () => {
    const read = readDocument(
      "docs/domain/membership.md",
      "## Rules\n\n```\n1. Not a rule.\n```\n\n1. A rule. <!-- @m-r1 -->\n",
      defaultLayout,
    );
    expect(read.statements.map((statement) => statement.text)).toEqual(["A rule."]);
  });

  it("strips every comment from the text, and keeps the identifier it was given last", () => {
    const read = readDocument(
      "docs/domain/membership.md",
      "## Rules\n\n1. A rule. <!-- a note --> <!-- @m-r1 -->\n",
      defaultLayout,
    );
    expect(read.statements[0]).toEqual({ statementId: "m-r1", text: "A rule.", line: 3 });
  });
});
