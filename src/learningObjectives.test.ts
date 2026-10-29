import assert from "node:assert/strict"
import test from "node:test"
import { modules } from "./curriculum.ts"
import { getObjectivesForModule, sourceLearningObjectives } from "./learningObjectives.ts"

test("source document learning objectives are deduplicated and mapped to existing lessons", () => {
  assert.equal(sourceLearningObjectives.length, 63)
  assert.equal(new Set(sourceLearningObjectives.map((objective) => objective.text.toLowerCase())).size, 63)
  for (const objective of sourceLearningObjectives) {
    const module = modules.find((item) => item.id === objective.moduleId)
    assert.ok(module, `Missing module for ${objective.id}`)
    const titles = module.sections.flatMap((section) => section.concepts.map((item) => item.title))
    assert.ok(titles.includes(objective.lessonTitle), `${objective.id} should match a lesson in ${module.id}`)
  }
  assert.deepEqual(
    sourceLearningObjectives.flatMap((objective) => [objective.id]).slice(0, 2),
    ["LO-001", "LO-002"],
  )
  assert.equal(
    modules.reduce((count, module) => count + getObjectivesForModule(module.id).length, 0),
    63,
  )
  assert.equal(sourceLearningObjectives.filter((objective) => objective.kind === "guided-practice").length, 1)
})
