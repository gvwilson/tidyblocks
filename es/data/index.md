<div id="colors" markdown="1">
### Colores

<img class="block" src="{{ 'es/data/colors.svg' | relative_url }}" alt="color block"/>

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

<div id="earthquakes" markdown="1">
### Terremotos

<img class="block" src="{{ 'es/data/earthquakes.svg' | relative_url }}" alt="earthquakes block"/>

Este bloque proporciona un subconjunto de datos del Servicio Geológico de EE. UU. sobre terremotos de 2016.

| Columna   | Tipodedatos    | Valor |
| --------- | -----------    | ----- |
| Time      | datetime       | Tiempo universal coordinado |
| Latitude  | number         | grados fraccionarios |
| Longitude | number         | grados fraccionarios |
| Deepth_Km | number (km)    | profundidad en kilómetros fraccionarios |
| Magnitude | number         | Escala Richter  |

</div>

<div id="penguins" markdown="1">
### Pingüinos

<img class="block" src="{{ 'es/data/penguins.svg' | relative_url }}" alt="penguins block"/>

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

<div id="sequence" markdown="1">
### Sequencia

<img class="block" src="{{ 'es/data/sequence.svg' | relative_url }}" alt="sequence block"/>

Cre una secuencia de números del 1 al N inclusive.

- **nombre**: El nombre de la columna que contiene los valores.
- **rango**: El límite superior del rango.

</div>

<div id="user" markdown="1">
### Datos de usuario

<img class="block" src="{{ 'es/data/user_data.svg' | relative_url }}" alt="user data block"/>

Utilice un conjunto de datos previamente cargado.

- *desplegable*: Seleccione el conjunto de datos por nombre.
</div>
