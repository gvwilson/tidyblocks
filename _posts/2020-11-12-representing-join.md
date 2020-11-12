---
layout: post.liquid
title: "Representing Joins"
author: "Greg Wilson"
date: "2020-11-12T02:00"
---

It has been a quiet couple of months for TidyBlocks development:
everyone on the team was hit with work deadlines at the same time,
and our first attempt to secure a bit of funding didn't work out.
But the break has given us a chance to reflect on our current interface,
and one thing has become very clear:

> We need a better way to represent joins.

A join combines values from two tables to create a new table.
For example,
suppose we have a table with penguin weights in grams:

| Island | Species | Weight | Sex |
| ------ | ------- | ------ | --- |
| Torgersen | Adelie | 3750 | male |
| Torgersen | Adelie | 3800 | female |
| Biscoe | Adelie | 3250 | female |

and another table showing the nesting area on each island in square meters:

| Island | Area |
| ------ | ---- |
| Torgersen | 12560 |
| Biscoe | 208500 |

If we want to see if there's a relationship between weight and nesting area,
we need to join these two tables by island name:

| Island | Species | Weight | Sex | Area |
| ------ | ------- | ------ | --- | ---- |
| Torgersen | Adelie | 3750 | male | 12560 |
| Torgersen | Adelie | 3800 | female | 12560 |
| Biscoe | Adelie | 3250 | female | 208500 |

Here's the problem:
unlike every other operation in TidyBlocks,
join has *two* tables as input rather than one,
which doesn't fit our linear-stack-of-blocks metaphor.
None of the solutions we've come up with satisfies us:

1.  Our existing implementation uses the "listen for a signal" approach found in Scratch.
    If a pipeline ends in a `saveAs` block,
    its output is saved for display.
    If another pipeline begins with a `join` block,
    it can "listen" until both of the tables it needs are available,
    at which point it starts to run.
    This works,
    but it means that the join operation is invisible in the user interface:
    there is no visual clue that Pipeline Omega depends on Pipelines Alpha and Beta.

2.  Many people have suggested a Y-shaped block with two input connectors on its top edge.
    The problems with this are
    (a) Google Blockly doesn't contain such a block,
    so we'd have to do a lot of work in the guts of a complex framework, and
    (b) it looks pretty clumsy for non-trivial cases.
    As users start adding a few operators to transforms, for example,
    pipelines become wider and wider;
    put two such pipelines side by side
    (or three or four if there are multiple joins)
    and the arrangement quickly becomes incomprehensible.

3.  Other people have suggested adding link lines to show connections between pipelines.
    This helps avoid the ever-wider layout problem mentioned above,
    but again,
    link lines aren't part of Blockly,
    so this approach would require more engineering effort than we have.
    Switching to a toolkit like [Node-RED](https://nodered.org/) would give us connectors for free,
    but then we lose the instant familiarity we've been striving for---we want
    students and teachers who've used Scratch to look at TidyBlocks and immediately say,
    "Oh, I know this."

4.  Finally, there's the idea of using a C-block
    of the kind that Scratch uses for loops, conditionals, and other cases
    where a sub-pipeline needs to nest in a larger pipeline.
    The C-block would join whatever is stacked on top of it
    to whatever runs inside it.
    It won't handle every case,
    but TidyBlocks isn't supposed to;
    the bigger issue is whether it's intuitive or not,
    and if we have to ask the question,
    the answer is probably "no".

So in short, we're stuck:
we need a way to represent joining tables
that we can build with the toolkit we have,
and we're out of ideas.
If you have any, please [get in touch](mailto:info@tidyblocks.tech).
