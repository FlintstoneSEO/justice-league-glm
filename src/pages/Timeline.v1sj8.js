import wixData from 'wix-data';

const COLLECTION = 'HistoryTimeline';
const ELEMENT_ID = '#historyTimeline';

function plainText(value) {
    return String(value || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ').trim();
}

function mediaUrl(media) {
    if (!media) return '';
    if (typeof media === 'string' && /^https?:\/\//i.test(media)) return media;
    const source = typeof media === 'string' ? media : media.src || media.url || media.image || '';
    const match = String(source).match(/^wix:image:\/\/v1\/([^/]+)\/([^#]+)(?:#.*)?$/i);
    return match ? `https://static.wixstatic.com/media/${match[1]}/v1/fill/w_1600,h_1100,al_c,q_85/${match[2]}` : '';
}

function galleryImages(value, fallbackAlt, fallbackCaption) {
    const gallery = Array.isArray(value) ? value : value && Array.isArray(value.items) ? value.items : [];
    return gallery.map((item) => ({
        url: mediaUrl(item), alt: plainText(item.altText || item.alt || fallbackAlt),
        caption: plainText(item.title || item.description || fallbackCaption),
    })).filter((item) => item.url);
}

function normalizeItem(item) {
    const imageAlt = plainText(item.imageAlt || item.title);
    const imageCaption = plainText(item.imageCaption);
    const mainImage = mediaUrl(item.mainImage);
    const images = [mainImage ? { url: mainImage, alt: imageAlt, caption: imageCaption } : null,
        ...galleryImages(item.gallery, imageAlt, imageCaption)].filter(Boolean);
    return {
        id: item._id, title: plainText(item.title), year: Number(item.year), dateLabel: plainText(item.dateLabel),
        description: plainText(item.description), category: plainText(item.category), images,
        layoutType: plainText(item.layoutType).toLowerCase() || 'standard', featured: Boolean(item.featured),
        stat: plainText(item.stat), statDescription: plainText(item.statDescription), quote: plainText(item.quote),
        quoteSource: plainText(item.quoteSource), linkUrl: /^https?:\/\//i.test(String(item.linkUrl || '')) ? item.linkUrl : '',
        linkLabel: plainText(item.linkLabel),
    };
}

async function loadTimeline() {
    const result = await wixData.query(COLLECTION).eq('published', true).ascending('sortOrder').limit(1000).find();
    return result.items.map(normalizeItem).filter((item) => item.title && Number.isFinite(item.year));
}

$w.onReady(async function () {
    try {
        $w(ELEMENT_ID).setAttribute('timeline-data', JSON.stringify(await loadTimeline()));
    } catch (error) {
        console.error('Unable to load the HistoryTimeline CMS collection.', error);
        $w(ELEMENT_ID).setAttribute('timeline-data', '[]');
    }
});
