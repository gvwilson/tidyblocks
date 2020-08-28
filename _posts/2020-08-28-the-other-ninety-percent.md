---
layout: post.liquid
title: "The Other Ninety Percent"
author: "Greg Wilson"
date: "2020-08-28T12:00"
---

We made several improvements to TidyBlocks this week,
but not all of them are visible to users.
The ones that are include:

-   More of the interface has been translated.
-   We now have a block for calculating running sums and averages.
-   And there is another new block for shifting columns up and down
    so that users can do things like compare today's rainfall with yesterday's.
-   Users can also now re-seed the random number generator...
-   ...and put data in bins.

But a lot of this week's work is behind the scenes---what
people in theater sometimes call "the other 90%" of getting a show on stage.
First,
we moved the functions that do k-means clustering and silhouette scoring
from our code base into the [simple-statistics](https://simplestatistics.org/) package,
and we're in the process of moving functions
that calculate relative error and check for approximate equality as well.
Having these in the same place as the other statistical tools we rely on
will make our code easier to understand,
and hopefully other people will find them useful outside of TidyBlocks.

But the big change
is converting our website from [Jekyll](https://jekyllrb.com/)
which [GitHub Pages](https://pages.github.com/) uses by default,
to a JavaScript tool called [Eleventy](https://www.11ty.dev/).
It took longer than we expected,
and we still have [a few issues](https://github.com/11ty/eleventy/issues/1377) to finish off,
but now people only have to install one technology stack rather than two
if they want to make and test contributions.
We think that's essential to making TidyBlocks more inclusive,
because as [this paper](https://journals.plos.org/ploscompbiol/article?id=10.1371%2Fjournal.pcbi.1007296) says:

> Getting set up to work on a project---going from "I want to help"
> to "I'm able to help" to "I'm helping"---is often someone's first experience as a community participant.
> Any complexity or confusion at this point is therefore a significant barrier to participation...
> By treating the process of getting involved with the same care and attention you give to the product itself,
> you're making it clear that you value those contributors' time and effort...

We're going to pause work on features for a while
and try to put together some examples
to show what TidyBlocks can do
and uncover what it still can't.
If you'd like to help,
please [get in touch](mailto:info@tidyblocks.tech).
