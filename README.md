# TwitchChat-To-Do-List

A chat-controlled to do list overlay for [Twitch](https://www.twitch.tv/) streams.

Created by DamienPup for [LadyWynter_Author](https://www.twitch.tv/LadyWynter_Author).
Inspired by [liyunze-coding/Chat-Task-Tic-Overlay](https://github.com/liyunze-coding/Chat-Task-Tic-Overlay).

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Latest changes](#latest-changes)
- [List of commands](#list-of-commands)
- [Settings Files](#settings-files)
- [Install Instructions](#install-instructions)
  - [Manually Generating an OAuth Token](#manually-generating-an-oauth-token)
  - [Minor Updates](#minor-updates)

## Latest changes

The last few changes made to the overlay (oldest first):
- Added an option to hide the aliases of commands from help messages, and added the ability to play a sound effect when a task is checked off the list.
- Added support for automatically reloading the overlay if it fails to sign in. **Important:** `auth.js` needs to be updated for this to work, however, the bot will function without this update.
- Added a feature to have the commands of the bot show in the title. See `settings.js` for details and config.

## List of commands

- `!task help (command)`: List the bots commands (only those you have access to), or get help on a specific command.
- `!task credits`: Show credits for the bot.
- `!task show [username] [task]`: Show all of your or another users tasks in chat, or show the status of a specific task. 
- `!task add <task content...>`: Add a new task to the list. The task text can contain spaces.
- `!task done <@task>`: Finish a task.
- `!task remove <@task>`: Delete a task.
- `!task edit <@task> <new content...>`: Edit a task to contain different text. This replaces the task's existing content.
- `!task clear all`: Clear all tasks.
- `!task clear done`: Clear all tasks that have been finished. There is also a setting to do this automatically.
- `!task reload`: Reload the overlay/twitch chat bot.
- `!task reassign <@task> (user)`: Assign an existing task to a new user (by default: yourself).
- `!task github`: Link to the bots github repo.

`<@task>` above means one of two things:
- If username grouping is enabled: `[username] <number>`. Examples:
    - `!task done 1` - Finish your first task.
    - `!task done DamienPup 5` - Finish `DamienPup`'s 5th task.
    - `!task reassign 2 JohnDoe` - Give your second task to `JohnDoe`.
    - `!task reassign DamienPup 2 JohnDoe` - Give `DamienPup`'s second task to `JohnDoe`.
- If username grupising is disabled: `<number>`.  Examples:
    - `!task remove 3` - Delete the third task on the list.

By default everyone can use `help`, `credits` and `github`, `show` and `add` tasks, as well as finish (`done`), `remove`, and `edit` tasks they started. Mods can use `clear` and `reassign`, as well as finish (`done`), `remove`, and `edit` all tasks. Only the broadcaster can `reload` the bot. All of these permissions can be changed in `settings.js`.

## Settings Files

- `CLIENT_ID.txt`: 
  - Used by `generate_token.py`/`generate_token.exe` to generate an oauth token.
  - If you choose to generate your token manually, you can still store your client id here, so you don't need to login to the Twitch developer console to access it. **Do not share this ID publicly**
- `auth.js`:
  - Holds login settings: your oauth token, the chatbot's username, and your channel name.
- `settings.js`:
  - Holds the main settings for the overlay.
  - Includes the active task limit, scrolling settings, auto-delete settings, title settings, command names, alisies, and permissions, and more.
- `style_settings.css`:
  - Holds the visual settings for the overlay.
  - Includes fonts, font sizes, various color options, and more.

> [!WARNING]
> Do not edit any other files. Editing other files may break the bot and cause it to stop working. 
> 
> Also see: [How to contribute to the bot](./CONTRIBUTING.md).

## Install Instructions

> [!IMPORTANT]
> The following files contain your settings. If updating from a previous version, it is highly recommended to only replace/update these files if they have changed. Otherwise, keep your existing copies.
>
> For major updates, replace the files and migrate your settings. For minor updates, see the [Minor Updates](#minor-updates) section.
>
> `settings.js`:
>  - Last **major** update: Commit be34444 on May 30th, 2024.
>  - Last *minor* update: Commit 67fd672 on Oct 18th, 2024.
>
> `style_settings.css`:
>  - Last **major** update: Commit be34444 on May 30th, 2024.
>  - Last *minor* update: None since the last major update.
>
> `auth.js`:
>  - Last **major** update: Commit b807cf3 on Oct 18th, 2023.
>  - Last *minor* update: Commit f852dbf on Aug 29th 2024.
>
> `CLIENT_ID.txt` has not been updated. Updates that don't change functionality are not counted.

1. Login to the [Twitch Developer Console](https://dev.twitch.tv/console/apps) with your main account.
2. Create an app.
   - Set the redirect URL to `http://localhost:5000/auth`
   - Set the type to `Chat Bot`
3. Paste the app's Client ID into `CLIENT_ID.txt`.
4. Run `generate_token.py` to generate an oauth token. If you want to use a dedicated account for the bot, this is the step to sign into it.
   - The releases tab contains a `pyinstaller` build of this script. To use it: download it, put it in the same directory as the script file, and run it. Your browser or AV might complain about the file, I promise it's not a virus, you can look at the source code yourself to confirm.
   <!-- TODO: Confirm minimum version requirement -->
   - If using the python script, you will need Python install. 3.6 or later is required, however 3.12 is recommended.
5. Open `auth.js`. Fill out the your channel name and the bots username. Don't touch the `OAUTH_TOKEN`.
6. Feel free to configure `settings.js` and `style_settings.js` to your liking.
7. Add a `Browser Source` to OBS or Streamlabs (or whatever your using), check `Local File` and select `index.html`.

> [!CAUTION]
> **Never** share *any* OAuth token publicly. Sharing these could allow *anyone* to take control over your bot account! In the worst case, the account could be *banned*!
>
> Also, **never** share your Client ID.

### Manually Generating an OAuth Token

1. Copy this URL:
```
https://id.twitch.tv/oauth2/authorize
?client_id=CLIENT_ID_HERE
&redirect_uri=http://localhost:5000/auth
&response_type=token
&scope=chat:read+chat:edit+channel:read:redemptions+user:read:email
```
2. Replace `CLIENT_ID_HERE` with your apps Client ID.
3. Paste this url into a brower, authorize the app, and wait for the browser to time out.
4. Copy the part after `access_token=` and before the next `&` (if any) from the URL bar. Remove any `oauth:` prefix if present.
5. Open `auth.js`, and paste your token into the quotes on the first line, after `OAUTH_TOKEN`. It should look like this:
```js
const OAUTH_TOKEN = "YOUR_TOKEN_HERE";
```

### Minor Updates

`auth.js`:
  1. Commit f852dbf made a small refactor to `auth.js` to make automatic reload possible. Here are all the changes:
      - Delete line 1 (with ```const OAUTH_TOKEN = "<your token here>";```). Save your oauth token!
         - You can also delete the blank line following it.
      - On line 3 (old file) or 1 (new file), change:
          - From: ```const auth =``` 
          - To: ```window.auth =```
      - On line 7 (old file) or 5 (new file), change:
          - From: ```const oauth = OAUTH_TOKEN;```
          - To: ```const oauth = "<your token here>"```

`settings.js`:
  1. Commit 6c19327 made a small change to `settings.js`. If updating from commit a9191c9 or later, simply change line 120 of `settings.js`:
      - From: ```show: `${taskSyntax}`,```
      - To: ```show: `[username] [number]`,```

  2. Commit 6234f72 added a new setting to `settings.js`.
      - Simply add this line into `settings.js`:
          - `const showAliases = true; // If disabled, only the first name of a command will be shown.`
      - And add `showAliases` into the return block:
          - `return { /* whatever is already there... */, showAliases };`

  3. Commit 67fd672 added a new settings to `settings.js`.
      - Add this code into `settings.js`:
          ```js
          // Controls the sound when checking an item off the task list.
          // null or undefined: disable the task list
          // "path/to/file": The path to any sound file, relative to index.html.
          // Default: null (disabled)
          // Examples:
          // const checkSound = "my_sound.mp3"; // Play my_sound.mp3, sitting in the same folder as index.html.
          // const checkSound = "media/check.riff"; // Play check.riff, sitting in the media folder. (you'd have to make that folder yourself)
          const checkSound = null;
          ```
      - Then add `checkSound` into the return block: 
          - `return { /* whatever is already there... */, checkSound };`