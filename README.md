# TwitchChat-To-Do-List

A chat controlled to do overlay for twitch.

Created by DamienPup for [LadyWynter FantasyWriter](https://www.twitch.tv/ladywynter_fantasywriter).
Inspired by [liyunze-coding/Chat-Task-Tic-Overlay](https://github.com/liyunze-coding/Chat-Task-Tic-Overlay).

## Table of Contents

1. [Latest changes](#latest-changes)
2. [List of Commands](#list-of-commands)
3. [Important Files](#important-files)
4. [Install Instructions](#install-instructions)
    - [Manually generating an oauth token](#manually-generating-an-oauth-token)
5. [Known Issues](#known-issues)

## Latest changes

The latest changes since last time I pushed something to this repo:
- Various bug fixes related to scrolling, and automatic task deletion.
- New command `!task show`: Let's you see a task and it's status in chat. Useful if the task list is very long. (or your me and are debugging the task list)
- Better error message when the chat bot fails to log in.

## List of commands

- `!task help (command)`: List commands. Optionally, get help on a command.
- `!task credits`: List bot credits.
- `!task show <number>`: Shows a task and it's status in chat.
- `!task add <task>`: Add a task to the list. Task can contain spaces.
- `!task done <number>`: Finish a task.
- `!task remove <number>`: Delete a task
- `!task edit <number> <new-content>`: Edit a task to contain different text.
- `!task clear all`: Clear all tasks
- `!task clear done`: Clear only fishised tasks.
- `!task reload`: Reload bot and overlay.
- `!task reassign <number> (user)`: Reassign a task to a new user. If the user is not given, reassign to yourself.

By default everyone can use `help` and `credits`, `add` tasks, as well as finish (`done`), `remove`, and `edit` tasks they started. Mods can use `clear`, `reassign`, as well as finish (`done`), `remove`, and `edit` all tasks. Only the broadcaster can `reload` the bot. All of these permissions can be changed in `settings.js`.

## Important Files

- `CLIENT_ID.txt`: Used by `generate_token.py` to generate an oauth token.
- `auth.js`: Holds bot username, channel to join, and oauth token.
- `settings.js`: Holds the main settings for the overlay.
- `style_settings.css`: Holds the styling settings for the overlay.

> [!CAUTION]
> Any file that isn't one of these is NOT intented to be user-editable!

## Install Instructions

> [!IMPORTANT]
> The following files contain your settings. If updating from a previous version, you may not want to update these files.
> However, if they have changed since you lasted updated them: Make a backup, and migrate to the new files by copying your settings over. 
> YOU WILL HAVE ISSUES IF YOU DO NOT UPDATE THE FILES.
>
> Last update to `settings.js`: Commit 8f4fdbee6264ba2dab679b21f31c29d014e021da on Jan 28th, 2024.
>
> Last update to `style_settings.css`: Commit 8093f8e52c7d6c3af4e70d975cdb5431db52fac3 on Nov 3rd, 2023.
>
> Last update to `auth.js`: Commit b807cf384b231e0700130d6f0da875f5604d956b on Oct 18, 2023.
>
> There should be no reason to update `CLIENT_ID.txt`.

1. Login to the Twitch Dev Console (https://dev.twitch.tv/console/apps) with your main or dedicated bot account.
2. Create an app.
   - Set the redirect URL to `http://localhost:5000/auth`
   - Set the type to `Chat Bot`
3. Paste the app's Client ID into `CLIENT_ID.txt`.
4. Run `generate_token.py` to generate an oauth token. (See [below](#manually-generating-an-oauth-token) for manual token generation instuctions)
   <!-- TODO: Confirm minimum version requirement -->
   - You will need Python install for this step. 3.6 or later is required, however 3.12 is recommended.
5. Open `auth.js`. Fill out the target channel and bot username. Don't touch the `OAUTH_TOKEN`.
6. Add a `Browser Source` to OBS or Streamlabs (or whatever your using), check `Local File` and select `index.html`.

### Manually generating an oauth token

1. Copy this URL:
```
https://id.twitch.tv/oauth2/authorize
?client_id=CLIENT_ID_HERE
&redirect_uri=http://localhost:5000/auth
&response_type=token
&scope=channel:moderate+chat:edit+chat:read+channel:manage:broadcast+user:edit:broadcast+channel:read:redemptions+user:read:email
```
2. Replace `CLIENT_ID_HERE` with your apps Client ID.
3. Paste this url into a brower, authorize the app, and wait for the browser to time out.
4. Copy the `access_token` from the URL bar.
5. Open `auth.js`, paste this into the quotes on the first line, after `OAUTH_TOKEN`. It should look like this:
```js
const OAUTH_TOKEN = "YOUR_TOKEN_HERE";
```

## Known Issues

1. Adding multiple tasks too quickly while the list is scrolling may cause some overlap for one scroll cycle.
2. Removing a task (or having it auto-removed) causes a gap for one scroll cycle.
3. Editing a task or reassigning a task may cause either of the issues mentioned above.