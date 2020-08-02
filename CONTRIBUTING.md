---
permalink: /contributing/
title: "Contributing"
---

Contributions of all kinds are welcome.
By offering a contribution, you agree to abide by our [Code of Conduct](CONDUCT.md)
and that your work may be made available under the terms of [our license](LICENSE.md).

1.  To report a bug or request a new feature,
    please check the [list of open issues](https://github.com/tidyblocks/tidyblocks/issues)
    to see if it's already there,
    and if not,
    file as complete a description as you can.

1.  If you have made a fix or improvement,
    please create a [pull request](https://github.com/tidyblocks/tidyblocks/pulls).
    We will review these as quickly as we can (typically within 2-3 days).
    If you are tackling an issue that has already been opened,
    please name your branch `number-some-description`
    (e.g., `20-highlighting-active-block`)
    and put `Closes #N` (e.g., `Closes #20`)
    on a line by itself at the end of the PR's long description.

## Who Can Help and How

**Asha** is a high school mathematics teacher
whose students are using TidyBlocks to do their homework.
She can help by filing bug reports and feature suggestions,
and by providing questions and solutions for us to add to our gallery of examples.

**Raniere** is a data scientist
who uses R and Python in his work.
He can help by creating code generators for those languages
and by extending our visualization toolkit.

**Yatindra** is a web programmer who is fluent in JavaScript.
They can help by bringing our code and tooling into line with modern standards
and by adding features to make TidyBlocks easier to use.

## Getting Started

1.  Fork <https://github.com/tidyblocks/tidyblocks/> and clone it to your desktop.

1.  Go into the newly-created `tidyblocks` directory
    and run `npm install` to install all of the packages we depend on.
    -   Note: do *not* install `blockly` itself from NPM: madness will ensue.
        We have included a *working* copy of the library in this repository.

1.  Run `npm test` to re-run the unit tests in `tests/test_*.js`.
    These check that our blocks generate the expected code,
    and that the code does the right things.

## The Interface

-   `index.html` is the interface for TidyBlocks.  It contains
    -   A `codeArea` div that holds buttons, the block palette, the block display, and the code output.
    -   A `displayArea` div that holds the graph and table displays of output.

-   The `blockDisplay` div has a chunk of XML with the id `toolbox`
    that tells Blockly what categories of blocks there are
    and what blocks are in each category.

-   `index.html` loads all of the Blockly JavaScript files
    (including `msg/js/en.js`, which is the English-language message file)
    and the support libraries that TidyBlocks relies on:
    [Vega-Lite](https://vega.github.io/vega-lite/),
    [Papaparse](https://www.papaparse.com/),
    and [Data-Forge](http://www.data-forge-js.com/).
    We load these from a content delivery network (CDN) rather than requiring installation.

-   `index.html` also loads the TidyBlocks utilities and the blocks that make up TidyBlocks.
    All the `script` tags are inside a div with the ID `"tidyblocks"` so that the testing framework can find them (see below).
    Each block has at least two JavaScript files:
    -   `blocks/something.js` defines the appearance of the block and its fields.
    -   `generators/js/something.js` implements JavaScript code generation for that block.
    -   `generators/r/something.js` (optional) implement R code generation for that block.

-   `index.html` ends by initializing the display and setting up Blockly.
    The code to do this is in the page rather than in a utility library
    so that the testing framework won't try to run it.

## Code Generation

-   The code generator in `generators/js/something.js` assigns a function of one argument `block` to `Blockly.JavaScript['something']`.
    When the code generator runs,
    Blockly passes that function an object whose fields contain information about the block.
    The generator uses `Blockly.JavaScript.valueToCode` to get the code for fields that contain nested blocks,
    or `block.getFieldValue` to get a direct value such as a string or number.
    The code generation function then returns either a string containing the code to be run
    or a 2-element list containing the code and an enumeration value `Blockly.JavaScript.ORDER_WHATEVER`
    that specifies the precedence for arithmetic and other atomic operations.

-   Code generation is complicated by the fact that Data-Forge uses callback functions for most operations.
    For example,
    the code we need for filtering is `dataframe.where(row => (row["columnName"]))`,
    but the blocks that implement this are a `transform_filter` block
    that contains a `transform_column` block that in turn contains the column name.
    The column name block could return `row["columnName"]`
    for insertion into a filter template `.where(row => (${EXPRESSION}))`,
    but if it does,
    then the code for binary arithmetic operations like addition winds up containing
    `row[row["left"] + row["right"]]`.
    We have solved this by having `variable_column` return `@columnName`,
    then using helper functions `colName` and `colValue` (both in `utilities/tb_codegen.js`)
    to remove the `@` and/or add `row["..."]` where needed.
    It's clumsy, but it works.

-   The natural way to implement join would be to have two pipelines come into the top of a join block to form a "Y",
    but Blockly doesn't provide a way to connect two blocks to the top of a third.
    Instead,
    we wrap each pipeline in a function,
    then register that function with an object called `TidyBlocksManager`.
    If the pipeline doesn't depend on anything,
    it can be run whenever the user presses the "Run Code" button.
    If the pipeline starts with a `plumbing_join` block,
    on the other hand,
    the user fills in the names of the two pipelines that the join depends on,
    and `TidyBlocksManager` doesn't run the pipeline below the join
    until its dependencies have been executed.
    In order to tell `TidyBlocksManager` what table a pipeline produces,
    the user must end it with a `plumbing_notify` block.
    The functions `registerPrefix` and `registerSuffix` (both in `utilities/tb_codegen.js`)
    make sure that the code for each pipeline starts and ends the right way.

-   Most pipelines will end with a `plot_*` block to create a plot,
    but users must also be able to run pipelines that are under construction.
    To support this,
    the function `fixCode` looks in the generated code for a `// terminated` marker
    which is inserted by all of the plotting blocks' code generators.
    If this marker is not present,
    `fixCode` adds code to "plot" the pipeline's output as a table.

## Runtime

-   `utilities/tb_dataframe.js` defines the `TidyBlocksDataFrame` class,
    which is a wrapper around a Data-Forge dataframe.
    All code generators target the methods of `TidyBlocksDataFrame`;
    most correspond to Data-Forge dataframe methods,
    but the TidyBlocks dataframe also provides methods to join tables, create a plot, and so on,
    so that all code generators can rely on method chaining.

## Testing

-   The tests use the [Mocha](https://mochajs.org/) framework:
    see `tests/test_js_*.js` for examples.

-   Each test file uses the function `loadBlockFiles` in `tests/util.js`
    to load all of the TidyBlocks scripts mentioned in `index.html`.

-   `tests/util.js` also defines substitutes for the `Blockly` object,
    and the class that stores information about a block.
    This allows the `makeBlock` function to create a "block"
    that has only the fields needed by the code generators.

-   `tests/test_js_exec.js` also defines callback functions for creating plots and displaying tables.
    Instead of rendering anything,
    these functions store values so that they can be checked by Mocha tests.
