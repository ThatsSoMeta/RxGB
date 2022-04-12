// Lightness vs luminance: http://www.workwithcolor.com/color-luminance-2233.htm

let AA = 4.5,
  AAA = 7,
  RGB = "rgb",
  HEX = "hex",
  rgbRegex = /\s*\d+,\s*\d+,\s*\d+/gi,
  hexRegex = /#?[0-9a-f]{6}/gi;

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
  console.log(`**************** getColor(${input}) ***************`);
  let rgb = [],
    hex = "";
  if (typeof input === "string") {
    console.log("The input is a string in getColor()");
    if (input.match(hexRegex)) {
      if (input.startsWith("#")) {
        hex = input;
      } else {
        hex = "#" + input;
      }
      let rgbObj = hexToRgb(hex);
      console.log({ rgbObj });
      rgb = [rgbObj.r, rgbObj.g, rgbObj.b];
    } else {
      for (let value of input.split(",")) {
        rgb.push(Number(value.replace(/\D/gi, "")));
      }
      hex = rgbToHex(...rgb);
    }
  } else {
    console.log("This is not a string:", input);
    console.log("typeof input === ", typeof input);
    rgb = input;
    hex = rgbToHex(...input);
  }
  hex = hex.toUpperCase();
  let hsl = RGBtoHSL(rgb[0], rgb[1], rgb[2]),
    luminance = getLuminance(rgb[0], rgb[1], rgb[2]);
  let result = {
    hex,
    rgb,
    hsl,
    luminance,
  };
  // console.log("HSL:", hsl);
  console.log(
    `******** END getColor(): {hex: ${result.hex}, rgb: ${result.rgb}, hsl: (${result.hsl.hue}, ${result.hsl.saturation}, ${result.hsl.luminance}), luminance: ${luminance}} *************`
  );
  return result;
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
function RGBtoHSL(r, g, b, goalLuminanceFactor = 1) {
  console.log(
    `********** RGBtoHSL(r = ${r}, g = ${g}, b = ${b}, goalLuminance = ${goalLuminanceFactor})`
  );
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
  console.log("Hue in RGBtoHSL(): ", hue);
  let result = { hue, saturation, lightness };
  // var newRGB = HSLtoRGB(hue, saturation, luminance, goalLuminanceFactor);
  // return newRGB;
  // console.log("New rgb:", newRGB);
  console.log(
    `*********** END RGBtoHSL(): {hue: ${result.hue}, saturation: ${result.saturation}, lightness: ${result.lightness}}`
  );
  return result;
}

function HSLtoRGB(hue, saturation, luminance, goalLuminanceFactor = 1) {
  console.log(
    `******* HSLtoRGB(${hue}, ${saturation}, ${luminance}, ${goalLuminanceFactor})`
  );
  var red,
    green,
    blue,
    temporary_1,
    temporary_2,
    temporary_r,
    temporary_g,
    temporary_b;
  luminance *= goalLuminanceFactor;
  console.log({ luminance });
  console.log("^This should be a number");
  if (saturation === 0) {
    console.log("This is a grayscale color.");
    var rbgVal = Math.round(255 * luminance);
    red = rbgVal;
    green = rbgVal;
    blue = rbgVal;
  } else {
    console.log("This is not a grayscale color.");
    if (luminance < 0.5) {
      temporary_1 = luminance * (1 + saturation);
    } else {
      temporary_1 = luminance + saturation - luminance * saturation;
    }
    temporary_2 = 2 * luminance - temporary_1;
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
  console.log(`******* END HSLtoRGB(): {${red}, ${green}, ${blue}}`);
  return { red, green, blue };
}

function submitColors(
  textColorInput = "",
  bgColorInput = "",
  contrastTarget = 4.5
) {
  console.log(
    `********** submitColors(${textColorInput}, ${bgColorInput}, ${contrastTarget}):`
  );
  // let contrastTarget = Number(
  //     document.querySelector('input[name="contrast-target"]:checked').value
  //   ),
  //   textColorInput = document.querySelector(
  //     "input#orig-text-color-input"
  //   ).value,
  //   bgColorInput = document.querySelector("input#orig-bg-color-input").value,
  let origTextRgb, origBgRgb;
  if (textColorInput === "" || bgColorInput === "") {
    console.log("Please select both colors.");
  } else {
    (origTextRgb = getColor(textColorInput).rgb),
      (origBgRgb = getColor(bgColorInput).rgb);
    // console.log({ contrastTarget, textColorInput, bgColorInput, origTextRgb, origBgRgb });
  }
  let result = getCompliantRGB(origTextRgb, origBgRgb, contrastTarget);
  console.log(`************* END submitColors(): ${result}`);
  return result;
}

function getCompliantRGB(textColor, bgColor, targetContrast = AA) {
  console.log(
    `********* getCompliantRGB(${textColor}, ${bgColor}, ${targetContrast}):`
  );
  console.log({ textColor, bgColor, targetContrast });
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
  console.log("Initial state:", {
    contrast,
    textRGB,
    textHex,
    bgRGB,
    bgHex,
    targetContrast,
  });

  if (contrast < targetContrast) {
    console.log("This does not meet a11y standards. Let's find a better one.");
    let targetDarkerLum =
        (lighterLum + 0.05 - 0.05 * targetContrast) / targetContrast,
      targetLighterLum =
        targetContrast * darkerLum - 0.05 + 0.05 * targetContrast;
    if (textLuminance === lighterLum) {
      // Text is lighter
      console.log("Text is the lighter luminance - we need it to be lighter");
      // console.log({textColor});
      goalTextRGB = HSLtoRGB(RGBtoHSL(textRGB[0], textRGB[1], textRGB[2])); // Factor needs adjustment for accuracy
      // console.log({goalTextRGB});
      textLuminance = textColor.luminance;
      darkerLum = Math.min(textLuminance, bgLuminance);
      lighterLum = Math.max(textLuminance, bgLuminance);
      contrast = (lighterLum + 0.05) / (darkerLum + 0.05);
    } else {
      // BG is lighter
      console.log("BG is the lighter luminance - we need a darker text color");
      // console.log({textColor});
      goalTextRGB = HSLtoRGB(RGBtoHSL(textRGB[0], textRGB[1], textRGB[2])); // Factor needs adjustment for accuracy
      console.log({ goalTextRGB });
      textLuminance = getLuminance(
        goalTextRGB.red,
        goalTextRGB.green,
        goalTextRGB.blue
      );
      darkerLum = Math.min(textLuminance, bgLuminance);
      lighterLum = Math.max(textLuminance, bgLuminance);
      contrast = (lighterLum + 0.05) / (darkerLum + 0.05);
    }
  } else {
    console.log("This passes a11y...");
  }
  let ratio = formatRatio(contrast);
  console.log("New state:", {
    contrast: ratio,
    textRGB: [goalTextRGB.red, goalTextRGB.green, goalTextRGB.blue],
    textHex: getColor(
      rgbToHex(goalTextRGB.red, goalTextRGB.green, goalTextRGB.blue)
    ).hex,
    bgRGB: bgColor,
    bgHex: getColor(rgbToHex(bgColor.rgb[0], bgColor.rgb[1], bgColor.rgb[2]))
      .hex,
  });
  console.log(`******** end getCompliantRGB() *************`);
  return {
    ratio,
    textRGB: [goalTextRGB.red, goalTextRGB.green, goalTextRGB.blue],
    textHex: rgbToHex(goalTextRGB.red, goalTextRGB.green, goalTextRGB.blue),
    bgRGB: bgColor,
    bgHex: rgbToHex(bgColor[0], bgColor[1], bgColor[2]),
  };
}

function getCompliantColor(textColor, bgColor, targetContrast = AA) {
  textColor = getColor(textColor);
  bgColor = getColor(bgColor);
  let newTextColor = HSLtoRGB(
    textColor.hsl.hue,
    textColor.hsl.saturation,
    textColor.hsl.lightness,
    0.5
  );
  newTextColor = getColor([
    newTextColor.red,
    newTextColor.green,
    newTextColor.blue,
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
  } else {
    // bg color is lighter
    lighterColor = bgColor;
    darkerColor = textColor;
  }
  console.log({ textColor, bgColor, initialContrast });
  console.log({ lighterColor, darkerColor });
  console.log({ targetDarkerLum, targetLighterLum });
}

// getColor("#d84000");
// getColor("rgb(255,0,255)");
// submitColors("d84000", "rgb(255,0,0)");
getCompliantColor("#d84000", [255, 0, 255]);
