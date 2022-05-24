var AA = 4.5,
    AAA = 7,
    RGB = "rgb",
    HEX = "hex",
    HSL = "hsl",
    rgbRegex = /\s*\d+,\s*\d+,\s*\d+/gi,
    hexRegex = /#?[0-9a-f]{6}/gi,
    hslRegex = /hsl\(\d+,[\s\d%.]+,[\s\d%.]+\)/gi,
    pageColorToggle = document.getElementById("pageColorToggle"),
    pageColorDiv = document.getElementById("pageColors"),
    swatchSize = "20px",
    allElems = document.querySelectorAll("body *"),
    fontColors = {},
    bgColors = {},
    allColors = { fontColors, bgColors };

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    port = chrome.tabs.connect(tabs[0].id, { name: "RxGB" });
    port.postMessage({ request: { type: "init" } });
    port.onMessage.addListener(function (response) {
        if (response.request === "init") {
            console.log("RxGB Init in popup.js");
        } else {
            console.log("RxGB non-Init in popup.js");
        }
    });
});

for (let elem of allElems) {
    let style = window.getComputedStyle(elem);
    if (style.color) {
        // fontColors.push(getColor(style.color))
        let verboseColor = getColor(style.color);
        if (!fontColors[verboseColor.hex]) {
            fontColors[verboseColor.hex] = verboseColor;
        }
    }
    if (style.backgroundColor) {
        // bgColors.push(getColor(style.backgroundColor))
        let verboseColor = getColor(style.backgroundColor);
        if (!bgColors[verboseColor.hex]) {
            bgColors[verboseColor.hex] = verboseColor;
        }
    }
}

let fontColorDiv = document.getElementById("fontColors"),
    bgColorDiv = document.getElementById("bgColors");

function collectNativeColors() {
    let fontColorsArray = Object.values(fontColors),
        bgColorsArray = Object.values(bgColors);
    for (let color of fontColorsArray) {
        let name = color.hex,
            colorContainer = document.createElement("div"),
            colorSwatch = document.createElement("div"),
            colorTitle = document.createElement("h3");
        colorTitle.innerText = name;
        colorTitle.style.padding = "5px";
        colorSwatch.style.backgroundColor = name;
        colorSwatch.style.borderRadius = "50%";
        colorSwatch.style.height = "20px";
        colorSwatch.style.width = "20px";
        colorSwatch.style.border = "2px solid black";
        colorSwatch.style.padding = "5px";
        colorContainer.style.display = "flex";
        colorContainer.style.justifyContent = "space-between";
        colorContainer.style.alignItems = "center";
        colorContainer.style.padding = "5px";
        colorContainer.append(colorTitle, colorSwatch);
        fontColorDiv.append(colorContainer);
    }
    for (let color of bgColorsArray) {
        let name = color.hex,
            colorContainer = document.createElement("div"),
            colorSwatch = document.createElement("div"),
            colorTitle = document.createElement("h3");
        colorTitle.innerText = name;
        colorTitle.style.padding = "5px";
        colorSwatch.style.backgroundColor = name;
        colorSwatch.style.borderRadius = "50%";
        colorSwatch.style.height = "20px";
        colorSwatch.style.width = "20px";
        colorSwatch.style.border = "2px solid black";
        colorSwatch.style.padding = "5px";
        colorContainer.style.display = "flex";
        colorContainer.style.justifyContent = "space-between";
        colorContainer.style.alignItems = "center";
        colorContainer.style.padding = "5px";
        colorContainer.append(colorTitle, colorSwatch);
        bgColorDiv.append(colorContainer);
    }
}

collectNativeColors();

pageColorToggle.addEventListener("click", () => {
    pageColorDiv.toggleAttribute("hidden");
    if (pageColorDiv.hidden) {
        pageColorToggle.innerHTML = "Show Page Colors";
    } else {
        pageColorToggle.innerHTML = "Hide Page Colors";
    }
});

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
        h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
        s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
        l: (100 * (2 * l - s)) / 2,
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
    let [lumR, lumG, lumB] = [r, g, b].map((component) => {
        let proportion = component / 255;
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
    let ratioAsFloat = ratio.toFixed(2);
    let isInteger = Number.isInteger(parseFloat(ratioAsFloat));
    return isInteger ? Number(Math.floor(ratio)) : Number(ratioAsFloat);
}

function getColor(input) {
    // console.log(`**************** getColor(${input}) ***************`);
    let rgbArray = [],
        hslArray = [],
        hex = "",
        rgbObj = {},
        hslObj = {};
    if (typeof input === "string") {
        // console.log("This is a string...");
        if (input.match(hexRegex)) {
            let match = input.match(hexRegex)[0];
            if (match.startsWith("#")) {
                hex = match;
            } else {
                hex = "#" + match;
            }
            rgbObj = hexToRgb(hex);
            hslObj = rgbToHsl(rgbObj.r, rgbObj.g, rgbObj.b);
        } else if (input.match(hslRegex)) {
            console.log("This is an hsl string...");
            let extractedHSL = captureParentheses(input).split(",");
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
            let extractedRgb = captureParentheses(input).split(",");
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
        let isRgb = true,
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
    let result = {
        hex,
        rgb: rgbObj,
        rgbString: `rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`,
        hsl: hslObj,
        hslString: `hsl(${hslObj.h}, ${hslObj.s * 100}%, ${hslObj.l * 100}%)`,
        luminance,
    };
    return result;
}
