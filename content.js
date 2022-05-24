chrome.runtime.onConnect.addListener(function (port) {
    console.log("content.js running");
    port.onMessage.addListener(function (message) {
        let responseObj = {
            request: message.request.type,
            messasge: "Hello World!"
        };
        if (message.request.type === "init") {
            // DO SOMETHING
            console.log("RxGB Init in content.js");
            port.postMessage({request: "init", message: "Hello World!"});
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
