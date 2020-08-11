---
permalink: /es/guide/
layout: page
language: en
---

<div id="guide_wrapper">

<div class="guide_lhs">
<h1><a href="../index.html">TidyBlocks</a></h1>

<div align="center">
  <img width="75%" border="1" src="{{ '/static/screenshot.png' | relative_url }}" alt="Screenshot" />
</div>

Una herramienta basada en bloques para la manipulación y el análisis de datos ordenados.
Por favor ve a <https://tidyblocks.tech> o para una versión gratuita en línea
visita [nuestro reprositoria de GitHub]({{site.repo}}).

Este trabajo está disponible gratuitamente bajo la [licencia Hippocratica ]({{ '/license/' | relative_url }}).
Contribuciones de todo tipo son bienvenidas:
Por favor ve a [nuestra guia de contribuidores]({{ '/contributing/' | relative_url }}) para empezar,
y tenga en cuenta que todos los contribuyentes deben cumplir con nuestro [Codigo de conducta]({{ '/conduct/' | relative_url }}).

<h1>Data</h1>
{% include_relative data/index.md %}
<h1>Transforms</h1>
{% include_relative transform/index.md %}
<h1>Plots</h1>
{% include_relative plot/index.md %}
<h1>Statistics</h1>
{% include_relative stats/index.md %}
<h1>Operations</h1>
{% include_relative op/index.md %}
<h1>Values</h1>
{% include_relative value/index.md %}
<h1>Combining</h1>
{% include_relative combine/index.md %}
</div>

<!-- these links should hyperlink to the h1s above -->
<div class="guide_rhs">
 <a>Data</a>
  <br/>
 <a>Transforms</a>
  <br/>
 <a>Plots</a>
  <br/>
 <a>Statistics</a>
</div>

</div>