---
layout: post.liquid
title: "A Bit of Architecture"
author: "Greg Wilson"
date: "2021-02-14T02:00"
---

To understand how TidyBlocks works,
suppose our chains can have two kinds of blocks:
`assign` (which creates a  variable and gives it a value)
and `print` (which shows the value of a  variable).
When we create a value it can be a number or the negation,
addition, or multiplication of an expression.
Our design has three parts:

1.  The GUI, which is made up of the blocks users drag around.
    We'll ignore that for now.

2.  Each block knows how to generate a small JSON array
    containing information about its settings.

3.  Finally,
    there is an execution engine that knows how to walk such an array
    and run the requested operations.

We'll look at creating the JSON first.

Step 1: let's create a generic class that represents a block.

```js
class Block {
  // Need to know what kind of block this is.
  constructor (name) {
    this.name = name
  }

  // Get the JSON for this block. Every derived class must implement this!
  getJSON () {
    assert(false, 'Must implement')
  }
}
```

Step 2: a `print` block knows how to print a variable.

```js
class PrintBlock extends Block {
  // We always construct the block with the right name and create an empty
  // field for the variable name. The GUI is responsible for setting this
  // field when the user types something.
  constructor () {
    super("print")
    this.variable = null
  }

  // Get a JSON array saying "print this block".
  getJSON () {
    assert(this.variable !== null, "Must set variable name")
    return [this.name, this.variable]
  }
}
```

Step 3: an `assign` block. Notice that its `.getJSON` method
relies on the `.getJSON()` method of the expression being assigned.

```js
class AssignBlock extends Block {
  // As before, the constructor sets up everything.  The GUI is responsible for
  // making sure that the .variable and .expression fields are filled in.
  constructor () {
    super("assign")
    this.variable = null
    this.expression = null
  }

  // Get a JSON array saying "assign to a variable". The array has the name,
  // the name of the variable, and _a nested array_ created by the expression's
  // .getJSON() method. Since we could assign any kind of expression to the
  // variable, we ask the expression to describe itself.
  getJSON () {
    assert(this.variable !== null, "Must set variable name")
    assert(this.expression !== null, "Must set expression")
    return [this.name, this.variable, this.expression.getJSON()]
  }
}
```

Step 4: we need a generic base class for expressions.

```js
class Expression {
  // As with blocks, we need to know what kind of expression this is.
  constructor (name) {
    this.name = name
  }

  // Get the JSON for this block. Every derived class must implement this!
  getJSON () {
    assert(false, 'Must implement')
  }
}
```

Step 5: let's represent numbers and variables.

```js
class Number extends Expression {
  // Numbers are just themselves. Again, the GUI is responsible for setting
  // 'value' to a number.
  constructor () {
    super("number")
    this.value = null
  }

  // The JSON is "what am I?" and "what value do I have?"
  getJSON () {
    return [this.name, this.value]
  }
}

class Variable extends Expression {
  // Variables are names to be looked up.
  constructor () {
    super("variable")
    this.variable = null
  }

  getJSON () {
    return [this.name, this.variable]
  }
}
```

Step 6: we can now create a block that negates a number.

```js
class Negation extends Expression {
  // The .child member will be another expression - the GUI will set it
  // when the user inserts a sub-block.
  constructor () {
    super("negation")
    this.child = null
  }

  // As with the top-level 'assign' block, we have to ask the child for
  // its JSON.
  getJSON () {
    return [this.name, this.child.getJSON()]
  }
}
```

We can also create a block that represents a generic binary expression.
This stores the operator's name as a string
and the JSON representations of the left and right operands.

```js
class Binary extends Expression {
  // This is the most complicated expression block, but it's a straightforward
  // extension of what we've seen before.
  constructor () {
    super("binary")
    this.op = null // UI will set it to "add", "subtract", etc.
    this.left = null // Left operand.
    this.right = null // Right operand.
  }

  // Now we have to say "this is a binary operation, here's the operation, and
  // here's the JSON for the two operands."
  getJSON () {
    return [this.name, this.op, this.left.getJSON(), this.right.getJSON()]
  }
}
```

Let's pause for a moment and test this out. I want blocks that represent:

```
x := 1
y := 2
z := 3 * y + x
print z
```

As noted in comments above,
I'm going to assign values to the member variables of the objects myself.
In TidyBlocks,
this happens when the user types a number into a field
or selects an operator with a pulldown.

```js
// Create the number 1
const number_1 = new Number()
number_1.value = 1
console.log(`number_1 as JSON is ${JSON.stringify(number_1.getJSON())}`)
```
```
number_1 as JSON is ["number",1]
```

```js
// Assign the number 1 to the variable x.
// Note that this doesn't actually _do_ that - instead, it creates the instruction to do that.
const assign_to_x = new AssignBlock()
assign_to_x.variable = 'x'
assign_to_x.expression = number_1
console.log(`assign_to_x as JSON is ${JSON.stringify(assign_to_x.getJSON())}`)
```
```
assign_to_x as JSON is ["assign","x",["number",1]]
```

```js
// Let's ceate some more numbers and variables

const number_2 = new Number()
number_2.value = 2
const assign_to_y = new AssignBlock()
assign_to_y.variable = 'y'
assign_to_y.expression = number_2

const number_3 = new Number()
number_3.value = 3

const variable_y = new Variable()
variable_y.variable = 'y'

const multiply = new Binary() // will represent '3 * y'
multiply.op = "multiply"
multiply.left = number_3
multiply.right = variable_y

const variable_x = new Variable()
variable_x.variable = 'x'

const add = new Binary() // will represent '3 * y + x'
add.op = "add"
add.left = multiply
add.right = variable_x

const assign_to_z = new AssignBlock()
assign_to_z.variable = 'z'
assign_to_z.expression = add
console.log(`assign_to_z as JSON is ${JSON.stringify(assign_to_z.getJSON())}`)
```
```
assign_to_z as JSON is ["assign","z",["binary","add",["binary","multiply",["number",3],["variable","y"]],["variable","x"]]]
```

Step 7: create a class to represent a chain of blocks.

```js
class Chain {
  constructor () {
    this.name = 'chain'
    this.blocks = []
  }

  addBlock (block) {
    this.blocks.push(block)
  }

  getJSON () {
    return [this.name, ...this.blocks.map(child => child.getJSON())]
  }
}
```

Let's test this out.  It'll be much simpler to read if we pretty-print the JSON.

```js
const print_z = new PrintBlock()
print_z.variable = 'z'

const chain = new Chain()
chain.addBlock(assign_to_x)
chain.addBlock(assign_to_y)
chain.addBlock(assign_to_z)
chain.addBlock(print_z)
console.log(`assign_to_z as JSON is ${JSON.stringify(chain.getJSON(), null, 2)}`)
```
```
assign_to_z as JSON is [
  "chain",
  [
    "assign",
    "x",
    ["number", 1]
  ],
  [
    "assign",
    "y",
    ["number", 2]
  ],
  [
    "assign",
    "z",
    [
      "binary",
      "add",
      [
        "binary",
        "multiply",
        ["number", 3],
        ["variable", "y"]
      ],
      ["variable", "x"]
    ]
  ],
  ["print", "z"]
]
```

This is where the UI ends and the execution engine begins.
Everything above this point is doing the work of the GUI
to build some JSON that describes the operations we want to execute.
Everything below takes that JSON and does calculations.

Step 8: it's time to evaluate. We need two things:

- `environment`: a lookup table of known variables.
- `what`: the block to evaluate.

We will rely on a lookup table called HANDLERS that we define below.

```js
const evaluate = (environment, what) => {
  const name = what[0]
  assert(name in HANDLERS, `Don't know how to handle ${name}`)
  return HANDLERS[name](environment, ...what.slice(1)) // Pass everything else in the block to the handler.
}
```

Step 9: here's our table of handlers.
Each must take the environment as its first argument
but can take anumber of other other arguments.

```js
const HANDLERS = {
  chain: (environment, ...blocks) => {
    console.log('...chain of blocks')
    for (const block of blocks) {
      evaluate(environment, block)
    }
    return null // nobody should expect a value
  },

  print: (environment, name) => {
    console.log('...print', name)
    assert(name in environment, `No such variable ${name}`)
    console.log(environment[name])
    return null // nobody should expect a value
  },

  assign: (environment, name, expression) => {
    console.log('...assign', name)
    environment[name] = evaluate(environment, expression)
    return null // nobody should expect a value
  },

  number: (environment, value) => {
    console.log('...number', value)
    return value
  },

  variable: (environment, name) => {
    console.log('...variable', name)
    assert(name in environment, `No such variable ${name}`)
    return environment[name]
  },

  negation: (environment, child) => {
    console.log('...negation')
    return - evaluate(environment, child) // All this work for a forking minus sign...
  },

  binary: (environment, op, left, right) => {
    console.log('...binary', op)
    left = evaluate(environment, left)
    right = evaluate(environment, right)
    let result = null
    switch (op) {
    case 'add':
      result = left + right
      break
    case 'multiply':
      result = left * right
      break
    default:
      assert(false, `Unknown operation ${op}`)
    }
    return result
  }
}
```

Let's end by trying this out on the chain we created earlier.

```js
const environment = {} // no variables defined yet
const program = chain.getJSON()
const result = evaluate(environment, program)
```
```
...chain of blocks
...assign x
...number 1
...assign y
...number 2
...assign z
...binary add
...binary multiply
...number 3
...variable y
...variable x
...print z
7
```
