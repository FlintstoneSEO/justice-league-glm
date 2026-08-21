import { getEblastData } from "backend/fetchEblastData.jsw";

let newsletterData = null;
let htmlReady = false;

$w.onReady(() => {
  $w("#htmlNewsletterArchive").scrolling = "no";

  $w("#htmlNewsletterArchive").onMessage((event) => {
    if (
      event.data &&
      typeof event.data === "object" &&
      event.data.type === "newsletter-component-ready"
    ) {
      console.log("HTML newsletter component ready");
      htmlReady = true;
      sendNewsletterData();
    }
  });

  loadNewsletters();
});

async function loadNewsletters() {
  try {
    const rows = await getEblastData();

    console.log("Google Sheet rows returned:", rows.length);

    const newsletters = rows
      .filter(isValidRow)
      .map(normalizeNewsletter)
      .sort(sortNewestFirst);

    console.log("Valid newsletters after normalization:", newsletters.length);

    newsletterData = {
      success: true,
      count: newsletters.length,
      newsletters,
      ...(newsletters.length
        ? {}
        : { message: "No newsletters are currently available." })
    };
  } catch (error) {
    console.error("Could not load newsletter archive:", error);
    newsletterData = {
      success: false,
      count: 0,
      newsletters: [],
      message: "Unable to load newsletters right now."
    };
  }

  sendNewsletterData();
}

function isValidRow(row) {
  return (
    row &&
    typeof row.subject === "string" &&
    row.subject.trim() &&
    typeof row.link === "string" &&
    isSafeUrl(row.link)
  );
}

function normalizeNewsletter(row) {
  const parsedDate = parseDate(row.date);

  return {
    title: row.subject.trim(),
    link: row.link.trim(),
    pubDate: row.date || "",
    dateISO: parsedDate ? parsedDate.toISOString() : "",
    year: parsedDate ? String(parsedDate.getFullYear()) : extractYear(row.date)
  };
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function extractYear(value) {
  const match = String(value || "").match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : "";
}

function sortNewestFirst(a, b) {
  const aDate = a.dateISO ? new Date(a.dateISO).getTime() : -Infinity;
  const bDate = b.dateISO ? new Date(b.dateISO).getTime() : -Infinity;
  return bDate - aDate;
}

function isSafeUrl(value) {
  try {
    const url = new URL(String(value).trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function sendNewsletterData() {
  if (!htmlReady || !newsletterData) {
    return;
  }

  console.log("Sending newsletter data to HTML component");

  $w("#htmlNewsletterArchive").postMessage({
    type: "newsletter-data",
    ...newsletterData
  });
}
