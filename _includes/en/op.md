<div id="arithmetic">
<h3>Arithmetic</h3>

<img class="block" src="{{ './op_arithmetic.svg' | relative_url }}" alt="arithmetic block"/>

This block implements mathematical computations on two values.
It accepts numbers, column names, and nested operation blocks.

- *left space*: The left-hand side of the operation.
- *drop down*: Select addition, subtraction, multiplication, division, remainder, or exponentiation.
- *right space*: The right-hand side of the operation.
</div>

<div id="negate">
<h3>Negate</h3>

<img class="block" src="{{ './op_negate.svg' | relative_url }}" alt="negate block"/>

Negate a number.

- *space*: The value to negate.
</div>

<div id="compare">
<h3>Comparison</h3>

<img class="block" src="{{ './op_compare.svg' | relative_url }}" alt="comparison block"/>

This block compares two values.
It accepts any values on the left and right side
and produces either `true` or `false`.

- *left space*: The left-hand side of the operation.
- *drop down*: Select equal, not equal, greater, less or equal, and so on.
- *right space*: The right-hand side of the operation.
</div>

<div id="extremum">
<h3>Maximum and Minimum</h3>

<img class="block" src="{{ './op_extremum.svg' | relative_url }}" alt="maximum/minimum block"/>

This block selects the maximum or minimum value from two different columns.

- *left space*: The left-hand side of the operation.
- *drop down*: Select maximum or minimum.
- *right space*: The right-hand side of the operation.
</div>

<div id="logical">
<h3>Logical</h3>

<img class="block" src="{{ './op_logical.svg' | relative_url }}" alt="logical operation block"/>

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

<div id="not">
<h3>Not</h3>

<img class="block" src="{{ './op_not.svg' | relative_url }}" alt="not block"/>

Produce `true` if the value is `false` or `false` if the value is `true`.

- *space*: The value to invert.
</div>

<div id="type">
<h3>Type</h3>

<img class="block" src="{{ './op_type.svg' | relative_url }}" alt="type checking block"/>

Check if a value is of a particular type.

- *space*: The value to check.
- *drop down*: Select the type to convert for.

<img class="block" src="{{ './op_convert.svg' | relative_url }}" alt="type conversion block"/>

Convert a value from one type to another.

- *space*: The value to convert.
- *drop down*: Select the type to convert to.
</div>

<div id="datetime">
<h3>Dates/Times</h3>

<img class="block" src="{{ './op_datetime.svg' | relative_url }}" alt="datetime block"/>

Extract the year, month, or day from a date/time value.

- *space*: The date/time value to convert.
- *drop down*: Select the sub-value to extract.
</div>

<div id="conditional">
<h3>Conditional</h3>

<img class="block" src="{{ './op_conditional.svg' | relative_url }}" alt="conditional block"/>

Select one of two values based on a condition.
Any value can be used for the condition or for the results if the condition is true or false,
but the values used for the true and false cases must have the same type.

- *first space*: The condition to test.
- *second space*: The value if the condition is true.
- *third space*: The value if the condition is false.
</div>

<div id="shift">
<h3>Shift</h3>

<img class="block" src="{{ './op_shift.svg' | relative_url }}" alt="shift block"/>

Shift values up or down in a column.

- **column**: Which column to shift
- *number*: How much to shift by (positive to shift up that many places, negative to shift down).
</div>
