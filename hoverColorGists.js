function checkHoverColors() {
  let allBxTextElements = jQuery(".bx-row-text, .bx-row-text a, .bx-labeltext, .bx-button"),
    elementFontColors = [];
  console.log("All labels, buttons, and text elements: ", allBxTextElements);
  allBxTextElements.each(function(index, element) {
    let dataObject = {
      element,
    };
    element.classList.add("not-contrast-checked");
    element.onmouseover = function () {
      let colorValMouseover =
          getComputedStyle(element).getPropertyValue("color"),
        borderValMouseover =
          getComputedStyle(element).getPropertyValue("border");
      dataObject.hoverColor = colorValMouseover;
      if (borderValMouseover === "1px solid rgb(255, 0, 0)") {
        element.style.border = "";
      }
    };
    element.onmouseout = function () {
      let colorValMouseout =
        getComputedStyle(element).getPropertyValue("color");
      dataObject.color = colorValMouseout;
      if (!elementFontColors.filter((e) => e.element === element).length > 0) {
        elementFontColors.push(dataObject);
      }
      if (element.classList.contains("not-contrast-checked")) {
        element.classList.remove("not-contrast-checked");
        element.classList.add("contrast-checked");
      }
      if (elementFontColors.length >= allBxTextElements.length) {
        console.log("Colors: ", elementFontColors);
      }
    };
    if (!elementHasBorder(element)) {
      // add red border if element has not been hovered yet if there is not an existing border...
      element.style.border = "1px solid red";
    }
  })
}

function elementHasBorder(element) {
  return (
    getComputedStyle(element).getPropertyValue("border-bottom-style") !==
      "none" ||
    getComputedStyle(element).getPropertyValue("border-top-style") !== "none" ||
    getComputedStyle(element).getPropertyValue("border-left-style") !==
      "none" ||
    getComputedStyle(element).getPropertyValue("border-right-style") !== "none"
  );
}

checkHoverColors();
