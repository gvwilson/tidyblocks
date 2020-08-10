---
permalink: /es/combine/
title: "Uniendo"
language: es
headings:
- id: join
  text: Unir
- id: glue
  text: Pegar
---

<div id="join" markdown="1">
## Unir

<img class="block" src="{{page.permalink | append: 'join.svg' | relative_url}}" alt="join block"/>

Une dos tablas haciendo coincidir los valores en la columna X de la tabla A
con los valores de la columna Y de la tabla B.
Si la tabla A contiene:

| num | nomb |
| --- | ---- |
|   1 |   p1 |
|   2 |   p2 |
|   3 |   p3 |

y la table B contiene:

| val | etiqu |
| --- | ----- |
|   1 |   q11 |
|   1 |   q12 |
|   3 |   q3  |
|   4 |   q4  |

y las tablas se unen por `num` y` val`,
entonces la tabla final contiene filas para los emparejamientos 1 y 3:

| \_unir\_ | A_nomb | B_etiqu |
| -------- | ------ | ------- |
| 1        |    p1  |     q11 |
| 1        |    p1  |     q12 |
| 3        |    p3  |     q3  |

La nueva columna <code>\_unir\_</code> contiene los valores que emparejaron,
mientras que la otra columna aparece como <code><em>tabla</em>\_<em>columna</em></code>.

- **tabla_izquierda**: El nombre usado para identificar una tabla en un  [report](../transform/#report) en bloque.
- **columna_izquierda**: La columna a unir de la tabla.
- **tabla_derecha**: El nombre usado para identificar la tabla en un [report](../transform/#report) en bloque.
- **columna_derecha**: La columna a unir de la tabla.
</div>

<div id="glue" markdown="1">
## Pegar

<img class="block" src="{{page.permalink | append: 'glue.svg' | relative_url}}" alt="glue block"/>

Combina las filas de dos tablas para crear una nueva tabla.
Las tablas de entrada deben tener el mismo número de columnas,
y esas columnas deben tener los mismos nombres.
Se agrega una nueva columna para mostrar de dónde proviene cada fila.
Por ejemplo,
si la tabla A contiene:

| num | nomb |
| --- | ---- |
|   1 |   p1 |
|   2 |   p2 |

y la tabla B contiene:

| num | nomb |
| --- | ---- |
|   2 |   q2 |
|   3 |   q3 |

y la columna que etiqueta se llama `fuente`,
entonces la tabla final contiene:

| num | nomb | fuente |
| --- | ---- | ------ |
|   1 |   p1 |      A |
|   2 |   p2 |      A |
|   2 |   q2 |      B |
|   3 |   q3 |      B |

- **tabla_izquierda**: El nombre usado para identificar una tabla en un  [report](../combine/#report) en bloque.
- **tabla_derecha**: El nombre usado para identificar una tabla en un  [report](../combine/#report) en bloque.
- **etiqueta**: El nombre de la columna que contiene el origen de la fila.
</div>
