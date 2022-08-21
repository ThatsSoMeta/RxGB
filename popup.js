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
    pageColorsView = document.getElementById("pageColorsView"),
    colorDetailsView = document.getElementById("colorDetailsView"),
    contrastView = document.getElementById("contrastView"),
    hslView = document.getElementById("hslView"),
    rgbView = document.getElementById("rgbView"),
    pageColorToggle = document.getElementById("pageColorTab"),
    colorDetailsToggle = document.getElementById("colorDetailTab"),
    contrastToggle = document.getElementById("contrastTab"),
    colorDetailsSwatch = document.getElementById("detailSwatch"),
    hslSwatch = document.getElementById("hslSwatch"),
    swatchSize = "20px",
    websiteFontColorDiv = document.getElementById("fontColors"),
    websiteBgColorDiv = document.getElementById("bgColors"),
    contrastFontPalette = document.querySelector(
        "#contrastView #fontColor .palette"
    ),
    contrastBgPalette = document.querySelector(
        "#contrastView #bgColor .palette"
    ),
    contrastExampleText = document.getElementById("exampleText"),
    contrastAASmall = document.getElementById("aa-small"),
    contrastAALarge = document.getElementById("aa-large"),
    contrastAAASmall = document.getElementById("aaa-small"),
    contrastAAALarge = document.getElementById("aaa-large"),
    setColorBtns = document.querySelectorAll(".option:not(.edit)"),
    setBgBtns = document.querySelectorAll(".setBg");

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    port = chrome.tabs.connect(tabs[0].id, { name: "RxGB" });
    port.postMessage({ request: { type: "init" } });
    port.onMessage.addListener(function (response) {
        if (response.request === "init") {
            collectNativeColors(
                response.elements.fontColors,
                response.elements.bgColors
            );
            setContrastPalette("#FFFFFF", "bg");
            setContrastPalette("#000000", "font");
            updateDetailsView("#FFFFFF", true);
            let white = getColor("#FFFFFF");
            document
                .getElementById("hslAdjustContainer")
                .setAttribute("data-hue", Number(white.hsl.h));
            document
                .getElementById("hslAdjustContainer")
                .setAttribute(
                    "data-saturation",
                    Math.round(Number(white.hsl.s) * 100)
                );
            document
                .getElementById("hslAdjustContainer")
                .setAttribute(
                    "data-lightness",
                    Math.round(Number(white.hsl.l) * 100)
                );
            document
                .getElementById("rgbAdjustContainer")
                .setAttribute("data-red", Number(white.rgb.r));
            document
                .getElementById("rgbAdjustContainer")
                .setAttribute("data-green", Number(white.rgb.g));
            document
                .getElementById("rgbAdjustContainer")
                .setAttribute("data-blue", Number(white.rgb.b));
            updateSliderBackgroundsHSL();
        } else {
            console.log("RxGB non-Init in popup.js");
        }
    });
});

var contrastPaletteExamine = [
    contrastFontPalette.querySelector(".examine"),
    contrastBgPalette.querySelector(".examine"),
];
contrastPaletteExamine.forEach((elem) => {
    elem.addEventListener("click", (e) => {
        var palette = e.path.find((elem) => elem.classList.contains("palette")),
            currentColor = palette.querySelector(".hex").innerText;
        // setDetailPalette(currentColor);
        updateDetailsView(currentColor, true);
        toggleView(colorDetailsView);
    });
});

var editColorBtns = document.querySelectorAll(".option.edit");
editColorBtns.forEach((elem) => {
    elem.addEventListener("click", (e) => {
        var palette = e.path.find((node) => node.classList.contains("palette")),
            strings = palette.querySelector(".colorStrings"),
            inputContainer = palette.querySelector(".colorInput"),
            input = inputContainer.querySelector("input"),
            options = palette.querySelector(".options");
        console.log({ palette, strings });
        strings.toggleAttribute("hidden");
        options.toggleAttribute("hidden");
        inputContainer.toggleAttribute("hidden");
        input.focus();
    });
});

var updateColorBtns = document.querySelectorAll(".palette .updateBtn"),
    updateCancelBtns = document.querySelectorAll(".updateCancelBtn");
updateColorBtns.forEach((elem) => {
    elem.addEventListener("click", (e) => {
        var palette = e.path.find((element) =>
                element.classList.contains("palette")
            ),
            editForm = palette.querySelector(".colorInput"),
            colorStrings = palette.querySelector(".colorStrings"),
            input = editForm.querySelector("input"),
            options = palette.querySelector(".options"),
            selection = getColor(input.value),
            hex = palette.querySelector(".hex.string"),
            rgb = palette.querySelector(".rgb.string"),
            hsl = palette.querySelector(".hsl.string"),
            swatch = palette.querySelector(".swatch");
        if (selection) {
            input.style.border = "";
            input.value = "";
            swatch.style.backgroundColor = selection.hex;
            hex.innerText = selection.hex;
            rgb.innerText = selection.rgbString;
            hsl.innerText = selection.hslString;
            colorStrings.toggleAttribute("hidden");
            options.toggleAttribute("hidden");
            editForm.toggleAttribute("hidden");
            updateExampleText();
            updateDetailsView(selection.hex, true);

        } else {
            console.log("Invalid Color");
            input.style.border = "2px solid red";
            input.value = "";
            input.placeholder = "Please enter a valid color value";
        }
    });
});

updateCancelBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        var palette = e.path.find((elem) => elem.classList.contains("palette")),
            container = e.path.find((elem) => elem.classList.contains("section")),
            input = palette.querySelector("input"),
            editForm = palette.querySelector(".colorInput"),
            options = palette.querySelector(".options");
        input.value = "";
        container.querySelector(".colorStrings").toggleAttribute("hidden");
        editForm.toggleAttribute("hidden");
        options.toggleAttribute("hidden");
    });
});

let actionToggles = document.querySelectorAll(".action");
actionToggles.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        let view = e.path.find(elem => elem.classList.contains("view")),
            type = Array.from(view.classList).filter(item => item !== "view" && item !== "active")[0],
            attribute = Array.from(e.target.classList).filter((attr) => !["plus", "minus", "action"].includes(attr))[0],
            increment = e.target.classList.contains("plus") ? 1 : -1,
            currentVal = Number(view.getAttribute(`data-${attribute}`)),
            newVal = currentVal + increment,
            localInputs = view.querySelectorAll(`input.${attribute}`),
            swatch = view.querySelector(".swatch"),
            min = Number(localInputs[0].getAttribute("min")),
            max = Number(localInputs[0].getAttribute("max"));
        if (newVal > max) {
            newVal = max;
        }
        if (newVal < min) {
            newVal = min;
        }
        view.setAttribute(`data-${attribute}`, newVal);
        localInputs.forEach(input => {
            input.value = newVal;
        });
        if (type === "rgb") {
            let red = Number(view.getAttribute("data-red")),
                green = Number(view.getAttribute("data-green")),
                blue = Number(view.getAttribute("data-blue"));
            document.querySelector(":root").style.setProperty("--rgb", `rgb(${red}, ${green}, ${blue})`);
        }
        if (type === "hsl") {
            let hue = Number(view.getAttribute("data-hue")),
                saturation = Number(view.getAttribute("data-saturation")),
                lightness = Number(view.getAttribute("data-lightness"));
            document.querySelector(":root").style.setProperty("--hsl", `hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
    })
})

let ranges = document.querySelectorAll("input[type=range]");
ranges.forEach(range => {
    range.addEventListener("input", (e) => {
        let view = e.path.find(elem => elem.classList.contains("view")),
            type = Array.from(view.classList).filter(item => item !== "view" && item !== "active")[0],
            selectColor = e.path.find(elem => elem.classList.contains("selectColor")),
            attribute = Array.from(selectColor.classList).filter(item => item !== "selectColor")[0],
            otherInput = selectColor.querySelector(".valueInput");
        otherInput.value = e.target.value;
        view.setAttribute(`data-${attribute}`, e.target.value);
        if (type === "rgb") {
            let red = Number(view.getAttribute("data-red")),
                green = Number(view.getAttribute("data-green")),
                blue = Number(view.getAttribute("data-blue"));
                document.querySelector(":root").style.setProperty("--rgb", `rgb(${red}, ${green}, ${blue})`);
            }
        if (type === "hsl") {
            let hue = Number(view.getAttribute("data-hue")),
                saturation = Number(view.getAttribute("data-saturation")),
                lightness = Number(view.getAttribute("data-lightness"));
                document.querySelector(":root").style.setProperty("--hsl", `hsl(${hue}, ${saturation}%, ${lightness}%)`);
            }
    })
})

let colorInputFields = document.querySelectorAll("input[type=number]");
colorInputFields.forEach(input => {
    input.addEventListener("change", (e) => {
        let max = Number(e.target.max),
            min = Number(e.target.min),
            range = e.target.parentElement.querySelector("input[type=range]"),
            view = e.path.find(elem => elem.classList.contains("view")),
            type = Array.from(view.classList).filter(item => item !== "view" && item !== "active")[0],
            selectColor = e.path.find(elem => elem.classList.contains("selectColor")),
            attribute = Array.from(selectColor.classList).filter(item => item !== "selectColor")[0];
        if (Number(e.target.value) > max) {
            e.target.value = max;
        }
        if (Number(e.target.value) < min) {
            e.target.value = min;
        }
        let value = Number(e.target.value);
        range.value = value;
        view.setAttribute(`data-${attribute}`, e.target.value);
        if (type === "rgb") {
            let red = Number(view.getAttribute("data-red")),
                green = Number(view.getAttribute("data-green")),
                blue = Number(view.getAttribute("data-blue"));
                document.querySelector(":root").style.setProperty("--rgb", `rgb(${red}, ${green}, ${blue})`);
            }
        if (type === "hsl") {
            let hue = Number(view.getAttribute("data-hue")),
                saturation = Number(view.getAttribute("data-saturation")),
                lightness = Number(view.getAttribute("data-lightness"));
                document.querySelector(":root").style.setProperty("--hsl", `hsl(${hue}, ${saturation}%, ${lightness}%)`);
            }
    })
})

let tabs = document.querySelectorAll("#nav .tab");
tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
        let targetView = document.querySelector(
                e.target.getAttribute("data-ref")
            ),
            allViews = document.querySelectorAll(".view");
        for (let view of allViews) {
            if (view === targetView) {
                view.classList.add("active");
            } else {
                view.classList.remove("active");
            }
        }
        for (let button of tabs) {
            if (button === tab) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        }
    });
});

minimizedContainer.addEventListener("click", () => {
    toggleApp(true);
});

minimizeButton.addEventListener("click", () => {
    toggleApp(false);
});

setColorBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        let view = e.path.find(elem => elem.classList.contains("view")),
            type = e.target.classList.contains("setFont") ? "font" : e.target.classList.contains("setBg") ? "bg" : "examine",
            color;
        console.log({type});
        if (view.classList.contains("rgb")) {
            let red = Number(view.getAttribute("data-red")),
                green = Number(view.getAttribute("data-green")),
                blue = Number(view.getAttribute("data-blue"));
            color = `rgb(${red}, ${green}, ${blue})`;
        } else if (view.classList.contains("hsl")) {
            let hue = Number(view.getAttribute("data-hue")),
                saturation = Number(view.getAttribute("data-saturation")),
                lightness = Number(view.getAttribute("data-lightness"));
            color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        } else {
            let palette = e.path.find((elem) => elem.classList.contains("palette"));
            if (e.path.find(elem => elem.id === "detailButtons")) {
                var hex = palette.querySelector(".hex");
                color = hex.innerText;
            } else if (palette.querySelector(".colorDataDiv")) {
                var colorDetailsDiv = palette.querySelector(".colorDataDiv");
                console.log({palette, colorDetailsDiv});
                var hue = colorDetailsDiv.getAttribute("data-hue"),
                    saturation = colorDetailsDiv.getAttribute("data-saturation"),
                    lightness = colorDetailsDiv.getAttribute("data-lightness");
                color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                console.log({color});
            } else if (e.path.find(elem => elem.id === "fontColor" || elem.id === "bgColor")) {
                console.log({palette});
                color = palette.querySelector(".hsl.string").innerText;
            } else {
                console.log("This doesn't meet the above criteria");
                console.log({path: e.target});
            }
        }
        updateDetailsView(color, true);
        document.querySelector(":root").style.setProperty("--chosen", color);
        if (type === "examine") {
            toggleView(colorDetailsView);
        } else {
            setContrastPalette(color, type);
            toggleView(contrastView);
        }
    });
});

const updateHslSliders = new MutationObserver(() => {
    updateSliderBackgroundsHSL();
});
updateHslSliders.observe(document.getElementById('hslView'), {attributes: true, subtree: false, childList: false})

function updateDetailsView(color = "#FFFFFF", updateSliderDiv = false) {
    console.log("Updating Details View. Color:", color);
    let newColor = getColor(color),
        hexString = colorDetailsView.querySelector(".hex.string"),
        hslString = colorDetailsView.querySelector(".hsl.string"),
        rgbString = colorDetailsView.querySelector(".rgb.string"),
        luminanceString = colorDetailsView.querySelector(".luminance.string");
    hexString.innerText = newColor.hex;
    hslString.innerText = newColor.hslString;
    rgbString.innerText = newColor.rgbString;
    luminanceString.innerText = Math.round(
        Number(newColor.luminance.toFixed(2) * 100)
    );
    document.querySelector(":root").style.setProperty("--chosen", color);
    document.querySelector(":root").style.setProperty("--rgb", color);
    document.querySelector(":root").style.setProperty("--hsl", color);
    if (updateSliderDiv) {
        updateSliders(color);
    }
}

function updateSliders(color="#FFFFFF") {
    let newColor = getColor(color),
        retrievedColor = window.getComputedStyle(document.querySelector(":root")).getPropertyValue("--chosen")
        hslAdjust = document.getElementById("hslAdjustContainer"),
        rgbAdjust = document.getElementById("rgbAdjustContainer"),
        hueInput = hslAdjust.querySelector(".valueInput.hue"),
        hueSlider = hslAdjust.querySelector("#hueRange"),
        saturationInput = hslAdjust.querySelector(".valueInput.saturation"),
        saturationSlider = hslAdjust.querySelector("#saturationRange"),
        lightnessInput = hslAdjust.querySelector(".valueInput.lightness"),
        lightnessSlider = hslAdjust.querySelector("#lightnessRange"),
        redInput = rgbAdjust.querySelector(".valueInput.red"),
        redSlider = rgbAdjust.querySelector("#redRange"),
        greenInput = rgbAdjust.querySelector(".valueInput.green"),
        greenSlider = rgbAdjust.querySelector("#greenRange"),
        blueInput = rgbAdjust.querySelector(".valueInput.blue"),
        blueSlider = rgbAdjust.querySelector("#blueRange");
    console.log({color, retrievedColor});
    /* Update HSL */
    hueInput.value = newColor.hsl.h;
    hueSlider.value = newColor.hsl.h;
    saturationInput.value = Math.round(newColor.hsl.s * 100);
    saturationSlider.value = newColor.hsl.s * 100;
    lightnessInput.value = Math.round(newColor.hsl.l * 100);
    lightnessSlider.value = newColor.hsl.l * 100;
    hslView.setAttribute("data-hue", newColor.hsl.h);
    hslView.setAttribute("data-saturation", Number(newColor.hsl.s) * 100);
    hslView.setAttribute("data-lightness", Number(newColor.hsl.l) * 100);
    /* Update RGB */
    redInput.value = newColor.rgb.r;
    redSlider.value = newColor.rgb.r;
    greenInput.value = newColor.rgb.g;
    greenSlider.value = newColor.rgb.g;
    blueInput.value = newColor.rgb.b;
    blueSlider.value = newColor.rgb.b;
    rgbView.setAttribute("data-red", newColor.rgb.r);
    rgbView.setAttribute("data-green", newColor.rgb.g);
    rgbView.setAttribute("data-blue", newColor.rgb.b);
}

let colorDetailInputs = document.querySelectorAll(".selectColor input");

const exampleChangeObserver = new MutationObserver(function () {
    var style = window.getComputedStyle(contrastExampleText),
        color = getColor(style.color),
        bgColor = getColor(style.backgroundColor),
        contrast = getContrastRatio(color.hex, bgColor.hex),
        contrastLabel = document.querySelector(".contrast.ratio");
    contrastLabel.innerText = `${contrast}:1`;
    if (contrast >= 3) {
        contrastAALarge.style.borderColor = "var(--peacock)";
    } else {
        contrastAALarge.style.borderColor = "";
    }
    if (contrast >= 4.5) {
        contrastAASmall.style.borderColor = "var(--peacock)";
        contrastAAALarge.style.borderColor = "var(--peacock)";
    } else {
        contrastAASmall.style.borderColor = "";
        contrastAAALarge.style.borderColor = "";
    }
    if (contrast >= 7) {
        contrastAAASmall.style.borderColor = "var(--peacock)";
    } else {
        contrastAAASmall.style.borderColor = "";
    }
});

exampleChangeObserver.observe(contrastExampleText, {
    attributeFilter: ["style"],
});

function toggleApp(showApp = true) {
    if (showApp) {
        modalContainer.toggleAttribute("hidden", false);
        minimizedContainer.toggleAttribute("hidden", true);
    } else {
        minimizedContainer.toggleAttribute("hidden", false);
        modalContainer.toggleAttribute("hidden", true);
    }
}

function toggleView(selection) {
    let views = [
        colorDetailsView,
        pageColorsView,
        contrastView,
        hslView,
        rgbView,
    ];
    for (let view of views) {
        let type = [...view.classList].find(name => name !== "view" && name !== "active"),
            tab = document.querySelector(`#nav .${type}`);
        if (view === selection) {
            view.classList.add("active");
            tab.classList.add("active");
        } else {
            view.classList.remove("active");
            tab.classList.remove("active");
        }
    }
}

function setContrastPalette(color = "#FFFFFF", type = "font") {
    color = getColor(color);
    var container = type === "font" ? contrastFontPalette : contrastBgPalette,
        swatch = container.querySelector(".swatch"),
        hex = container.querySelector(".hex"),
        rgb = container.querySelector(".rgb"),
        hsl = container.querySelector(".hsl");
    swatch.style.backgroundColor = color.hex;
    hex.innerText = color.hex;
    rgb.innerText = color.rgbString;
    hsl.innerText = color.hslString;
    if (type === "font") {
        contrastExampleText.style.color = color.hex;
    } else if (type === "bg") {
        contrastExampleText.style.backgroundColor = color.hex;
    }
    updateDetailsView(color.hex, true);
    return color;
}

function collectNativeColors(fontColors, bgColors) {
    var fontColorsArray = Object.values(fontColors).sort((a, b) =>
            a.hsl.h > b.hsl.h
                ? 1
                : a.hsl.s === b.hsl.s
                ? a.hsl.s > b.hsl.s
                    ? 1
                    : -1
                : -1
        ),
        bgColorsArray = Object.values(bgColors).sort((a, b) =>
            a.hsl.h > b.hsl.h
                ? 1
                : a.hsl.s === b.hsl.s
                ? a.hsl.s > b.hsl.s
                    ? 1
                    : -1
                : -1
        );
    for (var color of fontColorsArray) {
        var colorContainer = document.createElement("div"),
            colorSwatch = document.createElement("div"),
            colorHex = document.createElement("h4"),
            colorRgb = document.createElement("h4"),
            colorHsl = document.createElement("h4"),
            selectBtn = document.createElement("button"),
            options = document.createElement("div");
        colorSwatch.classList.add("swatch");
        colorHex.classList.add("hex", "string");
        colorHex.setAttribute("title", "Click to copy");
        colorHex.addEventListener("click", (e) => {
            let content = e.target.innerText;
            console.log(content, "clicked");
            navigator.clipboard.writeText(content);
        })
        colorRgb.classList.add("rgb", "string");
        colorRgb.setAttribute("title", "Click to copy");
        colorRgb.addEventListener("click", (e) => {
            let content = e.target.innerText;
            console.log(content, "clicked");
            navigator.clipboard.writeText(content);
        })
        colorHsl.classList.add("hsl", "string");
        colorHsl.setAttribute("title", "Click to copy");
        colorHsl.addEventListener("click", (e) => {
            let content = e.target.innerText;
            console.log(content, "clicked");
            navigator.clipboard.writeText(content);
        })
        selectBtn.classList.add("option", "font", "plus");
        options.classList.add("options");
        colorContainer.classList.add("color", "container", "palette");
        colorHex.innerText = color.hex;
        colorRgb.innerText = color.rgbString;
        colorHsl.innerText = color.hslString;
        colorSwatch.style.backgroundColor = color.hex;
        colorContainer.append(
            colorSwatch,
            colorHex,
            colorRgb,
            colorHsl,
            selectBtn
        );
        selectBtn.title =
            "Click to select font color and to see details about this color.";
        websiteFontColorDiv.append(colorContainer);
        selectBtn.addEventListener("click", (e) => {
            var currentColor = e.path.find((elem) => elem.nodeName === "BUTTON")
                .previousElementSibling.previousElementSibling.textContent;
            setContrastPalette(currentColor, "font");
            updateDetailsView(currentColor);
        });
    }
    for (var color of bgColorsArray) {
        var colorContainer = document.createElement("div"),
            colorSwatch = document.createElement("div"),
            colorHex = document.createElement("h4"),
            colorRgb = document.createElement("h4"),
            colorHsl = document.createElement("h4"),
            selectBtn = document.createElement("button"),
            options = document.createElement("div");
        colorSwatch.classList.add("swatch");
        colorHex.classList.add("hex", "string");
        colorHex.setAttribute("title", "Click to copy");
        colorHex.addEventListener("click", (e) => {
            let content = e.target.innerText;
            console.log(content, "clicked");
            navigator.clipboard.writeText(content);
        })
        colorRgb.classList.add("rgb", "string");
        colorRgb.setAttribute("title", "Click to copy");
        colorRgb.addEventListener("click", (e) => {
            let content = e.target.innerText;
            console.log(content, "clicked");
            navigator.clipboard.writeText(content);
        })
        colorHsl.classList.add("hsl", "string");
        colorHsl.setAttribute("title", "Click to copy");
        colorHsl.addEventListener("click", (e) => {
            let content = e.target.innerText;
            console.log(content, "clicked");
            navigator.clipboard.writeText(content);
        })
        selectBtn.classList.add("option", "bg", "plus");
        options.classList.add("options");
        colorContainer.classList.add("color", "container", "palette");
        colorHex.innerText = color.hex;
        colorRgb.innerText = color.rgbString;
        colorHsl.innerText = color.hslString;
        colorSwatch.style.backgroundColor = color.hex;
        colorContainer.append(
            colorSwatch,
            colorHex,
            colorRgb,
            colorHsl,
            selectBtn
        );
        selectBtn.title =
            "Click to select background color and to see details about this color.";
        websiteBgColorDiv.append(colorContainer);
        selectBtn.addEventListener("click", (e) => {
            var currentColor = e.path.find((elem) => elem.nodeName === "BUTTON")
                .previousElementSibling.previousElementSibling.textContent;
            setContrastPalette(currentColor, "bg");
            updateDetailsView(currentColor, true);
        });
    }
}

let copyStrings = document.querySelectorAll(".string[title*='Click to copy']");
copyStrings.forEach(string => {
    string.addEventListener("click", (e) => {
        let content = string.innerText;
        console.log(content, "clicked");
        navigator.clipboard.writeText(content);
    })
})

function updateSliderBackgroundsHSL() {
    let container = document.getElementById("hslView"),
        hue = Number(container.getAttribute("data-hue")),
        saturation = Number(container.getAttribute("data-saturation")),
        lightness = Number(container.getAttribute("data-lightness")),
        hslStringForSaturation = `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`,
        hslStringForLightness = `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`;
    document.getElementById("saturationRange").style.background =
        hslStringForSaturation;
    document.getElementById("lightnessRange").style.background =
        hslStringForLightness;
}

function updateExampleText() {
    var color = window.getComputedStyle(
            document.querySelector("#fontColor .swatch")
        ).backgroundColor,
        bgColor = window.getComputedStyle(
            document.querySelector("#bgColor .swatch")
        ).backgroundColor;
    contrastExampleText.style.color = color;
    contrastExampleText.style.backgroundColor = bgColor;
}

function getContrastRatio(font = "#000000", bg = "#FFFFFF") {
    font = getColor(font);
    bg = getColor(bg);
    var lighterLum = Math.max(font.luminance, bg.luminance),
        darkerLum = Math.min(font.luminance, bg.luminance),
        contrast = Number(
            parseFloat((lighterLum + 0.05) / (darkerLum + 0.05)).toFixed(2)
        );
    return contrast;
}

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
        s: Number(
            s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0
        ).toFixed(2),
        l: Number((2 * l - s) / 2).toFixed(2),
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
            // console.log("This is an hsl string...");
            var extractedHSL = captureParentheses(input).split(",");
            // console.log({ extractedHSL });
            extractedHSL.forEach(function (e) {
                if (e.includes("%")) {
                    /* Convert percentages to decimals */
                    // console.log("There is a percent sign.");
                    hslArray.push(Number(e.replace(/\D/g, "")) / 100);
                } else {
                    // console.log("There is no percentage sign.");
                    hslArray.push(Number(e).toFixed(2));
                }
            });
            // console.log({ hslArray });
            rgbObj = hslToRgb(hslArray[0], hslArray[1], hslArray[2]);
            hslObj = {
                h: Number(hslArray[0]),
                s: Number(hslArray[1]).toFixed(2),
                l: Number(hslArray[2]).toFixed(2),
            };
            hex = rgbToHex(rgbObj.r, rgbObj.g, rgbObj.b);
        } else if (input.match(rgbRegex)) {
            // console.log("This is an rgb string.");
            var extractedRgb = captureParentheses(input).split(",");
            extractedRgb.forEach(function (e) {
                rgbArray.push(Number(e));
            });
            rgbObj = { r: rgbArray[0], g: rgbArray[1], b: rgbArray[2] };
            hslObj = rgbToHsl(...rgbArray);
            hex = rgbToHex(...rgbArray);
        } else {
            return undefined;
        }
    } else if (Array.isArray(input)) {
        // console.log("This is an array...");
        var isRgb = true,
            isHsl = false;
        input.forEach(function (e) {
            if (e.toString().includes(".") || e.toString().includes("%")) {
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
            throw Error(
                `Cannot determine color from the given input: ${input}`
            );
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
        hslString: `hsl(${hslObj.h}, ${Math.round(
            hslObj.s * 100
        )}%, ${Math.round(hslObj.l * 100)}%)`,
        luminance,
    };
    return result;
}

// https://www.reddit.com/r/learnjavascript/comments/31glai/color_selector_help/
// function toggleColorPicker(enable=true) {
//     if (enable) {
//         $(window).on("click", function(ev) {
//             var x = ev.clientX;
//             var y = ev.clientY;

//             html2canvas(document.body).then(function(canvas) {
//                var ctx = canvas.getContext('2d');
//                var p = ctx.getImageData(x, y, 1, 1).data;
//                var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
//                console.log(hex);
//             });
//           });
//     }
// }
