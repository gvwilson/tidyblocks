---
layout: post.liquid
title: "A New Design for Join"
author: "Greg Wilson"
date: "2020-12-20T02:00"
---

Our [previous post](https://tidyblocks.tech/blog/2020/11/12/representing-join/)
talked about the problem of representing join operations with blocks.
Our existing implementation uses a "listen for a signal" approach,
which means there is no visual clue that pipeline C depends on pipelines A and B.
In other words,
one of the most complex operations we support is invisible in the user interface.

A join combines two tables,
so the most obvious visual representation uses connectors like this:

<div align="center"><img src="/files/2020/12/join-with-connectors.svg" alt="Join using connectors"/></div>

However,
Blockly doesn't support multi-input blocks like this:

<div align="center"><img src="/files/2020/12/multi-input-blocks.svg" alt="Multi-input blocks"/></div>

Even if it did, multiple joins would quickly become unwieldy:

<div align="center"><img src="/files/2020/12/multi-input-double-join.svg" alt="Multi-input double join"/></div>

We could instead combine vertical and left-to-right control flow:

<div align="center"><img src="/files/2020/12/sideways-join.svg" alt="Sideways join"/></div>

but making blocks work both top-to-bottom and left-to-right on the same canvas would be complicated.
This model also doesn't scale visually to more complicated joins like (A+B)+(C+D),
but we probably don't care:
TidyBlocks is only meant to handle cases that come up during first contact with data science,
and only a handful of the examples in the introductory stats lessons we've looked at require more than one table.

An alternative is to nest one pipeline in another like the body of a `for` loop.
[Maya Gans](https://tidyblocks.tech/authors/#gans-maya) has prototyped an E-shaped block
that treats both incoming data streams as equals:

<div align="center"><img src="/files/2020/12/e-block-screenshot.png" width="300" alt="E-block joins"/></div>

and we're also considering a C-shaped block
where one data stream comes in the top and the other is nested:

<div align="center"><img src="/files/2020/12/c-block-nesting.svg" alt="C-block joins"/></div>

But there's a problem.
One of the datasets in the C-block diagram above is a top block while the other is nested.
To make this work, we could:

1.  Provide a single uncapped Data block to use in either situation,
    All pipelines would then start without a top (capped) block.
    This would be easy to implement, but isn't consistent with other blocks-based systems.

2.  Provide both capped and uncapped Data blocks.
    This will probably be confusing.

3.  Have the Data block change shape depending on where it's placed.
    We *think* this is doable, but would probably also be confusing:
    if a block has a cap, it's signalling pretty clearly that it can't be nested.

4.  Provide a new top block called "Name" to give pipelines names.
    All Data blocks would then click together on both top and bottom edges
    no matter where they were placed.

Option #4 appeals right now because it would be easy to build
and because it would solve the problem of unnamed results.
Right now,
users have to add a "Save As" block to the end of a pipeline to name their results.
Putting the name at the start and carrying that through might (?) be more intuitive,
and would provide a bit of documentation (e.g., a student could call a pipeline "Question 3").

<div align="center"><img src="/files/2020/12/name-block.svg" alt="Adding a Name block"/></div>

We'd be very grateful for input:
if you have any suggestions or better ideas,
please [email us](mailto:info@tidyblocks.tech)
or [reach out on Twitter](https://twitter.com/tidyblocks).
Thanks in advance:
we hope you and yours have a safe and happy New Year.
