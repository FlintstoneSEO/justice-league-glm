import { Permissions, webMethod } from "wix-web-module";
import { fetch } from "wix-fetch";

const RSS_URL =
  "https://us18.campaign-archive.com/feed?u=8258e874c006b3176811c5671&id=03105787dc";
const DEFAULT_EXCERPT =
  "Read the latest news, updates, events, and community information from the Justice League of Greater Lansing Michigan.";

export const getNewsletterFeed = webMethod(Permissions.Anyone, async () => {
  try {
    const response = await fetch(RSS_URL, {
      method: "get",
      headers: { Accept: "application/rss+xml, application/xml, text/xml" }
    });

    if (!response.ok) {
      throw new Error(`Mailchimp RSS request failed with status ${response.status}`);
    }

    const newsletters = parseFeed(await response.text());
    return { success: true, count: newsletters.length, newsletters };
  } catch (error) {
    console.error("Newsletter RSS error:", error);
    return {
      success: false,
      count: 0,
      newsletters: [],
      message: "Unable to load newsletters right now."
    };
  }
});

function parseFeed(xml) {
  if (typeof xml !== "string" || !xml.trim()) {
    throw new Error("Mailchimp RSS response was empty.");
  }
  if (!/<rss\b[^>]*>/i.test(xml) || !/<channel\b[^>]*>/i.test(xml)) {
    throw new Error("Mailchimp response was not an RSS feed.");
  }

  const itemRegex = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  const hasItemStart = /<item\b[^>]*>/i.test(xml);
  const items = [];
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const title = cleanText(getTag(item, "title"));
    const link = sanitizeUrl(cleanText(getTag(item, "link")));
    const pubDate = cleanText(getTag(item, "pubDate"));
    const descriptionRaw =
      getTag(item, "description") || getTag(item, "content:encoded");
    const parsedDate = parsePublicationDate(pubDate);

    if (!title || !link) {
      console.error("Skipping Mailchimp RSS item with a missing title or valid URL.");
      continue;
    }

    items.push({
      title,
      link,
      pubDate,
      dateISO: parsedDate ? parsedDate.toISOString() : "",
      year: parsedDate ? String(parsedDate.getUTCFullYear()) : "",
      description: createExcerpt(descriptionRaw)
    });
  }

  if (hasItemStart && items.length === 0 && !/<\/item>/i.test(xml)) {
    throw new Error("Mailchimp RSS feed contains an unterminated item.");
  }

  return items.sort((a, b) => {
    const aTime = a.dateISO ? Date.parse(a.dateISO) : Number.NEGATIVE_INFINITY;
    const bTime = b.dateISO ? Date.parse(b.dateISO) : Number.NEGATIVE_INFINITY;
    return bTime - aTime;
  });
}

function getTag(xml, tagName) {
  const escapedTag = tagName.replace(":", "\\:");
  const regex = new RegExp(
    `<${escapedTag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escapedTag}>`,
    "i"
  );
  const match = xml.match(regex);
  return match ? stripCdata(match[1]).trim() : "";
}

function parsePublicationDate(value) {
  const timestamp = Date.parse(value);
  return value && !Number.isNaN(timestamp) ? new Date(timestamp) : null;
}

function sanitizeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch (_) {
    return "";
  }
}

function stripCdata(value = "") {
  return value.replace(/^<!\[CDATA\[/i, "").replace(/\]\]>$/i, "");
}

function cleanText(value = "") {
  return decodeEntities(stripHtml(decodeEntities(stripCdata(value))))
    .replace(/\s+/g, " ")
    .trim();
}

function createExcerpt(value = "") {
  const cleaned = cleanText(value) || DEFAULT_EXCERPT;
  const maxLength = 210;
  return cleaned.length <= maxLength
    ? cleaned
    : `${cleaned.substring(0, maxLength).trim()}...`;
}

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ");
}

function decodeEntities(value = "") {
  const named = { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: '"' };

  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
    const normalized = code.toLowerCase();
    if (normalized[0] !== "#") {
      return Object.prototype.hasOwnProperty.call(named, normalized)
        ? named[normalized]
        : entity;
    }

    const numeric = normalized[1] === "x"
      ? Number.parseInt(normalized.slice(2), 16)
      : Number.parseInt(normalized.slice(1), 10);
    if (!Number.isInteger(numeric) || numeric < 0 || numeric > 0x10ffff) return entity;

    try {
      return String.fromCodePoint(numeric);
    } catch (_) {
      return entity;
    }
  });
}
