/**
 *
 * @param str
 * @param suffix
 * @returns {boolean}
 * @static
 */
function BeginsWith(str, suffix) {

  return str.indexOf(suffix) === 0;
};

module.exports = BeginsWith
