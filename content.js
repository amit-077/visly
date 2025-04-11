document.addEventListener("mouseup", function () {
  removeExistingButton();

  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  let selectedText = selection.toString().trim();
  if (selectedText.length > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const button = document.createElement("button");
    button.innerText = "Copy Link";
    button.id = "text-select-btn";
    button.className = "text-select-btn";

    // Style the button
    button.style.position = "absolute";
    button.style.top = `${rect.bottom + window.scrollY + 5}px`;
    button.style.left = `${rect.left + window.scrollX}px`;
    button.style.zIndex = "1000";
    button.style.padding = "8px 12px";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.background = "#5580e9";
    button.style.color = "white";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.gap = "6px";

    document.body.appendChild(button);

    document.removeEventListener("click", handleOutsideClick);
    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 10);

    button.addEventListener("mousedown", function (event) {
      event.preventDefault(); // Prevent losing selection
      showLoading(button); // Show loader

      // Fetch user data from Chrome storage
      chrome?.storage?.local.get("userData", function (result) {
        if (result.userData) {
          fetch("https://visly.onrender.com/short", {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              companyName: selectedText,
              email: result?.userData?.input1,
              resumeLink: result?.userData?.input2,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              if (data?.shortURL) {
                navigator.clipboard.writeText(data.shortURL);
                showToast("Copied!!", false);
                hideLoading(button); // Restore button after copying
              } else {
                console.error("No shortURL in response:", data);
                showToast("Error copying!", true);
                hideLoading(button);
              }
            })
            .catch((error) => {
              console.error("Fetch error:", error);
              showToast("Error fetching!", true);
              hideLoading(button);
            });
        } else {
          showToast("No data found!", true);
          hideLoading(button);
        }
      });
    });
  }
});

// ✅ Function to show loader inside button
function showLoading(button) {
  button.disabled = true;
  button.innerHTML = `<div class="loader"></div> Loading...`;

  // Add loader styles
  const style = document.createElement("style");
  style.textContent = `
        .loader {
            width: 12px;
            height: 12px;
            border: 2px solid white;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
  document.head.appendChild(style);
}

// ✅ Function to restore button after copying
function hideLoading(button) {
  button.disabled = false;
  button.innerHTML = "Copy Link";
}

// ✅ Function to remove existing button
function removeExistingButton() {
  let existingButton = document.getElementById("text-select-btn");
  if (existingButton) existingButton.remove();
}

// ✅ Function to hide button when clicking elsewhere
function handleOutsideClick(event) {
  let button = document.getElementById("text-select-btn");
  if (button && event.target !== button) {
    removeExistingButton();
    document.removeEventListener("click", handleOutsideClick);
  }
}

// ✅ Function to show toast notification
function showToast(message, isError) {
  let toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = isError ? "#ff4d4d" : "white";
  toast.style.color = isError ? "white" : "#5580e9";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.fontSize = "14px";
  toast.style.fontWeight = "bold";
  toast.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
  toast.style.zIndex = "10000";
  toast.style.opacity = "1";
  toast.style.transition = "opacity 0.5s ease-in-out";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 3000);
}
