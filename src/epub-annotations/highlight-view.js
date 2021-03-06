var $ = require('jquery');
var Backbone = require('backbone');
var Highlight = require('./highlight');
Backbone.$ = $;

var HighlightView = Backbone.View.extend({

  el: "<div class='highlight'></div>",

  events: {
    "mouseenter": "highlightEvent",
    "mouseleave": "highlightEvent",
    "click": "highlightEvent",
    "contextmenu": "highlightEvent"
  },

  initialize: function(options) {

    this.highlight = new Highlight({
      CFI: options.CFI,
      top: options.top,
      left: options.left,
      height: options.height,
      width: options.width,
      styles: options.styles,
      highlightGroupCallback: options.highlightGroupCallback,
      callbackContext: options.callbackContext
    });
  },

  render: function() {

    this.setCSS();
    return this.el;
  },

  resetPosition: function(top, left, height, width) {

    this.highlight.set({
      top: top,
      left: left,
      height: height,
      width: width
    });
    this.setCSS();
  },

  setStyles: function(styles) {

    this.highlight.set({
      styles: styles,
    });
    this.render();
  },

  setCSS: function() {

    var styles = this.highlight.get("styles") || {};

    this.$el.css({
      "top": this.highlight.get("top") + "px",
      "left": this.highlight.get("left") + "px",
      "height": this.highlight.get("height") + "px",
      "width": this.highlight.get("width") + "px",
      "background-color": styles.fill_color || "normal",
    });
  },

  setBaseHighlight: function() {

    this.$el.addClass("highlight");
    this.$el.removeClass("hover-highlight");
  },

  setHoverHighlight: function() {

    this.$el.addClass("hover-highlight");
    this.$el.removeClass("highlight");
  },

  highlightEvent: function(event) {

    event.stopPropagation();
    var highlightGroupCallback = this.highlight.get("highlightGroupCallback");
    var highlightGroupContext = this.highlight.get("callbackContext");
    highlightGroupContext.highlightGroupCallback(event);
  }
});

module.exports = HighlightView;
