// Query parameter indicating user manually switched from preview mode
const avoidPreviewParam = "__XX__Special_Avoid_Preview__XX__";

// Returns a new url with the last part of the path changed
function switchUrlSuffix(url, suffix) {
    if (!url.startsWith("https://docs.google.com/")) return url;

    const i = url.lastIndexOf("/");
    if (i === -1) return;

    return url.substr(0, i) + suffix;
}

// Switches the current google doc tab into preview mode
function switchToPreview(tab) {
    const newUrl = switchUrlSuffix(tab.url, "/preview");
    chrome.tabs.update(tab.id, {url: newUrl});
}

// Switches the current google doc tab into non-preview mode
function switchFromPreview(tab) {
    const newUrl = switchUrlSuffix(tab.url, `?${avoidPreviewParam}=true`);
    chrome.tabs.update(tab.id, {url: newUrl});
}

// Toggles the current google doc tab between preview and non-preview modes
function togglePreview(tab) {
    if (tab.url.match("^.*/preview[^/]*$")) {
        switchFromPreview(tab);
    }
    else {
        switchToPreview(tab);
    }
}

// Toggle google doc preview mode when the extension icon is clicked
chrome.browserAction.onClicked.addListener(togglePreview);

// Switch to preview mode if the content script sends a message after page load
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type = "SWITCH_TO_PREVIEW") {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            const tab = tabs[0];
            if (!tab) return;

            switchToPreview(tab);
        });
    }
});
