'use strict'

const assert = require('assert')
const Blockly = require('blockly/blockly_compressed')

const Value = require('../libs/value')
const Op = require('../libs/op')
const Transform = require('../libs/transform')
const Pipeline = require('../libs/pipeline')
const Program = require('../libs/program')

const blocks = require('../blocks/blocks')
blocks.createBlocks()

const fixture = require('./fixture')

const workspace = () => {
  Blockly.Events.disable() // to stop it trying to create SVG
  return new Blockly.Workspace({})
}

const connect = (upper, field, lower) => {
    const connection = upper.getInput(field).connection
    connection.connect(lower.outputConnection)
}

const getCode = (block) => {
  const result = Blockly.TidyBlocks.blockToCode(block)
  const json = Array.isArray(result) ? result[0] : result
  return JSON.parse(json)
}

describe('validators', () => {
  it('rejects invalid single column names', (done) => {
    const w = workspace()
    const block = w.newBlock('value_column')
    const oldValue = block.getFieldValue('COLUMN')
    block.setFieldValue('$$$', 'COLUMN')
    assert.equal(block.getFieldValue('COLUMN'), oldValue,
                 `Validator should have prevented field change`)
    done()
  })

  it('rejects invalid multi-column names', (done) => {
    const w = workspace()
    const block = w.newBlock('transform_select')
    const oldValue = block.getFieldValue('MULTIPLE_COLUMNS')
    block.setFieldValue('$$$', 'MULTIPLE_COLUMNS')
    assert.equal(block.getFieldValue('MULTIPLE_COLUMNS'), oldValue,
                 `Validator should have prevented field change`)
    done()
  })

  it('rejects invalid dates', (done) => {
    const w = workspace()
    const block = w.newBlock('value_datetime')
    block.setFieldValue('1970-01-01', 'DATE')
    assert.equal(block.getFieldValue('DATE'), '1970-01-01',
                 `Value not set`)
    block.setFieldValue('abc', 'DATE')
    assert.equal(block.getFieldValue('DATE'), '1970-01-01',
                 `Value should not have changed`)
    done()
  })

  it('requires numbers for exponential distributions', (done) => {
    const w = workspace()
    const block = w.newBlock('value_exponential')
    const before = block.getFieldValue('RATE')
    block.setFieldValue('$$$', 'RATE')
    const after = block.getFieldValue('RATE')
    assert.equal(before, after, `Value should not have changed`)
    done()
  })
})

describe('value code generation', () => {
  it('generates code for absent values', (done) => {
    const expected = [Value.FAMILY, 'absent']
    const w = workspace()
    const block = w.newBlock('value_absent')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for columns', (done) => {
    const expected = [Value.FAMILY, 'column', 'orange']
    const w = workspace()
    const block = w.newBlock('value_column')
    block.setFieldValue('orange', 'COLUMN')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for datetimes', (done) => {
    const expected = [Value.FAMILY, 'datetime', '1970-01-01']
    const w = workspace()
    const block = w.newBlock('value_datetime')
    block.setFieldValue('1970-01-01', 'DATE')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for logicals', (done) => {
    const expected = [Value.FAMILY, 'logical', false]
    const w = workspace()
    const block = w.newBlock('value_logical')
    block.setFieldValue('false', 'VALUE')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for numbers', (done) => {
    const expected = [Value.FAMILY, 'number', 99]
    const w = workspace()
    const block = w.newBlock('value_number')
    block.setFieldValue(99, 'VALUE')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for text', (done) => {
    const expected = [Value.FAMILY, 'text', 'orange']
    const w = workspace()
    const block = w.newBlock('value_text')
    block.setFieldValue('orange', 'VALUE')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for row numbers', (done) => {
    const expected = [Value.FAMILY, 'rownum']
    const w = workspace()
    const block = w.newBlock('value_rownum')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for exponential distributions', (done) => {
    const expected = [Value.FAMILY, 'exponential', 0.5]
    const w = workspace()
    const block = w.newBlock('value_exponential')
    block.setFieldValue(0.5, 'RATE')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for normal distributions', (done) => {
    const expected = [Value.FAMILY, 'normal', 1.2, 3.4]
    const w = workspace()
    const block = w.newBlock('value_normal')
    block.setFieldValue(1.2, 'MEAN')
    block.setFieldValue(3.4, 'STDDEV')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for uniform distributions', (done) => {
    const expected = [Value.FAMILY, 'uniform', 1.2, 3.4]
    const w = workspace()
    const block = w.newBlock('value_uniform')
    block.setFieldValue(1.2, 'LOW')
    block.setFieldValue(3.4, 'HIGH')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })
})

describe('expression code generation', () => {
  it('fills in absent values when generating code', (done) => {
    const expected = [Op.FAMILY, 'not', [Value.FAMILY, 'absent']]
    const w = workspace()
    const block = w.newBlock('op_not')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for binary arithmetic', (done) => {
    const expected = [Op.FAMILY, 'power',
                      [Value.FAMILY, 'number', 1],
                      [Value.FAMILY, 'number', 2]]
    const w = workspace()
    const left = w.newBlock('value_number')
    left.setFieldValue(1, 'VALUE')
    const right = w.newBlock('value_number')
    right.setFieldValue(2, 'VALUE')
    const block = w.newBlock('op_arithmetic')
    block.setFieldValue('power', 'OP')
    connect(block, 'LEFT', left)
    connect(block, 'RIGHT', right)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for arithmetic negation', (done) => {
    const expected = [Op.FAMILY, 'negate', [Value.FAMILY, 'number', 3]]
    const w = workspace()
    const arg = w.newBlock('value_number')
    arg.setFieldValue(3, 'VALUE')
    const block = w.newBlock('op_negate')
    connect(block, 'VALUE', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for comparisons', (done) => {
    const expected = [Op.FAMILY, 'lessEqual',
                      [Value.FAMILY, 'number', 1],
                      [Value.FAMILY, 'number', 2]]
    const w = workspace()
    const left = w.newBlock('value_number')
    left.setFieldValue(1, 'VALUE')
    const right = w.newBlock('value_number')
    right.setFieldValue(2, 'VALUE')
    const block = w.newBlock('op_compare')
    block.setFieldValue('lessEqual', 'OP')
    connect(block, 'LEFT', left)
    connect(block, 'RIGHT', right)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for binary logical operations', (done) => {
    const expected = [Op.FAMILY, 'and',
                      [Value.FAMILY, 'logical', true],
                      [Value.FAMILY, 'logical', false]]
    const w = workspace()
    const left = w.newBlock('value_logical')
    left.setFieldValue('true', 'VALUE')
    const right = w.newBlock('value_logical')
    right.setFieldValue('false', 'VALUE')
    const block = w.newBlock('op_logical')
    block.setFieldValue('and', 'OP')
    connect(block, 'LEFT', left)
    connect(block, 'RIGHT', right)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for logical negation', (done) => {
    const expected = [Op.FAMILY, 'not', [Value.FAMILY, 'logical', false]]
    const w = workspace()
    const arg = w.newBlock('value_logical')
    arg.setFieldValue('false', 'VALUE')
    const block = w.newBlock('op_not')
    connect(block, 'VALUE', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for type checking', (done) => {
    const expected = [Op.FAMILY, 'isLogical', [Value.FAMILY, 'number', 123]]
    const w = workspace()
    const arg = w.newBlock('value_number')
    arg.setFieldValue(123, 'VALUE')
    const block = w.newBlock('op_type')
    block.setFieldValue('isLogical', 'TYPE')
    connect(block, 'VALUE', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for type conversion', (done) => {
    const expected = [Op.FAMILY, 'toLogical', [Value.FAMILY, 'number', 123]]
    const w = workspace()
    const arg = w.newBlock('value_number')
    arg.setFieldValue(123, 'VALUE')
    const block = w.newBlock('op_convert')
    block.setFieldValue('toLogical', 'TYPE')
    connect(block, 'VALUE', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for datetime operations', (done) => {
    const expected = [Op.FAMILY, 'datetime', 'toMonth',
                      [Value.FAMILY, 'datetime', fixture.CONCERT_STR]]
    const w = workspace()
    const arg = w.newBlock('value_datetime')
    arg.setFieldValue(fixture.CONCERT_STR, 'DATE')
    const block = w.newBlock('op_datetime')
    block.setFieldValue('toMonth', 'TYPE')
    connect(block, 'VALUE', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for conditional expressions', (done) => {
    const expected = [Op.FAMILY, 'ifElse',
                      [Value.FAMILY, 'logical', true],
                      [Value.FAMILY, 'text', 'a'],
                      [Value.FAMILY, 'text', 'b']]
    const w = workspace()
    const cond = w.newBlock('value_logical')
    cond.setFieldValue('true', 'VALUE')
    const left = w.newBlock('value_text')
    left.setFieldValue('a', 'VALUE')
    const right = w.newBlock('value_text')
    right.setFieldValue('b', 'VALUE')
    const block = w.newBlock('op_conditional')
    connect(block, 'COND', cond)
    connect(block, 'LEFT', left)
    connect(block, 'RIGHT', right)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })
})

describe('transform code generation', () => {
  it('generates code for loading standard datasets', (done) => {
    for (let name of ['colors', 'earthquakes', 'penguins']) {
      const expected = [Transform.FAMILY, 'data', name]
      const w = workspace()
      const block = w.newBlock(`data_${name}`)
      const actual = getCode(block)
      assert.deepEqual(expected, actual, `Mis-match`)
    }
    done()
  })

  it('generates code for loading user datasets', (done) => {
    const name = 'latest'
    const expected = [Transform.FAMILY, 'data', name]
    const w = workspace()
    const block = w.newBlock(`data_user`)
    block.setFieldValue(name, 'NAME')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for drop', (done) => {
    const expected = [Transform.FAMILY, 'drop', ['left', 'right']]
    const w = workspace()
    const block = w.newBlock('transform_drop')
    block.setFieldValue('left, right', 'MULTIPLE_COLUMNS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for filter', (done) => {
    const expected = [Transform.FAMILY, 'filter',
                      [Value.FAMILY, 'column', 'keep']]
    const w = workspace()
    const arg = w.newBlock('value_column')
    arg.setFieldValue('keep', 'COLUMN')
    const block = w.newBlock('transform_filter')
    connect(block, 'TEST', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for groupBy', (done) => {
    const expected = [Transform.FAMILY, 'groupBy', ['left', 'right']]
    const w = workspace()
    const block = w.newBlock('transform_groupBy')
    block.setFieldValue('left, right', 'MULTIPLE_COLUMNS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for mutate', (done) => {
    const expected = [Transform.FAMILY, 'mutate', 'fresh',
                      [Value.FAMILY, 'logical', true]]
    const w = workspace()
    const arg = w.newBlock('value_logical')
    arg.setFieldValue('true', 'VALUE')
    const block = w.newBlock('transform_mutate')
    block.setFieldValue('fresh', 'COLUMN')
    connect(block, 'VALUE', arg)
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for select', (done) => {
    const expected = [Transform.FAMILY, 'select', ['pink', 'orange']]
    const w = workspace()
    const block = w.newBlock('transform_select')
    block.setFieldValue('pink, orange', 'MULTIPLE_COLUMNS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for sequence', (done) => {
    const expected = [Transform.FAMILY, 'sequence', 'name', 3]
    const w = workspace()
    const block = w.newBlock('data_sequence')
    block.setFieldValue('name', 'COLUMN')
    block.setFieldValue(3, 'VALUE')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for sort', (done) => {
    const expected = [Transform.FAMILY, 'sort', ['pink', 'orange'], false]
    const w = workspace()
    const block = w.newBlock('transform_sort')
    block.setFieldValue('pink, orange', 'MULTIPLE_COLUMNS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for summarize', (done) => {
    const expected = [Transform.FAMILY, 'summarize', 'maximum', 'red']
    const w = workspace()
    const block = w.newBlock('transform_summarize')
    block.setFieldValue('maximum', 'OP')
    block.setFieldValue('red', 'COLUMN')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for ungroup', (done) => {
    const expected = [Transform.FAMILY, 'ungroup']
    const w = workspace()
    const block = w.newBlock('transform_ungroup')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for unique', (done) => {
    const expected = [Transform.FAMILY, 'unique', ['pink', 'orange']]
    const w = workspace()
    const block = w.newBlock('transform_unique')
    block.setFieldValue('pink, orange', 'MULTIPLE_COLUMNS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })
})

describe('plot code generation', () => {
  it('persists a bar plot', (done) => {
    const expected = [Transform.FAMILY, 'bar', 'figure_1', 'red', 'green']
    const w = workspace()
    const block = w.newBlock('plot_bar')
    block.setFieldValue('figure_1', 'NAME')
    block.setFieldValue('red', 'X_AXIS')
    block.setFieldValue('green', 'Y_AXIS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists a box plot', (done) => {
    const expected = [Transform.FAMILY, 'box', 'figure_1', 'red', 'green']
    const w = workspace()
    const block = w.newBlock('plot_box')
    block.setFieldValue('figure_1', 'NAME')
    block.setFieldValue('red', 'X_AXIS')
    block.setFieldValue('green', 'Y_AXIS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists a dot plot', (done) => {
    const expected = [Transform.FAMILY, 'dot', 'figure_1', 'red']
    const w = workspace()
    const block = w.newBlock('plot_dot')
    block.setFieldValue('figure_1', 'NAME')
    block.setFieldValue('red', 'X_AXIS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists a histogram plot', (done) => {
    const expected = [Transform.FAMILY, 'histogram', 'figure_1', 'red', 5]
    const w = workspace()
    const block = w.newBlock('plot_histogram')
    block.setFieldValue('figure_1', 'NAME')
    block.setFieldValue('red', 'COLUMN')
    block.setFieldValue(5, 'BINS')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('persists a scatter plot', (done) => {
    const expected = [Transform.FAMILY, 'scatter', 'figure_1', 'red', 'green', 'blue', false]
    const w = workspace()
    const block = w.newBlock('plot_scatter')
    block.setFieldValue('figure_1', 'NAME')
    block.setFieldValue('red', 'X_AXIS')
    block.setFieldValue('green', 'Y_AXIS')
    block.setFieldValue('blue', 'COLOR')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })
})

describe('stats code generation', () => {
  it('creates one-sample t test from blocks', (done) => {
    const expected = [Transform.FAMILY, 'ttest_one', 'result', 'red', 3.5]
    const w = workspace()
    const block = w.newBlock('stats_ttest_one')
    block.setFieldValue('result', 'NAME')
    block.setFieldValue('red', 'COLUMN')
    block.setFieldValue(3.5, 'MEAN')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('creates two-sample t test from blocks', (done) => {
    const expected = [Transform.FAMILY, 'ttest_two', 'result', 'red', 'green']
    const w = workspace()
    const block = w.newBlock('stats_ttest_two')
    block.setFieldValue('result', 'NAME')
    block.setFieldValue('red', 'LABEL_COLUMN')
    block.setFieldValue('green', 'VALUE_COLUMN')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })
})

describe('combiner code generation', () => {
  it('generates code for glue', (done) => {
    const expected = [Transform.FAMILY, 'glue', 'alpha', 'beta', 'L']
    const w = workspace()
    const block = w.newBlock('combine_glue')
    block.setFieldValue('alpha', 'LEFT_TABLE')
    block.setFieldValue('beta', 'RIGHT_TABLE')
    block.setFieldValue('L', 'COLUMN')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for join', (done) => {
    const expected = [Transform.FAMILY, 'join', 'alpha', 'A', 'beta', 'B']
    const w = workspace()
    const block = w.newBlock('combine_join')
    block.setFieldValue('alpha', 'LEFT_TABLE')
    block.setFieldValue('A', 'LEFT_COLUMN')
    block.setFieldValue('beta', 'RIGHT_TABLE')
    block.setFieldValue('B', 'RIGHT_COLUMN')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })

  it('generates code for report', (done) => {
    const expected = [Transform.FAMILY, 'report', 'stuff']
    const w = workspace()
    const block = w.newBlock('transform_report')
    block.setFieldValue('stuff', 'NAME')
    const actual = getCode(block)
    assert.deepEqual(expected, actual, `Mis-match`)
    done()
  })
})

describe('program code generation', () => {
  it('generates code for a program', (done) => {
    const expected = [Program.FAMILY,
                      [Pipeline.FAMILY,
                       [Transform.FAMILY, 'data', 'colors'],
                       [Transform.FAMILY, 'filter', [Value.FAMILY, 'column', 'keep']]]]
    const w = workspace()
    const colors = w.newBlock('data_colors')
    colors.hat = 'cap'
    const arg = w.newBlock('value_column')
    arg.setFieldValue('keep', 'COLUMN')
    const filter = w.newBlock('transform_filter')
    connect(filter, 'TEST', arg)
    colors.nextConnection.connect(filter.previousConnection)
    const actual = JSON.parse(Blockly.TidyBlocks.workspaceToCode(w))
    assert.deepEqual(actual, expected, `Mis-match`)
    done()
  })
})
