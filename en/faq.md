---
language: en
layout: en/page
permalink: /en/faq/
title: "FAQ"
---

Who is TidyBlocks for?
:   Our primary audience is students in middle school and high school (ages 10-18)
    who are learning how to use and interpret data.
    We hope that older learners,
    such as students doing introductory statistics at the college level,
    will also find it useful.

Why blocks?
:   For several reasons:
    1.  Many studies have shown that block-based programming is more accessible to novices than text-based programming.
    2.  If school-age users have done any programming before, they have probably used [Scratch](http://scratch.mit.edu),
        so the block interface will already be familiar to them.
    3.  Just as importantly, the interface will already be familiar to their teachers.

Can TidyBlocks do [thing]?
:   The answer is either "no" or "not yet":
    1.  TidyBlocks is never going to be an industrial-strength data analysis tool,
        any more than [Scratch](http://scratch.mit.edu) is meant to replace languages like Java.
        They are both [balance bikes](https://en.wikipedia.org/wiki/Balance_bicycle)
        designed to help people master key concepts before moving on to other tools.
    2.  That said,
        we need to add more blocks to handle the kinds of questions that come up in high school statistics courses.
        Suggestions are very welcome,
        as are examples and help with implementation.
        Please [contact us](mailto:{{site.email}}) if you would like to contribute.

Is TidyBlocks an RStudio product?
:   No.
    The first version was developed by [Maya Gans]({{'/authors/#gans-maya' | relative_url }}) while she was a summer intern,
    but TidyBlocks is a free-standing open source project.

Does TidyBlocks use R or Python?
:   No: TidyBlocks is 100% JavaScript.

Does TidyBlocks generate R or Python code?
:   No,
    but it could.
    While Version 1 generated executable JavaScript directly,
    Version 2 produces [JSON](https://en.wikipedia.org/wiki/JSON)
    that is then translated into runnable code objects.
    Generating R or Python that could be copied and pasted into some other system would be straightforward,
    but from a teaching point of view we think it would be better to get learners to use those systems directly
    once they have learned what they're trying to do.

Do I need to install anything to use TidyBlocks?
:   No.
    TidyBlocks runs in any modern browser without any kind of server process,
    so it does not require you to install anything.
    (This is particularly important for users at schools and libraries,
    whose machines are often locked down for security reasons.)

Do I need to create an account to use TidyBlocks?
:   No,
    and we do not collect any data of any kind about our users.

Can I save projects, results, and plots locally?
:   Yes.
    -   Projects are saved as XML files using Blockly's built-in tools, and can later be reloaded.
    -   TidyBlocks can load CSV data and save the tables that it creates.
    -   Plots can be saved as PNG images (which can then be included in homework hand-ins).

What license does TidyBlocks use?
:   The [Hippocratic License]({{'/license/' | relative_url}}),
    which allows it to be used for anything that doesn't violate basic human rights laws.
    (If what you're teaching or the way you're teaching it violates
    [the Universal Declaration of Human Rights](https://www.un.org/en/universal-declaration-human-rights/),
    we'd rather not be involvd.)

How does the project make decisions?
:   [Maya Gans]({{'/authors/#gans-maya' | relative_url }}),
    [Justin Singh]({{'/authors/#singh-justin' | relative_url }}),
    and [Greg Wilson]({{'/authors/#wilson-greg' | relative_url }})
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
        though this may require work on [Blockly toolkit](https://developers.google.com/blockly/) itself.
    -   If *you teach introductory statistics or data science*,
        please give us examples of problems that TidyBlocks can't handle and tell us how it should.
    -   If *you are fluent in a language other than English*,
        both the interface and the [user guide]({{'/guide/' | relative_url}}) can be translated
        and we'd be happy to coordinate.

Where can I contribute?
:   Please use [our GitHub repository]({{site.github.url}}) to file issues and submit pull requests.
    We also have a Slack channel for regular contributors---please [contact us](mailto:{{site.email}}) if you'd like to join.
