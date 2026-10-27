// Tests du découpage du titre du hero hologramme : `npm test`.
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { splitHeroTitle } from "./heroTitle.ts";

test("deux ou trois mots : le premier en plein, la suite en contour", () => {
  assert.deepEqual(splitHeroTitle("Nexen's Home"), { first: "Nexen's", rest: "Home" });
  assert.deepEqual(splitHeroTitle("Nexen's Home 2"), { first: "Nexen's", rest: "Home 2" });
});

test("un seul mot ou plus de trois : titre d'un seul tenant", () => {
  assert.deepEqual(splitHeroTitle("Nexen"), { first: "Nexen", rest: null });
  assert.deepEqual(splitHeroTitle("Nexen Open Air Festival"), { first: "Nexen Open Air Festival", rest: null });
});
