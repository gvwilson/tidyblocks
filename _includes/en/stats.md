<div id="ttest_one">
<h3>One-sample T test</h3>

<img class="block" src="{{ './stats_ttest_one.svg' | relative_url }}" alt="ttest_one block"/>

Run a one-sample t-test.

- **column**: The column containing the values of interest.
- **mean**: The mean to test against.
- **significance**: The significance threshold.
</div>

<div id="ttest_two">
<h3>Two-sample T test</h3>

<img class="block" src="{{ './stats_ttest_two.svg' | relative_url }}" alt="ttest_two block"/>

Run a paired t-test.

- **column_a**: The column containing one set of values.
- **column_b**: The column containing the other set of values.
- **significance**: The significance threshold.
</div>

<div id="k_means">
<h3>K-means clustering</h3>

<img class="block" src="{{ './stats_k_means.svg' | relative_url }}" alt="k-means clustering block"/>

Use [k-means clustering](../glossary/#k-means-clustering) to group data in two dimensions.

- **X_axis**: Which column to use for the X axis.
- **Y_axis**: Which column to use for the Y axis.
- **number (2)**: The number of clusters to create.
- **label**: The new column containing each row's cluster ID.
</div>

<div id="silhouette">
<h3>Silhouette</h3>

<img class="block" src="{{ './stats_silhouette.svg' | relative_url }}" alt="silhouette block"/>

Calculate the [silhouette](../glossary/#silhouette) for every two-dimensional point in clustered data.

- **X_axis**: Which column to use for the X axis.
- **Y_axis**: Which column to use for the Y axis.
- **label**: The column containing each row's cluster ID.
- **score**: The silhouette score for that point.
</div>
