var TimeContainerNode = require('./time-container-node')

function ParNode(parent) {

  this.parent = parent;

  this.children = [];
  this.nodeType = "par";
  this.text = undefined;
  this.audio = undefined;
  this.element = undefined;


  this.getFirstSeqAncestorWithEpubType = function(epubtype, includeSelf) {
    if (!epubtype) return undefined;

    var parent = includeSelf ? this : this.parent;
    while (parent) {
      if (parent.epubtype && parent.epubtype.indexOf(epubtype) >= 0) {
        return parent; // assert(parent.nodeType === "seq")
      }

      parent = parent.parent;
    }

    return undefined;
  };
};

ParNode.prototype = new TimeContainerNode();

module.exports = ParNode
