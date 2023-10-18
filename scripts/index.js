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

	let taskContainers = document.querySelectorAll(".task-container");

	taskContainers.forEach(function (taskList) {
		taskList.innerHTML = "";
	});

	for (let task in tasks) {
		let taskData = tasks[task];

		addTasksToDom(
			taskData.task,
			taskData.done
		);
	}

	renderTaskCount();
	animate();
}

function addTasksToDom(task, completed) {
	let taskContainers = document.querySelectorAll(".task-container");

	taskContainers.forEach(function (taskList) {
		let newTask = document.createElement("div");
		newTask.className = "task-div";

		let checkbox = document.createElement("div");
		checkbox.className = "checkbox";

		let checkboxInput = document.createElement("input");
		checkboxInput.type = "checkbox";

		// if completed is true, check the checkbox
		if (completed) {
			checkboxInput.checked = true;
		}

		checkbox.appendChild(checkboxInput);

		let checkboxLabel = document.createElement("label");
		checkbox.appendChild(checkboxLabel);

		newTask.appendChild(checkbox);

		// <div class="task">task</div>
		let taskDiv = document.createElement("div");
		taskDiv.className = "task";
		taskDiv.innerText = task;

		if (completed) {
			taskDiv.classList.add("crossed");
		}

		newTask.appendChild(taskDiv);

		// append to task list
		taskList.appendChild(newTask);
	});
}

function addTask(task) {
	let tasks = getTasks();

	tasks[task.toLowerCase().replace(" ", "-")] = {
		task: task,
		done: false,
	};

	saveTasks(tasks);

	if (!scrolling) {
		renderTaskList();
	}
}

function doneTask(task) {
	let tasks = getTasks();

	let finishedTask = tasks[task.toLowerCase().replace(" ", "-")].task;

	tasks[task.toLowerCase().replace(" ", "-")].done = true;

	saveTasks(tasks);

	if (!scrolling) {
		renderTaskList();
	}

	return finishedTask;
}

function removeTask(task) {
	let tasks = getTasks();

	let removedTask = userTasks.task;

	delete tasks[task.toLowerCase().replace(" ", "-")];

	saveTasks(tasks);

	if (!scrolling) {
		renderTaskList();
	}

	return removedTask;
}

function cleardone() {
	let tasks = getTasks();

	for (let task in tasks) {
		if (tasks[task].done) {
			delete tasks[task];
		}
	}

	saveTasks(tasks);
	renderTaskList();
	cancelAnimation();
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function animate() {
	// task container height
	let taskContainer = document.querySelector(".task-container");
	let taskContainerHeight = taskContainer.scrollHeight;

	let taskWrapper = document.querySelector(".task-wrapper");
	let taskWrapperHeight = taskWrapper.clientHeight;

	// scroll task wrapper up and down once
	if (taskContainerHeight > taskWrapperHeight && !scrolling) {
		let secondaryElement = document.querySelector(".secondary");
		secondaryElement.style.display = "flex";

		let finalHeight =
			taskContainerHeight + configs.styles.gapBetweenScrolls;
		let duration = (finalHeight / configs.styles.pixelsPerSecond) * 1000;

		// keyframes object in css scroll
		let primaryKeyFrames = [
			{ transform: `translateY(0)` },
			{ transform: `translateY(-${finalHeight}px)` },
		];

		let secondaryKeyFrames = [
			{ transform: `translateY(${finalHeight}px)` },
			{ transform: `translateY(0)` },
		];

		let options = {
			duration: duration,
			iterations: 1,
			easing: "linear",
		};

		// create animation object and play it
		primaryAnimation = document
			.querySelector(".primary")
			.animate(primaryKeyFrames, options);

		secondaryAnimation = document
			.querySelector(".secondary")
			.animate(secondaryKeyFrames, options);

		primaryAnimation.play();
		secondaryAnimation.play();

		// wait for animation to finish
		scrolling = true;

		addAnimationListeners();
	} else if (!scrolling) {
		document.querySelector(".secondary").style.display = "none";

		// cancel animations
		cancelAnimation();
	}
}

function addAnimationListeners() {
	if (primaryAnimation) {
		primaryAnimation.addEventListener("finish", animationFinished);
		primaryAnimation.addEventListener("cancel", animationFinished);
	}
}

function animationFinished() {
	scrolling = false;
	renderTaskList();
	animate();
}

function cancelAnimation() {
	console.log("Animation should be cancelled");
	if (primaryAnimation) {
		primaryAnimation.cancel();
	}
	if (secondaryAnimation) {
		secondaryAnimation.cancel();
	}
	scrolling = false;
}

window.onload = function () {
	importStyles();
	setupDB();
	renderTaskList();
};



function respond(template, user = "", message = "") {
	ComfyJS.Say(template.replace("{user}", user).replace("{task}", message));
}

function isMod(flags) {
	return flags.broadcaster || flags.mod;
}

ComfyJS.onCommand = (user, command, message, flags, extra) => {
	// check if command is in the list of commands
	command = command.toLowerCase();

	if (
		comand == "task:clear" && message == "done"
	) {
		if (!isMod(flags)) {
			// user is not a mod or broadcaster
			return respond("This command is only avaliable to mods.");
		}
		cleardone();
		respond(responseTemplates.clearedDone, user);
	} else if (command == "task:add") {
		// ADD TASK

		if (message === "") {
			// check if message is empty
			return respond("{user} You need to provide a task", user);
		}

		addTask(message);

		respond("{user} Added task {task}!", user, message);
	} else if (comand == "task:done") {
		// FINISH TASK
		if (!isMod(flags)) {
			// user is not a mod or broadcaster
			return respond("This command is only avaliable to mods.");
		}

		let finishedTask = "";

		if (message === "") {
			// check if message is empty
			return respond("{user} You need to provide a task", user);
		}

		if (settings.showDoneTasks) {
			finishedTask = doneTask(message);
		} else {
			finishedTask = removeTask(message);
		}

		respond("{user} Completed task: {task}", user, finishedTask);
	} else if (commands.deleteTaskCommands.includes(command)) {
		// DELETE TASK
		if (!isMod(flags)) {
			// user is not a mod or broadcaster
			return respond("This command is only avaliable to mods.");
		}

		let removedTask = removeTask(message);

		respond("Removed {task} message (if it exists)", user, removedTask);
	} else if (command == "clear") {
		if (!isMod(flags)) {
			// user is not a mod or broadcaster
			return respond(responseTemplates.notMod, user);
		}
		clearAllTasks();

		respond("{user} Cleared all tasks!", user);
	} else if (command == "help") {
		respond("Commands", user); // TODO
	} else if (comamand == "credits") {
		respond("Bot written by DamienPup. Inspried by https://github.com/liyunze-coding/Chat-Task-Tic-Overlay-Infinity", user);
	} else {
		// command not found
	}
};

ComfyJS.Init(auth.username, `oauth:${auth.oauth}`, [auth.channel]);
