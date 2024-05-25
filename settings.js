const config = (() => {
    // Limit the total number of active tasks on the todo list.
    // Set to `null` or `undefined` to disable, or any postive whole number to set the limit.
    const taskLimit = null;

    // Enable or disable scrolling. `true` or `false`.
    const scrollingEnabled = true;
    // The speed of scrolling in pixels per second. Can be any postive number. Will likely not work with negative numbers.
    const scrollPxPerSecond = 25;
    // The gap inbetween the copies of the todo list when scrolling. Can be any positive whole number (or 0).
    const scrollPxGap = 0;
    // The pause between scroll loops in seconds. Can be any positive number.
    const scrollLoopDelaySec = 2.5;
    
    // If enabled (`true`), tasks are removed from the after they are finished. `true` or `false`.
    // If enabled, finished tasks will also be removed on reload.
    const autoDeleteCompletedTasks = false;
    // The delay (in seconds) after a task is finished before removing it. Can be any positive number (or 0).
    // If <=0, the task is removed instantly.
    const autoDeleteDelay = 1; // (seconds) any number >= 0. The delay after completing a task before it is deleted. If <=0, the task is removed instantly.

    // The final title looks like:
    // <static title><cycle title>
    // e.g. with default settigns:
    // To Do List | !task help

    // The part of the title that doesn't change
    // To add multiple lines to the title, DO NOT PRESS ENTER! That will BREAK THE FILE. Instead, type "\n" to insert a new line.
    // example of newline: "To Do\nList" // add newline between Do and List.
    const staticTitle = "To Do List | ";
    // The part of the title that cycles through each command (shown after the static title)
    // {command} is replaced with the command currently being shown
    const cycleTitle = "{command}";
    // Enables or disables the cycling of commands in the title. If disabled, `cycleTitle` is not shown.
    const cycleCommands = true;
    const holdTime = 5.0; // (seconds) How long to display a command for.
    const fadeTime = 1.0; // (seconds) How long to fade in/out the previous/next commands.
    // The list of commands to display in the title. Given as-is to `cycleTitle`.
    const commandsToCycle = [
        "!task help", // help
        // task commands
        "!task add", "!task done", "!task remove", "!task edit",
        "!task credits", "!task github" // credits
    ];

    // Names of different commands. Spaces allowed.
    // You can add multiple names for a single command, or just have one
    // The FIRST entry will be displayed in the help command as the primary command.
    // The rest of the entries will be displayed as alises.
    const commandNames = {
        // Print a given task and it's status in chat
        show: ["task show", "tasks:show"],
        // Add a task to the list
        add: ["task add", "tasks:add"],
        // Finish a task
        done: ["task done", "tasks:done"],
        // Remove a task
        remove: ["task remove", "tasks:remove"],
        // Edit a task
        edit: ["task edit", "tasks:edit"],
        // Clear all tasks or just finished ones
        clear: ["task clear", "tasks:clear"],
        // List all commands
        help: ["task help", "tasks:help"],
        // List bot credits
        credits: ["task credits", "tasks:credits"],
        // Reload bot and overlay.
        reload: ["task reload", "tasks:reload"],
        // Reassign a task to another user.
        reassign: ["task reassign", "tasks:reassign"],
        // Show the bots gh repo
        github: ["task github", "tasks:github"],
    }
    // Note on how the above segment is formatted:
    // The part to the left of the colon is the command to be run. Don't change this.
    // The part to right is a list of possible names you can type in chat.
    // E.g. e.g. this entry: 'add: ["task add", "tasks:add"]'
    // Will make it so that "!task add" OR "!tasks:add" will add a task to the last (the "add" command)
    // Note: Common command prefixes (like the "task " or "tasks:" in the default settings)
    // will not be required when passing a command to the help command.
    // i.e. "!task help task add" can be shortned to "!task help add".

    // Valid permissions (from highest to lowest permissions): broadcaster, mod, sub, vip, everyone
    // For add, clear, help, credits, and reload: the permission level sets who can use the command
    // ... i.e if set to "vip", vips, subs, mods, and the broadcaster can use the command
    // For done, remove, and edit, there are two levels.
    // ... "self" sets who can use the command on tasks they started.
    // ... ... Recommended to set to everyone so everyone can finish, delete, and edit their own tasks
    // ... "others" sets who can use the command on all other tasks.
    // ... ... Recommended for mods and above to be able to moderate the contents of the todo list.
    const commandPermissions = {
        show: "everyone",
        add: "everyone",
        done: {self: "everyone", others: "mod"},
        remove: {self: "everyone", others: "mod"},
        edit: {self: "everyone", others: "mod"},
        clear: "mod",
        help: "everyone",
        credits: "everyone",
        reload: "broadcaster",
        reassign: "mod",
        github: "everyone",
    }
    // Defaults:
    // Everyone can add tasks, view help and credits, and finish/delete/edit their own tasks.
    // Mods can clear finished or all tasks, and finish/delete/edit all tasks, as well as reassign tasks
    // Only the broadcaster can reload the bot+overlay.

    // The syntax format of each command.
    // The default shows required parameters in <> and optional ones in (). 
    // Options are shown using |.
    // Feel free to change the names of the parameters, but try to keep the general format the same so things aren't confusing.
    const commandSyntaxes = {
        show: "<number>",
        add: "<task>",
        done: "<number>",
        remove: "<number>",
        edit: "<number> <new task>",
        clear: "<done|all>",
        help: "(command)",
        credits: "",
        reload: "",
        reassign: "<number> (user)",
        github: "",
    }

    // The descriptions (help messages) of each command.
    const commandDescriptions = {
        show: "Print a given task and it's status.",
        add: "Adds a task to the list.",
        done: "Finishes a task.",
        remove: "Removes a task.",
        edit: "Edits a task.",
        clear: "Clears either completed or all tasks.",
        help: "Display a list of all commands or get help on a specific command.",
        credits: "Displays the bots credits.",
        reload: "Reloads the bot and task list overlay.",
        reassign: "Reassign a task to a new user. If the user is not given, reassign to yourself.",
        github: "Display the bot's github url.",
    }

    // !!! End of settings. DO NOT TOUCH THIS SECTION UNLESS MANUALLY UPDATING FROM A PREVIOUS VERSION. !!!
    return {
        taskLimit, scrollingEnabled, scrollPxPerSecond, scrollPxGap, scrollLoopDelaySec, commandNames,
        autoDeleteDelay, autoDeleteCompletedTasks,
        commandSyntaxes, commandDescriptions, commandPermissions,
        staticTitle, cycleTitle, cycleCommands, holdTime, fadeTime, commandsToCycle,
    };
})();