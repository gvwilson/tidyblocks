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
   * Convert to JSON.
   */
  toJSON () {
    return ['@pipeline',
            ...this.stages.map(stage => stage.toJSON())]
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
Pipeline.KIND = '@pipeline'

module.exports = {
  Pipeline
}
