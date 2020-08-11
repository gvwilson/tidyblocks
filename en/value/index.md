---
language: en
layout: en/page
permalink: /en/value/
title: "Values"
headings:
- id: column
  text: Column
- id: datetime
  text: Datetime
- id: logical
  text: Logical
- id: number
  text: Number
- id: text
  text: Text
- id: rownum
  text: Row Number
- id: exponential
  text: Exponential
- id: normal
  text: Normal
- id: uniform
  text: Uniform
---

<div id="column" markdown="1">
## Column

<img class="block" src="{{page.permalink | append: 'column.svg' | relative_url}}" alt="column block"/>

Specify the name of a single column in the data.

- **column**: The name of the column whose value is desired.
</div>

<div id="datetime" markdown="1">
## Datetime

<img class="block" src="{{page.permalink | append: 'datetime_val.svg' | relative_url}}" alt="datetime block"/>

Specify a fixed date and time.

- **YYYY-MM-DD**: The 4-digit year, month, and day joined with dashes.
</div>

<div id="logical" markdown="1">
## Logical

<img class="block" src="{{page.permalink | append: 'logical_val.svg' | relative_url}}" alt="logical block"/>

Select a constant logical value.

- *pulldown*: Select `true` or `false`.
</div>

<div id="number" markdown="1">
## Number

<img class="block" src="{{page.permalink | append: 'number.svg' | relative_url}}" alt="number block"/>

Specify a fixed number.

- **number**: The desired number.
</div>

<div id="text" markdown="1">
## Text

<img class="block" src="{{page.permalink | append: 'text.svg' | relative_url}}" alt="text block"/>

Specify a fixed text.
The value should *not* be quoted:
any single or double quotes provided will be included in the text.

- **text**: The desired text.
</div>

<div id="rownum" markdown="1">
## Row Number

<img class="block" src="{{page.permalink | append: 'rownum.svg' | relative_url}}" alt="row number block"/>

Generate the row number, starting from 1.
</div>

<div id="exponential" markdown="1">
## Exponential Random Value

<img class="block" src="{{page.permalink | append: 'exponential.svg' | relative_url}}" alt="exponential random value block"/>

Generate a random value from the exponential distribution with the rate parameter &lambda;.

- **rate**: the rate parameter.
</div>

<div id="normal" markdown="1">
## Normal Random Variable

<img class="block" src="{{page.permalink | append: 'normal.svg' | relative_url}}" alt="normal random value block"/>

Generate a random value from the normal distribution with mean &mu; and standard deviation &sigma;.

-  **mean**: the center of the distribution.
-  **std dev**: the spread of the distribution.
</div>

<div id="uniform" markdown="1">
## Uniform Random Variable

<img class="block" src="{{page.permalink | append: 'uniform.svg' | relative_url}}" alt="uniform random value block"/>

Generate a random value from the uniform distribution across the given range.

-  **low**: the low end of the range.
-  **high**: the high end of the range.
</div>
