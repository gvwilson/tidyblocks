Keep a subset of rows that pass some test such as `age > 65` or `country = "Iceland"`.
The test is checked independently for each row,
and tests can be combined using the [and](../operation/#logical),
[or](../operation/#logical),
and [not](../operation/#not) blocks.

-  *expression*: the test each row must pass to be included in the result.
