# TwitchChat-To-Do-List

A chat controlled to do overlay for twitch.

Created by DamienPup for [LadyWynter FantasyWriter](https://www.twitch.tv/ladywynter_fantasywriter).
Inspired by [kennyjacobson/Chat-Task-Tic-Overlay](https://github.com/kennyjacobson/Chat-Task-Tic-Overlay).

## Install Instructions

> **Warning**
> The source code for this repo does not include the source (nor release bundle) of a small used to generate the OAUTH token.
> See below for manaul generation instruction, or download the lastest release (even if it's just for the .exe)

1. Login to the Twitch Dev Console (https://dev.twitch.tv/console/apps) with your main or dedicated bot account.
1. Create an app.
   - Set the redirect URL to `http://localhost:5000/auth`
   - Set the type to `Chat Bot`
2. Paste the app's `Client ID` into `CLIENT_ID.txt`.
3. Run `generate_token.exe` to genereate an OAUTH token. (See below for manual token generation instuctions)
4. Open `auth.js`. Fill out the target channel and bot username. Don't touch the `OAUTH_TOKEN`.
5. Add a `Browser Source` to OBS or Streamlabs (or whatever your using), check `Local File` and select `index.html`.

### Manually generating an OAUTH token

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
