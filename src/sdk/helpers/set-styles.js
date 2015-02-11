/**
 *
 * @param styles
 * @param $element
 */
function setStyles(styles, $element) {

  var count = styles.length;

  if (!count) {
    return;
  }

  for (var i = 0; i < count; i++) {
    var style = styles[i];
    if (style.selector) {
      $(style.selector, $element).css(style.declarations);
    } else {
      $element.css(style.declarations);
    }
  }

};

module.exports = setStyles
