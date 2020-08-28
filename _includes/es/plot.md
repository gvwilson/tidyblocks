<div id="bar">
<h3>Barras</h3>

<img class="block" src="{{ './plot_bar.svg' | relative_url }}" alt="bar block"/>

El bloque de barra hace que la altura de la barra sea proporcional al número de casos en cada grupo.
Un gráfico de barras usa la altura para representar un valor, por lo que la base de la barra siempre debe mostrarse para producir una comparación visual válida.

- **Eje_x**: Qué columna usar para el eje X.
- **Eje_y**: Qué columna usar para el eje Y.
</div>

<div id="box">
<h3>Cajas</h3>

<img class="block" src="{{ './plot_box.svg' | relative_url }}" alt="box block"/>

El bloque de diagrama de caja de Tukey resume una distribución de valores cuantitativos utilizando un conjunto de estadísticas de resumen.
La marca del medio en el cuadro representa la mediana.
Las partes inferior y superior del cuadro representan el primer y tercer cuartil respectivamente.
El bigote abarca desde los datos más pequeños hasta los datos más grandes dentro del rango [Q1 - 1.5 * IQR, Q3 + 1.5 * IQR]
donde Q1 y Q3 son el primer y tercer cuartiles, mientras que IQR es el rango intercuartílico (Q3-Q1).
Los puntos atípicos más allá del bigote se muestran mediante marcas de puntos.

- **Eje_x**: Qué columna usar para el eje X.
- **Eje_y**: Qué columna usar para el eje Y.
</div>

<div id="dot">
<h3>Puntos</h3>

<img class="block" src="{{ './plot_dot.svg' | relative_url }}" alt="dot block"/>

Muestra un grafico de puntos.

- **Eje_x**: Qué columna usar para el eje X.
</div>

<div id="histogram">
<h3>Histograma</h3>

<img class="block" src="{{ './plot_histogram.svg' | relative_url }}" alt="histogram block"/>

Visualice la distribución de una única variable continua
dividiendo el eje X en grupos de clase
y contando el número de observaciones en cada contenedor.
Los histogramas muestran los recuentos con barras.

- **columna**: Qué columna agrupar.
- **bins (10)**: El numero de grupos.
</div>

<div id="scatter">
<h3>Dispersion</h3>

<img class="block" src="{{ './plot_scatter.svg' | relative_url }}" alt="scatter block"/>

Muestra un diagrama de dispersión.

- **Eje_x**: Qué columna usar para el eje X.
- **Eje_y**: Qué columna usar para el eje Y.
- **color**: Qué columna usar para los colores (opcional).
- **Añadir linea**: ¿Muestra una línea de regresión lineal?
</div>
