'use strict'

const util = require('./util')
const {Stage} = require('./stage')

/**
 * Manage a single pipeline.
 */
class Pipeline {
  constructor (...stages) {
    util.check(stages.every(s => s instanceof Stage.base),
               `Pipeline must be made of stages`)
    this.stages = stages
  }

  /**
   * Restore from JSON.
   * @param {JSON} json To convert.
   * @returns Pipeline.
   */
  static fromJSON (json) {
    util.check(Array.isArray(json) &&
               (json.length > 1) &&
               (json[0] === '@pipeline'),
              `Expected array with pipeline element`)
    const stages = json.slice(1).map(blob => Stage.fromJSON(blob))
    return new Pipeline(...stages)
  }

  /**
   * Convert to JSON.
   */
  toJSON () {
    return ['@pipeline',
            ...this.stages.map(stage => stage.toJSON())]
  }

  /**
   * Turn HTML row into a pipeline.
   */
  static fromHTML (factory, row) {
    util.check(row && (row.tagName.toUpperCase() === 'TR'),
               `Expected table row`)
    util.check(row.children.length >= 1,
               `Pipeline must have at least one cell (its name)`)
    const first = row.children[0]
    util.check(first.tagName.toUpperCase() === 'TH',
               `First cell must be <th> not ${first.tagName}`)
    const name = first.textContent
    const cells = Array.from(row.children).slice(1)
    const stages = cells.map(cell => {
      util.check((cell.tagName.toUpperCase() === 'TD') &&
                 (cell.children.length === 1) &&
                 (cell.firstChild.tagName.toUpperCase() === 'DIV'),
                 `Expected table cell with one div child in pipeline`)
      return Stage.fromHTML(factory, cell.firstChild)
    })
    return new Pipeline(name, ...stages)
  }

  /**
   * Equality check (primarily for testing).
   * @param {Pipeline} other Other pipeline to compare to.
   * @returns Boolean.
   */
  equal (other) {
    util.check(other instanceof Pipeline,
               `Can only compare pipelines to pipelines`)
    return (this.stages.length === other.stages.length) &&
      this.stages.every((stage, i) => stage.equal(other.stages[i]))
  }

  /**
   * What does this pipeline require?
   * @returns Array of strings.
   */
  requires () {
    return (this.stages.length > 0) ? this.stages[0].requires : []
  }

  /**
   * Run this pipeline.
   * @param {Environment} env The runtime environment.
   * @returns The result of the final stage.
   */
  run (env) {
    util.check(Array.isArray(this.stages) &&
               (this.stages.length > 0) &&
               this.stages.every(stage => stage instanceof Stage.base),
               `Require non-empty array of stages`)
    util.check(!this.stages[0].input,
               `First stage of pipeline cannot require input`)
    util.check(this.stages.slice(1).every(stage => stage.input),
               `All stages of pipeline after the first must take input`)
    util.check(this.stages.slice(0, -1).every(stage => stage.output),
               `All stages of pipeline except the last must produce output`)

    let data = null
    for (const stage of this.stages) {
      data = stage.run(env, data)
    }

    const last = this.stages.slice(-1)[0]
    return {name: last.produces, data: data}
  }
}

module.exports = {
  Pipeline
}
