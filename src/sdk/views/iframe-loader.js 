var $ = require('zepto')
var _ = require('underscore')
var URI = require('URIjs')

function IFrameLoader() {

  var self = this;
  var eventListeners = {};


  this.addIFrameEventListener = function(eventName, callback, context) {

    if (eventListeners[eventName] == undefined) {
      eventListeners[eventName] = [];
    }

    eventListeners[eventName].push({
      callback: callback,
      context: context
    });
  };

  this.updateIframeEvents = function(iframe) {

    _.each(eventListeners, function(value, key) {
      for (var i = 0, count = value.length; i < count; i++) {
        $(iframe.contentWindow).off(key);
        $(iframe.contentWindow).on(key, value[i].callback, value[i].context);
      }
    });
  };

  this.loadIframe = function(iframe, src, callback, context, attachedData) {

    iframe.setAttribute("data-baseUri", iframe.baseURI);
    iframe.setAttribute("data-src", src);

    var loadedDocumentUri = new URI(src).absoluteTo(iframe.baseURI).toString();

    self._loadIframeWithUri(iframe, attachedData, loadedDocumentUri, function() {
      var doc = iframe.contentDocument || iframe.contentWindow.document;
      $('svg', doc).load(function() {
        console.log('loaded');
      });
      callback.call(context, true, attachedData);
    });
  };

  this._loadIframeWithUri = function(iframe, attachedData, contentUri, callback) {

    iframe.onload = function() {

      self.updateIframeEvents(iframe);

      var mathJax = iframe.contentWindow.MathJax;
      if (mathJax) {
        // If MathJax is being used, delay the callback until it has completed rendering
        var mathJaxCallback = _.once(callback);
        try {
          mathJax.Hub.Queue(mathJaxCallback);
        } catch (err) {
          console.error("MathJax fail!");
          callback();
        }
        // Or at an 8 second timeout, which ever comes first
        //window.setTimeout(mathJaxCallback, 8000);
      } else {
        callback();
      }
    };

    iframe.setAttribute("src", contentUri);

  };



}

module.exports = IFrameLoader
