#!/usr/bin/env node
'use strict'

const assert = require('assert')
const fs = require('fs')

const util = require('../libs/util')
const Value = require('../libs/value')
const Op = require('../libs/op')
const Summarize = require('../libs/summarize')
const Transform = require('../libs/transform')
const {Pipeline} = require('../libs/pipeline')
const {Program} = require('../libs/program')

//
// All programs.
//
const Programs = {
  read_only: () => new Program(
    new Pipeline(
      new Transform.read('colors.csv'))
  ),

  read_notify: () => new Program(
    new Pipeline(
      new Transform.read('colors.csv'),
      new Transform.notify('answer')
    )
  ),

  read_plot: () => new Program(
    new Pipeline(
      new Transform.read('colors.csv'),
      new Transform.scatter('red', 'green', null)
    )
  ),

  read_sort: () => new Program(
    new Pipeline(
      new Transform.read('colors.csv'),
      new Transform.sort(['red'], true),
    )
  ),

  group_summarize: () => new Program(
    new Pipeline(
      new Transform.read('colors.csv'),
      new Transform.groupBy(['red']),
      new Transform.summarize('maximum', 'green'),
      new Transform.summarize('minimum', 'blue')
    )
  ),

  math: () => new Program(
    new Pipeline(
      new Transform.read('colors.csv'),
      new Transform.mutate('sum', new Op.add(
        new Value.number(1),
        new Op.multiply(
          new Value.column('green'),
          new Value.column('blue')
        )
      ))
    )
  ),

  parallel_two: () => new Program(
    new Pipeline(
      new Transform.read('colors.csv'),
      new Transform.notify('alpha')
    ),
    new Pipeline(
      new Transform.read('colors.csv'),
      new Transform.notify('beta')
    )
  ),

  simple_join: () => new Program(
    new Pipeline(
      new Transform.read('colors.csv'),
      new Transform.notify('alpha')
    ),
    new Pipeline(
      new Transform.read('colors.csv'),
      new Transform.notify('beta')
    ),
    new Pipeline(
      new Transform.join('alpha', 'red', 'beta', 'green'),
      new Transform.notify('final')
    )
  ),

  stats_test: () => new Program(
    new Pipeline(
      new Transform.read('colors.csv'),
      new Transform.ZTestOneSample(100, 10, 0.01, 'red')
    )
  )
}

//
// Regenerate all test programs.
//
const main = () => {
  assert(process.argv.length === 3,
         `Require output directory as command-line argument`)
  const outDir = process.argv[2]
  for (let stem in Programs) {
    const filename = `${outDir}/${stem}.jeff`
    const program = Programs[stem]()
    const json = program.toJSON()
    fs.writeFileSync(filename, JSON.stringify(json, null, 2))
  }
}

main()
