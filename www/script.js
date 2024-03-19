let taskList = [];

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
    taskId = parseInt(taskId);
    console.log("ID de tarea a eliminar:", taskId);
    const index = taskList.findIndex(task => task.id === taskId);
    if (index !== -1) {
        taskList.splice(index, 1);
        updateUI(taskList);
    } else {
        console.error(`No se encontró ninguna tarea con el ID ${taskId}`);
    }
};

const toggleDone = async (taskId, taskElement) => {
	const taskIndex = taskList.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        taskList[taskIndex].done = !taskList[taskIndex].done;
        updateUI(taskList);
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
        listItem.dataset.taskId = task.id;
        if (task.done) {
            listItem.classList.add("completed");
        }
        taskListElement.appendChild(listItem);
    });
}

document.addEventListener("DOMContentLoaded", loadTasks);
document.getElementById("fab-add").addEventListener("click", add);


document.addEventListener('DOMContentLoaded', () => {
    const taskListElement = document.getElementById('task-list');
    console.log(taskListElement);
    taskListElement.addEventListener('touchstart', handleTouchStart, false);
    taskListElement.addEventListener('touchmove', handleTouchMove, false);
	taskListElement.addEventListener('touchend', handleTouchEnd, false);
    let startX = null;

    function handleTouchStart(event) {
        const firstTouch = event.touches[0];
        startX = firstTouch.clientX;
        // Iniciar temporizador cuando se toca la tarea
        timer = setTimeout(() => {
            const taskElement = event.target.closest('li');
            if (taskElement) {
				const taskId = taskElement.dataset.taskId;
				if (taskId) {
					toggleDone(parseInt(taskId), taskElement);
            	}
			}
        }, 2000); // 2000 milisegundos (2 segundos)
    }

    
    function handleTouchEnd() {
        clearTimeout(timer); // Limpiar el temporizador cuando se levanta el dedo
    }
    
    function handleTouchMove(event) {
        if (!startX) {
            return;
        }

        const touch = event.touches[0];
        const deltaX = touch.clientX - startX;

        // Si el desplazamiento horizontal es mayor que el vertical
        if (deltaX > 7) {
            // Determinar si el desplazamiento fue hacia la derecha
            const closestTask = event.target.closest('li');
            
            if (closestTask) {
                closestTask.classList.add('slide-out');
                // Obtener el ID de la tarea a eliminar
                setTimeout(() => {
                    // Obtener el ID de la tarea a eliminar
                    const taskId = closestTask.dataset.taskId;
                    if (taskId) {
                        remove(taskId);
                    }
                }, 2000); // Espera 500 milisegundos (0.5 segundos)
            }
        }

        // Restablecer las coordenadas de inicio
        startX = null;
    }
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
  if (event.target !== infoButton && !infoPopup.contains(event.target)) {
    infoPopup.style.display = 'none';
  }
});
