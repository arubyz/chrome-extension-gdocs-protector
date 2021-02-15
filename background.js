const avoidPreviewParam = "__XX__Special_Avoid_Preview__XX__";

function switchUrlSuffix(url, suffix) {
    if (!url.startsWith("https://docs.google.com/")) return url;

    const i = url.lastIndexOf("/");
    if (i === -1) return;

    return url.substr(0, i) + suffix;
}

function switchToPreview(tab) {
    const newUrl = switchUrlSuffix(tab.url, "/preview");
    chrome.tabs.update(tab.id, {url: newUrl});
}

function switchFromPreview(tab) {
    const newUrl = switchUrlSuffix(tab.url, `?${avoidPreviewParam}=true`);
    chrome.tabs.update(tab.id, {url: newUrl});
}

function togglePreview(tab) {
    if (tab.url.endsWith("/preview")) {
        switchFromPreview(tab);
    }
    else {
        switchToPreview(tab);
    }
}

chrome.browserAction.onClicked.addListener(togglePreview);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type = "SWITCH_TO_PREVIEW") {
        // Switch the current GDocs tab to preview mode
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            const tab = tabs[0];
            if (!tab) return;

            switchToPreview(tab);
        });
    }
});
