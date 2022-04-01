/* NYSSA'S CHECKER */
//reference: https://medium.com/tamman-inc/create-your-own-color-contrast-checker-11d8b95dff5b

/* starting to check for color contrast */
// let elems = document.querySelectorAll('.bx-row:not(.bx-row-line):not(.bx-row-image) > *:first-child');

function getLuminance(r, g, b) {
  let [lumR, lumG, lumB] = [r, g, b].map((component) => {
    let proportion = component / 255;

    return proportion <= 0.03928
      ? proportion / 12.92
      : Math.pow((proportion + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB;
}

function getCompliantRGB(luminance1, luminance2) {
  let lighterLum = Math.max(luminance1, luminance2);
  let darkerLum = Math.min(luminance1, luminance2);

  let contrast = (lighterLum + 0.05) / (darkerLum + 0.05);

  let ratio = formatRatio(contrast);

  return Number(ratio);
}

function formatRatio(ratio) {
  let ratioAsFloat = ratio.toFixed(2);
  let isInteger = Number.isInteger(parseFloat(ratioAsFloat));
  return isInteger ? Math.floor(ratio) : ratioAsFloat;
}

function getRGBvalues(str) {
  let colors = str.split(",");
  let values = colors.map((color) => Number(color.replace(/[^0-9]/g, "")));

  return values;
}

function checkColorContrast(elem) {
  let findElem = elem;
  let regex = /^bx-/;
  let textColor = getRGBvalues(window.getComputedStyle(elem).color);

  do {
    let bg = window.getComputedStyle(findElem);

    if (bg.backgroundColor !== "rgba(0, 0, 0, 0)") {
      let bgColor = getRGBvalues(bg.backgroundColor);

      let ratio = getCompliantRGB(
        getLuminance(...textColor),
        getLuminance(...bgColor)
      );

      console.log("the contrast ratio is: " + ratio);
      break;
    } else if (bg.backgroundImage !== "none") {
      //TO-DO: mention that the background is an image and to be diligent about contrast measures
    }

    findElem = findElem.parentElement;
  } while (
    findElem &&
    (regex.test(findElem.classList[0]) || findElem.id.indexOf("bx") > -1)
  );
}

// elems.forEach(elem => {
// 	console.log(elem);
// 	checkColorContrast(elem)
// });

/***************************************************/

function suggestAlternateColor(fgRGB, bgRGB) {
  var bgValues = getRGBvalues(bgRGB),
    fgValues = getRGBvalues(fgRGB),
    [bgR, bgG, bgB] = bgValues,
    [fgR, fgG, fgB] = fgValues,
    bgLuminance = getLuminance(bgR, bgG, bgB),
    fgLuminance = getLuminance(fgR, fgG, fgB),
    contrastRatio = getCompliantRGB(bgLuminance, fgLuminance),
    maxFgVal = Math.max(...fgValues),
    minFgVal = Math.min(...fgValues),
    maxFgMultiplier = Math.floor((255 / maxFgVal) * 100) / 100,
    minFgMultiplier = Math.floor((255 / minFgVal) * 100) / 100,
    maxBgVal = Math.max(...bgValues),
    minBgVal = Math.min(...bgValues),
    maxBgMultiplier = Math.floor((255 / maxBgVal) * 100) / 100,
    minBgMultiplier = Math.floor((255 / minBgVal) * 100) / 100,
    increment = 0.1,
    fgLimit = parseFloat(Math.max(1, maxFgMultiplier)).toFixed(1),
    fgLimitMin = parseFloat(Math.max(1, minFgMultiplier)).toFixed(1),
    bgLimit = parseFloat(Math.max(1, maxBgMultiplier)).toFixed(1),
    bgLimitMin = parseFloat(Math.max(1, minBgMultiplier)).toFixed(1);
  console.log({
    bgValues,
    fgValues,
    bgLuminance,
    fgLuminance,
    contrastRatio,
    maxFgVal,
    maxFgMultiplier,
    maxBgVal,
    maxBgMultiplier,
    increment,
    fgLimit,
    bgLimit,
  });
  if (contrastRatio >= 7) {
    console.log("Awesome! This contrast is great!");
    return;
  } else if (contrastRatio > 4.5) {
    console.log("This meets AA standards, but not AAA.");
  } else {
    console.log(
      "This does not meet accessibility contrast guidelines. Let me give you some suggestions."
    );
    // Determine better color - start by keeping bg the same bg and suggesting new fg colors
    console.log(
      `Checking for better text colors to contrast with the bgColor rgb(${bgValues}) :`
    );
    for (let i = 0; i <= fgLimitMin; i += increment) {
      var higher = Number.parseFloat(1 + i).toFixed(2),
        lower = Number.parseFloat(1 - i).toFixed(2),
        higherRGB = {
          r: Math.min(255, Math.round(fgR * higher)),
          g: Math.min(255, Math.round(fgG * higher)),
          b: Math.min(255, Math.round(fgB * higher)),
        },
        lowerRGB = {
          r: Math.max(0, Math.round(fgR * lower)),
          g: Math.max(0, Math.round(fgG * lower)),
          b: Math.max(0, Math.round(fgB * lower)),
        },
        higherLuminance = getLuminance(higherRGB.r, higherRGB.g, higherRGB.b),
        lowerLuminance = getLuminance(lowerRGB.r, lowerRGB.g, lowerRGB.b),
        higherContrast = getCompliantRGB(higherLuminance, bgLuminance),
        lowerContrast = getCompliantRGB(lowerLuminance, bgLuminance);
      if (higherRGB.r <= 255 && higherRGB.g <= 255 && higherRGB.b <= 255) {
        if (higherContrast >= 7) {
          console.log(
            `Using a text color of rgb(${higherRGB.r}, ${higherRGB.g}, ${higherRGB.b}) would be AAA compliant: ${higherContrast}:1`
          );
          return `rgb(${higherRGB.r}, ${higherRGB.g}, ${higherRGB.b})`;
        } else if (higherContrast >= 4.5) {
          console.log(
            `Using a text color of rgb(${higherRGB.r}, ${higherRGB.g}, ${higherRGB.b}) would be AA compliant: ${higherContrast}:1`
          );
        } else {
          //   console.log(
          //     `The higher ${higher} font color of rgb(${higherRGB.r}, ${higherRGB.g}, ${higherRGB.b}) did not pass: ${higherContrast}:1`
          //   );
        }
      }
      if (lowerRGB.r >= 0 && lowerRGB.g >= 0 && lowerRGB.b >= 0) {
        if (lowerContrast >= 7) {
          console.log(
            `Using a text color of rgb(${lowerRGB.r}, ${lowerRGB.g}, ${lowerRGB.b}) would be AAA compliant: ${lowerContrast}:1`
          );
          return `rgb(${lowerRGB.r}, ${lowerRGB.g}, ${lowerRGB.b})`;
        } else if (lowerContrast >= 4.5) {
          console.log(
            `Using a text color of rgb(${lowerRGB.r}, ${lowerRGB.g}, ${lowerRGB.b}) would be AA compliant: ${lowerContrast}:1`
          );
        } else {
          //   console.log(
          //     `The lower ${lower} font color of rgb(${lowerRGB.r}, ${lowerRGB.g}, ${lowerRGB.b}) did not pass: ${lowerContrast}:1`
          //   );
        }
      }
    }
    // If there is not a better text color, suggest a better background color
    console.log(
      `Checking for better background colors to contrast with the text color rgb(${fgValues}):`
    );
    for (let i = 0; i <= bgLimitMin; i += increment) {
      var higher = Number.parseFloat(1 + i).toFixed(2),
        lower = Number.parseFloat(1 - i).toFixed(2),
        higherRGB = {
          r: Math.min(255, Math.round(bgR * higher)),
          g: Math.min(255, Math.round(bgG * higher)),
          b: Math.min(255, Math.round(bgB * higher)),
        },
        lowerRGB = {
          r: Math.max(0, Math.round(bgR * lower)),
          g: Math.max(0, Math.round(bgG * lower)),
          b: Math.max(0, Math.round(bgB * lower)),
        },
        higherLuminance = getLuminance(higherRGB.r, higherRGB.g, higherRGB.b),
        lowerLuminance = getLuminance(lowerRGB.r, lowerRGB.g, lowerRGB.b),
        higherContrast = getCompliantRGB(higherLuminance, fgLuminance),
        lowerContrast = getCompliantRGB(lowerLuminance, fgLuminance);
      if (higherRGB.r <= 255 && higherRGB.g <= 255 && higherRGB.b <= 255) {
        if (higherContrast >= 7) {
          console.log(
            `Using a higher background color of rgb(${higherRGB.r}, ${higherRGB.g}, ${higherRGB.b}) would be AAA compliant: ${higherContrast}:1`
          );
          return `rgb(${higherRGB.r}, ${higherRGB.g}, ${higherRGB.b})`;
        } else if (higherContrast >= 4.5) {
          console.log(
            `Using a higher background color of rgb(${higherRGB.r}, ${higherRGB.g}, ${higherRGB.b}) would be AA compliant: ${higherContrast}:1`
          );
        } else {
          //   console.log(
          //     `The higher ${higher} background color of rgb(${higherRGB.r}, ${higherRGB.g}, ${higherRGB.b}) did not pass: ${higherContrast}:1`
          //   );
        }
      }
      if (lowerRGB.r >= 0 && lowerRGB.g >= 0 && lowerRGB.b >= 0) {
        if (lowerContrast >= 7) {
          console.log(
            `Using a lower background color of rgb(${lowerRGB.r}, ${lowerRGB.g}, ${lowerRGB.b}) would be AAA compliant: ${lowerContrast}:1`
          );
          return `rgb(${lowerRGB.r}, ${lowerRGB.g}, ${lowerRGB.b})`;
        } else if (lowerContrast >= 4.5) {
          console.log(
            `Using a lower background color of rgb(${lowerRGB.r}, ${lowerRGB.g}, ${lowerRGB.b}) would be AA compliant: ${lowerContrast}:1`
          );
        } else {
          //   console.log(
          //     `The lower ${lower} background color of rgb(${lowerRGB.r}, ${lowerRGB.g}, ${lowerRGB.b}) did not pass: ${lowerContrast}:1`
          //   );
        }
      }
    }
  }
  console.log("I couldn't find any better color options for you :(");
}

// suggestAlternateColor('rgb(172, 57, 124)','rgb(5, 15, 125)');
// suggestAlternateColor("rgb(255,0,0)", "rgb(0,0,255)");
// console.log(getRGBvalues('rgb(209, 231, 23)'));
