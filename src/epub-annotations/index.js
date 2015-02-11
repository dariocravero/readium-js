// This was readium-js-shared/lib/annotations_module.js
// It was renamed slightly (no Module bit ) and split into multiple files for simplicity
// EpubAnnotationsModule is now EpubAnnotations. EpubAnnotations namespace was dropped in favour
// of explicit requires where used.

var ReflowableAnnotations = require('./reflowable-annotations')

var EpubAnnotations = function(contentDocumentDOM, bbPageSetView, annotationCSSUrl) {
  var reflowableAnnotations = new ReflowableAnnotations({
    contentDocumentDOM: contentDocumentDOM,
    bbPageSetView: bbPageSetView,
    annotationCSSUrl: annotationCSSUrl,
  });

  // Description: The public interface
  return {
    addSelectionHighlight: function(id, type, styles) {
      return reflowableAnnotations.addSelectionHighlight(id, type, styles);
    },
    addSelectionBookmark: function(id, type) {
      return reflowableAnnotations.addSelectionBookmark(id, type);
    },
    addSelectionImageAnnotation: function(id) {
      return reflowableAnnotations.addSelectionImageAnnotation(id);
    },
    addHighlight: function(CFI, id, type, styles) {
      return reflowableAnnotations.addHighlight(CFI, id, type, styles);
    },
    addBookmark: function(CFI, id, type) {
      return reflowableAnnotations.addBookmark(CFI, id, type);
    },
    addImageAnnotation: function(CFI, id) {
      return reflowableAnnotations.addImageAnnotation(CFI, id);
    },
    updateAnnotationView: function(id, styles) {
      return reflowableAnnotations.updateAnnotationView(id, styles);
    },
    redraw: function() {
      return reflowableAnnotations.redraw();
    },
    getBookmark: function(id) {
      return reflowableAnnotations.annotations.getBookmark(id);
    },
    getBookmarks: function() {
      return reflowableAnnotations.annotations.getBookmarks();
    },
    getHighlight: function(id) {
      return reflowableAnnotations.annotations.getHighlight(id);
    },
    getHighlights: function() {
      return reflowableAnnotations.annotations.getHighlights();
    },
    getUnderline: function(id) {
      return reflowableAnnotations.annotations.getUnderline(id);
    },
    getUnderlines: function() {
      return reflowableAnnotations.annotations.getUnderlines();
    },
    getImageAnnotation: function() {

    },
    getImageAnnotations: function() {

    },
    removeAnnotation: function(annotationId) {
      return reflowableAnnotations.remove(annotationId);
    },
    getCurrentSelectionCFI: function() {
      return reflowableAnnotations.getCurrentSelectionCFI();
    },
    getCurrentSelectionOffsetCFI: function() {
      return reflowableAnnotations.getCurrentSelectionOffsetCFI();
    },
    removeHighlight: function(annotationId) {
      return reflowableAnnotations.removeHighlight(annotationId);
    }
  };
};

module.exports = EpubAnnotations