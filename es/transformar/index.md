---
language: es
layout: es/page
permalink: /es/transformar/
title: "Transformar"
headings:
- id: create
  text: Crear
- id: drop
  text: Descartar
- id: filter
  text: Filtrar
- id: groupBy
  text: Agrupar por
- id: saveAs
  text: Save As
- id: select
  text: Seleccionar
- id: sort
  text: Ordernar
- id: summarize
  text: Resumir
- id: ungroup
  text: Desagrupar
- id: unique
  text: Unico
---

<div id="create" markdown="1">
## Crear

<img class="block" src="{{page.permalink | append: 'create.svg' | relative_url}}" alt="create block"/>

Añade nuevas columnas manteniendo las existentes keeping existing ones.
Una columna puede ser reemplazada si a la nueva columna se le da el nombre de la columna existente.

- **nueva_columna**: Nombre para la nueva columna.
- *primer espacio*: Un [Valor](../value/) o el resultado de una [operascion](../operation/).
</div>

<div id="drop" markdown="1">
## Descartar

<img class="block" src="{{page.permalink | append: 'drop.svg' | relative_url}}" alt="drop block"/>

Descarta una o más columnas de los datos.
Este bloque no es estrictamente necesario; puede ignorar una columna si no la necesita, pero
descartar columnas a menudo facilita la lectura de la pantalla.
Este bloque es lo contrario de [seleccionar](../transform/#select).

- **columna, columna**: Una lista separada por comas de los nombres de las columnas que se eliminarán.
</div>

<div id="filter" markdown="1">
## Filtrar

<img class="block" src="{{page.permalink | append: 'filter.svg' | relative_url}}" alt="filter block"/>

Mantiene un subconjunto de filas que pasen alguna prueba como `edad> 65` o `país = "Islandia"`.
La prueba se verifica de forma independiente para cada fila,
y las pruebas se pueden combinar utilizando el [y](../operation/#logical),
[o](../operation/#logical),
and [no](../operation/#not) blocks.

-  *expresion*: La prueba debe pasar cada fila para ser incluida en el resultado.
</div>

<div id="groupBy" markdown="1">
## Agrupar por

<img class="block" src="{{page.permalink | append: 'group_by.svg' | relative_url}}" alt="grouping block"/>

La mayoría de las operaciones de datos se realizan en grupos de registros que comparten valores, como personas del mismo país.
Este bloque agrega una nueva columna a la tabla llamada`_groupo_` que tiene un valor único para cada grupo.
La agrupación se puede eliminar utilizando el bloque [desagrupar](../transform/#ungroup).

- **columna, columna**: Una lista separada por comas de los nombres de las columnas para agrupar.
   Cada combinación única de valores en estas columnas produce un grupo.
</div>

<div id="saveAs" markdown="1">
## Save As

FIXME
</div>

<div id="select" markdown="1">
## Seleccionar

<img class="block" src="{{page.permalink | append: 'select.svg' | relative_url}}" alt="select block"/>

Elija columnas de una tabla: las columnas que no tengan nombre se eliminarán.Este bloque no es estrictamente necesario,
dado que las columnas innecesarias pueden simplemente ignorarse,
pero descartar columnas innecesarias puede facilitar la lectura de la pantalla. Este bloque es el opuesto de [descartar](../transform/#drop).

- **columna, columna**: Una o más columnas a mantener.
</div>

<div id="sort" markdown="1">
## Ordenar

<img class="block" src="{{page.permalink | append: 'sort.svg' | relative_url}}" alt="sort block"/>

Ordene las filas de una tabla según los valores de una o más columnas.

- **columna, columna**: A comma-separated list of the names of the columns to sort by.
- **Descendiendo**: If checked, sort in descending order (i.e., greatest value first).
</div>

<div id="summarize" markdown="1">
## Resumir

<img class="block" src="{{page.permalink | append: 'summarize.svg' | relative_url}}" alt="summarize block"/>

Resuma los valores en una o más columnas.
Si los datos han sido [agrupado](../transform/#group),
one summary row is created for each group.
The summary values are put in a new column <code><em>op</em>\_<em>col</em></code>,
e.g., <code>mean\_age</code>.

-   *desplegable*: qué operación de resumen usar.
-   **columna**: que columna se va a resumir.
</div>

<div id="ungroup" markdown="1">
## Desagrupar

<img class="block" src="{{page.permalink | append: 'ungroup.svg' | relative_url}}" alt="ungroup block"/>

Deshace el agrupamiento greado por [agrupar](../transform/#group)
quitando el especial \_group\_ column.
</div>

<div id="unique" markdown="1">
## Unico

<img class="block" src="{{page.permalink | append: 'unique.svg' | relative_url}}" alt="unique block"/>

Descarte las filas que contienen valores redundantes.
Si varias filas tienen los mismos valores en las columnas especificadas
pero valores diferentes en otras columnas,
una fila de ese grupo se elegirá arbitrariamente y se mantendrá.

- **columna, columna**: Una o más columnas para verificar valores distintos.
</div>
