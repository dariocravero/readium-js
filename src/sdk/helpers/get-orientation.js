var ViewsConstants = require('../views/constants')

/**
 *
 * @param $viewport
 * @returns {ReadiumSDK.Views.ORIENTATION_LANDSCAPE|ReadiumSDK.Views.ORIENTATION_PORTRAIT}
 */
function getOrientation($viewport) {

  var viewportWidth = $viewport.width();
  var viewportHeight = $viewport.height();

  if (!viewportWidth || !viewportHeight) {
    return undefined;
  }

  return viewportWidth >= viewportHeight ? ViewsConstants.ORIENTATION_LANDSCAPE : ViewsConstants.ORIENTATION_PORTRAIT;
};

module.exports = getOrientation