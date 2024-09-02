// If you're looking for settings, they are located in settings.js! Try looking there first!

// STATE VARS
let fatalLoadError = false;
let tasks = [];
let scrolling = false;
let animationStartTime = null;
let nextCycleCommand = 0;

// UTIL
function ordinal(i) {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

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

function loadTasksDB() {
    if (localStorage.tasks) {
        tasks = JSON.parse(localStorage.tasks);
    } else {
        tasks = [];
    }
}

function clearTasksDB() {
    localStorage.clear();
    tasks = [];
    saveTasksDB();
}

// TASK MANAGEMENT
function addTask(task, user) {
    if (config.taskLimit && tasks.length >= config.taskLimit) {
        return null;
    }

    tasks.push({
        task: task,
        user: user,
        completed: false,
    });
    saveTasksDB();

    return task;
}

function finishTask(index) {
    if (index < 0 || index >= tasks.length) return null;

    tasks[index].completed = true;
    saveTasksDB();

    return tasks[index];
}

function removeTask(index) {
    if (index < 0 || index >= tasks.length) return null;

    let removed = tasks.splice(index, 1);
    saveTasksDB();

    return removed[0];
}

function removeTaskByRef(task) {
    let index = tasks.indexOf(task);
    return removeTask(index); // fine to pass -1 (not found) in here, will return `null` (not found) if so
}

function getTask(index) {
    if (index < 0 || index >= tasks.length) return null;

    return tasks[index];
}

function replaceTask(index, task) {
    if (index < 0 || index >= tasks.length) return null;

    tasks[index].task = task;
    saveTasksDB();

    return tasks[index];
}

function reassignTask(index, user) {
    if (index < 0 || index >= tasks.length) return null;

    tasks[index].user = user;
    saveTasksDB();

    return tasks[index];
}

function clearAllTasks() {
    clearTasksDB();
    saveTasksDB();
}

function clearDoneTasks() {
    tasks = tasks.filter((value) => !value.completed);
    saveTasksDB();
}

function getTaskGrouped(username, number) {
    let matchIndex = 0;
    let result = null;

    tasks.forEach((task, index) => {
        if (task.user == username) {
            if (matchIndex == number) {
                result = { task: task, index: index };
            }
            matchIndex++;
        }
    });

    return result;
}

// RENDERING & ANIMATION
function renderDOM() {
    const template = document.getElementById("task-template");
    const taskLists = Array.from(document.getElementsByClassName("task-list"));
    const taskCount = document.querySelector(".tasks-count");

    taskLists.forEach(taskList => {
        taskList.innerHTML = "";
    });

    let userDivs = {};

    tasks.forEach((task, index) => {
        const taskElement = template.content.cloneNode(true);

        taskElement.querySelector(".task-checkbox").checked = task.completed;
        taskElement.querySelector(".task-text").classList.toggle("crossed", task.completed);

        if (config.userGroupingEnabled) {
            if (!(task.user in userDivs)) {
                userDivs[task.user] = {
                    div: document.createElement("div"),
                    count: 1,
                };

                let header = document.createElement("p");
                header.innerText = task.user;
                header.classList.add("task-username");
                userDivs[task.user].div.appendChild(header);
            }
            
            taskElement.querySelector(".task-text").textContent = `${userDivs[task.user].count}. ${task.task}`;
            userDivs[task.user].count += 1;

            userDivs[task.user].div.appendChild(taskElement);
        } else {
            taskElement.querySelector(".task-text").textContent = `${index + 1}. ${task.user}: ${task.task}`;

            taskLists.forEach(taskList => {
                taskList.appendChild(taskElement.cloneNode(true));
            });
        }
    });

    if (config.userGroupingEnabled) {
        Object.values(userDivs).forEach(userDiv => {
            taskLists.forEach(taskList => {
                taskList.appendChild(userDiv.div.cloneNode(true));
            });
        });
    }

    let totalTasks = tasks.length;
    let completedTasks = tasks.filter((value) => value.completed).length;
    taskCount.textContent = `${completedTasks}/${totalTasks}`;

    startScrollAnimation();
}

function startScrollAnimation() {
    if (!config.scrollingEnabled) {
        stopScrollAnimation();
        return;
    }

    const taskList = document.querySelector(".task-list");
    let taskListHeight = taskList.scrollHeight;

    const taskWrapper = document.querySelector(".task-wrapper");
    let taskWrapperHeight = taskWrapper.clientHeight;

    if (taskListHeight > taskWrapperHeight) {
        if (scrolling) return;
        const secondaryTaskList = document.querySelector(".secondary");
        secondaryTaskList.style.display = "flex";
        scrolling = true;
        requestAnimationFrame(infScrollAnimation);
    } else {
        stopScrollAnimation();
    }
}

function stopScrollAnimation() {
    const secondaryTaskList = document.querySelector(".secondary");
    secondaryTaskList.style.display = "none";
    scrolling = false;
}

function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

function infScrollAnimation(time) {
    const taskList = document.querySelector(".task-list");
    const primaryTaskList = document.querySelector(".primary");
    const secondaryTaskList = document.querySelector(".secondary");

    if (!scrolling) {
        primaryTaskList.style.transform = "";
        animationStartTime = null;
        return;
    }
    if (animationStartTime == null) {
        animationStartTime = time;
    }

    let finalHeight = taskList.scrollHeight + config.scrollPxGap;
    let duration = (finalHeight / config.scrollPxPerSecond) * 1000;

    const elapsedTime = time - animationStartTime;
    const progress = Math.min(elapsedTime / duration, 1);

    let primaryStartY = 0; //px
    let primaryEndY = -primaryTaskList.clientHeight - config.scrollPxGap; //px
    let secondaryStartY = primaryTaskList.clientHeight + config.scrollPxGap; //px
    let secondaryEndY = 0; //px

    primaryTaskList.style.transform = `translateY(${lerp(primaryStartY, primaryEndY, progress)}px)`
    secondaryTaskList.style.transform = `translateY(${lerp(secondaryStartY, secondaryEndY, progress)}px)`

    if (elapsedTime >= duration) {
        primaryTaskList.style.transform = "";
        animationStartTime = null;
        setTimeout(() => {
            stopScrollAnimation();
            renderDOM();
        }, config.scrollLoopDelaySec * 1000); // this will restart the animation if needed after the dom is refreshed
    } else {
        requestAnimationFrame(infScrollAnimation);
    }
}

function cycleCommandInHeader() {
    if (!config.cycleCommands) {
        return;
    }

    const cycleTitle = document.querySelector(".cycle-title");
    if (cycleTitle == null) {
        console.error("missing cycle titles");
        return;
    }

    let leavingKeyframes = [{ opacity: "100%" }, { opacity: "0%" }];
    let enteringKeyframes = [{ opacity: "0%" }, { opacity: "100%" }];
    let options = {
        duration: config.fadeTime * 1000,
        iterations: 1,
        easing: "linear",
    };

    leaveAnimation = cycleTitle.animate(leavingKeyframes, options);
    leaveAnimation.play();
    leaveAnimation.addEventListener("finish", () => {
        cycleTitle.innerText = config.cycleTitle
            .replace("{command}", config.commandsToCycle[nextCycleCommand])
            .replace(/^ +/g, "\u00A0")
            .replace(/ +$/g, "\u00A0");
        nextCycleCommand = (nextCycleCommand + 1) % config.commandsToCycle.length;

        enterAnimation = cycleTitle.animate(enteringKeyframes, options);
        enterAnimation.play();
        enterAnimation.addEventListener("finish", () => {
            window.setTimeout(cycleCommandInHeader, config.holdTime * 1000);
        });
    });
}

// TWITCH CHAT BOT
const permissionLevels = {
    broadcaster: function (flags) {
        return flags.broadcaster;
    },
    mod: function (flags) {
        return flags.mod || permissionLevels.broadcaster(flags);
    },
    sub: function (flags) {
        return flags.sub || permissionLevels.mod(flags);
    },
    vip: function (flags) {
        return flags.vip || permissionLevels.sub(flags);
    },
    everyone: function (flags) {
        return true;
    },
};

function hasPermission(level, flags, is_task_owner = null) {
    if (typeof level === "string") {
        return permissionLevels[level](flags);
    } else if (is_task_owner !== null) {
        return permissionLevels[level[is_task_owner ? "self" : "others"]](flags)
    } else {
        return true; // fallback to everyone. command will call back with correct is_task_owner.
    }
}

function printCommandHelp(command) {
    const permMessages = {
        broadcaster: "broadcaster only",
        mod: "mods only",
        sub: "subs and mods only)",
        vip: "VIPs, subs, and mods only",
        everyone: "everyone",
    };

    const commandNames = config.commandNames[command.commandID];
    const commandSyntax = config.commandSyntaxes[command.commandID];
    const commandDesc = config.commandDescriptions[command.commandID];
    const commandPerms = command.permission_level;
    // Usage: !<pri command name> <command syntax> - <command description> (aliases: <other command names>)
    let message = "Usage: !" + commandNames[0];
    if (commandSyntax) {
        message += ` ${commandSyntax}`;
    }
    if (commandDesc) {
        message += ` - ${commandDesc}`;
    }
    if (commandNames.length > 1) {
        message += ` (aliases: ${commandNames.slice(1).map(name => "!" + name).join(", ")})`;
    }
    if (typeof commandPerms === "string") {
        message += ` (${permMessages[commandPerms]})`;
    } else {
        message += ` (${permMessages[commandPerms.self]} can edit tasks they own, ${permMessages[commandPerms.others]} can tasks others own)`;
    }
    ComfyJS.Say(message);
}

function sendStatus(msg, successful, user) {
    symbol = successful ? "✅" : "❌";
    ComfyJS.Say(`${user} ${symbol} ${msg}`);
}

function sendPermissionError(user, required) {
    level_str = `${required}`;
    if (required != "broadcaster") {
        level_str += " and above";
    }
    return sendStatus(`Only ${level_str} can run this command!`, false, user);
}

function cmdGetTask(user, command) {
    if (config.userGroupingEnabled) {
        let username = user;
        let index = parseInt(command.arguments[0]);
        if (isNaN(index)) {
            username = command.arguments[0];
            index = parseInt(command.arguments[1]);
            if (isNaN(index)) { 
                return sendStatus(`${command.arguments[0]} or ${command.arguments[1]} are not numbers!`, false, user);
            } else {
                command.arguments.splice(0, 2); // remove username + index
            }
        } else {
            command.arguments.splice(0, 1); // remove index
        }

        let task = getTaskGrouped(username, index - 1);
        if (!task) {
            return sendStatus(`Task ${index} does not exist!`, false, user);
        }
        return task;
    } else {
        let index = parseInt(command.arguments[0]);
        if (isNaN(index)) {
            return sendStatus(`${command.arguments[0]} is not a number!`, false, user);
        }
        command.arguments.splice(0, 1); // remove index

        let task = getTask(index - 1);
        if (!task) {
            return sendStatus(`Task ${index} does not exist!`, false, user);
        }
        return { task: task, index: index - 1}; // convert task to object to match API of getTaskGrouped
    }
}

function commandAdd(user, command, flags, extra) {
    if (command.arguments.length < 1) {
        return printCommandHelp(command);
    }

    let task = addTask(command.arguments.join(" "), user);
    if (!task) {
        return sendStatus(`At most ${config.taskLimit} tasks may be active at once!`, false, user);
    }
    renderDOM();

    return sendStatus(`Added task: ${task}`, true, user);
}

function commandDone(user, command, flags, extra) {
    if (command.arguments.length < 1 || command.arguments.length > 2) {
        return printCommandHelp(command);
    }

    let {task, index} = cmdGetTask(user, command);
    if (!task) {
        return;
    }
    if (!hasPermission(command.permission_level, flags, task.user == user)) {
        return sendStatus(`You are not allowed to finish this task.`, false, user);
    }

    finishTask(index);
    if (config.autoDeleteCompletedTasks) {
        if (config.autoDeleteDelay > 0) {
            window.setTimeout(task => {
                removeTaskByRef(task);
                renderDOM();
            }, config.autoDeleteDelay * 1000, task);
        } else {
            removeTask(index);
        }
    }
    renderDOM();

    return sendStatus(`Finshed task: ${task.task}`, true, user);
}

function commandRemove(user, command, flags, extra) {
    if (command.arguments.length < 1 || command.arguments.length > 2) {
        return printCommandHelp(command);
    }

    let {task, index} = cmdGetTask(user, command);
    if (!task) {
        return;
    }
    if (!hasPermission(command.permission_level, flags, task.user == user)) {
        return sendStatus(`You are not allowed to remove this task.`, false, user);
    }

    task = removeTask(index);
    renderDOM();

    return sendStatus(`Removed task: ${task.task}`, true, user);
}

function commandClear(user, command, flags, extra) {
    if (command.arguments[0] == "done") {
        clearDoneTasks();
        renderDOM();

        return sendStatus(`Cleared completed tasks!`, true, user);
    } else if (command.arguments[0] == "all") {
        clearAllTasks();
        renderDOM();

        return sendStatus(`Cleared all tasks!`, true, user);
    } else {
        printCommandHelp(command);
        // May have passed in a number to `clear`. Suggest the correct `remove` command instead
        if (!isNaN(parseInt(command.arguments[0]))) {
            ComfyJS.Say(`(Did you mean !${config.commandNames.remove[0]} ${command.arguments}?)`);
        }
        return;
    }
}

function commandEdit(user, command, flags, extra) {
    if (command.arguments.length < 2) {
        return printCommandHelp(command);
    }

    let {task, index} = cmdGetTask(user, command);
    if (!task) {
        return;
    }
    if (!hasPermission(command.permission_level, flags, task.user == user)) {
        return sendStatus(`You are not allowed to edit this task.`, false, user);
    }

    let new_content = command.arguments.join(" ");
    if (new_content == "") {
        return printCommandHelp(command);
    }

    let userIndex = null;
    if (config.userGroupingEnabled) {
        userIndex = tasks
            .filter((t) => t.user == task.user)
            .map((t, i) => { return { task: t, index: i } })
            .filter((t) => t.task == task)[0].index;
    }

    task = replaceTask(index, new_content);
    renderDOM();

    if (config.userGroupingEnabled) {
        return sendStatus(`${task.user}'s ${ordinal(userIndex + 1)} task is now: ${task.task}`, true, user);
    } else {
        return sendStatus(`Task #${index + 1} is now: ${task.task}`, true, user);
    }
}

function commandHelp(user, command, flags, extra) {
    let givenCommand = command.arguments.join(" ");
    if (givenCommand == "") {
        let commands = [];
        for (const commandID in config.commandNames) {
            if (!hasPermission(config.commandPermissions[commandID], flags))
                continue;

            const commandNames = config.commandNames[commandID];
            const commandSyntax = config.commandSyntaxes[commandID];

            let commandString = "!" + commandNames[0];
            if (commandSyntax) {
                commandString += " " + commandSyntax;
            }

            commands.push(commandString);
        }
        return ComfyJS.Say("Commands: " + commands.join(", "));
    } else {
        let targetCommand = getCommand(givenCommand, config.generated.commandHelpNames);
        if (targetCommand) 
            return printCommandHelp(targetCommand);
        else
            return sendStatus("That command does not exist.", false, user);
    }
}

function commandCredits(user, command, flags, extra) {
    ComfyJS.Say(
        "Bot made by DamienPup for LadyWynter_Author's stream. Inspired by https://github.com/liyunze-coding/Chat-Task-Tic-Overlay-Infinity. Get the bot yourself at https://github.com/DamienPup/TwitchChat-To-Do-List."
    );
}

function commandGithub(user, command, flags, extra) {
    ComfyJS.Say(
        "Github Repo: https://github.com/DamienPup/TwitchChat-To-Do-List"
    );
}

function commandReload(user, command, flags, extra) {
    ComfyJS.Say("Reloading bot and overlay.");

    location.reload();
}

function commandReassign(user, command, flags, extra) {
    if (command.arguments.length < 1 || command.arguments.length > 3) {
        return printCommandHelp(command);
    }

    let {task, index} = cmdGetTask(user, command);
    if (!task) {
        return;
    }

    let prev_user = task.user;
    let targetUser = command.arguments[0] || user;
    targetUser = targetUser.replace(/^@/, "");

    if (targetUser == "") {
        return printCommandHelp(command);
    }

    let userIndex = null;
    if (config.userGroupingEnabled) {
        userIndex = tasks
            .filter((t) => t.user == prev_user)
            .map((t, i) => { return { task: t, index: i } })
            .filter((t) => t.task == task)[0].index;
    }

    reassignTask(index, targetUser);
    renderDOM();
    
    if (config.userGroupingEnabled) {
        return sendStatus(`${prev_user}'s ${ordinal(userIndex + 1)} task is now owned by: ${targetUser}`, true, user);
    } else {
        return sendStatus(`Task #${index + 1} is now owned by: ${targetUser}`, true, user);
    }
}

function commandShow(user, command, flags, extra) {
    if (command.arguments.length > 2) {
        return printCommandHelp(command);
    }

    switch (command.arguments.length) {
        case 0: // show all user tasks
            let userTasks = [];
            tasks.forEach(task => {
                if (task.user != user) return;

                let userTask = task.task;
                if (task.completed) {
                    userTask += " (finished)"
                }
                userTasks.push(userTask);
            });
            return ComfyJS.Say(`Your tasks: ${userTasks.join(", ")}`);
        case 1: // show <username> OR show <index>
            let username = command.arguments[0]
            if (isNaN(parseInt(username))) { // show <username>
                let userTasks = [];
                tasks.forEach(task => {
                    if (task.user != username) return;

                    let userTask = task.task;
                    if (task.completed) {
                        userTask += " (finished)"
                    }
                    userTasks.push(userTask);
                });
                return ComfyJS.Say(`${username}'s tasks: ${userTasks.join(", ")}`);
            }
        case 2: // show <username> <index> OR (via fallthrough) show <index>
            let {task, _} = cmdGetTask(user, command);
            if (!task) {
                return;
            }
            return ComfyJS.Say(`${task.task}, started by ${task.user}, ${task.completed ? '' : 'not'} finished`);
    }
}

const commandFunctions = {
    show: commandShow,
    add: commandAdd,
    done: commandDone,
    remove: commandRemove,
    edit: commandEdit,
    clear: commandClear,
    help: commandHelp,
    credits: commandCredits,
    reload: commandReload,
    reassign: commandReassign,
    github: commandGithub,
};

function getCommand(fullMessage, commandNames = null) {
    if (commandNames == null)
        commandNames = config.commandNames;

    for (const command in commandNames) {
        const names = commandNames[command];

        for (const name of names) {
            if (fullMessage.startsWith(name)) {
                let args = fullMessage.slice(name.length).trim().split(" ");
                return {
                    commandID: command,
                    command: name,
                    arguments: (args.length == 1 && args[0] == "") ? [] : args, // don't return [""]
                    permission_level: config.commandPermissions[command],
                };
            }
        }
    }
    return null;
}

ComfyJS.onCommand = (user, command, message, flags, extra) => {
    try {
        let cmd = getCommand(command + " " + message);
        if (cmd) {
            if (hasPermission(cmd.permission_level, flags)) {
                return commandFunctions[cmd.commandID](user, cmd, flags, extra);
            } else {
                return sendPermissionError(user, cmd.permission_level);
            }
        }
    } catch (error) {
        return ComfyJS.Say(`!!! Uncaught exception: ${error}!!! Please report this to the developer.`)
    }
};

function criticalError(error) {
    // show error
    let errorP = document.querySelector("p.critical-error");
    if (!errorP) {
        errorP = document.createElement("p");    
        errorP.classList.add("critical-error");
        document.querySelector(".main-content").append(errorP);
    }
    errorP.innerText = error;

    // hide task list
    document.querySelector(".header").style.display = "none";
    document.querySelector(".task-wrapper").style.display = "none";
}

function clearCriticalError() {
    // remove error
    let errorP = document.querySelector("p.critical-error");
    if (errorP) {
        errorP.remove();
    }

    // show task list
    document.querySelector(".header").style.display = "";
    document.querySelector(".task-wrapper").style.display = "";
}

function showErrorNotification(error) {
    // make notification
    let errorDiv = document.createElement("div");
    errorDiv.classList.add("notification", "notification--error");
    errorDiv.innerText = error;
    document.querySelector(".notifications").append(errorDiv);
    errorDiv.offsetWidth; // cursed code: force dom changes to apply to ensure transitions run

    // show notification
    errorDiv.classList.add("notification--show");

    // hide after 5s
    setTimeout(() => {
        errorDiv.classList.remove("notification--show");
        errorDiv.addEventListener("transitionend", () => {
            errorDiv.remove();
        });
    }, 5000);
}

// STARTUP CODE
window.onload = function () {
    try {
        loadFonts();
        loadTasksDB();

        // Setup static title, and determine header line count.
        let staticTitle = document.querySelector(".title");
        if (staticTitle != null) {
            staticTitle.innerText = config.staticTitle
                .replace(/^ +/g, "\u00A0")
                .replace(/ +$/g, "\u00A0");
        }
        static_lines = config.staticTitle.match('\n')?.length || 0;
        cycle_lines = config.cycleTitle.match('\n')?.length || 0;
        document.documentElement.style.setProperty("--header-lines", static_lines + cycle_lines + 1);

        // Validate all commands accounted for.
        const commandConfig = {
            commandNames: config.commandNames,
            commandSyntaxes: config.commandSyntaxes,
            commandDescriptions: config.commandDescriptions,
            commandPermissions: config.commandPermissions,
        };
        const knownCommands = Object.keys(commandFunctions);
        for (const [name, cfg] of Object.entries(commandConfig)) {
            const commands = Object.keys(cfg);
            const missingCommands = knownCommands.filter(cmd => !commands.includes(cmd));
            const unknownCommands = commands.filter(cmd => !knownCommands.includes(cmd));
            if (missingCommands.length > 0) {
                fatalLoadError = true;
                criticalError(`command(s) ${missingCommands.join(', ')} not found in ${name}`);
            }
            if (unknownCommands.length > 0) {
                fatalLoadError = true;
                criticalError(`unknown command(s) ${unknownCommands.join(', ')} found in ${name}`);
            }
        }

        if (config.autoDeleteCompletedTasks) {
            for (let i = 0; i < tasks.length; i++) {
                let task = tasks[i];
                if (task.completed) {
                    removeTask(i);
                    i--;
                }
            }
        }

        if (config.taskLimit && tasks.length > config.taskLimit) {
            tasks = tasks.slice(0, config.taskLimit);
        }

        for (let task of tasks) {
            task.task = task.task || "<unknown task>";
            task.user = task.user || "<no user>";
            task.complete = task.complete || false;
        }

        saveTasksDB();

        cycleCommandInHeader(); // does nothing if the cycling has been disabled
        renderDOM();
    } catch (error) {
        showErrorNotification(`${error} at ${error.stack[1]}`);
        return ComfyJS.Say(`!!! Uncaught exception: ${error}!!! Please report this to the developer.`)
    }
};

ComfyJS.onError = function(error) {
    if (fatalLoadError) {
        showErrorNotification(error);
        return;
    }
    if (typeof error === 'string') {
        if (error.toLowerCase().includes("login") ||
            error.toLowerCase().includes("logging in") ||
            error.toLowerCase().includes("auth")) {
            // failed to login, oauth token likely incorrect
            criticalError(error + "\nTry logging in again.");
            setTimeout(reloadAuthJS, 5000); // Try again in 5 seconds.
            return;
        } else if (error.toLowerCase().includes("nick")) {
            // bad NICK, chat username was wrong
            criticalError(error + "\nEnsure you typed your account/bot username correctly.");
            setTimeout(reloadAuthJS, 5000); // Try again in 5 seconds.
            return;
        }
    }
    // Something else went wrong
    showErrorNotification(error);
};

ComfyJS.onConnected = function(_, _, _) {
    if (fatalLoadError) {
        return;
    }
    clearCriticalError();
}

/// Magic to reload auth.js on failure
async function reloadAuthJS() {
    const lastToken = auth.oauth;

    const existingScript = document.querySelector('script[src="auth.js"]');
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.src = "auth.js"
    script.onload = function() {
        if (auth.oauth !== lastToken) {
            // got a new token, try again
            ComfyJS.Init(auth.username, `oauth:${auth.oauth}`, [auth.channel]);
        }
        else {
            setTimeout(reloadAuthJS, 5000); // Try again in 5 seconds.
        }
    }
    document.head.appendChild(script);
}
/// ====

ComfyJS.Init(auth.username, `oauth:${auth.oauth}`, [auth.channel]);
