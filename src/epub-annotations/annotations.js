var $ = require('jquery')
var _ = require('underscore')
var Backbone = require('backbone')
var BookmarkView = require('./bookmark-view')
var HighlightGroup = require('./highlight-group')
var ImageAnnotation = require('./image-annotation')
var UnderlineGroup = require('./underline-group')

var Annotations = Backbone.Model.extend({

  defaults: function() {
    return {
      "bookmarkViews": [],
      "highlights": [],
      "markers": {},
      "underlines": [],
      "imageAnnotations": [],
      "annotationHash": {},
      "offsetTopAddition": 0,
      "offsetLeftAddition": 0,
      "readerBoundElement": undefined
    };
  },

  initialize: function(attributes, options) {},


  remove: function() {
    var that = this;
    _.each(this.get("highlights"), function(highlightGroup) {
      highlightGroup.remove();
    });
  },

  redrawAnnotations: function(offsetTop, offsetLeft) {

    var that = this;
    // Highlights
    _.each(this.get("highlights"), function(highlightGroup) {
      highlightGroup.resetHighlights(that.get("readerBoundElement"), offsetTop, offsetLeft);
    });

    // Bookmarks
    _.each(this.get("bookmarkViews"), function(bookmarkView) {
      bookmarkView.resetBookmark(offsetTop, offsetLeft);
    });

    // Underlines
    _.each(this.get("underlines"), function(underlineGroup) {
      underlineGroup.resetUnderlines(that.get("readerBoundElement"), offsetTop, offsetLeft);
    });
  },

  getBookmark: function(id) {

    var bookmarkView = this.get("annotationHash")[id];
    if (bookmarkView) {
      return bookmarkView.bookmark.toInfo();
    } else {
      return undefined;
    }
  },

  getHighlight: function(id) {

    var highlight = this.get("annotationHash")[id];
    if (highlight) {
      return highlight.toInfo();
    } else {
      return undefined;
    }
  },

  getUnderline: function(id) {

    var underline = this.get("annotationHash")[id];
    if (underline) {
      return underline.toInfo();
    } else {
      return undefined;
    }
  },

  getBookmarks: function() {

    var bookmarks = [];
    _.each(this.get("bookmarkViews"), function(bookmarkView) {

      bookmarks.push(bookmarkView.bookmark.toInfo());
    });
    return bookmarks;
  },

  getHighlights: function() {

    var highlights = [];
    _.each(this.get("highlights"), function(highlight) {

      highlights.push(highlight.toInfo());
    });
    return highlights;
  },

  getUnderlines: function() {

    var underlines = [];
    _.each(this.get("underlines"), function(underline) {

      underlines.push(underline.toInfo());
    });
    return underlines;
  },

  getImageAnnotations: function() {

    var imageAnnotations = [];
    _.each(this.get("imageAnnotations"), function(imageAnnotation) {

      imageAnnotations.push(imageAnnotation.toInfo());
    });
    return imageAnnotations;
  },

  addBookmark: function(CFI, targetElement, annotationId, offsetTop, offsetLeft, type) {

    if (!offsetTop) {
      offsetTop = this.get("offsetTopAddition");
    }
    if (!offsetLeft) {
      offsetLeft = this.get("offsetLeftAddition");
    }

    annotationId = annotationId.toString();
    this.validateAnnotationId(annotationId);

    var bookmarkView = new BookmarkView({
      CFI: CFI,
      targetElement: targetElement,
      offsetTopAddition: offsetTop,
      offsetLeftAddition: offsetLeft,
      id: annotationId.toString(),
      bbPageSetView: this.get("bbPageSetView"),
      type: type
    });
    this.get("annotationHash")[annotationId] = bookmarkView;
    this.get("bookmarkViews").push(bookmarkView);
    $(this.get("readerBoundElement")).append(bookmarkView.render());
  },

  removeHighlight: function(annotationId) {
    var annotationHash = this.get("annotationHash");
    var highlights = this.get("highlights");
    var markers = this.get("markers");

    if (!markers[annotationId])
      return;

    var startMarker = markers[annotationId].startMarker;
    var endMarker = markers[annotationId].endMarker;

    startMarker.parentNode.removeChild(startMarker);
    endMarker.parentNode.removeChild(endMarker);

    delete markers[annotationId];

    delete annotationHash[annotationId];

    highlights = _.reject(highlights,
      function(obj) {
        if (obj.id == annotationId) {
          obj.destroyCurrentHighlights();
          return true;
        } else {
          return false;
        }
      }
    );


    this.set("highlights", highlights);
  },

  addHighlight: function(CFI, highlightedTextNodes, annotationId, offsetTop, offsetLeft, startMarker, endMarker, styles) {
    if (!offsetTop) {
      offsetTop = this.get("offsetTopAddition");
    }
    if (!offsetLeft) {
      offsetLeft = this.get("offsetLeftAddition");
    }

    annotationId = annotationId.toString();
    this.validateAnnotationId(annotationId);

    var highlightGroup = new HighlightGroup({
      CFI: CFI,
      selectedNodes: highlightedTextNodes,
      offsetTopAddition: offsetTop,
      offsetLeftAddition: offsetLeft,
      styles: styles,
      id: annotationId,
      bbPageSetView: this.get("bbPageSetView"),
      scale: this.get("scale")
    });
    this.get("annotationHash")[annotationId] = highlightGroup;
    this.get("highlights").push(highlightGroup);
    this.get("markers")[annotationId] = {
      "startMarker": startMarker,
      "endMarker": endMarker
    };
    highlightGroup.renderHighlights(this.get("readerBoundElement"));
  },

  addUnderline: function(CFI, underlinedTextNodes, annotationId, offsetTop, offsetLeft, styles) {

    if (!offsetTop) {
      offsetTop = this.get("offsetTopAddition");
    }
    if (!offsetLeft) {
      offsetLeft = this.get("offsetLeftAddition");
    }

    annotationId = annotationId.toString();
    this.validateAnnotationId(annotationId);

    var underlineGroup = new UnderlineGroup({
      CFI: CFI,
      selectedNodes: underlinedTextNodes,
      offsetTopAddition: offsetTop,
      offsetLeftAddition: offsetLeft,
      styles: styles,
      id: annotationId,
      bbPageSetView: this.get("bbPageSetView")
    });
    this.get("annotationHash")[annotationId] = underlineGroup;
    this.get("underlines").push(underlineGroup);
    underlineGroup.renderUnderlines(this.get("readerBoundElement"));
  },

  addImageAnnotation: function(CFI, imageNode, annotationId) {

    annotationId = annotationId.toString();
    this.validateAnnotationId(annotationId);

    var imageAnnotation = new ImageAnnotation({
      CFI: CFI,
      imageNode: imageNode,
      id: annotationId,
      bbPageSetView: this.get("bbPageSetView")
    });
    this.get("annotationHash")[annotationId] = imageAnnotation;
    this.get("imageAnnotations").push(imageAnnotation);
    imageAnnotation.render();
  },

  updateAnnotationView: function(id, styles) {
    var annotationViews = this.get("annotationHash")[id];

    annotationViews.setStyles(styles);

    return annotationViews;
  },

  // REFACTORING CANDIDATE: Some kind of hash lookup would be more efficient here, might want to 
  //   change the implementation of the annotations as an array
  validateAnnotationId: function(id) {

    if (this.get("annotationHash")[id]) {
      throw new Error("That annotation id already exists; annotation not added");
    }
  }
});

module.exports = Annotations