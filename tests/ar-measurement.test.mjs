import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import ts from "typescript"

// Run the same pure TypeScript used by the app, without an additional test dependency.
const source = readFileSync(new URL("../src/utils/ar-measurement.ts", import.meta.url), "utf8")
const { outputText, diagnostics } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  reportDiagnostics: true,
})
assert.equal(diagnostics.length, 0)
const { distanceInMetres, formatDistance, selectSurfacePoint, canPlaceTarget } =
  await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`)

const hit = (type, position) => ({ type, transform: { position } })

test("measures all three world-space axes and zero length", () => {
  assert.equal(distanceInMetres([0, 0, 0], [0, 0, 0]), 0)
  assert.equal(distanceInMetres([-1, -2, -3], [2, 2, 9]), 13)
  assert.equal(distanceInMetres([0, 0, 0], [0, 1, 0]), 1)
})

test("formats centimetres and metres at the unit boundary", () => {
  assert.equal(formatDistance(0.235), "23.5 cm")
  assert.equal(formatDistance(1), "1.00 m")
  assert.equal(formatDistance(2.345), "2.35 m")
})

test("selects the nearest bounded surface regardless of hit ordering", () => {
  assert.deepEqual(selectSurfacePoint([
    hit("FeaturePoint", [0, 0, -0.2]),
    hit("ExistingPlaneUsingExtent", [0, 0, -2]),
    hit("ExistingPlaneUsingExtent", [0, 0, -1]),
  ], [0, 0, 0]), [0, 0, -1])
})

test("rejects estimated, infinite, malformed and out-of-range hits", () => {
  for (const type of ["FeaturePoint", "EstimatedHorizontalPlane", "ExistingPlane", "DepthPoint"]) {
    assert.equal(selectSurfacePoint([hit(type, [0, 0, -1])], [0, 0, 0]), null)
  }
  for (const position of [[NaN, 0, -1], [Infinity, 0, 0], [0, 0], [0, 0, -6], [0, 0, 0]]) {
    assert.equal(selectSurfacePoint([hit("ExistingPlaneUsingExtent", position)], [0, 0, 0]), null)
  }
  assert.equal(selectSurfacePoint([], [0, 0, 0]), null)
  assert.equal(selectSurfacePoint([hit("ExistingPlaneUsingExtent", [0, 0, -1])], [NaN, 0, 0]), null)
})

test("requires normal tracking and a fresh, valid target", () => {
  const target = { position: [0, 0, -1], timestamp: 1000 }
  assert.equal(canPlaceTarget(target, true, 1350), true)
  assert.equal(canPlaceTarget(target, true, 1351), false)
  assert.equal(canPlaceTarget(target, false, 1100), false)
  assert.equal(canPlaceTarget(null, true, 1100), false)
  assert.equal(canPlaceTarget(target, true, 999), false)
  assert.equal(canPlaceTarget({ ...target, position: [NaN, 0, 0] }, true, 1100), false)
})
