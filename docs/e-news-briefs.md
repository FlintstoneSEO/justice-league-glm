# E-News Briefs archive

The public archive at `/e-news-briefs` uses the published Google Sheet CSV through the existing backend module.

- Backend: `src/backend/fetchEblastData.jsw` (import as `backend/fetchEblastData.jsw`).
- Page code: `src/pages/E-News Briefs.gvqjx.js`.
- Wix HTML Component ID: `#htmlNewsletterArchive`.
- Embed source: `wix-embeds/e-news-briefs.html`. Paste this complete file into the matching Wix HTML Component whenever its code needs updating; Wix does not sync embedded HTML to this repository.
- Messages: the embed sends `{ type: "newsletter-component-ready" }`; the page replies with `{ type: "newsletter-data", success, count, newsletters, message? }`.

## Wix Editor setup

Keep the HTML Component ID as `htmlNewsletterArchive`. Disable scrolling in the editor; page code also sets `scrolling = "no"`. The embed renders one featured issue, at most six archive cards, and Previous/Next controls, so its height remains predictable. Set a practical component height (at least 900px is recommended).

## Testing

In Preview, open E-News Briefs and confirm the featured newest issue, search, year filter, six-card pagination, and external links. Then publish and repeat at `https://www.justiceleagueglm.org/e-news-briefs` in a signed-out browser. Check the browser console and Wix logs for the graceful error state if Google Sheets is unavailable.

## Rollback

`src/backend/newsletterfeed.web.js` is not used by the E-News archive. Do not remove it unless its remaining references have been reviewed for other consumers.

## Permissions

Confirm that `getEblastData()` remains available to public page code under the site's existing backend permissions configuration.
