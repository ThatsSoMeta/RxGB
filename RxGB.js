var modalContainer = document.createElement("div"),
  shroud = document.createElement("div"),
  logoContainer = document.createElement("div"),
  newTextColorSuggestionContainer = document.createElement("div"),
  newBgColorSuggestionContainer = document.createElement("div"),
  logoImg = document.createElement("img"),
  originalComboContainer = document.createElement("div"),
  newComboContainer1 = document.createElement("div"),
  newComboContainer2 = document.createElement("div"),
  input = document.createElement('input'),
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
  ],
  comboContainers = [
    originalComboContainer,
    newComboContainer1,
    newComboContainer2,
  ];

for (let container of allContainers) {
  // DO SOMETHING MAYBE?
  container.classList.add("rxgb");
}


logoImg.src = rxgbLogo;
logoImg.style.width = "30px";
logoContainer.style.margin = "5px auto";
logoContainer.style.display = "flex";
logoContainer.append(logoImg);

modalContainer.style.backgroundColor = "white";
modalContainer.style.color = "black";
modalContainer.style.fontSize = "16px";
modalContainer.style.border = "3px solid black";
modalContainer.style.display = "flex";
modalContainer.style.flexDirection = "column";
modalContainer.style.justifyContent = "space-between";
modalContainer.style.alignItems = "center";
modalContainer.classList.add("modal-container");
modalContainer.style.zIndex = "2147483647";
modalContainer.style.width = "25vw";
modalContainer.style.position = "absolute";
modalContainer.style.bottom = "0";
modalContainer.style.right = "0";
modalContainer.append(logoContainer);

shroud.style.display = "flex";
shroud.style.flexDirection = "column";
shroud.style.justifyContent = "center";
shroud.style.alignItems = "center";
shroud.style.padding = "auto";
shroud.style.backgroundColor = "rgba(0,0,0,.5)";
shroud.style.zIndex = "2147483647";


for (let element of comboContainers) {
    element.style.width = '80%';
    element.style.flexBasis = '25%';
    element.style.flexGrow = '1';
    let header = document.createElement('h6');
    header.style.color = 'purple';
    header.style.textAlign = 'center';
    if (element === originalComboContainer) {
        header.innerText = 'Original Color'
    } else {
        header.innerText = `Option else`
    }
    element.append(header);
    modalContainer.append(element)
}

document.body.append(modalContainer);

