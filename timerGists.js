function timerCheck() {
  var $creative = jQuery("[id*='bx-creative-']"),
    $timerContainer = jQuery(".bx-row-timer"),
    $timerUnits = jQuery(".bx-timer-units"),
    initialCreativeHeight = $creative.outerHeight(),
    initialContainerWidth = $timerContainer.outerWidth();

  /* example campaign: https://core.wunderkind.co/creatives/67274/edit */

  for (let i = 0; i < 10; i++) {
    $.each($timerUnits, function (index, element) {
      console.log("i: ", i);
      element.innerText = `${i}${i}`;
      console.log("element:", element);
      var style = window.getComputedStyle(element);
      console.log("width:", style.getPropertyValue("width"));
    });
    console.log("$creative.outerHeight(): ", $creative.outerHeight());
    console.log("$timerContainer.outerWidth(): ", $timerContainer.outerWidth());
    if ($creative.outerHeight() !== initialCreativeHeight) {
      console.log(
        "The creative is a different height when " + i + "s are used"
      );
    }
    if ($timerContainer.outerWidth() !== initialContainerWidth) {
      console.log(
        "The timer container is a different width when " + i + "s are used"
      );
    }
  }
}

function noButtonRadiusCheck () {
  let bx_buttons = jQuery(".bx-button"),
    transparent = "rgba(0, 0, 0, 0)";
  bx_buttons.each(function(i, elem) {
    let styles = window.getComputedStyle(elem),
      backgroundColor = styles.getPropertyValue("background-color"),
      borderRadius = parseInt(styles.getPropertyValue("border-radius").replace(/\D/gi, ""));
      if (backgroundColor === transparent && borderRadius !== 0) {
        console.log("This element probably shouldn't have a border radius: ", elem)
      }
  })
}