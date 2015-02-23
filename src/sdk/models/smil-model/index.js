//  LauncherOSX
//
//  Created by Boris Schneiderman.
// Modified by Daniel Weck
//  Copyright (c) 2014 Readium Foundation and/or its licensees. All rights reserved.
//  
//  Redistribution and use in source and binary forms, with or without modification, 
//  are permitted provided that the following conditions are met:
//  1. Redistributions of source code must retain the above copyright notice, this 
//  list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright notice, 
//  this list of conditions and the following disclaimer in the documentation and/or 
//  other materials provided with the distribution.
//  3. Neither the name of the organization nor the names of its contributors may be 
//  used to endorse or promote products derived from this software without specific 
//  prior written permission.
//  
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
//  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
//  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
//  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
//  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
//  BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
//  OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
//  OF THE POSSIBILITY OF SUCH DAMAGE.

var AudioNode = require('./audio-node')
var TextNode = require('./text-node')
var SeqNode = require('./seq-node')
var ParNode = require('./par-node')

function SmilModel() {

  this.parent = undefined;



  this.children = []; //collection of seq or par smil nodes
  this.id = undefined; //manifest item id
  this.href = undefined; //href of the .smil source file
  this.duration = undefined;
  this.mo = undefined;

  this.parallelAt = function(timeMilliseconds) {
    return this.children[0].parallelAt(timeMilliseconds);
  };

  this.nthParallel = function(index) {
    var count = {
      count: -1
    };
    return this.children[0].nthParallel(index, count);
  };

  this.clipOffset = function(par) {
    var offset = {
      offset: 0
    };
    if (this.children[0].clipOffset(offset, par)) {
      return offset.offset;
    }

    return 0;
  };

  this.durationMilliseconds_Calculated = function() {
    return this.children[0].durationMilliseconds();
  };


  var _epubtypeSyncs = [];
  // 
  // this.clearSyncs = function()
  // {
  //     _epubtypeSyncs = [];
  // };

  this.hasSync = function(epubtype) {
    for (var i = 0; i < _epubtypeSyncs.length; i++) {
      if (_epubtypeSyncs[i] === epubtype) {
        //console.debug("hasSync OK: ["+epubtype+"]");
        return true;
      }
    }

    //console.debug("hasSync??: ["+epubtype+"] " + _epubtypeSyncs);
    return false;
  };

  this.addSync = function(epubtypes) {
    if (!epubtypes) return;

    //console.debug("addSyncs: "+epubtypes);

    var parts = epubtypes.split(' ');
    for (var i = 0; i < parts.length; i++) {
      var epubtype = parts[i].trim();

      if (epubtype.length > 0 && !this.hasSync(epubtype)) {
        _epubtypeSyncs.push(epubtype);

        //console.debug("addSync: "+epubtype);
      }
    }
  };

};

SmilModel.fromSmilDTO = function(smilDTO, mo) {

  if (mo.DEBUG) {
    console.debug("Media Overlay DTO import...");
  }

  var indent = 0;
  var getIndent = function() {
    var str = "";
    for (var i = 0; i < indent; i++) {
      str += "   ";
    }
    return str;
  }

  var smilModel = new SmilModel();
  smilModel.id = smilDTO.id;
  smilModel.spineItemId = smilDTO.spineItemId;
  smilModel.href = smilDTO.href;

  smilModel.smilVersion = smilDTO.smilVersion;

  smilModel.duration = smilDTO.duration;
  if (smilModel.duration && smilModel.duration.length && smilModel.duration.length > 0) {
    console.error("SMIL duration is string, parsing float... (" + smilModel.duration + ")");
    smilModel.duration = parseFloat(smilModel.duration);
  }

  smilModel.mo = mo; //ReadiumSDK.Models.MediaOverlay

  if (smilModel.mo.DEBUG) {
    console.log("JS MO smilVersion=" + smilModel.smilVersion);
    console.log("JS MO id=" + smilModel.id);
    console.log("JS MO spineItemId=" + smilModel.spineItemId);
    console.log("JS MO href=" + smilModel.href);
    console.log("JS MO duration=" + smilModel.duration);
  }

  var safeCopyProperty = function(property, from, to, isRequired) {

    if ((property in from)) { // && from[property] !== ""

      if (!(property in to)) {
        console.debug("property " + property + " not declared in smil node " + to.nodeType);
      }

      to[property] = from[property];

      if (smilModel.mo.DEBUG) {
        console.log(getIndent() + "JS MO: [" + property + "=" + to[property] + "]");
      }
    } else if (isRequired) {
      console.log("Required property " + property + " not found in smil node " + from.nodeType);
    }
  };

  var createNodeFromDTO = function(nodeDTO, parent) {

    var node;

    if (nodeDTO.nodeType == "seq") {

      if (smilModel.mo.DEBUG) {
        console.log(getIndent() + "JS MO seq");
      }

      node = new SeqNode(parent);

      safeCopyProperty("textref", nodeDTO, node, ((parent && parent.parent) ? true : false));
      safeCopyProperty("id", nodeDTO, node);
      safeCopyProperty("epubtype", nodeDTO, node);

      if (node.epubtype) {
        node.getSmil().addSync(node.epubtype);
      }

      indent++;
      copyChildren(nodeDTO, node);
      indent--;
    } else if (nodeDTO.nodeType == "par") {

      if (smilModel.mo.DEBUG) {
        console.log(getIndent() + "JS MO par");
      }

      node = new ParNode(parent);

      safeCopyProperty("id", nodeDTO, node);
      safeCopyProperty("epubtype", nodeDTO, node);

      if (node.epubtype) {
        node.getSmil().addSync(node.epubtype);
      }

      indent++;
      copyChildren(nodeDTO, node);
      indent--;

      for (var i = 0, count = node.children.length; i < count; i++) {
        var child = node.children[i];

        if (child.nodeType == "text") {
          node.text = child;
        } else if (child.nodeType == "audio") {
          node.audio = child;
        } else {
          console.error("Unexpected smil node type: " + child.nodeType);
        }
      }

      ////////////////
      var forceTTS = false; // for testing only!
      ////////////////

      if (forceTTS || !node.audio) {
        // synthetic speech (playback using TTS engine), or embedded media, or blank page
        var fakeAudio = new AudioNode(node);

        fakeAudio.clipBegin = 0;
        fakeAudio.clipEnd = fakeAudio.MAX;
        fakeAudio.src = undefined;

        node.audio = fakeAudio;
      }
    } else if (nodeDTO.nodeType == "text") {

      if (smilModel.mo.DEBUG) {
        console.log(getIndent() + "JS MO text");
      }

      node = new TextNode(parent);

      safeCopyProperty("src", nodeDTO, node, true);
      safeCopyProperty("srcFile", nodeDTO, node, true);
      safeCopyProperty("srcFragmentId", nodeDTO, node, false);
      safeCopyProperty("id", nodeDTO, node);

      node.updateMediaManifestItemId();
    } else if (nodeDTO.nodeType == "audio") {

      if (smilModel.mo.DEBUG) {
        console.log(getIndent() + "JS MO audio");
      }

      node = new AudioNode(parent);

      safeCopyProperty("src", nodeDTO, node, true);
      safeCopyProperty("id", nodeDTO, node);

      safeCopyProperty("clipBegin", nodeDTO, node);
      if (node.clipBegin && node.clipBegin.length && node.clipBegin.length > 0) {
        console.error("SMIL clipBegin is string, parsing float... (" + node.clipBegin + ")");
        node.clipBegin = parseFloat(node.clipBegin);
      }
      if (node.clipBegin < 0) {
        if (smilModel.mo.DEBUG) {
          console.log(getIndent() + "JS MO clipBegin adjusted to ZERO");
        }
        node.clipBegin = 0;
      }

      safeCopyProperty("clipEnd", nodeDTO, node);
      if (node.clipEnd && node.clipEnd.length && node.clipEnd.length > 0) {
        console.error("SMIL clipEnd is string, parsing float... (" + node.clipEnd + ")");
        node.clipEnd = parseFloat(node.clipEnd);
      }
      if (node.clipEnd <= node.clipBegin) {
        if (smilModel.mo.DEBUG) {
          console.log(getIndent() + "JS MO clipEnd adjusted to MAX");
        }
        node.clipEnd = node.MAX;
      }

      //node.updateMediaManifestItemId(); ONLY XHTML SPINE ITEMS 
    } else {
      console.error("Unexpected smil node type: " + nodeDTO.nodeType);
      return undefined;
    }

    return node;

  };

  var copyChildren = function(from, to) {

    var count = from.children.length;

    for (var i = 0; i < count; i++) {
      var node = createNodeFromDTO(from.children[i], to);
      node.index = i;
      to.children.push(node);
    }

  };

  copyChildren(smilDTO, smilModel);

  return smilModel;

};

module.exports = SmilModel