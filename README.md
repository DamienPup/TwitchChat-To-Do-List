# TwitchChat-To-Do-List

A chat controlled to do overlay for twitch.

Created by DamienPup for [LadyWynter FantasyWriter](https://www.twitch.tv/ladywynter_fantasywriter).
Inspired by [liyunze-coding/Chat-Task-Tic-Overlay](https://github.com/liyunze-coding/Chat-Task-Tic-Overlay).

## List of commands

### Public Commands

- `!task:help`: List commands.
- `!task:credits`: List bot credits.
- `!task:add <task>`: Add a task to the list. Task can contain spaces.

### Mod Only Commands

- `!task:done <number>`: Finish a task
- `!task:remove <number>`: Delete a task
- `!task:edit <number> <new-content>`: Edit a task to contain different text.
- `!task:clear all`: Clear all tasks
- `!task:clear done`: Clear only fishised tasks.
- `!task:reload`: Reload bot and overlay.

## Files

> [!WARNING]
> Modifing `taskList.css` or `index.js` can break things. Be careful and take a backup before doing so.

- `CLIENT_ID.txt`: Used by `generate_token.py` to generate an oauth token.
- `auth.js`: Holds bot username, channel to join, and oauth token.
- `settings.js`: Holds the main settings for the overlay.
- `style_settings.css`: Holds the styling settings for the overlay.

- `styles/taskList.css`: The code for the styles.
- `scripts/index.js`: The main code. Scroll down to the bottom and you can edit the names of the commands (make to change both the commands dict and help command text if you do so)

## Install Instructions

> [!WARNING]
> If you are updating from [commit #79914d0](https://github.com/DamienPup/TwitchChat-To-Do-List/commit/79914d095bb6cbd005ce9bcfe85ca8c0982162cd) or before, your settings are stored in `scripts/index.js` and `styles/taskList.css`.
>
> BACKUP THE SETTINGS SECTIONS IN THESE FILES. Please update to the new versions of those files.
>
> The new settings files are `settings.js` and `style_settings.css`. You can import your settings there.


> [!NOTE]
> When updating, make sure to not overwrite `settings.js` or `style_settings.css`. These contain your settings.
>
> Make sure to read over the new versions however, just in case new settings were added. Any missing settings can and will break the code.
>
> You may want to backup (or just not update) `auth.js` and `CLIENT_ID.txt` as well.

1. Login to the Twitch Dev Console (https://dev.twitch.tv/console/apps) with your main or dedicated bot account.
1. Create an app.
   - Set the redirect URL to `http://localhost:5000/auth`
   - Set the type to `Chat Bot`
2. Paste the app's `Client ID` into `CLIENT_ID.txt`.
3. Run `generate_token.py` to genereate an oauth token. (See below for manual token generation instuctions)
   - You will need Python install for this step. While this file was written with 3.12, older versions may work.
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
2. Replace CLIENT_ID_HERE with your apps `Client ID`.
3. Paste this url into a brower, authorize the app, and wait for the browser to time out.
4. Copy the `access_token` from the URL bar.
5. Open `auth.js`, paste this into the quotes on the first line, after `OAUTH_TOKEN`. It should look like this:
```js
const OAUTH_TOKEN = "YOUR_TOKEN_HERE";
```
