'use strict'

const assert = require('assert')
const {JSDOM} = require('jsdom')

const util = require('../libs/util')
const MISSING = util.MISSING
const {HTMLFactory} = require('../libs/html')
const {Expr} = require('../libs/expr')
const {Summarize} = require('../libs/summarize')
const {Stage} = require('../libs/stage')
const {Pipeline} = require('../libs/pipeline')
const {Program} = require('../libs/program')

const DOM = new JSDOM(`<body></body>`)
const BODY = DOM.window.document.querySelector('body')

const makeNode = (html) => {
  BODY.innerHTML = '<div/>'
  BODY.firstChild.innerHTML = html
  const result = BODY.firstChild.firstChild
  return result
}

const checkStage = (stage, name, numFields) => {
  const factory = new HTMLFactory()
  const node = makeNode(stage.toHTML(factory))
  assert.equal(node.tagName, 'DIV',
               `Wrong top-level element type`)
  assert.equal(node.querySelector('table >tbody >tr').children.length, numFields,
               `Widget should have ${numFields} children`)
  assert.equal(node.querySelector('table >tbody >tr >td >span').innerHTML, name,
               `Name should be ${name}`)
  return node
}

describe('creates the right HTML for basic types', () => {
  it('builds label text', (done) => {
    const factory = new HTMLFactory()

    const noLabel = makeNode(factory.label(null))
    assert.equal(noLabel.tagName, 'SPAN',
                 `Expected span`)
    assert.equal(noLabel.childNodes.length, 0,
                 `Span should not have children`)

    const withLabel = makeNode(factory.label('content'))
    assert.equal(withLabel.tagName, 'SPAN',
                 `Expected span`)
    assert.equal(withLabel.childNodes.length, 1,
                 `Span should have one child`)
    assert.equal(withLabel.innerHTML, 'content',
                 `Span should have content`)

    done()
  })

  it('builds an input field', (done) => {
    const factory = new HTMLFactory()

    const noDisplay = makeNode(factory.input(null))
    assert.equal(noDisplay.tagName, 'INPUT',
                 `Wrong node type`)
    assert.equal(noDisplay.childNodes.length, 0,
                 `Input should not have children`)
    assert.equal(noDisplay.getAttribute('type'), 'text',
                 `Input should have text type`)
    assert.equal(noDisplay.getAttribute('value'), null,
                 `Input should not have initial value set`)

    const withDisplay = makeNode(factory.input('valuable'))
    assert.equal(withDisplay.tagName, 'INPUT',
                 `Wrong node type`)
    assert.equal(withDisplay.childNodes.length, 0,
                 `Input should not have children`)
    assert.equal(withDisplay.getAttribute('type'), 'text',
                 `Input should have text type`)
    assert.equal(withDisplay.getAttribute('value'), 'valuable',
                 `Input should have initial value set`)
    done()
  })

  it('builds a checkbox', (done) => {
    const factory = new HTMLFactory()
    const node = makeNode(factory.check())
    assert.equal(node.tagName, 'INPUT',
                 `Wrong node type`)
    assert.equal(node.getAttribute('type'), 'checkbox',
                 `Wrong input type`)
    done()
  })

  it('builds a simple selector with nothing chosen', (done) => {
    const factory = new HTMLFactory()
    const node = makeNode(factory.choose(['a', 'b'], null))

    assert.equal(node.tagName, 'SELECT',
                 `Wrong node type`)
    assert.equal(node.childNodes.length, 2,
                 `Wrong number of children`)
    assert.equal(node.childNodes[0].tagName, 'OPTION',
                 `Wrong type of first child`)

    assert.equal(node.childNodes[0].getAttribute('value'), 'a',
                 `Wrong value for first child`)
    assert.equal(node.childNodes[0].innerHTML, 'a',
                 `Wrong display for first child`)
    assert.equal(node.childNodes[0].getAttribute('selected'), null,
                 `First child should not be selected`)

    assert.equal(node.childNodes[1].getAttribute('value'), 'b',
                 `Wrong value for second child`)
    assert.equal(node.childNodes[1].innerHTML, 'b',
                 `Wrong display for second child`)
    assert.equal(node.childNodes[1].getAttribute('selected'), null,
                 `Second child should not be selected`)

    done()
  })

  it('builds a simple selector with something chosen', (done) => {
    const factory = new HTMLFactory()
    const node = makeNode(factory.choose(['a', 'b'], 'b'))

    assert.equal(node.tagName, 'SELECT',
                 `Wrong node type`)
    assert.equal(node.childNodes.length, 2,
                 `Wrong number of children`)
    assert.equal(node.childNodes[0].tagName, 'OPTION',
                 `Wrong type of first child`)

    assert.equal(node.childNodes[0].getAttribute('value'), 'a',
                 `Wrong value for first child`)
    assert.equal(node.childNodes[0].innerHTML, 'a',
                 `Wrong display for first child`)
    assert.equal(node.childNodes[0].getAttribute('selected'), null,
                 `First child should not be selected`)

    assert.equal(node.childNodes[1].getAttribute('value'), 'b',
                 `Wrong value for second child`)
    assert.equal(node.childNodes[1].innerHTML, 'b',
                 `Wrong display for second child`)
    assert.equal(node.childNodes[1].getAttribute('selected'), 'selected',
                 `Second child should be selected`)

    done()
  })

  it('builds a mixed selector with nothing chosen', (done) => {
    const factory = new HTMLFactory()
    const node = makeNode(factory.choose([['Show A', 'a'], 'b'], null))

    assert.equal(node.tagName, 'SELECT',
                 `Wrong node type`)
    assert.equal(node.childNodes.length, 2,
                 `Wrong number of children`)
    assert.equal(node.childNodes[0].tagName, 'OPTION',
                 `Wrong type of first child`)

    assert.equal(node.childNodes[0].getAttribute('value'), 'a',
                 `Wrong value for first child`)
    assert.equal(node.childNodes[0].innerHTML, 'Show A',
                 `Wrong display for first child`)
    assert.equal(node.childNodes[0].getAttribute('selected'), null,
                 `First child should not be selected`)

    assert.equal(node.childNodes[1].getAttribute('value'), 'b',
                 `Wrong value for second child`)
    assert.equal(node.childNodes[1].innerHTML, 'b',
                 `Wrong display for second child`)
    assert.equal(node.childNodes[1].getAttribute('selected'), null,
                 `Second child should not be selected`)

    done()
  })

  it('builds a mixed selector with something chosen', (done) => {
    const factory = new HTMLFactory()
    const node = makeNode(factory.choose([['Show A', 'a'], 'b'], 'a'))

    assert.equal(node.tagName, 'SELECT',
                 `Wrong node type`)
    assert.equal(node.childNodes.length, 2,
                 `Wrong number of children`)
    assert.equal(node.childNodes[0].tagName, 'OPTION',
                 `Wrong type of first child`)

    assert.equal(node.childNodes[0].getAttribute('value'), 'a',
                 `Wrong value for first child`)
    assert.equal(node.childNodes[0].innerHTML, 'Show A',
                 `Wrong display for first child`)
    assert.equal(node.childNodes[0].getAttribute('selected'), 'selected',
                 `First child should be selected`)

    assert.equal(node.childNodes[1].getAttribute('value'), 'b',
                 `Wrong value for second child`)
    assert.equal(node.childNodes[1].innerHTML, 'b',
                 `Wrong display for second child`)
    assert.equal(node.childNodes[1].getAttribute('selected'), null,
                 `Second child should not be selected`)

    done()
  })

  it('builds expression placeholders', (done) => {
    const factory = new HTMLFactory()
    assert.equal(factory.expr(null), null,
                 `Should get null back for null expression`)
    assert.throws(() => factory.expr('some text'),
                  Error,
                  `Should not be able to called with string`)

    done()
  })

  it('requires valid HTML for expression placeholders', (done) => {
    const factory = new HTMLFactory()
    assert.throws(() => factory.expr('plain text'),
                  Error,
                  `Should not be able to create plain text expression`)
    done()
  })

  it('builds widgets', (done) => {
    const factory = new HTMLFactory()

    const widget = makeNode(factory.widget(
      factory.label('LABEL'),
      factory.input(null),
      factory.expr(new Expr.constant(false))
    ))

    assert.equal(widget.tagName, 'DIV',
                 `Expected outer div`)
    assert.equal(widget.childNodes.length, 1,
                 `Expected one child`)
    const table = widget.firstChild
    assert.equal(table.tagName, 'TABLE',
                 `Expected nested table`)
    const tbody = table.firstChild
    assert.equal(tbody.tagName, 'TBODY',
                 `Expected tbody as child`)
    assert.equal(tbody.childNodes.length, 1,
                 `Expected body to have one row`)
    const tr = tbody.firstChild
    assert.equal(tr.tagName, 'TR',
                 `Expected row as child`)
    assert.equal(tr.childNodes.length, 3,
                 `Expected row to have three children`)
    assert(Array.from(tr).every(child => child.tagName == 'TD'),
           `Expected all children to be table cells`)

    const first = tr.children[0].firstChild
    assert.equal(first.tagName, 'SPAN',
                 `Expected span as first part of widget`)
    const second = tr.children[1].firstChild
    assert.equal(second.tagName, 'INPUT',
                 `Expected input as second part of widget`)
    const third = tr.children[2].firstChild
    assert.equal(third.tagName, 'DIV',
                 `Expected nested expression as third child, not ${third.tagName}`)

    done()
  })
})

describe('converts expressions to HTML', () => {
  it('converts a constant to HTML', (done) => {
    const factory = new HTMLFactory()
    const expr = new Expr.constant(123)
    const html = expr.toHTML(factory)
    const node = makeNode(html)
    const row = node.querySelector('table >tbody >tr')
    assert.equal(row.childNodes.length, 2,
                 `Widget should have two children`)
    const first = row.childNodes[0].firstChild,
          second = row.childNodes[1].firstChild
    assert.equal(first.tagName, 'SELECT',
                 `First child should be selector`)
    assert.equal(first.childNodes.length, 2,
                 `Selector should have two options`)
    const selected = first.querySelector('option[selected=selected]')
    assert.equal(selected.getAttribute('value'), 'constant',
                 `Selector should have "constant" selected`)
    assert.equal(second.tagName, 'INPUT',
                 `Second child should be input`)
    assert.equal(second.getAttribute('type'), 'text',
                 `Input should be of type text`)
    assert.equal(second.getAttribute('value'), '123',
                 `Value should be number 123`)
    done()
  })

  it('converts different constant values to HTML', (done) => {
    const factory = new HTMLFactory()
    const allChecks = [
      ['false', false],
      ['true', true],
      ['zero', 0],
      ['non-zero', 123],
      ['empty string', ''],
      ['non-empty string', 'stuff']
    ]
    for (const [text, val] of allChecks) {
      const factory = new HTMLFactory()
      const expr = new Expr.constant(val)
      const html = expr.toHTML(factory)
      const node = makeNode(html)
      const row = node.querySelector('tr')
      const second = row.childNodes[1].firstChild
      assert.equal(second.tagName, 'INPUT',
                   `Second child should be input`)
      assert.equal(second.getAttribute('type'), 'text',
                   `Input should be of type text`)
      const actual = second.getAttribute('value')
      assert.equal(actual, `${val}`,
                   `Value for ${text} should be "${val}", not "${actual}"`)
    }
    done()
  })

  it('converts a column getter to HTML', (done) => {
    const factory = new HTMLFactory()
    const expr = new Expr.column('red')
    const html = expr.toHTML(factory)
    const node = makeNode(html)
    const row = node.querySelector('table >tbody >tr')
    assert.equal(row.childNodes.length, 2,
                 `Widget should have two children`)
    const first = row.childNodes[0].firstChild,
          second = row.childNodes[1].firstChild
    assert.equal(first.tagName, 'SELECT',
                 `First child should be selector`)
    assert.equal(first.childNodes.length, 2,
                 `Selector should have two options`)
    const selected = first.querySelector('option[selected=selected]')
    assert.equal(selected.getAttribute('value'), 'column',
                 `Selector should have "column" selected`)
    assert.equal(second.getAttribute('value'), 'red',
                 `Input should be "red"`)
    done()
  })

  it('converts unary expressions to HTML', (done) => {
    const theDate = new Date(1983, 11, 2, 7, 55, 19, 0)
    const allChecks = [
      ['negate', 987],
      ['not', false],
      ['isBool', true],
      ['isDatetime', theDate],
      ['isMissing', MISSING],
      ['isNumber', -8.9],
      ['isString', 'yes'],
      ['toBool', 0],
      ['toDatetime', '1983-11-02'],
      ['toNumber', '16'],
      ['toString', 16],
      ['toYear', theDate],
      ['toMonth', theDate],
      ['toDay', theDate],
      ['toWeekday', theDate],
      ['toHours', theDate],
      ['toMinutes', theDate],
      ['toSeconds', theDate]
    ]
    const factory = new HTMLFactory()
    for (let [name, val] of allChecks) {
      const func = Expr[name]
      const expr = new func(new Expr.constant(val))
      const html = expr.toHTML(factory)

      const node = makeNode(html)
      assert.equal(node.tagName, 'DIV',
                   `expression should be a table`)

      const row = node.querySelector('table >tbody >tr')
      assert.equal(row.childNodes.length, 2,
                   `Widget should have two children`)

      const first = row.childNodes[0].firstChild
      assert.equal(first.tagName, 'SELECT',
                   `First child should be selector`)

      const selected = first.querySelector('option[selected=selected]')
      assert.equal(selected.getAttribute('value'), name,
                   `Wrong function selected`)

      const second = row.childNodes[1].firstChild
      assert.equal(second.tagName, 'DIV',
                   `Second child should be sub-cell`)
    }
    done()
  })

  it('converts binary expressions to HTML', (done) => {
    const allChecks = [
      ['add', 987, 654],
      ['and', false, true],
      ['divide', 987, 654],
      ['equal', 987, 654],
      ['greater', 987, 654],
      ['greaterEqual', 987, 654],
      ['less', 987, 654],
      ['lessEqual', 987, 654],
      ['multiply', 987, 654],
      ['notEqual', 987, 654],
      ['or', 987, 654],
      ['power', 987, 654],
      ['remainder', 987, 654],
      ['subtract', 987, 654]
    ]
    const factory = new HTMLFactory()
    for (let [name, leftVal, rightVal] of allChecks) {
      const func = Expr[name]
      const expr = new func(new Expr.constant(leftVal),
                            new Expr.constant(rightVal))
      const html = expr.toHTML(factory)

      const node = makeNode(html)
      assert.equal(node.tagName, 'DIV',
                   `expression should be a table`)

      const row = node.querySelector('table >tbody >tr')
      assert.equal(row.childNodes.length, 3,
                   `Widget should have three children`)

      const first = row.childNodes[0].firstChild
      assert.equal(first.tagName, 'DIV',
                   `First child should be sub-cell`)

      const middle = row.childNodes[1].firstChild
      assert.equal(middle.tagName, 'SELECT',
                   `middle child should be selector`)

      const selected = middle.querySelector('option[selected=selected]')
      assert.equal(selected.getAttribute('value'), name,
                   `Wrong function selected`)

      const last = row.childNodes[2].firstChild
      assert.equal(last.tagName, 'DIV',
                   `Last child should be sub-cell`)
    }
    done()
  })

  it('converts ternary expression to HTML', (done) => {
    const factory = new HTMLFactory()
    const expr = new Expr.ifElse(new Expr.constant(true),
                                 new Expr.constant(1),
                                 new Expr.constant(2))
    const html = expr.toHTML(factory)

    const node = makeNode(html)
    assert.equal(node.tagName, 'DIV',
                 `expression should be a table`)

    const row = node.querySelector('table >tbody >tr')
    assert.equal(row.childNodes.length, 6,
                 `Widget should have six children`)

    for (let [i, word] of [[0, 'if'], [2, 'then'], [4, 'else']]) {
      assert.equal(row.children[i].innerHTML, word,
                   `Expected word ${i} to be "${word}"`)
    }

    for (let i of [1, 3, 5]) {
      assert.equal(row.children[i].tagName, 'TD',
                   `Expected table element as child ${i}`)
      const cell = row.children[i].firstChild
      assert.equal(cell.querySelectorAll('select').length, 1,
                   `Expected one selector`)
      assert.equal(cell.querySelectorAll('input').length, 1,
                   `Expected one input element`)
    }
    done()
  })
})

describe('converts transforms to HTML', () => {
  it('creates a drop widget', (done) => {
    const node = checkStage(new Stage.drop(['left', 'right']),
                            'drop', 2)
    assert.equal(node.querySelectorAll('span').length, 1,
                 `Should be one contained span element`)
    assert.equal(node.querySelectorAll('input').length, 1,
                 `Should be one input field`)
    const value = node.querySelector('input').getAttribute('value')
    assert.match(value, /left\s*,\s*right/,
                 `Wrong value for selector`)
    done()
  })

  it('creates a filter widget', (done) => {
    for (const [text, val] of [['true', true], ['false', false]]) {
      const node = checkStage(new Stage.filter(new Expr.constant(val)),
                              'filter', 2)
      const selected = node
            .querySelector('table.briq-widget >tbody >tr >td >select >option')
            .getAttribute('value')
      assert.equal(selected, 'constant',
                   `Expected a constant`)
      const actual = node
            .querySelector('table.briq-widget >tbody >tr >td >input')
            .getAttribute('value')
      assert.equal(actual, text,
                   `Expected value "${text}", not "${actual}"`)
    }
    done()
  })

  it('creates a groupBy widget', (done) => {
    const node = checkStage(new Stage.groupBy(['red', 'green']),
                            'groupBy', 2)
    const input = node.querySelector('tbody >tr >td >input')
    assert.equal(input.getAttribute('type'), 'text',
                 `Expected free-text input as second child`)
    done()
  })

  it('creates a join widget', (done) => {
    const args = ['aTable', 'aCol', 'bTable', 'bCol']
    const node = checkStage(new Stage.join(...args), 'join', 7)
    assert(args.every(name => node.querySelectorAll(`input[value=${name}]`).length === 1),
           `Failed to find all required input fields`)     
    done()
  })

  it('creates a mutate widget', (done) => {
    const node = checkStage(new Stage.mutate('update', new Expr.constant(true)),
                            'mutate', 3)
    const name = node.querySelector('tbody >tr >td >input')
    assert.equal(name.getAttribute('type'), 'text',
                 `Expected free-text input as child`)
    assert.equal(node.querySelector('tbody >tr >td >select>option').getAttribute('value'),
                 'constant',
                 `Expected a constant`)
    done()
  })

  it('creates a notify widget', (done) => {
    const node = checkStage(new Stage.notify('signal'), 'notify', 2)
    const name = node.querySelector('tbody >tr >td >input')
    assert.equal(name.getAttribute('value'), 'signal',
                 `Expected notification name in field`)
    done()
  })

  it('creates a read widget', (done) => {
    const node = checkStage(new Stage.read('/path'), 'read', 2)
    const name = node.querySelector('tbody >tr >td >input')
    assert.equal(name.getAttribute('value'), '/path',
                 `Expected path in field`)
    done()
  })

  it('creates a select widget', (done) => {
    const node = checkStage(new Stage.select(['red', 'green']), 'select', 2)
    const name = node.querySelector('tbody >tr >td >input')
    assert.match(name.getAttribute('value'), /\s*red\s*,\s*green\s*/,
                 `Expected column names in field`)
    done()
  })

  it('creates a summarize widget', (done) => {
    const maxLeft = new Summarize.maximum('left')
    const minRight = new Summarize.minimum('right')
    const node = checkStage(new Stage.summarize(maxLeft, minRight), 'summarize', 3)
    const row = node.querySelector('table >tbody >tr')
    const [label, s1, s2] = Array.from(row.children).map(child => child.firstChild)

    const s1Selected = s1.querySelector('table >tbody >tr >td >select >option[selected=selected]')
    assert.equal(s1Selected.getAttribute('value'), 'maximum',
                 `Expected maximum for first summarize`)
    const s1Input = s1.querySelector('tbody >tr >td >input')
    assert.equal(s1Input.getAttribute('value'), 'left',
                 `Expected left column for first summarize`)

    const s2Selected = s2.querySelector('table >tbody >tr >td >select >option[selected=selected]')
    assert.equal(s2Selected.getAttribute('value'), 'minimum',
                 `Expected maximum for second summarize`)
    const s2Input = s2.querySelector('tbody >tr >td >input')
    assert.equal(s2Input.getAttribute('value'), 'right',
                 `Expected left column for second summarize`)

    done()
  })

  it('creates a sort widget', (done) => {
    const node = checkStage(new Stage.sort(['red', 'green'], false), 'sort', 4)
    const [fields, reverse] = Array.from(node.querySelectorAll('tbody >tr >td >input'))
    assert.match(fields.getAttribute('value'), /\s*red\s*,\s*green\s*/,
                 `Expected column names in field`)
    assert.equal(reverse.getAttribute('type'), 'checkbox',
                 `Expected checkbox for second field`)
    done()
  })

  it('creates an ungroup widget', (done) => {
    const node = checkStage(new Stage.ungroup(), 'ungroup', 1)
    done()
  })

  it('creates an unique widget', (done) => {
    const node = checkStage(new Stage.unique(['red', 'green']), 'unique', 2)
    const name = node.querySelector('tbody >tr >td >input')
    assert.match(name.getAttribute('value'), /\s*red\s*,\s*green\s*/,
                 `Expected column names in field`)
    done()
  })
})

describe('converts entire programs to HTML', () => {
  it('creates an empty program', (done) => {
    const factory = new HTMLFactory()
    const empty = makeNode(factory.emptyProgram())
    assert.equal(empty.tagName, 'TABLE',
                 `Expected table`)
    assert.equal(empty.getAttribute('id'), 'briq-program',
                 `Expected program ID`)
    done()
  })

  it('turns a multi-pipeline program into HTML', (done) => {
    const factory = new HTMLFactory()
    const program = new Program(
      new Pipeline('first', new Stage.read('/path/to/first')),
      new Pipeline('second', new Stage.read('/path/to/second'), new Stage.unique(['left'])),
      new Pipeline('third', new Stage.read('/path/to/third'), new Stage.notify('signal'))
    )
    const html = program.toHTML(factory)
    const root = makeNode(html)
    const rows = Array.from(root.firstChild.children)
    assert.equal(rows.length, 3,
                 `Expected three rows in program`)
    assert(rows.every((row, i) => row.querySelector('th').innerHTML == `${i}`),
           `Rows have the wrong names`)
    done()
  })
})

describe('creates toolboxes', () => {
  it('creates toolbox entries for expressions', (done) => {
    const classes = Expr.CLASSES.slice(0, 2) // nullary and negate
    const factory = new HTMLFactory()
    const toolbox = makeNode(factory.makeToolbox(classes))
    assert.equal(toolbox.tagName, 'TABLE',
                 `Expected table`)
    assert.equal(toolbox.getAttribute('class'), 'briq-toolbox',
                 `Expected briq-toolbox as table class`)
    assert.equal(toolbox.firstChild.tagName, 'TBODY',
                 `Toolbox should contain table body`)
    const rows = Array.from(toolbox.firstChild.children)
    assert.equal(rows[0].querySelector('option[selected=selected]').getAttribute('value'), 'constant',
                 `First entry should be nullary expression`)
    assert.equal(rows[1].querySelector('option[selected=selected]').getAttribute('value'), 'negate',
                 `Second entry should be negater`)
    done()
  })

  it('creates toolbox entries for stages', (done) => {
    const classes = Stage.CLASSES.slice(0, 2) // drop and filter
    const factory = new HTMLFactory()
    const toolbox = makeNode(factory.makeToolbox(classes))
    assert.equal(toolbox.tagName, 'TABLE',
                 `Expected table`)
    assert.equal(toolbox.getAttribute('class'), 'briq-toolbox',
                 `Expected briq-toolbox as table class`)
    assert.equal(toolbox.firstChild.tagName, 'TBODY',
                 `Toolbox should contain table body`)
    const rows = Array.from(toolbox.firstChild.children)
    assert.equal(rows[0].querySelector('span').innerHTML, 'drop',
                 `Expected first row to be drop`)
    assert.equal(rows[0].querySelectorAll('input.briq-textbox').length, 1,
                 `Should have one input textbox for drop`)
    assert.equal(rows[1].querySelector('span').innerHTML, 'filter',
                 `Expected second row to be drop`)
    assert.equal(rows[1].querySelectorAll('td.briq-placeholder').length, 1,
                 `Should have one placeholder for filter`)
    done()
  })

  it('creates all toolboxes', (done) => {
    const allClasses = [
      Expr.CLASSES,
      Stage.CLASSES
    ]
    const factory = new HTMLFactory()
    for (const classes of allClasses) {
      const toolbox = makeNode(factory.makeToolbox(classes))
      assert.equal(toolbox.tagName, 'TABLE',
                   `Expected table`)
      assert.equal(toolbox.getAttribute('class'), 'briq-toolbox',
                   `Expected briq-toolbox as table class`)
    }
    done()
  })
})

describe('converts HTML back to programs', () => {
  it('converts empty programs and pipelines', (done) => {
    const factory = new HTMLFactory()
    const original = new Program(new Pipeline('name'))
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Program.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts HTML to a boolean', (done) => {
    const factory = new HTMLFactory()
    const original = new Expr.constant(true)
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Expr.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts HTML to a number', (done) => {
    const factory = new HTMLFactory()
    const original = new Expr.constant(456)
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Expr.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts HTML to a string', (done) => {
    const factory = new HTMLFactory()
    const original = new Expr.constant('hello')
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Expr.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts a program containing a single drop stage with multiple columns', (done) => {
    const factory = new HTMLFactory()
    const original = new Program(new Pipeline('name', new Stage.drop(['yellow', 'orange'])))
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Program.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts a program containing a single filter stage', (done) => {
    const factory = new HTMLFactory()
    const original = new Program(new Pipeline('name', new Stage.filter(new Expr.constant(false))))
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Program.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts a program containing a single groupBy stage with multiple columns', (done) => {
    const factory = new HTMLFactory()
    const original = new Program(new Pipeline('name', new Stage.groupBy(['yellow', 'orange'])))
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Program.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts a program containing a single join stage', (done) => {
    const factory = new HTMLFactory()
    const stage = new Stage.join('at', 'ac', 'zt', 'zc')
    const original = new Program(new Pipeline('name', stage))
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Program.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts a program containing a single mutate stage', (done) => {
    const factory = new HTMLFactory()
    const stage = new Stage.mutate('dazzle', new Expr.constant(1234))
    const original = new Program(new Pipeline('name', stage))
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Program.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts a program containing a single notify stage', (done) => {
    const factory = new HTMLFactory()
    const original = new Program(new Pipeline('name', new Stage.notify('signal')))
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Program.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts a program containing a single read stage', (done) => {
    const factory = new HTMLFactory()
    const original = new Program(new Pipeline('name', new Stage.read('/path.csv')))
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Program.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts a program containing a single select stage with multiple columns', (done) => {
    const factory = new HTMLFactory()
    const original = new Program(new Pipeline('name', new Stage.select(['yellow', 'orange'])))
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Program.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts a program containing a single sort stage with multiple columns in both orders', (done) => {
    const factory = new HTMLFactory()
    for (const sorting of [true, false]) {
      const original = new Program(new Pipeline('name', new Stage.sort(['yellow', 'orange'], sorting)))
      const dom = makeNode(original.toHTML(factory))
      const roundtrip = Program.fromHTML(factory, dom)
      assert(roundtrip.equal(original),
             `Roundtrip does not match original`)
    }
    done()
  })

  it('converts a program containing a single summarize stage with multiple summarizers', (done) => {
    const factory = new HTMLFactory()
    const maxLeft = new Summarize.maximum('left')
    const minRight = new Summarize.minimum('right')
    const stage = new Stage.summarize(maxLeft, minRight)
    const original = new Program(new Pipeline('name', stage))
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Program.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts a program containing a single ungroup stage', (done) => {
    const factory = new HTMLFactory()
    const original = new Program(new Pipeline('name', new Stage.ungroup()))
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Program.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })

  it('converts a program containing a single unique stage with multiple columns', (done) => {
    const factory = new HTMLFactory()
    const original = new Program(new Pipeline('name', new Stage.unique(['yellow', 'orange'])))
    const dom = makeNode(original.toHTML(factory))
    const roundtrip = Program.fromHTML(factory, dom)
    assert(roundtrip.equal(original),
           `Roundtrip does not match original`)
    done()
  })
})
