const OAUTH_TOKEN = ""; // Use generate_token.exe to fill this out!

const auth = (function () {
	// Authentication and channels - required
	const channel = ""; // your channel
	const username = ""; // bot account
	const oauth = OAUTH_TOKEN;

	return {
		channel,
		username,
		oauth,
	};
})();
