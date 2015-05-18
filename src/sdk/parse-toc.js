var Parser = require('../../lib/epubjs/parser');

module.exports = function parseToc(xml, spine) {
  var parser = new Parser();
  var spineIndexByURL = {};

  spine.forEach(function(spineItem, index) {
    spineIndexByURL[spineItem.href] = index;
  });

  return parser.nav(xml, spineIndexByURL, spine);
};
