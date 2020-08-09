---
permalink: /es/stats/
title: "Estadisticas"
language: es
---

<img class="block" src="{{page.permalink | append: 'ttest_one.svg' | relative_url}}" alt="ttest_one block"/>

Hacer un t-test de una muestra.

- **columna**: La columna que contiene los valores de interes.
- **media**: La media a probar.
- **significativo**: El limite del valor significativo.

<img class="block" src="{{page.permalink | append: 'ttest_two.svg' | relative_url}}" alt="ttest_two block"/>

Hacer un t-test pareado.

- **columna_a**: La columna que contiene uno de los conjuntos de valores.
- **columna_b**: La columna que contiene el otro de los conjuntos de valores.
- **significativo**: El limite del valor significativo.
