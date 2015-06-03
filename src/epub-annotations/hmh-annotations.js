var $ = require('jquery')
var _ = require('underscore')
var Annotations = require('./annotations')
var Backbone = require('backbone')
var EPUBcfi = require('@hmh/epub-cfi');
//Added Rangy
var rangy = require('rangy');
require('rangy/lib/rangy-classapplier.js');
require('rangy/lib/rangy-serializer.js');

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

        // emit an event when user selects some text.
        var epubWindow = $(this.get("contentDocumentDOM"));
        var self = this;
        epubWindow.on("mouseup", function() {
            var ePubIframe = self.get("contentDocumentDOM");
            var range = rangy.getSelection(ePubIframe);
            var selectedText = rangy.getSelection(ePubIframe).getRangeAt(0);
            if (selectedText.toString() === "" || selectedText === undefined) {
                return;
            } else {
                //self.annotations.get("bbPageSetView").trigger("textSelectionEvent", event);
                self.createRangyHighlight();
            }
        });
    },

    addHighlight: function(fakeCfi, id, type, styles) {
        return this.createRangyHighlight();
    },

    addSelectionHighlight: function(fakeCfi, id, type, styles) {
        return this.createRangyHighlight();
    },

    createRangyHighlight: function() {
        this.rangy = rangy;
        //Added Rangy highlighting
        var CFI = this.getCurrentSelectionCFI();
        var ePubIframe = this.get("contentDocumentDOM");
        var range = rangy.getSelection(ePubIframe);
        var selectedText = rangy.getSelection(ePubIframe).getRangeAt(0);
        if (selectedText.toString() === "" || selectedText === undefined) {
            return {};
        }
        try {
            var highlight = rangy.createClassApplier("hmh-highlight-red", {
                elementTagName: "span",
                elementAttributes: {
                    "data-cfi": CFI,
                    //this will be reset from an RCE response containing annotation_id to the highlight being saved
                    "data-highlight-id": "temp"
                },
                elementProperties: {
                    onclick: function() {
                        //var highlightId = this.getAttributeNode('data-highlight-id').value;
                        //TODO: need to emit event to open RCE annotations tray
                        this.annotations.get("bbPageSetView").trigger("highlightClickEvent", event);
                        return false;
                    }
                }
            });
            highlight.applyToSelection(ePubIframe);
            
            if (this.dispatchHighlight(CFI)){
              range.removeAllRanges();
            }
            
            return {};
        } catch (err) {
            console.log('Problem applying highlight');
        }
    },

    dispatchHighlight: function(cfi) {

        var ePubIframe = this.get("contentDocumentDOM");
        var range = rangy.getSelection(ePubIframe).getRangeAt(0);

        var highlightDetails = {
            rangySerialized: rangy.serializeSelection(ePubIframe),
            text: range.toString(),
            cfi: cfi,
            objectid: range.commonAncestorContainer.getAttribute('data-uuid')
        };

        
        this.annotationsActions.add(highlightDetails);
        return true;
        //bind to change event of annotaion in store and trugger this.updateTempHighlightId

        //this.annotationsStore.addC
    },

    updateTempHighlightId: function(annotationId) {
        $("span[data-highlight-id='temp']").addClass('annotation_' + annotationId).attr('data-highlight-id', annotationId)
    },

    updateHighlightStyle: function(annotationId, newStyle) {
        $('.annotation_' + annotationId).attr('.annotation_' + annotationId + ' ' + newStyle)
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
