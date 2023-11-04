// DON'T TOUCH THESE. IMPORTANT STATE VARAIBLES
let tasks = [];
let scrolling = false;

let primaryAnim = null;
let secondaryAnim = null;
// =====

// Settings (DO NOT CHANGE THESE, USE `settings.js` INSTEAD!!!)
const taskLimit = config.taskLimit; // null or undefined to disable, any postive whole number to enable. Limit's the total number of tasks.

const scrollingEnabled = config.scrollingEnabled; // true or false. Toggles scrolling.
const scrollPxPerSecond = config.scrollPxPerSecond; // Speed of scrolling. Any number. (Untested with negatives!)
const scrollPxGap = config.scrollPxGap; // Gap between last and first list item. Any positive whole number.
const scrollLoopDelaySec = config.scrollLoopDelaySec; // Pause between loops in seconds. Any (positive) number.

// FONTS
function loadGoogleFont(font) {
	WebFont.load({
		google: {
			families: [font],
		},
	});
}

function loadFonts() {
    let root = document.querySelector(":root");
    let root_styles = getComputedStyle(root);

    let header_font = root_styles.getPropertyValue("--header-font").slice(1, -1);
    let body_font = root_styles.getPropertyValue("--body-font").slice(1, -1);
    loadGoogleFont(header_font);
    loadGoogleFont(body_font);
}

// LOCAL STORAGE DB
function saveTasksDB() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksDB(){
    if (localStorage.tasks) {
        tasks = JSON.parse(localStorage.tasks);
    } else {
        tasks = [];
    }
}

function clearTasksDB(){
    localStorage.clear();
    tasks = [];
    saveTasksDB();
}

// TASK MANAGEMENT
function addTask(task) {
    if (taskLimit && tasks.length >= taskLimit) {
        return null;
    }

    tasks.push({
        task: task,
        completed: false
    });
    saveTasksDB();

    return task
}

function finishTask(index) {
    if (index < 0 || index >= tasks.length) return null;

    tasks[index].completed = true;
    saveTasksDB();

    return tasks[index].task;
}

function removeTask(index){
    if (index < 0 || index >= tasks.length) return null;

    let removed = tasks.splice(index, 1);
    saveTasksDB();

    return removed[0].task;
}

function replaceTask(index, task) {
    if (index < 0 || index >= tasks.length) return null;

    tasks[index].task = task;
    saveTasksDB();

    return tasks[index].task;
}

function clearAllTasks(){
    clearTasksDB();
    saveTasksDB();
}

function clearDoneTasks() {
    tasks = tasks.filter((value) => !value.completed);
    saveTasksDB();
}

// RENDERING & ANIMATION
function renderDOM() {
    const template = document.getElementById("task-template");
    const taskLists = Array.from(document.getElementsByClassName("task-list"));
    const taskCount = document.querySelector(".tasks-count");

    taskLists.forEach(taskList => {
        taskList.innerHTML = ""; 
    });

    tasks.forEach((task, index) => {
        const taskElement = template.content.cloneNode(true);
            
        taskElement.querySelector(".task-index").textContent = `${index + 1}.`;
        taskElement.querySelector(".task-text").textContent = task.task;
        taskElement.querySelector(".task-checkbox").checked = task.completed;
        taskElement.querySelector(".task-text").classList.toggle("crossed", task.completed);
        
        taskLists.forEach(taskList => {
            taskList.appendChild(taskElement.cloneNode(true)); 
        });
    });

    let totalTasks = tasks.length;
    let completedTasks = tasks.filter((value) => value.completed).length;
    taskCount.textContent = `${completedTasks}/${totalTasks}`;

    infScrollAnim();
}

async function infScrollAnim() {
    if (!scrollingEnabled){
        const secondaryTaskList = document.querySelector(".secondary");
        secondaryTaskList.style.display = "none";
        cancelAnim();
        return;
    }

    const taskList = document.querySelector(".task-list");
	let taskListHeight = taskList.scrollHeight;

	const taskWrapper = document.querySelector(".task-wrapper");
	let taskWrapperHeight = taskWrapper.clientHeight;

    if (taskListHeight > taskWrapperHeight && !scrolling) {
        await new Promise((resolve) => {setTimeout(resolve, scrollLoopDelaySec * 1000)});

        const primaryTaskList = document.querySelector(".primary");
        const secondaryTaskList = document.querySelector(".secondary");
        secondaryTaskList.style.display = "flex";

        let finalHeight = taskListHeight + scrollPxGap;
        let duration = (finalHeight / scrollPxPerSecond) * 1000;

        let primaryListKeyframes = [
            {transform: `translateY(0)`},
            {transform: `translateY(-${finalHeight}px)`},
        ];
        let secondaryListKeyframes = [
            {transform: `translateY(${finalHeight}px)`},
            {transform: `translateY(0)`},
        ];
        let options = {
            duration: duration,
            iterations: 1,
            easing: "linear"
        };

        primaryAnim = primaryTaskList.animate(primaryListKeyframes, options);
        secondaryAnim = secondaryTaskList.animate(secondaryListKeyframes, options);
        
        primaryAnim.play();
        secondaryAnim.play();

        scrolling = true;

        primaryAnim.addEventListener("finish", animationFinished);
        primaryAnim.addEventListener("cancel", animationFinished);
    } else if (!scrolling) {
        const secondaryTaskList = document.querySelector(".secondary");
        secondaryTaskList.style.display = "none";

        cancelAnim();
    }
}

function animationFinished() {
	scrolling = false;
	renderDOM();
    infScrollAnim();
}

function cancelAnim() {
	if (primaryAnim) {
		primaryAnim.cancel();
	}
	if (secondaryAnim) {
		secondaryAnim.cancel();
	}
	scrolling = false;
}

// TWITCH CHAT BOT
function isMod(flags) {
	return flags.broadcaster || flags.mod;
}

function commandAdd(user, command, message, flags, extra){
    if (message == "") {
        return ComfyJS.Say(`${user} Usage: !${command} <task-to-add>`);
    }

    let task = addTask(message);
    if (!task) {
        return ComfyJS.Say(`${user} At most ${taskLimit} tasks may be active at once!`)
    }
    renderDOM();

    return ComfyJS.Say(`${user} Added task: ${task}`);
}

function commandDone(user, command, message, flags, extra){
    if (!isMod(flags)) {
        return ComfyJS.Say(`${user} Only mods can use this command!`)
    }

    if (message == "") {
        return ComfyJS.Say(`${user} Usage: !${command} <index>`);
    }

    index = parseInt(message);
    if (isNaN(index)) {
        return ComfyJS.Say(`${user} ${index} is not a number!`);
    }

    let task = finishTask(index - 1);
    if (!task){
        return ComfyJS.Say(`${user} Task ${index} does not exist!`);
    }
    renderDOM();

    return ComfyJS.Say(`${user} Finshed task: ${task}`);
}

function commandRemove(user, command, message, flags, extra){
    if (!isMod(flags)) {
        return ComfyJS.Say(`${user} Only mods can use this command!`)
    }

    if (message == "") {
        return ComfyJS.Say(`${user} Usage: !${command} <index>`);
    }

    index = parseInt(message);
    if (index == null) {
        return ComfyJS.Say(`${user} ${index} is not a number!`);
    }

    let task = removeTask(index - 1);
    if (!task){
        return ComfyJS.Say(`${user} Task ${index} does not exist!`);
    }
    renderDOM();
    
    return ComfyJS.Say(`${user} Removed task: ${task}`);
}

function commandClear(user, command, message, flags, extra){
    if (!isMod(flags)) {
        return ComfyJS.Say(`${user} Only mods can use this command!`)
    }

    if (message == "done"){
        clearDoneTasks();
        renderDOM();

        return ComfyJS.Say(`${user} Cleared completed tasks!`);
    } else if (message == "all") {
        clearAllTasks();
        renderDOM();

        return ComfyJS.Say(`${user} Cleared all tasks!`);
    } else {
        return ComfyJS.Say(`${user} Usage: !${command} <done|all>`);
    }
}

function commandEdit(user, command, message, flags, extra) {
    if (!isMod(flags)) {
        return ComfyJS.Say(`${user} Only mods can use this command!`)
    }

    const segments = message.split(' ');
    if (segments.length < 2) {
        return ComfyJS.Say(`${user} Usage: !${command} <index> <new-content>`);
    }

    index = segments[0];
    new_content = segments.slice(1).join(' ');

    if (new_content == "") {
        return ComfyJS.Say(`${user} Usage: !${command} <index> <new-content>`);
    }

    index = parseInt(index);
    if (index == null) {
        return ComfyJS.Say(`${user} ${index} is not a number!`);
    }

    task = replaceTask(index - 1, new_content);
    if (!task){
        return ComfyJS.Say(`${user} Task ${index} does not exist!`);
    }
    renderDOM();

    return ComfyJS.Say(`Task ${index} is now: ${task}`);
}

function commandHelp(user, command, message, flags, extra) {
    if (isMod(flags)){
        return ComfyJS.Say("Commands: !tasks:add <task>, !tasks:done <index>, !tasks:remove <index>, !tasks:edit <index> <new-content>, !tasks:clear <all|done>, !tasks:help, !tasks:credits, !tasks:reload")
    }
    return ComfyJS.Say("Commands: !tasks:add <task>, !tasks:help, !tasks:credits")
}

function commandCredits(user, command, message, flags, extra) {
    return ComfyJS.Say("Bot made by DamienPup for LadyWynter_FantasyWriter's stream. Inspired by https://github.com/liyunze-coding/Chat-Task-Tic-Overlay-Infinity")
}

function commandReload(user, command, message, flags, extra) {
    if (!isMod(flags)) {
        return ComfyJS.Say(`${user} Only mods can use this command!`)
    }

    ComfyJS.Say("Reloading bot and overlay.")

    location.reload();
}

const commands = {
    "tasks:add": commandAdd,
    "tasks:done": commandDone,
    "tasks:remove": commandRemove,
    "tasks:edit": commandEdit,
    "tasks:clear": commandClear,
    "tasks:help": commandHelp,
    "tasks:credits": commandCredits,
    "tasks:reload": commandReload,
}

ComfyJS.onCommand = (user, command, message, flags, extra) => {
    let cmd_func = commands[command];
    if (cmd_func){
        return cmd_func(user, command, message, flags, extra);
    }
}

// STARTUP CODE
window.onload = function() {
    loadFonts();
    loadTasksDB();

    if (taskLimit && tasks.length > taskLimit) {
        tasks = tasks.slice(0, taskLimit);
        saveTasksDB();
    }

    renderDOM();
}

ComfyJS.Init(auth.username, `oauth:${auth.oauth}`, [auth.channel]);