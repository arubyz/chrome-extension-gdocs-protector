// After the window is loaded look for the element used to switch modes
window.addEventListener("load", () =>
    {
        // Search every 1/4 second for the element until found
        let switchToViewingMode = () =>
        {
            console.log("Trying to switch to viewing mode");
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
                        125);
                    elementFound = true;
                    break;
                }
            }
            if (!elementFound)
                setTimeout(switchToViewingMode, 250);
        };
        switchToViewingMode();
    },
    false);
