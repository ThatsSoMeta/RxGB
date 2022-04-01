var modalContainer = document.createElement("div"),
  logoContainer = document.createElement("div"),
  newTextColorSuggestionContainer = document.createElement("div"),
  newBgColorSuggestionContainer = document.createElement("div"),
  logoImg = document.createElement("img"),
  originalComboContainer = document.createElement("div"),
  newComboContainer1 = document.createElement("div"),
  newComboContainer2 = document.createElement("div"),
  resultContainer = document.createElement("div"),
  input = document.createElement("input"),
  contrastOptionContainer = document.createElement("div"),
  AARadio = document.createElement("input"),
  AAARadio = document.createElement("input"),
  colorSubmitButton = document.createElement("button"),
  wkndDarkBlue = "#303D78",
  wkndLightBlue = "#3D54CC",
  wkndGreen = "#24B79D",
  wkndRed = "#FF4133",
  wkndYellow = "#FFBB00",
  wkndSand = "#F4EAE1",
  wkndBrown = "#CC9965",
  black = "#000",
  white = "#FFF",
  rxgbLogo = "https://i.ibb.co/T22Nc8J/rxgb-logo-wknd.png";

var allContainers = [
    modalContainer,
    newTextColorSuggestionContainer,
    newBgColorSuggestionContainer,
    logoContainer,
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
  container.classList.add("rxgb");
  container.style.display = "flex";
  container.style.alignItems = "center";
  if (container !== contrastOptionContainer) {
    container.style.flexDirection = "column";
    container.style.justifyContent = "space-between";
  } else {
    container.style.width = '80%';
    container.style.justifyContent = 'space-around';
    container.style.alignItems = 'stretch';
  }
}

for (let radio of [AARadio, AAARadio]) {
  let label = document.createElement("label"),
    container = document.createElement("div");
  radio.type = "radio";
  radio.name = "contrast";
  radio.style.margin = "auto";
  if (radio === AARadio) {
    AARadio.id = "aa";
    label.innerText = "AA";
    label.setAttribute("for", "aaa");
  } else {
    AAARadio.innerText = "AAA";
    AARadio.id = "rxgb-aaa-option";
    label.innerText = "AAA";
    label.setAttribute("for", "rxgb-aaa-option");
  }
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.append(label, radio)
  contrastOptionContainer.append(container);
}

colorSubmitButton.innerText = "Submit";
colorSubmitButton.style.backgroundColor = "white";
colorSubmitButton.style.color = "black";
colorSubmitButton.style.outline = "1px solid black";
colorSubmitButton.style.padding = "5px 10px";
colorSubmitButton.style.margin = "5px";

logoImg.src = rxgbLogo;
logoImg.style.width = "30px";
logoContainer.style.margin = "5px auto";
logoContainer.append(logoImg);

modalContainer.classList.add("modal-container");
modalContainer.style.backgroundColor = "white";
modalContainer.style.color = "black";
modalContainer.style.fontSize = "16px";
modalContainer.style.border = "1px solid black";
modalContainer.classList.add("modal-container");
modalContainer.style.zIndex = "2147483647";
modalContainer.style.position = "fixed";
modalContainer.style.bottom = "0";
modalContainer.style.right = "0";
modalContainer.style.padding = "0 10px";
modalContainer.append(logoContainer);

for (let element of comboContainers) {
  element.style.width = "100%";
  element.style.flexBasis = "25%";
  element.style.flexGrow = "1";
  element.style.margin = "10px";
  let header = document.createElement("h6");
  header.style.textAlign = "center";
  header.style.fontWeight = "bold";
  header.style.fontSize = "12px";
  if (element === originalComboContainer) {
    header.innerText = "Original Color";
    element.append(header);
    modalContainer.append(element);
  } else if (element === resultContainer) {
    header.innerText = "Results";
    element.prepend(header);
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
// modalContainer.append(resultContainer);

let origTextColorInput = document.createElement("input"),
  origTextColorInputLabel = document.createElement("label"),
  origBgColorInput = document.createElement("input"),
  origBgColorInputLabel = document.createElement("label");

origTextColorInput.id = "orig-text-color-input";
origTextColorInput.placeholder = "rgb() or #Hex";
origTextColorInput.style.textAlign = "center";

origTextColorInputLabel.setAttribute("for", "orig-text-color-input");
origTextColorInputLabel.innerText = "Text:";
origTextColorInputLabel.style.fontSize = "10px";

origBgColorInput.id = "orig-bg-color-input";
origBgColorInput.placeholder = "rgb() or #Hex";
origBgColorInput.style.textAlign = "center";

origBgColorInputLabel.setAttribute("for", "orig-bg-color-input");
origBgColorInputLabel.innerText = "Background:";
origBgColorInputLabel.style.fontSize = "10px";

originalComboContainer.append(
  origTextColorInputLabel,
  origTextColorInput,
  origBgColorInputLabel,
  origBgColorInput,
  contrastOptionContainer
);

contrastOptionContainer.style.margin = "10px";

originalComboContainer.style.backgroundColor = "rgb(240, 240, 240)";
originalComboContainer.style.padding = "10px";
originalComboContainer.append(colorSubmitButton);

resultContainer.style.backgroundColor = "rgb(240, 240, 240)";
resultContainer.style.padding = "10px";

if (jQuery(".rxgb.modal-container").length) {
  jQuery(".rxgb.modal-container").remove();
}
document.body.append(modalContainer);
