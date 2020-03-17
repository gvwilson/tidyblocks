'use strict'

const assert = require('assert')

const util = require('../libs/util')
const MISSING = util.MISSING
const {Expr} = require('../libs/expr')

const fixture = require('./fixture')
const getLeft = new Expr.column('left')
const getRight = new Expr.column('right')
const getNum = new Expr.column('num')
const getStr = new Expr.column('str')
const getDate = new Expr.column('date')
const getBool = new Expr.column('bool')
const threeDates = [
  {date: new Date(1)},
  {date: new Date(20)},
  {date: new Date(300)}
]

describe('get values', () => {
  it('gets values from rows', (done) => {
    const expected = [2, 5, 2, MISSING, 4, MISSING]
    const actual = fixture.number.map((row, i) => getLeft.run(row, i))
    assert.deepEqual(expected, actual,
                     `Got wrong value(s)`)
    done()
  })

  it('does not get values from nonexistent columns', (done) => {
    const getNope = new Expr.column('nope')
    assert.throws(() => getNope({left: 1}, 0),
                  Error,
                  `Should not be able to get value for missing column`)
    done()
  })
})

describe('arithmetic operations', () => {
  it('adds', (done) => {
    const expected = [4, 7, 2, MISSING, MISSING, MISSING]
    const op = new Expr.add(getLeft, getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for add`)
    done()
  })

  it('divides', (done) => {
    const expected = [1.0, 2.5, MISSING, MISSING, MISSING, MISSING]
    const op = new Expr.divide(getLeft, getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for divide`)
    done()
  })

  it('exponentiates', (done) => {
    const expected = [4, 25, 1, MISSING, MISSING, MISSING]
    const op = new Expr.power(getLeft, getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for power`)
    done()
  })

  it('multiplies', (done) => {
    const expected = [4, 10, 0, MISSING, MISSING, MISSING]
    const op = new Expr.multiply(getLeft, getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for multiply`)
    done()
  })

  it('negates', (done) => {
    const expected = [-2, -2, 0, -3, MISSING, MISSING]
    const op = new Expr.negate(getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for negate`)
    done()
  })

  it('remainders', (done) => {
    const expected = [0, 1, MISSING, MISSING, MISSING, MISSING]
    const op = new Expr.remainder(getLeft, getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for power`)
    done()
  })

  it('subtracts', (done) => {
    const expected = [0, 3, 2, MISSING, MISSING, MISSING]
    const op = new Expr.subtract(getLeft, getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for subtract`)
    done()
  })
})

describe('logical operations', () => {
  it('ands', (done) => {
    const expected = [true, false, false, false, MISSING, false, MISSING]
    const op = new Expr.and(getLeft, getRight)
    const actual = fixture.bool.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for and`)
    done()
  })

  it('nots', (done) => {
    const expected = [false, false, true, true, MISSING, true, MISSING]
    const op = new Expr.not(getLeft)
    const actual = fixture.bool.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for not`)
    done()
  })

  it('ors', (done) => {
    const expected = [true, true, true, false, false, MISSING, MISSING]
    const op = new Expr.or(getLeft, getRight)
    const actual = fixture.bool.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for or`)
    done()
  })
})

describe('comparison on numbers', () => {
  it('greater numbers', (done) => {
    const expected = [false, true, true, MISSING, MISSING, MISSING]
    const op = new Expr.greater(getLeft, getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for greater numbers`)
    done()
  })

  it('greater equals numbers', (done) => {
    const expected = [true, true, true, MISSING, MISSING, MISSING]
    const op = new Expr.greaterEqual(getLeft, getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for greater equal numbers`)
    done()
  })

  it('equals numbers', (done) => {
    const expected = [true, false, false, MISSING, MISSING, MISSING]
    const op = new Expr.equal(getLeft, getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for equal numbers`)
    done()
  })

  it('not equals numbers', (done) => {
    const expected = [false, true, true, MISSING, MISSING, MISSING]
    const op = new Expr.notEqual(getLeft, getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for not equal numbers`)
    done()
  })

  it('less equals numbers', (done) => {
    const expected = [true, false, false, MISSING, MISSING, MISSING]
    const op = new Expr.lessEqual(getLeft, getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for less equal numbers`)
    done()
  })

  it('less numbers', (done) => {
    const expected = [false, false, false, MISSING, MISSING, MISSING]
    const op = new Expr.less(getLeft, getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for less numbers`)
    done()
  })
})

describe('comparison on strings', () => {
  it('greater strings', (done) => {
    const expected = [false, false, true, true, MISSING, MISSING, MISSING]
    const op = new Expr.greater(getLeft, getRight)
    const actual = fixture.string.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for greater strings`)
    done()
  })

  it('greater equals strings', (done) => {
    const expected = [true, false, true, true, MISSING, MISSING, MISSING]
    const op = new Expr.greaterEqual(getLeft, getRight)
    const actual = fixture.string.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for greater equal strings`)
    done()
  })

  it('equals strings', (done) => {
    const expected = [true, false, false, false, MISSING, MISSING, MISSING]
    const op = new Expr.equal(getLeft, getRight)
    const actual = fixture.string.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for equal strings`)
    done()
  })

  it('not equals strings', (done) => {
    const expected = [false, true, true, true, MISSING, MISSING, MISSING]
    const op = new Expr.notEqual(getLeft, getRight)
    const actual = fixture.string.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for not equal strings`)
    done()
  })

  it('less equals strings', (done) => {
    const expected = [true, true, false, false, MISSING, MISSING, MISSING]
    const op = new Expr.lessEqual(getLeft, getRight)
    const actual = fixture.string.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for less equal strings`)
    done()
  })

  it('less strings', (done) => {
    const expected = [false, true, false, false, MISSING, MISSING, MISSING]
    const op = new Expr.less(getLeft, getRight)
    const actual = fixture.string.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for less strings`)
    done()
  })
})

describe('comparison on dates', () => {
  it('greater dates', (done) => {
    const test = new Expr.constant(new Date(4000))
    const op = new Expr.greater(test, getDate)
    const expected = [true, true, true]
    const actual = threeDates.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong result(s) for greater dates`)
    done()
  })

  it('greater equals dates', (done) => {
    const test = new Expr.constant(new Date(20))
    const op = new Expr.greaterEqual(test, getDate)
    const expected = [true, true, false]
    const actual = threeDates.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong result(s) for greater equal dates`)
    done()
  })

  it('equals dates', (done) => {
    const test = new Expr.constant(new Date(20))
    const op = new Expr.equal(test, getDate)
    const expected = [false, true, false]
    const actual = threeDates.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong result(s) for equal dates`)
    done()
  })

  it('not equals dates', (done) => {
    const test = new Expr.constant(new Date(20))
    const op = new Expr.notEqual(test, getDate)
    const expected = [true, false, true]
    const actual = threeDates.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong result(s) for not equal dates`)
    done()
  })

  it('less equals dates', (done) => {
    const test = new Expr.constant(new Date(20))
    const op = new Expr.lessEqual(test, getDate)
    const expected = [false, true, true]
    const actual = threeDates.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong result(s) for less equal dates`)
    done()
  })

  it('less dates', (done) => {
    const test = new Expr.constant(new Date(1))
    const op = new Expr.less(test, getDate)
    const expected = [false, true, true]
    const actual = threeDates.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong result(s) for less dates`)
    done()
  })
})

describe('conditional', () => {
  it('pulls values conditionally', (done) => {
    const expected = [2, 5, 0, MISSING, MISSING, MISSING]
    const op = new Expr.ifElse(getRight, getLeft, getRight)
    const actual = fixture.number.map((row, i) => op.run(row, i))
    assert.deepEqual(expected, actual,
                     `Wrong value(s) for conditional`)
    done()
  })
})

describe('type checks', () => {
  it('correctly identifies wrong types', (done) => {
    const allChecks = [
      [new Expr.isDatetime(getBool), 'datetime', 'bool'],
      [new Expr.isNumber(getBool), 'num', 'bool'],
      [new Expr.isString(getBool), 'text', 'bool'],
      [new Expr.isBool(getDate), 'bool', 'datetime'],
      [new Expr.isNumber(getDate), 'num', 'datetime'],
      [new Expr.isString(getDate), 'text', 'datetime'],
      [new Expr.isBool(getNum), 'bool', 'num'],
      [new Expr.isDatetime(getNum), 'datetime', 'num'],
      [new Expr.isString(getNum), 'text', 'num'],
      [new Expr.isBool(getStr), 'bool', 'str'],
      [new Expr.isDatetime(getStr), 'datetime', 'str'],
      [new Expr.isNumber(getStr), 'num', 'str']
    ]
    for (const [check, tested, actual] of allChecks) {
      assert.deepEqual(fixture.mixed.map((row, i) => check.run(row, i)),
                       [false, MISSING],
                       `Should not think ${actual} is ${tested}`)
    }
    done()
  })

  it('correctly identifies right types', (done) => {
    const allChecks = [
      [new Expr.isBool(getBool), 'bool'],
      [new Expr.isDatetime(getDate), 'datetime'],
      [new Expr.isNumber(getNum), 'num'],
      [new Expr.isString(getStr), 'text']
    ]
    for (const [check, name] of allChecks) {
      assert.deepEqual(fixture.mixed.map((row, i) => check.run(row, i)),
                       [true, MISSING],
                       `Incorrect result(s) for ${name}`)
    }
    done()
  })

  it('correctly identifies missing values', (done) => {
    const allChecks = [
      [getBool, 'bool'],
      [getDate, 'datetime'],
      [getNum, 'num'],
      [getStr, 'text']
    ]
    for (const [get, name] of allChecks) {
      const check = new Expr.isMissing(get)
      assert.deepEqual(fixture.mixed.map((row, i) => check.run(row, i)),
                       [false, true],
                       `Incorrect result(s) for ${name}`)
    }
    done()
  })
})

describe('type conversions', () => {
  it('converts basic types correctly', (done) => {
    const checks = [
      ['bool', Expr.toBool, MISSING, MISSING],
      ['bool', Expr.toBool, false, false],
      ['bool', Expr.toBool, true, true],
      ['bool', Expr.toBool, '', false],
      ['bool', Expr.toBool, 'abc', true],
      ['bool', Expr.toBool, 0, false],
      ['bool', Expr.toBool, -3, true],
      ['bool', Expr.toBool, 9.5, true],
      ['number', Expr.toNumber, MISSING, MISSING],
      ['number', Expr.toNumber, false, 0],
      ['number', Expr.toNumber, true, 1],
      ['number', Expr.toNumber, '123.4', 123.4],
      ['number', Expr.toNumber, 'abc', MISSING],
      ['number', Expr.toNumber, new Date(0), 0],
      ['string', Expr.toString, MISSING, MISSING],
      ['string', Expr.toString, false, 'false'],
      ['string', Expr.toString, true, 'true'],
      ['string', Expr.toString, -123, '-123'],
      ['string', Expr.toString, 'abc', 'abc'],
      ['string', Expr.toString, new Date(0), 'Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)']
    ]
    for (const [name, convert, input, expected] of checks) {
      const value = new Expr.constant(input)
      const op = new convert(value)
      const actual = op.run({}, 0)
      assert.equal(actual, expected,
                   `Wrong result for ${name} with ${input}: expected ${expected}, got ${actual}`)
    }
    done()
  })

  it('converts non-datetimes correctly', (done) => {
    const checks = [
      ['datetime', Expr.toDatetime, MISSING, MISSING],
      ['datetime', Expr.toDatetime, '', MISSING],
      ['datetime', Expr.toDatetime, 'abc', MISSING]
    ]
    for (const [name, convert, input, expected] of checks) {
      const op = new convert(new Expr.constant(input))
      const actual = op.run({}, 0)
      assert.equal(actual, expected,
                   `Wrong result for ${name}: ${input} => ${actual}`)
    }
    done()
  })

  it('converts valid datetimes correctly', (done) => {
    const checks = [
      ['datetime', Expr.toDatetime, '1983-12-02', new Date('1983-12-02')],
      ['datetime', Expr.toDatetime, 123, new Date(123)],
      ['datetime', Expr.toDatetime, new Date(456), new Date(456)]
    ]
    for (const [name, convert, input, expected] of checks) {
      const op = new convert(new Expr.constant(input))
      const actual = op.run({}, 0)
      assert(actual instanceof Date,
             `Wrong result type for ${name}`)
      assert.equal(actual.getTime(), expected.getTime(),
                   `Wrong result for ${name}`)
    }
    done()
  })
})

describe('extract values from datetimes', () => {
  it('extracts components of datetimes', (done) => {
    // Zero-based month in constructor *sigh*.
    const value = new Expr.constant(new Date(1983, 11, 2, 7, 55, 19, 0))
    assert.equal((new Expr.toYear(value)).run({}, 0), 1983,
                 `Wrong year`)
    assert.equal((new Expr.toMonth(value)).run({}, 0), 12,
                 `Wrong month`)
    assert.equal((new Expr.toDay(value)).run({}, 0), 2,
                 `Wrong day`)
    assert.equal((new Expr.toWeekday(value)).run({}, 0), 5,
                 `Wrong weekday`)
    assert.equal((new Expr.toHours(value)).run({}, 0), 7,
                 `Wrong hours`)
    assert.equal((new Expr.toMinutes(value)).run({}, 0), 55,
                 `Wrong minutes`)
    assert.equal((new Expr.toSeconds(value)).run({}, 0), 19,
                 `Wrong seconds`)
    done()
  })

  it('manages missing values when extracting from datetimes', (done) => {
    const converters = [
      ['year', Expr.toYear],
      ['month', Expr.toMonth],
      ['day', Expr.toDay],
      ['weekday', Expr.toWeekday],
      ['hours', Expr.toHours],
      ['minutes', Expr.toMinutes],
      ['seconds', Expr.toSeconds]
    ]
    const value = new Expr.constant(MISSING)
    for (const [name, conv] of converters) {
      const op = new conv(value)
      const result = op.run({}, 0)
      assert.equal(result, MISSING,
                   `Wrong result for ${name}`)
    }
    done()
  })
})

describe('expression equality tests', () => {
  it('compares constants', (done) => {
    const const_one = new Expr.constant('one')
    assert(const_one.equal(const_one),
           `Same should equal`)
    const const_two = new Expr.constant('two')
    assert(!const_one.equal(const_two),
           `Different should not equal`)
    const col_three = new Expr.column('three')
    assert(!const_one.equal(col_three),
           `Constant != column`)
    const col_four = new Expr.column('four')
    assert(!col_four.equal(col_three),
           `Different columns`)
    done()
  })

  it('compares unary expressions', (done) => {
    const const_one = new Expr.constant('one')
    const negate_one = new Expr.negate(const_one)
    assert(negate_one.equal(negate_one),
           `Same should equal`)
    const negate_two = new Expr.negate(new Expr.constant('two'))
    assert(!negate_one.equal(negate_two),
           `Different nested should not equal`)
    const not_one = new Expr.not(const_one)
    assert(!negate_one.equal(not_one),
           `Different operators should not equal`)
    done()
  })

  it('compares binary expressions', (done) => {
    const const_1 = new Expr.constant(1)
    const const_2 = new Expr.constant(2)
    const add_1_2 = new Expr.add(const_1, const_2)
    const add_1_2_also = new Expr.add(const_1, const_2)
    assert(add_1_2.equal(add_1_2_also),
           `Equal addition`)
    const add_2_2 = new Expr.add(const_2, const_2)
    assert(!add_2_2.equal(add_1_2),
           `Unequal sub-expressions`)
    done()
  })

  it('compares ternary expressions', (done) => {
    const cond_1 = new Expr.greater(new Expr.column('left'),
                                    new Expr.constant(0))
    const val_1_true = new Expr.add(new Expr.column('left'),
                                    new Expr.constant(3))
    const val_1_false = new Expr.constant(-1)
    const if_1 = new Expr.ifElse(cond_1, val_1_true, val_1_false)
    const val_2_false = new Expr.constant(-2)
    const if_2 = new Expr.ifElse(cond_1, val_1_true, val_2_false)
    assert(!if_2.equal(if_1),
           `Unequal nested expressions`)
    done()
  })
})
