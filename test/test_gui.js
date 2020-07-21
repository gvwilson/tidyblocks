'use strict'

const assert = require('assert')
const Blockly = require('blockly/blockly_compressed')

const Transform = require('../libs/transform')
const Pipeline = require('../libs/pipeline')
const Program = require('../libs/program')
const blocks = require('../blocks/blocks')

const {TestInterface} = require('./fixture')

// Define all of our blocks.
blocks.createBlocks()

describe('creates the interface object', () => {
  it('generates JSON in the GUI', (done) => {
    const gui = new TestInterface()
    const block = gui.workspace.newBlock('data_colors')
    block.hat = 'cap'
    const actual = JSON.parse(gui.getJSON())
    const expected = ['@program', ['@pipeline', ['@transform', 'data', 'colors']]]
    assert.deepEqual(actual, expected,
                     `Did not generate JSON correctly`)
    done()
  })

  it('generates a program in the GUI', (done) => {
    const gui = new TestInterface()
    const block = gui.workspace.newBlock('data_colors')
    block.hat = 'cap'
    const actual = gui.getProgram()
    const expected = new Program(new Pipeline(new Transform.data('colors')))
    assert.deepEqual(actual, expected,
                     `Did not generate program correctly`)
    done()
  })

  it('runs a program in the GUI', (done) => {
    const gui = new TestInterface()
    const block = gui.workspace.newBlock('data_colors')
    block.hat = 'cap'
    gui.runProgram()
    assert.deepEqual(gui.env.log, ['read'],
                     `Program did not run as expected`)
    done()
  })
})
