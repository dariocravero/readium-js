var MediaNode = require('./media-node')
var ResolveContentRef = require('../../helpers/resolve-content-ref')

function TextNode(parent) {

  this.parent = parent;

  this.nodeType = "text";
  this.srcFile = "";
  this.srcFragmentId = "";


  this.manifestItemId = undefined;
  this.updateMediaManifestItemId = function() {
    var smilData = this.getSmil();

    if (!smilData.href || !smilData.href.length) {
      return; // Blank MO page placeholder, no real SMIL
    }

    // var srcParts = item.src.split('#');
    //         item.srcFile = srcParts[0];
    //         item.srcFragmentId = (srcParts.length === 2) ? srcParts[1] : "";

    var src = this.srcFile ? this.srcFile : this.src;
    // console.log("src: " + src);
    // console.log("smilData.href: " + smilData.href);
    var ref = ResolveContentRef(src, smilData.href);
    //console.log("ref: " + ref);
    var full = smilData.mo.package.resolveRelativeUrlMO(ref);
    // console.log("full: " + full);
    // console.log("---");
    for (var j = 0; j < smilData.mo.package.spine.items.length; j++) {
      var item = smilData.mo.package.spine.items[j];
      //console.log("item.href: " + item.href);
      var url = smilData.mo.package.resolveRelativeUrl(item.href);
      //console.log("url: " + url);
      if (url === full) {
        //console.error("FOUND: " + item.idref);
        this.manifestItemId = item.idref;
        return;
      }
    }

    console.error("Cannot set the Media ManifestItemId? " + this.src + " && " + smilData.href);

    //        throw "BREAK";
  };

};

TextNode.prototype = new MediaNode();

module.exports = TextNode