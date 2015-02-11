/**
 *
 * @param $iframe
 */
function triggerLayout($iframe) {

  var doc = $iframe[0].contentDocument;

  if (!doc) {
    return;
  }

  var ss = undefined;
  try {
    ss = doc.styleSheets && doc.styleSheets.length ? doc.styleSheets[0] : undefined;
    if (!ss) {
      var style = doc.createElement('style');
      doc.head.appendChild(style);
      style.appendChild(doc.createTextNode(''));
      ss = style.sheet;
    }

    if (ss)
      ss.insertRule('body:first-child::before {content:\'READIUM\';color: red;font-weight: bold;}', ss.cssRules.length);
  } catch (ex) {
    console.error(ex);
  }

  try {
    var el = doc.createElementNS("http://www.w3.org/1999/xhtml", "style");
    el.appendChild(doc.createTextNode("*{}"));
    doc.body.appendChild(el);
    doc.body.removeChild(el);

    if (ss)
      ss.deleteRule(ss.cssRules.length - 1);
  } catch (ex) {
    console.error(ex);
  }

  if (doc.body) {
    var val = doc.body.offsetTop; // triggers layout
  }

};

module.exports = triggerLayout
