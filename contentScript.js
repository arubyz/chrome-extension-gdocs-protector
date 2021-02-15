//
const avoidPreviewParam = "__XX__Special_Avoid_Preview__XX__";

// Search every 1/4 second for the element until found for 10 seconds
const attemptDelaySeconds = 0.25;
const maxAttempts = 20;

// Once the element is found, wait 1/8 second before clicking
const clickDelaySeconds = 0.125;

// After the window is loaded look for the element used to switch modes
window.addEventListener("load", () =>
    {
        // Ignore preview pages
        if (location.href.endsWith("/preview")) return;

        // Ignore pages which were manually switched from preview
        if (location.href.indexOf(`${avoidPreviewParam}=true`) !== -1) return;

        let attempts = 0;
        let switchToViewingMode = () =>
        {
            let elements = document.getElementsByClassName("docs-toolbar-mode-switcher-menu-label")
            let elementFound = false;
            for (let i = 0; i < elements.length; i++)
            {
                if (elements[i].innerText == "Viewing")
                {
                    // Once found, wait 1/8 second before clicking
                    setTimeout(() =>
                        // Simulating each of these events in sequence mimics
                        // actual mouse interaction
                        ["mouseover", "mousedown", "click", "mouseup"].forEach(type =>
                        {
                            let event = document.createEvent("MouseEvents");
                            event.initEvent(type, true, true);
                            elements[i].dispatchEvent(event);
                        }),
                        clickDelaySeconds * 1000);
                    elementFound = true;
                    break;
                }
            }
            attempts++;
            if (!elementFound)
            {
                if (attempts < maxAttempts)
                {
                    setTimeout(switchToViewingMode, attemptDelaySeconds * 1000);
                }
                else
                {
                    // As a last resort, if we couldn't find and click the
                    // Viewing button then trying showing the print preview.
                    // Since this is re-directing the active tab we must do
                    // this from the background script.
                    chrome.runtime.sendMessage({ type: "SWITCH_TO_PREVIEW" });
                }
            }
        };
        switchToViewingMode();
    },
    false);
