---
permalink: /en/guide/
layout: page
language: en
---

<div id="guide_wrapper">

<div class="guide_lhs">
<h1><a href="../index.html">TidyBlocks</a></h1>

<br/>
<br/>

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

<h1 class="data" id="en_data">DATA</h1>
{% include_relative data.md %}
<h1 class="transform" id="en_transforms">TRANSFORMS</h1>
{% include_relative transform.md %}
<h1 class="plot" id="en_plots">PLOTS</h1>
{% include_relative plot.md %}
<h1 class="stats" id="en_stats">STATISTICS</h1>
{% include_relative stats.md %}
<h1 class="op" id="en_op">OPERATIONS</h1>
{% include_relative op.md %}
<h1 class="values" id="en_values">VALUES</h1>
{% include_relative value.md %}
<h1 class="combine" id="en_combine">COMBINING</h1>
{% include_relative combine.md %}
</div>

<!-- these links should hyperlink to the h1s above -->
<div class="guide_rhs">
 <a class="data" href="#en_data">DATA</a>
  <br/><br/>
 <a class="transform" href="#en_transforms">TRANSFORMS</a>
  <br/><br/>
 <a class="plot" href="#en_plots">PLOTS</a>
  <br/><br/>
 <a class="stats" href="#en_stats">STATISTICS</a>
  <br/><br/>
 <a class="op" href="#en_op">OPERATIONS</a>
   <br/><br/>
 <a class="values" href="#en_values">VALUES</a>
  <br/><br/>
 <a class="combine" href="#en_combine">COMBINING</a>
</div>

</div>