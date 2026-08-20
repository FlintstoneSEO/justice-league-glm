import { getLGLData } from 'backend/fetchLGLData.jsw';

$w.onReady(async () => {
  try {
    const data = await getLGLData();
    console.log("Raw LGL Data:", data);

    // ✅ One place to control which years map to which repeater + field name
    const yearConfigs = [
      { year: 2025, amountField: "amount2025", repeaterId: "#repeater2025", nameTextId: "#text2025" },
      { year: 2026, amountField: "amount2026", repeaterId: "#repeater2026", nameTextId: "#text2026" }
    ];

    // Shared function to prep donor list for any year
    const buildYearList = (rows, amountField) => {
      const filtered = rows.filter(item =>
        Number(item?.[amountField] || 0) > 0 &&
        !String(item?.group || "").includes("Do Not List")
      );

      // Sort A-Z by name
      return filtered.sort((a, b) =>
        String(a?.name || "").localeCompare(String(b?.name || ""))
      );
    };

    // Shared function to bind a list to a repeater
    const bindRepeater = (repeaterId, nameTextId, list, amountField) => {
      $w(repeaterId).data = list;

      $w(repeaterId).onItemReady(($item, itemData) => {
        const addresseeName = String(itemData.name || "Anonymous").trim();
        const honoraryName = String(itemData.honoraryName || "").trim();
        const hasHonoraryName = /^honor\b/i.test(honoraryName);
        const honoreeName = honoraryName.replace(/^honor\b[\s:,-]*/i, "").trim();

        $item(nameTextId).text = hasHonoraryName && honoreeName
          ? `${addresseeName} (In Honor of ${honoreeName})`
          : addresseeName;

        // Optional: if you add a text element for amount, you can enable this:
        // $item("#textAmount").text = `$${Number(itemData?.[amountField] || 0).toLocaleString()}`;
      });
    };

    // Build + bind each year from config
    yearConfigs.forEach(cfg => {
      const list = buildYearList(data, cfg.amountField);
      console.log(`Filtered ${cfg.year} Data:`, list);
      bindRepeater(cfg.repeaterId, cfg.nameTextId, list, cfg.amountField);
    });

  } catch (err) {
    console.error("Error loading yearly donor data:", err);
  }
});
