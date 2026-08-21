# E-News Briefs archive

The public archive at `/e-news-briefs` uses the Mailchimp RSS feed at `https://us18.campaign-archive.com/feed?u=8258e874c006b3176811c5671&id=03105787dc`.

- Backend: `src/backend/newsletterfeed.web.js` (import as `backend/newsletterfeed.web`).
- Page code: `src/pages/E-News Briefs.gvqjx.js`.
- Wix HTML Component ID: `#htmlNewsletterArchive`.
- Embed source: `wix-embeds/e-news-briefs.html`. Paste this complete file into the matching Wix HTML Component whenever its code needs updating; Wix does not sync embedded HTML to this repository.
- Messages: the embed sends `{ type: "newsletter-component-ready" }`; the page replies with `{ type: "newsletter-data", success, count, newsletters, message? }`.

## Wix Editor setup

Keep the HTML Component ID as `htmlNewsletterArchive`. Enable scrolling (or leave it set to the default **Auto**) in the editor. Page code also sets `scrolling = "auto"`; this is intentional, because Search, year filtering, Load More, and responsive reflow can exceed the fixed component height. Set a practical initial component height (at least 900px is recommended) so the archive is comfortable to browse, while the iframe scrollbar remains available for additional content.

## Testing

In Preview, open E-News Briefs and confirm the featured newest issue, search, year filter, Load More, and external links. Then publish and repeat at `https://www.justiceleagueglm.org/e-news-briefs` in a signed-out browser. Check the browser console and Wix logs for the graceful error state if Mailchimp is unavailable.

## Rollback

`src/backend/fetchEblastData.jsw` is retained temporarily as the former Google Sheets implementation. It has no current repository imports. Do not delete it until the Mailchimp archive has been verified in production and a rollback is no longer needed.

## Permissions

`getNewsletterFeed` explicitly uses `Permissions.Anyone`, which allows anonymous visitors to invoke only this public `.web.js` method. `src/backend/permissions.json` remains unchanged because it configures deprecated `.jsw` web modules, not `.web.js` methods.
