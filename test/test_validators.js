'use strict'

const assert = require('assert')
const Blockly = require('blockly/blockly_compressed')

const fixture = require('./fixture')

describe('validators', () => {
  it('rejects invalid single column names', (done) => {
    const w = fixture.workspace()
    const block = w.newBlock('value_column')
    const oldValue = block.getFieldValue('COLUMN')
    block.setFieldValue('$$$', 'COLUMN')
    assert.equal(block.getFieldValue('COLUMN'), oldValue,
                 `Validator should have prevented field change`)
    done()
  })

  it('rejects invalid multi-column names', (done) => {
    const w = fixture.workspace()
    const block = w.newBlock('transform_select')
    const oldValue = block.getFieldValue('MULTIPLE_COLUMNS')
    block.setFieldValue('$$$', 'MULTIPLE_COLUMNS')
    assert.equal(block.getFieldValue('MULTIPLE_COLUMNS'), oldValue,
                 `Validator should have prevented field change`)
    done()
  })

  it('rejects invalid dates', (done) => {
    const w = fixture.workspace()
    const block = w.newBlock('value_datetime')
    block.setFieldValue('1970-01-01', 'DATE')
    assert.equal(block.getFieldValue('DATE'), '1970-01-01',
                 `Value not set`)
    block.setFieldValue('abc', 'DATE')
    assert.equal(block.getFieldValue('DATE'), '1970-01-01',
                 `Value should not have changed`)
    done()
  })

  it('accepts valid color fields for scatter plots', (done) => {
    const w = fixture.workspace()
    const block = w.newBlock('plot_scatter')
    block.setFieldValue('figure_1', 'NAME')
    block.setFieldValue('red', 'X_AXIS')
    block.setFieldValue('green', 'Y_AXIS')
    block.setFieldValue('blue', 'COLOR')
    assert.equal(block.getFieldValue('COLOR'), 'blue',
                 `Should accept legal column name`)
    block.setFieldValue(' \t ', 'COLOR')
    assert.equal(block.getFieldValue('COLOR'), '',
                 `Should accept empty spaces for color name`)
    block.setFieldValue('$', 'COLOR')
    assert.equal(block.getFieldValue('COLOR'), '',
                 `Should reject invalid column names for color`)
    done()
  })

  it('requires numbers for exponential distributions', (done) => {
    const w = fixture.workspace()
    const block = w.newBlock('value_exponential')
    const before = block.getFieldValue('RATE')
    block.setFieldValue('$$$', 'RATE')
    const after = block.getFieldValue('RATE')
    assert.equal(before, after, `Value should not have changed`)
    done()
  })
})
