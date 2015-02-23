var SmilNode = require('./smil-node')

function TimeContainerNode(parent) {

  this.parent = parent;

  this.children = typeof this.children === 'undefined' ? [] : this.children;
  this.index = undefined;

  this.epubtype = "";

  this.isEscapable = function(userEscapables) {
    if (this.epubtype === "") {
      return false;
    }

    var smilModel = this.getSmil();
    if (!smilModel.mo) {
      return false;
    }

    var arr = smilModel.mo.escapables;
    if (userEscapables.length > 0) {
      arr = userEscapables;
    }

    for (var i = 0; i < arr.length; i++) {
      if (this.epubtype.indexOf(arr[i]) >= 0) {
        return true;
      }
    }

    return false;
  };

  this.isSkippable = function(userSkippables) {
    if (this.epubtype === "") {
      return false;
    }

    var smilModel = this.getSmil();
    if (!smilModel.mo) {
      return false;
    }

    var arr = smilModel.mo.skippables;
    if (userSkippables.length > 0) {
      arr = userSkippables;
    }

    for (var i = 0; i < arr.length; i++) {
      if (this.epubtype.indexOf(arr[i]) >= 0) {
        return true;
      }
    }

    return false;
  };
};

TimeContainerNode.prototype = new SmilNode()

module.exports = TimeContainerNode