---
permalink: /guide/stats/
title: "Statistics"
headings:
- id: one-sample-t-test
  text: One-sample T Test
- id: two-sample-t-test
  text: Two-sample T Test
---

## One-sample T Test

<img class="block" src="{{page.permalink | append: 'ttest_one.png' | relative_url}}" alt="ttest_one block"/>

Run a one-sample t-test.

- **column**: The column containing the values of interest.
- **mean**: The mean to test against.
- **significance**: The significance threshold.

## Two-sample T Test

<img class="block" src="{{page.permalink | append: 'ttest_two.png' | relative_url}}" alt="ttest_two block"/>

Run a paired t-test.

- **column_a**: The column containing one set of values.
- **column_b**: The column containing the other set of values.
- **significance**: The significance threshold.
