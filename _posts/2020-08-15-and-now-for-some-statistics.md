---
layout: post.liquid
title: "And Now for Some Statistics"
author: "Greg Wilson"
date: "2020-08-15T12:00"
---

It has been another busy week for TidyBlocks:
we have a beautiful new layout courtesy of [Maya Gans]({{'/authors/#gans-maya' | relative_url}}),
we can download SVG versions of all our blocks at once thanks to [Justin Singh]({{'/authors/#singh-justin' | relative_url }}),
and we have a new Twitter account [@tidyblocks](https://twitter.com/tidyblocks).

We have also started to add more statistical blocks
so that people can use TidyBlocks in high school and college classrooms.
We are basing our work on the [Simple Statistics](https://simplestatistics.org/) library
created by [Tom MacWright](https://macwright.com/):
it is well documentd,
only 20kb in compressed form,
and has most of the functions we need.

But "most" isn't "all",
so I submitted [our first pull request](https://github.com/simple-statistics/simple-statistics/pull/482) this week
to add k-means clustering.
I learned something interesting along the way:
there's a big difference between algorithms and implementations.
The naïve k-means clustering algorithm is pretty simple:

1.  Decide how many clusters you want.
2.  Create that many *centroids* at random.
3.  Repeatedly:
    1.  Label each point according to which centroid it's closest to.
    2.  Calculate a new centroid for each cluster by finding the average position of the points in that group.
    3.  If the centroids haven't moved, stop.

Simple, right?
But consider this one-dimensional case in the unit square:
the points are at 0.0 and 0.5,
and your initial centroids are at 0.25 and 1.0.
Both points belong to Group 0,
so Group 1 is empty.
How do you calculate its new position?
So far as I can tell by looking at a couple of other implementations (thanks, [Julia](https://juliasilge.com/))
and asking some questions (thanks, [Dhavide](https://dhavide.github.io/index.html)),
the answer is either:

1.  Ignore the possibility, which effectively becomes case 2 when the code attempts to divide by zero.
2.  Raise an error and ask the user to try again with a different random starting point.
3.  Return fewer groups than the user asked for.

None of these are well documented (or documented at all).
Libraries *do* try to prevent this problem from arising in the first place by:

1.  choosing actual points as initial points, or
1.  choosing initial points within the bounding box of the actual points.

The first strategy clearly prevents friendless centroids on the first pass,
but I cannot find a proof that the second does,
or that either guarantees friendless centroids won't arise eventually.
On the other hand,
I can't construct a case that *does* produce friendless centroids,
which means I can't test the error-handling code in the function I wrote.

K-means clustering should be deployed within the week.
We hope you'll find it useful;
if there are other simple statistical methods you'd like us to add,
please [let us know](mailto:info@tidyblocks.tech).
