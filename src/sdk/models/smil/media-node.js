var SmilNode = require('./smil-node')

function MediaNode(parent) {

  this.parent = parent;

  this.src = "";
};

MediaNode.prototype = new SmilNode();

module.exports = MediaNode
