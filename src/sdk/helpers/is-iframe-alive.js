/**
 *
 * @param iframe
 * @returns {boolean}
 */
function isIframeAlive(iframe) {
  var w = undefined;
  var d = undefined;
  try {
    w = iframe.contentWindow;
    d = iframe.contentDocument;
  } catch (ex) {
    console.error(ex);
    return false;
  }

  return w && d;
}

module.exports = isIframeAlive