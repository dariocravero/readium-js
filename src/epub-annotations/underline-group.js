var $         = require('jquery')
var _         = require('underscore')
var Backbone        = require('backbone')
var TextLineInferrer = require('./text-line-inferrer')
var UnderlineView             = require('./underline-view')

var UnderlineGroup  = Backbone.Model.extend({
    defaults : function () {
        return {
            "selectedNodes" : [],
            "underlineViews" : []
        };
    },

    initialize : function (attributes, options) {

        this.constructUnderlineViews();
    },

    // --------------- PRIVATE HELPERS ---------------------------------------

    underlineGroupCallback : function (event) {

        var that = this;

        // Trigger this event on each of the underline views (except triggering event)
        if (event.type === "click") {
            that.get("bbPageSetView").trigger("annotationClicked", "underline", that.get("CFI"), that.get("id"), event);
            return;
        }

        // Events that are called on each member of the group
        _.each(this.get("underlineViews"), function (underlineView) {

            if (event.type === "mouseenter") {
                underlineView.setHoverUnderline();
            }
            else if (event.type === "mouseleave") {
                underlineView.setBaseUnderline();
            }
        });
    },

    constructUnderlineViews : function () {

        var that = this;
        var rectList = [];
        var inferrer;
        var inferredLines;

        _.each(this.get("selectedNodes"), function (node, index) {

            var rects;
            var range = document.createRange();
            range.selectNodeContents(node);
            rects = range.getClientRects();

            // REFACTORING CANDIDATE: Maybe a better way to append an array here
            _.each(rects, function (rect) {
                rectList.push(rect);
            });
        });

        inferrer = new TextLineInferrer();
        inferredLines = inferrer.inferLines(rectList);

        _.each(inferredLines, function (line, index) {

            var underlineTop = line.startTop;
            var underlineLeft = line.left;
            var underlineHeight = line.avgHeight;
            var underlineWidth = line.width;

            var underlineView = new UnderlineView({
                CFI : that.get("CFI"),
                top : underlineTop + that.get("offsetTopAddition"),
                left : underlineLeft + that.get("offsetLeftAddition"),
                height : underlineHeight,
                width : underlineWidth,
                styles : that.get("styles"),
                underlineGroupCallback : that.underlineGroupCallback,
                callbackContext : that
            });

            that.get("underlineViews").push(underlineView);
        });
    },

    resetUnderlines : function (viewportElement, offsetTop, offsetLeft) {

        if (offsetTop) {
            this.set({ offsetTopAddition : offsetTop });
        }
        if (offsetLeft) {
            this.set({ offsetLeftAddition : offsetLeft });
        }

        this.destroyCurrentUnderlines();
        this.constructUnderlineViews();
        this.renderUnderlines(viewportElement);
    },

    // REFACTORING CANDIDATE: Ensure that event listeners are being properly cleaned up. 
    destroyCurrentUnderlines : function () { 

        _.each(this.get("underlineViews"), function (underlineView) {
            underlineView.remove();
            underlineView.off();
        });

        this.get("underlineViews").length = 0;
    },

    renderUnderlines : function (viewportElement) {

        _.each(this.get("underlineViews"), function (view, index) {
            $(viewportElement).append(view.render());
        });
    },

    toInfo : function () {

        return {

            id : this.get("id"),
            type : "underline",
            CFI : this.get("CFI")
        };
    },

    setStyles : function (styles) {
        
        var underlineViews = this.get('underlineViews');

        this.set({styles : styles});

        _.each(underlineViews, function(view, index) {
            view.setStyles(styles);
        });
    },
});

module.exports = UnderlineGroup
