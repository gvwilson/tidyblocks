<div id="create" markdown="1">
### Create

<img class="block" src="{{ 'en/img/transform_create.svg' | relative_url }}" alt="create block"/>

Add new columns while keeping existing ones.
A column can be replaced if a new column is given the same name as an existing column.

- **new_column**: Name for new column.
- *first space*: A [value](../value/) or the result of an [operation](../operation/).
</div>

<div id="drop" markdown="1">
### Drop

<img class="block" src="{{ 'en/img/transform_drop.svg' | relative_url }}" alt="drop block"/>

Discard one or more columns from the data.
This block isn't strictly necessary—you can just ignore a column if you don't need it—but
dropping columns often makes the display easier to read.
This block is the opposite of [select](../transform/#select).

- **column, column**: A comma-separated list of the names of the columns to drop.
</div>

<div id="filter" markdown="1">
### Filter

<img class="block" src="{{ 'en/img/transform_filter.svg' | relative_url }}" alt="filter block"/>

Keep a subset of rows that pass some test such as `age > 65` or `country = "Iceland"`.
The test is checked independently for each row,
and tests can be combined using the [and](../operation/#logical),
[or](../operation/#logical),
and [not](../operation/#not) blocks.

-  *expression*: the test each row must pass to be included in the result.
</div>

<div id="groupBy" markdown="1">
### Group By

<img class="block" src="{{ 'en/img/transform_groupBy.svg' | relative_url }}" alt="grouping block"/>

Most data operations are done on groups of records that share values, such as people from the same country.
This block adds a new column to the table called `_group_` that has a unique value for each group.
Grouping can be removed using the [ungroup](../transform/#ungroup) block.

- **column, column**: A comma-separated list of the names of the columns to group by.
  Every unique combination of values in these columns produces one group.
</div>

<div id="saveAs" markdown="1">
### Save As


<img class="block" src="{{ 'en/img/transform_saveas.svg' | relative_url }}" alt="save as block"/>

Save a result for later inspection or to be [combined](../combine/) with a result from another pipeline.

- **name** Result name
</div>

<div id="select" markdown="1">
### Select

<img class="block" src="{{ 'en/img/transform_select.svg' | relative_url }}" alt="select block"/>

Choose columns from a table: columns that are not named will be dropped.
This block is not strictly necessary,
since unneeded columns can simply be ignored,
but discarding unneeded columns can make the display easier to read.
This block is the opposite of [drop](../transform/#drop).

- **column, column**: One or more columns to keep.
</div>

<div id="sort" markdown="1">
### Sort

<img class="block" src="{{ 'en/img/transform_sort.svg' | relative_url }}" alt="sort block"/>

Sort the rows in a table according to the values in one or more columns.

- **column, column**: A comma-separated list of the names of the columns to sort by.
- **descending**: If checked, sort in descending order (i.e., greatest value first).
</div>

<div id="summarize" markdown="1">
### Summarize

<img class="block" src="{{ 'en/img/transform_summarize.svg' | relative_url }}" alt="summarize block"/>

Summarize the values in one or more columns.
If the data has been [grouped](../transform/#group),
one summary row is created for each group.
The summary values are put in a new column <code><em>op</em>\_<em>col</em></code>,
e.g., <code>mean\_age</code>.

-   *drop down*: which summarization operation to use.
-   **column**: which column to summarize.
</div>

<div id="ungroup" markdown="1">
### Ungroup

<img class="block" src="{{ 'en/img/transform_ungroup.svg' | relative_url }}" alt="ungroup block"/>

Undo grouping created by [group](../transform/#group)
by removing the special \_group\_ column.
</div>

<div id="unique" markdown="1">
### Unique

<img class="block" src="{{ 'en/img/transform_unique.svg' | relative_url }}" alt="unique block"/>

Discard rows containing redundant values.
If several rows have the same values in the specified columns
but different values in other columns,
one row from that group will be chosen arbitrarily and kept.

- **column, column**: One or more columns to check for distinct values.
</div>
