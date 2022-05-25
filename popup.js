var AA = 4.5,
    AAA = 7,
    RGB = "rgb",
    HEX = "hex",
    HSL = "hsl",
    rgbRegex = /\s*\d+,\s*\d+,\s*\d+/gi,
    hexRegex = /#?[0-9a-f]{6}/gi,
    hslRegex = /hsl\(\d+,[\s\d%.]+,[\s\d%.]+\)/gi,
    minimizedLogo = document.querySelector("#minimizedContainer .logo"),
    minimizeButton = document.getElementById("toggleVisibility"),
    minimizedContainer = document.getElementById("minimizedContainer"),
    modalContainer = document.getElementById("modalContainer"),
    pageColorToggle = document.getElementById("pageColorToggle"),
    pageColorDiv = document.getElementById("pageColors"),
    colorDetailsToggle = document.getElementById("colorDetailToggle"),
    colorDetailsDiv = document.getElementById("colorDetails"),
    contrastToggle = document.getElementById("contrastToggle"),
    contrastDiv = document.getElementById("contrast"),
    swatchSize = "20px",
    fontColorDiv = document.getElementById("fontColors"),
    bgColorDiv = document.getElementById("bgColors");

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    port = chrome.tabs.connect(tabs[0].id, { name: "RxGB" });
    port.postMessage({ request: { type: "init" } });
    port.onMessage.addListener(function (response) {
        if (response.request === "init") {
            collectNativeColors(response.elements.fontColors, response.elements.bgColors);
        } else {
            console.log("RxGB non-Init in popup.js");
        }
    });
});

function collectNativeColors(fontColors, bgColors) {
    var arrangedFontObject = Object.keys(fontColors).sort().reduce((acc, key) => {
            acc[key] = fontColors[key];
            return acc
        }, {}),
        arrangedBgObject = Object.keys(bgColors).sort().reduce((acc, key) => {
            acc[key] = bgColors[key];
            return acc
        }, {}),
        fontColorsArray = Object.values(arrangedFontObject),
        bgColorsArray = Object.values(arrangedBgObject);
    console.log({arrangedFontObject});
    for (var color of fontColorsArray) {
        var name = color.hex,
            colorContainer = document.createElement("div"),
            colorSwatch = document.createElement("div"),
            colorTitle = document.createElement("h4");
        colorSwatch.classList.add("color", "swatch");
        colorTitle.classList.add("color", "title");
        colorContainer.classList.add("color", "container", "button");
        colorTitle.innerText = name;
        colorSwatch.style.backgroundColor = name;
        colorContainer.append(colorSwatch, colorTitle);
        fontColorDiv.append(colorContainer);
    }
    for (var color of bgColorsArray) {
        var name = color.hex,
            colorContainer = document.createElement("div"),
            colorSwatch = document.createElement("div"),
            colorTitle = document.createElement("h4");
        colorSwatch.classList.add("swatch");
        colorTitle.classList.add("title");
        colorContainer.classList.add("color", "container", "button");
        colorTitle.innerText = name;
        colorSwatch.style.backgroundColor = name;
        colorContainer.append(colorSwatch, colorTitle);
        bgColorDiv.append(colorContainer);
    }
}

pageColorToggle.addEventListener("click", () => {
    toggleView(pageColorDiv);
});

colorDetailsToggle.addEventListener("click", () => {
    toggleView(colorDetailsDiv);
});

contrastToggle.addEventListener("click", () => {
    toggleView(contrastDiv);
});

minimizedContainer.addEventListener("click", () => {
    toggleApp(true);
});

minimizeButton.addEventListener("click", () => {
    toggleApp(false);
})

function toggleApp(showApp=true) {
    if (showApp) {
        modalContainer.toggleAttribute("hidden", false);
        minimizedContainer.toggleAttribute("hidden", true);
    }
    else {
        minimizedContainer.toggleAttribute("hidden", false);
        modalContainer.toggleAttribute("hidden", true);

    }
}

function toggleView(view=colorDetailsDiv) {
    if (view === colorDetailsDiv) {
        colorDetailsDiv.toggleAttribute("hidden", false);
        colorDetailsToggle.classList.add("active");
        pageColorDiv.toggleAttribute("hidden", true);
        pageColorToggle.classList.remove("active");
        contrastDiv.toggleAttribute("hidden", true);
        contrastToggle.classList.remove("active");
    } else if (view === pageColorDiv) {
        pageColorDiv.toggleAttribute("hidden", false);
        pageColorToggle.classList.add("active");
        colorDetailsDiv.toggleAttribute("hidden", true);
        colorDetailsToggle.classList.remove("active");
        contrastDiv.toggleAttribute("hidden", true);
        contrastToggle.classList.remove("active");
    } else if (view === contrastDiv) {
        contrastDiv.toggleAttribute("hidden", false);
        contrastToggle.classList.add("active");
        pageColorDiv.toggleAttribute("hidden", true);
        pageColorToggle.classList.remove("active");
        colorDetailsDiv.toggleAttribute("hidden", true);
        colorDetailsToggle.classList.remove("active");
    }
}

// HELPERS
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
            ? 2 + (b - r) / s
            : 4 + (r - g) / s
        : 0;
    return {
        h: Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h),
        s: Number(((s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)).toFixed(2)),
        l: Number((((2 * l - s)) / 2).toFixed(2)),
    };
}

function hslToRgb(h, s, l) {
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
        r: Math.round(255 * f(0)),
        g: Math.round(255 * f(8)),
        b: Math.round(255 * f(4)),
    };
}

function captureParentheses(input = "") {
    const regex = /\((.+)\)/gi;
    if (input === "" || typeof input !== "string") {
        throw Error("Input must be a string and cannot be blank.");
    } else if (!input.includes("(") || !input.includes(")")) {
        throw Error("No parentheses found.");
    }
    return regex.exec(input)[1];
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

function getLuminance(r, g, b) {
    var [lumR, lumG, lumB] = [r, g, b].map((component) => {
        var proportion = component / 255;
        return proportion <= 0.03928
            ? proportion / 12.92
            : Math.pow((proportion + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB;
}

/* https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
function componentToHex(c) {
    c = Math.round(Number(c));
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function formatRatio(ratio) {
    var ratioAsFloat = ratio.toFixed(2);
    var isInteger = Number.isInteger(parseFloat(ratioAsFloat));
    return isInteger ? Number(Math.floor(ratio)) : Number(ratioAsFloat);
}

function getColor(input) {
    // console.log(`**************** getColor(${input}) ***************`);
    var rgbArray = [],
        hslArray = [],
        hex = "",
        rgbObj = {},
        hslObj = {};
    if (typeof input === "string") {
        // console.log("This is a string...");
        if (input.match(hexRegex)) {
            var match = input.match(hexRegex)[0];
            if (match.startsWith("#")) {
                hex = match;
            } else {
                hex = "#" + match;
            }
            rgbObj = hexToRgb(hex);
            hslObj = rgbToHsl(rgbObj.r, rgbObj.g, rgbObj.b);
        } else if (input.match(hslRegex)) {
            console.log("This is an hsl string...");
            var extractedHSL = captureParentheses(input).split(",");
            console.log({ extractedHSL });
            extractedHSL.forEach(function (e) {
                if (e.includes("%")) {
                    /* Convert percentages to decimals */
                    console.log("There is a percent sign.");
                    hslArray.push(Number(e.replace(/\D/g, "")) / 100);
                } else {
                    console.log("There is no percentage sign.");
                    hslArray.push(Number(e));
                }
            });
            console.log({ hslArray });
            rgbObj = hslToRgb(hslArray[0], hslArray[1], hslArray[2]);
            hslObj = { h: hslArray[0], s: hslArray[1], l: hslArray[2] };
            hex = rgbToHex(rgbObj.r, rgbObj.g, rgbObj.b);
        } else if (input.match(rgbRegex)) {
            // console.log("This is an rgb string.");
            var extractedRgb = captureParentheses(input).split(",");
            extractedRgb.forEach(function (e) {
                rgbArray.push(Number(e));
            });
            rgbObj = { r: rgbArray[0], g: rgbArray[1], b: rgbArray[2] };
            // hslObj = rgbToHsl(...rgbArray);
            hslObj = rgbToHsl(...rgbArray);
            hex = rgbToHex(...rgbArray);
        } else {
            throw Error("This is an unrecognized string.");
        }
    } else if (Array.isArray(input)) {
        // console.log("This is an array...");
        var isRgb = true,
            isHsl = false;
        input.forEach(function (e) {
            if (e.toString().includes(".") || e.toString().includes("%")) {
                // if (e.includes('.') || e.includes('%')) {
                isRgb = false;
                isHsl = true;
            }
        });
        if (isRgb) {
            hex = rgbToHex(...input);
            rgbObj = { r: input[0], g: input[1], b: input[2] };
            hslObj = rgbToHsl(...input);
        } else {
            rgbObj = hslToRgb(...input);
            hslObj = { h: input[0], s: input[1], l: input[2] };
            hex = rgbToHex(rgbObj.r, rgbObj.g, rgbObj.b);
        }
    } else {
        if ("r" in input && "g" in input && "b" in input) {
            rgbObj = input;
            hslObj = rgbToHsl(input.r, input.g, input.b);
            hex = rgbToHex(input.r, input.g, input.b);
        } else if ("red" in input && "green" in input && "blue" in input) {
            rgbObj = { r: input.red, g: input.green, b: input.blue };
            hslObj = rgbToHsl(input.red, input.green, input.blue);
            hex = rgbToHex(input.red, input.green, input.blue);
        } else if ("h" in input && "s" in input && "l" in input) {
            hslObj = { h: input.h, s: input.s, l: input.l };
            rgbObj = hslToRgb(input.h, input.s, input.l);
            hex = rgbToHex(rgbObj.r, rgbObj.g, rgbObj.b);
        } else {
            throw Error(`Cannot determine color from the given input.`);
        }
    }
    hex = hex.toUpperCase();
    rgbArray = [rgbObj.r, rgbObj.g, rgbObj.b];
    hslArray = rgbToHsl(rgbArray[0], rgbArray[1], rgbArray[2]);
    luminance = getLuminance(rgbObj.r, rgbObj.g, rgbObj.b);
    var result = {
        hex,
        rgb: rgbObj,
        rgbString: `rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`,
        hsl: hslObj,
        hslString: `hsl(${hslObj.h}, ${hslObj.s * 100}%, ${hslObj.l * 100}%)`,
        luminance,
    };
    return result;
}
