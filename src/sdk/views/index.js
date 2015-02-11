// TODO Remove when all underscore deps are gone
var _ = require('underscore')

var Views = {
  IFrameLoader: require('./iframe-loader'),
  ReaderView: require('./reader-view')
}

var ViewsConstants = require('./constants')

_.extend(Views, ViewsConstants)

module.exports = Views