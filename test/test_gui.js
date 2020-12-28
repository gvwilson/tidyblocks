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
                     'Did not generate JSON correctly')
    done()
  })

  it('runs a program in the GUI', (done) => {
    const gui = new fixture.TestInterface()
    const block = gui.workspace.newBlock('control_name')
    block.setFieldValue('title', 'NAME')
    block.hat = 'cap'
    gui.runProgram()
    const expected = [
      ['log', 'name title']
    ]
    assert.deepEqual(gui.env.log, expected,
                     'Program did not run as expected')
    done()
  })

  it('does not generate code for uncapped pipelines', (done) => {
    const gui = new fixture.TestInterface()
    const name = gui.workspace.newBlock('control_name')
    name.setFieldValue('title', 'NAME')
    name.hat = 'cap'
    gui.workspace.newBlock('data_colors') // should be no code
    const code = gui.getJSON()
    const program = ['@program', ['@pipeline', ['@transform', 'name', 'title']]]
    assert.deepEqual(code, program,
                     'Did not generate correct code')
    gui.runProgram()
    const expected = [
      ['warn', '1 stray stacks found'],
      ['log', 'name title']
    ]
    assert.deepEqual(gui.env.log, expected,
                     'Did not get stray count report')
    done()
  })
})
