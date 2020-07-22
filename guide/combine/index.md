---
permalink: /guide/combine/
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

| X | P  |
| - | -- |
| 1 | p1 |
| 2 | p2 |
| 3 | p3 |

and table B contains:

| Y | Q   |
| - | --- |
| 1 | q11 |
| 1 | q12 |
| 3 | q3  |
| 4 | q4  |

then the final table contains rows for the matches 1 and 3:

| \_join\_ | A_P | B_Q |
| -------- | --- | --- |
| 1        | p1  | q11 |
| 1        | p1  | q12 |
| 3        | p3  | q3  |

The column \_join\_ contains the values that matched,
while the other columns appear as *table_column*.

- **left_table**: The name used to identify a table in a [notify](../combine/#notify) block.
- **left_column**: The column to join on from that table.
- **right_table**: The name used to identify a table in a [notify](../combine/#notify) block.
- **right_column**: The column to join on from that table.

## Glue

<img class="block" src="{{page.permalink | append: 'glue.png' | relative_url}}" alt="glue block"/>

FIXME

## Notify

<img class="block" src="{{page.permalink | append: 'notify.png' | relative_url}}" alt="notify block"/>

This block must be the last in a stack.
It notifies [join](../combine/#join) and [glue](../combine/#glue) blocks
that data is ready to be combined.

- **name**: The name used to identify the table.
  Each notification must use a unique name.
