# briq

TidyBlocks revisited.

Contributions of all kinds are welcome.
By offering a contribution, you agree to abide by our [Code of Conduct](CONDUCT.md)
and that your work may be made available under the terms of [our license](LICENSE.md).

1.  To report a bug or request a new feature,
    please check the [list of open issues](https://github.com/gvwilson/briq/issues)
    to see if it's already there,
    and if not,
    file as complete a description as you can.

1.  If you have made a fix or improvement,
    please create a [pull request](https://github.com/gvwilson/briq/pulls).
    We will review these as quickly as we can (typically within 2-3 days).

## Overview

### Source

-   `libs/util.js`: low-level utilities.
-   `libs/dataframe.js`: operations on data tables.
-   `libs/expr.js`: operations on table rows.
    These may be nested (i.e., `add(multiply(2, column('red')), column('blue'))`
-   `libs/summarize.js`: summarization operations (such as `sum` and `max`).
-   `libs/statistics.js`: statistical tests.
-   `libs/stage.js`: operations on entire tables.
    These use expressions, summarizers, and statistical tests.
-   `libs/pipeline.js`: pipelines made up of stages.
-   `libs/program.js`: programs made up of pipelines.
-   `libs/environment.js`: the runtime environment for a program.
-   `libs/html.js`: turning programs to HTML and HTML back into programs.
-   `libs/ui.js`: the user interface.
    This is the only module *not* tested by `test/test_*.js`.

### Other Files

-   `test/test_*.js`: unit tests.
-   `static/ui.css`: CSS for the user interface.
-   `index.html`: user interface page.
-   `index.js`: gathers contents of `libs/*.js` (except `libs/ui.js`) for bundling.
