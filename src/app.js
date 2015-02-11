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

reader.openPackageDocument('demo-book', function onOpenPackageDocument(packageDocument, options) {
  console.log('openPackageDocument', packageDocument, options)

  packageDocument.generateTocListDOM(function(html) {
    window.packageDocumentHtml = html;
    document.getElementById('toc').innerHTML = html.documentElement.querySelector('body').innerHTML;
  })

  if (process.env.node_env !== 'production') {
    window.readiumPackageDocument = packageDocument;
    window.readiumOptions = options;
  }
})

if (process.env.node_env !== 'production') {
  window.Readium = Readium
  window.readiumReader = reader;
}