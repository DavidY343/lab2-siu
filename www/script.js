const taskList = [];

const loadTasks = async () => {
    try {
        const response = await fetch("/tasks.json", { method: "GET" });
        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }
        const tasks = await response.json();
        taskList.push(...tasks);
        updateUI(taskList);
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

const add = async () => {
    try {
        const taskNameInput = document.getElementById("task-name");
        const taskName = taskNameInput.value.trim();
        if (taskName === "") {
            return;
        }
        const newTask = { id: Date.now(), title: taskName, done: false };
        taskList.push(newTask);
        updateUI(taskList);
        taskNameInput.value = "";
        await saveTasks();
    } catch (error) {
        console.error("Error adding task:", error);
    }
}

const remove = async (taskId) => {
    // Filtrar el array taskList para eliminar la tarea con el ID dado
    taskList = taskList.filter(task => task.id !== taskId);
    // Actualizar la interfaz de usuario con la lista de tareas modificada
    updateUI(taskList);
}

const toggleDone = async (taskId) => {
    try {
        const task = taskList.find(task => task.id === taskId);
        if (task) {
            task.done = !task.done;
            updateUI(taskList);
            await saveTasks();
        }
    } catch (error) {
        console.error("Error toggling task done state:", error);
    }
}

const saveTasks = async () => {
    try {
        const response = await fetch("/tasks/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskList)
        });
        if (!response.ok) {
            throw new Error("Failed to save tasks");
        }
    } catch (error) {
        console.error("Error saving tasks:", error);
    }
}

const updateUI = (taskList) => {
    const taskListElement = document.querySelector("#task-list");
    taskListElement.innerHTML = "";
    taskList.forEach(task => {
        const listItem = document.createElement("li");
        listItem.textContent = task.title;
        if (task.done) {
            listItem.classList.add("completed");
        }
        taskListElement.appendChild(listItem);
    });
}

document.addEventListener("DOMContentLoaded", loadTasks);
document.getElementById("fab-add").addEventListener("click", add);

let startX;

function handleTouchStart(event) {
	console.log('handleTouchStart');
    startX = event.touches[0].clientX;
}

function handleTouchMove(event) {
    const currentX = event.touches[0].clientX;
    const distance = currentX - startX;
    // Realiza cualquier acción adicional según la distancia o posición del deslizamiento
}

function handleTouchEnd(event) {
    const currentX = event.changedTouches[0].clientX;
    const distance = currentX - startX;
    if (Math.abs(distance) > 100) { // Considera 100 píxeles como distancia mínima para eliminar
        // Obtener el elemento sobre el que se está deslizando
        var taskElement = event.target.closest("li");
        if (taskElement) {
            // Obtener el ID de la tarea
            var taskId = taskElement.dataset.taskId;
            // Eliminar la tarea
            remove(taskId);
		}
    }
}

// Obtener la lista de elementos <li> de la lista de tareas
const taskListItems = document.querySelectorAll('#task-list li');

// Agregar listeners de eventos táctiles a cada elemento <li>
taskListItems.forEach(taskItem => {
    taskItem.addEventListener('touchstart', handleTouchStart);
    taskItem.addEventListener('touchmove', handleTouchMove);
    taskItem.addEventListener('touchend', handleTouchEnd);
});



// Obtener el botón de información y el cuadro emergente
const infoButton = document.getElementById('info-button');
const infoPopup = document.getElementById('info-popup');

// Mostrar el cuadro emergente al hacer clic en el botón
infoButton.addEventListener('click', (event) => {
	event.stopPropagation(); // Evitar la propagación del evento
	infoPopup.style.display = 'block';
  })
// Ocultar el cuadro emergente al hacer clic fuera de él
window.addEventListener('click', (event) => {
	console.log('window click');
  if (event.target !== infoButton && !infoPopup.contains(event.target)) {
    infoPopup.style.display = 'none';
  }
});
