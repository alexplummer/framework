"use strict";var app=function(){var e=function(e){console.log(e)},t=function(e,t){var n=void 0;return document.getElementsByTagName(e)[0]?n=document.getElementsByTagName(e)[0]:document.querySelector(e)&&(n=document.querySelector(e)),!!n.classList.contains(t)},n=function(){document.querySelector("h1").classList.add("swing")},o=o||{test:!0};return function(e){var t=setInterval(function(){document&&"complete"===document.readyState&&(clearInterval(t),e())},10)}(function(){e("Page ready"),t("body","home")&&n()}),o}();
//# sourceMappingURL=script.js.map