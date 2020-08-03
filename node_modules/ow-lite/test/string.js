import test from 'ava'
import m from '..'

test('string', t => {
  t.notThrows(() => m('foo', m.string))
  t.notThrows(() => m('foo', m.string))
  t.throws(() => m(12, m.string))
  t.throws(() => m(12, m.string))
})

test('string.length', t => {
  t.notThrows(() => m('foo', m.string.length(3)))
  t.notThrows(() => m('foobar', m.string.length(6)))
  t.notThrows(() => m('bar', m.string.length(3)))
  t.notThrows(() => m('bar', m.string.length(3)))
  t.throws(() => m('foo', m.string.length(4)))
  t.throws(() => m('foo', m.string.length(4)))
  t.throws(() => m('foo', m.string.length(4)))
})

test('string.minLength', t => {
  t.notThrows(() => m('foo', m.string.minLength(2)))
  t.notThrows(() => m('foo', m.string.minLength(3)))
  t.throws(() => m('foo', m.string.minLength(4)))
})

test('string.maxLength', t => {
  t.notThrows(() => m('foo', m.string.maxLength(3)))
  t.notThrows(() => m('foo', m.string.maxLength(5)))
  t.throws(() => m('foo', m.string.maxLength(2)))
})

test('string.matches', t => {
  t.notThrows(() => m('foo', m.string.matches(/^f.o$/)))
  t.notThrows(() => m('Foo', m.string.matches(/^f.o$/i)))
  t.throws(() => m('Foo', m.string.matches(/^f.o$/)))
  t.throws(() => m('bar', m.string.matches(/^f.o$/i)))
})

test('string.startsWith', t => {
  t.notThrows(() => m('foo', m.string.startsWith('fo')))
  t.notThrows(() => m('foo', m.string.startsWith('f')))
  t.throws(() => m('foo', m.string.startsWith('oo')))
  t.throws(() => m('foo', m.string.startsWith('b')))
})

test('string.endsWith', t => {
  t.notThrows(() => m('foo', m.string.endsWith('oo')))
  t.notThrows(() => m('foo', m.string.endsWith('o')))
  t.throws(() => m('foo', m.string.endsWith('fo')))
  t.throws(() => m('foo', m.string.endsWith('ar')))
})

test('string.empty', t => {
  t.notThrows(() => m('', m.string.empty))
  t.throws(() => m('foo', m.string.empty))
})

test('string.nonEmpty', t => {
  t.notThrows(() => m('foo', m.string.nonEmpty))
  t.throws(() => m('', m.string.nonEmpty))
})

test('string.eq', t => {
  t.notThrows(() => m('foo', m.string.eq('foo')))
  t.throws(() => m('bar', m.string.eq('foo')))
})

/*
test('string.includes', t => {
  t.notThrows(() => m('foo', m.string.includes('fo')))
  t.throws(() => m('foo', m.string.includes('bar')))
})

test('string.oneOf', t => {
  t.notThrows(() => m('foo', m.string.oneOf(['foo', 'bar'])))
  t.throws(() => m('foo', m.string.oneOf(['unicorn', 'rainbow'])))
  t.throws(() => m('foo', m.string.oneOf(['unicorn', 'rainbow'])))
  t.throws(() => m('foo', m.string.oneOf(['a', 'b', 'c', 'd', 'e'])))
  t.throws(() => m('foo', m.string.oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'])))
})
*/
