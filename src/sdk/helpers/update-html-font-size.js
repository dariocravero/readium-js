var $ = require('jquery')
require('../../../lib/jquery-sizes')

function UpdateHtmlFontSize($epubHtml, fontSize) {
  var factor = fontSize / 100;
  var win = $epubHtml[0].ownerDocument.defaultView;
  var $textblocks = $('p, div, span, h1, h2, h3, h4, h5, h6, li, blockquote, td, pre', $epubHtml);
  var originalLineHeight;


  // need to do two passes because it is possible to have nested text blocks. 
  // If you change the font size of the parent this will then create an inaccurate
  // font size for any children. 
  for (var i = 0; i < $textblocks.length; i++) {
    var ele = $textblocks[i],
      fontSizeAttr = ele.getAttribute('data-original-font-size');

    if (!fontSizeAttr) {
      var style = win.getComputedStyle(ele);
      var originalFontSize = parseInt(style.fontSize);
      originalLineHeight = parseInt(style.lineHeight);

      ele.setAttribute('data-original-font-size', originalFontSize);
      // getComputedStyle will not calculate the line-height if the value is 'normal'. In this case parseInt will return NaN
      if (originalLineHeight) {
        ele.setAttribute('data-original-line-height', originalLineHeight);
      }
    }
  }

  // reset variable so the below logic works. All variables in JS are function scoped. 
  originalLineHeight = 0;
  for (var i = 0; i < $textblocks.length; i++) {
    var ele = $textblocks[i],
      fontSizeAttr = ele.getAttribute('data-original-font-size'),
      lineHeightAttr = ele.getAttribute('data-original-line-height'),
      originalFontSize = Number(fontSizeAttr);

    if (lineHeightAttr) {
      originalLineHeight = Number(lineHeightAttr);
    } else {
      originalLineHeight = 0;
    }

    ele.style.fontSize = (originalFontSize * factor) + 'px';
    if (originalLineHeight) {
      ele.style.lineHeight = (originalLineHeight * factor) + 'px';
    }

  }
  $epubHtml.css("font-size", fontSize + "%");
}

module.exports = UpdateHtmlFontSize