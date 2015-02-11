var Parser = function(baseUrl){
  this.baseUrl = baseUrl || '';
};

Parser.prototype.nav = function(navHtml, spineIndexByURL, bookSpine){
  var navEl = navHtml.querySelector('nav[*|type="toc"]'), //-- [*|type="toc"] * Doesn't seem to work
  idCounter = 0;

  if(!navEl) return [];

  // Implements `> ol > li`
  function findListItems(parent){
    var items = [];

    Array.prototype.slice.call(parent.childNodes).forEach(function(node){
      if('ol' == node.tagName){
        Array.prototype.slice.call(node.childNodes).forEach(function(item){
          if('li' == item.tagName){
            items.push(item);
          }
        });
      }
    });

    return items;

  }

  // Implements `> a, > span`
  function findAnchorOrSpan(parent){
    var item = null;

    Array.prototype.slice.call(parent.childNodes).forEach(function(node){
      if('a' == node.tagName || 'span' == node.tagName){
        item = node;
      }
    });

    return item;
  }

  function getTOC(parent){
    var list = [],
    nodes = findListItems(parent),
    items = Array.prototype.slice.call(nodes),
    length = items.length,
    node;

    if(length === 0) return false;

    items.forEach(function(item){
      var id = item.getAttribute('id') || false,
      content = findAnchorOrSpan(item),
      href = content.getAttribute('href') || '',
      text = content.textContent || "",
      split = href.split("#"),
      baseUrl = split[0],
      subitems = getTOC(item),
      spinePos = spineIndexByURL[baseUrl],
      spineItem = bookSpine[spinePos],
      cfi =   spineItem ? spineItem.cfi : '';

      if(!id) {
        if(spinePos) {
          spineItem = bookSpine[spinePos];
          id = spineItem.id;
          cfi = spineItem.cfi;
        } else {
          id = 'epubjs-autogen-toc-id-' + (idCounter++);
        }
      }

      item.setAttribute('id', id); // Ensure all elements have an id
      list.push({
        "id": id,
        "href": href,
        "label": text,
        "subitems" : subitems,
        "parent" : parent ? parent.getAttribute('id') : null,
        "cfi" : cfi
      });

    });

    return list;
  }

  return getTOC(navEl);
};

module.exports = Parser;
