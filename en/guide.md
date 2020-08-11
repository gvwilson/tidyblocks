---
permalink: /en/guide/
layout: page
language: en
---

<div id="guide_wrapper">

<div class="guide_lhs">
<h1><a href="../index.html">TidyBlocks</a></h1>

<div align="center">
  <img width="75%" border="1" src="{{ '/static/screenshot.png' | relative_url }}" alt="Screenshot" />
</div>

<br/>
<br/>

A blocks-based tool for tidy data manipulation and analysis.
Please see <https://tidyblocks.tech> for a free online version
or visit [our GitHub repository]({{site.repo}}).

This work is made freely available under the [Hippocratic License]({{ '/license/' | relative_url }}).
Contributions of all kinds are welcome:
please see [our contributors' guide]({{ '/contributing/' | relative_url }}) to get started,
and please note that all contributors are required to abide by our [Code of Conduct]({{ '/conduct/' | relative_url }}).

<h1 id="en_data">Data</h1>
{% include_relative data/index.md %}
<h1 id="en_transforms">Transforms</h1>
{% include_relative transform/index.md %}
<h1 id="en_plots">Plots</h1>
{% include_relative plot/index.md %}
<h1 id="en_stats">Statistics</h1>
{% include_relative stats/index.md %}
<h1 id="en_op">Operations</h1>
{% include_relative op/index.md %}
<h1 id="en_values">Values</h1>
{% include_relative value/index.md %}
<h1 id="en_combine">Combining</h1>
{% include_relative combine/index.md %}
</div>

<!-- these links should hyperlink to the h1s above -->
<div class="guide_rhs">
 <a href="#en_data">DATA</a>
  <br/><br/>
 <a href="#en_transforms">TRANSFORMS</a>
  <br/><br/>
 <a href="#en_plots">PLOTS</a>
  <br/><br/>
 <a href="#en_stats">STATISTICS</a>
  <br/><br/>
 <a href="#en_op">OPERATIONS</a>
   <br/><br/>
 <a href="#en_values">VALUES</a>
  <br/><br/>
 <a href="#en_combine">COMBINING</a>
</div>

</div>