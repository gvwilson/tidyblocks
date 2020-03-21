'use strict'

const assert = require('assert')

const util = require('../libs/util')
const MISSING = util.MISSING
const {Expr} = require('../libs/expr')
const {Summarize} = require('../libs/summarize')
const {DataFrame} = require('../libs/dataframe')

const ZeroRows = []
const OneRow = [{ones: 1, tens: 10}]
const OneRowBig = [{ones: 9, tens: 90}]
const TwoRows = [{ones: 1, tens: 10},
                 {ones: 2, tens: 20}]
const ThreeRows = [{ones: 1, tens: 10},
                   {ones: 2, tens: 20},
                   {ones: 3, tens: 30}]
const {
  Colors,
  GroupRedCountRed,
  GroupRedMaxGreen,
  GroupRedMaxRed
} = require('./fixture')

describe('dataframe construction', () => {
  it('will not create a dataframe from invalid values', (done) => {
    assert.throws(() => new DataFrame(null),
                  Error,
                  `Should not be able to create dataframe from null`)
    assert.throws(() => new DataFrame('a,b,c'),
                  Error,
                  `Should not be able to create dataframe from string`)
    assert.throws(() => new DataFrame(new DataFrame([])),
                  Error,
                  `Should not be able to create dataframe from dataframe`)
    done()
  })

  it('can create an empty dataframe', (done) => {
    const df = new DataFrame([])
    assert.equal(df.data.length, 0,
                 `Expected no rows`)
    assert.equal(df.columns.size, 0,
                 `Expected no columns`)
    done()
  })

  it('can create a dataframe with one row', (done) => {
    const df = new DataFrame(OneRow)
    assert.deepEqual(df.data, OneRow,
                     `Wrong value(s) in row`)
    assert(df.hasColumns(['ones', 'tens']),
           `Wrong value(s) in column names`)
    done()
  })

  it('can create a dataframe with multiple rows', (done) => {
    const df = new DataFrame(ThreeRows)
    assert.deepEqual(df.data, ThreeRows,
                     `Wrong value(s) in row`)
    assert(df.hasColumns(['ones', 'tens'], true),
           `Wrong value(s) in column names`)
    done()
  })

  it('complains about mis-matched column names', (done) => {
    assert.throws(() => new DataFrame([{ones: 1}, {tens: 2}]),
                  Error,
                  `Expected error with mis-matched column names`)
    assert.throws(() => new DataFrame([{ones: 1, tens: 10},
                                       {tens: 10}]),
                  Error,
                  `Expected error with missing column names`)
    done()
  })

  it('creates an empty dataframe with pre-existing columns', (done) => {
    const columns = new Set(['first', 'second'])
    const df = new DataFrame([], columns)
    assert.equal(df.data.length, 0,
                 `Should not be rows in empty dataframe`)
    assert.deepEqual(df.columns, columns,
                     `Wrong column name(s) in result`)
    done()
  })

  it('complains about illegal column names', (done) => {
    assert.throws(() => new DataFrame([{'': 1}]),
                  Error,
                  `Expected error with empty column name`)
    assert.throws(() => new DataFrame([{'_underscore': 1}]),
                  Error,
                  `Expected error with leading underscore in column name`)
    assert.throws(() => new DataFrame([{'1one': 1}]),
                  Error,
                  `Expected error with leading digit in column name`)
    assert.throws(() => new DataFrame([{' a b ': 1}]),
                  Error,
                  `Expected error with spaces in column name`)
    done()
  })
})

describe('dataframe equality', () => {
  it('only checks dataframes', (done) => {
    const df = new DataFrame(TwoRows)
    assert.throws(() => df.equal(new Date()),
                  Error,
                  `Must check against dataframes`)
    done()
  })

  it('thinks completely empty dataframes are equal', (done) => {
    const left = new DataFrame([])
    const right = new DataFrame([])
    assert(left.equal(right),
           `Expected empty dataframes to be equal`)
    done()
  })

  it('thinks empty dataframes with matching columns are equal', (done) => {
    const left = new DataFrame([], ['red', 'green'])
    const right = new DataFrame([], ['red', 'green'])
    assert(left.equal(right),
           `Expected empty with matching columns to be equal`)
    done()
  })

  it('thinks empty dataframes with mis-matched columns are equal', (done) => {
    const left = new DataFrame([], ['red', 'green'])
    const right = new DataFrame([], ['red', 'blue'])
    assert(!left.equal(right),
           `Expected empty with mis-matched columns to be unequal`)
    done()
  })

  it('thinks dataframes with different columns are unequal', (done) => {
    const left = new DataFrame([{first: 1}])
    const right = new DataFrame([{first: 1, second: 2}])
    assert(!left.equal(right),
           `Should think extra column makes dataframes unequal`)
    assert(!right.equal(left),
           `Should think extra column makes dataframes unequal`)
    done()
  })

  it('thinks frames with the same columns and rows are equal', (done) => {
    const left = new DataFrame(ThreeRows)
    const right = new DataFrame(ThreeRows)
    assert(left.equal(right),
           `Expected equal frames to be equal`)
    done()
  })

  it('thinks frames with different numbers of rows are unequal', (done) => {
    const left = new DataFrame([{first: 1}])
    const right = new DataFrame([{first: 1},
                                 {first: 1}])
    assert(!left.equal(right),
           `Expected extra rows to be unequal`)
    assert(!right.equal(left),
           `Expected extra rows to be unequal`)
    done()
  })

  it('thinks frames with reversed rows are equal', (done) => {
    const left = new DataFrame(ThreeRows)
    const right = new DataFrame(ThreeRows.slice().reverse())
    assert(left.equal(right),
           `Expected frames to be equal despite reordering`)
    done()
  })

  it ('thinks frames with mis-matched values are unequal', (done) => {
    const left = new DataFrame(ThreeRows)
    const right = new DataFrame(ThreeRows.slice())
    right.data[0] = {...right.data[0], ones: -1}
    assert(!left.equal(right),
           `Expected frames with unequal values to be unequal`)
    done()
  })

  it ('handles out-of-order columns', (done) => {
    const left = new DataFrame([{ones: 1, tens: 10},
                                {tens: 20, ones: 2}])
    const right = new DataFrame([{ones: 1, tens: 10},
                                 {tens: 10, ones: 1}])
    assert(!left.equal(right),
           `Unequal values should be unequal`)
    assert(!right.equal(left),
           `Unequal values should be unequal`)
    done()
  })
})

describe('check columns', () => {
  it('checks column subsets', (done) => {
    const df = new DataFrame(TwoRows)
    assert(df.hasColumns(['ones']),
           `Expected to find some columns`)
    assert(df.hasColumns(['ones', 'tens']),
           `Expected to find all columns`)
    done()
  })

  it('fails when checking for missing columns', (done) => {
    const df = new DataFrame(TwoRows)
    assert(!df.hasColumns(['nope']),
           `Should not find nonexistent column`)
    done()
  })

  it('fails when looking for subset but required to match all', (done) => {
    const df = new DataFrame(TwoRows)
    assert(!df.hasColumns(['ones'], true),
           `Should fail to match subset of columns when expected to match all`)
    done()
  })

  it('fails when looking for a mix of columns', (done) => {
    const df = new DataFrame(TwoRows)
    assert(!df.hasColumns(['ones', 'nope']),
           `Should fail to match mix of present and missing columns`)
    done()
  })
})

describe('drop and select', () => {
  it('drops columns, leaving columns', (done) => {
    const df = new DataFrame(TwoRows)
    const result = df.drop(['ones'])
    assert(result.equal(new DataFrame([{tens: 10}, {tens: 20}])),
           `Wrong values survived dropping`)
    done()
  })

  it('drops all columns', (done) => {
    const df = new DataFrame(TwoRows)
    const result = df.drop(['ones', 'tens'])
    assert.equal(result.data.length, 0,
                 `Nothing should survive dropping all columns`)
    assert(result.hasColumns([], true),
           `No columns should survive dropping all columns`)
    done()
  })

  it('drops no columns', (done) => {
    const df = new DataFrame(TwoRows)
    const result = df.drop([])
    assert.deepEqual(result.data, TwoRows,
                     `All rows should survive dropping no columns`)
    assert(result.hasColumns(['ones', 'tens'], true),
           `All columns should survive dropping no columns`)
    done()
  })

  it('selects columns, leaving columns', (done) => {
    const df = new DataFrame(TwoRows)
    const result = df.select(['ones'])
    assert(result.equal(new DataFrame([{ones: 1}, {ones: 2}])),
           `Wrong values survived selecting`)
    done()
  })

  it('selects all columns', (done) => {
    const df = new DataFrame(TwoRows)
    const result = df.select(['tens', 'ones'])
    assert(result.equal(new DataFrame(TwoRows.slice())),
           `Something failed to survive selecting all`)
    assert(result.hasColumns(['tens', 'ones'], true),
           `Wrong columns survived selecting all`)
    done()
  })

  it('checks column names when dropping', (done) => {
    const df = new DataFrame(TwoRows)
    assert.throws(() => df.drop(['nope']),
                  Error,
                  `Expected error when dropping non-existent column`)
    done()
  })

  it('checks column names when selecting', (done) => {
    const df = new DataFrame(TwoRows)
    assert.throws(() => df.select(['nope']),
                  Error,
                  `Expected error when selecting non-existent column`)
    done()
  })
})

describe('filter', () => {
  it('keeps all rows', (done) => {
    const expr = new Expr.logical(true)
    const df = new DataFrame(TwoRows)
    const result = df.filter(expr)
    assert(result.equal(new DataFrame(TwoRows.slice())),
           `Should keep all rows when keeping all rows`)
    done()
  })

  it('discards all rows', (done) => {
    const expr = new Expr.logical(false)
    const df = new DataFrame(TwoRows)
    const result = df.filter(expr)
    assert(result.equal(new DataFrame([], ['ones', 'tens'])),
           `Should have no rows when discarding all`)
    done()
  })

  it('discards some rows', (done) => {
    const expr = new Expr.lessEqual(new Expr.column('tens'),
                                    new Expr.number(20))
    const df = new DataFrame(ThreeRows)
    const result = df.filter(expr)
    assert(result.equal(new DataFrame(TwoRows.slice())),
           `Should have two rows when filtering some`)
    assert(result.hasColumns(['ones', 'tens'], true),
           `Should not change columns when filtering some`)
    done()
  })
})

describe('group and ungroup', () => {
  it('refuses to group with illegal parameters', (done) => {
    const df = new DataFrame(TwoRows)
    assert.throws(() => df.groupBy([]),
                  Error,
                  'should not be able to group by no columns')
    assert.throws(() => df.groupBy(['nope']),
                  Error,
                  'should not be able to group by nonexistent column')
    assert.throws(() => df.groupBy(['ones', 'ones']),
                  Error,
                  'should not be able to group by duplicate columns')
    done()
  })

  it('creates one group for each row when values are unique', (done) => {
    const df = new DataFrame(TwoRows)
    const result = df.groupBy(['ones'])
    assert(result.equal(new DataFrame([{ones: 1, tens: 10, '_group_': 1},
                                       {ones: 2, tens: 20, '_group_': 2}])),
           `Wrong group column values`)
    done()
  })

  it('creates one group when all rows have the same value', (done) => {
    const original = [{ones: 1, tens: 10},
                      {ones: 1, tens: 20}]
    const df = new DataFrame(original)
    const result = df.groupBy(['ones'])
    assert(result.equal(new DataFrame([{ones: 1, tens: 10, '_group_': 1},
                                       {ones: 1, tens: 20, '_group_': 1}])),
           `Wrong group column values`)
    done()
  })

  it('creates multiple groups when rows have a mix of values', (done) => {
    const original = [{ones: 1, tens: 10},
                      {ones: 2, tens: 20},
                      {ones: 1, tens: 30}]
    const df = new DataFrame(original)
    const result = df.groupBy(['ones'])
    assert(result.equal(new DataFrame([{ones: 1, tens: 10, '_group_': 1},
                                       {ones: 2, tens: 20, '_group_': 2},
                                       {ones: 1, tens: 30, '_group_': 1}])),
           `Wrong group column values`)
    done()
  })

  it('groups by multiple values', (done) => {
    const original = [{ones: 1, tens: 10},
                      {ones: 2, tens: 20},
                      {ones: 1, tens: 30}]
    const df = new DataFrame(original)
    const result = df.groupBy(['ones', 'tens'])
    assert(result.equal(new DataFrame([{ones: 1, tens: 10, '_group_': 1},
                                       {ones: 2, tens: 20, '_group_': 2},
                                       {ones: 1, tens: 30, '_group_': 3}])),
            `Wrong group column values`)
    done()
  })

  it('refuses to ungroup data that is not grouped', (done) => {
    const df = new DataFrame(ThreeRows)
    assert.throws(()=> df.ungroup(),
                  Error,
                  `Should not be able to ungroup data that is not grouped`)
    done()
  })

  it('removes the grouping column from grouped data', (done) => {
    const data = ThreeRows.map(row => ({...row}))
    data.forEach(row => {
      row[DataFrame.GROUPCOL] = 1
    })
    const df = new DataFrame(data, null)
    const result = df.ungroup()
    assert(result.data.every(row => !(DataFrame.GROUPCOL in row)),
           `Group column should not be in data`)
    assert(!result.hasColumns([DataFrame.GROUPCOL]),
           `Expected grouping column to be removed`)
    done()
  })
})

describe('mutate', () => {
  it('requires a new column name', (done) => {
    const df = new DataFrame(TwoRows)
    const expr = new Expr.number(99)
    assert.throws(() => df.mutate('', expr),
                  Error,
                  `Expected error with empty new column name`)
    done()
  })

  it('only allows legal column names', (done) => {
    const df = new DataFrame(TwoRows)
    const expr = new Expr.number(99)
    assert.throws(() => df.mutate(' with spaces ', expr),
                  Error,
                  `Expected error with illegal column name`)
    done()
  })

  it('mutates an empty dataframe', (done) => {
    const df = new DataFrame([])
    const expr = new Expr.number(99)
    const result = df.mutate('col', expr)
    assert.deepEqual(result.data, [],
                     `Expected empty dataframe`)
    done()
  })

  it('creates an entirely new column', (done) => {
    const df = new DataFrame(TwoRows)
    const expr = new Expr.number(99)
    const result = df.mutate('col', expr)
    assert(result.equal(new DataFrame([{ones: 1, tens: 10, col: 99},
                                       {ones: 2, tens: 20, col: 99}])),
           `Wrong result for mutate`)
    done()
  })

  it('replaces an existing column', (done) => {
    const df = new DataFrame(TwoRows)
    const expr = new Expr.number(99)
    const result = df.mutate('ones', expr)
    assert(result.equal(new DataFrame([{ones: 99, tens: 10},
                                       {ones: 99, tens: 20}])),
           `Wrong result for mutate`)
    done()
  })
})

describe('sort', () => {
  it('requires a sorting column name', (done) => {
    const df = new DataFrame(TwoRows)
    assert.throws(() => df.sort([]),
                  Error,
                  `Expected error when sorting without column names`)
    done()
  })

  it('requires known column names', (done) => {
    const df = new DataFrame(TwoRows)
    assert.throws(() => df.sort(['nope']),
                  Error,
                  `Expected error when sorting with missing column names`)
    done()
  })

  it('sorts an empty dataframe', (done) => {
    const df = new DataFrame([], ['ones'])
    const result = df.sort(['ones'])
    assert.deepEqual(result.data, [],
                     `Expected empty dataframe`)
    done()
  })

  it('sorts by a single key', (done) => {
    const data = TwoRows.slice().reverse()
    const df = new DataFrame(data)
    const result = df.sort(['ones'])
    assert.deepEqual(result.data, TwoRows,
                     `Wrong result for sorting with a single key`)
    done()
  })

  it('sorts by a single key in reverse order', (done) => {
    const df = new DataFrame(TwoRows)
    const result = df.sort(['ones'], true)
    const expected = TwoRows.slice().reverse()
    assert.deepEqual(result.data, expected,
                     `Wrong result for sorting in reverse`)
    done()
  })

  it('sorts by multiple keys', (done) => {
    const input = [{first: 'a', second: 'Q'},
                   {first: 'b', second: 'R'},
                   {first: 'b', second: 'Q'},
                   {first: 'a', second: 'R'}]
    const df = new DataFrame(input)
    const result = df.sort(['second', 'first'])
    const expected = [{first: 'a', second: 'Q'},
                      {first: 'b', second: 'Q'},
                      {first: 'a', second: 'R'},
                      {first: 'b', second: 'R'}]
    assert.deepEqual(result.data, expected,
                     `Wrong result for sorting with two keys`)
    done()
  })

  it('sorts with missing data', (done) => {
    const input = [{first: 'a', second: 'Q'},
                   {first: MISSING, second: 'Q'},
                   {first: 'a', second: MISSING},
                   {first: MISSING, second: MISSING}]
    const df = new DataFrame(input)
    const result = df.sort(['first', 'second'])
    const expected = [
      { first: MISSING, second: MISSING },
      { first: MISSING, second: 'Q' },
      { first: 'a', second: MISSING },
      { first: 'a', second: 'Q' }
    ]
    assert.deepEqual(result.data, expected,
                     `Wrong result for sorting with missing data`)
    done()
  })
})

describe('summarize', () => {
  it('requires a summarizer', (done) => {
    const df = new DataFrame(TwoRows)
    assert.throws(() => df.summarize(null),
                  Error,
                 `Require a summarizer`)
    assert.throws(() => df.summarize(new Date()),
                  Error,
                 `Require a summarizer`)
    done()
  })

  it('requires non-empty column names', (done) => {
    assert.throws(() => new Summarize.count(''),
                  Error,
                  `Expected error with empty column name`)
    done()
  })

  it('require columns to exist', (done) => {
    const df = new DataFrame(TwoRows)
    assert.throws(() => df.summarize(new Summarize.count('nope')),
                  Error,
                  `Expected error with nonexistent column name`)
    done()
  })

  it('can summarize a single ungrouped column', (done) => {
    const df = new DataFrame(TwoRows)
    const result = df.summarize(new Summarize.count('ones'))
    assert(result.equal(new DataFrame([{ones: 1, tens: 10,
                                        ones_count: 2},
                                       {ones: 2, tens: 20,
                                        ones_count: 2}])),
           `Wrong result`)
    done()
  })

  it('can summarize multiple ungrouped columns', (done) => {
    const df = new DataFrame(TwoRows)
    const result = df
          .summarize(new Summarize.count('ones'))
          .summarize(new Summarize.maximum('tens'))
    assert(result.equal(new DataFrame([{ones: 1, tens: 10,
                                        ones_count: 2, tens_maximum: 20},
                                       {ones: 2, tens: 20,
                                        ones_count: 2, tens_maximum: 20}])),
           `Wrong result`)
    done()
  })

  it('can summarize the same ungrouped column multiple times', (done) => {
    const df = new DataFrame(TwoRows)
    const result = df
          .summarize(new Summarize.minimum('tens'))
          .summarize(new Summarize.maximum('tens'))
    assert(result.equal(new DataFrame([{ones: 1, tens: 10,
                                        tens_minimum: 10, tens_maximum: 20},
                                       {ones: 2, tens: 20,
                                        tens_minimum: 10, tens_maximum: 20}])),
           `Wrong result`)
    done()
  })

  it('can summarize a single grouped column', (done) => {
    const df = new DataFrame(Colors).groupBy(['red'])
    const result = df.summarize(new Summarize.count('red'))
    assert(
      result.data.every(row => (row.red_count === GroupRedCountRed.get(row.red))),
      `Wrong count(s) for grouped values`)
    done()
  })

  it('can summarize multiple grouped columns', (done) => {
    const df = new DataFrame(Colors).groupBy(['red'])
    const result = df
          .summarize(new Summarize.count('red'))
          .summarize(new Summarize.maximum('green'))
    assert(
      result.data.every(row => (row.red_count === GroupRedCountRed.get(row.red))),
      `Wrong count(s) for grouped values`)
    assert(
      result.data.every(row => (row.green_maximum === GroupRedMaxGreen.get(row.red))),
      `Wrong maximum(s) for grouped values`)
    done()
  })

  it('can summarize the same grouped column multiple times', (done) => {
    const df = new DataFrame(Colors).groupBy(['red'])
    const result = df
          .summarize(new Summarize.count('red'))
          .summarize(new Summarize.maximum('red'))
    assert(
      result.data.every(row => (row.red_count === GroupRedCountRed.get(row.red))),
      `Wrong count(s) for grouped values`)
    assert(
      result.data.every(row => (row.red_maximum === GroupRedMaxRed.get(row.red))),
      `Wrong maximum(s) for grouped values`)
    done()
  })
})

describe('unique', () => {
  it('requires column names for uniqueness test', (done) => {
    const df = new DataFrame(TwoRows)
    assert.throws(() => df.unique([]),
                  Error,
                  `Expected error when no column names provided`)
    done()
  })

  it('requires existing column names for uniqueness test', (done) => {
    const df = new DataFrame(TwoRows)
    assert.throws(() => df.unique(['nope']),
                  Error,
                  `Expected error when nonexistent column names provided`)
    done()
  })

  it('handles empty dataframes', (done) => {
    const df = new DataFrame([], ['ones'])
    const result = df.unique(['ones'])
    assert.deepEqual(result.data, [],
                     `Expected empty dataframe`)
    done()
  })

  it('keeps all rows when all rows are unique', (done) => {
    const df = new DataFrame(TwoRows)
    const result = df.unique(['ones'])
    assert(result.equal(new DataFrame(TwoRows.slice())),
           `Expected all rows to be kept`)
    done()
  })

  it('discards rows when there are duplicates', (done) => {
    const data = TwoRows.concat(TwoRows)
    const df = new DataFrame(data)
    const result = df.unique(['ones'])
    assert(result.equal(new DataFrame(TwoRows.slice())),
           `Expected duplicates to be removed`)
    done()
  })

  it('handles multiple keys', (done) => {
    const original = [{ones: 1, tens: 10, hundreds: 100},
                      {ones: 1, tens: 10, hundreds: 200},
                      {ones: 2, tens: 10, hundreds: 100}]
    const df = new DataFrame(original)
    const result = df.unique(['ones', 'tens'])
    assert.equal(result.data.length, 2,
                 `Wrong number of rows survived`)
    done()
  })
})

describe('join', () => {
  it('requires a valid name for the left table', (done) => {
    const left = new DataFrame(OneRow)
    const right = new DataFrame(TwoRows)
    assert.throws(() => left.join('1number', 'ones', right, 'right', 'ones'),
                  Error,
                  `Should not be able to use invalid left table name`)
    done()
  })

  it('requires a valid name for the left column', (done) => {
    const left = new DataFrame(OneRow)
    const right = new DataFrame(TwoRows)
    assert.throws(() => left.join('left', 'nope', right, 'right', 'ones'),
                  Error,
                  `Should not be able to use missing left column name`)
    done()
  })

  it('requires a valid dataframe for the right table', (done) => {
    const left = new DataFrame(OneRow)
    const right = new Date()
    assert.throws(() => left.join('left', 'ones', right, 'right', 'ones'),
                  Error,
                  `Should not be able to join with non-table`)
    done()
  })

  it('requires a valid name for the right table', (done) => {
    const left = new DataFrame(OneRow)
    const right = new DataFrame(TwoRows)
    assert.throws(() => left.join('left', 'ones', right, '[!3', 'ones'),
                  Error,
                  `Should not be able to use invalid right table name`)
    done()
  })

  it('requires a valid name for the right column', (done) => {
    const left = new DataFrame(OneRow)
    const right = new DataFrame(TwoRows)
    assert.throws(() => left.join('left', 'ones', right, 'right', '   '),
                  Error,
                  `Should not be able to us invalid right column name`)
    done()
  })

  it('handles an empty table on the left', (done) => {
    const left = new DataFrame(ZeroRows, ['ones', 'tens'])
    const right = new DataFrame(OneRow)
    const result = left.join('left', 'ones', right, 'right', 'ones')
    assert.deepEqual(result.data, [],
                     `Expected empty data`)
    const expectedColumns = new Set([DataFrame.JOINCOL, 'left_tens', 'right_tens'])
    assert.deepEqual(result.columns, expectedColumns,
                     `Expected to retain columns`)
    done()
  })

  it('handles an empty table on the right', (done) => {
    const left = new DataFrame(OneRow)
    const right = new DataFrame(ZeroRows, ['ones', 'tens'])
    const result = left.join('left', 'ones', right, 'right', 'ones')
    assert.deepEqual(result.data, [],
                     `Expected empty data`)
    const expectedColumns = new Set([DataFrame.JOINCOL, 'left_tens', 'right_tens'])
    assert.deepEqual(result.columns, expectedColumns,
                     `Expected to retain columns`)
    done()
  })

  it('produces an empty table when there is no overlap', (done) => {
    const left = new DataFrame(OneRow)
    const right = new DataFrame(OneRowBig)
    const result = left.join('left', 'tens', right, 'right', 'tens')
    assert.deepEqual(result.data, [],
                     `Expected empty data`)
    const expectedColumns = new Set([DataFrame.JOINCOL, 'right_ones', 'left_ones'])
    assert.deepEqual(result.columns, expectedColumns,
                     `Expected to retain columns`)
    done()
  })

  it('produces single joined rows', (done) => {
    const left = new DataFrame(OneRow)
    const right = new DataFrame(ThreeRows)
    const result = left.join('left', 'ones', right, 'right', 'ones')
    assert(result.equal(new DataFrame([{_join_: 1, left_tens: 10, right_tens: 10}])),
           `Wrong resulting data`)
    done()
  })

  it('produces multiple joined rows', (done) => {
    const left = new DataFrame(TwoRows)
    const right = new DataFrame(TwoRows)
    const result = left.join('left', 'tens', right, 'right', 'tens')
    const expected = [
      {_join_: 10, left_ones: 1, right_ones: 1},
      {_join_: 20, left_ones: 2, right_ones: 2}
    ]
    assert(result.equal(new DataFrame(expected)),
           `Wrong resulting data`)
    done()
  })

  it('does many-to-many matches', (done) => {
    const left = new DataFrame(TwoRows)
    const right = new DataFrame([
      {ones: 1, hundreds: 100},
      {ones: 1, hundreds: 200},
      {ones: 1, hundreds: 300},
      {ones: 2, hundreds: 400},
      {ones: 2, hundreds: 500}
    ])
    const result = left.join('left', 'ones', right, 'right', 'ones')
    const expected = [
      {_join_: 1, left_tens: 10, right_hundreds: 100},
      {_join_: 1, left_tens: 10, right_hundreds: 200},
      {_join_: 1, left_tens: 10, right_hundreds: 300},
      {_join_: 2, left_tens: 20, right_hundreds: 400},
      {_join_: 2, left_tens: 20, right_hundreds: 500}
    ]
    assert(result.equal(new DataFrame(expected)),
           `Wrong resulting data`)
    done()
  })
})
