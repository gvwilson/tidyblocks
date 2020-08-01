'use strict'

const assert = require('assert')

const util = require('../libs/util')

// Compare a list of strings to a table of objects.
const csvTest = (lines, expected, message) => {
  const joined = lines.join('\n')
  const actual = util.csvToTable(joined)
  assert.deepEqual(expected, actual, message)
}

describe('basic functionality', () => {
  it('can run a single test', (done) => {
    assert(true)
    done()
  })

  it('throws errors when it is supposed to', (done) => {
    const msg = 'test message'
    try {
      util.check(false, msg)
    }
    catch (err) {
      assert(err.message.includes(msg),
             `Error does not include "${msg}"`)
    }
    done()
  })

  it('checks that only numbers and util.MISSING are numbers', (done) => {
    util.checkNumber(123)
    util.checkNumber(util.MISSING)
    assert.throws(() => util.checkNumber('abc'),
                  Error,
                  `Expected an Error for string`)
    assert.throws(() => util.checkNumber([]),
                  Error,
                  `Expected an Error for empty list`)
    done()
  })

  it('checks that objects are correctly equal', (done) => {
    assert(util.equal(util.MISSING, util.MISSING),
           `Expected missing to be equal to missing`)
    done()
  })

  it('checks that types are util.MISSING or equal', (done) => {
    const firstDate = new Date('1983-12-02')
    util.checkTypeEqual(1, 2)
    util.checkTypeEqual('a', 'b')
    util.checkTypeEqual(util.MISSING, util.MISSING)
    util.checkTypeEqual(firstDate, new Date())
    util.checkTypeEqual(util.MISSING, 'a')
    util.checkTypeEqual(1, util.MISSING)
    util.checkTypeEqual(firstDate, util.MISSING)
    assert.throws(() => util.checkTypeEqual(1, 'a'),
                  Error,
                  `Expected an Error for number and string`)
    assert.throws(() => util.checkTypeEqual(firstDate, 'a'),
                  Error,
                  `Expected an Error for date and string`)
    assert.throws(() => util.checkTypeEqual(firstDate, 1),
                  Error,
                  `Expected an Error for date and number`)
    assert.throws(() => util.checkTypeEqual(1, {}),
                  Error,
                  `Expected an Error for number and object`)
    assert.throws(() => util.checkTypeEqual('a', {}),
                  Error,
                  `Expected an Error for string and object`)
    done()
  })
})

describe('converts text to CSV', () => {
  it('returns no rows for empty text', (done) => {
    csvTest([''], [], `Expected no rows`)
    done()
  })

  it('returns no rows for all whitespace', (done) => {
    csvTest(['   ', '\t', '\n'], [], `Expected no rows`)
    done()
  })

  it('handles a header row on its own', (done) => {
    csvTest(['header'], [], `Expected just a header`)
    done()
  })

  it('handles a single row with a single column', (done) => {
    csvTest(['header', 'value'], [{header: 'value'}],
            `Expected one row`)
    done()
  })

  it('handles multiple rows with a single column', (done) => {
    csvTest(['header', '1', '2', '3'],
            [{header: 1}, {header: 2}, {header: 3}],
            `Expected three rows`)
    done()
  })

  it('handles a single row with multiple columns', (done) => {
    csvTest(['left,middle,right', '"10","20",thirty'],
            [{left: "10", middle: "20", right: "thirty"}],
            `Expected one row`)
    done()
  })

  it('handles multiple rows and columns', (done) => {
    csvTest(['left,right', '"10",20', 'thirty,40'],
            [{left: "10", right: 20},
             {left: "thirty", right: 40}],
            `Expected two rows and two columns`)
    done()
  })

  it('replaces spaces and invalid characters in headers', (done) => {
    csvTest(['  spaces\t,&abc!', 'true,false'],
            [{spaces: true, abc: false}],
            `Expected cleaned headers`)
    done()
  })

  it('fills in empty headers', (done) => {
    csvTest([',  ,', 'a, b ,c'],
            [{EMPTY: 'a', EMPTY_1: ' b ', EMPTY_2: 'c'}],
            `Expected empty header replacement and serial numbering`)
    done()
  })

  it('ensures header names start with an underscore or letter', (done) => {
    csvTest(['123,1abc', 'yes,no'],
            [{_123: 'yes', _1abc: 'no'}],
            `Expected leading underscores`)
    done()
  })

  it('ensures unique header names', (done) => {
    csvTest(['name,name,name', 'a,b,c'],
            [{name: 'a', name_1: 'b', name_2: 'c'}])
    done()
  })

  it('handles NA', (done) => {
    csvTest(['header','a','NA','b'],
            [{header: 'a'}, {header: util.MISSING}, {header: 'b'}],
            `Expected missing value for NA`)
    done()
  })
})
