#!/usr/bin/env node
'use strict'

const assert = require('assert')
const fs = require('fs')

const util = require('../libs/util')

const main = () => {
  assert(process.argv.length > 2,
         `Require filenames`)
  for (let infile of process.argv.slice(2)) {
    const data = fs.readFileSync(infile, 'utf-8')
    const table = util.csvToTable(data)
    const outfile = infile.replace('.csv', '.js')
    const name = infile.split('/').pop().replace('.csv', '').toUpperCase()
    fs.writeFileSync(outfile, `export const ${name} = ` + JSON.stringify(table, null, '  '))
  }
}

main()
