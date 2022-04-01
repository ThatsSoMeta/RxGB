/* From Nyssa */
//reference: https://medium.com/tamman-inc/create-your-own-color-contrast-checker-11d8b95dff5b

/* starting to check for color contrast */
/* start with just one element */
let elems = document.querySelector('.bx-row-text div');

function checkColorContrast(elem) {
	let findElem = elem.parentElement;
	let regex = /^bx-/;
	let textColor = window.getComputedStyle(elem).color;

	while(findElem && (regex.test(findElem.classList[0]) || findElem.id.indexOf("bx") > -1)) {
		let bgColor = window.getComputedStyle(findElem).backgroundColor;

		if(bgColor !== "rgba(0, 0, 0, 0)"){
			//TO-DO: compare background colour to text colour
			break;
		}

		console.log(findElem);

		findElem = findElem.parentElement;
	}
}

checkColorContrast(elems);