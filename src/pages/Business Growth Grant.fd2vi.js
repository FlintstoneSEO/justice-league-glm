// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

const FAQ_EMBED_ID = "#htmlBusinessGrowthGrantFaq";
const EMBED_HEIGHT_BUFFER = 16;

$w.onReady(() => {
  const faqEmbed = $w(FAQ_EMBED_ID);

  faqEmbed.scrolling = "no";

  faqEmbed.onMessage((event) => {
    const { type, height } = event.data || {};

    if (
      type !== "business-growth-grant-faq-height" ||
      !Number.isFinite(height)
    ) {
      return;
    }

    faqEmbed.height = Math.ceil(height) + EMBED_HEIGHT_BUFFER;
  });

  faqEmbed.postMessage({
    type: "request-business-growth-grant-faq-height"
  });
});
