<div id="arithmetic" markdown="1">
### Arithmetic

<img class="block" src="{{ 'en/img/op_arithmetic.svg' | relative_url }}" alt="arithmetic block"/>

This block implements mathematical computations on two values.
It accepts numbers, column names, and nested operation blocks.

- *left space*: The left-hand side of the operation.
- *drop down*: Select addition, subtraction, multiplication, division, remainder, or exponentiation.
- *right space*: The right-hand side of the operation.
</div>

<div id="negate" markdown="1">
## Negate

<img class="block" src="{{ 'en/img/op_negate.svg' | relative_url }}" alt="negate block"/>

Negate a number.

- *space*: The value to negate.
</div>

<div id="compare" markdown="1">
### Comparison

<img class="block" src="{{ 'en/img/op_compare.svg' | relative_url }}" alt="comparison block"/>

This block compares two values.
It accepts any values on the left and right side
and produces either `true` or `false`.

- *left space*: The left-hand side of the operation.
- *drop down*: Select equal, not equal, greater, less or equal, and so on.
- *right space*: The right-hand side of the operation.
</div>

<div id="extremum" markdown="1">
### Maximum and Minimum

<img class="block" src="{{ 'en/img/op_extremum.svg' | relative_url }}" alt="maximum/minimum block"/>

This block selects the maximum or minimum value from two different columns.

- *left space*: The left-hand side of the operation.
- *drop down*: Select maximum or minimum.
- *right space*: The right-hand side of the operation.
</div>

<div id="logical" markdown="1">
### Logical

<img class="block" src="{{ 'en/img/op_logical.svg' | relative_url }}" alt="logical operation block"/>

This block implements logical operations on two values.
It accepts any values on the left and right side
and produces either `true` or `false`.

- *left space*: The left-hand side of the operation.
- *drop down*: Select logical AND or logical OR.
- *right space*: The right-hand side of the operation.

Note that logical AND is only true if *both* sides are true,
while logical OR is true if *either or both* sides are true:
it is not either-or-both rather than one-or-the-other.
</div>

<div id="not" markdown="1">
## Not

<img class="block" src="{{ 'en/img/op_not.svg' | relative_url }}" alt="not block"/>

Produce `true` if the value is `false` or `false` if the value is `true`.

- *space*: The value to invert.
</div>

<div id="type" markdown="1">
### Type

<img class="block" src="{{ 'en/img/op_type.svg' | relative_url }}" alt="type checking block"/>

Check if a value is of a particular type.

- *space*: The value to check.
- *drop down*: Select the type to convert for.

<img class="block" src="{{ 'en/img/op_convert.svg' | relative_url }}" alt="type conversion block"/>

Convert a value from one type to another.

- *space*: The value to convert.
- *drop down*: Select the type to convert to.
</div>

<div id="datetime" markdown="1">
### Dates/Times

<img class="block" src="{{ 'en/img/op_datetime.svg' | relative_url }}" alt="datetime block"/>

Extract the year, month, or day from a date/time value.

- *space*: The date/time value to convert.
- *drop down*: Select the sub-value to extract.
</div>

<div id="conditional" markdown="1">
### Conditional

<img class="block" src="{{ 'en/img/op_conditional.svg' | relative_url }}" alt="conditional block"/>

Select one of two values based on a condition.
Any value can be used for the condition or for the results if the condition is true or false,
but the values used for the true and false cases must have the same type.

- *first space*: The condition to test.
- *second space*: The value if the condition is true.
- *third space*: The value if the condition is false.
</div>
