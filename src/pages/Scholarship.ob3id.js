$w.onReady(function () {
    // 1. HIDDEN BY DEFAULT: Hide all scholarship components
    $w("#Scholarshipcountdown").hide();
    $w("#Scholarshipcountdown").collapse();

    $w("#ScholarshipApplication2026").hide();
    $w("#ScholarshipApplication2026").collapse();

    $w("#ScholarshipDetails2026").hide();
    $w("#ScholarshipDetails2026").collapse();

    /* // FUTURE LOGIC TEMPLATE: 
    // Uncomment and adjust dates when you are ready to automate.
    
    const now = new Date();
    const openDate = new Date("2026-02-28T00:00:00-05:00");
    const closeDate = new Date("2026-05-01T23:59:59-05:00");

    if (now < openDate) {
        // Show only countdown before applications open
        $w("#Scholarshipcountdown").expand();
        $w("#Scholarshipcountdown").show();
    } else if (now >= openDate && now <= closeDate) {
        // Show Application and Details during the window
        $w("#ScholarshipApplication2026").expand();
        $w("#ScholarshipApplication2026").show();
        $w("#ScholarshipDetails2026").expand();
        $w("#ScholarshipDetails2026").show();
    } else {
        // Hide everything after the deadline
    }
    */
});