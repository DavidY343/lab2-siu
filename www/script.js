let taskList = [];

// Esta funcion carga las tareas desde el servidor
const loadTasks = async () =>
{
	try
	{
		const response = await fetch("/tasks.json", { method: "GET" });
		if (!response.ok)
		{
			throw new Error("Failed to fetch tasks");
		}
		const tasks = await response.json();
		taskList.push(...tasks);
		updateUI(taskList);
	}
	catch (error)
	{
		console.error("Error loading tasks:", error);
	}
}

// Esta funcion agrega una tarea a la lista
const add = async () =>
{
	try
	{
		const taskNameInput = document.getElementById("task-name");
		const taskName = taskNameInput.value.trim();
		if (taskName === "")
		{
			return;
		}
		const lastTaskId = taskList.length > 0 ? taskList[taskList.length - 1].id : 0;
		const newTask = { id: lastTaskId + 1, title: taskName, done: false };
		console.log(taskList);
		taskList.push(newTask);
		console.log(taskList);
		updateUI(taskList);
		taskNameInput.value = "";
		//await saveTasks();
	}
	catch (error)
	{
		console.error("Error adding task:", error);
	}
}

// Esta funcion elimina una tarea de la lista
const remove = async (taskId) =>
{
	try
	{
		taskId = parseInt(taskId);
		const index = taskList.findIndex(task => task.id === taskId);
		if (index !== -1)
		{
			taskList.splice(index, 1);
			updateUI(taskList);
			//await saveTasks();
		}
	}
	catch (error)
	{
		console.error("Error removing task:", error);
	}
};

// Esta funcion cambia el estado de una tarea de completada a no completada y viceversa
const toggleDone = async (taskId, taskElement) =>
{
    try
	{
        taskId = parseInt(taskId);
        const taskIndex = taskList.findIndex(task => task.id === taskId);
        if (taskIndex !== -1)
		{
            taskList[taskIndex].done = !taskList[taskIndex].done;
            updateUI(taskList);
			//await saveTasks();
        }
    }
	catch (error)
	{
        console.error("Error toggling task done state:", error);
    }
}

// Esta funcion guarda las tareas en el servidor, no funciona por el momento
const saveTasks = async () =>
{
	try
	{
		const response = await fetch("/tasks.json",
		{
			method: "POST",
			headers:
			{
				"Content-Type": "application/json"
			},
			body: JSON.stringify(taskList)
		});
		if (!response.ok)
		{
			throw new Error("Failed to save tasks");
		}
	}
	catch (error)
	{
		console.error("Error saving tasks:", error);
	}
}

// Esta funcion actualiza la interfaz de usuario con las tareas actuales
const updateUI = (taskList) =>
{
	const taskListElement = document.querySelector("#task-list");
	taskListElement.innerHTML = "";
	taskList.forEach(task =>
	{
		const listItem = document.createElement("li");
		listItem.textContent = task.title;
		listItem.dataset.taskId = task.id;
		if (task.done)
		{
			listItem.classList.add("completed");
		}
		taskListElement.appendChild(listItem);
	});
}

document.addEventListener("DOMContentLoaded", loadTasks);
document.getElementById("fab-add").addEventListener("click", add);


// Tareas de desplazamiento sobre los elementos de la lista
let timer = null;
const taskListElement = document.getElementById('task-list');
taskListElement.addEventListener('touchstart', handleTouchStart, false);
taskListElement.addEventListener('touchmove', handleTouchMove, false);
taskListElement.addEventListener('touchend', handleTouchEnd, false);
let startX = null;

// manejar el inicio del toque (iniciar temporizador) y iniciar la posibilidad de desplazamiento
function handleTouchStart(event)
{
	const firstTouch = event.touches[0];
	startX = firstTouch.clientX;
	timer = setTimeout(() => 
	{
		const taskElement = event.target.closest('li');
		if (taskElement)
		{
			const taskId = taskElement.dataset.taskId;
			if (taskId)
			{
				toggleDone(parseInt(taskId), taskElement);
			}
		}
	}, 2000);
}

// Manejar el final del toque (cancelar el temporizador si no se ha completado)
function handleTouchEnd()
{
	clearTimeout(timer);
}

// Manejar el movimiento del toque (eliminar la tarea si se desplaza hacia la derecha)
function handleTouchMove(event)
{
	if (!startX)
	{
		return;
	}
	const touch = event.touches[0];
	const deltaX = touch.clientX - startX;
	if (deltaX > 7)
	{
		const closestTask = event.target.closest('li');
		if (closestTask)
		{
			closestTask.classList.add('slide-out');
			setTimeout(() =>
			{
				const taskId = closestTask.dataset.taskId;
				if (taskId)
				{
					remove(taskId);
				}
			}, 2000);
		}
	}
	startX = null;
}


const infoButton = document.getElementById('info-button');
const infoPopup = document.getElementById('info-popup');

// Mostrar el cuadro emergente al hacer clic en el botón
infoButton.addEventListener('click', (event) =>
{
	event.stopPropagation(); // Evitar la propagación del evento
	if (infoPopup.style.display === 'block')
	{
		infoPopup.style.display = 'none';
	}
	else
	{
		infoPopup.style.display = 'block';	
	}
})

// Ocultar el cuadro emergente al hacer clic fuera de él
window.addEventListener('click', () =>
{
    infoPopup.style.display = 'none';
});
