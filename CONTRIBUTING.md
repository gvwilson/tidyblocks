# Contributing

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

<table cellpadding="5">
  <tr>
    <td><img src="static/asha.svg" width="100px" /></td>
    <td>
      <strong>Asha</strong> is a high school mathematics teacher
      whose students are using TidyBlocks to do their homework.
      She can help by filing bug reports and feature suggestions,
      and by providing questions and solutions for us to add to our gallery of examples.
    </td>
  </tr>
  <tr>
    <td><img src="static/raniere.svg" width="100px" /></td>
    <td>
      <strong>Raniere</strong> is a data scientist
      who uses R and Python in his work.
      He can help by creating code generators for those languages
      and by extending our visualization toolkit.
    </td>
  </tr>
  <tr>
    <td><img src="static/yatindra.svg" width="100px" /></td>
    <td>
      <strong>Yatindra</strong> is a web programmer who is fluent in JavaScript.
      They can help by bringing our code and tooling into line with modern standards
      and by adding features to make TidyBlocks easier to use.
    </td>
  </tr>
</table>

## Getting Started

1.  Fork <https://github.com/tidyblocks/tidyblocks/> and clone it to your desktop.

1.  Go into the newly-created `tidyblocks` directory
    and run `npm install` to install all of the packages we depend on.
    -   Note: do *not* install `blockly` itself from NPM: madness will ensue.
        We have included a *working* copy of the library in this repository.
