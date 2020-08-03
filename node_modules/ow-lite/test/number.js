import test from 'ava'
import m from '..'

test('number', t => {
  t.notThrows(() => m(1, m.number))
  t.notThrows(() => m(1, m.number))
  t.throws(() => m('12', m.number))
  t.throws(() => m('12', m.number, 'foo'))
})

test('number.gt', t => {
  t.notThrows(() => m(10, m.number.gt(5)))
  t.notThrows(() => m(10, m.number.gt(9)))
  t.throws(() => m(10, m.number.gt(10)))
  t.throws(() => m(10, m.number.gt(11)))
  t.throws(() => m(10, m.number.gt(20)))
})

test('number.gte', t => {
  t.notThrows(() => m(10, m.number.gte(5)))
  t.notThrows(() => m(10, m.number.gte(10)))
  t.throws(() => m(10, m.number.gte(11)))
  t.throws(() => m(10, m.number.gte(20)))
})

test('number.lt', t => {
  t.notThrows(() => m(10, m.number.lt(20)))
  t.notThrows(() => m(10, m.number.lt(11)))
  t.throws(() => m(10, m.number.lt(10)))
  t.throws(() => m(10, m.number.lt(9)))
  t.throws(() => m(10, m.number.lt(0)))
})

test('number.lte', t => {
  t.notThrows(() => m(10, m.number.lte(20)))
  t.notThrows(() => m(10, m.number.lte(10)))
  t.throws(() => m(10, m.number.lte(9)))
  t.throws(() => m(10, m.number.lte(0)))
})

test('number.eq', t => {
  t.notThrows(() => m(10, m.number.eq(10)))
  t.throws(() => m(10, m.number.eq(5)))
})

test('number.integer', t => {
  t.notThrows(() => m(10, m.number.integer))
  t.throws(() => m(10.1, m.number.integer))
})

test('number.positive', t => {
  t.notThrows(() => m(1, m.number.positive))
  t.throws(() => m(-1, m.number.positive))
})

test('number.negative', t => {
  t.notThrows(() => m(-1, m.number.negative))
  t.throws(() => m(1, m.number.negative))
})

/*
test('number.finite', t => {
  t.notThrows(() => m(10, m.number.finite))
  t.throws(() => m(Infinity, m.number.finite), 'Expected number to be finite, got Infinity')
})

test('number.infinite', t => {
  t.notThrows(() => m(Infinity, m.number.infinite))
  t.throws(() => m(10, m.number.infinite), 'Expected number to be infinite, got 10')
})

test('number.inRange', t => {
  t.notThrows(() => m(10, m.number.inRange(0, 20)))
  t.notThrows(() => m(10, m.number.inRange(10, 20)))
  t.notThrows(() => m(10, m.number.inRange(0, 10)))
  t.notThrows(() => m(10, m.number.inRange(0, 10)))
  t.notThrows(() => m(10, m.number.inRange(0, 10)))
  t.throws(() => m(10, m.number.inRange(0, 9)), 'Expected number to be in range [0..9], got 10')
  t.throws(() => m(10, m.number.inRange(0, 9), 'foo'), 'Expected number `foo` to be in range [0..9], got 10')
  t.throws(() => m(10, m.number.inRange(0, 9), 'foo'), 'Expected number `foo` to be in range [0..9], got 10')
  t.throws(() => m(10, m.number.inRange(11, 20)), 'Expected number to be in range [11..20], got 10')
})
*/
