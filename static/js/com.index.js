
// DOM Elements
const downloadBtns = document.querySelectorAll(".download-btn");
const modal = document.getElementById("eulaModal");
const modalContent = document.getElementById("eulaModalContent");
const closeModalBtn = document.getElementById("closeModalBtn");
const markdownContainer = document.getElementById("markdownContent");
const checkboxes = document.querySelectorAll(".legal-checkbox");
const confirmBtn = document.getElementById("confirmDownloadBtn");
const confirmBtnIcon = document.getElementById("confirmBtnIcon");
const confirmBtnOverlay = document.querySelector(".btn-bg-overlay");
const navbar = document.getElementById("navbar");


let activeTriggerButton = null;
let isMarkdownFetched = false;

// Fetch Markdown from "GitHub" (Mocked logic for real repo)
async function loadAgreements() {
    if (isMarkdownFetched) return; // Prevent re-fetching if already loaded

    try {
        // In production, point this to: https://raw.githubusercontent.com/CultForge/CultForge/main/EULA.md
        // Using a placeholder public markdown file for demonstration
        const response = await fetch('https://raw.githubusercontent.com/github/docs/main/README.md');

        if (!response.ok) throw new Error('Network response failed');
        const text = await response.text();

        // Construct formatting
        const finalMD = `
# CultForge Master Agreement
*Last Updated: May 2026*

Welcome to CultForge. By downloading and utilizing the client, you agree to the conditions outlined below.

## 1. License Agreement
CultForge is provided under a hybrid open-source license. The UI components are fully open, while encryption matrices remain closed-source to prevent cheating on partnered servers.
* You may not reverse-engineer the closed-source authentication modules.
* You may freely fork the UI template.

## 2. Privacy Policy
We operate on an **Offline-First** philosophy.
* **Microsoft/Xbox Tokens:** Handled locally. We NEVER transmit your Microsoft credentials to our FastAPI backend.
* **Telemetry:** Anonymous crash logs are sent to \`api.cultforge.com\` only if you opt-in via launcher settings.

## 3. Terms & Conditions
CultForge is completely independent and not affiliated with Microsoft or Mojang AB. You must own a legitimate copy of Minecraft to utilize the asset downloading features.
                `;

        markdownContainer.innerHTML = DOMPurify.sanitize(marked.parse(finalMD));
        isMarkdownFetched = true;
    } catch (error) {
        // Fallback if fetch fails
        markdownContainer.innerHTML = DOMPurify.sanitize(marked.parse("# Error\nCould not fetch agreements from GitHub. Please check your internet connection."));
    }
}

// Open Modal
downloadBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
        if (this.disabled) return;
        activeTriggerButton = this;

        // Show modal with animation
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        // slight delay to allow display:flex to apply before animating opacity
        setTimeout(() => {
            modal.classList.remove("opacity-0");
            modalContent.classList.remove("scale-95");
        }, 10);

        loadAgreements();
    });
});

// Close Modal logic
function closeModal() {
    modal.classList.add("opacity-0");
    modalContent.classList.add("scale-95");
    setTimeout(() => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        // Reset checkboxes on close if they didn't finish
        checkboxes.forEach(cb => cb.checked = false);
        updateConfirmButton();
    }, 300);
}

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

// Checkbox Logic to enable Final Download Button
function updateConfirmButton() {
    const allChecked = Array.from(checkboxes).every(c => c.checked);
    confirmBtn.disabled = !allChecked;

    if (allChecked) {
        confirmBtn.classList.add("text-[#F2F3FF]", "border-neon-purple/50");
        confirmBtn.classList.remove("text-[#B8B6CC]", "border-obsidian-700");
        confirmBtnOverlay.classList.remove("opacity-0");
        confirmBtnOverlay.classList.add("group-hover:opacity-100", "opacity-80");
        confirmBtnIcon.classList.replace("ph-lock-key", "ph-download");
    } else {
        confirmBtn.classList.remove("text-[#F2F3FF]", "border-neon-purple/50");
        confirmBtn.classList.add("text-[#B8B6CC]", "border-obsidian-700");
        confirmBtnOverlay.classList.add("opacity-0");
        confirmBtnOverlay.classList.remove("group-hover:opacity-100", "opacity-80");
        confirmBtnIcon.classList.replace("ph-download", "ph-lock-key");
    }
}

checkboxes.forEach(cb => {
    cb.addEventListener("change", updateConfirmButton);
});

// Final Confirm & Download Action
confirmBtn.addEventListener("click", () => {
    if (confirmBtn.disabled || !activeTriggerButton) return;

    // Close the modal
    closeModal();

    // Set the original trigger button to loading state
    const btnTextElement = activeTriggerButton.querySelector(".btn-text");
    const originalText = btnTextElement.innerText;
    const iconElement = activeTriggerButton.querySelector("i");
    const originalIconClass = iconElement.className;

    activeTriggerButton.disabled = true;
    btnTextElement.innerText = "Initializing Download...";
    iconElement.className = "ph-bold ph-spinner animate-spin text-xl";

    // Simulate file generation/download request
    setTimeout(() => {
        activeTriggerButton.disabled = false;
        btnTextElement.innerText = "Download Complete";
        iconElement.className = "ph-bold ph-check text-xl";

        // Actual download logic goes here
        // window.location.href = './releases/CultForge-Setup.exe';

        // Reset button text after a few seconds
        setTimeout(() => {
            btnTextElement.innerText = originalText;
            iconElement.className = originalIconClass;
        }, 3000);
    }, 1500);
});
window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
        navbar.classList.add("bg-obsidian-900/90", "backdrop-blur-md", "border-b", "border-obsidian-700", "shadow-lg", "py-4");
        navbar.classList.remove("bg-transparent", "py-6");
    } else {
        navbar.classList.remove("bg-obsidian-900/90", "backdrop-blur-md", "border-b", "border-obsidian-700", "shadow-lg", "py-4");
        navbar.classList.add("bg-transparent", "py-6");
    }
});