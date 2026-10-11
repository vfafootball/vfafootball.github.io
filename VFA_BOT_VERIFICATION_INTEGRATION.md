# VFA Bot + Website Integration (Series 4 website package)

## What's updated
- `verification.html` now presents the requested Discord + Roblox verification flow.
- The Verify button sends users to the backend route `/auth/discord/start`.
- The page explains that the bot should set a verified member's nickname to `Discord Display Name (@RobloxUsername)`.
- The Player Statistics page already has a Team column in the current website package; the bot API needs to populate it from the verified Discord account/team role mapping.
- `vfa-bot-config.js` holds only the public API base URL.

## Important: the button is not live until the backend is deployed
This ZIP updates the website interface and adds the integration contract. It does not contain your current Bolt.new bot source or production OAuth credentials, so it cannot safely change Discord nicknames or assign roles by itself. Do not paste bot tokens or Supabase service-role keys into website files.

## Configure the website
1. Deploy the VFA bot/API backend to an HTTPS host.
2. Open `vfa-bot-config.js`.
3. Replace `https://YOUR-VFA-BOT-API.example.com` with the backend's real HTTPS base URL.
4. Upload the whole `vfa_real_videos` folder to the same hosting target as your existing site.

## Backend behavior the VFA bot/API must implement
1. `GET /auth/discord/start` begins Discord OAuth using a server-generated, single-use `state` value.
2. Discord callback validates `state`, exchanges the code server-side, and identifies the Discord user.
3. Start Roblox OAuth using Roblox's official authorization flow. Validate the callback state and fetch the authenticated Roblox user ID and username server-side. Never ask for Roblox passwords.
4. Store the Discord ID + Roblox user ID + current Roblox username in the server-side database, with one Discord account per linked Roblox account unless staff explicitly overrides it.
5. Confirm the Discord user is a member of VFA and evaluate the configured verification requirements.
6. Using the Discord bot token on the server only, set the member nickname to `<Discord display name> (@<Roblox username>)` and assign the configured eligible role if checks pass. The bot needs Manage Nicknames and Manage Roles; its role must be above the role/nickname target. Handle nickname length limits and role hierarchy errors.
7. DM the success message after all required steps succeed. If any step fails, show a clear failure and do not report success.
8. Expose authenticated, read-only website endpoints such as `GET /api/games`, `GET /api/standings`, `GET /api/statistics`, and `GET /api/teams`. Protect write endpoints such as `POST /api/score-report` with a server-only secret and validate every submitted report.

## Security checklist
- HTTPS only; validate OAuth `state`; use short-lived sessions and secure, HttpOnly cookies.
- Keep Discord client secret, bot token, Roblox OAuth secret, and Supabase service-role key in backend environment secrets only.
- Restrict CORS to the exact website origin. Rate-limit OAuth start/callback and write endpoints.
- Never trust a Roblox username typed into a form; use the Roblox OAuth identity result.
- Log verification failures for staff review, but never log access tokens.

## Existing bot
The current Bolt.new bot project still needs its source updated with these routes and nickname/role logic. This website package is the frontend side and integration specification; it does not magically modify the bot running in Bolt.new. Once the bot project's files are available, the backend implementation can be added to that project without rebuilding the website.
