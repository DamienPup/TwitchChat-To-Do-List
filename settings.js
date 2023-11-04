const config = (() => {
    const taskLimit = null; // null or undefined to disable, any postive whole number to enable. Limit's the total number of tasks.

    const scrollingEnabled = true; // true or false. Toggles scrolling.
    const scrollPxPerSecond = 25; // Speed of scrolling. Any number. (Untested with negatives!)
    const scrollPxGap = 0; // Gap between last and first list item. Any positive whole number.
    const scrollLoopDelaySec = 2.5; // Pause between loops in seconds. Any (positive) number.

    // End of settings. DO NOT TOUCH THIS SECTION UNLESS UPDATING FROM A PREVIOUS VERSION.
    return {
        taskLimit, scrollingEnabled, scrollPxPerSecond, scrollPxGap, scrollLoopDelaySec
    };
})();