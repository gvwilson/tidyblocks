Summarize the values in one or more columns.
Each summary is specified by [a nested block](../transform/#aggregate).
If the data has been [grouped](../transform/#group),
one summary row is created for each group.

- *contains*: One or more [nested blocks](../transform/#aggregate)
  that specify which columns to summarize
  and how to summarize them.
