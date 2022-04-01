/* THIS WORKS FOR COPYING TO CLIPBOARD */

async function copyToClipboard(whatToCopy) {
  await window.navigator.clipboard.writeText(whatToCopy);
  console.log("Should be copied now...");
  return;
}

/* This event can be changed to suit our needs */
// window.onfocus = function () {
//   copyToClipboard("Hello World!");
// };

/*****************************/

/* WORK IN PROGRESS */
async function getData(url) {
  await fetch(url, {
    method: "GET",
    headers: {
      mode: "no-cors",
    },
  })
    .then((response) => {
      console.log("response: ", response);
      return response.json();
    })
    .then((data) => console.log("I have your data: ", data))
    .catch((error) => console.log("There was en error fetching data: ", error));
}

// getData("https://www.truff.com/");


/* Check all elements for proper font displays */

let stylesheets = document.styleSheets;
// console.log(stylesheets);
for (let sheet of stylesheets) {
    console.log(sheet)
}
function testFonts(element) {
    console.log(element);
}

// testFonts();


/* PSEUDO ELEMENT CHECKER */
let bxTextElements = jQuery('.bx-row-text div'),
  elementFontColors = [];
for (let element of bxTextElements) {
  element.onmouseover = function () {
    let colorValClick = getComputedStyle(element).getPropertyValue('color');
    console.log("On mouseover, color is ", colorValClick);
  };
  element.onmouseout = function () {
    let colorValClick = getComputedStyle(element).getPropertyValue('color');
    console.log("On mouseout, color is ", colorValClick);
  };
}