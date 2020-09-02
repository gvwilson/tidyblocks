---
permalink: /contributing/
title: "Contributing"
layout: plain.liquid
---

Contributions of all kinds are welcome.
By offering a contribution, you agree to abide by our [Code of Conduct](CONDUCT.md)
and that your work may be made available under the terms of [our license](LICENSE.md).

## Who Can Help and How

**Asha** is a high school mathematics teacher
whose students are using TidyBlocks to do their homework.
She can help by filing bug reports and feature suggestions,
and by providing questions and solutions for us to add to our gallery of examples.

**Lupita** is using TidyBlocks to learn basic data science.
She can help by translating blocks and block descriptions into Bantu
to make TidyBlocks more accessible to her fellow students.

**Raniere** is a data scientist
who uses R and Python in his work.
He can help by creating code generators for those languages
and by extending our visualization toolkit.

**Yatindra** is a web programmer who is fluent in JavaScript.
They can help by bringing our code and tooling into line with modern standards
and by adding features to make TidyBlocks easier to use.

## What Goes Where

1.  To report a bug or request a new feature,
    please check the [list of open issues](https://github.com/tidyblocks/tidyblocks/issues)
    to see if it's already there,
    and if not,
    file as complete a description as you can.

1.  If you have made a fix or improvement,
    please create a [pull request](https://github.com/tidyblocks/tidyblocks/pulls);
    we review these as quickly as we can.
    If you are tackling an issue that has already been opened,
    please name your branch `number-some-description`
    (e.g., `20-highlighting-active-block`)
    and put `Closes #N` (e.g., `Closes #20`)
    on a line by itself at the end of the pull request's long description.

1.  All contributors will be added to the authors list,
    and if you become a regular contributor
    we will invite you to join our Slack channel.

## Getting Started

1.  Fork <https://github.com/tidyblocks/tidyblocks/> and clone it to your desktop.

1.  Go into the newly-created `tidyblocks` directory
    and run `npm run install` to install all of the packages we depend on.

1.  Run `npm run test` to re-run the unit tests in the `tests/` directory
    to make sure everything is working.

1.  Run `npm run build` to rebuild the JavaScript,
    and then `npm run serve` to run a local server to try it out.
    (Point your browser at <http://localhost:8080>.)

## Actions

-   `npm run check`: print a list of all missing translation strings.
    A line like `stats.kerfuffle.message_0: af` means that
    there is no translation in Afar (`af`) for `message_0`
    in the `kerfuffle` block in `blocks/stats.js`.

-   `npm run build`: regenerate `dist/tidyblocks.js`.
    You can test this by opening `en/index.html`
    or the `index.html` file in some other language's directory.

-   `npm run watch`: regenerate and reload `dist/tidyblocks.js` whenever files change.

-   `npm run test`: run tests without reporting code coverage.
    (You can use `npm run test -- -g 'some title string'`
    to only run tests whose titles match that string.)

-   `npm run coverage`: run tests and report code coverage to see what isn't being tested.
    (Open `coverage/index.html` to see the results.)

-   `npm run data`: create loadable JSON file for each CSV file in `./data`.
    (These files must be loaded in `./libs/gui.js` to be accessible.)

-   `npm run docs`: regenerate code documentation in the `./docs` directory.
    Please do *not* commit changes to this directory yourself:
    we will regenerate the documentation periodically after checking it.

-   `npm run lint`: run coding style checks.

## Translation

Blocks are defined in JavaScript files located in `./blocks/*.js`.
Each file starts with a lookup table called `MESSAGES`
that has one entry for each block
with one sub-entry for each translatable fragment of text in that block.
Messages are looked up using two-letter language codes,
such as `pt` for Portuguese and `ar` for Arabic.
To translate a block's messages:

1.  Run TidyBlocks in a language that already has a translation
    and look at what text appears where in that block.

2.  Look at the translation strings for the block in that language.

3.  Add the translation string for the target language.

4.  When you are done, create a pull request that includes the translations for review.

If you are the first person to do translations in some language,
please also add a line to `./index.html` to link to the main page for that language.

## Organization

TidyBlocks uses [Blockly](https://developers.google.com/blockly/) for the workspace,
[React](https://reactjs.org/) for the user interface,
and [Jekyll](https://jekyllrb.com/) + [GitHub Pages](https://pages.github.com/) for the website as a whole.

-   `blocks/*.js`: implementation of blocks.
    -   `blocks/blocks.js`: block initialization and code generation entry point.
    -   `blocks/helper.js`: utilities.
    -   All other files implement a set of blocks.

-   `libs/util.js`: low-level utilities.

-   `libs/dataframe.js`: operations on data tables.

-   `libs/expr.js`, `libs/value.js`, and `libs/op.js`: things that operate on table rows.
    These may be nested (i.e., `add(multiply(2, column('red')), column('blue'))`

-   `libs/summarize.js`: summarization operations (such as `sum` and `max`).

-   `libs/transform.js`: operations on entire tables.
    These use expressions, summarizers, and statistical tests.

-   `libs/pipeline.js`: pipelines made up of stages.

-   `libs/program.js`: programs made up of pipelines.

-   `libs/persist.js`: convert serialized JSON to programs, pipelines, stages, and expressions.

-   `libs/env.js`: the runtime environment for a program that stores datasets, records error messages, and so on.

-   `libs/gui.js` : handle interactions with the user.

### Other Files

-   `index.html`: home page containing links to pages for each language.

-   `ar/index.html`, `it/index.html`, etc.: home pages for specific languages.
    -   `LL/index.html`: the TidyBlocks workspace page for language `LL`.
    -   `LL/guide.md`: the guide for that language.
    -   `LL/*.md`: documentation for each group of blocks.
    -   `LL/img/*.svg`: SVG images of blocks used in the guide.

-   `index.js`: gathers blocks for bundling to create `tidyblocks.min.js` for testing.

-   `_posts`: blog posts.

-   `_config.yml`, `_data/*`, `_includes/*`, and `_layouts/*`: Jekyll site generation files.

-   `_site`: locally-generated copy of the website.
    Please do *not* add this directory or its contents to Git.

-   `test/*.js`: unit tests.

-   `static/css/*` and `static/sass/*`: CSS for the user interface.

-   `coverage/*`: code coverage data generated by `npm run coverage`.
    Please do *not* add these files to Git.

-   `data/*`: built-in datasets.

-   `docs/*`: JSDoc code documentation generated by `npm run docs`.
    Please do *not* add changes to these files to the Git repository:
    we will regenerate them periodically.

-   `workspaces/*`: small programs to load for interactive testing.
