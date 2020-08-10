---
permalink: /es/op/
title: "Operations"
language: es
headings:
- id: arithmetic
  text: Aritmética
- id: logical
  text: Lógico
- id: types
  text: Tipos
- id: datetime
  text: Fechas/Tiempos
- id: conditional
  text: Condicional
---

<div id="arithmetic" markdown="1">
## Aritmética

<img class="block" src="{{page.permalink | append: 'arithmetic.svg' | relative_url}}" alt="arithmetic block"/>

Este bloque implementa cálculos matemáticos en dos valores.
Acepta números, nombres de columna y bloques de operación anidados.

- *espacio izquierdo*: El lado izquierdo de la operación.
- *desplegable*: Selecciona suma, resta, multiplicación, división, resto o exponenciación.
- *espacio derecho*: El lado derecho de la operación.

<img class="block" src="{{page.permalink | append: 'negate.svg' | relative_url}}" alt="negate block"/>

Deniega un numero.

- *espacio*: El valor a denegar.
</div>

<div id="logical" markdown="1">
## Lógico

<img class="block" src="{{page.permalink | append: 'logical_op.svg' | relative_url}}" alt="logical operation block"/>

Este bloque implementa operaciones lógicas en dos valores.
Acepta cualquier valor en el lado izquierdo y derecho
y produce "verdadero" o "falso".

- *espacio izquierdo*: El lado izquierdo de la operación.
- *despegable*: Selecciona logico AND o logico OR.
- *espacio derecho*: El lado derecho de la operación.

Tenga en cuenta que el AND lógico solo es verdadero si *ambos* lados son verdaderos, mientras que OR lógico es verdadero si *uno o ambos* lados son verdaderos: no es uno o ambos en lugar de uno o el otro.

<img class="block" src="{{page.permalink | append: 'not.svg' | relative_url}}" alt="not block"/>

Produce `verdadero` si el valor es `falso` o `falso` si el valor es `verdadero`.

- *espacio*: El valor a invertir.
</div>

<div id="type" markdown="1">
## Tipos

<img class="block" src="{{page.permalink | append: 'type_check.svg' | relative_url}}" alt="type checking block"/>

Compruebe si un valor es de un tipo en particular.

- *espacio*: El valor a comprobar.
- *despegable*: Selecciona el tipo a convertir.

<img class="block" src="{{page.permalink | append: 'type_convert.svg' | relative_url}}" alt="type conversion block"/>

Convierta un valor de un tipo a otro.

- *espacio*: El valor a convertir.
- *despegable*: Selecciona el tipo a convertir.
</div>

<div id="datetime" markdown="1">
## Fechas/Tiempos

<img class="block" src="{{page.permalink | append: 'datetime_op.svg' | relative_url}}" alt="datetime operation block"/>

Extrae el año, mes o día de un valor de fecha/hora.

- *espacio*: La fecha/tiempo valor a convertir.
- *despegable*: Selecciona el sub-valor a extraer.
</div>

<div id="conditional" markdown="1">
## Condicional

<img class="block" src="{{page.permalink | append: 'conditional.svg' | relative_url}}" alt="conditional block"/>

Seleccione uno de los dos valores en función de una condición.
Se puede usar cualquier valor para la condición o para los resultados si la condición es verdadera o falsa,
pero los valores usados para los casos verdadero y falso deben ser del mismo tipo.

- *primer espacio*: La condición a probar.
- *segundo espacio*: El valor si la condición es verdadera.
- *tercer espacio*: El valor si la condición es falsa.
</div>
