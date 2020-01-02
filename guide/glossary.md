---
permalink: /glossary/
title: "Glossary"
---

{:auto_ids}
aggregation
:   A synonym for [summarize](#summarize).

Boolean
:   Either true or false (the name comes from the mathematician George Boole).

column
:   Every column of a [table](#table) contains zero or more rows
    and is referred to by its [column name](#column-name).
    In statistics a column is a [variable](#variable) that has been observed or measured,
    but we prefer the term "column" to avoid confusion with variables in programming languages.

column name
:   Every column in a [table](#table) must have a distinct name
    (though columns in different tables can have the same names).
    A column name must start with the underscore '_' or a letter,
    and may only contain underscores, letters, and digits.
    TidyBlocks automatically creates names for some columns,
    such as `_group_` for the column containing [group IDs](#group-id).

datetime
:   A moment in time represented by years, months, days, hours, minutes, and seconds.
    Datetimes are always stored in [Universal Time Coordinates](#universal-time-coordinates),
    and are also referred to as [timestamps](#timestamp).
    Datetimes are written as "YYYY-MM-DD:hh:mm:ss".

expression
:   Something that performs an [operation](#operation) to produce a [value](#value).
    Expressions can be combined to create new expressions:
    for example,
    the expression `(temperature - 32) * (5 / 9)` uses multiplication
    to combine two smaller expressions that use subtraction and division.

group
:   A subset of the [rows](#row) in a [table](#table)
    that have the same values in one or more [columns](#column).
    TidyBlocks gives each group a unique [group ID](#group-id).

group ID
:   The unique identifier for a [group](#group) in a [table](#table).
    TidyBlocks automatically stores group IDs in a column called `_group_`.

logical
:   A synonym for [Boolean](#boolean).

missing value
:   A hole in a dataset.
    Missing values are often called [NAs](#na) (short for "not available").
    Missing is technically not the same thing as [Not a Number](#nan) (NaN),
    but TidyBlocks treats them the same way.

NA
:   A missing value:
    the abbreviation is short for "not available".

NaN
:   Short for "Not a Number",
    this is a special value used to represent infinity and other strange "numbers".
    TidyBlocks doesn't store NaN,
    but instead treats it as a [missing value](#missing-value).

operation
:   Something that can be done to data,
    such as addition or extracting the month from a [datetime](#datetime).

record
:  A single set of related observations.
   Records are stored as [rows](#row) in [tables](#table).

row
:   Every row of a [table](#table) spans zero or more [columns](#column)
    and stores a single related set of observations.
    Rows are often called [records](#record),
    and most [operations](#operation) in TidyBlocks work within rows.

string
:   A synonym for [text](#text).

summarize
:   Combine many values into one.
    Totalling, calculating the average, and finding the minimum are a few ways to summarize values.

table
:   A set of [rows](#row) and [columns](#column) making up a single dataset.
    Most blocks in TidyBlocks create a new table from an existing one.

timestamp
:   A unique moment in time.
    TidyBlocks prefers the term [datetime](#datetime).

type
:   A kind of data.
    TidyBlocks has numbers (which can be integers or have fractional parts),
    text (often called [strings](#string) by programmers),
    [Booleans](#boolean) (also called [logical values](#logical), although there aren't any illogical values),
    [datetimes](#datetime) (also called [timestamps](#timestamp),
    and a special marker for [missing values](#missing-value).

Universal Time Coordinates
:   The standard time from which timezones are measured.
    Often abbreviated "UTC".

value
:   A single piece of data in a specific [row](#row) and [column](#column) of a [table](#table).
    Every value has a [type](#type),
    and some [operations](#operation) only work on some types of values.

variable
:   In statistics, something that has been observed or measured.
    Variables correspond to [columns](#column) in [tables](#tables);
    we often use the term "column" to avoid confusion with
    the idea of a variable in a programming language.
