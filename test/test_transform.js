'use strict'

const assert = require('assert')
const util = require('../libs/util')
const DataFrame = require('../libs/dataframe')
const Value = require('../libs/value')
const Summarize = require('../libs/summarize')
const Transform = require('../libs/transform')
const Env = require('../libs/env')

const fixture = require('./fixture')
const INTERFACE = new fixture.TestInterface()

describe('build dataframe operations', () => {
  it('builds data loading transform', (done) => {
    const expected = INTERFACE.userData.get('colors')
    const env = new Env(INTERFACE)
    const transform = new Transform.data('colors')
    const actual = transform.run(env, null)
    assert(actual.equal(expected),
           `Mis-match in dataframes`)
    done()
  })

  it('builds drop columns transform', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.drop(['personal'])
    const result = transform.run(env, new DataFrame(fixture.NAMES))
    const expected = fixture.NAMES.map(row => ({family: row.family}))
    assert(result.equal(new DataFrame(expected)),
           `Expected one column of data`)
    done()
  })

  it('builds filter transform', (done) => {
    const env = new Env(INTERFACE)
    const expr = new Value.column('right')
    const transform = new Transform.filter(expr)
    const result = transform.run(env, new DataFrame(fixture.BOOL))
    const expected = fixture.BOOL.filter(row => (row.right === true))
    assert(expected.length < fixture.BOOL.length, `No filtering?`)
    assert(result.equal(new DataFrame(expected)),
           `Expected only a few rows`)
    done()
  })

  it('builds group data transform', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.groupBy(['left'])
    const result = transform.run(env, new DataFrame(fixture.NUMBER))
    const groups = new Set(result.data.map(row => row[DataFrame.GROUPCOL]))
    assert.deepEqual(groups, new Set([1, 2, 3, 4]),
                     `Wrong number of groups`)
    done()
  })

  it('builds join transform', (done) => {
    const leftData = new DataFrame([{leftName: 7, value: 'leftVal'}])
    const rightData = new DataFrame([{rightName: 7, value: 'rightVal'}])
    const env = new Env(INTERFACE)
    env.setResult('leftTable', leftData)
    env.setResult('rightTable', rightData)
    const transform = new Transform.join('leftTable', 'leftName', 'rightTable', 'rightName')
    const result = transform.run(env, null)
    const row = {leftTable_value: 'leftVal', rightTable_value: 'rightVal'}
    row[DataFrame.JOINCOL] = 7
    assert(result.equal(new DataFrame([row])),
           `Wrong joined dataframe`)
    done()
  })

  it('builds mutate transform', (done) => {
    const env = new Env(INTERFACE)
    const mutater = new Value.text('stuff')
    const transform = new Transform.mutate('value', mutater)
    const result = transform.run(env, new DataFrame(fixture.NAMES))
    assert.deepEqual(result.columns, new Set(['personal', 'family', 'value']),
                     `Wrong columns in result`)
    assert(result.data.every(row => (row.value === 'stuff')),
           `Wrong values in result`)
    done()
  })

  it('builds report transform', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.report('answer')
    const input = new DataFrame(fixture.NAMES)
    const result = transform.run(env, input)
    const expected = new DataFrame(fixture.NAMES)
    assert(result instanceof DataFrame,
           `Expected DataFrame as result`)
    assert(result.equal(expected),
           `Should not modify data`)
    assert(env.results.has('answer'),
           `Should have an answer recorded`)
    assert(env.results.get('answer').equal(expected),
           `Wrong result recorded`)
    done()
  })

  it('builds read data transform', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.data('colors')
    const result = transform.run(env, null)
    assert(result instanceof DataFrame,
           `Expected dataframe`)
    const direct = new DataFrame(fixture.COLORS)
    assert(result.equal(direct),
           `Expected names dataset`)
    done()
  })

  it('builds select transform', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.select(['personal'])
    const result = transform.run(env, new DataFrame(fixture.NAMES))
    const expected = fixture.NAMES.map(row => ({personal: row.personal}))
    assert(result.equal(new DataFrame(expected)),
           `Expected one column of data`)
    done()
  })

  it('builds sequence transform', (done) => {
    const length = 3
    const env = new Env(INTERFACE)
    const transform = new Transform.sequence('nums', length)
    const result = transform.run(env, null)
    const expected = Array.from({length}, (v, k) => ({nums: k+1}))
    assert(result.equal(new DataFrame(expected)),
           `Did not get expected result`)
    done()
  })

  it('builds sort transform', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.sort(['left'], true)
    const result = transform.run(env, new DataFrame(fixture.STRING))
    const actual = result.data.map(row => row.left)
    const expected = ['pqr', 'def', 'abc', 'abc', 'abc', util.MISSING, util.MISSING]
    assert.deepEqual(actual, expected,
                     `Wrong sorted values`)
    done()
  })

  it('builds summarize transform', (done) => {
    const df = new DataFrame([{left: 3}])
    const env = new Env(INTERFACE)
    const transform = new Transform.summarize('maximum', 'left')
    const result = transform.run(env, df)
    assert.deepEqual(result.data,
                     [{left: 3, left_maximum: 3}],
                     `Incorrect summary`)
    done()
  })

  it('build ungroup transform', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.ungroup()
    const input = [{a: 1}, {a: 2}]
    input.forEach(row => {row[DataFrame.GROUPCOL] = 1})
    const result = transform.run(env, new DataFrame(input))
    assert(result.data.every(row => !(DataFrame.GROUPCOL in row)),
           `Expected grouping column to be removed`)
    done()
  })

  it('builds unique values transform', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.unique(['a'])
    const input = [{a: 1}, {a: 1}, {a: 2}, {a: 1}]
    const result = transform.run(env, new DataFrame(input))
    assert(result.equal(new DataFrame([{a: 1}, {a: 2}])),
           `Wrong result`)
    done()
  })
})

describe('build plots', () => {
  it('creates a bar plot', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.bar('figure_1', 'red', 'green')
    const result = transform.run(env, new DataFrame(fixture.COLORS))
    const plot = env.getPlot('figure_1')
    assert.equal(plot.mark, 'bar',
                 `Wrong type of plot ${plot.mark}`)
    assert.deepEqual(plot.data.values, fixture.COLORS,
                     `Wrong data in plot`)
    assert.equal(plot.encoding.x.field, 'red',
                 `Wrong X axis`)
    assert.equal(plot.encoding.y.field, 'green',
                 `Wrong Y axis`)
    done()
  })

  it('creates a box plot', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.box('figure_1', 'red', 'green')
    const result = transform.run(env, new DataFrame(fixture.COLORS))
    const plot = env.getPlot('figure_1')
    assert.equal(plot.mark.type, 'boxplot',
                 `Wrong type of plot`)
    assert.deepEqual(plot.data.values, fixture.COLORS,
                     `Wrong data in plot`)
    assert.equal(plot.encoding.x.field, 'red',
                 `Wrong X axis`)
    assert.equal(plot.encoding.y.field, 'green',
                 `Wrong Y axis`)
    done()
  })

  it('creates a dot plot', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.dot('figure_1', 'red')
    const result = transform.run(env, new DataFrame(fixture.COLORS))
    const plot = env.getPlot('figure_1')
    assert.equal(plot.mark.type, 'circle',
                 `Wrong type of plot`)
    assert.deepEqual(plot.data.values, fixture.COLORS,
                     `Wrong data in plot`)
    assert.equal(plot.encoding.x.field, 'red',
                 `Wrong X axis`)
    assert.deepEqual(plot.transform[0].groupby, ['red'],
                     `Wrong transform`)
    done()
  })

  it('creates a histogram', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.histogram('figure_1', 'red', 7)
    const result = transform.run(env, new DataFrame(fixture.COLORS))
    const plot = env.getPlot('figure_1')
    assert.equal(plot.mark, 'bar',
                 `Wrong type of plot`)
    assert.deepEqual(plot.data.values, fixture.COLORS,
                     `Wrong data in plot`)
    assert.equal(plot.encoding.x.field, 'red',
                 `Wrong X axis`)
    assert.equal(plot.encoding.x.bin.maxbins, 7,
                 `Wrong number of bins`)
    done()
  })

  it('creates a scatter plot without a color', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.scatter('figure_1', 'red', 'green', null)
    const result = transform.run(env, new DataFrame(fixture.COLORS))
    const plot = env.getPlot('figure_1')
    assert.deepEqual(plot.data.values, fixture.COLORS,
                     `Wrong data in plot`)
    assert.equal(plot.layer[0].mark.type, 'point',
                 `Wrong type of plot`)
    assert.equal(plot.layer[0].encoding.x.field, 'red',
                 `Wrong X axis`)
    assert.equal(plot.layer[0].encoding.y.field, 'green',
                 `Wrong Y axis`)
    assert(!('color' in plot.layer[0].encoding),
           `Should not have color`)
    done()
  })

  it('creates a scatter plot with a color', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.scatter('figure_1', 'red', 'green', 'blue')
    const result = transform.run(env, new DataFrame(fixture.COLORS))
    const plot = env.getPlot('figure_1')
    assert.deepEqual(plot.data.values, fixture.COLORS,
                     `Wrong data in plot`)
    assert.equal(plot.layer[0].mark.type, 'point',
                 `Wrong type of plot`)
    assert.equal(plot.layer[0].encoding.x.field, 'red',
                 `Wrong X axis`)
    assert.equal(plot.layer[0].encoding.y.field, 'green',
                 `Wrong Y axis`)
    assert.equal(plot.layer[0].encoding.color.field, 'blue',
                 `Wrong color`)
    done()
  })

  it('checks parameters for plots', (done) => {
    for (const [x, y] of [['left', null], [null, 'right'],
                          ['left', ''], ['', 'right'],
                          ['left', 123], [456, 'right']]) {
      assert.throws(() => new Transform.bar(x, y),
                    Error,
                    `Not catching invalid axes for bar plot`)
      assert.throws(() => new Transform.box(x, y),
                    Error,
                    `Not catching invalid axes for bar plot`)
      assert.throws(() => new Transform.scatter(x, y, null),
                    Error,
                    `Not catching invalid axes for scatter plot`)
    }
    for (const color of ['', 123]) {
      assert.throws(() => new Transform.scatter('left', 'right', color),
                    Error,
                    `Not catching invalid color "${color}" for scatter plot`)
    }

    for (const x of [null, '', 789]) {
      assert.throws(() => new Transform.dot(x),
                    Error,
                    `Not catching invalid axis for dot plot`)
    }

    for (const [col, bins] of [[null, 12], ['', 12], [999, 12],
                               ['left', null], ['left', 'right'],
                               ['left', 0], ['left', -1]]) {
      assert.throws(() => new Transform.histogram(col, bins),
                    Error,
                    `Not catching invalid parameters for histogram`)
    }
    done()
  })
})

describe('build statistics', () => {
  it('runs one-sided two-sample t-test', (done) => {
    const env = new Env(INTERFACE)
    const transform = new Transform.ttest_one('result', 'blue', 0.0)
    const result = transform.run(env, new DataFrame(fixture.COLORS))
    const stats = env.getStats('result')
    done()
  })

  it('runs a paired two-sided t-test', (done) => {
    const paired = [
      {left: 'a', right: 1},
      {left: 'a', right: 2},
      {left: 'b', right: 1},
      {left: 'b', right: 2},
      {left: 'b', right: 3}
    ]
    const env = new Env(INTERFACE)
    const transform = new Transform.ttest_two('result', 'left', 'right')
    const result = transform.run(env, new DataFrame(paired))
    const stats = env.getStats('result')
    done()
  })
})

describe('transform equality tests', () => {
  it('compares data loading transforms', (done) => {
    const data_a = new Transform.data('A')
    const data_b = new Transform.data('B')
    assert(data_a.equal(data_a),
           `Same should match`)
    assert(!data_a.equal(data_b),
           `Names should matter`)
    const groupBy = new Transform.groupBy(['left'])
    assert(!data_a.equal(groupBy),
           `Different transforms should not equal`)
    done()
  })

  it('compares drop transforms', (done) => {
    const drop_left = new Transform.drop(['left'])
    const drop_right = new Transform.drop(['right'])
    assert(drop_left.equal(drop_left),
           `Same should equal`)
    assert(!drop_left.equal(drop_right),
           `Different should not equal`)
    const groupBy = new Transform.groupBy(['left'])
    assert(!drop_left.equal(groupBy),
           `Different transforms should not equal`)
    done()
  })

  it('compares filters', (done) => {
    const filter_true = new Transform.filter(new Value.logical(true))
    const filter_false = new Transform.filter(new Value.logical(false))
    assert(filter_true.equal(filter_true),
           `Same should equal`)
    assert(!filter_false.equal(filter_true),
           `Different should not equal`)
    const groupBy = new Transform.groupBy(['left'])
    assert(!filter_true.equal(groupBy),
           `Different transforms should not equal`)
    done()
  })

  it('compares groupBy', (done) => {
    const groupBy_left_right = new Transform.groupBy(['left', 'right'])
    const groupBy_right = new Transform.groupBy(['right'])
    assert(groupBy_left_right.equal(groupBy_left_right),
           `Same should equal`)
    assert(!groupBy_left_right.equal(groupBy_right),
           `Different should not equal`)
    const groupBy_right_left = new Transform.groupBy(['left', 'right'])
    assert(groupBy_right_left.equal(groupBy_left_right),
           `Order should not matter`)
    done()
  })

  it('compares join', (done) => {
    const join_a_b = new Transform.join('a', 'ac', 'b', 'bc')
    const join_a_c = new Transform.join('a', 'ac', 'c', 'cc')
    assert(join_a_b.equal(join_a_b),
           `Same should equal`)
    assert(!join_a_b.equal(join_a_c),
           `Different should not equal`)
    const join_b_a = new Transform.join('b', 'bc', 'a', 'ac')
    assert(!join_a_b.equal(join_b_a),
           `Order should matter`)
    const groupBy = new Transform.groupBy(['left'])
    assert(!join_a_b.equal(groupBy),
           `Different transforms should not equal`)
    done()
  })

  it('compares mutates', (done) => {
    const mutate_true = new Transform.mutate('name', new Value.logical(true))
    const mutate_false = new Transform.mutate('name', new Value.logical(false))
    assert(mutate_true.equal(mutate_true),
           `Same should equal`)
    assert(!mutate_false.equal(mutate_true),
           `Different should not equal`)
    const mutate_true_other = new Transform.mutate('other', new Value.logical(true))
    assert(!mutate_true.equal(mutate_true_other),
           `Names should matter`)
    const groupBy = new Transform.groupBy(['left'])
    assert(!mutate_true.equal(groupBy),
           `Different transforms should not equal`)
    done()
  })

  it('compares report', (done) => {
    const report_a = new Transform.report('a')
    const report_b = new Transform.report('b')
    assert(report_a.equal(report_a),
           `Same should match`)
    assert(!report_a.equal(report_b),
           `Names should matter`)
    const groupBy = new Transform.groupBy(['left'])
    assert(!report_a.equal(groupBy),
           `Different transforms should not equal`)
    done()
  })

  it('compares select transforms', (done) => {
    const select_left = new Transform.select(['left'])
    const select_right = new Transform.select(['right'])
    assert(select_left.equal(select_left),
           `Same should equal`)
    assert(!select_left.equal(select_right),
           `Different should not equal`)
    const groupBy = new Transform.groupBy(['left'])
    assert(!select_left.equal(groupBy),
           `Different transforms should not equal`)
    done()
  })

  it('compares sequence transforms', (done) => {
    const left = new Transform.sequence('left', 3)
    assert(left.equal(new Transform.sequence('left', 3)),
           `Should match`)
    assert(!left.equal(new Transform.sequence('right', 3)),
           `Different names should not match`)
    assert(!left.equal(new Transform.sequence('left', 5)),
           `Different ranges should not match`)
    done()
  })

  it('compares sort transforms', (done) => {
    const sort_left = new Transform.sort(['left'], false)
    const sort_right = new Transform.sort(['right'], true)
    assert(sort_left.equal(sort_left),
           `Same should equal`)
    assert(!sort_left.equal(sort_right),
           `Different should not equal`)
    const select = new Transform.select(['left'])
    assert(!sort_left.equal(select),
           `Different transforms should not equal`)
    done()
  })

  it('compares summarize transforms', (done) => {
    const max_left = new Transform.summarize('maximum', 'left')
    const min_left = new Transform.summarize('minimum', 'left')
    const max_right = new Transform.summarize('maximum', 'right')
    assert(max_left.equal(max_left),
           `Same should equal`)
    assert(!max_left.equal(min_left),
           `Different summarize functions should be unequal`)
    assert(!max_right.equal(max_left),
           `Different summarize columns should be unequal`)
    done()
  })

  it('compares ungrouping transforms', (done) => {
    const u1 = new Transform.ungroup()
    const u2 = new Transform.ungroup()
    assert(u1.equal(u2),
           `All ungroup transforms should be equal`)
    const report = new Transform.report('name')
    assert(!report.equal(u1),
           `Different transforms should not equal`)
    done()
  })

  it('compares unique transforms', (done) => {
    const unique_left = new Transform.unique(['left'])
    const unique_right = new Transform.unique(['right'])
    assert(unique_left.equal(unique_left),
           `Same should equal`)
    assert(!unique_left.equal(unique_right),
           `Different should not equal`)
    const groupBy = new Transform.groupBy(['left'])
    assert(!unique_left.equal(groupBy),
           `Different transforms should not equal`)
    done()
  })
})
