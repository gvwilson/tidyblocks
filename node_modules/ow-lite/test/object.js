import test from 'ava'
import m from '..'

class Unicorn {}

test('object', t => {
  t.notThrows(() => m({}, m.object))
  t.notThrows(() => m({}, m.object))
  t.notThrows(() => m(new Error('foo'), m.object))
  t.throws(() => m('foo', m.object))
  t.throws(() => m('foo', m.object))
  t.throws(() => m(1, m.object))
})

test('object.plain', t => {
  t.notThrows(() => m({}, m.object.plain))
  t.notThrows(() => m({}, m.object.plain))
  t.notThrows(() => m({}, m.object.plain))
  t.throws(() => m(new Error('foo'), m.object.plain))
  t.throws(() => m(new Error('foo'), m.object.plain))
  t.throws(() => m(new Error('foo'), m.object.plain))
})

test('object.empty', t => {
  t.notThrows(() => m({}, m.object.empty))
  t.throws(() => m({unicorn: '🦄'}, m.object.empty))
})

test('object.nonEmpty', t => {
  t.notThrows(() => m({unicorn: '🦄'}, m.object.nonEmpty))
  t.throws(() => m({}, m.object.nonEmpty))
})

test('object.instanceOf', t => {
  t.notThrows(() => m(new Error('🦄'), m.object.instanceOf(Error)))
  t.notThrows(() => m(new Unicorn(), m.object.instanceOf(Unicorn)))
  t.throws(() => m(new Unicorn(), m.object.instanceOf(Error)))
  t.throws(() => m(new Unicorn(), m.object.instanceOf(Error)))
  t.throws(() => m(new Error('🦄'), m.object.instanceOf(Unicorn)))
  t.throws(() => m({unicorn: '🦄'}, m.object.instanceOf(Unicorn)))
})

/*
test('object.valuesOfType', t => {
  t.notThrows(() => m({unicorn: '🦄'}, m.object.valuesOfType(m.string)))
  t.notThrows(() => m({unicorn: '🦄', rainbow: '🌈'}, m.object.valuesOfType(m.string)))
  t.notThrows(() => m({unicorn: 1, rainbow: 2}, m.object.valuesOfType(m.number)))
  t.notThrows(() => m({unicorn: 1, rainbow: 2}, m.object.valuesOfType(m.number)))
  t.throws(() => m({unicorn: '🦄', rainbow: 2}, m.object.valuesOfType(m.string)), '(object) Expected argument to be of type `string` but received type `number`')
  t.throws(() => m({unicorn: '🦄', rainbow: 2}, m.object.valuesOfType(m.string)), '(object `foo`) Expected argument to be of type `string` but received type `number`')
  t.throws(() => m({unicorn: '🦄', rainbow: 2}, m.object.valuesOfType(m.string)), '(object `foo`) Expected `bar` to be of type `string` but received type `number`')
  t.throws(() => m({unicorn: 'a', rainbow: 'b'}, m.object.valuesOfType(m.string.minLength(2))), '(object) Expected string to have a minimum length of `2`, got `a`')
})

test('object.valuesOfTypeDeep', t => {
  t.notThrows(() => m({unicorn: '🦄'}, m.object.deepValuesOfType(m.string)))
  t.notThrows(() => m({unicorn: '🦄', rainbow: '🌈'}, m.object.deepValuesOfType(m.string)))
  t.notThrows(() => m({unicorn: {key: '🦄', value: '🌈'}}, m.object.deepValuesOfType(m.string)))
  t.notThrows(() => m({a: {b: {c: {d: 1}, e: 2}, f: 3}}, m.object.deepValuesOfType(m.number)))
  t.notThrows(() => m({a: {b: {c: {d: 1}, e: 2}, f: 3}}, m.object.deepValuesOfType(m.number)))
  t.throws(() => m({unicorn: {key: '🦄', value: 1}}, m.object.deepValuesOfType(m.string)), '(object) Expected argument to be of type `string` but received type `number`')
  t.throws(() => m({unicorn: {key: '🦄', value: 1}}, m.object.deepValuesOfType(m.string)), '(object `foo`) Expected argument to be of type `string` but received type `number`')
  t.throws(() => m({unicorn: {key: '🦄', value: 1}}, m.object.deepValuesOfType(m.string)), '(object `foo`) Expected `bar` to be of type `string` but received type `number`')
  t.throws(() => m({a: {b: {c: {d: 1}, e: '2'}, f: 3}}, m.object.deepValuesOfType(m.number)), '(object) Expected argument to be of type `number` but received type `string`')
})

test('object.deepEqual', t => {
  t.notThrows(() => m({unicorn: '🦄'}, m.object.deepEqual({unicorn: '🦄'})))
  t.notThrows(() => m({unicorn: '🦄', rain: {bow: '🌈'}}, m.object.deepEqual({unicorn: '🦄', rain: {bow: '🌈'}})))
  t.throws(() => m({unicorn: '🦄'}, m.object.deepEqual({rainbow: '🌈'})))
})

test('object.hasKeys', t => {
  t.notThrows(() => m({unicorn: '🦄'}, m.object.hasKeys('unicorn')))
  t.notThrows(() => m({unicorn: {value: '🦄'}}, m.object.hasKeys('unicorn')))
  t.notThrows(() => m({unicorn: {value: '🦄'}}, m.object.hasKeys('unicorn.value')))
  t.notThrows(() => m({unicorn: '🦄', rainbow: '🌈'}, m.object.hasKeys('unicorn', 'rainbow')))
  t.throws(() => m({unicorn: '🦄'}, m.object.hasKeys('unicorn', 'rainbow')))
  t.throws(() => m({unicorn: {value: '🦄'}}, m.object.hasKeys('unicorn.foo')))
})

test('object.hasAnyKeys', t => {
  t.notThrows(() => m({unicorn: '🦄'}, m.object.hasAnyKeys('unicorn', 'rainbow', 'foo.bar')))
  t.notThrows(() => m({unicorn: {value: '🦄'}}, m.object.hasAnyKeys('unicorn', 'rainbow')))
  t.notThrows(() => m({unicorn: {value: '🦄'}}, m.object.hasAnyKeys('unicorn.value', 'rainbow')))
  t.notThrows(() => m({unicorn: '🦄', rainbow: '🌈'}, m.object.hasAnyKeys('unicorn')))
  t.throws(() => m({unicorn: '🦄'}, m.object.hasAnyKeys('foo')))
  t.throws(() => m({unicorn: '🦄'}, m.object.hasAnyKeys('unicorn.value')))
})
*/
