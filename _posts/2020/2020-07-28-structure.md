---
layout: post.liquid
title: "Structure"
author: "Greg Wilson"
date: "2020-07-28T12:00"
---

The structure of the code in TidyBlocks is dictated by three things:

1.  The architecture of [Blockly](https://developers.google.com/blockly/).
2.  Our experience generating JavaScript directly from blocks.
3.  Our desire to write comprehensive unit tests.

Rather than describing these at a high level,
let's have a look at a simple pipeline that loads a data set,
filters it,
and generates a plot:

<div align="center">
  <img src="{{'/static/blog/2020/penguins-filter-plot.png' | relative_url}}" alt="A Three-Stage Pipeline"/>
</div>

-   `./index.html` is the home page for the TidyBlocks site.
    1.  It loads `./dist/css/base.min.css`, the bundled JavaScript file produced by [webpack](https://webpack.js.org/).
    2.  It also defines a one-line `onload` handler that creates a global variable called `ui`
        that holds the TidyBlocks user interface object.
    3.  The body of the page defines a `div` with the ID `"root"`.
        This is where the Blockly workspace is put.
    4.  The XML defining which blocks to provide (and what categories to put them in)
        used to be in `./index.html` but is now in `./blocks/blocks.js`.
        We will talk about this and other architectural issues in an upcoming post.

-   `./index.js` is where our JavaScript starts.
    It defines a class called `ReactInterface` that extends the generic `UserInterface` class
    with all the things we need to make Blockly, React, and our own code play together nicely in the browser.
    This class is meant to be a [singleton](https://en.wikipedia.org/wiki/Singleton_pattern),
    i.e.,
    only one instance of it is ever created.

-   `UserInterface` is defined in `./libs/gui.js` alongside most of our application's code.
    It initializes our blocks and loads some built-in datasets when it is created,
    and provides methods to turn the Blockly workspace into code objects and run them.

-   The blocks themselves live in `./blocks/*.js`.
    Each file defines a function called `setup` that should be called exactly once as the application starts up.
    This function:
    1.  Calls `Blockly.defineBlocksWithJsonArray` with an array of JSON configuration objects
        that describe the appearance of individual blocks.
    2.  Adds a function to the `Blockly.TidyBlocks` object that takes a block as its sole argument
        and returns a string containing the JSON representation of that block.
        The function has to be assigned to a property whose name matches one of the configuration entries:
        for example,
        `./blocks/value.js` configures a block whose `type` property is `"value_column"`,
        so `Blockly.TidyBlocks["value_column"]` is assigned a function that takes a block
        and produces JSON saying, "Please create a block to access a column of a table."
        (Blockly insists that these functions return the textual representation of JSON rather than JSON objects,
        so we have to do string interpolation here and parse the strings later.)

-   The user can now create blocks and click them together to make pipelines.
    When she clicks on the "Run" button,
    `UserInterface.getJSON` calls `Blockly.TidyBlocks.workspaceToCode`,
    which calls the functions set up in `./blocks/*.js` (recursively) to generate the JSON representation of the workspace.
    `UserInterface.getProgram` parses the resulting string,
    then creates an instance of the `Restore` class (described below)
    and uses it to turn the JSON into a tree of runnable objects (also described below).
    Finally, `UserInterface.runProgram` takes those runnable objects
    and a freshly-created instance of `Env` (the runtime environment class)
    and asks the program to run itself in that environment.
    When it's done,
    the interface can get datasets, plots, and log messages out of the `Env` object and display them.

-   The `Restore` class is defined in `./libs/persist.js`.
    It has one method for each of the five kinds of runnable object in TidyBlocks:
    programs, pipelines, transformations, operations, and values.
    These objects are represented in JSON as nested lists;
    the first element of each list specifies what family the object belongs to
    (e.g., `"@transform"`),
    while the second specifies the exact species (e.g., "filter")
    and anything else in the list is either settings or nested objects.
    Each method in `Restore` either creates an object of the right kind (for `Program` and `Pipeline`)
    or looks up a constructor and calls it (`Transform`, `Op`, and `Value`).

-   `Program` (in `./libs/program.js`) and `Pipeline` (in `./libs/pipeline.js`)
    each define a method called `run` that takes an instance of `Env` as a parameter and runs some code.
    `Program` handles the dependencies between pipelines
    so that a pipeline starting with a `join` block doesn't run until the things it's supposed to join are available.
    `Pipeline` handles the flow of data between transformations and returns the final result.

-   Pipelines are comprised of transforms defined in `./libs/transform.js`.
    Their common parent is `TransformBase`,
    and each one must define a `run` method that takes an instance of `Env` as a runtime environment
    and an instance of `DataFrame` (`./libs/dataframe.js`) to work on.

-   Transforms may contain operations (`./libs/op.js`),
    which in turn may contain values (`./libs/value.js`).
    The `run` methods for these objects take individual rows as inputs and produce new values as outputs;
    it's up to the enclosing transform to decide what to do with that value.

-   There are two exceptions to this tidy story:
    1.  Data blocks expect a `null` input instead of a dataframe.
        Their output is a dataset that has previously been loaded by the user.
    2.  `TransformSummarize` is different from other transforms.
        Instead of working row by row,
        it creates and runs a summarizer derived from `SummarizeBase` (`./libs/summarize.js`).
        That summarizer does something that requires the whole dataframe at once,
        such as calculating a sum or an average.

-   Finally,
    the `report` transform and all of the statistics and plotting blocks store things in the runtime environment
    so that the user interface can display them after the program has finished running.
    Every one of these results must have a unique name.
    -   `report` saves a dataframe that can be displayed in the pane on the right,
        used to trigger a `join` operation,
        or both.
    -   Plotting blocks (`./blocks/plot.js` and `./libs/transform.js`) create JSON specs
        for [Vega-Lite](https://vega.github.io/vega-lite/) plots.
    -   Statistics blocks (`./blocks/stats.js` and `./libs/transform.js`) save statistical results as text for display.
        We intend to add more tests and to make their display more elaborate,
        but this is good enough for testing.

-   The React components for the user interface live in `./libs/ui/*.jsx`,
    and our unit tests live in `./tests/*.js`.
    These work as they do in most other JavaScript projects:
    `npm run build` will bundle the React components with `./libs/*.js`, `./blocks/*.js`, and `./index.js`
    to create a self-contained JavaScript file,
    while `npm run test` will run the tests
    and `npm run coverage` will produce a report showing which parts of the code were and weren't exercised
    (see `./coverage/index.html` for the results).

All of this is fair bit of code---at the time of writing, the breakdown is:

| Component   | Lines    |
| ----------- | -------: |
| `./libs`    |     2991 |
| `./libs/ui` |      739 |
| `./blocks`  |     1639 |
| `./test`    |     3998 |
| **Total**   | **9367** |

However, a lot of it is repetitive:
block definitions and arithmetic operations,
for example,
are all close siblings even after common code is factored out.

So suppose you decide to add a new block to an existing category.
The steps you have to go through are:

1.  Add the block's definition and code generation function to a file in `./blocks.js`.
2.  Add a reference to the block to the XML in `./index.js`.
3.  Create a subclass of `TransformBase`
    or one of the `Expr` family of classes (`./libs/expr.js`)
    that implements the block's action.
    Be sure to add that class to the exports at the bottom of `./libs/transform.js`, `./libs/op.js`, or `./libs/value.js`
    so that `Restore` can create it from JSON.
4.  Add tests to make sure that:
    -   The block generates the right JSON.
    -   `Restore` can turn that JSON into a runnable object.
    -   The object's action does what it's supposed to do.

This isn't trivial, but it's less work than Version 1 required,
and we think it's a solid base for future work.
