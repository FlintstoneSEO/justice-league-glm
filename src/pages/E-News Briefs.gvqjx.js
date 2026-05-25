import { getEblastData } from 'backend/fetchEblastData.jsw';

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
