var _ = require('underscore');
var Backbone = require('backbone');

var ReadiumSDK = {
  Views: require('./views'),
  Events: require('./events'),
  Parser: require('../../lib/epubjs/parser'),
  version: function() {
    return '0.8.0';
  }
};

require('./navigator-shim');

_.extend(ReadiumSDK, Backbone.Events);

module.exports = ReadiumSDK;
