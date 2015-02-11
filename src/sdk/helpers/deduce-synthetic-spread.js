var getOrientation = require('./get-orientation')
var SpineItemConstants = require('../models/spine-item-constants')
var ViewsConstants = require('../views/constants')

/**
 *
 * @param $viewport
 * @param spineItem
 * @param settings
 * @returns {boolean}
 */
//Based on https://docs.google.com/spreadsheet/ccc?key=0AoPMUkQhc4wcdDI0anFvWm96N0xRT184ZE96MXFRdFE&usp=drive_web#gid=0 doc
// Returns falsy and truthy
// true and false mean that the synthetic-spread or single-page is "forced" (to be respected whatever the external conditions)
// 1 and 0 mean that the synthetic-spread or single-page is "not forced" (is allowed to be overriden by external conditions, such as optimum column width / text line number of characters, etc.)
function deduceSyntheticSpread($viewport, spineItem, settings) {

  if (!$viewport || $viewport.length == 0) {
    return 0; // non-forced
  }

  //http://www.idpf.org/epub/fxl/#property-spread-values

  var rendition_spread = spineItem ? spineItem.getRenditionSpread() : undefined;

  if (rendition_spread === SpineItemConstants.RENDITION_SPREAD_NONE) {
    return false; // forced

    //"Reading Systems must not incorporate this spine item in a synthetic spread."
  }

  if (settings.syntheticSpread == "double") {
    return true; // forced
  } else if (settings.syntheticSpread == "single") {
    return false; // forced
  }

  if (!spineItem) {
    return 0; // non-forced
  }

  if (rendition_spread === SpineItemConstants.RENDITION_SPREAD_BOTH) {
    return true; // forced

    //"Reading Systems should incorporate this spine item in a synthetic spread regardless of device orientation."
  }

  var orientation = getOrientation($viewport);

  if (rendition_spread === SpineItemConstants.RENDITION_SPREAD_LANDSCAPE) {
    return orientation === ViewsConstants.ORIENTATION_LANDSCAPE; // forced

    //"Reading Systems should incorporate this spine item in a synthetic spread only when the device is in landscape orientation."
  }

  if (rendition_spread === SpineItemConstants.RENDITION_SPREAD_PORTRAIT) {
    return orientation === ViewsConstants.ORIENTATION_PORTRAIT; // forced

    //"Reading Systems should incorporate this spine item in a synthetic spread only when the device is in portrait orientation."
  }

  if (!rendition_spread || rendition_spread === SpineItemConstants.RENDITION_SPREAD_AUTO) {
    // if no spread set in document and user didn't set in in setting we will do double for landscape
    var landscape = orientation === ViewsConstants.ORIENTATION_LANDSCAPE;
    return landscape ? 1 : 0; // non-forced

    //"Reading Systems may use synthetic spreads in specific or all device orientations as part of a display area utilization optimization process."
  }

  console.warn("Helpers.deduceSyntheticSpread: spread properties?!");
  return 0; // non-forced
};

module.exports = deduceSyntheticSpread
