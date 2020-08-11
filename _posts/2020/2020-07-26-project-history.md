---
layout: post
title: "Project History"
author: "Greg Wilson"
---

TidyBlocks officially started in May 2019,
but its roots go back to the creation of [Scratch](https://en.wikipedia.org/wiki/Scratch_%28programming_language%29) in the early 2000s,
and beyond that to the programming language [Logo](https://en.wikipedia.org/wiki/Logo_%28programming_language%29) designed in the late 1960s.
Both use [turtle graphics](https://en.wikipedia.org/wiki/Turtle_graphics) to make programming more accessible,
but Scratch went further by allowing people to build programs by clicking blocks together.
Its interface reduces [cognitive load](https://en.wikipedia.org/wiki/Cognitive_load) by making simple syntax mistakes impossible
(you can't forget semi-colons if they aren't there)
and makes the structure of the program much easier to see and understand.

But `for` loops and `if`/`else` statements that animate sprites are only one kind of computation,
and judging by the number of students who wrote
the [AP exams](https://research.collegeboard.org/programs/ap/data/archived/ap-2018) in the US between 2008 and 2018,
it's not the most widely used:

| Subject          |    2008 |    2018 | Change |
| ---------------- | ------: | ------: | -----: |
| Calculus         | 222,835 | 308,538 |   +38% |
| Computer Science |  15,537 |  65,133 |  +319% |
| Statistics       | 108,284 | 222,501 |  +105% |

The growth of Computer Science is impressive,
but the absolute numbers for Statistics are still several times higher.
While Scratch is beautiful and effective, it's not designed for doing or teaching data science:
the [online version](https://scratch.mit.edu/) doesn't even include a way to load or store data tables.
We therefore wanted to create a Scratch-like environment
capable of handling the kinds of questions that come up on the AP exam
(and similar exams in other countries like [A Levels](https://en.wikipedia.org/wiki/GCE_Advanced_Level) in the UK).
We also wanted to create something that would prepare users for full-strength data science tools
in the way that Scratch prepares people for languages like Python and Java.

[Maya Gans]({{'/authors/#gans-maya' | relative_url}}) started work in May 2019 as an intern with [RStudio](http://rstudio.com).
Over the next three months she built a fully-functional prototype
using the same [Blockly toolkit](https://developers.google.com/blockly/) that underpins in Scratch.
[She learned a lot in a hurry](https://education.rstudio.com/blog/2019/10/my-javascript-internship-at-rstudio/),
and wowed the crowd with [her demo at rstudio::conf 2020](https://resources.rstudio.com/resources/rstudioconf-2020/tidyblocks-using-the-language-of-the-tidyverse-in-a-blocks-based-interface/).

Like most prototypes, though, that first version had a lot of [technical debt](https://en.wikipedia.org/wiki/Technical_debt).
Blockly is a complex framework---in our opinion, more complex than it needs to be---and the code in Version 1 was very brittle as a result.
To address this,
[Greg Wilson]({{'/authors/#wilson-greg' | relative_url}}) started rewriting TidyBlocks' internals in March 2020,
and in July [Justin Singh]({{'/authors/#singh-justin' | relative_url}}) began work on a modern user interface
using [React](https://reactjs.org/).

And that brings us to where we are now.
We have blocks that implement the core operations in [the tidyverse](https://www.tidyverse.org/),
which we think is the most user-friendly framework for data science available.
We're a bit light on statistical tests right now,
but we can select, filter, mutate, and summarize [tidy data](https://en.wikipedia.org/wiki/Tidy_data),
join tables in a couple of different ways,
and create plots with [Vega-Lite](https://vega.github.io/vega-lite/).
Oh,
and did we mention 100% branch coverage in our unit tests?

We believe we now have a solid foundation for further work.
A new block can be added and tested in under fifteen minutes,
so we're ready to start adding more statistical tests from the [Simple Statistics](https://simplestatistics.org/) package,
working through examples from both old AP exams,
and seeing how much of the excellent new book [*Data Science in Education Using R*](https://datascienceineducation.com/)
we can translate into blocks.
It's going to be a lot of work,
but having a user-friendly interface that can run on school and library computers without any installation requirements
and that will serve as a bridge to full-strength data science tools is pretty exciting.
If you'd like to help us,
please [get in touch](mailto:gvwilson@third-bit.com).
