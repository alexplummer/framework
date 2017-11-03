
// inlineSVG
// ============
// Inlines SVGs to target through CSS

// Imports
import { cl } from 'cl';
import { ajaxGet } from 'ajaxGet';

// Exports
export { inlineSVG };

// Module JS
const inlineSVG = function inlineSVG() {
    let svgImg = document.querySelectorAll('.svg');

    for (let i = 0; i < svgImg.length; i++) {
        let img      = svgImg[i];
        let imgClass = img.classList;
        
        ajaxGet(img.getAttribute('src'), buildInline);

        function buildInline(svg) {
            img.insertAdjacentHTML('afterend', svg);
            for (let j = 0; j < imgClass.length; j++) {
                img.nextSibling.classList.add(imgClass[j]);
            }
            img.parentNode.removeChild(img);
        }
    }
}