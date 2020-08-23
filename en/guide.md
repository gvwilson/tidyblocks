---
permalink: /en/guide/
layout: page.liquid
title: "Guide"
language: en
---

<div class="guide_container">

<div class="guide_lhs">
 <a class="data" href="#en_data">DATA</a><br/>
 <a class="transform" href="#en_transforms">TRANSFORMS</a><br/>
 <a class="plot" href="#en_plots">PLOTS</a><br/>
 <a class="stats" href="#en_stats">STATISTICS</a><br/>
 <a class="op" href="#en_op">OPERATIONS</a><br/>
 <a class="values" href="#en_values">VALUES</a><br/>
 <a class="combine" href="#en_combine">COMBINING</a><br/>
 <a class="control" href="#en_control">CONTROL</a><br/>
</div>

<div class="guide_rhs">
A blocks-based tool for tidy data manipulation and analysis.
Please see <https://tidyblocks.tech> for a free online version
or visit [our GitHub repository]({{site.repo}}).

This work is made freely available under the [Hippocratic License]({{ '/license/' | relative_url }}).
Contributions of all kinds are welcome:
please see [our contributors' guide]({{ '/contributing/' | relative_url }}) to get started,
and please note that all contributors are required to abide by our [Code of Conduct]({{ '/conduct/' | relative_url }}).

<h1 class="data" id="en_data">DATA</h1>
{% include en/data.md %}
<h1 class="transform" id="en_transforms">TRANSFORMS</h1>
{% include en/transform.md %}
<h1 class="plot" id="en_plots">PLOTS</h1>
{% include en/plot.md %}
<h1 class="stats" id="en_stats">STATISTICS</h1>
{% include en/stats.md %}
<h1 class="op" id="en_op">OPERATIONS</h1>
{% include en/op.md %}
<h1 class="values" id="en_values">VALUES</h1>
{% include en/value.md %}
<h1 class="combine" id="en_combine">COMBINING</h1>
{% include_relative combine.md %}
<h1 class="control" id="en_control">CONTROL</h1>
{% include_relative control.md %}
</div>
</div>
