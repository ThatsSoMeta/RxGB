chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (message) {
        var responseObj = {
            request: message.request.type,
            messasge: "Hello World!"
        };
        if (message.request.type === "init") {
            // DO SOMETHING
            responseObj.elements = findColors();
            port.postMessage(responseObj);
        } else {
            // DO SOMETHING
            console.log("RxGB non-Init in content.js");
        }
        return true;
    });
    

    port.onDisconnect.addListener(() => {
        // DO SOMETHING
    });
});
;

function findColors () {
    var allElems = document.querySelectorAll("body *"),
        fontColors = {},
        bgColors = {},
        allColors = { fontColors, bgColors }
    for (let elem of allElems) {
        let style = window.getComputedStyle(elem);
        if (style.color) {
            let verboseColor = getColor(style.color);
            if (!fontColors[verboseColor.hex]) {
                fontColors[verboseColor.hex] = verboseColor;
            }
        }
        if (style.backgroundColor) {
            let verboseColor = getColor(style.backgroundColor);
            if (!bgColors[verboseColor.hex]) {
                bgColors[verboseColor.hex] = verboseColor;
            }
        }
    }
    return allColors
}