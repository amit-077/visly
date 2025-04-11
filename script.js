document.addEventListener("DOMContentLoaded", function () {
    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");
    const saveBtn = document.getElementById("saveBtn");
    const loadBtn = document.getElementById("loadBtn");

    // Save data to Chrome extension storage
    saveBtn.addEventListener("click", function () {
        let data = {
            input1: input1.value,
            input2: input2.value
        };

        chrome.storage.local.set({ userData: data }, function () {
            console.log("Data saved:", data);
            alert("Data saved successfully!");
        });
    });

    // Load data from Chrome extension storage
    loadBtn.addEventListener("click", function () {
        chrome.storage.local.get("userData", function (result) {
            if (result.userData) {
                input1.value = result.userData.input1;
                input2.value = result.userData.input2;
                console.log("Data loaded:", result.userData);
            } else {
                alert("No data found!");
            }
        });
    });
});
