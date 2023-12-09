const config = (() => {
    const taskLimit = null; // null or undefined to disable, any postive whole number to enable. Limit's the total number of tasks.

    const scrollingEnabled = true; // true or false. Toggles scrolling.
    const scrollPxPerSecond = 25; // Speed of scrolling. Any number. (Untested with negatives!)
    const scrollPxGap = 0; // Gap between last and first list item. Any positive whole number.
    const scrollLoopDelaySec = 2.5; // Pause between loops in seconds. Any (positive) number.

    // Names of different commands. Spaces allowed.
    // You can add multiple names for a single command, or just have one
    // The FIRST entry will be displayed in the help command as the primary command.
    // The remaining entries will be displayed as alises.
    const commandNames = {
        // Add a task to the list
        "add" : ["task add", "tasks:add"],
        // Finish a task
        "done" : ["task done", "tasks:done"],
        // Remove a task
        "remove" : ["task remove", "tasks:remove"],
        // Edit a task
        "edit" : ["task edit", "tasks:edit"],
        // Clear all tasks or just finished ones
        "clear" : ["task clear", "tasks:clear"],
        // List all commands
        "help" : ["task help", "tasks:help"],
        // List bot credits
        "credits" : ["task credits", "tasks:credits"],
        // Reload bot and overlay.
        "reload" : ["task reload", "tasks:reload"],
    }
    // FYI on format:
    // The part to the left of the colon is the command to be run.
    // The part to right is a list of possible names you can type in chat.
    // E.g. if you set: "add" : ["task add", "tasks:add"],
    // Then "!task add" OR "!tasks:add" will add a task to the last ("add" command)
    
    // !!! Advanced settings below !!!

    // Feel free to change the names of the parameters.
    // Just make sure it's still clear how many there are and what they are.
    const commandSyntaxes = {
        "add" : "<task>",
        "done" : "<number>",
        "remove" : "<number>",
        "edit" : "<number> <new task>",
        "clear" : "<done|all>",
        "help" : "",
        "credits" : "",
        "reload" : "",
    }

    // !!! End of settings. DO NOT TOUCH THIS SECTION UNLESS UPDATING FROM A PREVIOUS VERSION.
    return {
        taskLimit, scrollingEnabled, scrollPxPerSecond, scrollPxGap, scrollLoopDelaySec, commandNames,
        commandSyntaxes
    };
})();