import { getNewsletterFeed } from "backend/newsletterfeed.web";

let newsletterData = null;
let htmlReady = false;

$w.onReady(() => {
  // "auto" is the Wix-supported setting that prevents expanded archive cards
  // from being clipped when the component is shorter than its content.
  $w("#htmlNewsletterArchive").scrolling = "auto";

  $w("#htmlNewsletterArchive").onMessage((event) => {
    if (
      event.data &&
      typeof event.data === "object" &&
      event.data.type === "newsletter-component-ready"
    ) {
      htmlReady = true;
      sendNewsletterData();
    }
  });

  loadNewsletters();
});

async function loadNewsletters() {
  try {
    newsletterData = await getNewsletterFeed();
  } catch (error) {
    console.error("Could not load newsletter feed:", error);
    newsletterData = {
      success: false,
      count: 0,
      newsletters: [],
      message: "Unable to load newsletters right now. Please try again later."
    };
  }

  sendNewsletterData();
}

function sendNewsletterData() {
  if (!htmlReady || !newsletterData) {
    return;
  }

  $w("#htmlNewsletterArchive").postMessage({
    type: "newsletter-data",
    ...newsletterData
  });
}
