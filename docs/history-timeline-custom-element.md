# Justice League historical timeline custom element

- Tag: `jl-history-timeline`
- Public script: `wix-embeds/history-timeline-custom-element.js`
- GitHub Pages URL: `https://flintstoneseo.github.io/justice-league-glm/wix-embeds/history-timeline-custom-element.js`
- Wix page code: `src/pages/Timeline.v1sj8.js`

## CMS setup

This site uses the Wix CMS collection ID `Import2` (the collection's display name can be `HistoryTimeline`). Site visitors need read permission for published entries.

| Field key | Wix field type | Required |
| --- | --- | --- |
| `title` | Text | Yes |
| `year` | Number | Yes |
| `dateLabel` | Text | Recommended |
| `description` | Rich Text or Text | Recommended |
| `category` | Text | Optional |
| `mainImage` | Image | Optional |
| `gallery` | Media Gallery | Optional |
| `imageAlt` | Text | Recommended with images |
| `imageCaption` | Text | Optional |
| `layoutType` | Text | Optional |
| `featured` | Boolean | Optional |
| `stat` | Text | Optional |
| `statDescription` | Text | Optional |
| `quote` | Text | Optional |
| `quoteSource` | Text | Optional |
| `linkUrl` | URL | Optional |
| `linkLabel` | Text | Optional |
| `sortOrder` | Number | Yes |
| `published` | Boolean | Yes |

Allowed `layoutType` values are `standard`, `full-image`, `image-left`, `image-right`, `gallery`, `image-stat`, and `quote-image`. Unknown or blank values safely use `standard`.

Create an event by adding a record, assigning its chronological `sortOrder`, and setting `published` when it is ready. Set `published` to false to hide it. The Velo query only returns published items and sorts ascending by `sortOrder`; the sticky year navigation is generated from those results.

Use `mainImage` for the leading editorial photo and `gallery` for supporting images. One image renders large; two display as a spread; three use a primary image plus supporting images; four or more include a View All action. Every photo opens in the accessible lightbox.

## Wix Editor installation

1. Push the repository to `main` and wait for GitHub Pages to deploy the script URL above.
2. On the current historical Timeline page, add a Custom Element, choose **Server URL**, paste the URL, and use the tag `jl-history-timeline`.
3. Set its element ID to `historyTimeline`, stretch it full width, and allow natural content height.
4. Preserve current Timeline content until every existing event, photograph, alt text, and caption has been migrated into `HistoryTimeline` and verified.
5. Preview desktop and mobile. Test events with no image and with 1, 2, 3, and 4+ images.

The page code queries CMS, converts Wix image values to optimized static media URLs, normalizes records to plain text, and sends compact JSON through the Custom Element `timeline-data` attribute. Attributes are Wix’s supported bridge for externally hosted custom elements. CMS text is only assigned with `textContent`, never injected as HTML.

## Updating and testing

Run `npm run build:history-timeline` to verify that the public source exists. Push to `main` to update GitHub Pages. Test chronology, unpublished records, empty galleries, missing images, alt text, mobile layout, year navigation, Escape and arrow-key lightbox controls, and reduced-motion behavior.

`wix-embeds/Timeline.html` is intentionally not used or modified. It remains the Business Growth Grant application timeline source.
