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

## Latest changes

The latest changes since last time I pushed something to this repo:
- Finally improved the scrolling animation to fix some long standing issues, see [Known Issues](#known-issues) for what's left.
- The `credits` command now shows the bots github url.
- New `github` command to display only the bots github url, and not the entire credits.

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
- `!task github`: Display the bots github url.

By default everyone can use `help`,  `credits` and `github`, `add` tasks, as well as finish (`done`), `remove`, and `edit` tasks they started. Mods can use `clear`, `reassign`, as well as finish (`done`), `remove`, and `edit` all tasks. Only the broadcaster can `reload` the bot. All of these permissions can be changed in `settings.js`.

## Important Files

- `CLIENT_ID.txt`: 
  - Used by `generate_token.py` to generate an oauth token, and pretty much nothing else. 
  - If you generate your token manually, this is a nice place to store your client id.
- `auth.js`:
  - Holds login settings, including your oauth token, bot username, and channel name
- `settings.js`:
  - Holds the main settings for the overlay and bot
  - Includes the active task limit, scrolling settings, auto-delete settings, command names and alisies, command help messages, and command permissions.
- `style_settings.css`:
  - Holds the visual settings for the overlay.
  - Includes fonts, font sizes, and various color options.

> [!WARNING]
> Edit any file *not* listed above **at your own risk**. I will not help you if you break the bot trying to edit a file that isn't listed above (unless you were planning on contributing, of course).

## Install Instructions

> [!IMPORTANT]
> The following files contain your settings. If updating from a previous version, do *not* replace these files unless they have been updated. If they have been updated, **migrate your settings to the new versions**.
> You **will** have issues if you do not keep these updated.
>
> Last update to `settings.js`: Commit d40c5347872239badb0e8a11d4af2db7f8116547 on Mar 19th, 2024.
>
> Last update to `style_settings.css`: Commit fcf92313124f95b5665c72a2b04e0d55c1b5225f on Mar 16th, 2024.
>
> Last update to `auth.js`: Commit b807cf384b231e0700130d6f0da875f5604d956b on Oct 18, 2023.
>
> `CLIENT_ID.txt` does not need updates.

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
5. Open `auth.js`, and paste your token into the quotes on the first line, after `OAUTH_TOKEN`. It should look like this:
```js
const OAUTH_TOKEN = "YOUR_TOKEN_HERE";
```