function loadGoogleFont(font) {
	WebFont.load({
		google: {
			families: [font],
		},
	});
}

function importStyles() {
	loadGoogleFont("Fredoka One");
	loadGoogleFont("Nunito");
}

function setupDB() {
	if (!localStorage.tasks) {
		localStorage.setItem(`tasks`, "{}");
	}
}

function resetDB() {
	localStorage.clear();
	setupDB();
}

function clearAllTasks() {
	resetDB();
	cancelAnimation();
	renderTaskList();
}

function getTasks() {
	return JSON.parse(localStorage.tasks);
}

function saveTasks(tasks) {
	localStorage.setItem(`tasks`, JSON.stringify(tasks));
}

function renderTaskCount() {
	let tasks = getTasks();

	let totalTasksCount = 0;
	let completedTasksCount = 0;

	for (let task in tasks) {
		let taskData = tasks[task];
		if (taskData.done) {
			completedTasksCount++;
		}
		totalTasksCount++;
	}

	let taskCount = document.getElementById("task-count");
	taskCount.innerText = `${completedTasksCount}/${totalTasksCount}`;
}

function renderTaskList() {
	let tasks = getTasks();
// TODO: LEFT OFF HERE
	if (!configs.settings.showDoneTasks) {
		for (let task in tasks) {
			let taskData = tasks[task];
			if (taskData.done) {
				delete tasks[task];
			}
		}
	}

	// reverse the order of tasks
	if (configs.settings.reverseOrder) {
		let reversedTasks = {};
		let tasksKeys = Object.keys(tasks);
		for (let i = tasksKeys.length - 1; i >= 0; i--) {
			let task = tasksKeys[i];
			reversedTasks[task] = tasks[task];
		}
		tasks = reversedTasks;
	}

	let taskContainers = document.querySelectorAll(".task-container");

	taskContainers.forEach(function (taskList) {
		taskList.innerHTML = "";
	});

	for (let task in tasks) {
		let taskData = tasks[task];
		let username = task.split("-")[0];
		let id = task.split("-")[1];

		addTasksToDom(
			username,
			taskData.userColor,
			taskData.task,
			taskData.done
		);
	}

	renderTaskCount();
	animate();
}

window.onload = function () {
	importStyles();
	//setupDB();
	//renderTaskList();
};