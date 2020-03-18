#!/usr/bin/env node
'use strict'

const assert = require('assert')
const fs = require('fs')

const util = require('../libs/util')
const {Expr} = require('../libs/expr')
const {Summarize} = require('../libs/summarize')
const {Stage} = require('../libs/stage')
const {Pipeline} = require('../libs/pipeline')
const {Program} = require('../libs/program')

//
// All programs.
//
const Programs = {
  read_only: () => new Program(
    new Pipeline(
      'read_only',
      new Stage.read('colors.csv'))
  ),

  read_notify: () => new Program(
    new Pipeline(
      'read_notify',
      new Stage.read('colors.csv'),
      new Stage.notify('answer')
    )
  ),

  read_plot: () => new Program(
    new Pipeline(
      'read_plot',
      new Stage.read('colors.csv'),
      new Stage.scatter('red', 'green', null)
    )
  ),

  read_sort: () => new Program(
    new Pipeline(
      'read_sort',
      new Stage.read('colors.csv'),
      new Stage.sort(['red'], true),
    )
  ),

  group_summarize: () => new Program(
    new Pipeline(
      'group_summarize',
      new Stage.read('colors.csv'),
      new Stage.groupBy(['red']),
      new Stage.summarize(new Summarize.maximum('green'),
                          new Summarize.minimum('blue'))
    )
  ),

  math: () => new Program(
    new Pipeline(
      'math',
      new Stage.read('colors.csv'),
      new Stage.mutate('sum', new Expr.add(
        new Expr.constant(1),
        new Expr.multiply(
          new Expr.column('green'),
          new Expr.column('blue')
        )
      ))
    )
  ),

  parallel_two: () => new Program(
    new Pipeline(
      'parallel_two_alpha',
      new Stage.read('colors.csv'),
      new Stage.notify('alpha')
    ),
    new Pipeline(
      'parallel_two_beta',
      new Stage.read('colors.csv'),
      new Stage.notify('beta')
    )
  ),

  simple_join: () => new Program(
    new Pipeline(
      'simple_join_alpha',
      new Stage.read('colors.csv'),
      new Stage.notify('alpha')
    ),
    new Pipeline(
      'simple_join_beta',
      new Stage.read('colors.csv'),
      new Stage.notify('beta')
    ),
    new Pipeline(
      'join_em_up',
      new Stage.join('alpha', 'red', 'beta', 'green'),
      new Stage.notify('final')
    )
  ),

  stats_test: () => new Program(
    new Pipeline(
      'stats_test',
      new Stage.read('colors.csv'),
      new Stage.ZTestOneSample(100, 10, 0.01, 'red')
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
    const filename = `${outDir}/${stem}.briq`
    const program = Programs[stem]()
    const json = program.toJSON()
    fs.writeFileSync(filename, JSON.stringify(json, null, 2))
  }
}

main()
