import { getLGLData } from 'backend/fetchLGLData.jsw';

$w.onReady(() => {
    getLGLData()
        .then((data) => {
            console.log("Processed Data (Before Filtering):", data); // Debug: Check raw data

            // Filter out records where all donation amounts are 0.0
            const filteredData = data.filter(item => {
                // Check for non-zero donation amounts (columns like amount2024, amount2023, etc.)
                const donationAmounts = [item.amount2025, item.amount2023, item.amount2022]; // Add other columns as needed
                return donationAmounts.some(amount => amount > 0); // At least one amount > 0
            });

            console.log("Processed Data (After Filtering):", filteredData); // Debug: Check filtered data

            // Sort the filtered data alphabetically by donor name
            const sortedData = filteredData.sort((a, b) => {
                const nameA = a.name ? a.name.toLowerCase() : ""; // Handle empty names
                const nameB = b.name ? b.name.toLowerCase() : "";
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });

            console.log("Processed Data (After Sorting):", sortedData); // Debug: Check sorted data

            // Assign sorted and filtered data to the repeater
            $w("#DonorRepeater").data = sortedData;

            // Dynamically bind data to the repeater elements
            $w("#DonorRepeater").onItemReady(($item, itemData, index) => {
                $item("#DonorName").text = itemData.name || "Anonymous"; // Handle missing names
            });
        })
        .catch((error) => {
            console.error("Error loading data into repeater:", error);
        });
});
