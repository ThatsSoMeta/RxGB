var modalContainer = document.createElement("div"),
  modalToggleButton = document.createElement("button"),
  originalComboContainer = document.createElement("div"),
  origTextColorInputLabel = document.createElement("label"),
  origTextDiv = document.createElement("div"),
  origTextColorInput = document.createElement("input"),
  origTextSwatch = document.createElement("div"),
  origBgColorInputLabel = document.createElement("label"),
  origBgDiv = document.createElement("div"),
  origBgColorInput = document.createElement("input"),
  origBgSwatch = document.createElement("div"),
  colorSubmitButton = document.createElement("button"),
  newTextColorSuggestionContainer = document.createElement("div"),
  newBgColorSuggestionContainer = document.createElement("div"),
  newComboContainer1 = document.createElement("div"),
  newComboContainer2 = document.createElement("div"),
  resultContainer = document.createElement("div"),
  input = document.createElement("input"),
  contrastOptionContainer = document.createElement("div"),
  AARadio = document.createElement("input"),
  AAARadio = document.createElement("input"),
  rxgbLogoURL = "https://i.ibb.co/T22Nc8J/rxgb-logo-wknd.png",
  wkndDarkBlue = "#303D78",
  wkndLightBlue = "#3D54CC",
  wkndGreen = "#24B79D",
  wkndRed = "#FF4133",
  wkndYellow = "#FFBB00",
  wkndSand = "#F4EAE1",
  wkndBrown = "#CC9965",
  black = "#000",
  white = "#FFF",
  borderWidth = "3px",
  AA = 4.5,
  AAA = 7,
  RGB = "rgb",
  HEX = "hex",
  HSL = "hsl",
  rgbRegex = /\s*\d+,\s*\d+,\s*\d+/gi,
  hexRegex = /#?[0-9a-f]{6}/gi,
  hslRegex = /hsl\(\d+,[\s\d%.]+,[\s\d%.]+\)/gi,
  allContainers = [
    modalContainer,
    newTextColorSuggestionContainer,
    newBgColorSuggestionContainer,
    originalComboContainer,
    newComboContainer1,
    newComboContainer2,
    resultContainer,
    contrastOptionContainer,
  ],
  comboContainers = [
    originalComboContainer,
    newComboContainer1,
    newComboContainer2,
    resultContainer,
  ];

for (let container of allContainers) {
  if (!container.classList.contains("rxgb")) {
    container.classList.add("rxgb");
  }
  container.style.display = "flex";
  container.style.alignItems = "center";
  if (container === contrastOptionContainer) {
    container.style.width = "80%";
    container.style.justifyContent = "space-around";
  } else {
    container.style.flexDirection = "column";
    container.style.justifyContent = "space-between";
  }
}

for (let radio of [AARadio, AAARadio]) {
  let label = document.createElement("label"),
    container = document.createElement("div");
  radio.type = "radio";
  radio.name = "contrast-target";
  radio.style.margin = "auto";
  if (radio === AARadio) {
    AARadio.id = "aa";
    AARadio.value = AA;
    AARadio.checked = true;
    label.innerText = "AA";
    label.style.fontSize = "12px";
    label.setAttribute("for", "aa");
  } else {
    AAARadio.id = "aaa";
    AAARadio.value = AAA;
    label.innerText = "AAA";
    label.style.fontSize = "12px";
    label.setAttribute("for", "aaa");
  }
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.append(label, radio);
  contrastOptionContainer.append(container);
}

modalContainer.classList.add("modal-container", "collapsed");
modalContainer.style.backgroundColor = "white";
modalContainer.style.backgroundImage = `url(${rxgbLogoURL})`;
modalContainer.style.backgroundRepeat = "no-repeat";
modalContainer.style.backgroundSize = "45px";
modalContainer.style.backgroundPosition = "center left 15px";
modalContainer.style.boxShadow = "0 0 10px black";
modalContainer.style.color = "black";
modalContainer.style.fontSize = "16px";
modalContainer.style.border = `${borderWidth} solid black`;
modalContainer.style.borderRadius = "10px";
modalContainer.style.zIndex = "2147483647";
modalContainer.style.position = "fixed";
modalContainer.style.bottom = "5px";
modalContainer.style.right = "5px";
modalContainer.style.padding = "10px";
modalContainer.style.transition =
  "height .3s ease-in-out, width .3s ease-in-out";
modalContainer.style.minWidth = "100px";
modalContainer.style.minHeight = "35px";
modalContainer.style.alignItems = "flex-end";

modalToggleButton.innerText = "+";
modalToggleButton.style.fontSize = "16px";
modalToggleButton.style.fontWeight = "bold";
modalToggleButton.style.cursor = "pointer";
modalToggleButton.style.backgroundColor = "transparent";
modalToggleButton.style.border = "none";
modalToggleButton.onclick = toggleContainerDisplay;

modalContainer.append(modalToggleButton);

colorSubmitButton.innerText = "Check Contrast";
colorSubmitButton.style.backgroundColor = "white";
colorSubmitButton.style.color = "black";
colorSubmitButton.style.fontWeight = "bold";
colorSubmitButton.style.padding = "5px 10px";
colorSubmitButton.style.margin = "5px";
colorSubmitButton.style.border = `${borderWidth} solid black`;
colorSubmitButton.style.borderRadius = "5px";
colorSubmitButton.style.cursor = "pointer";
colorSubmitButton.onclick = submitColors;

function submitColors() {
  // console.log(`********** submitColors():`);
  let contrastTarget = Number(
      document.querySelector('input[name="contrast-target"]:checked').value
    ),
    textColorInput = document.querySelector(
      "input#orig-text-color-input"
    ).value,
    bgColorInput = document.querySelector("input#orig-bg-color-input").value,
    origTextRgb = getColor(textColorInput).rgb,
    origBgRgb = getColor(bgColorInput).rgb;
  if (textColorInput === "" || bgColorInput === "") {
    throw Error("Please make a selection for both colors.")
  } else {
    let result = getCompliantColor(origTextRgb, origBgRgb, contrastTarget);
    // console.log("Is there a result? ", !!result);
    // console.log(`************* END submitColors() ***************`);
  }
}

function toggleContainerDisplay() {
  if (jQuery(".modal-container").hasClass("collapsed")) {
    modalContainer.classList.remove("collapsed");
    modalContainer.classList.add("expanded");
    modalContainer.style.backgroundPosition = "center top 10px";
    modalContainer.style.alignItems = "flex-start";
    modalToggleButton.innerText = "hide";
    modalToggleButton.style.fontSize = "10px";
    jQuery(".original-colors, .original-colors *").css("display", "flex");
  } else {
    modalContainer.classList.remove("expanded");
    modalContainer.classList.add("collapsed");
    modalContainer.style.backgroundPosition = "center left 10px";
    modalContainer.style.alignItems = "flex-end";
    modalToggleButton.innerText = "+";
    modalToggleButton.style.fontSize = "16px";
    jQuery(".original-colors, .result-colors").css("display", "none");
  }
}

function updateSwatch(e) {
  let hex = getColor(e.target.value).hex,
    rgb = getColor(e.target.value).rgb;
  if (e.target.id === "orig-text-color-input") {
    origTextSwatch.style.backgroundColor = hex;
  } else {
    origBgSwatch.style.backgroundColor = hex;
  }
  // if (e.target.value.match(hexRegex)) {
  //   e.target.value = hex;
  // } else if (e.target.value.match(rgbRegex)) {
  //   e.target.value = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  // }
  // console.log({ hex, rgb });
}

for (let element of comboContainers) {
  let header = document.createElement("h6");
  if (!element.classList.contains("rxgb")) {
    element.classList.add("rxgb");
  }
  element.style.borderRadius = "10px";
  element.style.transition = "all .3s";
  header.style.textAlign = "center";
  header.style.fontWeight = "bold";
  header.style.fontSize = "12px";
  element.style.display = "none";
  if (element === originalComboContainer) {
    header.innerText = "Original Color";
    header.style.marginBottom = "5px";
    element.prepend(header);
    element.classList.add("original-colors");
    element.style.backgroundColor = "lightgray";
    element.style.border = `${borderWidth} solid darkgray`;
    element.style.padding = "10px";
    element.style.marginTop = "15px";
    modalContainer.append(element);
  } else if (element === resultContainer) {
    header.innerText = "Results";
    header.style.marginBottom = "5px";
    element.style.marginTop = "15px";
    element.prepend(header);
    element.classList.add("result-colors");
  } else if (element === newComboContainer1) {
    header.innerText = "Option 1";
    element.append(header);
    resultContainer.append(element);
  } else if (element === newComboContainer2) {
    header.innerText = "Option 2";
    element.append(header);
    resultContainer.append(element);
  }
}
modalContainer.append(resultContainer);

origTextColorInput.id = "orig-text-color-input";

for (let swatch of [origBgSwatch, origTextSwatch]) {
  swatch.style.backgroundColor = "white";
  swatch.style.borderRadius = "50%";
  swatch.style.border = `${borderWidth} solid black`;
  swatch.style.height = "35px";
  swatch.style.width = "35px";
}

for (let input of [origTextColorInput, origBgColorInput]) {
  input.style.textAlign = "center";
  input.style.border = `${borderWidth} solid black`;
  input.style.borderRadius = "5px";
  input.style.height = "35px";
  input.placeholder = "rgb() or #Hex";
  input.style.marginRight = "10px";
  input.onchange = updateSwatch;
  input.oninput = updateSwatch;
}

origTextColorInputLabel.setAttribute("for", "orig-text-color-input");
origTextColorInputLabel.innerText = "Text:";
origTextColorInputLabel.style.fontSize = "10px";

origBgColorInput.id = "orig-bg-color-input";

origBgColorInputLabel.setAttribute("for", "orig-bg-color-input");
origBgColorInputLabel.innerText = "Background:";
origBgColorInputLabel.style.fontSize = "10px";

origTextDiv.append(origTextColorInput, origTextSwatch);
origBgDiv.append(origBgColorInput, origBgSwatch);

for (let element of [origTextDiv, origBgDiv]) {
  element.style.display = "flex";
  element.style.alignItems = "center";
  element.style.justifyContent = "center";
}

originalComboContainer.append(
  origTextColorInputLabel,
  origTextDiv,
  origBgColorInputLabel,
  origBgDiv,
  contrastOptionContainer
);

contrastOptionContainer.style.margin = "10px";

originalComboContainer.append(colorSubmitButton);

resultContainer.style.backgroundColor = "rgb(240, 240, 240)";
resultContainer.style.padding = "10px";

if (jQuery(".rxgb.modal-container").length) {
  jQuery(".rxgb.modal-container").remove();
}
document.body.append(modalContainer);
console.log("");
console.log("#d84000");
console.log("#1870f0");
console.log("rgb(255,255,255)");
console.log("rgb(255,255,0)");

/************************************* END MODAL STYLING ***************************************/

let textColor = [161, 161, 161];
let bgColor = [255, 255, 255];
let nonGrayColor = [255, 30, 50];
let exampleColor = [24, 98, 118];
let michelle = [37, 184, 157];

/*
LOGIC
http://www.workwithcolor.com/color-luminance-2233.htm
https://munsell.com/color-blog/difference-chroma-saturation/

*/

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
  c = Number(c);
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
      console.log(input.match(hexRegex));
      let match = input.match(hexRegex)[0]
      if (match.startsWith("#")) {
        hex = match;
      } else {
        hex = "#" + match;
      }
      rgbObj = hexToRgb(hex);
      hslObj = rgbToHsl(rgbObj.r, rgbObj.g, rgbObj.b);
    } else if (input.match(hslRegex)) {
      // console.log("This is an hsl string...");
      let extractedHSL = captureParentheses(input).split(",");
      extractedHSL.forEach(function (e) {
        if (e.includes("%")) {
          /* Convert percentages to decimals */
          hslArray.push(Number(e.replace(/\D/g, "")) / 100);
        } else {
          hslArray.push(Number(e));
        }
      });
      rgbObj = hslToRgb(hslArray[0], hslArray[1], hslArray[2]);
      hslObj = { h: hslArray[0], s: hslArray[1], l: hslArray[2] };
      hex = rgbToHex(rgbObj.r, rgbObj.g, rgbObj.b);
    } else if (input.match(rgbRegex)) {
      // console.log("This is an rgb string.");
      let extractedRgb = captureParentheses(input).split(",");
      extractedRgb.forEach(function (e) {
        rgbArray.push(Number(e))
      })
      rgbObj = {r: rgbArray[0], g: rgbArray[1], b: rgbArray[2]};
      hslObj = rgbToHsl(...rgbArray);
      hex = rgbToHex(...rgbArray);
    } else {
      throw Error("This is an unrecognized string.");
    }
  } else if (Array.isArray(input)) {
    // console.log("This is an array...");
    let isRgb = true,
      isHsl = false;
    input.forEach(function(e) {
      if (e.toString().includes('.') || e.toString().includes('%')) {
        isRgb = false;
        isHsl = true;
      }
    });
    if (isRgb) {
      hex = rgbToHex(...input);
      rgbObj = {r: input[0], g: input[1], b: input[2]};
      hslObj = rgbToHsl(...input)
    } else {
      rgbObj = hslToRgb(...input);
      hslObj = {h: input[0], s: input[1], l: input[2]};
      hex = rgbToHex(rgbObj.r, rgbObj.g, rgbObj.b);
    }
  } else {
    if ('r' in input && 'g' in input && 'b' in input) {
      rgbObj = input;
      hslObj = rgbToHsl(input.r, input.g, input.b);
      hex = rgbToHex(input.r, input.g, input.b)
    } else if ('red' in input && 'green' in input && 'blue' in input) {
      rgbObj = {r: input.red, g: input.green, b: input.blue};
      hslObj = rgbToHsl(input.red, input.green, input.blue);
      hex = rgbToHex(input.red, input.green, input.blue);
    } else if ('h' in input && 's' in input && 'l' in input) {
      hslObj = {h: input.h, s: input.s, l: input.l};
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
    hsl: hslObj,
    luminance,
  };
  return result;
}

function captureParentheses(input = "") {
  let regex = /\((.+)\)/gi;
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

/* https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl */
function rgbToHsl(r, g, b, goalLuminanceFactor = 1) {
  // console.log(
  //   `********** RGBtoHSL(r = ${r}, g = ${g}, b = ${b}, goalLuminance = ${goalLuminanceFactor})`
  // );
  r /= 255;
  g /= 255;
  b /= 255;
  r = Number(parseFloat(r).toFixed(2));
  g = Number(parseFloat(g).toFixed(2));
  b = Number(parseFloat(b).toFixed(2));
  var maxVal = Number(parseFloat(Math.max(r, g, b)).toFixed(2)),
    minVal = Number(parseFloat(Math.min(r, g, b)).toFixed(2)),
    lightness = Math.round(((maxVal + minVal) / 2) * 100) / 100,
    saturation,
    hue = 0;
  if (maxVal === minVal) {
    saturation = 0;
  } else {
    if (lightness <= 0.5) {
      saturation =
        Math.round(((maxVal - minVal) / (maxVal + minVal)) * 100) / 100;
    } else {
      saturation =
        Math.round(((maxVal - minVal) / (2 - maxVal - minVal)) * 100) / 100;
    }
    if (maxVal === r) {
      hue = (g - b) / (maxVal - minVal);
      // console.log({ hue });
    } else if (maxVal === g) {
      hue = 2 + (b - r) / (maxVal - minVal);
      // hue *= 60;
      // if (hue < 0) {
      //   hue += 360;
      // }
    } else {
      hue = 4 + (r - g) / (maxVal - minVal);
      // hue *= 60;
      // if (hue < 0) {
      //   hue += 360;
      // }
    }
  }
  hue *= 60;
  hue = Math.round(hue);
  if (hue < 0) {
    hue += 360;
  } else if (hue === 0) {
    hue = 0;
  }
  // console.log("Hue in RGBtoHSL(): ", hue);
  let result = { h: hue, s: saturation, l: lightness };
  // var newRGB = HSLtoRGB(hue, saturation, luminance, goalLuminanceFactor);
  // return newRGB;
  // console.log("New rgb:", newRGB);
  // console.log(
  //   `*********** END RGBtoHSL(): {hue: ${result.h}, saturation: ${result.s}, lightness: ${result.l}}`
  // );
  return result;
}

function hslToRgb(hue, saturation, lightness, goalLuminanceFactor = 1) {
  // console.log(
  //   `******* HSLtoRGB(${hue}, ${saturation}, ${lightness}, ${goalLuminanceFactor})`
  // );
  var red,
    green,
    blue,
    temporary_1,
    temporary_2,
    temporary_r,
    temporary_g,
    temporary_b;
  lightness *= goalLuminanceFactor;
  // console.log({ luminance: lightness });
  // console.log("^This should be a number");
  if (saturation === 0) {
    // console.log("This is a grayscale color.");
    var rbgVal = Math.round(255 * lightness);
    red = rbgVal;
    green = rbgVal;
    blue = rbgVal;
  } else {
    // console.log("This is not a grayscale color.");
    if (lightness < 0.5) {
      temporary_1 = lightness * (1 + saturation);
    } else {
      temporary_1 = lightness + saturation - lightness * saturation;
    }
    temporary_2 = 2 * lightness - temporary_1;
    hue /= 360;
    temporary_r = hue + 0.333;
    temporary_g = hue;
    temporary_b = hue - 0.333;
    if (temporary_r > 1) {
      temporary_r -= 1;
    } else if (temporary_r < 0) {
      temporary_r += 1;
    }
    if (temporary_g > 1) {
      temporary_g -= 1;
    } else if (temporary_g < 0) {
      temporary_g += 1;
    }
    if (temporary_b > 1) {
      temporary_b -= 1;
    } else if (temporary_b < 0) {
      temporary_b += 1;
    }
    // Red tests
    if (6 * temporary_r < 1) {
      red = temporary_2 + (temporary_1 - temporary_2) * 6 * temporary_r;
    } else if (2 * temporary_r < 1) {
      red = temporary_1;
    } else if (3 * temporary_r < 2) {
      red =
        temporary_2 + (temporary_1 - temporary_2) * (0.666 - temporary_r) * 6;
    } else {
      red = temporary_2;
    }
    // Green Tests
    if (6 * temporary_g < 1) {
      green = temporary_2 + (temporary_1 - temporary_2) * 6 * temporary_g;
    } else if (2 * temporary_g < 1) {
      green = temporary_1;
    } else if (3 * temporary_g < 2) {
      green =
        temporary_2 + (temporary_1 - temporary_2) * (0.666 - temporary_g) * 6;
    } else {
      green = temporary_2;
    }
    // Blue Tests
    if (6 * temporary_b < 1) {
      blue = temporary_2 + (temporary_1 - temporary_2) * 6 * temporary_b;
    } else if (2 * temporary_b < 1) {
      blue = temporary_1;
    } else if (3 * temporary_b < 2) {
      blue =
        temporary_2 + (temporary_1 - temporary_2) * (0.666 - temporary_b) * 6;
    } else {
      blue = temporary_2;
    }
    red = Math.round(Number(red) * 255);
    green = Math.round(Number(green) * 255);
    blue = Math.round(Number(blue) * 255);
  }
  // console.log(`******* END HSLtoRGB(): {${red}, ${green}, ${blue}}`);
  return { r: red, g: green, b: blue };
}

function getCompliantRGB(textColor, bgColor, targetContrast = AA) {
  // console.log(
  //   `********* getCompliantRGB(${textColor}, ${bgColor}, ${targetContrast}):`
  // );
  // console.log({ textColor, bgColor, targetContrast });
  textColor = getColor(textColor);
  bgColor = getColor(bgColor);
  let textRGB = textColor.rgb,
    bgRGB = bgColor.rgb,
    textHex = textColor.hex,
    bgHex = bgColor.hex,
    textLuminance = textColor.luminance,
    bgLuminance = bgColor.luminance,
    lighterLum = Math.max(textLuminance, bgLuminance),
    darkerLum = Math.min(textLuminance, bgLuminance),
    goalTextRGB = textColor.rgb,
    contrast = Number(
      parseFloat((lighterLum + 0.05) / (darkerLum + 0.05)).toFixed(2)
    );
  let resultObject = {
    status: "fail",
    AA: {},
    AAA: {},
  };
  // console.log("Initial state:", {
  //   contrast,
  //   textRGB,
  //   textHex,
  //   bgRGB,
  //   bgHex,
  //   targetContrast,
  // });

  if (contrast < targetContrast) {
    // console.log("This does not meet a11y standards. Let's find a better one.");
    let targetDarkerLum =
        (lighterLum + 0.05 - 0.05 * targetContrast) / targetContrast,
      targetLighterLum =
        targetContrast * darkerLum - 0.05 + 0.05 * targetContrast;
    if (textLuminance === lighterLum) {
      // Text is lighter
      console.log("Text is the lighter luminance - we need it to be lighter");
      // console.log({textColor});
      goalTextRGB = hslToRgb(rgbToHsl(textRGB[0], textRGB[1], textRGB[2])); // Factor needs adjustment for accuracy
      // console.log({goalTextRGB});
      textLuminance = textColor.luminance;
      darkerLum = Math.min(textLuminance, bgLuminance);
      lighterLum = Math.max(textLuminance, bgLuminance);
      contrast = (lighterLum + 0.05) / (darkerLum + 0.05);
    } else {
      // BG is lighter
      console.log("BG is the lighter luminance - we need a darker text color");
      // console.log({textColor});
      goalTextRGB = hslToRgb(rgbToHsl(textRGB[0], textRGB[1], textRGB[2])); // Factor needs adjustment for accuracy
      console.log({ goalTextRGB });
      textLuminance = getLuminance(
        goalTextRGB.r,
        goalTextRGB.g,
        goalTextRGB.b
      );
      darkerLum = Math.min(textLuminance, bgLuminance);
      lighterLum = Math.max(textLuminance, bgLuminance);
      contrast = (lighterLum + 0.05) / (darkerLum + 0.05);
    }
  } else {
    console.log("This passes a11y...");
  }
  let ratio = formatRatio(contrast);
  // console.log("New state:", {
  //   contrast: ratio,
  //   textRGB: [goalTextRGB.r, goalTextRGB.g, goalTextRGB.b],
  //   textHex: getColor(
  //     rgbToHex(goalTextRGB.r, goalTextRGB.g, goalTextRGB.b)
  //   ).hex,
  //   bgRGB: bgColor,
  //   bgHex: getColor(rgbToHex(bgColor.rgb[0], bgColor.rgb[1], bgColor.rgb[2]))
  //     .hex,
  // });
  // console.log(`******** end getCompliantRGB() *************`);
  return {
    ratio,
    textRGB: [goalTextRGB.r, goalTextRGB.g, goalTextRGB.b],
    textHex: rgbToHex(goalTextRGB.r, goalTextRGB.g, goalTextRGB.b),
    bgRGB: bgColor,
    bgHex: rgbToHex(bgColor[0], bgColor[1], bgColor[2]),
  };
}

function getCompliantColor(textColor, bgColor, targetContrast = AA) {
  // console.log(`****** getCompliantColor(${textColor}, ${bgColor}, ${targetContrast})`)
  textColor = getColor(textColor);
  bgColor = getColor(bgColor);
  let newTextColor = hslToRgb(
    textColor.hsl.h,
    textColor.hsl.s,
    textColor.hsl.l,
    0.5
  );
  newTextColor = getColor([
    newTextColor.r,
    newTextColor.g,
    newTextColor.b,
  ]);
  let lighterLum = Math.max(textColor.luminance, bgColor.luminance),
    darkerLum = Math.min(textColor.luminance, bgColor.luminance),
    initialContrast = (lighterLum + 0.05) / (darkerLum + 0.05);
  if (initialContrast >= targetContrast) {
    console.log(`These colors already meet the desired contrast ratio.`);
    return { textColor, bgColor };
  }
  let targetLighterLum = targetContrast * (darkerLum + 0.05) - 0.05,
    targetDarkerLum = (lighterLum + 0.05) / targetContrast - 0.05;
  let lighterColor, darkerColor;
  if (textColor.luminance === lighterLum) {
    // text color is lighter
    lighterColor = textColor;
    darkerColor = bgColor;
    console.log(`We need a lighter text color.`);
    console.log({lighterColor});
    // Determine natural luminance
    let textHue = textColor.hsl.h,
      naturalColor = getColor(`hsl(${textHue}, 1, .5)`),
      testLighterColor;
      // console.log("Natural color:", naturalColor);
      if (naturalColor.hsl.l >= .5) {
        console.log("This color's natural luminance is greater than or equal to 50%. Luminance will increase with more saturation. Current saturation:", naturalColor.hsl.s);
        let newLightness;
        if (textColor.hsl.l < 1) {
          newLightness = (textColor.hsl.l + 1) / 2;
        }
        testLighterColor = getColor(`hsl(${textColor.hsl.h}, ${textColor.hsl.s}, ${newLightness})`);
        console.log("Try this lighter color", {testLighterColor});
      } else {
        console.log("This color's natural luminance is less than 50%. Luminance will decrease with more saturation");
      }
  } else {
    // bg color is lighter
    lighterColor = bgColor;
    darkerColor = textColor;
    console.log("We need a darker text color.");
  }
  console.log({ textColor, bgColor, initialContrast });
  // console.log({ lighterColor, darkerColor });
  console.log({ targetDarkerLum, targetLighterLum });
}

function getFullColorArray() {
  let result = [];
  for (let i = 0; i <= 360; i++) {
    let color = getColor(hslToRgb(i, 1, 0.5));
    result.push(color);
  }
  return result;
}