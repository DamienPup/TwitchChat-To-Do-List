# TwitchChat-To-Do-List

A chat-controlled to do list overlay for [Twitch](https://www.twitch.tv/).

Created by DamienPup for [LadyWynter_Author](https://www.twitch.tv/LadyWynter_Author).
Inspired by [liyunze-coding/Chat-Task-Tic-Overlay](https://github.com/liyunze-coding/Chat-Task-Tic-Overlay).

## Table of Contents

1. [Latest changes](#latest-changes)
2. [List of Commands](#list-of-commands)
3. [Settings Files](#settings-files)
4. [Install Instructions](#install-instructions)
    - [Manually Generating an OAuth Token](#manually-generating-an-oauth-token)

## Latest changes

The latest changes since last time I pushed something to this repo:
- Added new settings to give better control over the look of the header.
- Added a feature to have the commands of the bot cycle in the title. See `settings.js` for details.
- **MAJOR**: Added a new feature (on by default) to group tasks by username. This is a **breaking change**!
  - Tasks are now grouped by username by default.
  - Task numbers now only target your own tasks, and you can target other users tasks by added their names before the number.
  - There's some extra style settings to control the new username headers.
  - The old behavior can be restored by disabling `enableUsernameGrouping` in `settings.js`. This disables ALL of this features changes.

## List of commands

- `!task help (command)`: List commands. Optionally, get help on a command.
- `!task credits`: List bot credits.
- `!task show <@task>`: Shows a task and it's status in chat.
- `!task add <task content...>`: Add a task to the list. Task can contain spaces.
- `!task done <@task>`: Finish a task.
- `!task remove <@task>`: Delete a task
- `!task edit <@task> <new content...>`: Edit a task to contain different text.
- `!task clear all`: Clear all tasks
- `!task clear done`: Clear only fishised tasks.
- `!task reload`: Reload bot and overlay.
- `!task reassign <@task> (user)`: Reassign a task to a new user. If the user is not given, reassign to yourself.
- `!task github`: Display the bots github url.

`<@task>` above means one of two things:
- If username grouping is enabled: `[username] <number>`. Examples:
    - `!task done 1` - Finish your first task.
    - `!task done DamienPup 5` - Finish `DamienPup`'s 5th task.
    - `!task reassign 2 JohnDoe` - Give your second task to `JohnDoe`.
    - `!task reassign DamienPup 2 JohnDoe` - Give `DamienPup`'s second task to `JohnDoe`.
- If username grupising is disabled: `<number>`.  Examples:
    - `!task remove 3` - Delete the third task on the list.

By default everyone can use `help`,  `credits` and `github`, `add` tasks, as well as finish (`done`), `remove`, and `edit` tasks they started. Mods can use `clear`, `reassign`, as well as finish (`done`), `remove`, and `edit` all tasks. Only the broadcaster can `reload` the bot. All of these permissions can be changed in `settings.js`.

## Settings Files

- `CLIENT_ID.txt`: 
  - Used by `generate_token.py` to generate an oauth token, and pretty much nothing else. 
  - If you generate your token manually, this can still be a nice place to store a copy of your client id, so you don't need to login to the twitch dev console to get it.
- `auth.js`:
  - Holds login settings: your oauth token, bot username, and channel name
- `settings.js`:
  - Holds the main settings for the overlay and bot
  - Includes the active task limit, scrolling settings, auto-delete settings, title settings, command names, alisies, and permissions, and more.
- `style_settings.css`:
  - Holds the visual settings for the overlay.
  - Includes fonts, font sizes, various color options, and more.

> [!WARNING]
> Do not edit any other files. Editing other files may break the bot and cause it to stop working. Editing other files is an action taken **at your own risk** and is not officially supported.

## Install Instructions

> [!IMPORTANT]
> The following files contain your settings. If updating from a previous version, do *not* replace these files unless they have been updated. If they have been updated, **migrate your settings to the new versions**.
> You **will** have issues if you do not keep these updated.
>
> Last update to `settings.js`: Commit a9191c9fe001f303cb4625a368c2a573bd546aa2 on May 30th, 2024.
>
> Last update to `style_settings.css`: Commit 2711b1af202c72e93af3c015039bcf66c668895d on May 30th, 2024.
>
> Last update to `auth.js`: Commit b807cf384b231e0700130d6f0da875f5604d956b on Oct 18, 2023.
>
> `CLIENT_ID.txt` does not need updates.
>
> (note: the dates above do not count updates that don't affect functionality)

1. Login to the [Twitch Developer Console](https://dev.twitch.tv/console/apps) with your main or dedicated bot account.
2. Create an app.
   - Set the redirect URL to `http://localhost:5000/auth`
   - Set the type to `Chat Bot`
3. Paste the app's Client ID into `CLIENT_ID.txt`.
4. Run `generate_token.py` to generate an oauth token. (See [below](#manually-generating-an-oauth-token) for manual token generation instuctions)
   <!-- TODO: Confirm minimum version requirement -->
   - You will need Python install for this step. 3.6 or later is required, however 3.12 is recommended.
   - The releases tab (should) contain a `pyinstaller` build of this tool. To use it: download it, put it in the same directory as the script file, and run it. No promises it won't be blocked by your browser or AV.
5. Open `auth.js`. Fill out the target channel and bot username. Don't touch the `OAUTH_TOKEN`.
6. Feel free to configure `settings.js` and `style_settings.js` to your liking.
7. Add a `Browser Source` to OBS or Streamlabs (or whatever your using), check `Local File` and select `index.html`.

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
4. Copy the `access_token` from the URL bar.
5. Open `auth.js`, and paste your token into the quotes on the first line, after `OAUTH_TOKEN`. It should look like this:
```js
const OAUTH_TOKEN = "YOUR_TOKEN_HERE";
```
