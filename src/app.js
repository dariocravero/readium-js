var Readium = require('./index')

var reader = new Readium.Reader({
  useSimpleLoader: true
}, {
  el: '#readium-container'
})

//  https://github.com/readium/readium-js-viewer/blob/master/lib/EpubReader.js#L643-L792
//  Readium.Reader.readiumOptions {
//    useSimpleLoader: true, /* true to load from an expanded ePub; false to unpack it on the fly */
//    jsLibRoot: '/path/to/third/party',
//    openBookOptions: {} /* TODO Define */
//  }
//
//  Readium.Reader.readerOptions {
//    annotationsCSSUrl: '/path/to/file.css',
//    el: '#id', /* DOM selector */
//  }

var URI = require('URIjs');

reader.openPackageDocument('demo-book', function onOpenPackageDocument(packageDocument, options) {
  packageDocument.getTocDom(function(html) {
    var toc = document.getElementById('toc');

    // Get a proper TOC object through EPUBJS' parser.
    // console.log('toc', parser.nav(html, {}, {}));

    toc.innerHTML = html.documentElement.querySelector('body').innerHTML;

    toc.addEventListener('click', function(event) {
      if (event.target.tagName === 'A') {
        event.preventDefault();
        var uri = URI(event.target.href).path().replace(/^\//, '');
          reader.reader.openContentUrl(uri);
      }
    }, true);
  });

  document.getElementById('left-page').addEventListener('click', function(event) {
    reader.reader.openPageLeft();
  }, false);
  document.getElementById('right-page').addEventListener('click', function(event) {
    reader.reader.openPageRight();
  }, false);

  if (process.env.node_env !== 'production') {
    window.readiumPackageDocument = packageDocument;
    window.readiumOptions = options;
  }
});

if (process.env.node_env !== 'production') {
  window.readiumReader = reader;
}
