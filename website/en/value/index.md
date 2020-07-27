---
permalink: /guide/en/value/
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
- id: row-number
  text: Row Number
- id: exponential-random-value
  text: Exponential
- id: normal-random-variable
  text: Normal
- id: uniform-random-variable
  text: Uniform
---

## Column

<img class="block" src="{{page.permalink | append: 'column.png' | relative_url}}" alt="column block"/>

Specify the name of a single column in the data.

- **column**: The name of the column whose value is desired.

## Datetime

<img class="block" src="{{page.permalink | append: 'datetime_val.png' | relative_url}}" alt="datetime block"/>

Specify a fixed date and time.

- **YYYY-MM-DD**: The 4-digit year, month, and day joined with dashes.

## Logical

<img class="block" src="{{page.permalink | append: 'logical_val.png' | relative_url}}" alt="logical block"/>

Select a constant logical value.

- *pulldown*: Select `true` or `false`.

## Number

<img class="block" src="{{page.permalink | append: 'number.png' | relative_url}}" alt="number block"/>

Specify a fixed number.

- **number**: The desired number.

## Text

<img class="block" src="{{page.permalink | append: 'text.png' | relative_url}}" alt="text block"/>

Specify a fixed text.
The value should *not* be quoted:
any single or double quotes provided will be included in the text.

- **text**: The desired text.

## Row Number

<img class="block" src="{{page.permalink | append: 'rownum.png' | relative_url}}" alt="row number block"/>

Generate the row number, starting from 1.

## Exponential Random Value

<img class="block" src="{{page.permalink | append: 'exponential.png' | relative_url}}" alt="exponential random value block"/>

Generate a random value from the exponential distribution with the rate parameter &lambda;.

- **rate**: the rate parameter.

## Normal Random Variable

<img class="block" src="{{page.permalink | append: 'normal.png' | relative_url}}" alt="normal random value block"/>

Generate a random value from the normal distribution with mean &mu; and standard deviation &sigma;.

-  **mean**: the center of the distribution.
-  **std dev**: the spread of the distribution.

## Uniform Random Variable

<img class="block" src="{{page.permalink | append: 'uniform.png' | relative_url}}" alt="uniform random value block"/>

Generate a random value from the uniform distribution across the given range.

-  **low**: the low end of the range.
-  **high**: the high end of the range.
