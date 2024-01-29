const config = (() => {
    const taskLimit = null; // null or undefined to disable, any postive whole number to enable. Limit's the total number of tasks.

    const scrollingEnabled = true; // true or false. Toggles scrolling.
    const scrollPxPerSecond = 25; // Speed of scrolling. Any number. (Untested with negatives!)
    const scrollPxGap = 0; // Gap between last and first list item. Any positive whole number.
    const scrollLoopDelaySec = 2.5; // Pause between loops in seconds. Any (positive) number.

    const autoDeleteCompletedTasks = false; // true or false. If true, tasks are removed from the list after finishing them.
    const autoDeleteDelay = 1; // (seconds) any number >= 0. The delay after completing a task before it is deleted. If <=0, the task is removed instantly.

    // Names of different commands. Spaces allowed.
    // You can add multiple names for a single command, or just have one
    // The FIRST entry will be displayed in the help command as the primary command.
    // The remaining entries will be displayed as alises.
    const commandNames = {
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
    }
    // FYI on format:
    // The part to the left of the colon is the command to be run.
    // The part to right is a list of possible names you can type in chat.
    // E.g. if you set: add: ["task add", "tasks:add"],
    // Then "!task add" OR "!tasks:add" will add a task to the last ("add" command)
    
    // !!! Advanced settings below !!!

    // Feel free to change the names of the parameters.
    // Just make sure it's still clear how many there are and what they are.
    const commandSyntaxes = {
        add: "<task>",
        done: "<number>",
        remove: "<number>",
        edit: "<number> <new task>",
        clear: "<done|all>",
        help: "(command)",
        credits: "",
        reload: "",
    }

    // Descriptions of each command
    const commandDescriptions = {
        add: "Adds a task to the list",
        done: "Finishes a task. Non-mods can only finish tasks they started.",
        remove: "Removes a task (mod-only)",
        edit: "Edits a task (mod-only)",
        clear: "Clears either completed or all tasks (mod-only)",
        help: "Display a list of all commands or get help on a specific command",
        credits: "Displays the bots credits",
        reload: "Reloads the bot and task list overlay (mod-only)",
    }

    // TODO: add support for "follower" role at some point (requires extra setup)
    // Valid permissions (from highest to lower perms): broadcaster, mod, sub, vip, everyone
    // For add, clear, help, credits, and reload: the permission level sets who can use the command
    // ... i.e if set to "vip", vips, subs, mods, and the broadcaster can use the command
    // For done, remove, and edit, there are two levels.
    // ... "self" sets who can use the command on tasks they started.
    // ... ... Recommended to set to everyone so everyone can finish, delete, and edit their own tasks
    // ... "others" sets who can use the command on all other tasks.
    // ... ... Recommended for mods and above to be able to moderate the contents of the todo list.
    const commandPermissions = {
        add: "everyone",
        done: {self: "everyone", others: "mod"},
        remove: {self: "everyone", others: "mod"},
        edit: {self: "everyone", others: "mod"},
        clear: "mod",
        help: "everyone",
        credits: "everyone",
        reload: "broadcaster"
    }
    // Defaults:
    // Everyone can add tasks, view help and credits, and finish/delete/edit their own tasks.
    // Mods can clear finished or all tasks, and finish/delete/edit all tasks
    // Only the broadcaster can reload the bot+overlay.

    // !!! End of settings. DO NOT TOUCH THIS SECTION UNLESS UPDATING FROM A PREVIOUS VERSION.
    return {
        taskLimit, scrollingEnabled, scrollPxPerSecond, scrollPxGap, scrollLoopDelaySec, commandNames,
        autoDeleteDelay, autoDeleteCompletedTasks,
        commandSyntaxes, commandDescriptions, commandPermissions
    };
})();