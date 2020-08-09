---
permalink: /es/glosario/
title: "Glosario"
language: es
---

{:auto_ids}
agregación
:   Un sinonimo para [resumir](#resumir).

Booleano
:   Un valor [logico](#logica) que es o `verdadero` o `falso`.
    El nombre proviene del matemático George Boole.

columna
:   Cada columna de una [tabla](#tabla) containe cero o mas filas
    y es referido por su [nombre columna](#[nombre-columna).
    En estadística, una columna es una [variable](#variable) que se ha observado o medido,
    pero preferimos el término "columna" para evitar confusiones con variables en lenguajes de programación.

nombre columna
:   Cada columna de una [tabla](#tabla) debe tener un nombre distinto
    (aunque las columnas de diferentes tablas pueden tener los mismos nombres).
    El nombre de una columna debe comenzar con el guión bajo '_' o una letra,
    y solo puede contener guiones bajos, letras y dígitos.
    TidyBlocks crea automáticamente nombres para algunas columnas,
    como `_groupo_` para la columna que contiene [ID de grupo](#ID-de-grupo).

fecha y hora
:   Un momento en el tiempo representado por años, meses, días, horas, minutos y segundos.
    Las fechas y horas siempre se almacenan en [Coordenadas de hora universal](# coordenadas de hora universal),
    y también se conocen como [marcas de tiempo](#marca-de-tiempo).
    Las fechas y horas se escriben como "AAAA-MM-DD:hh:mm:ss".

expresion
:  Algo que realiza una [operación](#operación) para producir un [valor](# valor).
    Las expresiones se pueden combinar para crear nuevas expresiones:
    por ejemplo,
    la expresión `(temperatura - 32) * (5/9)` usa la multiplicación
    para combinar dos expresiones más pequeñas que usan resta y división.

grupo
:  Un subconjunto de las [filas](#fila) en una [tabla](#tabla)
    que tienen los mismos valores en una o más [columnas](#columna).
    TidyBlocks le da a cada grupo un ID único [ID de grupo](#ID de grupo).

Identificación del grupo
:   El identificador único para un [grupo](#grupo) en una [tabla](#tabla).
    TidyBlocks almacena automáticamente los ID de grupo en una columna llamada `_grupo_`.

logico
:   Un valor que es o `verdadero` or `falso`.

valor que falta
: Un agujero en un conjunto de datos.
    Los valores que faltan a menudo se denominan [NA](#na) (abreviatura de "no disponible").
    Falta técnicamente no es lo mismo que [No es un número](#nan) (NaN),
    pero TidyBlocks los trata de la misma manera.

NA
:   Un valor perdido.
    (La abreviatura es la abreviatura de "no disponible").

NaN
:   Abreviatura de "No es un número",
    este es un valor especial que se utiliza para representar el infinito y otros "números" extraños.
    TidyBlocks no almacena NaN,
    pero en su lugar lo trata como un [valor perdido](#valor-perdido).

operacion
:   Algo que se puede hacer con los datos
    como agregar o extraer el mes de una [fecha y hora](#fecha-y-hora).

registro
:  Un solo conjunto de observaciones relacionadas.
   Los registros se almacenan como [filas](#fila) en [tablas](#tabla).

fila
:   Cada fila de una [tabla](#tabla) abarca cero o más [columnas](#columnas)
    y almacena un único conjunto de observaciones relacionadas.
    Las filas a menudo se llaman [registros](#registro),
    y la mayoria de [operaciones](#operacion) en TidyBlocks funciona dentro de filas.

Cadena de caracteres
:   Un sinonimo para [texto](#texto).

resumen
:   Combine muchos valores en uno.
   Totalizar, calcular el promedio y encontrar el mínimo son algunas formas de resumir valores.

table
:   Un conjunto de [filas](#filas) y [columnas](#columnas) componiendo un único conjunto de datos.
    La mayoría de los bloques de TidyBlocks crean una nueva tabla a partir de una existente.

texto
:   Datos que consisten en letras, dígitos, puntuación, espacios y otros caracteres.
    El texto "123" `se ve igual que el número 123, pero es un tipo de valor diferente.

marcas de tiempo
:   Un momento único en el tiempo.
    TidyBlocks prefiere el termino [fecha y hora](#fecha y hora).

tipo
:   Un tipo de dato.
    TidyBlocks tiene números (que pueden ser enteros o tener partes fraccionarias),
    texto (a menudo llamado [Cadena_de_caracteres](#Cadena_de_caracteres) por programadores),
    [Booleanos](#booleano) (tambien llamado [valores logicos](#logico), 
aunque realmente no hay valores ilógicos),
    [fecha y hora](#fecha y hora) (also called [marcas de tiempo](#marcas de tiempo),
   y un marcador especial para [valores faltantes](#valores faltantes).

Coordenadas de tiempo universal
:   La hora estándar a partir de la cual se miden las zonas horarias.
    A menudo abreviadas "UTC" (universal cordinated times).

valor
:   Una sola pieza de datos en una [fila](#fila) and [columna](#columna) de una [tabla](#tabla).
   Cada valor tiene un [tipo](#tipo),
    y algunas [operaciones](#operacion) solo funcionan en ciertos tipos de valores.

variable
:   En estadística, algo que se ha observado o medido.
    Las variables corresponden a [columnas](#columna) en [tablas](#tablas);
    a menudo usamos el término "columna" para evitar confusiones con
    la idea de una variable en un lenguaje de programación.
