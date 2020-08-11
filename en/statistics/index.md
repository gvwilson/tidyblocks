---
language: en
layout: en/page
permalink: /en/statistics/
title: "Statistics"
headings:
- id: ttest_one
  text: One-sample T test
- id: ttest_two
  text: Two-sample T test
---

<div id="ttest_one" markdown="1">
## One-sample T test

<img class="block" src="{{page.permalink | append: 'ttest_one.svg' | relative_url}}" alt="ttest_one block"/>

Run a one-sample t-test.

- **column**: The column containing the values of interest.
- **mean**: The mean to test against.
- **significance**: The significance threshold.
</div>

<div id="ttest_two" markdown="1">
## Two-sample T test

<img class="block" src="{{page.permalink | append: 'ttest_two.svg' | relative_url}}" alt="ttest_two block"/>

Run a paired t-test.

- **column_a**: The column containing one set of values.
- **column_b**: The column containing the other set of values.
- **significance**: The significance threshold.
</div>
