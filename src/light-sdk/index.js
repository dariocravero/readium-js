var _ = require('underscore'),
  Backbone = require('backbone')

var ReadiumSDK = {
  Views: require('./views'),
  Events: require('./events'),
  version: function() {
    return "0.8.0";
  },
  Parser: require('../../lib/epubjs/parser')
}

require('./navigator-shim')

_.extend(ReadiumSDK, Backbone.Events)

module.exports = ReadiumSDK
