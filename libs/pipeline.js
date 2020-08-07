'use strict'

const util = require('./util')
const Transform = require('./transform')
let unnamedCounter = 1

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
   * @param {Env} env The runtime environment. This is filled with results,
   * statistics, and plots as a side effect of running certain blocks.
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
      console.log(transform)
      data = transform.run(env, data)
    }

    // If the last block of the pipeline is not a report we'll report it as an
    // unamed result.
    if (!(this.transforms[this.transforms.length - 1] instanceof Transform.saveAs)
      && !(this.transforms[this.transforms.length - 1] instanceof Transform.plot)
      && !(this.transforms[this.transforms.length - 1] instanceof Transform.stats)){
      data = new Transform.saveAs("unnamed " + unnamedCounter).run(env, data)
      unnamedCounter = unnamedCounter + 1
    }

    console.log("running pipe")
    console.log(data)
  }
}

/**
 * Indicate that persisted JSON is a pipeline.
 */
Pipeline.FAMILY = '@pipeline'

module.exports = Pipeline
