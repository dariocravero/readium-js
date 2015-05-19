var $ = require('jquery')
var _ = require('underscore')
var Annotations = require('./annotations')
var Backbone = require('backbone')
var EPUBcfi = require('@hmh/epub-cfi');

var ReflowableAnnotations = Backbone.Model.extend({

  initialize: function(attributes, options) {

    this.epubCFI = EPUBcfi;
    this.annotations = new Annotations({
      offsetTopAddition: 0,
      offsetLeftAddition: 0,
      readerBoundElement: $("html", this.get("contentDocumentDOM"))[0],
      scale: 0,
      bbPageSetView: this.get("bbPageSetView")
    });
    // inject annotation CSS into iframe 


    var annotationCSSUrl = this.get("annotationCSSUrl");
    if (annotationCSSUrl) {
      this.injectAnnotationCSS(annotationCSSUrl);
    }

    // emit an event when user selects some text.
    var epubWindow = $(this.get("contentDocumentDOM"));
    var self = this;
    epubWindow.on("mouseup", function(event) {
      var range = self.getCurrentSelectionRange();
      if (range === undefined) {
        return;
      }
      if (range.startOffset - range.endOffset) {
        self.annotations.get("bbPageSetView").trigger("textSelectionEvent", event);
      }
    });


  },

  // ------------------------------------------------------------------------------------ //
  //  "PUBLIC" METHODS (THE API)                                                          //
  // ------------------------------------------------------------------------------------ //

  redraw: function() {

    var leftAddition = -this.getPaginationLeftOffset();
    this.annotations.redrawAnnotations(0, leftAddition);
  },

  removeHighlight: function(annotationId) {
    return this.annotations.removeHighlight(annotationId)
  },



  addHighlight: function(CFI, id, type, styles) {

    var CFIRangeInfo;
    var range;
    var rangeStartNode;
    var rangeEndNode;
    var selectedElements;
    var leftAddition;
    var startMarkerHtml = this.getRangeStartMarker(CFI, id);
    var endMarkerHtml = this.getRangeEndMarker(CFI, id);

    // TODO webkit specific?
    // FIXME Check this polyfill https://github.com/jfsiii/XCSSMatrix
    var $html = $(this.get("contentDocumentDOM"));
    var matrix = $('html', $html).css('-webkit-transform');
    var scale = new WebKitCSSMatrix(matrix).a;
    this.set("scale", scale);

    try {
      CFIRangeInfo = this.epubCFI.injectRangeElements(
        CFI,
        this.get("contentDocumentDOM"),
        startMarkerHtml,
        endMarkerHtml, ["cfi-marker", "mo-cfi-highlight"], [], ["MathJax_Message"]
      );

      // Get start and end marker for the id, using injected into elements
      // REFACTORING CANDIDATE: Abstract range creation to account for no previous/next sibling, for different types of
      //   sibiling, etc. 
      rangeStartNode = CFIRangeInfo.startElement.nextSibling ? CFIRangeInfo.startElement.nextSibling : CFIRangeInfo.startElement;
      rangeEndNode = CFIRangeInfo.endElement.previousSibling ? CFIRangeInfo.endElement.previousSibling : CFIRangeInfo.endElement;
      range = document.createRange();
      range.setStart(rangeStartNode, 0);
      range.setEnd(rangeEndNode, rangeEndNode.length);

      selectionInfo = this.getSelectionInfo(range);
      leftAddition = -this.getPaginationLeftOffset();

      if (type === "highlight") {
        this.annotations.set('scale', this.get('scale'));
        this.annotations.addHighlight(CFI, selectionInfo.selectedElements, id, 0, leftAddition, CFIRangeInfo.startElement, CFIRangeInfo.endElement, styles);
      } else if (type === "underline") {
        this.annotations.addUnderline(CFI, selectionInfo.selectedElements, id, 0, leftAddition, styles);
      }

      return {
        CFI: CFI,
        selectedElements: selectionInfo.selectedElements
      };

    } catch (error) {
      console.log(error.message);
    }
  },

  addBookmark: function(CFI, id, type) {

    var selectedElements;
    var bookmarkMarkerHtml = this.getBookmarkMarker(CFI, id);
    var $injectedElement;
    var leftAddition;

    try {
      $injectedElement = this.epubCFI.injectElement(
        CFI,
        this.get("contentDocumentDOM"),
        bookmarkMarkerHtml, ["cfi-marker", "mo-cfi-highlight"], [], ["MathJax_Message"]
      );

      // Add bookmark annotation here
      leftAddition = -this.getPaginationLeftOffset();
      this.annotations.addBookmark(CFI, $injectedElement[0], id, 0, leftAddition, type);

      return {

        CFI: CFI,
        selectedElements: $injectedElement[0]
      };

    } catch (error) {
      console.log(error.message);
    }
  },

  addImageAnnotation: function(CFI, id) {

    var selectedElements;
    var bookmarkMarkerHtml = this.getBookmarkMarker(CFI, id);
    var $targetImage;

    try {
      $targetImage = this.epubCFI.getTargetElement(
        CFI,
        this.get("contentDocumentDOM"), ["cfi-marker", "mo-cfi-highlight"], [], ["MathJax_Message"]
      );
      this.annotations.addImageAnnotation(CFI, $targetImage[0], id);

      return {

        CFI: CFI,
        selectedElements: $targetImage[0]
      };

    } catch (error) {
      console.log(error.message);
    }
  },

  // this returns a partial CFI only!!
  getCurrentSelectionCFI: function() {
    var currentSelection = this.getCurrentSelectionRange();
    var CFI;
    if (currentSelection) {
      selectionInfo = this.getSelectionInfo(currentSelection);
      CFI = selectionInfo.CFI;
    }

    return CFI;
  },

  // this returns a partial CFI only!!
  getCurrentSelectionOffsetCFI: function() {
    var currentSelection = this.getCurrentSelectionRange();

    var CFI;
    if (currentSelection) {
      CFI = this.generateCharOffsetCFI(currentSelection);
    }
    return CFI;
  },


  /// TODODM refactor thhis using getCurrentSelectionCFI (above)


  addSelectionHighlight: function(id, type, styles) {

    var arbitraryPackageDocCFI = "/99!"
    var generatedContentDocCFI;
    var CFI;
    var selectionInfo;
    var currentSelection = this.getCurrentSelectionRange();
    var annotationInfo;

    if (currentSelection) {

      selectionInfo = this.getSelectionInfo(currentSelection);
      generatedContentDocCFI = selectionInfo.CFI;
      CFI = "epubcfi(" + arbitraryPackageDocCFI + generatedContentDocCFI + ")";
      if (type === "highlight") {
        annotationInfo = this.addHighlight(CFI, id, type, styles);
      } else if (type === "underline") {
        annotationInfo = this.addHighlight(CFI, id, type, styles);
      }

      // Rationale: The annotationInfo object returned from .addBookmark(...) contains the same value of 
      //   the CFI variable in the current scope. Since this CFI variable contains a "hacked" CFI value -
      //   only the content document portion is valid - we want to replace the annotationInfo.CFI property with
      //   the partial content document CFI portion we originally generated.
      annotationInfo.CFI = generatedContentDocCFI;
      return annotationInfo;
    } else {
      throw new Error("Nothing selected");
    }
  },

  addSelectionBookmark: function(id, type) {

    var arbitraryPackageDocCFI = "/99!"
    var generatedContentDocCFI;
    var CFI;
    var currentSelection = this.getCurrentSelectionRange();
    var annotationInfo;

    if (currentSelection) {

      generatedContentDocCFI = this.generateCharOffsetCFI(currentSelection);
      CFI = "epubcfi(" + arbitraryPackageDocCFI + generatedContentDocCFI + ")";
      annotationInfo = this.addBookmark(CFI, id, type);

      // Rationale: The annotationInfo object returned from .addBookmark(...) contains the same value of 
      //   the CFI variable in the current scope. Since this CFI variable contains a "hacked" CFI value -
      //   only the content document portion is valid - we want to replace the annotationInfo.CFI property with
      //   the partial content document CFI portion we originally generated.
      annotationInfo.CFI = generatedContentDocCFI;
      return annotationInfo;
    } else {
      throw new Error("Nothing selected");
    }
  },

  addSelectionImageAnnotation: function(id) {

    var arbitraryPackageDocCFI = "/99!"
    var generatedContentDocCFI;
    var CFI;
    var selectionInfo;
    var currentSelection = this.getCurrentSelectionRange();
    var annotationInfo;
    var firstSelectedImage;

    if (currentSelection) {

      selectionInfo = this.getSelectionInfo(currentSelection, ["img"]);
      firstSelectedImage = selectionInfo.selectedElements[0];
      generatedContentDocCFI = this.epubCFI.generateElementCFIComponent(
        firstSelectedImage, ["cfi-marker", "mo-cfi-highlight"], [], ["MathJax_Message"]
      );
      CFI = "epubcfi(" + arbitraryPackageDocCFI + generatedContentDocCFI + ")";
      annotationInfo = this.addImageAnnotation(CFI, id);

      // Rationale: The annotationInfo object returned from .addBookmark(...) contains the same value of 
      //   the CFI variable in the current scope. Since this CFI variable contains a "hacked" CFI value -
      //   only the content document portion is valid - we want to replace the annotationInfo.CFI property with
      //   the partial content document CFI portion we originally generated.
      annotationInfo.CFI = generatedContentDocCFI;
      return annotationInfo;
    } else {
      throw new Error("Nothing selected");
    }
  },

  updateAnnotationView: function(id, styles) {

    var annotationViews = this.annotations.updateAnnotationView(id, styles);

    return annotationViews;
  },

  // ------------------------------------------------------------------------------------ //
  //  "PRIVATE" HELPERS                                                                   //
  // ------------------------------------------------------------------------------------ //

  getSelectionInfo: function(selectedRange, elementType) {

    // Generate CFI for selected text
    var CFI = this.generateRangeCFI(selectedRange);
    var intervalState = {
      startElementFound: false,
      endElementFound: false
    };
    var selectedElements = [];

    if (!elementType) {
      var elementType = ["text"];
    }

    this.findSelectedElements(
      selectedRange.commonAncestorContainer,
      selectedRange.startContainer,
      selectedRange.endContainer,
      intervalState,
      selectedElements,
      elementType
    );

    // Return a list of selected text nodes and the CFI
    return {
      CFI: CFI,
      selectedElements: selectedElements
    };
  },

  generateRangeCFI: function(selectedRange) {

    var startNode = selectedRange.startContainer;
    var endNode = selectedRange.endContainer;
    var startOffset;
    var endOffset;
    var rangeCFIComponent;

    if (startNode.nodeType === Node.TEXT_NODE && endNode.nodeType === Node.TEXT_NODE) {

      startOffset = selectedRange.startOffset;
      endOffset = selectedRange.endOffset;

      rangeCFIComponent = this.epubCFI.generateCharOffsetRangeComponent(
        startNode,
        startOffset,
        endNode,
        endOffset, ["cfi-marker", "mo-cfi-highlight"], [], ["MathJax_Message"]
      );
      return rangeCFIComponent;
    } else {
      throw new Error("Selection start and end must be text nodes");
    }
  },

  generateCharOffsetCFI: function(selectedRange) {

    // Character offset
    var startNode = selectedRange.startContainer;
    var startOffset = selectedRange.startOffset;
    var charOffsetCFI;

    if (startNode.nodeType === Node.TEXT_NODE) {
      charOffsetCFI = this.epubCFI.generateCharacterOffsetCFIComponent(
        startNode,
        startOffset, ["cfi-marker", "mo-cfi-highlight"], [], ["MathJax_Message"]
      );
    }
    return charOffsetCFI;
  },

  // REFACTORING CANDIDATE: Convert this to jquery
  findSelectedElements: function(currElement, startElement, endElement, intervalState, selectedElements, elementTypes) {

    if (currElement === startElement) {
      intervalState.startElementFound = true;
    }

    if (intervalState.startElementFound === true) {
      this.addElement(currElement, selectedElements, elementTypes);
    }

    if (currElement === endElement) {
      intervalState.endElementFound = true;
      return;
    }

    if (currElement.firstChild) {
      this.findSelectedElements(currElement.firstChild, startElement, endElement, intervalState, selectedElements, elementTypes);
      if (intervalState.endElementFound) {
        return;
      }
    }

    if (currElement.nextSibling) {
      this.findSelectedElements(currElement.nextSibling, startElement, endElement, intervalState, selectedElements, elementTypes);
      if (intervalState.endElementFound) {
        return;
      }
    }
  },

  addElement: function(currElement, selectedElements, elementTypes) {

    // Check if the node is one of the types
    _.each(elementTypes, function(elementType) {

      if (elementType === "text") {
        if (currElement.nodeType === Node.TEXT_NODE) {
          selectedElements.push(currElement);
        }
      } else {
        if ($(currElement).is(elementType)) {
          selectedElements.push(currElement);
        }
      }
    });
  },

  // Rationale: This is a cross-browser method to get the currently selected text
  getCurrentSelectionRange: function() {

    var currentSelection;
    var iframeDocument = this.get("contentDocumentDOM");
    if (iframeDocument.getSelection) {
      currentSelection = iframeDocument.getSelection();

      if (currentSelection && currentSelection.rangeCount && (currentSelection.anchorOffset !== currentSelection.focusOffset)) {
        return currentSelection.getRangeAt(0);
      } else {
        return undefined;
      }
    } else if (iframeDocument.selection) {
      return iframeDocument.selection.createRange();
    } else {
      return undefined;
    }
  },

  getPaginationLeftOffset: function() {

    var $htmlElement = $("html", this.get("contentDocumentDOM"));
    var offsetLeftPixels = $htmlElement.css("left");
    var offsetLeft = parseInt(offsetLeftPixels.replace("px", ""));
    return offsetLeft;
  },

  getBookmarkMarker: function(CFI, id) {

    return "<span class='bookmark-marker cfi-marker' id='" + id + "' data-cfi='" + CFI + "'></span>";
  },

  getRangeStartMarker: function(CFI, id) {

    return "<span class='range-start-marker cfi-marker' id='start-" + id + "' data-cfi='" + CFI + "'></span>";
  },

  getRangeEndMarker: function(CFI, id) {

    return "<span class='range-end-marker cfi-marker' id='end-" + id + "' data-cfi='" + CFI + "'></span>";
  },

  injectAnnotationCSS: function(annotationCSSUrl) {

    var $contentDocHead = $("head", this.get("contentDocumentDOM"));
    $contentDocHead.append(
      $("<link/>", {
        rel: "stylesheet",
        href: annotationCSSUrl,
        type: "text/css"
      })
    );
  }
});

module.exports = ReflowableAnnotations;
