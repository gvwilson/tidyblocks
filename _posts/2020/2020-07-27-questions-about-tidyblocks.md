---
title: "Questions About TidyBlocks"
author: "Greg Wilson"
---

Our [first post]({{'/blog/2020/07/26/project-history.html' | relative_url}}) described the history of TidyBlocks so far.
In this post we'd like to answer a few of the questions people have asked.

Is TidyBlocks an RStudio product?
:   No.
    The first version was developed by [Maya Gans]({{'/guide/authors/#gans-maya' | relative_url }}) while she was a summer intern,
    but TidyBlocks is a free-standing open source project.

Does TidyBlocks use R?
:   No.
    We set out to create something that would run entirely in the browser without a back-end server,
    and R does not run in the browser (not even with [WebAssembly](https://webassembly.org/)).

Does TidyBlocks generate R code?
:   No,
    but it could.
    While Version 1 generated executable JavaScript directly,
    Version 2 produces [JSON](https://en.wikipedia.org/wiki/JSON)
    that is then translated into runnable code objects.
    Generating R or Python that could be copied and pasted into some other system would be straightforward,
    but from a teaching point of view we think it would be better to get learners to use those systems directly
    once they have learned what they're trying to do.

What license does TidyBlocks use?
:   The [Hippocratic License]({{'/license/' | relative_url}}),
    which allows it to be used for anything that doesn't violate basic human rights laws.
    (If what you're teaching or the way you're teaching it violates
    [the Universal Declaration of Human Rights](https://www.un.org/en/universal-declaration-human-rights/),
    we'd rather not be involvd.)

How does the project make decisions?
:   [Maya Gans]({{'/guide/authors/#gans-maya' | relative_url }}),
    [Justin Singh]({{'/guide/authors/#singh-justin' | relative_url }}),
    and [Greg Wilson]({{'/guide/authors/#wilson-greg' | relative_url }})
    are responsible for reviewing and merging pull requests,
    prioritizing issues,
    and deploying updated versions.
    For the moment they make decisions by consensus,
    but if we gain more regular contributors,
    we will start using [Martha's Rules](https://third-bit.com/2019/06/13/marthas-rules.html)
    to give everyone involved an equal voice.

How can I contribute?
:   We're glad you asked:
    -   If *you are a JavaScript programmer* and know your way around [React](https://reactjs.org/),
        we could use help fixing bugs, adding features, and cleaning up the code.
    -   If *you are a user experience designer*
        we would be grateful for comments and suggestions on our current UI.
        We would be just as grateful for help with *accessibility*,
        though this may require work on Blockly itself.
    -   If *you teach introductory statistics or data science*,
        please give us examples of problems that TidyBlocks can't handle and tell us how it should.
    -   If *you are fluent in a language other than English*,
        both the interface and the [user guide]({{'/guide/' | relative_url}}) can be translated
        and we'd be happy to coordinate.

Where can I contribute?
:   Please use [our GitHub repository]({{site.github.url}}) to file issues and submit pull requests.
    We also have a Slack channel for regular contributors.
