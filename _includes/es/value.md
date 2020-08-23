<div id="column">
<h3>Columna</h3>

<img class="block" src="{{ './value_column.svg' | relative_url }}" alt="column block"/>

Especifica el nombre de una sola columna en los datos.

- **columna**: El nombre de la columna cuyo valor se desea.
</div>

<div id="datetime">
<h3>Fecha y hora</h3>

<img class="block" src="{{ './value_datetime.svg' | relative_url }}" alt="datetime block"/>

Especifica una fecha y hora fijas.

- **AAAA-MM-DD**: El año, mes y día de 4 dígitos unidos con guiones.
</div>

<div id="logical">
<h3>Logico</h3>

<img class="block" src="{{ './value_logical.svg' | relative_url }}" alt="logical block"/>

Seleccione un valor lógico constante.

- *desplegable*: Selecciona `verdadero` o `falso`.
</div>

<div id="number">
<h3>Numbero</h3>

<img class="block" src="{{ './value_number.svg' | relative_url }}" alt="number block"/>

Especifica un número fijo.

- **numbero**: El número deseado.
</div>

<div id="text">
<h3>Texto</h3>

<img class="block" src="{{ './value_text.svg' | relative_url }}" alt="text block"/>

Especifica un texto fijo.
El valor *no* debe citarse:
Las comillas simples o dobles proporcionadas se incluirán en el texto.
- **texto**: El texto deseado.
</div>

<div id="rownum">
<h3>Numero de fila</h3>

<img class="block" src="{{ './value_rownum.svg' | relative_url }}" alt="row number block"/>

Genere el número de fila, comenzando por 1.
</div>

<div id="exponential">
<h3>Valor exponencial aleatorio</h3>

<img class="block" src="{{ './value_exponential.svg' | relative_url }}" alt="exponential random value block"/>

Genere un valor aleatorio a partir de la distribución exponencial con el parámetro de tasa &lambda;.

- **tasa**: el parametro de tasa.
</div>

<div id="normal">
<h3>Variable normal aleatoria</h3>

<img class="block" src="{{ './value_normal.svg' | relative_url }}" alt="normal random value block"/>

Genera un valor aleatorio a partir de la distribución normal con media &mu; y desviación estándar &sigma ;.

-  **media**: el centro de la distribucion.
-  **desviacion st**: la dispersion de la distribucion.
</div>

<div id="uniform">
<h3>Variable uniforme aleatoria</h3>

<img class="block" src="{{ './value_uniform.svg' | relative_url }}" alt="uniform random value block"/>

Genera un valor aleatorio a partir de la distribución uniforme en el rango dado.

-  **bajo**: el extremo bajo del rango.
-  **alto**: el extremo alto del rango.
</div>
