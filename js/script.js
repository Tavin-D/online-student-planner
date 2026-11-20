
// Wait until the page is fully loaded before running JavaScript.
document.addEventListener("DOMContentLoaded", function () {

    // -------------------------------
    // DASHBOARD: Load a study tip
    // -------------------------------

    const studyTip = document.getElementById("study-tip");
    const refreshTip = document.getElementById("refresh-tip");

    // Get a random quote from an external API.
    async function loadStudyTip() {
        if (!studyTip) return;

        studyTip.textContent = "Loading a new study tip...";

        try {
            const response = await fetch("https://dummyjson.com/quotes/random");

            if (!response.ok) {
                throw new Error("Could not load a study tip.");
            }

            const data = await response.json();

            // Display the quote returned by the API.
            studyTip.textContent = data.quote;

        } catch (error) {
            studyTip.textContent =
                "Try studying in short sessions and taking regular breaks.";

            console.error("API error:", error);
        }
    }

    if (studyTip) {
        loadStudyTip();
    }

    if (refreshTip) {
        refreshTip.addEventListener("click", loadStudyTip);
    }


    // -------------------------------
    // ASSIGNMENTS: Search and filter
    // -------------------------------

    const searchInput = document.getElementById("assignment-search");
    const statusFilter = document.getElementById("status-filter");
    const assignmentList = document.getElementById("assignment-list");
    const noResults = document.getElementById("no-results");

    function filterAssignments() {
        if (!assignmentList) return;

        const searchText = searchInput.value.toLowerCase();
        const selectedStatus = statusFilter.value;
        const rows = assignmentList.querySelectorAll("tr");

        let visibleCount = 0;

        rows.forEach(function (row) {
            const text = row.textContent.toLowerCase();
            const status = row.dataset.status;

            const matchesSearch = text.includes(searchText);
            const matchesStatus =
                selectedStatus === "all" || status === selectedStatus;

            if (matchesSearch && matchesStatus) {
                row.style.display = "";
                visibleCount++;
            } else {
                row.style.display = "none";
            }
        });

        noResults.hidden = visibleCount > 0;
    }

    if (searchInput && statusFilter) {
        searchInput.addEventListener("input", filterAssignments);
        statusFilter.addEventListener("change", filterAssignments);
    }


    // Mark an assignment as completed.
    if (assignmentList) {
        assignmentList.addEventListener("click", function (event) {
            if (event.target.classList.contains("complete-btn")) {
                const row = event.target.closest("tr");

                row.dataset.status = "Completed";

                const badge = row.querySelector(".status-badge");
                badge.textContent = "Completed";
                badge.className = "status-badge completed";

                event.target.textContent = "Completed";
                event.target.disabled = true;

                filterAssignments();
            }
        });
    }


    // -------------------------------
    // STUDY PLANNER: Add study sessions
    // -------------------------------

    const studyForm = document.getElementById("study-form");
    const sessionList = document.getElementById("study-session-list");

    if (studyForm && sessionList) {
        studyForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const subject =
                document.getElementById("study-subject").value;
            const date =
                document.getElementById("study-date").value;
            const time =
                document.getElementById("study-time").value;

            // Create a new list item for the session.
            const newSession = document.createElement("li");

            newSession.textContent =
                date + " - " + subject + " - " + time;

            sessionList.appendChild(newSession);

            studyForm.reset();
        });
    }

});

