function SmilNode(parent) {

  this.parent = parent;

  this.id = "";

  //root node is a smil model
  this.getSmil = function() {

    var node = this;
    while (node.parent) {
      node = node.parent;
    }

    return node;
  };

  this.hasAncestor = function(node) {
    var parent = this.parent;
    while (parent) {
      if (parent == node) {
        return true;
      }

      parent = parent.parent;
    }

    return false;
  };
};

module.exports = SmilNode
