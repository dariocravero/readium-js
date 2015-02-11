/**
 *
 * @param str
 * @param toRemove
 * @returns {string}
 * @static
 */
function RemoveFromString(str, toRemove) {

  var startIx = str.indexOf(toRemove);

  if (startIx == -1) {
    return str;
  }

  return str.substring(0, startIx) + str.substring(startIx + toRemove.length);
};

module.exports = RemoveFromString