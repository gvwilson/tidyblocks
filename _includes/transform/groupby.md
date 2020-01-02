Most data operations are done on groups of records that share values, such as people from the same country.
This block adds a new column to the table called `_group_` that has a unique value for each group.
Grouping can be removed using the [ungroup](../transform/#ungroup) block.

- **column, column**: A comma-separated list of the names of the columns to group by.
  Every unique combination of values in these columns produces one group.
