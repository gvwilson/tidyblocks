'use strict'

import util from './util'
import Transform from './transform'

/**
 * Manage a single pipeline.
 */
export class Pipeline {
  constructor (...transforms) {
    util.check(transforms.every(s => s instanceof Transform.base),
               `Pipeline must be made of transforms`)
    this.transforms = transforms
  }

  /**
   * Equality check (primarily for testing).
   * @param {Pipeline} other Other pipeline to compare to.
   * @return Boolean.
   */
  equal (other) {
    util.check(other instanceof Pipeline,
               `Can only compare pipelines to pipelines`)
    return (this.transforms.length === other.transforms.length) &&
      this.transforms.every((transform, i) => transform.equal(other.transforms[i]))
  }

  /**
   * What does this pipeline require?
   * @return Array of strings.
   */
  requires () {
    return (this.transforms.length > 0) ? this.transforms[0].requires : []
  }

  /**
   * Run this pipeline.
   * @param {Env} env The runtime environment. This is filled with results,
   * statistics, and plots as a side effect of running certain blocks. Its
   * counter of unnamed results is updated as needed.
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

    // Run each stage in order.
    let data = null
    for (const transform of this.transforms) {
      data = transform.run(env, data)
    }

    // If the last block of the pipeline does not automatically save its result,
    // save it manually.
    if (!(this.transforms[this.transforms.length - 1].savesResult)) {
      const label = `${Pipeline.UNNAMED_RESULT} ${env.getNextUnnamedId()}`
      data = new Transform.saveAs(label).run(env, data)
    }
  }
}

/**
 * Identifier used for anonymous results.
 */
Pipeline.UNNAMED_RESULT = 'unnamed'

/**
 * Indicate that persisted JSON is a pipeline.
 */
Pipeline.FAMILY = '@pipeline'
