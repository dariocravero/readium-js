//TODO: consider using CSSOM escape() or polyfill
//https://github.com/mathiasbynens/CSS.escape/blob/master/css.escape.js
//http://mathiasbynens.be/notes/css-escapes
/**
 *
 * @param sel
 * @returns {string}
 */
function escapeJQuerySelector(sel) {
  //http://api.jquery.com/category/selectors/
  //!"#$%&'()*+,./:;<=>?@[\]^`{|}~
  // double backslash escape

  if (!sel) return undefined;

  var selector = sel.replace(/([;&,\.\+\*\~\?':"\!\^#$%@\[\]\(\)<=>\|\/\\{}`])/g, '\\$1');

  // if (selector !== sel)
  // {
  //     console.debug("---- SELECTOR ESCAPED");
  //     console.debug("1: " + sel);
  //     console.debug("2: " + selector);
  // }
  // else
  // {
  //     console.debug("---- SELECTOR OKAY: " + sel);
  // }

  return selector;
};
// TESTS BELOW ALL WORKING FINE :)
// (RegExp typos are hard to spot!)
// escapeSelector('!');
// escapeSelector('"');
// escapeSelector('#');
// escapeSelector('$');
// escapeSelector('%');
// escapeSelector('&');
// escapeSelector("'");
// escapeSelector('(');
// escapeSelector(')');
// escapeSelector('*');
// escapeSelector('+');
// escapeSelector(',');
// escapeSelector('.');
// escapeSelector('/');
// escapeSelector(':');
// escapeSelector(';');
// escapeSelector('<');
// escapeSelector('=');
// escapeSelector('>');
// escapeSelector('?');
// escapeSelector('@');
// escapeSelector('[');
// escapeSelector('\\');
// escapeSelector(']');
// escapeSelector('^');
// escapeSelector('`');
// escapeSelector('{');
// escapeSelector('|');
// escapeSelector('}');
// escapeSelector('~');

module.exports = escapeJQuerySelector
