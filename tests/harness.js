#!/usr/bin/env node

//
// Testing harness for blocks.
//

const dataForge = require('data-forge')

const assert = require('assert')
const fs = require('fs')
const {parse, NodeType} = require('node-html-parser')

//
// Support class implementing a Blockly theme.
//
class MockTheme {
  constructor (blockStyles, categoryStyles) {
    // FIXME
  }
}

//
// Blockly replacement class for testing purposes.
//
class MockBlockly {
  constructor () {
    this.Blocks = {}

    this.JavaScript = {
      ORDER_NONE: 'OrderNone',
      valueToCode: (block, name, order) => {
        return block[name]
      }
    }

    this.Themes = {}
    this.Theme = MockTheme // so that new Blockly.Theme will work.
  }

  defineBlocksWithJsonArray (jsonArray) {
    jsonArray.forEach(node => {this.Blocks[node.type] = node})
  }

  toString () {
    return `Blocks ${this.Blocks}\nJavaScript ${this.JavaScript}\nThemes ${this.Themes}`
  }

  generate (blockType, ...args) {
    switch (blockType) {
    case 'data_toothGrowth' :
      return this.JavaScript[blockType]({})
      break
    }
  }
}

const Blockly = new MockBlockly()

const Tests = {
  toothGrowth : () => {
    return Blockly.generate('data_toothGrowth')
  }
}

const main = () => {
  parse(fs.readFileSync(0, 'utf-8'))
    .querySelector('#tidyblocks')
    .querySelectorAll('script')
    .map(node => node.attributes.src)
    .map(path => fs.readFileSync(path, 'utf-8'))
    .forEach(src => eval(src))
  console.log(Blockly)

  for (let test of Object.keys(Tests)) {
    const result = Tests[test]()
    console.log(`${test} :: ${result}`)
  }
}

main()
