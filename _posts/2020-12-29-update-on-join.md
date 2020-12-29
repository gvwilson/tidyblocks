---
layout: post.liquid
title: "Update on Join"
author: "Greg Wilson"
date: "2020-12-29T02:00"
---

Our [previous post](https://tidyblocks.tech/blog/2020/12/20/a-new-design-for-join/)
outlined a new design for representing joins.
To recap,
in our existing implementation the pipelines that are producing data to be joined
must use a `saveAs` block to save that data;
each `join` block waits until the data it needs is available.
This works,
but the relationship between pipelines that produce data
and pipelines that consume it is implicit,
i.e.,
the most complex operation we support is invisible in the user interface.

The obvious way to fix this is to draw lines from producers to consumers,
but Blockly doesn't support that.
What we have tried instead is to nest the two producing pipelines in an E-shaped block:

<div align="center"><img src="/files/2020/12/e-block-screenshot.png" width="300" alt="E-block joins"/></div>

and more recently a C-shaped block
where one table comes in the top and the other is nested:

<div align="center"><img src="/files/2020/12/c-block-prototype.png" width="300" alt="Cxs-block joins"/></div>

But there's a problem:
what shape should `data` blocks be?

1.  There's a convention in Scratch-style programs
    that blocks that can be the start of a pipeline have a curved cap on top
    rather than a connector tab
    so that users can see how they're supposed to be used.

1.  Our `data` blocks (and random number generation blocks) currently have these curved caps
    because every pipeline needs to start with data.

1.  In order for the inner pipeline of a `join` to start with a `data` block,
    the `data` block must have a connector tab on top instead.

1.  But then simple pipelines can't start with `data` blocks.

We've thought of several fixes, none of which are satisfying.
The first is to allow pipelines to start with `data` blocks that have connector tabs on top.
We can make this work, but it breaks the (very strong) convention that
pipelines start with capped blocks.

The second is to create a capped `name` block whose sole purpose is to start a pipeline.
This is what the second screenshot above uses,
and we managed to convince ourselves that it was a good thing in its own right:
students can use the titles to name parts of a multi-part homework assignment
and the titles can be used as default names for the pipelines' output
(instead of the "unnamed result #123" names we are using right now).

However,
if we take the second approach,
there's nothing to stop a user from using something that *isn't* a `data` block
as the first block inside a `join` block.
Blocks like `filter` and `select` also have a connector tab on top,
but TidyBlocks shouldn't allow users to start a sub-pipeline with them.

The ideal solution (for some value of "ideal") would be
to provide different kinds of connector tabs
to show what can be connected to what,
but Blockly doesn't seem to support that:
we can change th shape of *all* connectors,
but not provide multiple kinds.
There is a mechanism to forbid certain connections programmatically,
but we think it would be very frustrating for users,
who (quite reasonably) will expect that two blocks with identical top connectors ought to be connectable the same way.

So we're back to square one:
the things we can implement don't seem intuitive,
and we can't implement the things that would be intuitive.
We'd be very grateful for ideas:
if you have any,
please [email us](mailto:info@tidyblocks.tech)
or [reach out on Twitter](https://twitter.com/tidyblocks).

Thanks in advance,
and have a safe and happy New Year.
