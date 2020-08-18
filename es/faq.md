---
permalink: /es/faq/
title: "Preguntas frecuentes"
language: es
---


<br/>
<br/>

¿Para quién es TidyBlocks?
:   Nuestra audiencia principal son los estudiantes de secundaria y preparatoria
    (de 10 a 18 años) que están aprendiendo a utilizar e interpretar datos.
    Esperamos que los alumnos mayores como los estudiantes que realizan una
    introducción a la estadística a nivel universitario, también lo encontrará
    úti

<br/>

¿Por qué bloques?
:   Por varias razones:
    1.  Muchos estudios han demostrado que la programación basada en bloques es
        más accesible para los principiantes que la programación basada en texto.
    2.  Si los usuarios en edad escolar han realizado alguna programación
        antes, probablemente hayan utilizado [Scratch](http://scratch.mit.edu),
        por lo que la interfaz del bloque ya les resultará familiar.
    3.  Igual de importante, la interfaz ya será familiar para sus profesores.

<br/>

¿Puede TidyBlocks hacer [cosa]?
:   La respuesta es "no" o "todavía no":
    1.  TidyBlocks nunca será una herramienta de análisis de datos de nivel
        industrial, más que [Scratch](http://scratch.mit.edu) está destinado a
        reemplazar lenguajes como Java.  Ellos dos [balance
        bikes](https://en.wikipedia.org/wiki/Balance_bicycle) estan diseñados
        para ayudar a las personas a dominar conceptos clave antes de pasar a
        otras herramientas.
    2.  Dicho esto necesitamos agregar más bloques para manejar los tipos de
        preguntas que surgen en los cursos de estadística de la escuela
        secundaria.  Las sugerencias son bienvenidas, como son ejemplos y ayuda
        con la implementación.  Por favor [contact us](mailto:{{site.email}}) si
        le gustaría contribuir.

<br/>

¿TidyBlocks es un producto de RStudio?
:   No.
    La primera versión fue desarrollada por [Maya Gans]({{'/authors/#gans-maya' | relative_url }})
    mientras ella era pasante de verano, pero TidyBlocks es un proyecto de código abierto independiente.

<br/>

¿TidyBlocks usa R o Python?
:   No: TidyBlocks es 100% JavaScript.

<br/>

¿TidyBlocks genera código R o Python?
:   No, pero podria.
    Si bien la Version 1 generaba JavaScript ejecutable directamente, la
    Version 2 produce [JSON](https://en.wikipedia.org/wiki/JSON) que luego se
    traduce en objetos de código ejecutables.  Generar R o Python que se puedan
    copiar y pegar en algún otro sistema sería sencillo, pero desde el punto de
    vista de la enseñanza, creemos que sería mejor hacer que los alumnos usen
    esos sistemas directamente una vez que han aprendido lo que están tratando
    de hacer.

<br/>

¿Necesito instalar algo para usar TidyBlocks?:  
:   No.
    TidyBlocks se ejecuta en cualquier navegador moderno sin ningún tipo de
    proceso de servidor, por lo que no requiere que instales nada.  (Esto es
    particularmente importante para los usuarios de escuelas y bibliotecas,
    cuyas máquinas a menudo están bloqueadas por razones de seguridad.)

<br/>

¿Necesito crear una cuenta para usar TidyBlocks?
:   No, y no recopilamos ningún dato de ningún tipo sobre nuestros usuarios.

<br/>

¿Puedo guardar proyectos, resultados y parcelas localmente?
:   Si.
    -   Los proyectos se guardan como archivos XML utilizando las herramientas
        integradas de Blockly y luego se pueden volver a cargar.
    -   TidyBlocks puede cargar datos CSV y guardar las tablas que crea.
    -   Los gráficos se pueden guardar como imágenes PNG (que puede ser incluido
        en las entregas de trabajos de tarea).

<br/>

¿Qué licencia usa TidyBlocks?
:   La [Licencia Hippocratica ]({{'/license/' | relative_url}}),
    que permite su uso para cualquier cosa que no viole las leyes básicas de derechos humanos.
    (Si lo que está enseñando o la forma en que lo está enseñando viola
    [La Declaracion Universal de Derechos Humanos](https://www.un.org/en/universal-declaration-human-rights/),
    preferimos no involucrarnos.)

<br/>

¿Cómo toma decisiones el proyecto?
:   [Maya Gans]({{'/authors/#gans-maya' | relative_url }}),
    [Justin Singh]({{'/authors/#singh-justin' | relative_url }}),
    y [Greg Wilson]({{'/authors/#wilson-greg' | relative_url }})
    son responsables de revisar y fusionar las solicitudes de extracción,
    priorizar problemas, y la implementación de versiones actualizadas.  De
    momento toman decisiones por consenso, pero si ganamos colaboradores más
    habituales, vamos a empezar a usar [Martha's
    Rules](https://third-bit.com/2019/06/13/marthas-rules.html) para dar a todos
    los involucrados una voz igual.

<br/>

¿Cómo puedo contribuir?
:   Nos alegra que hayas preguntado:
    -   Si *eres un programador de JavaScript* y conoces tu camino alrededor de
        [React](https://reactjs.org/), nos vendría bien ayuda para corregir
        errores, agregar funciones y limpiar el código.
    -   Si *eres un diseñador de experiencia de usuario* Agradeceríamos los
        comentarios y sugerencias sobre nuestra interfaz de usuario actual.
        Estaríamos igualmente agradecidos por la ayuda con *accesibilidad*,
        aunque esto puede requerir trabajo en [Blockly
        toolkit](https://developers.google.com/blockly/) itself.
    -   Si *enseñas estadística introductoria o ciencia de datos*, Por favor,
        danos ejemplos de problemas que TidyBlocks no pueda manejar y díganos
        cómo debería hacerlo.
    -   Si *hablas con fluidez un idioma que no sea el inglés*, tanto la interfaz
        como la [guia de usuario]({{'/guide/' | relative_url}}) puede ser
        traducido y estaremos encantados de coordinar.

<br/>

¿Dónde puedo contribuir?
:   Por favor use [our GitHub repository]({{site.github.url}}) para presentar
    problemas y enviar solicitudes de extracción.  También tenemos un canal de
    Slack para colaboradores habituales --- por favor
    [contactanos](mailto:{{site.email}}) si quieres unirte.
