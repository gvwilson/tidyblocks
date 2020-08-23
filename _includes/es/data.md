<div id="colors">
<h3>Colores</h3>

<img class="block" src="{{ './data_colors.svg' | relative_url }}" alt="color block"/>

Los conjuntos de datos `colores` tiene valores rojo-verde-azul (RGB) para once colores estándar:
negro, rojo, granate, lima, verde, azul, azul marino, amarillo, fucsia, aguamarina y blanco
Cada valor es un número entero en el rango 0… 255.

| Columna    | Tipodedatos        | Valor       |
| ---------  | ---------------    | ----------- |
| name       | text               | nombre color|
| red        | integer (0…255)    | valor rojo  |
| green      | integer (0…255)    | valor verde |
| blue       | integer (0…255)    | valor azul  |

</div>

<div id="earthquakes">
<h3>Terremotos</h3>

<img class="block" src="{{ './data_earthquakes.svg' | relative_url }}" alt="earthquakes block"/>

Este bloque proporciona un subconjunto de datos del Servicio Geológico de EE. UU. sobre terremotos de 2016.

| Columna   | Tipodedatos    | Valor |
| --------- | -----------    | ----- |
| Time      | datetime       | Tiempo universal coordinado |
| Latitude  | number         | grados fraccionarios |
| Longitude | number         | grados fraccionarios |
| Deepth_Km | number (km)    | profundidad en kilómetros fraccionarios |
| Magnitude | number         | Escala Richter  |

</div>

<div id="penguins">
<h3>Pingüinos</h3>

<img class="block" src="{{ './data_penguins.svg' | relative_url }}" alt="penguins block"/>

| Columna            | Tipodedatos    | Valor |
| -----------------  | -----------    | ----- |
| species            | text           | tipo de pingüino |
| island             | text           | donde se encontro al pingüino |
| bill_length_mm     | number (mm)    | longuitud del pico |
| bill_depth_mm      | number (mm)    | profundidad del pico |
| flipper_length_mm  | number (mm)    | longuitud de las aletas |
| body_mass_g        | number (g)     | masa corporal |
| sex                | text           | sexo |

</div>

<div id="sequence">
<h3>Sequencia</h3>

<img class="block" src="{{ './data_sequence.svg' | relative_url }}" alt="sequence block"/>

Cre una secuencia de números del 1 al N inclusive.

- **nombre**: El nombre de la columna que contiene los valores.
- **rango**: El límite superior del rango.

</div>

<div id="user">
<h3>Datos de usuario</h3>

<img class="block" src="{{ './data_user.svg' | relative_url }}" alt="user data block"/>

Utilice un conjunto de datos previamente cargado.

- *desplegable*: Seleccione el conjunto de datos por nombre.
</div>
