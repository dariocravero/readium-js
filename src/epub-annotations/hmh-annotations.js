var $ = require('jquery');
var _ = require('underscore');
var Annotations = require('./annotations');
var Backbone = require('backbone');
var EPUBcfi = require('@hmh/epub-cfi');
var rangy = require('rangy');
require('rangy/lib/rangy-classapplier.js');
require('rangy/lib/rangy-serializer.js');
require('rangy/lib/rangy-selectionsaverestore.js');

var ReflowableAnnotations = Backbone.Model.extend({
  initialize: function(attributes, options) {
    this.epubCFI = EPUBcfi;
    this.annotations = new Annotations({
      readerBoundElement: $("html", this.get("contentDocumentDOM"))[0],
      bbPageSetView: this.get("bbPageSetView")
    });
    // inject annotation CSS into iframe
    var annotationCSSUrl = this.get("annotationCSSUrl");
    if (annotationCSSUrl) {
      this.injectAnnotationCSS(annotationCSSUrl);
    }
    //Added Rangy
    this.rangy = rangy;
    this.rangy.init();
    this.annotationsActions = window.rceReadiumBridge.annotations.actions;
    this.annotationsStore = window.rceReadiumBridge.annotations.store;
    this.tocStore = window.rceReadiumBridge.toc.store;
    this.getActiveNode = window.rceReadiumBridge.toc.getters.getActiveNode;
    this.sidebarActions = window.rceReadiumBridge.sidebar.actions;

    var self = this;

    window.rceReadiumBridge.annotations.isReady(function(state) {
      var ePubIframe = self.get("contentDocumentDOM");
      var idref = self.getActiveNode(self.tocStore.state).id;

      state.list.forEach(function(id, i) {
        try {
          var annotation = state.annotations[id];
          if (annotation.path.indexOf(idref) > -1 ) {
            if (ePubIframe.getElementById('data-uuid-'+ annotation.object_id) !== null) {
              if (typeof annotation.rangySerialized !== 'undefined') {
                var css = annotation.style === 'fill' ?
                  'cursor:pointer;border:0;background:' + annotation.color :
                  'cursor:pointer;background:transparent;border-bottom:2px solid transparent;border-color:' + annotation.color;

                rangy.deserializeSelection(annotation.rangySerialized, null, ePubIframe.defaultView);

                var highlight = rangy.createClassApplier("hmh-highlight", {
                  elementTagName: "span",
                  elementAttributes: {
                    "data-cfi": annotation.cfi,
                    "id" : "annotation_" + annotation.id,
                    "style" : css
                  },
                  elementProperties: {
                    onclick: function(event) {
                      event.stopPropagation();
                      self.annotationsActions.setActive(this.getAttributeNode('id').value.replace('annotation_', ''));
                      self.sidebarActions.setPanel('annotations', 'myNotes');
                      self.sidebarActions.show();
                      return false;
                    }
                  }
                });

                highlight.applyToSelection(ePubIframe);

                var range = rangy.getSelection(ePubIframe);
                $(ePubIframe).find("#annotation_" + annotation.id).removeClass();
                range.removeAllRanges();
              }
            }
          }
        } catch(err) {
          console.error(err);
        }
      });
    });

    this.annotationsChangeListener = this.annotationsStore.addChangeListener(function(state) {
      var $epubWindow = $(this.get("contentDocumentDOM"));

      state.list.forEach(function(id) {
        var annotation = state.annotations[id];
        var css = {cursor: 'pointer'};
        var $el = $epubWindow.find("#annotation_" + id);

        if (annotation.style === 'fill') {
          css.border = 0;
          css.background = annotation.color;
        } else {
          css.background = 'transparent';
          css.borderBottom = '2px solid ' + annotation.color;
        }

        $el.removeClass();
        $el.css(css);
      });

      $epubWindow.find('span[id^="annotation_"]').each(function(i, el) {
        var $el = $(el);
        if (state.list.indexOf($el.attr('id').replace('annotation_', '')) === -1) {
          $el.contents().unwrap();
        }
      });
    }.bind(this));

    this.bookStore = window.rceReadiumBridge.book.store;

    // emit an event when user selects some text.
    var ePubIframe = self.get("contentDocumentDOM");
    var $ePubIframe = $(ePubIframe);
    var savedRange = '';
    var self = this;

    ePubIframe.addEventListener("click", function(event) {
      var range = rangy.getSelection(ePubIframe);
      var selectedText;
      try {
        selectedText = rangy.getSelection(ePubIframe).getRangeAt(0);
      } catch(err) {
        console.error(err);
      } finally {
        selectedText = undefined;
      }

      if (typeof selectedText !== 'undefined') {
        if(typeof savedRange.rangeInfos !== 'undefined') {
          $ePubIframe.find('.rangySelectionBoundary').remove();
        }

        $ePubIframe.find('#menu-choice').remove();

        try {
          var serializedSelection = rangy.serializeSelection(ePubIframe, true);
          rangy.deserializeSelection(serializedSelection, null, ePubIframe.defaultView);

          if (typeof selectedText !== 'undefined' && selectedText.toString().trim() !== '' && selectedText.canSurroundContents() === true) {
            event.stopImmediatePropagation();

            savedRange = rangy.saveSelection(ePubIframe);

            $ePubIframe.find('#menu-choice').remove();
            $ePubIframe.find('body').append('<style>.selection_menu:hover{opacity: 0.75;}#menu-choice:before{content:"\\25c0";color:#EEA833; margin-left: -18px;margin-top: -16px; line-height: 32px; vertical-align: middle; height: 32px;}</style><div id="menu-choice" style="cursor: pointer; height: 38px; -webkit-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.40); -moz-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.40); box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.40);width: 50px; font-size: 12px; text-transform: uppercase; line-height: 16px; padding: 3px; padding-left: 6px; border-left: 2px solid #EEA833; position: absolute; z-index: 999; top: '+(event.pageY-20)+'px; left: '+(event.pageX+20)+'px; background: #fff; font-weight: bold;"><div class="selection_menu save" style="margin-top: -32px;">Save</div><div class="selection_menu edit" style="padding-top: 1px">Edit</div></div>');

            $ePubIframe.find('body').on('click', '.selection_menu',function(e){
              e.stopImmediatePropagation();
              e.preventDefault();

              //reapply range
              $ePubIframe.find('#menu-choice').remove();
              rangy.restoreSelection(savedRange);

              self.createRangyHighlight($(this).hasClass('edit'));
            });
          }
        } catch(err) {
          console.error(err);
        }
      }
    });
  },

  addHighlight: function(fakeCfi, id, type, styles) {
    return this.createRangyHighlight();
  },

  addSelectionHighlight: function(fakeCfi, id, type, styles) {
    return this.createRangyHighlight();
  },

  createRangyHighlight: function(openSidebar) {
    this.rangy = rangy;
    //Added Rangy highlighting
    var CFI = this.getCurrentSelectionCFI();
    var ePubIframe = this.get("contentDocumentDOM");
    var range = rangy.getSelection(ePubIframe);
    var selectedText = rangy.getSelection(ePubIframe).getRangeAt(0);
    var self = this;


    if (selectedText.canSurroundContents() === false) {
      //remove this!
      console.log('Nothing selected, or invalid selction');
      return {};
    }

    try {
      var highlight = rangy.createClassApplier("hmh-highlight-default", {
        elementTagName: "span",
        elementAttributes: {
          "data-cfi": CFI,
          "id" : "temp_annotation"
        },
        elementProperties: {
          onclick: function(event) {
            event.stopPropagation();
            self.annotationsActions.setActive(this.getAttributeNode('id').value.replace('annotation_', ''));
            self.sidebarActions.setPanel('annotations', 'myNotes');
            self.sidebarActions.show();
            return false;
          }
        }
      });

      serializedRange = rangy.serializeSelection(ePubIframe, true);

      highlight.applyToSelection(ePubIframe);

      if (this.dispatchHighlight(CFI,serializedRange, openSidebar)){
        range.removeAllRanges();
      }

      return {};
    } catch (err) {
      console.error(err);
    }
  },

  getObjectIdFromCFI: function(cfi){
    t = cfi.split('[');
    //object_id
    return t[t.length-1].split(']')[0].split('-')[2];
  },

  dispatchHighlight: function(cfi, serializedRange, openSidebar) {
    var ePubIframe = this.get("contentDocumentDOM");
    var range = rangy.getSelection(ePubIframe).getRangeAt(0);

    //safer/more reliable to get the objectID from the CFI
    var object_id = this.getObjectIdFromCFI(cfi);

    var highlightDetails = {
      cfi: cfi,
      content_id: this.bookStore.metadata.result.isbn,
      color: '#f6d855',
      object_id: object_id,
      path:  this.getActiveNode(this.tocStore.state).id + '#' + cfi,
      rangySerialized: serializedRange,
      style: 'fill',
      text: range.toString()
    };

    this.tempListener = this.annotationsStore.addChangeListener(this.updateTempHighlightId.bind(this));
    this.annotationsActions.add(highlightDetails);
    if (openSidebar) {
      this.sidebarActions.setPanel('annotations', 'myNotes');
      this.sidebarActions.show();
    }

    return true;
  },

  updateTempHighlightId: function() {
    var id = this.annotationsStore.state.list[0];
    $(this.get("contentDocumentDOM")).find("#temp_annotation").attr('id','annotation_' + id);
    this.tempListener.dispose();
  },

  updateHighlightStyle: function(id, newStyle) {
    $('.annotation_' + id).attr('.annotation_' + id + ' ' + newStyle)
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

    if (startNode.nodeType !== Node.TEXT_NODE &&
        (startNode === endNode.parentNode || startNode === endNode) &&
          selectedRange.startOffset === 0) {
      startNode = startNode.childNodes[0];
    }
    if (endNode.nodeType !== Node.TEXT_NODE &&
        (endNode === startNode.parentNode || startNode === endNode) &&
          selectedRange.endOffset > 0) {
      endNode = endNode.childNodes[endNode.childNodes.length - 1];
    }

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
