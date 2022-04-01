let textColor = [161, 161, 161];
let bgColor = [255, 255, 255];
let nonGrayColor = [255, 30, 50];
let exampleColor = [24, 98, 118];
let michelle = [37, 184, 157];
var AA = 4.5;
var AAA = 7;

/* https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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

function formatRatio(ratio) {
  let ratioAsFloat = ratio.toFixed(2);
  let isInteger = Number.isInteger(parseFloat(ratioAsFloat));
  return isInteger ? Number(Math.floor(ratio)) : Number(ratioAsFloat);
}

/* https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl */
function RGBtoHSL(r, g, b, goalLuminanceFactor = 1) {
  r /= 255;
  g /= 255;
  b /= 255;
  r = Number(parseFloat(r).toFixed(2));
  g = Number(parseFloat(g).toFixed(2));
  b = Number(parseFloat(b).toFixed(2));
  var maxVal = Number(parseFloat(Math.max(r, g, b)).toFixed(2)),
    minVal = Number(parseFloat(Math.min(r, g, b)).toFixed(2)),
    luminance = Math.round(((maxVal + minVal) / 2) * 100) / 100,
    saturation,
    hue = 0;
  if (maxVal === minVal) {
    saturation = 0;
  } else {
    if (luminance <= 0.5) {
      saturation =
        Math.round(((maxVal - minVal) / (maxVal + minVal)) * 100) / 100;
    } else {
      saturation =
        Math.round(((maxVal - minVal) / (2 - maxVal - minVal)) * 100) / 100;
    }
    if (maxVal === r) {
      hue = (g - b) / (maxVal - minVal);
      console.log({ hue });
    } else if (maxVal === g) {
      hue = 2 + (b - r) / (maxVal - minVal);
      hue *= 60;
      if (hue < 0) {
        hue += 360;
      }
    } else {
      hue = 4 + (r - g) / (maxVal - minVal);
      hue *= 60;
      if (hue < 0) {
        hue += 360;
      }
    }
  }
  hue = Math.round(hue);
  if (hue === 0) {
    hue = 0;
  }
  var newRGB = HSLtoRGB(hue, saturation, luminance, goalLuminanceFactor);
  return newRGB;
}

function HSLtoRGB(hue, saturation, luminance, goalLuminanceFactor = 1) {
  console.log({ goalLuminanceFactor });
  var red,
    green,
    blue,
    temporary_1,
    temporary_2,
    temporary_r,
    temporary_g,
    temporary_b;
  luminance *= goalLuminanceFactor;
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
    hue = hue / 360;
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
    console.log({ red });
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
    red = Math.round(red * 255);
    green = Math.round(green * 255);
    blue = Math.round(blue * 255);
  }
  return { red, green, blue };
}

function getCompliantRGB(textRGB, bgRGB, targetContrast = AA) {
  let textLuminance = getLuminance(textRGB[0], textRGB[1], textRGB[2]),
    bgLuminance = getLuminance(bgRGB[0], bgRGB[1], bgRGB[2]);

  let lighterLum = Math.max(textLuminance, bgLuminance);
  let darkerLum = Math.min(textLuminance, bgLuminance);
  let goalTextRGB;

  let contrast = Number(
    parseFloat((lighterLum + 0.05) / (darkerLum + 0.05)).toFixed(2)
  );
  console.log("Initial state:", {
    contrast,
    textRGB,
    textHex: rgbToHex(textRGB[0], textRGB[1], textRGB[2]),
    bgRGB,
    bgHex: rgbToHex(bgRGB[0], bgRGB[1], bgRGB[2]),
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
      goalTextRGB = RGBtoHSL(...textRGB, targetLighterLum / lighterLum); // Factor needs adjustment for accuracy
      textLuminance = getLuminance(
        goalTextRGB.red,
        goalTextRGB.green,
        goalTextRGB.blue
      );
      darkerLum = Math.min(textLuminance, bgLuminance);
      lighterLum = Math.max(textLuminance, bgLuminance);
      contrast = (lighterLum + 0.05) / (darkerLum + 0.05);
    } else {
      // BG is lighter
      goalTextRGB = RGBtoHSL(...textRGB, targetDarkerLum / darkerLum); // Factor needs adjustment for accuracy
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
    textHex: rgbToHex(goalTextRGB.red, goalTextRGB.green, goalTextRGB.blue),
    bgRGB,
    bgHex: rgbToHex(bgRGB[0], bgRGB[1], bgRGB[2]),
  });
  return {
    ratio,
    textRGB: [goalTextRGB.red, goalTextRGB.green, goalTextRGB.blue],
    textHex: rgbToHex(goalTextRGB.red, goalTextRGB.green, goalTextRGB.blue),
    bgRGB,
    bgHex: rgbToHex(bgRGB[0], bgRGB[1], bgRGB[2]),
  };
}

getCompliantRGB(textColor, bgColor, AA);
