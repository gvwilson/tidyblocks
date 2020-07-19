'use strict'

const util = require('./util')
const Transform = require('./transform')

/**
 * Manage a single pipeline.
 */
class Pipeline {
  constructor (...transforms) {
    util.check(transforms.every(s => s instanceof Transform.base),
               `Pipeline must be made of transforms`)
    this.transforms = transforms
  }

  /**
   * Equality check (primarily for testing).
   * @param {Pipeline} other Other pipeline to compare to.
   * @returns Boolean.
   */
  equal (other) {
    util.check(other instanceof Pipeline,
               `Can only compare pipelines to pipelines`)
    return (this.transforms.length === other.transforms.length) &&
      this.transforms.every((transform, i) => transform.equal(other.transforms[i]))
  }

  /**
   * What does this pipeline require?
   * @returns Array of strings.
   */
  requires () {
    return (this.transforms.length > 0) ? this.transforms[0].requires : []
  }

  /**
   * Run this pipeline.
   * @param {Environment} env The runtime environment.
   * @returns The result of the final transform.
   */
  run (env) {
    util.check(Array.isArray(this.transforms) &&
               (this.transforms.length > 0) &&
               this.transforms.every(transform => transform instanceof Transform.base),
               `Require non-empty array of transforms`)
    util.check(!this.transforms[0].input,
               `First transform of pipeline cannot require input`)
    util.check(this.transforms.slice(1).every(transform => transform.input),
               `All transforms of pipeline after the first must take input`)
    util.check(this.transforms.slice(0, -1).every(transform => transform.output),
               `All transforms of pipeline except the last must produce output`)

    let data = null
    for (const transform of this.transforms) {
      data = transform.run(env, data)
    }

    const last = this.transforms.slice(-1)[0]
    return {name: last.produces, data: data}
  }
}
Pipeline.FAMILY = '@pipeline'

module.exports = Pipeline
