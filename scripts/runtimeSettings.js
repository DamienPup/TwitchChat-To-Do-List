function findPrefix(str1, str2) {
    let i = 0;
    while (i < str1.length && i < str2.length && str1.charAt(i) === str2.charAt(i)) {
        i++;
    }
    return str1.substring(0, i);
}

function findPrefixAcrossLists(list1, list2) {
    let prefixes = [];
    for (const str1 of list1) {
        for (const str2 of list2) {
            const prefix = findPrefix(str1, str2);
            if (!prefixes.includes(prefix)) {
                prefixes.push(prefix);
            }
        }
    }
    return prefixes;
}

function findCommandPrefixes() {
    const commandNames = Object.values(config.commandNames);

    let prefixes = commandNames[0].slice(); // .slice() to copy the list
    for (let i = 1; i < commandNames.length; i++) {
        prefixes = findPrefixAcrossLists(prefixes, commandNames[i]);
    }

    let filtered = [];
    for (let i = 0; i < prefixes.length; i++) {
        let isSubstring = false;
        for (let j = 0; j < prefixes.length; j++) {
            if (i !== j && prefixes[j].includes(prefixes[i])) {
                isSubstring = true;
                break;
            }
        }
        if (!isSubstring) {
            filtered.push(prefixes[i]);
        }
    }

    return filtered;
}

// makes a version of config.commandNames suitable for the command argument of help.
function generateCommandHelpNames() {
    const prefixes = findCommandPrefixes();

    const commandHelpNames = JSON.parse(JSON.stringify(config.commandNames)); // deep copy command names

    for (let command of Object.keys(commandHelpNames)) {
        for (let name of commandHelpNames[command]) {
            for (let prefix of prefixes) {
                if (!name.startsWith(prefix)) continue;
                let shortname = name.substring(prefix.length);
                if (!commandHelpNames[command].includes(shortname)) {
                    commandHelpNames[command].push(shortname);
                }
            }
        }
    }

    return commandHelpNames;
}

config.generated = (() => {
    const commandHelpNames = generateCommandHelpNames();

    return {
        commandHelpNames,
    };
})();
