import { Permissions, webMethod } from "wix-web-module";
import { fetch } from "wix-fetch";

const RSS_URL =
  "https://us18.campaign-archive.com/feed?u=8258e874c006b3176811c5671&id=03105787dc";

export const getNewsletterFeed = webMethod(
  Permissions.Anyone,
  async () => {
    try {
      const response = await fetch(RSS_URL, {
        method: "get",
        headers: {
          Accept: "application/rss+xml, application/xml, text/xml"
        }
      });

      if (!response.ok) {
        throw new Error(
          `Mailchimp RSS request failed with status ${response.status}`
        );
      }

      const xml = await response.text();
      const newsletters = parseFeed(xml);

      return {
        success: true,
        count: newsletters.length,
        newsletters
      };
    } catch (error) {
      console.error("Newsletter RSS error:", error);

      return {
        success: false,
        count: 0,
        newsletters: [],
        message: "Unable to load newsletters right now."
      };
    }
  }
);

function parseFeed(xml) {
  const itemRegex = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  const items = [];
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    const title = cleanText(getTag(item, "title"));
    const link = cleanText(getTag(item, "link"));
    const pubDate = cleanText(getTag(item, "pubDate"));
    const descriptionRaw =
      getTag(item, "description") ||
      getTag(item, "content:encoded");

    const description = createExcerpt(descriptionRaw);

    const parsedDate = pubDate ? new Date(pubDate) : null;

    if (!title || !link) {
      continue;
    }

    items.push({
      title,
      link,
      pubDate,
      dateISO:
        parsedDate && !Number.isNaN(parsedDate.getTime())
          ? parsedDate.toISOString()
          : "",
      year:
        parsedDate && !Number.isNaN(parsedDate.getTime())
          ? String(parsedDate.getFullYear())
          : "",
      description
    });
  }

  return items.sort((a, b) => {
    const aDate = a.dateISO ? new Date(a.dateISO).getTime() : 0;
    const bDate = b.dateISO ? new Date(b.dateISO).getTime() : 0;

    return bDate - aDate;
  });
}

function getTag(xml, tagName) {
  const escapedTag = tagName.replace(":", "\\:");
  const regex = new RegExp(
    `<${escapedTag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escapedTag}>`,
    "i"
  );

  const match = xml.match(regex);

  if (!match) {
    return "";
  }

  return stripCdata(match[1]).trim();
}

function stripCdata(value = "") {
  return value
    .replace(/^<!\[CDATA\[/i, "")
    .replace(/\]\]>$/i, "");
}

function cleanText(value = "") {
  return decodeEntities(stripHtml(stripCdata(value)))
    .replace(/\s+/g, " ")
    .trim();
}

function createExcerpt(value = "") {
  const cleaned = cleanText(value);

  if (!cleaned) {
    return "Read the latest news, updates, events, and community information from the Justice League of Greater Lansing Michigan.";
  }

  const maxLength = 210;

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.substring(0, maxLength).trim()}...`;
}

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ");
}

function decodeEntities(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—");
}