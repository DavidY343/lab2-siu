# README - Proyecto NotasApp

## Descripción del Proyecto

El proyecto "NotasApp" es una aplicación web que proporciona una útil herramienta de gestión de notas.

La aplicación hace uso de la Touch API para mejorar la interacción con el usuario, y utiliza Node.js para la comunicación con el servidor, asegurando así que las tareas se guarden de manera efectiva.

## Funcionalidades requeridas

1. Loadtask: La función loadTasks se llama al entrar en la aplicación para inicializar la lista de tareas según el contenido del archivo tasks.json en el servidor. Se utiliza el API Fetch para recuperar el contenido del archivo de manera asíncrona. El contenido del archivo se guarda en un Array de tareas en la aplicación.
2. Add: Al hacer click en el botón "+" se añade una nueva tarea a la lista. El nombre de la tarea será el texto introducido en un campo correspondiente. No se añade nada si el campo está vacío.
3. Remove: La función remove se ejecuta al hacer un gesto de deslizar rápidamente el dedo a la derecha sobre la tarea. Esto elimina la tarea de la lista.
4. ToggleDone: La función toggleDone se ejecuta al mantener el dedo en una tarea durante más de dos segundos. Esto marca la tarea como completada. Si la tarea ya estaba marcada como completada, se desmarca.

## Funcionalidades adicionales

1. Botón de información ubicado en la esquina superior izquierda para conocer cómo funciona la aplicación.
2. Al añadir, eliminar o modificar las tareas, se actualiza el contenido del archivo tasks.json en el servidor. Se utiliza la función fetch, especificando el método POST y pasando el contenido del array de tareas en formato JSON.

## Cómo Usar

1. Abre la terminal de node.js.
2. Ejecuta el comando node index.js
3. Escribe en la web "localhost:3000" siendo 3000 el puerto que he habilitado para esto.

## Decisiones de diseño

1. Al marcar una tarea como completada, se resalta en verde y se tacha.
2. Se puede deshacer la acción de marcar una tarea como completada tocando la pantalla.
3. Al eliminar una tarea, se muestra una animación de desplazamiento hacia la izquierda.