---
permalink: /guide/en/combine/
title: "Combining"
headings:
- id: join
  text: Join
- id: glue
  text: Glue
- id: notify
  text: Notify
---

## Join

<img class="block" src="{{page.permalink | append: 'join.png' | relative_url}}" alt="join block"/>

Join two tables by matching values in column X of table A
to the values in column Y of table B.
If table A contains:

| num | name |
| --- | ---- |
|   1 |   p1 |
|   2 |   p2 |
|   3 |   p3 |

and table B contains:

| val | label |
| --- | ----- |
|   1 |   q11 |
|   1 |   q12 |
|   3 |   q3  |
|   4 |   q4  |

and the tables are joined on `num` and `val`,
then the final table contains rows for the matches 1 and 3:

| \_join\_ | A_name | B_label |
| -------- | ------ | ------- |
| 1        |    p1  |     q11 |
| 1        |    p1  |     q12 |
| 3        |    p3  |     q3  |

The new column <code>\_join\_</code> contains the values that matched,
while the other columns appear as <code><em>table</em>\_<em>column</em></code>.

- **left_table**: The name used to identify a table in a [notify](../combine/#notify) block.
- **left_column**: The column to join on from that table.
- **right_table**: The name used to identify a table in a [notify](../combine/#notify) block.
- **right_column**: The column to join on from that table.

## Glue

<img class="block" src="{{page.permalink | append: 'glue.png' | relative_url}}" alt="glue block"/>

Combine the rows of two tables to create a new table.
The input tables must have the same number of columns,
and those columns must have the same names.
A new column is added to show where each row came from.
For example,
if table A contains:

| num | name |
| --- | ---- |
|   1 |   p1 |
|   2 |   p2 |

and table B contains:

| num | name |
| --- | ---- |
|   2 |   q2 |
|   3 |   q3 |

and the label column is called `source`,
then the final table contains:

| num | name | source |
| --- | ---- | ------ |
|   1 |   p1 |      A |
|   2 |   p2 |      A |
|   2 |   q2 |      B |
|   3 |   q3 |      B |

- **left_table**: The name used to identify a table in a [notify](../combine/#notify) block.
- **right_table**: The name used to identify a table in a [notify](../combine/#notify) block.
- **label**: The name of the column holding the row's source.

## Notify

<img class="block" src="{{page.permalink | append: 'notify.png' | relative_url}}" alt="notify block"/>

This block must be the last in a stack.
It notifies [join](../combine/#join) and [glue](../combine/#glue) blocks
that data is ready to be combined.

- **name**: The name used to identify the table.
  Each notification must use a unique name.
