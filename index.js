const http = require('http');
const fs = require('fs');

const PORT = 3000;

const serveStaticFile = async (file) =>
{
	return new Promise((resolve, reject) =>
	{
		fs.readFile(file, function(err, data)
		{
			if(err) reject(err);
			resolve(data);
		});
	});
}

// Guardar las tareas en el archivo tasks.json
const saveTasks = async (tasks) =>
{
	const tasksJSON = JSON.stringify(tasks, null, 2);
	fs.writeFile('tasks.json', tasksJSON, (err) =>
	{
		if (err)
		{
			console.error('Error al guardar las tareas:', err);
		}
		else
		{
			console.log('Tareas guardadas correctamente en tasks.json');
		}
	});
};

//enviar respuesta
const sendResponse = (response, content, contentType) =>
{
	response.writeHead(200, {"Content-Type": contentType});
	response.end(content);
}


// Manejar las solicitudes HTTP
const handleRequest = async (request, response) =>
{
	const url = request.url;
	if(request.method === "GET")
	{
		let content;
		let contentType;
		switch(url)
		{
			case "/":
			case "/index.html":
				content = await serveStaticFile("www/index.html");
				contentType = "text/html";
				break;
			case "/script.js":
				content = await serveStaticFile("www/script.js");
				contentType = "text/javascript";
				break;
			case "/style.css":
				content = await serveStaticFile("www/style.css");
				contentType = "text/css";
				break;
			case "/tasks/get":
				content = await serveStaticFile("tasks.json");
				contentType = "application/json";
				break;
			case "/infoIcon/get":
				content = await serveStaticFile("www/media/infoIcon.png");
				contentType = "image/png";
				break;
			default: 
				content = "Ruta no v&aacutelida\r\n";
				contentType = "text/html";
		}
		sendResponse(response, content, contentType);
	}
	else if (request.method === "POST" && url === "/tasks/update")
	{
		let body = '';
		request.on('data', chunk =>
		{
			body += chunk.toString();
		});
		request.on('end', async () =>
		{
			try
			{
				const tasks = JSON.parse(body);
				await saveTasks(tasks);
				sendResponse(response, "Tareas actualizadas correctamente", "text/plain");
			}
			catch (error)
			{
				console.error("Error updating tasks:", error);
				response.writeHead(500, { "Content-Type": "text/plain" });
				response.end("Error al actualizar las tareas");
			}
		});
	}
	else
	{
		response.writeHead(405, {"Content-Type": "text/html"});
		response.write(`M&eacutetodo ${request.method} no permitido!\r\n`);
	}

}

// Crear un servidor HTTP que maneje las solicitudes con la función handleRequest
const server = http.createServer(handleRequest);
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});