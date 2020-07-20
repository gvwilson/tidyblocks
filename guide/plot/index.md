---
permalink: /guide/plot/
title: "Plots"
---

## Bar

<img class="block" src="{{page.permalink | append: 'bar.png' | relative_url}}" alt="bar block"/>

The bar block makes the height of the bar proportional to the number of cases in each group.
A bar chart uses height to represent a value, and so the base of the bar must always be shown to produce a valid visual comparison.

- **X_axis**: Which column to use for the X axis.
- **Y_axis**: Which column to use for the Y axis.

## Box

<img class="block" src="{{page.permalink | append: 'box.png' | relative_url}}" alt="box block"/>

The Tukey box plot block summarizes a distribution of quantitative values using a set of summary statistics.
The middle tick in the box represents the median.
The lower and upper parts of the box represent the first and third quartile respectively.
The whisker spans from the smallest data to the largest data within the range [Q1 - 1.5 * IQR, Q3 + 1.5 * IQR]
where Q1 and Q3 are the first and third quartiles while IQR is the interquartile range (Q3-Q1).
Any outlier points beyond the whisker are displayed using point marks.

- **X_axis**: Which column to use for the X axis.
- **Y_axis**: Which column to use for the Y axis.

## Dot

<img class="block" src="{{page.permalink | append: 'dot.png' | relative_url}}" alt="dot block"/>

Display a dot plot.

- **X_axis**: Which column to use for the X axis.

## Histogram

<img class="block" src="{{page.permalink | append: 'histogram.png' | relative_url}}" alt="histogram block"/>

Visualise the distribution of a single continuous variable
by dividing the X axis into bins
and counting the number of observations in each bin.
Histograms display the counts with bars.

- **column**: Which column to bin.
- **bins (10)**: The number of bins.

## Scatter

<img class="block" src="{{page.permalink | append: 'scatter.png' | relative_url}}" alt="scatter block"/>

Display a scatter plot.

- **X_axis**: Which column to use for X coordinates.
- **Y_axis**: Which column to use for Y coordinates.
- **color**: Which column to use for colors (optional).
