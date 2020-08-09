---
permalink: /es/valores/
title: "Values"
language: es
headings:
- id: columna
  text: Columna
- id: fecha-y-hora
  text: Fecha y hora
- id: logico
  text: Logico
- id: numbero
  text: Numbero
- id: texto
  text: Texto
- id: numero-de-fila
  text: Numero de fila 
- id: valor-exponencial-aleatorio
  text: Exponencial
- id: valor-normal-aleatorio
  text: Normal
- id: valor-uniforme-aleatorio
  text: Uniforme
---

## Columna

<img class="block" src="{{page.permalink | append: 'column.svg' | relative_url}}" alt="column block"/>

Especifica el nombre de una sola columna en los datos.

- **columna**: El nombre de la columna cuyo valor se desea.

## Fecha y hora

<img class="block" src="{{page.permalink | append: 'datetime_val.svg' | relative_url}}" alt="datetime block"/>

Especifica una fecha y hora fijas.

- **AAAA-MM-DD**: El año, mes y día de 4 dígitos unidos con guiones.

## Logico

<img class="block" src="{{page.permalink | append: 'logical_val.svg' | relative_url}}" alt="logical block"/>

Seleccione un valor lógico constante.

- *desplegable*: Selecciona `verdadero` o `falso`.

## Numbero

<img class="block" src="{{page.permalink | append: 'number.svg' | relative_url}}" alt="number block"/>

Especifica un número fijo.

- **numbero**: El número deseado.

## Texto

<img class="block" src="{{page.permalink | append: 'text.svg' | relative_url}}" alt="text block"/>

Especifica un texto fijo.
El valor *no* debe citarse:
Las comillas simples o dobles proporcionadas se incluirán en el texto.
- **texto**: El texto deseado.

## Numero de fila

<img class="block" src="{{page.permalink | append: 'rownum.svg' | relative_url}}" alt="row number block"/>

Genere el número de fila, comenzando por 1.

## Valor exponencial aleatorio

<img class="block" src="{{page.permalink | append: 'exponential.svg' | relative_url}}" alt="exponential random value block"/>

Genere un valor aleatorio a partir de la distribución exponencial con el parámetro de tasa &lambda;.

- **tasa**: el parametro de tasa.

## Variable normal aleatoria

<img class="block" src="{{page.permalink | append: 'normal.svg' | relative_url}}" alt="normal random value block"/>

Genera un valor aleatorio a partir de la distribución normal con media &mu; y desviación estándar &sigma ;.

-  **media**: el centro de la distribucion.
-  **desviacion st**: la dispersion de la distribucion.

## Variable uniforme aleatoria

<img class="block" src="{{page.permalink | append: 'uniform.svg' | relative_url}}" alt="uniform random value block"/>

Genera un valor aleatorio a partir de la distribución uniforme en el rango dado.

-  **bajo**: el extremo bajo del rango.
-  **alto**: el extremo alto del rango.
