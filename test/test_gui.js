'use strict'

const assert = require('assert')

const Transform = require('../libs/transform')
const Pipeline = require('../libs/pipeline')
const Program = require('../libs/program')

const fixture = require('./fixture')

describe('creates the interface object', () => {
  it('generates JSON in the GUI', (done) => {
    const gui = new fixture.TestInterface()
    const block = gui.workspace.newBlock('data_colors')
    block.hat = 'cap'
    const actual = gui.getJSON()
    const expected = ['@program', ['@pipeline', ['@transform', 'data', 'colors']]]
    assert.deepEqual(actual, expected,
                     `Did not generate JSON correctly`)
    done()
  })

  it('runs a program in the GUI', (done) => {
    const gui = new fixture.TestInterface()
    const block = gui.workspace.newBlock('data_colors')
    block.hat = 'cap'
    gui.runProgram()
    assert.deepEqual(gui.env.log, [['log', 'read colors'], ['log', 'report unnamed 1']],
                     `Program did not run as expected`)
    done()
  })

  it('reports stray blocks', (done) => {
    const gui = new fixture.TestInterface()
    const colors = gui.workspace.newBlock('data_colors')
    colors.hat = 'cap'
    const arg = gui.workspace.newBlock('value_column')
    arg.setFieldValue('keep', 'COLUMN')
    const filter = gui.workspace.newBlock('transform_filter')
    fixture.addSubBlock(filter, 'TEST', arg)
    const code = gui.getJSON()
    const program = ["@program", ["@pipeline", ["@transform", "data", "colors"]]]
    assert.deepEqual(code, program,
                     `Did not generate correct code`)
    gui.runProgram()
    const expected = [['warn', '1 stray stacks found'], ['log', 'read colors'], ['log', 'report unnamed 1']]
    assert.deepEqual(gui.env.log, expected,
                     `Did not get stray count report`)
    done()
  })
})
