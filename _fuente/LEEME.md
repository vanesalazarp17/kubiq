# Catálogo de KUBIQ Academy

La fuente de los programas y sus niveles es `cursos.json`. El generador la
utiliza para actualizar las tarjetas de inicio, la guía por edades, el modal de
cada curso, las opciones de matrícula, las páginas de programa y el mapa del sitio.
Las páginas resultantes son HTML estático y se pueden abrir o servir como hasta ahora.

## Añadir un nivel a un programa

1. Busca el programa en `cursos.json` y copia un objeto de su lista `niveles`.
   Asigna un `id` único, por ejemplo `scratch-proyectos`.
2. Completa el nombre, la edad, las sesiones, los minutos, la imagen y los
   textos de la tarjeta, la ficha y el modal. Guarda la imagen en `imagenes/`.
3. Revisa los textos editoriales que mencionen niveles concretos, como las
   preguntas frecuentes y el texto debajo de los proyectos.
4. Desde la raíz del sitio, ejecuta estos comandos con Node.js.

   ```sh
   node _fuente/generar.mjs
   node _fuente/generar.mjs --verificar
   ```

El nivel aparece en Inicio y en la página existente del programa. El orden de
los programas y niveles sigue el orden del catálogo. Los datos rápidos con
`dato` igual a `sesiones` o `minutos` se calculan a partir de sus niveles.

## Añadir un programa con página propia

1. Copia un programa en `cursos.json` y asigna identificadores nuevos al programa
   y a cada nivel. Completa la portada, la guía por edades y los textos para
   buscadores y redes sociales.
2. Copia la carpeta equivalente en `_fuente/programas/` y ponle el mismo nombre
   que al identificador nuevo. Adapta `habilidades.html`, `proyectos.html` y
   `preguntas.html`. `cabecera.html` y `cierre.html` contienen la configuración
   de estilos y comportamiento de cada programa. Los bloques compartidos están
   en `_fuente/componentes/`. Conserva los marcadores de la cabecera.
3. Ejecuta los mismos comandos. El sitio genera `programas/<id>/index.html`,
   los enlaces del catálogo y la entrada en el mapa del sitio. Revisa el texto
   del enlace de WhatsApp en la portada si prefieres mostrar el nombre comercial.
   Las misiones de Inicio y las recomendaciones del cuestionario se editan
   como contenido editorial.

Edita los archivos de `_fuente/` para cambiar las páginas generadas.
`--verificar` comprueba que la salida coincide con la fuente. La generación
funciona sin instalar dependencias ni conectarse a Internet.
