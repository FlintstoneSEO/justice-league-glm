/* import { getEblastData } from 'backend/fetchEblastData.jsw';

$w.onReady(() => {
    getEblastData()
        .then((data) => {
            // Sort newest to oldest
            const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            $w("#eblastRepeater").data = sorted;

            $w("#eblastRepeater").onItemReady(($item, itemData) => {
                $item("#dateText").text = itemData.date;
                $item("#subjectText").text = itemData.subject;
                $item("#viewBtn").link = itemData.link;
                $item("#viewBtn").label = "Read More";
            });
        })
        .catch((error) => {
            console.error("Error loading eblast data:", error);
        });
});
 */


import { getNewsletterFeed } from "backend/newsletterFeed.web";

let newsletterData = null;
let htmlReady = false;

$w.onReady(function () {

  $w("#htmlNewsletterArchive").scrolling = "no";

  $w("#htmlNewsletterArchive").onMessage((event) => {

    if (
      event.data &&
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

    newsletterData =
      await getNewsletterFeed();

  } catch (error) {

    console.error(
      "Could not load newsletter feed:",
      error
    );

    newsletterData = {
      success: false,
      newsletters: []
    };

  }

  sendNewsletterData();
}

function sendNewsletterData() {

  if (
    !htmlReady ||
    !newsletterData
  ) {
    return;
  }

  $w("#htmlNewsletterArchive").postMessage({
    type: "newsletter-data",
    ...newsletterData
  });

}