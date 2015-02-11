var SpineItemConstants = require('../models/spine-item-constants')
var ViewsConstants = require('../views/constants')

/**
 *
 * @param item
 * @param orientation
 * @returns {boolean}
 */
function isRenditionSpreadPermittedForItem(item, orientation) {

  var rendition_spread = item.getRenditionSpread();

  return !rendition_spread || rendition_spread == SpineItemConstants.RENDITION_SPREAD_BOTH || rendition_spread == SpineItemConstants.RENDITION_SPREAD_AUTO || (rendition_spread == SpineItemConstants.RENDITION_SPREAD_LANDSCAPE && orientation == ViewsConstants.ORIENTATION_LANDSCAPE) || (rendition_spread == SpineItemConstants.RENDITION_SPREAD_PORTRAIT && orientation == ViewsConstants.ORIENTATION_PORTRAIT);
};

module.exports = isRenditionSpreadPermittedForItem
