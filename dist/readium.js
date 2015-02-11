(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
// https://raw.githubusercontent.com/bramstein/jsizes/master/lib/jquery.sizes.js

/**
 * @preserve JSizes - JQuery plugin v0.33
 *
 * Licensed under the revised BSD License.
 * Copyright 2008-2010 Bram Stein
 * All rights reserved.
 */
var $ = require('jquery')

var num = function (value) {
    return parseInt(value, 10) || 0;
  };

/**
  * Sets or gets the values for min-width, min-height, max-width
  * and max-height.
  */
$.each(['min', 'max'], function (i, name) {
  $.fn[name + 'Size'] = function (value) {
    var width, height;
    if (value) {
      if (value.width !== undefined) {
        this.css(name + '-width', value.width);
      }
      if (value.height !== undefined) {
        this.css(name + '-height', value.height);
      }
    } else {
      width = this.css(name + '-width');
      height = this.css(name + '-height');
      // Apparently:
      //  * Opera returns -1px instead of none
      //  * IE6 returns undefined instead of none
      return {'width': (name === 'max' && (width === undefined || width === 'none' || num(width) === -1) && Number.MAX_VALUE) || num(width), 
          'height': (name === 'max' && (height === undefined || height === 'none' || num(height) === -1) && Number.MAX_VALUE) || num(height)};
    }
    return this;
  };
});

/**
  * Returns whether or not an element is visible.
  */
$.fn.isVisible = function () {
  return this.is(':visible');
};

/**
  * Sets or gets the values for border, margin and padding.
  */
$.each(['border', 'margin', 'padding'], function (i, name) {
  $.fn[name] = function (value) {
    if (value) {
      if (value.top !== undefined) {
        this.css(name + '-top' + (name === 'border' ? '-width' : ''), value.top);
      }
      if (value.bottom !== undefined) {
        this.css(name + '-bottom' + (name === 'border' ? '-width' : ''), value.bottom);
      }
      if (value.left !== undefined) {
        this.css(name + '-left' + (name === 'border' ? '-width' : ''), value.left);
      }
      if (value.right !== undefined) {
        this.css(name + '-right' + (name === 'border' ? '-width' : ''), value.right);
      }
    } else {
      return {top: num(this.css(name + '-top' + (name === 'border' ? '-width' : ''))),
          bottom: num(this.css(name + '-bottom' + (name === 'border' ? '-width' : ''))),
          left: num(this.css(name + '-left' + (name === 'border' ? '-width' : ''))),
          right: num(this.css(name + '-right' + (name === 'border' ? '-width' : '')))};
    }
    return this;
  };
});

},{"jquery":9}],3:[function(require,module,exports){
/*!
 * URI.js - Mutating URLs
 * IPv6 Support
 *
 * Version: 1.14.1
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */

(function (root, factory) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    // Node
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals (root is window)
    root.IPv6 = factory(root);
  }
}(this, function (root) {
  'use strict';

  /*
  var _in = "fe80:0000:0000:0000:0204:61ff:fe9d:f156";
  var _out = IPv6.best(_in);
  var _expected = "fe80::204:61ff:fe9d:f156";

  console.log(_in, _out, _expected, _out === _expected);
  */

  // save current IPv6 variable, if any
  var _IPv6 = root && root.IPv6;

  function bestPresentation(address) {
    // based on:
    // Javascript to test an IPv6 address for proper format, and to
    // present the "best text representation" according to IETF Draft RFC at
    // http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04
    // 8 Feb 2010 Rich Brown, Dartware, LLC
    // Please feel free to use this code as long as you provide a link to
    // http://www.intermapper.com
    // http://intermapper.com/support/tools/IPV6-Validator.aspx
    // http://download.dartware.com/thirdparty/ipv6validator.js

    var _address = address.toLowerCase();
    var segments = _address.split(':');
    var length = segments.length;
    var total = 8;

    // trim colons (:: or ::a:b:c… or …a:b:c::)
    if (segments[0] === '' && segments[1] === '' && segments[2] === '') {
      // must have been ::
      // remove first two items
      segments.shift();
      segments.shift();
    } else if (segments[0] === '' && segments[1] === '') {
      // must have been ::xxxx
      // remove the first item
      segments.shift();
    } else if (segments[length - 1] === '' && segments[length - 2] === '') {
      // must have been xxxx::
      segments.pop();
    }

    length = segments.length;

    // adjust total segments for IPv4 trailer
    if (segments[length - 1].indexOf('.') !== -1) {
      // found a "." which means IPv4
      total = 7;
    }

    // fill empty segments them with "0000"
    var pos;
    for (pos = 0; pos < length; pos++) {
      if (segments[pos] === '') {
        break;
      }
    }

    if (pos < total) {
      segments.splice(pos, 1, '0000');
      while (segments.length < total) {
        segments.splice(pos, 0, '0000');
      }

      length = segments.length;
    }

    // strip leading zeros
    var _segments;
    for (var i = 0; i < total; i++) {
      _segments = segments[i].split('');
      for (var j = 0; j < 3 ; j++) {
        if (_segments[0] === '0' && _segments.length > 1) {
          _segments.splice(0,1);
        } else {
          break;
        }
      }

      segments[i] = _segments.join('');
    }

    // find longest sequence of zeroes and coalesce them into one segment
    var best = -1;
    var _best = 0;
    var _current = 0;
    var current = -1;
    var inzeroes = false;
    // i; already declared

    for (i = 0; i < total; i++) {
      if (inzeroes) {
        if (segments[i] === '0') {
          _current += 1;
        } else {
          inzeroes = false;
          if (_current > _best) {
            best = current;
            _best = _current;
          }
        }
      } else {
        if (segments[i] === '0') {
          inzeroes = true;
          current = i;
          _current = 1;
        }
      }
    }

    if (_current > _best) {
      best = current;
      _best = _current;
    }

    if (_best > 1) {
      segments.splice(best, _best, '');
    }

    length = segments.length;

    // assemble remaining segments
    var result = '';
    if (segments[0] === '')  {
      result = ':';
    }

    for (i = 0; i < length; i++) {
      result += segments[i];
      if (i === length - 1) {
        break;
      }

      result += ':';
    }

    if (segments[length - 1] === '') {
      result += ':';
    }

    return result;
  }

  function noConflict() {
    /*jshint validthis: true */
    if (root.IPv6 === this) {
      root.IPv6 = _IPv6;
    }
  
    return this;
  }

  return {
    best: bestPresentation,
    noConflict: noConflict
  };
}));

},{}],4:[function(require,module,exports){
/*!
 * URI.js - Mutating URLs
 * Second Level Domain (SLD) Support
 *
 * Version: 1.14.1
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */

(function (root, factory) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    // Node
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals (root is window)
    root.SecondLevelDomains = factory(root);
  }
}(this, function (root) {
  'use strict';

  // save current SecondLevelDomains variable, if any
  var _SecondLevelDomains = root && root.SecondLevelDomains;

  var SLD = {
    // list of known Second Level Domains
    // converted list of SLDs from https://github.com/gavingmiller/second-level-domains
    // ----
    // publicsuffix.org is more current and actually used by a couple of browsers internally.
    // downside is it also contains domains like "dyndns.org" - which is fine for the security
    // issues browser have to deal with (SOP for cookies, etc) - but is way overboard for URI.js
    // ----
    list: {
      'ac':' com gov mil net org ',
      'ae':' ac co gov mil name net org pro sch ',
      'af':' com edu gov net org ',
      'al':' com edu gov mil net org ',
      'ao':' co ed gv it og pb ',
      'ar':' com edu gob gov int mil net org tur ',
      'at':' ac co gv or ',
      'au':' asn com csiro edu gov id net org ',
      'ba':' co com edu gov mil net org rs unbi unmo unsa untz unze ',
      'bb':' biz co com edu gov info net org store tv ',
      'bh':' biz cc com edu gov info net org ',
      'bn':' com edu gov net org ',
      'bo':' com edu gob gov int mil net org tv ',
      'br':' adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ',
      'bs':' com edu gov net org ',
      'bz':' du et om ov rg ',
      'ca':' ab bc mb nb nf nl ns nt nu on pe qc sk yk ',
      'ck':' biz co edu gen gov info net org ',
      'cn':' ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ',
      'co':' com edu gov mil net nom org ',
      'cr':' ac c co ed fi go or sa ',
      'cy':' ac biz com ekloges gov ltd name net org parliament press pro tm ',
      'do':' art com edu gob gov mil net org sld web ',
      'dz':' art asso com edu gov net org pol ',
      'ec':' com edu fin gov info med mil net org pro ',
      'eg':' com edu eun gov mil name net org sci ',
      'er':' com edu gov ind mil net org rochest w ',
      'es':' com edu gob nom org ',
      'et':' biz com edu gov info name net org ',
      'fj':' ac biz com info mil name net org pro ',
      'fk':' ac co gov net nom org ',
      'fr':' asso com f gouv nom prd presse tm ',
      'gg':' co net org ',
      'gh':' com edu gov mil org ',
      'gn':' ac com gov net org ',
      'gr':' com edu gov mil net org ',
      'gt':' com edu gob ind mil net org ',
      'gu':' com edu gov net org ',
      'hk':' com edu gov idv net org ',
      'hu':' 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ',
      'id':' ac co go mil net or sch web ',
      'il':' ac co gov idf k12 muni net org ',
      'in':' ac co edu ernet firm gen gov i ind mil net nic org res ',
      'iq':' com edu gov i mil net org ',
      'ir':' ac co dnssec gov i id net org sch ',
      'it':' edu gov ',
      'je':' co net org ',
      'jo':' com edu gov mil name net org sch ',
      'jp':' ac ad co ed go gr lg ne or ',
      'ke':' ac co go info me mobi ne or sc ',
      'kh':' com edu gov mil net org per ',
      'ki':' biz com de edu gov info mob net org tel ',
      'km':' asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ',
      'kn':' edu gov net org ',
      'kr':' ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ',
      'kw':' com edu gov net org ',
      'ky':' com edu gov net org ',
      'kz':' com edu gov mil net org ',
      'lb':' com edu gov net org ',
      'lk':' assn com edu gov grp hotel int ltd net ngo org sch soc web ',
      'lr':' com edu gov net org ',
      'lv':' asn com conf edu gov id mil net org ',
      'ly':' com edu gov id med net org plc sch ',
      'ma':' ac co gov m net org press ',
      'mc':' asso tm ',
      'me':' ac co edu gov its net org priv ',
      'mg':' com edu gov mil nom org prd tm ',
      'mk':' com edu gov inf name net org pro ',
      'ml':' com edu gov net org presse ',
      'mn':' edu gov org ',
      'mo':' com edu gov net org ',
      'mt':' com edu gov net org ',
      'mv':' aero biz com coop edu gov info int mil museum name net org pro ',
      'mw':' ac co com coop edu gov int museum net org ',
      'mx':' com edu gob net org ',
      'my':' com edu gov mil name net org sch ',
      'nf':' arts com firm info net other per rec store web ',
      'ng':' biz com edu gov mil mobi name net org sch ',
      'ni':' ac co com edu gob mil net nom org ',
      'np':' com edu gov mil net org ',
      'nr':' biz com edu gov info net org ',
      'om':' ac biz co com edu gov med mil museum net org pro sch ',
      'pe':' com edu gob mil net nom org sld ',
      'ph':' com edu gov i mil net ngo org ',
      'pk':' biz com edu fam gob gok gon gop gos gov net org web ',
      'pl':' art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ',
      'pr':' ac biz com edu est gov info isla name net org pro prof ',
      'ps':' com edu gov net org plo sec ',
      'pw':' belau co ed go ne or ',
      'ro':' arts com firm info nom nt org rec store tm www ',
      'rs':' ac co edu gov in org ',
      'sb':' com edu gov net org ',
      'sc':' com edu gov net org ',
      'sh':' co com edu gov net nom org ',
      'sl':' com edu gov net org ',
      'st':' co com consulado edu embaixada gov mil net org principe saotome store ',
      'sv':' com edu gob org red ',
      'sz':' ac co org ',
      'tr':' av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ',
      'tt':' aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ',
      'tw':' club com ebiz edu game gov idv mil net org ',
      'mu':' ac co com gov net or org ',
      'mz':' ac co edu gov org ',
      'na':' co com ',
      'nz':' ac co cri geek gen govt health iwi maori mil net org parliament school ',
      'pa':' abo ac com edu gob ing med net nom org sld ',
      'pt':' com edu gov int net nome org publ ',
      'py':' com edu gov mil net org ',
      'qa':' com edu gov mil net org ',
      're':' asso com nom ',
      'ru':' ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ',
      'rw':' ac co com edu gouv gov int mil net ',
      'sa':' com edu gov med net org pub sch ',
      'sd':' com edu gov info med net org tv ',
      'se':' a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ',
      'sg':' com edu gov idn net org per ',
      'sn':' art com edu gouv org perso univ ',
      'sy':' com edu gov mil net news org ',
      'th':' ac co go in mi net or ',
      'tj':' ac biz co com edu go gov info int mil name net nic org test web ',
      'tn':' agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ',
      'tz':' ac co go ne or ',
      'ua':' biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ',
      'ug':' ac co go ne or org sc ',
      'uk':' ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ',
      'us':' dni fed isa kids nsn ',
      'uy':' com edu gub mil net org ',
      've':' co com edu gob info mil net org web ',
      'vi':' co com k12 net org ',
      'vn':' ac biz com edu gov health info int name net org pro ',
      'ye':' co com gov ltd me net org plc ',
      'yu':' ac co edu gov org ',
      'za':' ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ',
      'zm':' ac co com edu gov net org sch '
    },
    // gorhill 2013-10-25: Using indexOf() instead Regexp(). Significant boost
    // in both performance and memory footprint. No initialization required.
    // http://jsperf.com/uri-js-sld-regex-vs-binary-search/4
    // Following methods use lastIndexOf() rather than array.split() in order
    // to avoid any memory allocations.
    has: function(domain) {
      var tldOffset = domain.lastIndexOf('.');
      if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
        return false;
      }
      var sldOffset = domain.lastIndexOf('.', tldOffset-1);
      if (sldOffset <= 0 || sldOffset >= (tldOffset-1)) {
        return false;
      }
      var sldList = SLD.list[domain.slice(tldOffset+1)];
      if (!sldList) {
        return false;
      }
      return sldList.indexOf(' ' + domain.slice(sldOffset+1, tldOffset) + ' ') >= 0;
    },
    is: function(domain) {
      var tldOffset = domain.lastIndexOf('.');
      if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
        return false;
      }
      var sldOffset = domain.lastIndexOf('.', tldOffset-1);
      if (sldOffset >= 0) {
        return false;
      }
      var sldList = SLD.list[domain.slice(tldOffset+1)];
      if (!sldList) {
        return false;
      }
      return sldList.indexOf(' ' + domain.slice(0, tldOffset) + ' ') >= 0;
    },
    get: function(domain) {
      var tldOffset = domain.lastIndexOf('.');
      if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
        return null;
      }
      var sldOffset = domain.lastIndexOf('.', tldOffset-1);
      if (sldOffset <= 0 || sldOffset >= (tldOffset-1)) {
        return null;
      }
      var sldList = SLD.list[domain.slice(tldOffset+1)];
      if (!sldList) {
        return null;
      }
      if (sldList.indexOf(' ' + domain.slice(sldOffset+1, tldOffset) + ' ') < 0) {
        return null;
      }
      return domain.slice(sldOffset+1);
    },
    noConflict: function(){
      if (root.SecondLevelDomains === this) {
        root.SecondLevelDomains = _SecondLevelDomains;
      }
      return this;
    }
  };

  return SLD;
}));

},{}],5:[function(require,module,exports){
/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.14.1
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */
(function (root, factory) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    // Node
    module.exports = factory(require('./punycode'), require('./IPv6'), require('./SecondLevelDomains'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['./punycode', './IPv6', './SecondLevelDomains'], factory);
  } else {
    // Browser globals (root is window)
    root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
  }
}(this, function (punycode, IPv6, SLD, root) {
  'use strict';
  /*global location, escape, unescape */
  // FIXME: v2.0.0 renamce non-camelCase properties to uppercase
  /*jshint camelcase: false */

  // save current URI variable, if any
  var _URI = root && root.URI;

  function URI(url, base) {
    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URI)) {
      return new URI(url, base);
    }

    if (url === undefined) {
      if (typeof location !== 'undefined') {
        url = location.href + '';
      } else {
        url = '';
      }
    }

    this.href(url);

    // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
    if (base !== undefined) {
      return this.absoluteTo(base);
    }

    return this;
  }

  URI.version = '1.14.1';

  var p = URI.prototype;
  var hasOwn = Object.prototype.hasOwnProperty;

  function escapeRegEx(string) {
    // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }

  function getType(value) {
    // IE8 doesn't return [Object Undefined] but [Object Object] for undefined value
    if (value === undefined) {
      return 'Undefined';
    }

    return String(Object.prototype.toString.call(value)).slice(8, -1);
  }

  function isArray(obj) {
    return getType(obj) === 'Array';
  }

  function filterArrayValues(data, value) {
    var lookup = {};
    var i, length;

    if (isArray(value)) {
      for (i = 0, length = value.length; i < length; i++) {
        lookup[value[i]] = true;
      }
    } else {
      lookup[value] = true;
    }

    for (i = 0, length = data.length; i < length; i++) {
      if (lookup[data[i]] !== undefined) {
        data.splice(i, 1);
        length--;
        i--;
      }
    }

    return data;
  }

  function arrayContains(list, value) {
    var i, length;

    // value may be string, number, array, regexp
    if (isArray(value)) {
      // Note: this can be optimized to O(n) (instead of current O(m * n))
      for (i = 0, length = value.length; i < length; i++) {
        if (!arrayContains(list, value[i])) {
          return false;
        }
      }

      return true;
    }

    var _type = getType(value);
    for (i = 0, length = list.length; i < length; i++) {
      if (_type === 'RegExp') {
        if (typeof list[i] === 'string' && list[i].match(value)) {
          return true;
        }
      } else if (list[i] === value) {
        return true;
      }
    }

    return false;
  }

  function arraysEqual(one, two) {
    if (!isArray(one) || !isArray(two)) {
      return false;
    }

    // arrays can't be equal if they have different amount of content
    if (one.length !== two.length) {
      return false;
    }

    one.sort();
    two.sort();

    for (var i = 0, l = one.length; i < l; i++) {
      if (one[i] !== two[i]) {
        return false;
      }
    }

    return true;
  }

  URI._parts = function() {
    return {
      protocol: null,
      username: null,
      password: null,
      hostname: null,
      urn: null,
      port: null,
      path: null,
      query: null,
      fragment: null,
      // state
      duplicateQueryParameters: URI.duplicateQueryParameters,
      escapeQuerySpace: URI.escapeQuerySpace
    };
  };
  // state: allow duplicate query parameters (a=1&a=1)
  URI.duplicateQueryParameters = false;
  // state: replaces + with %20 (space in query strings)
  URI.escapeQuerySpace = true;
  // static properties
  URI.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
  URI.idn_expression = /[^a-z0-9\.-]/i;
  URI.punycode_expression = /(xn--)/i;
  // well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
  URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  // credits to Rich Brown
  // source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
  // specification: http://www.ietf.org/rfc/rfc4291.txt
  URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
  // expression used is "gruber revised" (@gruber v2) determined to be the
  // best solution in a regex-golf we did a couple of ages ago at
  // * http://mathiasbynens.be/demo/url-regex
  // * http://rodneyrehm.de/t/url-regex.html
  URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
  URI.findUri = {
    // valid "scheme://" or "www."
    start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
    // everything up to the next whitespace
    end: /[\s\r\n]|$/,
    // trim trailing punctuation captured by end RegExp
    trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/
  };
  // http://www.iana.org/assignments/uri-schemes.html
  // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
  URI.defaultPorts = {
    http: '80',
    https: '443',
    ftp: '21',
    gopher: '70',
    ws: '80',
    wss: '443'
  };
  // allowed hostname characters according to RFC 3986
  // ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
  // I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . -
  URI.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/;
  // map DOM Elements to their URI attribute
  URI.domAttributes = {
    'a': 'href',
    'blockquote': 'cite',
    'link': 'href',
    'base': 'href',
    'script': 'src',
    'form': 'action',
    'img': 'src',
    'area': 'href',
    'iframe': 'src',
    'embed': 'src',
    'source': 'src',
    'track': 'src',
    'input': 'src', // but only if type="image"
    'audio': 'src',
    'video': 'src'
  };
  URI.getDomAttribute = function(node) {
    if (!node || !node.nodeName) {
      return undefined;
    }

    var nodeName = node.nodeName.toLowerCase();
    // <input> should only expose src for type="image"
    if (nodeName === 'input' && node.type !== 'image') {
      return undefined;
    }

    return URI.domAttributes[nodeName];
  };

  function escapeForDumbFirefox36(value) {
    // https://github.com/medialize/URI.js/issues/91
    return escape(value);
  }

  // encoding / decoding according to RFC3986
  function strictEncodeURIComponent(string) {
    // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
    return encodeURIComponent(string)
      .replace(/[!'()*]/g, escapeForDumbFirefox36)
      .replace(/\*/g, '%2A');
  }
  URI.encode = strictEncodeURIComponent;
  URI.decode = decodeURIComponent;
  URI.iso8859 = function() {
    URI.encode = escape;
    URI.decode = unescape;
  };
  URI.unicode = function() {
    URI.encode = strictEncodeURIComponent;
    URI.decode = decodeURIComponent;
  };
  URI.characters = {
    pathname: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
        map: {
          // -._~!'()*
          '%24': '$',
          '%26': '&',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%3A': ':',
          '%40': '@'
        }
      },
      decode: {
        expression: /[\/\?#]/g,
        map: {
          '/': '%2F',
          '?': '%3F',
          '#': '%23'
        }
      }
    },
    reserved: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
        map: {
          // gen-delims
          '%3A': ':',
          '%2F': '/',
          '%3F': '?',
          '%23': '#',
          '%5B': '[',
          '%5D': ']',
          '%40': '@',
          // sub-delims
          '%21': '!',
          '%24': '$',
          '%26': '&',
          '%27': '\'',
          '%28': '(',
          '%29': ')',
          '%2A': '*',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '='
        }
      }
    }
  };
  URI.encodeQuery = function(string, escapeQuerySpace) {
    var escaped = URI.encode(string + '');
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URI.escapeQuerySpace;
    }

    return escapeQuerySpace ? escaped.replace(/%20/g, '+') : escaped;
  };
  URI.decodeQuery = function(string, escapeQuerySpace) {
    string += '';
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URI.escapeQuerySpace;
    }

    try {
      return URI.decode(escapeQuerySpace ? string.replace(/\+/g, '%20') : string);
    } catch(e) {
      // we're not going to mess with weird encodings,
      // give up and return the undecoded original string
      // see https://github.com/medialize/URI.js/issues/87
      // see https://github.com/medialize/URI.js/issues/92
      return string;
    }
  };
  URI.recodePath = function(string) {
    var segments = (string + '').split('/');
    for (var i = 0, length = segments.length; i < length; i++) {
      segments[i] = URI.encodePathSegment(URI.decode(segments[i]));
    }

    return segments.join('/');
  };
  URI.decodePath = function(string) {
    var segments = (string + '').split('/');
    for (var i = 0, length = segments.length; i < length; i++) {
      segments[i] = URI.decodePathSegment(segments[i]);
    }

    return segments.join('/');
  };
  // generate encode/decode path functions
  var _parts = {'encode':'encode', 'decode':'decode'};
  var _part;
  var generateAccessor = function(_group, _part) {
    return function(string) {
      try {
        return URI[_part](string + '').replace(URI.characters[_group][_part].expression, function(c) {
          return URI.characters[_group][_part].map[c];
        });
      } catch (e) {
        // we're not going to mess with weird encodings,
        // give up and return the undecoded original string
        // see https://github.com/medialize/URI.js/issues/87
        // see https://github.com/medialize/URI.js/issues/92
        return string;
      }
    };
  };

  for (_part in _parts) {
    URI[_part + 'PathSegment'] = generateAccessor('pathname', _parts[_part]);
  }

  URI.encodeReserved = generateAccessor('reserved', 'encode');

  URI.parse = function(string, parts) {
    var pos;
    if (!parts) {
      parts = {};
    }
    // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]

    // extract fragment
    pos = string.indexOf('#');
    if (pos > -1) {
      // escaping?
      parts.fragment = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }

    // extract query
    pos = string.indexOf('?');
    if (pos > -1) {
      // escaping?
      parts.query = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }

    // extract protocol
    if (string.substring(0, 2) === '//') {
      // relative-scheme
      parts.protocol = null;
      string = string.substring(2);
      // extract "user:pass@host:port"
      string = URI.parseAuthority(string, parts);
    } else {
      pos = string.indexOf(':');
      if (pos > -1) {
        parts.protocol = string.substring(0, pos) || null;
        if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
          // : may be within the path
          parts.protocol = undefined;
        } else if (string.substring(pos + 1, pos + 3) === '//') {
          string = string.substring(pos + 3);

          // extract "user:pass@host:port"
          string = URI.parseAuthority(string, parts);
        } else {
          string = string.substring(pos + 1);
          parts.urn = true;
        }
      }
    }

    // what's left must be the path
    parts.path = string;

    // and we're done
    return parts;
  };
  URI.parseHost = function(string, parts) {
    // extract host:port
    var pos = string.indexOf('/');
    var bracketPos;
    var t;

    if (pos === -1) {
      pos = string.length;
    }

    if (string.charAt(0) === '[') {
      // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
      // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
      // IPv6+port in the format [2001:db8::1]:80 (for the time being)
      bracketPos = string.indexOf(']');
      parts.hostname = string.substring(1, bracketPos) || null;
      parts.port = string.substring(bracketPos + 2, pos) || null;
      if (parts.port === '/') {
        parts.port = null;
      }
    } else if (string.indexOf(':') !== string.lastIndexOf(':')) {
      // IPv6 host contains multiple colons - but no port
      // this notation is actually not allowed by RFC 3986, but we're a liberal parser
      parts.hostname = string.substring(0, pos) || null;
      parts.port = null;
    } else {
      t = string.substring(0, pos).split(':');
      parts.hostname = t[0] || null;
      parts.port = t[1] || null;
    }

    if (parts.hostname && string.substring(pos).charAt(0) !== '/') {
      pos++;
      string = '/' + string;
    }

    return string.substring(pos) || '/';
  };
  URI.parseAuthority = function(string, parts) {
    string = URI.parseUserinfo(string, parts);
    return URI.parseHost(string, parts);
  };
  URI.parseUserinfo = function(string, parts) {
    // extract username:password
    var firstSlash = string.indexOf('/');
    var pos = string.lastIndexOf('@', firstSlash > -1 ? firstSlash : string.length - 1);
    var t;

    // authority@ must come before /path
    if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
      t = string.substring(0, pos).split(':');
      parts.username = t[0] ? URI.decode(t[0]) : null;
      t.shift();
      parts.password = t[0] ? URI.decode(t.join(':')) : null;
      string = string.substring(pos + 1);
    } else {
      parts.username = null;
      parts.password = null;
    }

    return string;
  };
  URI.parseQuery = function(string, escapeQuerySpace) {
    if (!string) {
      return {};
    }

    // throw out the funky business - "?"[name"="value"&"]+
    string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');

    if (!string) {
      return {};
    }

    var items = {};
    var splits = string.split('&');
    var length = splits.length;
    var v, name, value;

    for (var i = 0; i < length; i++) {
      v = splits[i].split('=');
      name = URI.decodeQuery(v.shift(), escapeQuerySpace);
      // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
      value = v.length ? URI.decodeQuery(v.join('='), escapeQuerySpace) : null;

      if (hasOwn.call(items, name)) {
        if (typeof items[name] === 'string') {
          items[name] = [items[name]];
        }

        items[name].push(value);
      } else {
        items[name] = value;
      }
    }

    return items;
  };

  URI.build = function(parts) {
    var t = '';

    if (parts.protocol) {
      t += parts.protocol + ':';
    }

    if (!parts.urn && (t || parts.hostname)) {
      t += '//';
    }

    t += (URI.buildAuthority(parts) || '');

    if (typeof parts.path === 'string') {
      if (parts.path.charAt(0) !== '/' && typeof parts.hostname === 'string') {
        t += '/';
      }

      t += parts.path;
    }

    if (typeof parts.query === 'string' && parts.query) {
      t += '?' + parts.query;
    }

    if (typeof parts.fragment === 'string' && parts.fragment) {
      t += '#' + parts.fragment;
    }
    return t;
  };
  URI.buildHost = function(parts) {
    var t = '';

    if (!parts.hostname) {
      return '';
    } else if (URI.ip6_expression.test(parts.hostname)) {
      t += '[' + parts.hostname + ']';
    } else {
      t += parts.hostname;
    }

    if (parts.port) {
      t += ':' + parts.port;
    }

    return t;
  };
  URI.buildAuthority = function(parts) {
    return URI.buildUserinfo(parts) + URI.buildHost(parts);
  };
  URI.buildUserinfo = function(parts) {
    var t = '';

    if (parts.username) {
      t += URI.encode(parts.username);

      if (parts.password) {
        t += ':' + URI.encode(parts.password);
      }

      t += '@';
    }

    return t;
  };
  URI.buildQuery = function(data, duplicateQueryParameters, escapeQuerySpace) {
    // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
    // being »-._~!$&'()*+,;=:@/?« %HEX and alnum are allowed
    // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
    // URI.js treats the query string as being application/x-www-form-urlencoded
    // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type

    var t = '';
    var unique, key, i, length;
    for (key in data) {
      if (hasOwn.call(data, key) && key) {
        if (isArray(data[key])) {
          unique = {};
          for (i = 0, length = data[key].length; i < length; i++) {
            if (data[key][i] !== undefined && unique[data[key][i] + ''] === undefined) {
              t += '&' + URI.buildQueryParameter(key, data[key][i], escapeQuerySpace);
              if (duplicateQueryParameters !== true) {
                unique[data[key][i] + ''] = true;
              }
            }
          }
        } else if (data[key] !== undefined) {
          t += '&' + URI.buildQueryParameter(key, data[key], escapeQuerySpace);
        }
      }
    }

    return t.substring(1);
  };
  URI.buildQueryParameter = function(name, value, escapeQuerySpace) {
    // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
    // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
    return URI.encodeQuery(name, escapeQuerySpace) + (value !== null ? '=' + URI.encodeQuery(value, escapeQuerySpace) : '');
  };

  URI.addQuery = function(data, name, value) {
    if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          URI.addQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (data[name] === undefined) {
        data[name] = value;
        return;
      } else if (typeof data[name] === 'string') {
        data[name] = [data[name]];
      }

      if (!isArray(value)) {
        value = [value];
      }

      data[name] = (data[name] || []).concat(value);
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
    }
  };
  URI.removeQuery = function(data, name, value) {
    var i, length, key;

    if (isArray(name)) {
      for (i = 0, length = name.length; i < length; i++) {
        data[name[i]] = undefined;
      }
    } else if (typeof name === 'object') {
      for (key in name) {
        if (hasOwn.call(name, key)) {
          URI.removeQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (value !== undefined) {
        if (data[name] === value) {
          data[name] = undefined;
        } else if (isArray(data[name])) {
          data[name] = filterArrayValues(data[name], value);
        }
      } else {
        data[name] = undefined;
      }
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the first parameter');
    }
  };
  URI.hasQuery = function(data, name, value, withinArray) {
    if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          if (!URI.hasQuery(data, key, name[key])) {
            return false;
          }
        }
      }

      return true;
    } else if (typeof name !== 'string') {
      throw new TypeError('URI.hasQuery() accepts an object, string as the name parameter');
    }

    switch (getType(value)) {
      case 'Undefined':
        // true if exists (but may be empty)
        return name in data; // data[name] !== undefined;

      case 'Boolean':
        // true if exists and non-empty
        var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);
        return value === _booly;

      case 'Function':
        // allow complex comparison
        return !!value(data[name], name, data);

      case 'Array':
        if (!isArray(data[name])) {
          return false;
        }

        var op = withinArray ? arrayContains : arraysEqual;
        return op(data[name], value);

      case 'RegExp':
        if (!isArray(data[name])) {
          return Boolean(data[name] && data[name].match(value));
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name], value);

      case 'Number':
        value = String(value);
        /* falls through */
      case 'String':
        if (!isArray(data[name])) {
          return data[name] === value;
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name], value);

      default:
        throw new TypeError('URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter');
    }
  };


  URI.commonPath = function(one, two) {
    var length = Math.min(one.length, two.length);
    var pos;

    // find first non-matching character
    for (pos = 0; pos < length; pos++) {
      if (one.charAt(pos) !== two.charAt(pos)) {
        pos--;
        break;
      }
    }

    if (pos < 1) {
      return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
    }

    // revert to last /
    if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
      pos = one.substring(0, pos).lastIndexOf('/');
    }

    return one.substring(0, pos + 1);
  };

  URI.withinString = function(string, callback, options) {
    options || (options = {});
    var _start = options.start || URI.findUri.start;
    var _end = options.end || URI.findUri.end;
    var _trim = options.trim || URI.findUri.trim;
    var _attributeOpen = /[a-z0-9-]=["']?$/i;

    _start.lastIndex = 0;
    while (true) {
      var match = _start.exec(string);
      if (!match) {
        break;
      }

      var start = match.index;
      if (options.ignoreHtml) {
        // attribut(e=["']?$)
        var attributeOpen = string.slice(Math.max(start - 3, 0), start);
        if (attributeOpen && _attributeOpen.test(attributeOpen)) {
          continue;
        }
      }

      var end = start + string.slice(start).search(_end);
      var slice = string.slice(start, end).replace(_trim, '');
      if (options.ignore && options.ignore.test(slice)) {
        continue;
      }

      end = start + slice.length;
      var result = callback(slice, start, end, string);
      string = string.slice(0, start) + result + string.slice(end);
      _start.lastIndex = start + result.length;
    }

    _start.lastIndex = 0;
    return string;
  };

  URI.ensureValidHostname = function(v) {
    // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
    // they are not part of DNS and therefore ignored by URI.js

    if (v.match(URI.invalid_hostname_characters)) {
      // test punycode
      if (!punycode) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-] and Punycode.js is not available');
      }

      if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }
    }
  };

  // noConflict
  URI.noConflict = function(removeAll) {
    if (removeAll) {
      var unconflicted = {
        URI: this.noConflict()
      };

      if (root.URITemplate && typeof root.URITemplate.noConflict === 'function') {
        unconflicted.URITemplate = root.URITemplate.noConflict();
      }

      if (root.IPv6 && typeof root.IPv6.noConflict === 'function') {
        unconflicted.IPv6 = root.IPv6.noConflict();
      }

      if (root.SecondLevelDomains && typeof root.SecondLevelDomains.noConflict === 'function') {
        unconflicted.SecondLevelDomains = root.SecondLevelDomains.noConflict();
      }

      return unconflicted;
    } else if (root.URI === this) {
      root.URI = _URI;
    }

    return this;
  };

  p.build = function(deferBuild) {
    if (deferBuild === true) {
      this._deferred_build = true;
    } else if (deferBuild === undefined || this._deferred_build) {
      this._string = URI.build(this._parts);
      this._deferred_build = false;
    }

    return this;
  };

  p.clone = function() {
    return new URI(this);
  };

  p.valueOf = p.toString = function() {
    return this.build(false)._string;
  };


  function generateSimpleAccessor(_part){
    return function(v, build) {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        this._parts[_part] = v || null;
        this.build(!build);
        return this;
      }
    };
  }

  function generatePrefixAccessor(_part, _key){
    return function(v, build) {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        if (v !== null) {
          v = v + '';
          if (v.charAt(0) === _key) {
            v = v.substring(1);
          }
        }

        this._parts[_part] = v;
        this.build(!build);
        return this;
      }
    };
  }

  p.protocol = generateSimpleAccessor('protocol');
  p.username = generateSimpleAccessor('username');
  p.password = generateSimpleAccessor('password');
  p.hostname = generateSimpleAccessor('hostname');
  p.port = generateSimpleAccessor('port');
  p.query = generatePrefixAccessor('query', '?');
  p.fragment = generatePrefixAccessor('fragment', '#');

  p.search = function(v, build) {
    var t = this.query(v, build);
    return typeof t === 'string' && t.length ? ('?' + t) : t;
  };
  p.hash = function(v, build) {
    var t = this.fragment(v, build);
    return typeof t === 'string' && t.length ? ('#' + t) : t;
  };

  p.pathname = function(v, build) {
    if (v === undefined || v === true) {
      var res = this._parts.path || (this._parts.hostname ? '/' : '');
      return v ? URI.decodePath(res) : res;
    } else {
      this._parts.path = v ? URI.recodePath(v) : '/';
      this.build(!build);
      return this;
    }
  };
  p.path = p.pathname;
  p.href = function(href, build) {
    var key;

    if (href === undefined) {
      return this.toString();
    }

    this._string = '';
    this._parts = URI._parts();

    var _URI = href instanceof URI;
    var _object = typeof href === 'object' && (href.hostname || href.path || href.pathname);
    if (href.nodeName) {
      var attribute = URI.getDomAttribute(href);
      href = href[attribute] || '';
      _object = false;
    }

    // window.location is reported to be an object, but it's not the sort
    // of object we're looking for:
    // * location.protocol ends with a colon
    // * location.query != object.search
    // * location.hash != object.fragment
    // simply serializing the unknown object should do the trick
    // (for location, not for everything...)
    if (!_URI && _object && href.pathname !== undefined) {
      href = href.toString();
    }

    if (typeof href === 'string' || href instanceof String) {
      this._parts = URI.parse(String(href), this._parts);
    } else if (_URI || _object) {
      var src = _URI ? href._parts : href;
      for (key in src) {
        if (hasOwn.call(this._parts, key)) {
          this._parts[key] = src[key];
        }
      }
    } else {
      throw new TypeError('invalid input');
    }

    this.build(!build);
    return this;
  };

  // identification accessors
  p.is = function(what) {
    var ip = false;
    var ip4 = false;
    var ip6 = false;
    var name = false;
    var sld = false;
    var idn = false;
    var punycode = false;
    var relative = !this._parts.urn;

    if (this._parts.hostname) {
      relative = false;
      ip4 = URI.ip4_expression.test(this._parts.hostname);
      ip6 = URI.ip6_expression.test(this._parts.hostname);
      ip = ip4 || ip6;
      name = !ip;
      sld = name && SLD && SLD.has(this._parts.hostname);
      idn = name && URI.idn_expression.test(this._parts.hostname);
      punycode = name && URI.punycode_expression.test(this._parts.hostname);
    }

    switch (what.toLowerCase()) {
      case 'relative':
        return relative;

      case 'absolute':
        return !relative;

      // hostname identification
      case 'domain':
      case 'name':
        return name;

      case 'sld':
        return sld;

      case 'ip':
        return ip;

      case 'ip4':
      case 'ipv4':
      case 'inet4':
        return ip4;

      case 'ip6':
      case 'ipv6':
      case 'inet6':
        return ip6;

      case 'idn':
        return idn;

      case 'url':
        return !this._parts.urn;

      case 'urn':
        return !!this._parts.urn;

      case 'punycode':
        return punycode;
    }

    return null;
  };

  // component specific input validation
  var _protocol = p.protocol;
  var _port = p.port;
  var _hostname = p.hostname;

  p.protocol = function(v, build) {
    if (v !== undefined) {
      if (v) {
        // accept trailing ://
        v = v.replace(/:(\/\/)?$/, '');

        if (!v.match(URI.protocol_expression)) {
          throw new TypeError('Protocol "' + v + '" contains characters other than [A-Z0-9.+-] or doesn\'t start with [A-Z]');
        }
      }
    }
    return _protocol.call(this, v, build);
  };
  p.scheme = p.protocol;
  p.port = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      if (v === 0) {
        v = null;
      }

      if (v) {
        v += '';
        if (v.charAt(0) === ':') {
          v = v.substring(1);
        }

        if (v.match(/[^0-9]/)) {
          throw new TypeError('Port "' + v + '" contains characters other than [0-9]');
        }
      }
    }
    return _port.call(this, v, build);
  };
  p.hostname = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      var x = {};
      URI.parseHost(v, x);
      v = x.hostname;
    }
    return _hostname.call(this, v, build);
  };

  // compound accessors
  p.host = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URI.buildHost(this._parts) : '';
    } else {
      URI.parseHost(v, this._parts);
      this.build(!build);
      return this;
    }
  };
  p.authority = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URI.buildAuthority(this._parts) : '';
    } else {
      URI.parseAuthority(v, this._parts);
      this.build(!build);
      return this;
    }
  };
  p.userinfo = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      if (!this._parts.username) {
        return '';
      }

      var t = URI.buildUserinfo(this._parts);
      return t.substring(0, t.length -1);
    } else {
      if (v[v.length-1] !== '@') {
        v += '@';
      }

      URI.parseUserinfo(v, this._parts);
      this.build(!build);
      return this;
    }
  };
  p.resource = function(v, build) {
    var parts;

    if (v === undefined) {
      return this.path() + this.search() + this.hash();
    }

    parts = URI.parse(v);
    this._parts.path = parts.path;
    this._parts.query = parts.query;
    this._parts.fragment = parts.fragment;
    this.build(!build);
    return this;
  };

  // fraction accessors
  p.subdomain = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    // convenience, return "www" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      // grab domain and add another segment
      var end = this._parts.hostname.length - this.domain().length - 1;
      return this._parts.hostname.substring(0, end) || '';
    } else {
      var e = this._parts.hostname.length - this.domain().length;
      var sub = this._parts.hostname.substring(0, e);
      var replace = new RegExp('^' + escapeRegEx(sub));

      if (v && v.charAt(v.length - 1) !== '.') {
        v += '.';
      }

      if (v) {
        URI.ensureValidHostname(v);
      }

      this._parts.hostname = this._parts.hostname.replace(replace, v);
      this.build(!build);
      return this;
    }
  };
  p.domain = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }

    // convenience, return "example.org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      // if hostname consists of 1 or 2 segments, it must be the domain
      var t = this._parts.hostname.match(/\./g);
      if (t && t.length < 2) {
        return this._parts.hostname;
      }

      // grab tld and add another segment
      var end = this._parts.hostname.length - this.tld(build).length - 1;
      end = this._parts.hostname.lastIndexOf('.', end -1) + 1;
      return this._parts.hostname.substring(end) || '';
    } else {
      if (!v) {
        throw new TypeError('cannot set domain empty');
      }

      URI.ensureValidHostname(v);

      if (!this._parts.hostname || this.is('IP')) {
        this._parts.hostname = v;
      } else {
        var replace = new RegExp(escapeRegEx(this.domain()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.tld = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }

    // return "org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      var pos = this._parts.hostname.lastIndexOf('.');
      var tld = this._parts.hostname.substring(pos + 1);

      if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
        return SLD.get(this._parts.hostname) || tld;
      }

      return tld;
    } else {
      var replace;

      if (!v) {
        throw new TypeError('cannot set TLD empty');
      } else if (v.match(/[^a-zA-Z0-9-]/)) {
        if (SLD && SLD.is(v)) {
          replace = new RegExp(escapeRegEx(this.tld()) + '$');
          this._parts.hostname = this._parts.hostname.replace(replace, v);
        } else {
          throw new TypeError('TLD "' + v + '" contains characters other than [A-Z0-9]');
        }
      } else if (!this._parts.hostname || this.is('IP')) {
        throw new ReferenceError('cannot set TLD on non-domain host');
      } else {
        replace = new RegExp(escapeRegEx(this.tld()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.directory = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path && !this._parts.hostname) {
        return '';
      }

      if (this._parts.path === '/') {
        return '/';
      }

      var end = this._parts.path.length - this.filename().length - 1;
      var res = this._parts.path.substring(0, end) || (this._parts.hostname ? '/' : '');

      return v ? URI.decodePath(res) : res;

    } else {
      var e = this._parts.path.length - this.filename().length;
      var directory = this._parts.path.substring(0, e);
      var replace = new RegExp('^' + escapeRegEx(directory));

      // fully qualifier directories begin with a slash
      if (!this.is('relative')) {
        if (!v) {
          v = '/';
        }

        if (v.charAt(0) !== '/') {
          v = '/' + v;
        }
      }

      // directories always end with a slash
      if (v && v.charAt(v.length - 1) !== '/') {
        v += '/';
      }

      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);
      this.build(!build);
      return this;
    }
  };
  p.filename = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      var pos = this._parts.path.lastIndexOf('/');
      var res = this._parts.path.substring(pos+1);

      return v ? URI.decodePathSegment(res) : res;
    } else {
      var mutatedDirectory = false;

      if (v.charAt(0) === '/') {
        v = v.substring(1);
      }

      if (v.match(/\.?\//)) {
        mutatedDirectory = true;
      }

      var replace = new RegExp(escapeRegEx(this.filename()) + '$');
      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);

      if (mutatedDirectory) {
        this.normalizePath(build);
      } else {
        this.build(!build);
      }

      return this;
    }
  };
  p.suffix = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      var filename = this.filename();
      var pos = filename.lastIndexOf('.');
      var s, res;

      if (pos === -1) {
        return '';
      }

      // suffix may only contain alnum characters (yup, I made this up.)
      s = filename.substring(pos+1);
      res = (/^[a-z0-9%]+$/i).test(s) ? s : '';
      return v ? URI.decodePathSegment(res) : res;
    } else {
      if (v.charAt(0) === '.') {
        v = v.substring(1);
      }

      var suffix = this.suffix();
      var replace;

      if (!suffix) {
        if (!v) {
          return this;
        }

        this._parts.path += '.' + URI.recodePath(v);
      } else if (!v) {
        replace = new RegExp(escapeRegEx('.' + suffix) + '$');
      } else {
        replace = new RegExp(escapeRegEx(suffix) + '$');
      }

      if (replace) {
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.segment = function(segment, v, build) {
    var separator = this._parts.urn ? ':' : '/';
    var path = this.path();
    var absolute = path.substring(0, 1) === '/';
    var segments = path.split(separator);

    if (segment !== undefined && typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (segment !== undefined && typeof segment !== 'number') {
      throw new Error('Bad segment "' + segment + '", must be 0-based integer');
    }

    if (absolute) {
      segments.shift();
    }

    if (segment < 0) {
      // allow negative indexes to address from the end
      segment = Math.max(segments.length + segment, 0);
    }

    if (v === undefined) {
      /*jshint laxbreak: true */
      return segment === undefined
        ? segments
        : segments[segment];
      /*jshint laxbreak: false */
    } else if (segment === null || segments[segment] === undefined) {
      if (isArray(v)) {
        segments = [];
        // collapse empty elements within array
        for (var i=0, l=v.length; i < l; i++) {
          if (!v[i].length && (!segments.length || !segments[segments.length -1].length)) {
            continue;
          }

          if (segments.length && !segments[segments.length -1].length) {
            segments.pop();
          }

          segments.push(v[i]);
        }
      } else if (v || typeof v === 'string') {
        if (segments[segments.length -1] === '') {
          // empty trailing elements have to be overwritten
          // to prevent results such as /foo//bar
          segments[segments.length -1] = v;
        } else {
          segments.push(v);
        }
      }
    } else {
      if (v) {
        segments[segment] = v;
      } else {
        segments.splice(segment, 1);
      }
    }

    if (absolute) {
      segments.unshift('');
    }

    return this.path(segments.join(separator), build);
  };
  p.segmentCoded = function(segment, v, build) {
    var segments, i, l;

    if (typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (v === undefined) {
      segments = this.segment(segment, v, build);
      if (!isArray(segments)) {
        segments = segments !== undefined ? URI.decode(segments) : undefined;
      } else {
        for (i = 0, l = segments.length; i < l; i++) {
          segments[i] = URI.decode(segments[i]);
        }
      }

      return segments;
    }

    if (!isArray(v)) {
      v = (typeof v === 'string' || v instanceof String) ? URI.encode(v) : v;
    } else {
      for (i = 0, l = v.length; i < l; i++) {
        v[i] = URI.decode(v[i]);
      }
    }

    return this.segment(segment, v, build);
  };

  // mutating query string
  var q = p.query;
  p.query = function(v, build) {
    if (v === true) {
      return URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    } else if (typeof v === 'function') {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      var result = v.call(this, data);
      this._parts.query = URI.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else if (v !== undefined && typeof v !== 'string') {
      this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else {
      return q.call(this, v, build);
    }
  };
  p.setQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);

    if (typeof name === 'string' || name instanceof String) {
      data[name] = value !== undefined ? value : null;
    } else if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          data[key] = name[key];
        }
      }
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
    }

    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.addQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.addQuery(data, name, value === undefined ? null : value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.removeQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.removeQuery(data, name, value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.hasQuery = function(name, value, withinArray) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    return URI.hasQuery(data, name, value, withinArray);
  };
  p.setSearch = p.setQuery;
  p.addSearch = p.addQuery;
  p.removeSearch = p.removeQuery;
  p.hasSearch = p.hasQuery;

  // sanitizing URLs
  p.normalize = function() {
    if (this._parts.urn) {
      return this
        .normalizeProtocol(false)
        .normalizeQuery(false)
        .normalizeFragment(false)
        .build();
    }

    return this
      .normalizeProtocol(false)
      .normalizeHostname(false)
      .normalizePort(false)
      .normalizePath(false)
      .normalizeQuery(false)
      .normalizeFragment(false)
      .build();
  };
  p.normalizeProtocol = function(build) {
    if (typeof this._parts.protocol === 'string') {
      this._parts.protocol = this._parts.protocol.toLowerCase();
      this.build(!build);
    }

    return this;
  };
  p.normalizeHostname = function(build) {
    if (this._parts.hostname) {
      if (this.is('IDN') && punycode) {
        this._parts.hostname = punycode.toASCII(this._parts.hostname);
      } else if (this.is('IPv6') && IPv6) {
        this._parts.hostname = IPv6.best(this._parts.hostname);
      }

      this._parts.hostname = this._parts.hostname.toLowerCase();
      this.build(!build);
    }

    return this;
  };
  p.normalizePort = function(build) {
    // remove port of it's the protocol's default
    if (typeof this._parts.protocol === 'string' && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
      this._parts.port = null;
      this.build(!build);
    }

    return this;
  };
  p.normalizePath = function(build) {
    if (this._parts.urn) {
      return this;
    }

    if (!this._parts.path || this._parts.path === '/') {
      return this;
    }

    var _was_relative;
    var _path = this._parts.path;
    var _leadingParents = '';
    var _parent, _pos;

    // handle relative paths
    if (_path.charAt(0) !== '/') {
      _was_relative = true;
      _path = '/' + _path;
    }

    // resolve simples
    _path = _path
      .replace(/(\/(\.\/)+)|(\/\.$)/g, '/')
      .replace(/\/{2,}/g, '/');

    // remember leading parents
    if (_was_relative) {
      _leadingParents = _path.substring(1).match(/^(\.\.\/)+/) || '';
      if (_leadingParents) {
        _leadingParents = _leadingParents[0];
      }
    }

    // resolve parents
    while (true) {
      _parent = _path.indexOf('/..');
      if (_parent === -1) {
        // no more ../ to resolve
        break;
      } else if (_parent === 0) {
        // top level cannot be relative, skip it
        _path = _path.substring(3);
        continue;
      }

      _pos = _path.substring(0, _parent).lastIndexOf('/');
      if (_pos === -1) {
        _pos = _parent;
      }
      _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
    }

    // revert to relative
    if (_was_relative && this.is('relative')) {
      _path = _leadingParents + _path.substring(1);
    }

    _path = URI.recodePath(_path);
    this._parts.path = _path;
    this.build(!build);
    return this;
  };
  p.normalizePathname = p.normalizePath;
  p.normalizeQuery = function(build) {
    if (typeof this._parts.query === 'string') {
      if (!this._parts.query.length) {
        this._parts.query = null;
      } else {
        this.query(URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
      }

      this.build(!build);
    }

    return this;
  };
  p.normalizeFragment = function(build) {
    if (!this._parts.fragment) {
      this._parts.fragment = null;
      this.build(!build);
    }

    return this;
  };
  p.normalizeSearch = p.normalizeQuery;
  p.normalizeHash = p.normalizeFragment;

  p.iso8859 = function() {
    // expect unicode input, iso8859 output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = escape;
    URI.decode = decodeURIComponent;
    this.normalize();
    URI.encode = e;
    URI.decode = d;
    return this;
  };

  p.unicode = function() {
    // expect iso8859 input, unicode output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = strictEncodeURIComponent;
    URI.decode = unescape;
    this.normalize();
    URI.encode = e;
    URI.decode = d;
    return this;
  };

  p.readable = function() {
    var uri = this.clone();
    // removing username, password, because they shouldn't be displayed according to RFC 3986
    uri.username('').password('').normalize();
    var t = '';
    if (uri._parts.protocol) {
      t += uri._parts.protocol + '://';
    }

    if (uri._parts.hostname) {
      if (uri.is('punycode') && punycode) {
        t += punycode.toUnicode(uri._parts.hostname);
        if (uri._parts.port) {
          t += ':' + uri._parts.port;
        }
      } else {
        t += uri.host();
      }
    }

    if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== '/') {
      t += '/';
    }

    t += uri.path(true);
    if (uri._parts.query) {
      var q = '';
      for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
        var kv = (qp[i] || '').split('=');
        q += '&' + URI.decodeQuery(kv[0], this._parts.escapeQuerySpace)
          .replace(/&/g, '%26');

        if (kv[1] !== undefined) {
          q += '=' + URI.decodeQuery(kv[1], this._parts.escapeQuerySpace)
            .replace(/&/g, '%26');
        }
      }
      t += '?' + q.substring(1);
    }

    t += URI.decodeQuery(uri.hash(), true);
    return t;
  };

  // resolving relative and absolute URLs
  p.absoluteTo = function(base) {
    var resolved = this.clone();
    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    var basedir, i, p;

    if (this._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    if (!(base instanceof URI)) {
      base = new URI(base);
    }

    if (!resolved._parts.protocol) {
      resolved._parts.protocol = base._parts.protocol;
    }

    if (this._parts.hostname) {
      return resolved;
    }

    for (i = 0; (p = properties[i]); i++) {
      resolved._parts[p] = base._parts[p];
    }

    if (!resolved._parts.path) {
      resolved._parts.path = base._parts.path;
      if (!resolved._parts.query) {
        resolved._parts.query = base._parts.query;
      }
    } else if (resolved._parts.path.substring(-2) === '..') {
      resolved._parts.path += '/';
    }

    if (resolved.path().charAt(0) !== '/') {
      basedir = base.directory();
      resolved._parts.path = (basedir ? (basedir + '/') : '') + resolved._parts.path;
      resolved.normalizePath();
    }

    resolved.build();
    return resolved;
  };
  p.relativeTo = function(base) {
    var relative = this.clone().normalize();
    var relativeParts, baseParts, common, relativePath, basePath;

    if (relative._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    base = new URI(base).normalize();
    relativeParts = relative._parts;
    baseParts = base._parts;
    relativePath = relative.path();
    basePath = base.path();

    if (relativePath.charAt(0) !== '/') {
      throw new Error('URI is already relative');
    }

    if (basePath.charAt(0) !== '/') {
      throw new Error('Cannot calculate a URI relative to another relative URI');
    }

    if (relativeParts.protocol === baseParts.protocol) {
      relativeParts.protocol = null;
    }

    if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
      return relative.build();
    }

    if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
      return relative.build();
    }

    if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
      relativeParts.hostname = null;
      relativeParts.port = null;
    } else {
      return relative.build();
    }

    if (relativePath === basePath) {
      relativeParts.path = '';
      return relative.build();
    }

    // determine common sub path
    common = URI.commonPath(relative.path(), base.path());

    // If the paths have nothing in common, return a relative URL with the absolute path.
    if (!common) {
      return relative.build();
    }

    var parents = baseParts.path
      .substring(common.length)
      .replace(/[^\/]*$/, '')
      .replace(/.*?\//g, '../');

    relativeParts.path = parents + relativeParts.path.substring(common.length);

    return relative.build();
  };

  // comparing URIs
  p.equals = function(uri) {
    var one = this.clone();
    var two = new URI(uri);
    var one_map = {};
    var two_map = {};
    var checked = {};
    var one_query, two_query, key;

    one.normalize();
    two.normalize();

    // exact match
    if (one.toString() === two.toString()) {
      return true;
    }

    // extract query string
    one_query = one.query();
    two_query = two.query();
    one.query('');
    two.query('');

    // definitely not equal if not even non-query parts match
    if (one.toString() !== two.toString()) {
      return false;
    }

    // query parameters have the same length, even if they're permuted
    if (one_query.length !== two_query.length) {
      return false;
    }

    one_map = URI.parseQuery(one_query, this._parts.escapeQuerySpace);
    two_map = URI.parseQuery(two_query, this._parts.escapeQuerySpace);

    for (key in one_map) {
      if (hasOwn.call(one_map, key)) {
        if (!isArray(one_map[key])) {
          if (one_map[key] !== two_map[key]) {
            return false;
          }
        } else if (!arraysEqual(one_map[key], two_map[key])) {
          return false;
        }

        checked[key] = true;
      }
    }

    for (key in two_map) {
      if (hasOwn.call(two_map, key)) {
        if (!checked[key]) {
          // two contains a parameter not present in one
          return false;
        }
      }
    }

    return true;
  };

  // state
  p.duplicateQueryParameters = function(v) {
    this._parts.duplicateQueryParameters = !!v;
    return this;
  };

  p.escapeQuerySpace = function(v) {
    this._parts.escapeQuerySpace = !!v;
    return this;
  };

  return URI;
}));

},{"./IPv6":3,"./SecondLevelDomains":4,"./punycode":6}],6:[function(require,module,exports){
(function (global){
/*! http://mths.be/punycode v1.2.3 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports;
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		while (length--) {
			array[length] = fn(array[length]);
		}
		return array;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings.
	 * @private
	 * @param {String} domain The domain name.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		return map(string.split(regexSeparators), fn).join('.');
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <http://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * http://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    length,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols to a Punycode string of ASCII-only
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name to Unicode. Only the
	 * Punycoded parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it on a string that has already been converted to
	 * Unicode.
	 * @memberOf punycode
	 * @param {String} domain The Punycode domain name to convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(domain) {
		return mapDomain(domain, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name to Punycode. Only the
	 * non-ASCII parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it with a domain that's already in ASCII.
	 * @memberOf punycode
	 * @param {String} domain The domain name to convert, as a Unicode string.
	 * @returns {String} The Punycode representation of the given domain name.
	 */
	function toASCII(domain) {
		return mapDomain(domain, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.2.3',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <http://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return punycode;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
//     Backbone.js 1.1.2

//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(root, factory) {

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    factory(root, exports, _);

  // Finally, as a browser global.
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.1.2';

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = $;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true}, options);

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !options.wait) {
        if (!this.set(attrs, options)) return false;
      } else {
        if (!this._validate(attrs, options)) return false;
      }

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      var singular = !_.isArray(models);
      models = singular ? [models] : _.clone(models);
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = models[i] = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model, options);
      }
      return singular ? models[0] : models;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults({}, options, setOptions);
      if (options.parse) models = this.parse(models, options);
      var singular = !_.isArray(models);
      models = singular ? (models ? [models] : []) : _.clone(models);
      var i, l, id, model, attrs, existing, sort;
      var at = options.at;
      var targetModel = this.model;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};
      var add = options.add, merge = options.merge, remove = options.remove;
      var order = !sortable && add && remove ? [] : false;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        attrs = models[i] || {};
        if (attrs instanceof Model) {
          id = model = attrs;
        } else {
          id = attrs[targetModel.prototype.idAttribute || 'id'];
        }

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(id)) {
          if (remove) modelMap[existing.cid] = true;
          if (merge) {
            attrs = attrs === model ? model.attributes : attrs;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(attrs, options);
          if (!model) continue;
          toAdd.push(model);
          this._addReference(model, options);
        }

        // Do not add multiple models with the same `id`.
        model = existing || model;
        if (order && (model.isNew() || !modelMap[model.id])) order.push(model);
        modelMap[model.id] = true;
      }

      // Remove nonexistent models if appropriate.
      if (remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length || (order && order.length)) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          for (i = 0, l = toAdd.length; i < l; i++) {
            this.models.splice(at + i, 0, toAdd[i]);
          }
        } else {
          if (order) this.models.length = 0;
          var orderedModels = order || toAdd;
          for (i = 0, l = orderedModels.length; i < l; i++) {
            this.models.push(orderedModels[i]);
          }
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort events.
      if (!options.silent) {
        for (i = 0, l = toAdd.length; i < l; i++) {
          (model = toAdd[i]).trigger('add', model, this, options);
        }
        if (sort || (order && order.length)) this.trigger('sort', this, options);
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) return attrs;
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      if (model.id != null) this._byId[model.id] = model;
      if (!model.collection) model.collection = this;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'chain', 'sample'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    options || (options = {});
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  var noXhrPatch =
    typeof window !== 'undefined' && !!window.ActiveXObject &&
      !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        router.execute(callback, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args) {
      if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^/?]+)';
                   })
                   .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = decodeURI(this.location.pathname + this.location.search);
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        var frame = Backbone.$('<iframe src="javascript:0" tabindex="-1">');
        this.iframe = frame.hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot() && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment);
        }

      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      fragment = this.fragment = this.getFragment(fragment);
      return _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      var url = this.root + (fragment = this.getFragment(fragment || ''));

      // Strip the hash for matching.
      fragment = fragment.replace(pathStripper, '');

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // Don't include a trailing slash on the root.
      if (fragment === '' && url !== '/') url = url.slice(0, -1);

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;

}));

},{"underscore":10}],8:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],9:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v2.1.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-18T15:11Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//

var arr = [];

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	version = "2.1.3",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.0-pre
 * http://sizzlejs.com/
 *
 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-16
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];
	nodeType = context.nodeType;

	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	if ( !seed && documentIsHTML ) {

		// Try to shortcut find operations when possible (e.g., not under DocumentFragment)
		if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType !== 1 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;
	parent = doc.defaultView;

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Support tests
	---------------------------------------------------------------------- */
	documentIsHTML = !isXML( doc );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\f]' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.2+, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.7+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Support: Blackberry 4.6
					// gEBID returns nodes no longer in the document (#6963)
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed, false );
	window.removeEventListener( "load", completed, false );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// We once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[0], key ) : emptyGet;
};


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};


function Data() {
	// Support: Android<4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;
Data.accepts = jQuery.acceptData;

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android<4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};
var data_priv = new Data();

var data_user = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend({
	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};

var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
})();
var strundefined = typeof undefined;



support.focusinBubbles = "onfocusin" in window;


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome<28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: Android<4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Support: Firefox, Chrome, Safari
// Create "bubbling" focus and blur events
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					data_priv.remove( doc, fix );

				} else {
					data_priv.access( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}

function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit, PhantomJS
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit, PhantomJS
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, type, key,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( jQuery.acceptData( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each(function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				});
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optimization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {
		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		if ( elem.ownerDocument.defaultView.opener ) {
			return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
		}

		return window.getComputedStyle( elem, null );
	};



function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];
	}

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: iOS < 6
		// A tribute to the "awesome hack by Dean Edwards"
		// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?
		// Support: IE
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {
				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	var pixelPositionVal, boxSizingReliableVal,
		docElem = document.documentElement,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	if ( !div.style ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
		"position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computePixelPositionAndBoxSizingReliable() {
		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";
		div.innerHTML = "";
		docElem.appendChild( container );

		var divStyle = window.getComputedStyle( div, null );
		pixelPositionVal = divStyle.top !== "1%";
		boxSizingReliableVal = divStyle.width === "4px";

		docElem.removeChild( container );
	}

	// Support: node.js jsdom
	// Don't assume that getComputedStyle is a property of the global object
	if ( window.getComputedStyle ) {
		jQuery.extend( support, {
			pixelPosition: function() {

				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computePixelPositionAndBoxSizingReliable();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computePixelPositionAndBoxSizingReliable();
				}
				return boxSizingReliableVal;
			},
			reliableMarginRight: function() {

				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =
					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				docElem.appendChild( container );

				ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );

				docElem.removeChild( container );
				div.removeChild( marginDiv );

				return ret;
			}
		});
	}
})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
	// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[0].toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend({

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Support: IE9-11+
			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*.
					// Use string for doubling so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur(),
				// break the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// Handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// Ensure the complete handler is called before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// Height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// Store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// Don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
})();


var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {
			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
});




var rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = arguments.length === 0 || typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// Toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// Handle most common string cases
					ret.replace(rreturn, "") :
					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
						optionSet = true;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		tmp = new DOMParser();
		xml = tmp.parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = window.location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
};
jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrId = 0,
	xhrCallbacks = {},
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE9
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
	});
}

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr(),
					id = ++xhrId;

				xhr.open( options.type, options.url, options.async, options.username, options.password );

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file: protocol always yields status 0; see #8605, #14207
									xhr.status,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// Accessing binary-data responseText throws an exception
									// (#11426)
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");

				// Create the abort callback
				callback = xhrCallbacks[ id ] = callback("abort");

				try {
					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {
					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};




var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// Support: BlackBerry 5, iOS 3 (original iPhone)
		// If we don't have gBCR, just use 0,0 rather than error
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Support: Safari<7+, Chrome<37+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));

},{}],10:[function(require,module,exports){
//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.7.0';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var createCallback = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  _.iteratee = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return createCallback(value, context, argCount);
    if (_.isObject(value)) return _.matches(value);
    return _.property(value);
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    if (obj == null) return obj;
    iteratee = createCallback(iteratee, context);
    var i, length = obj.length;
    if (length === +length) {
      for (i = 0; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    if (obj == null) return [];
    iteratee = _.iteratee(iteratee, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length),
        currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index = 0, currentKey;
    if (arguments.length < 3) {
      if (!length) throw new TypeError(reduceError);
      memo = obj[keys ? keys[index++] : index++];
    }
    for (; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== + obj.length && _.keys(obj),
        index = (keys || obj).length,
        currentKey;
    if (arguments.length < 3) {
      if (!index) throw new TypeError(reduceError);
      memo = obj[keys ? keys[--index] : --index];
    }
    while (index--) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    predicate = _.iteratee(predicate, context);
    _.some(obj, function(value, index, list) {
      if (predicate(value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    predicate = _.iteratee(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(_.iteratee(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    if (obj == null) return true;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    if (obj == null) return false;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (obj.length !== +obj.length) obj = _.values(obj);
    return _.indexOf(obj, target) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = low + high >>> 1;
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = _.iteratee(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    for (var i = 0, length = input.length; i < length; i++) {
      var value = input[i];
      if (!_.isArray(value) && !_.isArguments(value)) {
        if (!strict) output.push(value);
      } else if (shallow) {
        push.apply(output, value);
      } else {
        flatten(value, shallow, strict, output);
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = _.iteratee(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i];
      if (isSorted) {
        if (!i || seen !== value) result.push(value);
        seen = value;
      } else if (iteratee) {
        var computed = iteratee(value, i, array);
        if (_.indexOf(seen, computed) < 0) {
          seen.push(computed);
          result.push(value);
        }
      } else if (_.indexOf(result, value) < 0) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true, []));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(slice.call(arguments, 1), true, true, []);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function(array) {
    if (array == null) return [];
    var length = _.max(arguments, 'length').length;
    var results = Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var idx = array.length;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var Ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    args = slice.call(arguments, 2);
    bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      Ctor.prototype = func.prototype;
      var self = new Ctor;
      Ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (_.isObject(result)) return result;
      return self;
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = hasher ? hasher.apply(this, arguments) : key;
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed before being called N times.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      } else {
        func = null;
      }
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj, iteratee, context) {
    var result = {}, key;
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      iteratee = createCallback(iteratee, context);
      for (key in obj) {
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
    } else {
      var keys = concat.apply([], slice.call(arguments, 1));
      obj = new Object(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (key in obj) result[key] = obj[key];
      }
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    if (!_.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
      // Handle Object.create(x) cases
      'constructor' in a && 'constructor' in b &&
      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
    ) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size, result;
    // Recursively compare objects and arrays.
    if (className === '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size === b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      size = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      result = _.keys(b).length === size;
      if (result) {
        while (size--) {
          // Deep compare each member
          key = keys[size];
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around an IE 11 bug.
  if (typeof /./ !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    var pairs = _.pairs(attrs), length = pairs.length;
    return function(obj) {
      if (obj == null) return !length;
      obj = new Object(obj);
      for (var i = 0; i < length; i++) {
        var pair = pairs[i], key = pair[0];
        if (pair[1] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = createCallback(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? object[property]() : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],11:[function(require,module,exports){
module.exports={
  "name": "readium",
  "version": "0.0.1",
  "description": "readium",
  "main": "src/index.js",
  "readme": "README.md",
  "keywords": ["readium", "hmh"],
  "repository": "TODO",
  "dependencies": {
    "backbone": "^1.1.2",
    "epub-cfi": "^0.0.1",
    "jquery": "^2.1.3",
    "rangy": "^1.3.0-alpha.20140921",
    "underscore": "^1.7.0",
    "URIjs": "^1.14.1"
  },
  "devDependencies": {
    "browserify": "^8.1.1",
    "envify": "^3.2.0",
    "livereloadify": "^2.0.0",
    "node-static": "^0.7.6",
    "uglify-js": "~2.4.16",
    "watchify": "^2.2.1"
  },
  "scripts": {
    "build":      "NODE_ENV=production browserify src/app.js > ./dist/readium.js && uglifyjs ./dist/readium.js -cm > ./dist/readium.min.js",
    "livereload": "livereloadify ./public",
    "start": "npm run watch & npm run livereload & npm run static",
    "static": "static ./public --port 3000",
    "test": "jest",
    "watch": "watchify -o ./public/readium.js -v -d src/app.js"
  },
  "author": "Darío Javier Cravero <dario.cravero@hmhco.com>",
  "license": "TBD",
  "browserify": {
    "transform": [
      "envify"
    ]
  }
}

},{}],12:[function(require,module,exports){
require('./light-app');

},{"./light-app":26}],13:[function(require,module,exports){
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

var $ = require('jquery');
var _ = require('underscore');
var URI = require('URIjs');
var ContentTypeDiscovery = require('./discover-content-type');

function ContentDocumentFetcher(publicationFetcher, spineItem, loadedDocumentUri, publicationResourcesCache) {

  var self = this;

  var _contentDocumentPathRelativeToPackage = spineItem.href;
  var _publicationFetcher = publicationFetcher;
  var _contentDocumentText;
  var _srcMediaType = spineItem.media_type;
  var _contentDocumentDom;
  var _publicationResourcesCache = publicationResourcesCache;

  // PUBLIC API

  this.fetchContentDocumentAndResolveDom = function(contentDocumentResolvedCallback, errorCallback) {
    _publicationFetcher.relativeToPackageFetchFileContents(_contentDocumentPathRelativeToPackage, 'text',
      function(contentDocumentText) {
        _contentDocumentText = contentDocumentText;
        self.resolveInternalPackageResources(contentDocumentResolvedCallback, errorCallback);
      }, errorCallback
    );
  };

  this.resolveInternalPackageResources = function(resolvedDocumentCallback, onerror) {

    _contentDocumentDom = _publicationFetcher.markupParser.parseMarkup(_contentDocumentText, _srcMediaType);
    setBaseUri(_contentDocumentDom, loadedDocumentUri);

    var resolutionDeferreds = [];

    if (_publicationFetcher.shouldFetchMediaAssetsProgrammatically()) {
      resolveDocumentImages(resolutionDeferreds, onerror);
      resolveDocumentAudios(resolutionDeferreds, onerror);
      resolveDocumentVideos(resolutionDeferreds, onerror);
    }
    // TODO: recursive fetching, parsing and DOM construction of documents in IFRAMEs,
    // with CSS preprocessing and obfuscated font handling
    resolveDocumentIframes(resolutionDeferreds, onerror);
    // TODO: resolution (e.g. using DOM mutation events) of scripts loaded dynamically by scripts
    resolveDocumentScripts(resolutionDeferreds, onerror);
    resolveDocumentLinkStylesheets(resolutionDeferreds, onerror);
    resolveDocumentEmbeddedStylesheets(resolutionDeferreds, onerror);

    $.when.apply($, resolutionDeferreds).done(function() {
      resolvedDocumentCallback(_contentDocumentDom);
    });

  };

  // INTERNAL FUNCTIONS

  function setBaseUri(documentDom, baseURI) {
    var baseElem = documentDom.getElementsByTagName('base')[0];
    if (!baseElem) {
      baseElem = documentDom.createElement('base');

      var anchor = documentDom.getElementsByTagName('head')[0];
      anchor.insertBefore(baseElem, anchor.childNodes[0]);
    }
    baseElem.setAttribute('href', baseURI);
  }

  function _handleError(err) {
    if (err) {
      if (err.message) {
        console.error(err.message);
      }
      if (err.stack) {
        console.error(err.stack);
      }
    }
    console.error(err);
  }

  function fetchResourceForElement(resolvedElem, refAttrOrigVal, refAttr, fetchMode, resolutionDeferreds,
    onerror, resourceDataPreprocessing) {
    var resourceUriRelativeToPackageDocument = (new URI(refAttrOrigVal)).absoluteTo(_contentDocumentPathRelativeToPackage).toString();

    var cachedResourceUrl = _publicationResourcesCache.getResourceURL(resourceUriRelativeToPackageDocument);

    function replaceRefAttrInElem(newResourceUrl) {
      // Store original refAttrVal in a special attribute to provide access to the original href:
      $(resolvedElem).data('epubZipOrigHref', refAttrOrigVal);
      $(resolvedElem).attr(refAttr, newResourceUrl);
    }

    if (cachedResourceUrl) {
      replaceRefAttrInElem(cachedResourceUrl);
    } else {
      var resolutionDeferred = $.Deferred();
      resolutionDeferreds.push(resolutionDeferred);

      _publicationFetcher.relativeToPackageFetchFileContents(resourceUriRelativeToPackageDocument,
        fetchMode,
        function(resourceData) {

          // Generate a function to replace element's resource URL with URL of fetched data.
          // The function will either be called directly, immediately (if no preprocessing of resourceData is in effect)
          // or indirectly, later after resourceData preprocessing finishes:
          var replaceResourceURL = function(finalResourceData) {
            // Creating an object URL requires a Blob object, so resource data fetched in text mode needs to be wrapped in a Blob:
            if (fetchMode === 'text') {
              var textResourceContentType = ContentTypeDiscovery.identifyContentTypeFromFileName(resourceUriRelativeToPackageDocument);
              var declaredType = $(resolvedElem).attr('type');
              if (declaredType) {
                textResourceContentType = declaredType;
              }
              finalResourceData = new Blob([finalResourceData], {
                type: textResourceContentType
              });
            }
            //noinspection JSUnresolvedVariable,JSUnresolvedFunction
            var resourceObjectURL = window.URL.createObjectURL(finalResourceData);
            _publicationResourcesCache.putResourceURL(resourceUriRelativeToPackageDocument,
              resourceObjectURL);
            // TODO: take care of releasing object URLs when no longer needed
            replaceRefAttrInElem(resourceObjectURL);
            resolutionDeferred.resolve();
          };

          if (resourceDataPreprocessing) {
            resourceDataPreprocessing(resourceData, resourceUriRelativeToPackageDocument,
              replaceResourceURL);
          } else {
            replaceResourceURL(resourceData);
          }
        }, onerror);
    }
  }

  function fetchResourceForCssUrlMatch(cssUrlMatch, cssResourceDownloadDeferreds,
    styleSheetUriRelativeToPackageDocument, stylesheetCssResourceUrlsMap,
    isStyleSheetResource) {
    var origMatchedUrlString = cssUrlMatch[0];

    var extractedUrlCandidates = cssUrlMatch.slice(2);
    var extractedUrl = _.find(extractedUrlCandidates, function(matchGroup) {
      return typeof matchGroup !== 'undefined'
    });

    var extractedUri = new URI(extractedUrl);
    var isCssUrlRelative = extractedUri.scheme() === '';
    if (!isCssUrlRelative) {
      // Absolute URLs don't need programmatic fetching
      return;
    }
    var resourceUriRelativeToPackageDocument = (new URI(extractedUrl)).absoluteTo(styleSheetUriRelativeToPackageDocument).toString();

    var cachedResourceURL = _publicationResourcesCache.getResourceURL(resourceUriRelativeToPackageDocument);


    if (cachedResourceURL) {
      stylesheetCssResourceUrlsMap[origMatchedUrlString] = {
        isStyleSheetResource: isStyleSheetResource,
        resourceObjectURL: cachedResourceURL
      };
    } else {
      var cssUrlFetchDeferred = $.Deferred();
      cssResourceDownloadDeferreds.push(cssUrlFetchDeferred);

      var processedBlobCallback = function(resourceDataBlob) {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        var resourceObjectURL = window.URL.createObjectURL(resourceDataBlob);
        stylesheetCssResourceUrlsMap[origMatchedUrlString] = {
          isStyleSheetResource: isStyleSheetResource,
          resourceObjectURL: resourceObjectURL
        };
        _publicationResourcesCache.putResourceURL(resourceUriRelativeToPackageDocument, resourceObjectURL);
        cssUrlFetchDeferred.resolve();
      };
      var fetchErrorCallback = function(error) {
        _handleError(error);
        cssUrlFetchDeferred.resolve();
      };

      var fetchMode;
      var fetchCallback;
      if (isStyleSheetResource) {
        // TODO: test whether recursion works for nested @import rules with arbitrary indirection depth.
        fetchMode = 'text';
        fetchCallback = function(styleSheetResourceData) {
          preprocessCssStyleSheetData(styleSheetResourceData, resourceUriRelativeToPackageDocument,
            function(preprocessedStyleSheetData) {
              var resourceDataBlob = new Blob([preprocessedStyleSheetData], {
                type: 'text/css'
              });
              processedBlobCallback(resourceDataBlob);
            })
        }
      } else {
        fetchMode = 'blob';
        fetchCallback = processedBlobCallback;
      }

      _publicationFetcher.relativeToPackageFetchFileContents(resourceUriRelativeToPackageDocument,
        fetchMode,
        fetchCallback, fetchErrorCallback);
    }
  }

  function preprocessCssStyleSheetData(styleSheetResourceData, styleSheetUriRelativeToPackageDocument,
    callback) {
    var cssUrlRegexp = /[Uu][Rr][Ll]\(\s*([']([^']+)[']|["]([^"]+)["]|([^)]+))\s*\)/g;
    var nonUrlCssImportRegexp = /@[Ii][Mm][Pp][Oo][Rr][Tt]\s*('([^']+)'|"([^"]+)")/g;
    var stylesheetCssResourceUrlsMap = {};
    var cssResourceDownloadDeferreds = [];
    // Go through the stylesheet text using all regexps and process according to those regexp matches, if any:
    [nonUrlCssImportRegexp, cssUrlRegexp].forEach(function(processingRegexp) {
      // extract all URL references in the CSS sheet,
      var cssUrlMatch = processingRegexp.exec(styleSheetResourceData);
      while (cssUrlMatch != null) {
        // then fetch and replace them with corresponding object URLs:
        var isStyleSheetResource = false;
        // Special handling of @import-ed stylesheet files - recursive preprocessing:
        // TODO: will not properly handle @import url(...):
        if (processingRegexp == nonUrlCssImportRegexp) {
          // This resource URL points to an @import-ed CSS stylesheet file. Need to preprocess its text
          // after fetching but before making an object URL of it:
          isStyleSheetResource = true;
        }
        fetchResourceForCssUrlMatch(cssUrlMatch, cssResourceDownloadDeferreds,
          styleSheetUriRelativeToPackageDocument, stylesheetCssResourceUrlsMap, isStyleSheetResource);
        cssUrlMatch = processingRegexp.exec(styleSheetResourceData);
      }

    });

    if (cssResourceDownloadDeferreds.length > 0) {
      $.when.apply($, cssResourceDownloadDeferreds).done(function() {
        for (var origMatchedUrlString in stylesheetCssResourceUrlsMap) {
          var processedResourceDescriptor = stylesheetCssResourceUrlsMap[origMatchedUrlString];


          var processedUrlString;
          if (processedResourceDescriptor.isStyleSheetResource) {
            processedUrlString = '@import "' + processedResourceDescriptor.resourceObjectURL + '"';
          } else {
            processedUrlString = "url('" + processedResourceDescriptor.resourceObjectURL + "')";
          }
          var origMatchedUrlStringEscaped = origMatchedUrlString.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
            "\\$&");
          var origMatchedUrlStringRegExp = new RegExp(origMatchedUrlStringEscaped, 'g');
          //noinspection JSCheckFunctionSignatures
          styleSheetResourceData =
            styleSheetResourceData.replace(origMatchedUrlStringRegExp, processedUrlString, 'g');

        }
        callback(styleSheetResourceData);
      });
    } else {
      callback(styleSheetResourceData);
    }
  }


  function resolveResourceElements(elemName, refAttr, fetchMode, resolutionDeferreds, onerror,
    resourceDataPreprocessing) {

    var resolvedElems = $(elemName + '[' + refAttr + ']', _contentDocumentDom);

    resolvedElems.each(function(index, resolvedElem) {
      var refAttrOrigVal = $(resolvedElem).attr(refAttr);
      var refAttrUri = new URI(refAttrOrigVal);

      if (refAttrUri.scheme() === '') {
        // Relative URI, fetch from packed EPUB archive:

        fetchResourceForElement(resolvedElem, refAttrOrigVal, refAttr, fetchMode, resolutionDeferreds,
          onerror, resourceDataPreprocessing);
      }
    });
  }

  function resolveDocumentImages(resolutionDeferreds, onerror) {
    resolveResourceElements('img', 'src', 'blob', resolutionDeferreds, onerror);
  }

  function resolveDocumentAudios(resolutionDeferreds, onerror) {
    resolveResourceElements('audio', 'src', 'blob', resolutionDeferreds, onerror);
  }

  function resolveDocumentVideos(resolutionDeferreds, onerror) {
    resolveResourceElements('video', 'src', 'blob', resolutionDeferreds, onerror);
    resolveResourceElements('video', 'poster', 'blob', resolutionDeferreds, onerror);
  }

  function resolveDocumentScripts(resolutionDeferreds, onerror) {
    resolveResourceElements('script', 'src', 'blob', resolutionDeferreds, onerror);
  }

  function resolveDocumentIframes(resolutionDeferreds, onerror) {
    resolveResourceElements('iframe', 'src', 'blob', resolutionDeferreds, onerror);
  }

  function resolveDocumentLinkStylesheets(resolutionDeferreds, onerror) {
    resolveResourceElements('link', 'href', 'text', resolutionDeferreds, onerror,
      preprocessCssStyleSheetData);
  }

  function resolveDocumentEmbeddedStylesheets(resolutionDeferreds, onerror) {
    var resolvedElems = $('style', _contentDocumentDom);
    resolvedElems.each(function(index, resolvedElem) {
      var resolutionDeferred = $.Deferred();
      resolutionDeferreds.push(resolutionDeferred);
      var styleSheetData = $(resolvedElem).text();
      preprocessCssStyleSheetData(styleSheetData, _contentDocumentPathRelativeToPackage,
        function(resolvedStylesheetData) {
          $(resolvedElem).text(resolvedStylesheetData);
          resolutionDeferred.resolve();
        });
    });
  }

};

module.exports = ContentDocumentFetcher;
},{"./discover-content-type":14,"URIjs":5,"jquery":9,"underscore":10}],14:[function(require,module,exports){
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

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var URI = require('URIjs');

var _instance = undefined;

function ContentTypeDiscovery() {

  var self = this;

  ContentTypeDiscovery.suffixContentTypeMap = {
    css: 'text/css',
    epub: 'application/epub+zip',
    gif: 'image/gif',
    html: 'text/html',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    ncx: 'application/x-dtbncx+xml',
    opf: 'application/oebps-package+xml',
    png: 'image/png',
    svg: 'image/svg+xml',
    xhtml: 'application/xhtml+xml'
  };

  this.identifyContentTypeFromFileName = function(contentUrl) {
    var contentUrlSuffix = URI(contentUrl).suffix();
    var contentType = 'application/octet-stream';
    if (typeof ContentTypeDiscovery.suffixContentTypeMap[contentUrlSuffix] !== 'undefined') {
      contentType = ContentTypeDiscovery.suffixContentTypeMap[contentUrlSuffix];
    }
    return contentType;
  };

  this.identifyContentType = function(contentUrl) {
    // TODO: Make the call asynchronous (which would require a callback and would probably make sense
    // when calling functions are also remodelled for async).

    var contentType = $.ajax({
      type: "HEAD",
      url: contentUrl,
      async: false
    }).getResponseHeader('Content-Type');
    if (contentType === null) {
      contentType = self.identifyContentTypeFromFileName(contentUrl);
      console.log('guessed contentType [' + contentType + '] from URI [' + contentUrl +
        ']. Configuring the web server to provide the content type is recommended.');

    }

    return contentType;
  }

};

if (!_instance) {
  _instance = new ContentTypeDiscovery();
}

module.exports = _instance;
},{"URIjs":5,"backbone":7,"jquery":9,"underscore":10}],15:[function(require,module,exports){
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

var $ = require('jquery');

function EncryptionHandler(encryptionData) {
  var self = this;

  var ENCRYPTION_METHODS = {
    'http://www.idpf.org/2008/embedding': embeddedFontDeobfuscateIdpf,
    'http://ns.adobe.com/pdf/enc#RC': embeddedFontDeobfuscateAdobe
  };

  // INTERNAL FUNCTIONS

  function blob2BinArray(blob, callback) {
    var fileReader = new FileReader();
    fileReader.onload = function() {
      var arrayBuffer = this.result;
      callback(new Uint8Array(arrayBuffer));
    };
    fileReader.readAsArrayBuffer(blob);
  }

  function xorObfuscatedBlob(obfuscatedResourceBlob, prefixLength, xorKey, callback) {
    var obfuscatedPrefixBlob = obfuscatedResourceBlob.slice(0, prefixLength);
    blob2BinArray(obfuscatedPrefixBlob, function(bytes) {
      var masklen = xorKey.length;
      for (var i = 0; i < prefixLength; i++) {
        bytes[i] = bytes[i] ^ (xorKey[i % masklen]);
      }
      var deobfuscatedPrefixBlob = new Blob([bytes], {
        type: obfuscatedResourceBlob.type
      });
      var remainderBlob = obfuscatedResourceBlob.slice(prefixLength);
      var deobfuscatedBlob = new Blob([deobfuscatedPrefixBlob, remainderBlob], {
        type: obfuscatedResourceBlob.type
      });

      callback(deobfuscatedBlob);
    });
  }

  function embeddedFontDeobfuscateIdpf(obfuscatedResourceBlob, callback) {

    var prefixLength = 1040;
    // Shamelessly copied from
    // https://github.com/readium/readium-chrome-extension/blob/26d4b0cafd254cfa93bf7f6225887b83052642e0/scripts/models/path_resolver.js#L102 :
    xorObfuscatedBlob(obfuscatedResourceBlob, prefixLength, encryptionData.uidHash, callback);
  }

  function urnUuidToByteArray(id) {
    var uuidRegexp = /(urn:uuid:)?([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})/i;
    var matchResults = uuidRegexp.exec(id);
    var rawUuid = matchResults[2] + matchResults[3] + matchResults[4] + matchResults[5] + matchResults[6];
    if (!rawUuid || rawUuid.length != 32) {
      console.error('Bad UUID format for ID :' + id);
    }
    var byteArray = [];
    for (var i = 0; i < 16; i++) {
      var byteHex = rawUuid.substr(i * 2, 2);
      var byteNumber = parseInt(byteHex, 16);
      byteArray.push(byteNumber);
    }
    return byteArray;
  }

  function embeddedFontDeobfuscateAdobe(obfuscatedResourceBlob, callback) {

    // extract the UUID and convert to big-endian binary form (16 bytes):
    var uidWordArray = urnUuidToByteArray(encryptionData.uid);
    var prefixLength = 1024;
    xorObfuscatedBlob(obfuscatedResourceBlob, prefixLength, uidWordArray, callback)
  }


  // PUBLIC API

  this.isEncryptionSpecified = function() {
    return encryptionData && encryptionData.encryptions;
  };


  this.getEncryptionMethodForRelativePath = function(pathRelativeToRoot) {
    if (self.isEncryptionSpecified()) {
      return encryptionData.encryptions[pathRelativeToRoot];
    } else {
      return undefined;
    }
  };

  this.getDecryptionFunctionForRelativePath = function(pathRelativeToRoot) {
    var encryptionMethod = self.getEncryptionMethodForRelativePath(pathRelativeToRoot);
    if (encryptionMethod && ENCRYPTION_METHODS[encryptionMethod]) {
      return ENCRYPTION_METHODS[encryptionMethod];
    } else {
      return undefined;
    }
  };

};

EncryptionHandler.CreateEncryptionData = function(id, encryptionDom) {

  var encryptionData = {
    uid: id,
    uidHash: window.Crypto.SHA1(unescape(encodeURIComponent(id.trim())), {
      asBytes: true
    }),
    encryptions: undefined
  };

  var encryptedData = $('EncryptedData', encryptionDom);
  encryptedData.each(function(index, encryptedData) {
    var encryptionAlgorithm = $('EncryptionMethod', encryptedData).first().attr('Algorithm');

    // For some reason, jQuery selector "" against XML DOM sometimes doesn't match properly
    var cipherReference = $('CipherReference', encryptedData);
    cipherReference.each(function(index, CipherReference) {
      var cipherReferenceURI = $(CipherReference).attr('URI');
      console.log('Encryption/obfuscation algorithm ' + encryptionAlgorithm + ' specified for ' +
        cipherReferenceURI);

      if (!encryptionData.encryptions) {
        encryptionData.encryptions = {};
      }

      encryptionData.encryptions[cipherReferenceURI] = encryptionAlgorithm;
    });
  });

  return encryptionData;
};

module.exports = EncryptionHandler;
},{"jquery":9}],16:[function(require,module,exports){
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

function MarkupParser() {

  var self = this;

  this.parseXml = function(xmlString) {
    return self.parseMarkup(xmlString, 'text/xml');
  };

  this.parseMarkup = function(markupString, contentType) {
    var parser = new window.DOMParser;
    return parser.parseFromString(markupString, contentType);
  };

};

module.exports = MarkupParser;
},{}],17:[function(require,module,exports){
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

var $ = require('jquery');
var _ = require('underscore');
var URI = require('URIjs');
var ContentTypeDiscovery = require('./discover-content-type');

function PlainResourceFetcher(parentFetcher, baseUrl) {

  var self = this;
  var _packageDocumentAbsoluteUrl;
  var _packageDocumentRelativePath;

  // INTERNAL FUNCTIONS

  function fetchFileContents(pathRelativeToPackageRoot, readCallback, onerror) {
    var fileUrl = self.resolveURI(pathRelativeToPackageRoot);

    if (typeof pathRelativeToPackageRoot === 'undefined') {
      throw 'Fetched file relative path is undefined!';
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', fileUrl, true);
    xhr.responseType = 'arraybuffer';
    xhr.onerror = onerror;

    xhr.onload = function(loadEvent) {
      readCallback(xhr.response);
    };

    xhr.send();
  }


  // PUBLIC API

  this.initialize = function(callback) {

    parentFetcher.getXmlFileDom('META-INF/container.xml', function(containerXmlDom) {
      _packageDocumentRelativePath = parentFetcher.getRootFile(containerXmlDom);
      _packageDocumentAbsoluteUrl = self.resolveURI(_packageDocumentRelativePath);

      callback();

    }, function(error) {
      console.error("unable to find package document: " + error);
      _packageDocumentAbsoluteUrl = baseUrl;

      callback();
    });
  };

  this.resolveURI = function(pathRelativeToPackageRoot) {
    return baseUrl + "/" + pathRelativeToPackageRoot;
  };


  this.getPackageUrl = function() {
    return _packageDocumentAbsoluteUrl;
  };

  this.fetchFileContentsText = function(pathRelativeToPackageRoot, fetchCallback, onerror) {
    var fileUrl = self.resolveURI(pathRelativeToPackageRoot);

    if (typeof fileUrl === 'undefined') {
      throw 'Fetched file URL is undefined!';
    }
    $.ajax({
      // encoding: "UTF-8",
      // mimeType: "text/plain; charset=UTF-8",
      // beforeSend: function( xhr ) {
      //     xhr.overrideMimeType("text/plain; charset=UTF-8");
      // },
      isLocal: fileUrl.indexOf("http") === 0 ? false : true,
      url: fileUrl,
      dataType: 'text', //https://api.jquery.com/jQuery.ajax/
      async: true,
      success: function(result) {
        fetchCallback(result);
      },
      error: function(xhr, status, errorThrown) {
        console.error('Error when AJAX fetching ' + fileUrl);
        console.error(status);
        console.error(errorThrown);

        // // isLocal = false with custom URI scheme / protocol results in false fail on Firefox (Chrome okay)
        // if (status === "error" && (!errorThrown || !errorThrown.length) && xhr.responseText && xhr.responseText.length)
        // {
        //     console.error(xhr);
        //     if (typeof xhr.getResponseHeader !== "undefined") console.error(xhr.getResponseHeader("Content-Type"));
        //     if (typeof xhr.getAllResponseHeaders !== "undefined") console.error(xhr.getAllResponseHeaders());
        //     if (typeof xhr.responseText !== "undefined") console.error(xhr.responseText);
        //     
        //     // success
        //     fetchCallback(xhr.responseText);
        //     return;
        // }

        onerror(errorThrown);
      }
    });
  };

  this.fetchFileContentsBlob = function(pathRelativeToPackageRoot, fetchCallback, onerror) {

    var decryptionFunction = parentFetcher.getDecryptionFunctionForRelativePath(pathRelativeToPackageRoot);
    if (decryptionFunction) {
      var origFetchCallback = fetchCallback;
      fetchCallback = function(unencryptedBlob) {
        decryptionFunction(unencryptedBlob, function(decryptedBlob) {
          origFetchCallback(decryptedBlob);
        });
      };
    }
    fetchFileContents(pathRelativeToPackageRoot, function(contentsArrayBuffer) {
      var blob = new Blob([contentsArrayBuffer], {
        type: ContentTypeDiscovery.identifyContentTypeFromFileName(pathRelativeToPackageRoot)
      });
      fetchCallback(blob);
    }, onerror);
  };

  this.getPackageDom = function(callback, onerror) {
    self.fetchFileContentsText(_packageDocumentRelativePath, function(packageXml) {
      var packageDom = parentFetcher.markupParser.parseXml(packageXml);
      callback(packageDom);
    }, onerror);
  };

};

module.exports = PlainResourceFetcher;
},{"./discover-content-type":14,"URIjs":5,"jquery":9,"underscore":10}],18:[function(require,module,exports){
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

var $ = require('jquery');
var ContentDocumentFetcher = require('./content-document-fetcher');
var EncryptionHandler = require('./encryption-handler');
var MarkupParser = require('./markup-parser');
var PlainResourceFetcher = require('./plain-resource-fetcher');
var ResourceCache = require('./resource-cache');
var URI = require('URIjs');
var ZipResourceFetcher = require('./zip-resource-fetcher');

function PublicationFetcher(bookRoot, jsLibRoot) {

  var self = this;

  self.contentTypePackageReadStrategyMap = {
    'application/oebps-package+xml': 'exploded',
    'application/epub+zip': 'zipped',
    'application/zip': 'zipped'
  };

  var _shouldConstructDomProgrammatically;
  var _resourceFetcher;
  var _encryptionHandler;
  var _packageFullPath;
  var _packageDom;
  var _packageDomInitializationDeferred;
  var _publicationResourcesCache = new ResourceCache;


  this.markupParser = new MarkupParser();

  this.initialize = function(callback) {

    var isEpubExploded = isExploded();

    // Non exploded EPUBs (i.e. zipped .epub documents) should be fetched in a programmatical manner:
    _shouldConstructDomProgrammatically = !isEpubExploded;
    createResourceFetcher(isEpubExploded, callback);
  };



  // INTERNAL FUNCTIONS

  function _handleError(err) {
    if (err) {
      if (err.message) {
        console.error(err.message);
      }
      if (err.stack) {
        console.error(err.stack);
      }
    }
    console.error(err);
  }

  function isExploded() {

    var ext = ".epub";
    return bookRoot.indexOf(ext, bookRoot.length - ext.length) === -1;
  }

  function createResourceFetcher(isExploded, callback) {
    if (isExploded) {
      console.log('using new PlainResourceFetcher');
      _resourceFetcher = new PlainResourceFetcher(self, bookRoot);
      _resourceFetcher.initialize(function() {
        callback(_resourceFetcher);
      });
      return;
    } else {
      console.log('using new ZipResourceFetcher');
      _resourceFetcher = new ZipResourceFetcher(self, bookRoot, jsLibRoot);
      callback(_resourceFetcher);
    }
  }

  // PUBLIC API

  /**
   * Determine whether the documents fetched using this fetcher require special programmatic handling.
   * (resolving of internal resource references).
   * @returns {*} true if documents fetched using this fetcher require special programmatic handling
   * (resolving of internal resource references). Typically needed for zipped EPUBs or exploded EPUBs that contain
   * encrypted resources specified in META-INF/encryption.xml.
   *
   * false if documents can be fed directly into a window or iframe by src URL without using special fetching logic.
   */
  this.shouldConstructDomProgrammatically = function() {
    return _shouldConstructDomProgrammatically;
  };

  /**
   * Determine whether the media assets (audio, video, images) within content documents require special
   * programmatic handling.
   * @returns {*} true if content documents fetched using this fetcher require programmatic fetching
   * of media assets. Typically needed for zipped EPUBs.
   *
   * false if paths to media assets are accessible directly for the browser through their paths relative to
   * the base URI of their content document.
   */
  this.shouldFetchMediaAssetsProgrammatically = function() {
    return _shouldConstructDomProgrammatically && !isExploded();
  };

  this.getBookRoot = function() {
    return bookRoot;
  };

  this.getJsLibRoot = function() {
    return jsLibRoot;
  }

  this.getPackageUrl = function() {
    return _resourceFetcher.getPackageUrl();
  };

  this.fetchContentDocument = function(attachedData, loadedDocumentUri, contentDocumentResolvedCallback, errorCallback) {

    var contentDocumentFetcher = new ContentDocumentFetcher(self, attachedData.spineItem, loadedDocumentUri, _publicationResourcesCache);
    contentDocumentFetcher.fetchContentDocumentAndResolveDom(contentDocumentResolvedCallback, function(err) {
      _handleError(err);
      errorCallback(err);
    });
  };

  this.getFileContentsFromPackage = function(filePathRelativeToPackageRoot, callback, onerror) {

    _resourceFetcher.fetchFileContentsText(filePathRelativeToPackageRoot, function(fileContents) {
      callback(fileContents);
    }, onerror);
  };



  this.getXmlFileDom = function(xmlFilePathRelativeToPackageRoot, callback, onerror) {
    self.getFileContentsFromPackage(xmlFilePathRelativeToPackageRoot, function(xmlFileContents) {
      var fileDom = self.markupParser.parseXml(xmlFileContents);
      callback(fileDom);
    }, onerror);
  };

  this.getPackageFullPath = function(callback, onerror) {
    self.getXmlFileDom('META-INF/container.xml', function(containerXmlDom) {
      var packageFullPath = self.getRootFile(containerXmlDom);
      callback(packageFullPath);
    }, onerror);
  };

  this.getRootFile = function(containerXmlDom) {
    var rootFile = $('rootfile', containerXmlDom);
    var packageFullPath = rootFile.attr('full-path');
    return packageFullPath;
  };

  this.getPackageDom = function(callback, onerror) {
    if (_packageDom) {
      callback(_packageDom);
    } else {
      // TODO: use jQuery's Deferred
      // Register all callbacks interested in initialized packageDom, launch its instantiation only once
      // and broadcast to all callbacks registered during the initialization once it's done:
      if (_packageDomInitializationDeferred) {
        _packageDomInitializationDeferred.done(callback);
      } else {
        _packageDomInitializationDeferred = $.Deferred();
        _packageDomInitializationDeferred.done(callback);
        self.getPackageFullPath(function(packageFullPath) {
          _packageFullPath = packageFullPath;
          self.getXmlFileDom(packageFullPath, function(packageDom) {
            _packageDom = packageDom;
            _packageDomInitializationDeferred.resolve(packageDom);
            _packageDomInitializationDeferred = undefined;
          })
        }, onerror);
      }
    }
  };

  this.convertPathRelativeToPackageToRelativeToBase = function(relativeToPackagePath) {
    return new URI(relativeToPackagePath).absoluteTo(_packageFullPath).toString();
  };

  this.relativeToPackageFetchFileContents = function(relativeToPackagePath, fetchMode, fetchCallback, onerror) {

    if (!onerror) {
      onerror = _handleError;
    }

    var pathRelativeToEpubRoot = decodeURIComponent(self.convertPathRelativeToPackageToRelativeToBase(relativeToPackagePath));
    // In case we received an absolute path, convert it to relative form or the fetch will fail:
    if (pathRelativeToEpubRoot.charAt(0) === '/') {
      pathRelativeToEpubRoot = pathRelativeToEpubRoot.substr(1);
    }
    var fetchFunction = _resourceFetcher.fetchFileContentsText;
    if (fetchMode === 'blob') {
      fetchFunction = _resourceFetcher.fetchFileContentsBlob;
    } else if (fetchMode === 'data64uri') {
      fetchFunction = _resourceFetcher.fetchFileContentsData64Uri;
    }
    fetchFunction.call(_resourceFetcher, pathRelativeToEpubRoot, fetchCallback, onerror);
  };



  this.getRelativeXmlFileDom = function(filePath, callback, errorCallback) {
    self.getXmlFileDom(self.convertPathRelativeToPackageToRelativeToBase(filePath), callback, errorCallback);
  };

  function readEncriptionData(callback) {
    self.getXmlFileDom('META-INF/encryption.xml', function(encryptionDom, error) {

      if (error) {
        console.log(error);
        console.log("Document doesn't make use of encryption.");
        _encryptionHandler = new EncryptionHandler(undefined);
        callback();
      } else {

        var encryptions = [];


        var encryptedData = $('EncryptedData', encryptionDom);
        encryptedData.each(function(index, encryptedData) {
          var encryptionAlgorithm = $('EncryptionMethod', encryptedData).first().attr('Algorithm');

          encryptions.push({
            algorithm: encryptionAlgorithm
          });

          // For some reason, jQuery selector "" against XML DOM sometimes doesn't match properly
          var cipherReference = $('CipherReference', encryptedData);
          cipherReference.each(function(index, CipherReference) {
            var cipherReferenceURI = $(CipherReference).attr('URI');
            console.log('Encryption/obfuscation algorithm ' + encryptionAlgorithm + ' specified for ' +
              cipherReferenceURI);
            encryptions[cipherReferenceURI] = encryptionAlgorithm;
          });
        });
      }

    });
  }

  // Currently needed for deobfuscating fonts
  this.setPackageMetadata = function(packageMetadata, settingFinishedCallback) {

    self.getXmlFileDom('META-INF/encryption.xml', function(encryptionDom) {

      var encryptionData = EncryptionHandler.CreateEncryptionData(packageMetadata.id, encryptionDom);

      _encryptionHandler = new EncryptionHandler(encryptionData);

      if (_encryptionHandler.isEncryptionSpecified()) {
        // EPUBs that use encryption for any resources should be fetched in a programmatical manner:
        _shouldConstructDomProgrammatically = true;
      }

      settingFinishedCallback();


    }, function(error) {

      console.log("Document doesn't make use of encryption.");
      _encryptionHandler = new EncryptionHandler(undefined);

      settingFinishedCallback();
    });
  };

  this.getDecryptionFunctionForRelativePath = function(pathRelativeToRoot) {
    return _encryptionHandler.getDecryptionFunctionForRelativePath(pathRelativeToRoot);
  }
};

module.exports = PublicationFetcher;
},{"./content-document-fetcher":13,"./encryption-handler":15,"./markup-parser":16,"./plain-resource-fetcher":17,"./resource-cache":19,"./zip-resource-fetcher":20,"URIjs":5,"jquery":9}],19:[function(require,module,exports){
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

function ResourceCache() {

  var self = this;
  var _resourcesHash = {};

  this.getResourceURL = function(resourceAbsoluteHref) {
    var resourceObjectUrl = _resourcesHash[resourceAbsoluteHref];
    return resourceObjectUrl;
  };

  this.putResourceURL = function(resourceAbsoluteHref, resourceObjectUrl) {
    _resourcesHash[resourceAbsoluteHref] = resourceObjectUrl;
  };
  // TODO: methods to evict resource, destroy cache and release object URLs using window.URL.revokeObjectURL(), automatic
  // cache size accounting and management algorithms like LRU.
};

module.exports = ResourceCache;
},{}],20:[function(require,module,exports){
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

var $ = require('jquery');
var _ = require('underscore');
var URI = require('URIjs');
var ContentTypeDiscovery = require('./discover-content-type');

function ZipResourceFetcher(parentFetcher, baseUrl, libDir) {

  var _checkCrc32 = false;
  var _zipFs;

  // INTERNAL FUNCTIONS

  // Description: perform a function with an initialized zip filesystem, making sure that such filesystem is initialized.
  // Note that due to a race condition, more than one zip filesystem may be instantiated.
  // However, the last one to be set on the model object will prevail and others would be garbage collected later.
  function withZipFsPerform(callback, onerror) {

    if (_zipFs) {

      callback(_zipFs, onerror);

    } else {

      zip.workerScriptsPath = libDir;
      _zipFs = new zip.fs.FS();
      _zipFs.importHttpContent(baseUrl, true, function() {

        callback(_zipFs, onerror);

      }, onerror)
    }
  }

  function fetchFileContents(relativePathRelativeToPackageRoot, readCallback, onerror) {

    if (typeof relativePathRelativeToPackageRoot === 'undefined') {
      throw 'Fetched file relative path is undefined!';
    }

    withZipFsPerform(function(zipFs, onerror) {
      var entry = zipFs.find(relativePathRelativeToPackageRoot);
      if (typeof entry === 'undefined' || entry === null) {
        onerror(new Error('Entry ' + relativePathRelativeToPackageRoot + ' not found in zip ' + baseUrl));
      } else {
        if (entry.directory) {
          onerror(new Error('Entry ' + relativePathRelativeToPackageRoot + ' is a directory while a file has been expected'));
        } else {
          readCallback(entry);
        }
      }
    }, onerror);
  }


  // PUBLIC API

  this.getPackageUrl = function() {
    return baseUrl;
  };

  this.fetchFileContentsText = function(relativePathRelativeToPackageRoot, fetchCallback, onerror) {

    fetchFileContents(relativePathRelativeToPackageRoot, function(entry) {
      entry.getText(fetchCallback, undefined, _checkCrc32);
    }, onerror)
  };

  this.fetchFileContentsData64Uri = function(relativePathRelativeToPackageRoot, fetchCallback, onerror) {
    fetchFileContents(relativePathRelativeToPackageRoot, function(entry) {
      entry.getData64URI(ContentTypeDiscovery.identifyContentTypeFromFileName(relativePathRelativeToPackageRoot),
        fetchCallback, undefined, _checkCrc32);
    }, onerror)
  };

  this.fetchFileContentsBlob = function(relativePathRelativeToPackageRoot, fetchCallback, onerror) {
    var decryptionFunction = parentFetcher.getDecryptionFunctionForRelativePath(relativePathRelativeToPackageRoot);
    if (decryptionFunction) {
      var origFetchCallback = fetchCallback;
      fetchCallback = function(unencryptedBlob) {
        decryptionFunction(unencryptedBlob, function(decryptedBlob) {
          origFetchCallback(decryptedBlob);
        });
      };
    }
    fetchFileContents(relativePathRelativeToPackageRoot, function(entry) {
      entry.getBlob(ContentTypeDiscovery.identifyContentTypeFromFileName(relativePathRelativeToPackageRoot), fetchCallback,
        undefined, _checkCrc32);
    }, onerror)
  };

};

module.exports = ZipResourceFetcher;
},{"./discover-content-type":14,"URIjs":5,"jquery":9,"underscore":10}],21:[function(require,module,exports){
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

var _ = require('underscore')

function Manifest(manifestJson) {

  var _manifestIndexById = {};
  var _navItem;

  this.manifestLength = function() {
    return manifestJson.length;
  };

  this.getManifestItemByIdref = function(idref) {
    return _manifestIndexById[idref];
  };

  /**
   * Iterate over manifest items and apply callback (synchronously) on each one of them.
   * @param iteratorCallback the iterator callback function, will be called once for each manifest item,
   * and the item will be passed as the (one and only) argument.
   * @returns the Manifest object for chaining.
   */
  this.each = function(iteratorCallback) {
    _.each(manifestJson, iteratorCallback);
    return this;
  };

  this.getNavItem = function() {
    return _navItem;
  };

  // Initialize indexes
  this.each(function(manifestItem) {
    _manifestIndexById[manifestItem.id] = manifestItem;

    if (manifestItem.properties && manifestItem.properties.indexOf("nav") !== -1) {
      _navItem = manifestItem;
    }
  });

};

module.exports = Manifest;
},{"underscore":10}],22:[function(require,module,exports){
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

var _ = require('underscore')

function Metadata() {

  var that = this;

  var _mediaItemIndexByRefinesId = {};

  /**
   * Iterate over media items and apply callback (synchronously) on each one of them.
   * @param iteratorCallback the iterator callback function, will be called once for each media item,
   * and the item will be passed as the (one and only) argument.
   * @returns the Metadata object for chaining.
   */
  this.eachMediaItem = function(iteratorCallback) {
    if (that.mediaItems) {
      _.each(that.mediaItems, iteratorCallback);
    }
    return this;
  };

  this.getMediaItemByRefinesId = function(id) {
    return _mediaItemIndexByRefinesId[id];
  };

  this.setMoMap = function(mediaOverlaysMap) {
    that.media_overlay.smil_models = mediaOverlaysMap;
  };

  // Initialize indexes
  this.eachMediaItem(function(item) {
    var id = item.refines;
    var hash = id.indexOf('#');
    if (hash >= 0) {
      var start = hash + 1;
      var end = id.length - 1;
      id = id.substr(start, end);
    }
    id = id.trim();

    _mediaItemIndexByRefinesId[id] = item;
  });


};
module.exports = Metadata;
},{"underscore":10}],23:[function(require,module,exports){
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

var $ = require('jquery')
var _ = require('underscore')
var Backbone = require('backbone')
var Manifest = require('./manifest')
var MarkupParser = require('../epub-fetch/markup-parser')
var Metadata = require('./metadata')
var URI = require('URIjs')
var PackageDocument = require('./package-document')
var SmilDocumentParser = require('./smil-document-parser')

// `PackageDocumentParser` is used to parse the xml of an epub package
// document and build a javascript object. The constructor accepts an
// instance of `URI` that is used to resolve paths during the process
function PackageDocumentParser(bookRoot, publicationFetcher) {

  var _packageFetcher = publicationFetcher;
  var _deferredXmlDom = $.Deferred();
  var _xmlDom;

  function onError(error) {
    if (error) {
      if (error.message) {
        console.error(error.message);
      }
      if (error.stack) {
        console.error(error.stack);
      }
    }
  }

  publicationFetcher.getPackageDom(function(packageDom) {
    _xmlDom = packageDom;
    _deferredXmlDom.resolve(packageDom);
  }, onError);

  function fillSmilData(packageDocument, callback) {

    var smilParser = new SmilDocumentParser(packageDocument, publicationFetcher);

    smilParser.fillSmilData(function() {

      // return the parse result
      callback(packageDocument);
    });

  }

  // Parse an XML package document into a javascript object
  this.parse = function(callback) {

    _deferredXmlDom.done(function(xmlDom) {
      var metadata = getMetadata(xmlDom);

      var spineElem = xmlDom.getElementsByTagNameNS("*", "spine")[0];
      var page_prog_dir = getElemAttr(xmlDom, 'spine', "page-progression-direction");

      // TODO: Bindings are unused
      var bindings = getJsonBindings(xmlDom);

      var manifest = new Manifest(getJsonManifest(xmlDom));
      var spine = getJsonSpine(xmlDom, manifest, metadata);

      // try to find a cover image
      var cover = getCoverHref(xmlDom);
      if (cover) {
        metadata.cover_href = cover;
      }

      $.when(updateMetadataWithIBookProperties(metadata)).then(function() {

        _packageFetcher.setPackageMetadata(metadata, function() {
          var packageDocument = new PackageDocument(publicationFetcher.getPackageUrl(),
            publicationFetcher, metadata, spine, manifest);

          packageDocument.setPageProgressionDirection(page_prog_dir);
          fillSmilData(packageDocument, callback);
        });
      });

    });
  };

  function updateMetadataWithIBookProperties(metadata) {

    var dff = $.Deferred();

    //if layout not set
    if (!metadata.rendition_layout) {
      var pathToIBooksSpecificXml = "/META-INF/com.apple.ibooks.display-options.xml";

      publicationFetcher.relativeToPackageFetchFileContents(pathToIBooksSpecificXml, 'text', function(ibookPropText) {
        if (ibookPropText) {
          var parser = new MarkupParser();
          var propModel = parser.parseXml(ibookPropText);
          var fixLayoutProp = $("option[name=fixed-layout]", propModel)[0];
          if (fixLayoutProp) {
            var fixLayoutVal = $(fixLayoutProp).text();
            if (fixLayoutVal === "true") {
              metadata.rendition_layout = "pre-paginated";
              console.log("using com.apple.ibooks.display-options.xml fixed-layout property");
            }
          }
        }

        dff.resolve();

      }, function(err) {

        console.log("com.apple.ibooks.display-options.xml not found");
        dff.resolve();
      });
    } else {
      dff.resolve();
    }

    return dff.promise();
  }


  function getJsonSpine(xmlDom, manifest, metadata) {

    var $spineElements;
    var jsonSpine = [];

    $spineElements = $(findXmlElemByLocalNameAnyNS(xmlDom, "spine")).children();
    $.each($spineElements, function(spineElementIndex, currSpineElement) {

      var $currSpineElement = $(currSpineElement);
      var idref = $currSpineElement.attr("idref") ? $currSpineElement.attr("idref") : "";
      var manifestItem = manifest.getManifestItemByIdref(idref);

      var id = $currSpineElement.attr("id");
      var viewport = undefined;
      _.each(metadata.rendition_viewports, function(vp) {
        if (vp.refines == id) {
          viewport = vp.viewport;
          return true; // break
        }
      });

      var spineItem = {
        rendition_viewport: viewport,
        idref: idref,
        href: manifestItem.href,
        manifest_id: manifestItem.id,
        media_type: manifestItem.media_type,
        media_overlay_id: manifestItem.media_overlay_id,
        linear: $currSpineElement.attr("linear") ? $currSpineElement.attr("linear") : "",
        properties: $currSpineElement.attr("properties") ? $currSpineElement.attr("properties") : ""
      };

      var parsedProperties = parsePropertiesString(spineItem.properties);
      _.extend(spineItem, parsedProperties);

      jsonSpine.push(spineItem);
    });

    return jsonSpine;
  }

  function findXmlElemByLocalNameAnyNS(rootElement, localName, predicate) {
    var elements = rootElement.getElementsByTagNameNS("*", localName);
    if (predicate) {
      return _.find(elements, predicate);
    } else {
      return elements[0];
    }
  }

  function filterXmlElemsByLocalNameAnyNS(rootElement, localName, predicate) {
    var elements = rootElement.getElementsByTagNameNS("*", localName);
    return _.filter(elements, predicate);
  }

  function getElemText(rootElement, localName, predicate) {
    var foundElement = findXmlElemByLocalNameAnyNS(rootElement, localName, predicate);
    if (foundElement) {
      return foundElement.textContent;
    } else {
      return '';
    }
  }

  function getElemAttr(rootElement, localName, attrName, predicate) {
    var foundElement = findXmlElemByLocalNameAnyNS(rootElement, localName, predicate);
    if (foundElement) {
      return foundElement.getAttribute(attrName);
    } else {
      return '';
    }
  }

  function getMetaElemPropertyText(rootElement, attrPropertyValue) {

    var foundElement = findXmlElemByLocalNameAnyNS(rootElement, "meta", function(element) {
      return element.getAttribute("property") === attrPropertyValue;
    });

    if (foundElement) {
      return foundElement.textContent;
    } else {
      return '';
    }
  }


  function getMetadata(xmlDom) {

    var metadata = new Metadata();
    var metadataElem = findXmlElemByLocalNameAnyNS(xmlDom, "metadata");
    var packageElem = findXmlElemByLocalNameAnyNS(xmlDom, "package");
    var spineElem = findXmlElemByLocalNameAnyNS(xmlDom, "spine");


    metadata.author = getElemText(metadataElem, "creator");
    metadata.description = getElemText(metadataElem, "description");
    metadata.epub_version =
      packageElem.getAttribute("version") ? packageElem.getAttribute("version") : "";
    metadata.id = getElemText(metadataElem, "identifier");
    metadata.language = getElemText(metadataElem, "language");
    metadata.modified_date = getMetaElemPropertyText(metadataElem, "dcterms:modified");
    metadata.ncx = spineElem.getAttribute("toc") ? spineElem.getAttribute("toc") : "";
    metadata.pubdate = getElemText(metadataElem, "date");
    metadata.publisher = getElemText(metadataElem, "publisher");
    metadata.rights = getElemText(metadataElem, "rights");
    metadata.title = getElemText(metadataElem, "title");

    metadata.rendition_orientation = getMetaElemPropertyText(metadataElem, "rendition:orientation");
    metadata.rendition_layout = getMetaElemPropertyText(metadataElem, "rendition:layout");
    metadata.rendition_spread = getMetaElemPropertyText(metadataElem, "rendition:spread");
    metadata.rendition_flow = getMetaElemPropertyText(metadataElem, "rendition:flow");






    //http://www.idpf.org/epub/301/spec/epub-publications.html#fxl-property-viewport

    //metadata.rendition_viewport = getMetaElemPropertyText(metadataElem, "rendition:viewport");
    metadata.rendition_viewport = getElemText(metadataElem, "meta", function(element) {
      return element.getAttribute("property") === "rendition:viewport" && !element.hasAttribute("refines")
    });

    var viewports = [];
    var viewportMetaElems = filterXmlElemsByLocalNameAnyNS(metadataElem, "meta", function(element) {
      return element.getAttribute("property") === "rendition:viewport" && element.hasAttribute("refines");
    });
    _.each(viewportMetaElems, function(currItem) {
      var id = currItem.getAttribute("refines");
      if (id) {
        var hash = id.indexOf('#');
        if (hash >= 0) {
          var start = hash + 1;
          var end = id.length - 1;
          id = id.substr(start, end);
        }
        id = id.trim();
      }

      var vp = {
        refines: id,
        viewport: currItem.textContent
      };
      viewports.push(vp);
    });

    metadata.rendition_viewports = viewports;






    // Media part
    metadata.mediaItems = [];

    var overlayElems = filterXmlElemsByLocalNameAnyNS(metadataElem, "meta", function(element) {
      return element.getAttribute("property") === "media:duration" && element.hasAttribute("refines");
    });

    _.each(overlayElems, function(currItem) {
      metadata.mediaItems.push({
        refines: currItem.getAttribute("refines"),
        duration: SmilDocumentParser.resolveClockValue(currItem.textContent)
      });
    });

    metadata.media_overlay = {
      duration: SmilDocumentParser.resolveClockValue(
        getElemText(metadataElem, "meta", function(element) {
          return element.getAttribute("property") === "media:duration" && !element.hasAttribute("refines")
        })
      ),
      narrator: getMetaElemPropertyText(metadataElem, "media:narrator"),
      activeClass: getMetaElemPropertyText(metadataElem, "media:active-class"),
      playbackActiveClass: getMetaElemPropertyText(metadataElem, "media:playback-active-class"),
      smil_models: [],
      skippables: ["sidebar", "practice", "marginalia", "annotation", "help", "note", "footnote", "rearnote",
        "table", "table-row", "table-cell", "list", "list-item", "pagebreak"
      ],
      escapables: ["sidebar", "bibliography", "toc", "loi", "appendix", "landmarks", "lot", "index",
        "colophon", "epigraph", "conclusion", "afterword", "warning", "epilogue", "foreword",
        "introduction", "prologue", "preface", "preamble", "notice", "errata", "copyright-page",
        "acknowledgments", "other-credits", "titlepage", "imprimatur", "contributors", "halftitlepage",
        "dedication", "help", "annotation", "marginalia", "practice", "note", "footnote", "rearnote",
        "footnotes", "rearnotes", "bridgehead", "page-list", "table", "table-row", "table-cell", "list",
        "list-item", "glossary"
      ]
    };

    return metadata;
  }

  function getJsonManifest(xmlDom) {

    var $manifestItems = $(findXmlElemByLocalNameAnyNS(xmlDom, "manifest")).children();
    var jsonManifest = [];

    $.each($manifestItems, function(manifestElementIndex, currManifestElement) {

      var $currManifestElement = $(currManifestElement);
      var currManifestElementHref = $currManifestElement.attr("href") ? $currManifestElement.attr("href") :
        "";
      var manifestItem = {

        href: currManifestElementHref,
        id: $currManifestElement.attr("id") ? $currManifestElement.attr("id") : "",
        media_overlay_id: $currManifestElement.attr("media-overlay") ?
          $currManifestElement.attr("media-overlay") : "",
        media_type: $currManifestElement.attr("media-type") ? $currManifestElement.attr("media-type") : "",
        properties: $currManifestElement.attr("properties") ? $currManifestElement.attr("properties") : ""
      };
      // console.log('pushing manifest item to JSON manifest. currManifestElementHref: [' + currManifestElementHref + 
      //     '], manifestItem.href: [' + manifestItem.href +
      //     '], manifestItem:');
      // console.log(manifestItem);
      jsonManifest.push(manifestItem);
    });

    return jsonManifest;
  }

  function getJsonBindings(xmlDom) {

    var $bindings = $(findXmlElemByLocalNameAnyNS(xmlDom, "bindings")).children();
    var jsonBindings = [];

    $.each($bindings, function(bindingElementIndex, currBindingElement) {

      var $currBindingElement = $(currBindingElement);
      var binding = {

        handler: $currBindingElement.attr("handler") ? $currBindingElement.attr("handler") : "",
        media_type: $currBindingElement.attr("media-type") ? $currBindingElement.attr("media-type") : ""
      };

      jsonBindings.push(binding);
    });

    return jsonBindings;
  }

  function getCoverHref(xmlDom) {

    var manifest;
    var $imageNode;
    manifest = findXmlElemByLocalNameAnyNS(xmlDom, "manifest");

    // epub3 spec for a cover image is like this:
    /*<item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml" />*/
    $imageNode = $(findXmlElemByLocalNameAnyNS(manifest, "item", function(element) {
      var attr = element.getAttribute("properties");
      return attr && _.contains(attr.split(" "), "cover-image");
    }));
    if ($imageNode.length === 1 && $imageNode.attr("href")) {
      return $imageNode.attr("href");
    }

    // some epub2's cover image is like this:
    /*<meta name="cover" content="cover-image-item-id" />*/
    var metaNode = $(findXmlElemByLocalNameAnyNS(xmlDom, "meta", function(element) {
      return element.getAttribute("name") === "cover";
    }));
    var contentAttr = metaNode.attr("content");
    if (metaNode.length === 1 && contentAttr) {
      $imageNode = $(findXmlElemByLocalNameAnyNS(manifest, "item", function(element) {
        return element.getAttribute("id") === contentAttr;
      }));
      if ($imageNode.length === 1 && $imageNode.attr("href")) {
        return $imageNode.attr("href");
      }
    }

    // that didn't seem to work so, it think epub2 just uses item with id=cover
    $imageNode = $(findXmlElemByLocalNameAnyNS(manifest, "item", function(element) {
      return element.getAttribute("id") === "cover";
    }));
    if ($imageNode.length === 1 && $imageNode.attr("href")) {
      return $imageNode.attr("href");
    }

    // seems like there isn't one, thats ok...
    return null;
  }

  function parsePropertiesString(str) {
    var properties = {};
    var allPropStrs = str.split(" "); // split it on white space
    for (var i = 0; i < allPropStrs.length; i++) {

      //ReadiumSDK.Models.SpineItem.RENDITION_ORIENTATION_LANDSCAPE
      if (allPropStrs[i] === "rendition:orientation-landscape") properties.rendition_orientation = "landscape";

      //ReadiumSDK.Models.SpineItem.RENDITION_ORIENTATION_PORTRAIT
      if (allPropStrs[i] === "rendition:orientation-portrait") properties.rendition_orientation = "portrait";

      //ReadiumSDK.Models.SpineItem.RENDITION_ORIENTATION_AUTO
      if (allPropStrs[i] === "rendition:orientation-auto") properties.rendition_orientation = "auto";


      //ReadiumSDK.Models.SpineItem.RENDITION_SPREAD_NONE
      if (allPropStrs[i] === "rendition:spread-none") properties.rendition_spread = "none";

      //ReadiumSDK.Models.SpineItem.RENDITION_SPREAD_LANDSCAPE
      if (allPropStrs[i] === "rendition:spread-landscape") properties.rendition_spread = "landscape";

      //ReadiumSDK.Models.SpineItem.RENDITION_SPREAD_PORTRAIT
      if (allPropStrs[i] === "rendition:spread-portrait") properties.rendition_spread = "portrait";

      //ReadiumSDK.Models.SpineItem.RENDITION_SPREAD_BOTH
      if (allPropStrs[i] === "rendition:spread-both") properties.rendition_spread = "both";

      //ReadiumSDK.Models.SpineItem.RENDITION_SPREAD_AUTO
      if (allPropStrs[i] === "rendition:spread-auto") properties.rendition_spread = "auto";


      //ReadiumSDK.Models.SpineItem.RENDITION_FLOW_PAGINATED
      if (allPropStrs[i] === "rendition:flow-paginated") properties.rendition_flow = "paginated";

      //ReadiumSDK.Models.SpineItem.RENDITION_FLOW_SCROLLED_CONTINUOUS
      if (allPropStrs[i] === "rendition:flow-scrolled-continuous") properties.rendition_flow = "scrolled-continuous";

      //ReadiumSDK.Models.SpineItem.RENDITION_FLOW_SCROLLED_DOC
      if (allPropStrs[i] === "rendition:flow-scrolled-doc") properties.rendition_flow = "scrolled-doc";

      //ReadiumSDK.Models.SpineItem.RENDITION_FLOW_AUTO
      if (allPropStrs[i] === "rendition:flow-auto") properties.rendition_flow = "auto";



      //ReadiumSDK.Models.SpineItem.SPREAD_CENTER
      if (allPropStrs[i] === "rendition:page-spread-center") properties.page_spread = "page-spread-center";

      //ReadiumSDK.Models.SpineItem.SPREAD_LEFT
      if (allPropStrs[i] === "page-spread-left") properties.page_spread = "page-spread-left";

      //ReadiumSDK.Models.SpineItem.SPREAD_RIGHT
      if (allPropStrs[i] === "page-spread-right") properties.page_spread = "page-spread-right";

      //ReadiumSDK.Models.SpineItem.RENDITION_LAYOUT_REFLOWABLE
      if (allPropStrs[i] === "rendition:layout-reflowable") {
        properties.fixed_flow = false; // TODO: only used in spec tests!
        properties.rendition_layout = "reflowable";
      }

      //ReadiumSDK.Models.SpineItem.RENDITION_LAYOUT_PREPAGINATED
      if (allPropStrs[i] === "rendition:layout-pre-paginated") {
        properties.fixed_flow = true; // TODO: only used in spec tests!
        properties.rendition_layout = "pre-paginated";
      }
    }
    return properties;
  }

};

module.exports = PackageDocumentParser;
},{"../epub-fetch/markup-parser":16,"./manifest":21,"./metadata":22,"./package-document":24,"./smil-document-parser":25,"URIjs":5,"backbone":7,"jquery":9,"underscore":10}],24:[function(require,module,exports){
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


var $ = require('jquery')
var _ = require('underscore')
var Backbone = require('backbone')
var URI = require('URIjs')

// Description: This model provides an interface for navigating an EPUB's package document
function PackageDocument(packageDocumentURL, resourceFetcher, metadata, spine, manifest) {

  var _page_prog_dir;

  this.manifest = manifest;

  this.getSharedJsPackageData = function() {

    var packageDocRoot = packageDocumentURL.substr(0, packageDocumentURL.lastIndexOf("/"));
    return {
      rootUrl: packageDocRoot,
      rendition_viewport: metadata.rendition_viewport,
      rendition_layout: metadata.rendition_layout,
      rendition_orientation: metadata.rendition_orientation,
      rendition_flow: metadata.rendition_flow,
      rendition_spread: metadata.rendition_spread,
      media_overlay: metadata.media_overlay,
      spine: {
        direction: this.getPageProgressionDirection(),
        items: spine
      }
    };
  };

  /**
   * Get spine item data in readium-shared-js accepted format.
   * @param spineIndex the index of the item within the spine
   * @returns Spine item data in readium-shared-js accepted format.
   */
  this.getSpineItem = function(spineIndex) {
    var spineItem = spine[spineIndex];
    return spineItem;
  };

  this.setPageProgressionDirection = function(page_prog_dir) {
    _page_prog_dir = page_prog_dir;
  };


  this.getPageProgressionDirection = function() {
    if (_page_prog_dir === "rtl") {
      return "rtl";
    } else if (_page_prog_dir === "default") {
      return "default";
    } else {
      return "ltr";
    }
  };

  this.spineLength = function() {
    return spine.length;
  };

  this.getMetadata = function() {
    return metadata;
  };

  this.getToc = function() {
    var item = getTocItem();
    if (item) {
      return item.href;
    }
    return null;
  };

  this.getTocText = function(callback) {
    var toc = this.getToc();

    resourceFetcher.relativeToPackageFetchFileContents(toc, 'text', function(tocDocumentText) {
      callback(tocDocumentText)
    }, function(err) {
      console.error('ERROR fetching TOC from [' + toc + ']:');
      console.error(err);
      callback(undefined);
    });
  };

  this.getTocDom = function(callback) {

    this.getTocText(function(tocText) {
      if (typeof tocText === 'string') {
        var tocDom = (new DOMParser()).parseFromString(tocText, "text/xml");
        callback(tocDom);
      } else {
        callback(undefined);
      }
    });
  };

  // Unused?
  this.generateTocListDOM = function(callback) {
    var that = this;
    this.getTocDom(function(tocDom) {
      if (tocDom) {
        if (tocIsNcx()) {
          var $ncxOrderedList;
          $ncxOrderedList = getNcxOrderedList($("navMap", tocDom));
          callback($ncxOrderedList[0]);
        } else {
          var packageDocumentAbsoluteURL = new URI(packageDocumentURL).absoluteTo(document.URL);
          var tocDocumentAbsoluteURL = new URI(that.getToc()).absoluteTo(packageDocumentAbsoluteURL);
          // add a BASE tag to change the TOC document's baseURI.
          var oldBaseTag = $(tocDom).remove('base');
          var newBaseTag = $('<base></base>');
          $(newBaseTag).attr('href', tocDocumentAbsoluteURL);
          $(tocDom).find('head').append(newBaseTag);
          // TODO: fix TOC hrefs both for exploded in zipped EPUBs
          callback(tocDom);
        }
      } else {
        callback(undefined);
      }
    });
  };

  function tocIsNcx() {

    var tocItem = getTocItem();
    var contentDocURI = tocItem.href;
    var fileExtension = contentDocURI.substr(contentDocURI.lastIndexOf('.') + 1);

    return fileExtension.trim().toLowerCase() === "ncx";
  }

  // ----------------------- PRIVATE HELPERS -------------------------------- //

  function getNcxOrderedList($navMapDOM) {

    var $ol = $("<ol></ol>");
    $.each($navMapDOM.children("navPoint"), function(index, navPoint) {
      addNavPointElements($(navPoint), $ol);
    });
    return $ol;
  }

  // Description: Constructs an html representation of NCX navPoints, based on an object of navPoint information
  // Rationale: This is a recursive method, as NCX navPoint elements can nest 0 or more of themselves as children
  function addNavPointElements($navPointDOM, $ol) {

    // Add the current navPoint element to the TOC html
    var navText = $navPointDOM.children("navLabel").text().trim();
    var navHref = $navPointDOM.children("content").attr("src");
    var $navPointLi = $('<li class="nav-elem"></li>').append(
      $('<a></a>', {
        href: navHref,
        text: navText
      })
    );

    // Append nav point info
    $ol.append($navPointLi);

    // Append ordered list of nav points
    if ($navPointDOM.children("navPoint").length > 0) {

      var $newLi = $("<li></li>");
      var $newOl = $("<ol></ol>");
      $.each($navPointDOM.children("navPoint"), function(navIndex, navPoint) {
        $newOl.append(addNavPointElements($(navPoint), $newOl));
      });

      $newLi.append($newOl);
      $ol.append($newLi);
    }
  }

  function getTocItem() {

    var item = manifest.getNavItem();
    if (item) {
      return item;
    }

    var spine_id = metadata.ncx;
    if (spine_id && spine_id.length > 0) {
      return manifest.getManifestItemByIdref(spine_id);
    }

    return null;
  }

};

module.exports = PackageDocument;
},{"URIjs":5,"backbone":7,"jquery":9,"underscore":10}],25:[function(require,module,exports){
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

var $ = require('jquery')
var _ = require('underscore')

// `SmilDocumentParser` is used to parse the xml of an epub package
// document and build a javascript object. The constructor accepts an
// instance of `URI` that is used to resolve paths during the process
function SmilDocumentParser(packageDocument, publicationFetcher) {

  // Parse a media overlay manifest item XML
  this.parse = function(spineItem, manifestItemSMIL, smilJson, deferred, callback, errorCallback) {
    var that = this;
    publicationFetcher.getRelativeXmlFileDom(manifestItemSMIL.href, function(xmlDom) {

      var smil = $("smil", xmlDom)[0];
      smilJson.smilVersion = smil.getAttribute('version');

      //var body = $("body", xmlDom)[0];
      smilJson.children = that.getChildren(smil);
      smilJson.href = manifestItemSMIL.href;
      smilJson.id = manifestItemSMIL.id;
      smilJson.spineItemId = spineItem.idref;

      var mediaItem = packageDocument.getMetadata().getMediaItemByRefinesId(manifestItemSMIL.id);
      if (mediaItem) {
        smilJson.duration = mediaItem.duration;
      }

      callback(deferred, smilJson);
    }, function(fetchError) {
      errorCallback(deferred, fetchError);
    });
  };

  var safeCopyProperty = function(property, fromNode, toItem, isRequired, defaultValue) {
    var propParse = property.split(':');
    var destProperty = propParse[propParse.length - 1];

    if (destProperty === "type") {
      destProperty = "epubtype";
    }

    if (fromNode.getAttribute(property) != undefined) {
      toItem[destProperty] = fromNode.getAttribute(property);
    } else if (isRequired) {
      if (defaultValue !== undefined) {
        toItem[destProperty] = defaultValue;
      } else {
        console.log("Required property " + property + " not found in smil node " + fromNode.nodeName);
      }
    }
  };

  this.getChildren = function(element) {
    var that = this;
    var children = [];

    $.each(element.childNodes, function(elementIndex, currElement) {

      if (currElement.nodeType === 1) { // ELEMENT
        var item = that.createItemFromElement(currElement);
        if (item) {
          children.push(item);
        }
      }
    });

    return children;
  }

  this.createItemFromElement = function(element) {
    var that = this;

    var item = {};
    item.nodeType = element.nodeName;

    var isBody = false;
    if (item.nodeType === "body") {
      isBody = true;
      item.nodeType = "seq";
    }

    if (item.nodeType === "seq") {

      safeCopyProperty("epub:textref", element, item, !isBody);
      safeCopyProperty("id", element, item);
      safeCopyProperty("epub:type", element, item);

      item.children = that.getChildren(element);

    } else if (item.nodeType === "par") {

      safeCopyProperty("id", element, item);
      safeCopyProperty("epub:type", element, item);

      item.children = that.getChildren(element);

    } else if (item.nodeType === "text") {

      safeCopyProperty("src", element, item, true);
      var srcParts = item.src.split('#');
      item.srcFile = srcParts[0];
      item.srcFragmentId = (srcParts.length === 2) ? srcParts[1] : "";
      safeCopyProperty("id", element, item);
      // safeCopyProperty("epub:textref", element, item);

    } else if (item.nodeType === "audio") {
      safeCopyProperty("src", element, item, true);
      safeCopyProperty("id", element, item);
      item.clipBegin = SmilDocumentParser.resolveClockValue(element.getAttribute("clipBegin"));
      item.clipEnd = SmilDocumentParser.resolveClockValue(element.getAttribute("clipEnd"));
    } else {
      return undefined;
    }

    return item;
  }

  function makeFakeSmilJson(spineItem) {
    return {
      id: "",
      href: "",
      spineItemId: spineItem.idref,
      children: [{
        nodeType: 'seq',
        textref: spineItem.href,
        children: [{
          nodeType: 'par',
          children: [{
            nodeType: 'text',
            src: spineItem.href,
            srcFile: spineItem.href,
            srcFragmentId: ""
          }]
        }]
      }]
    };
  }

  this.fillSmilData = function(callback) {
    var that = this;

    if (packageDocument.spineLength() <= 0) {
      callback();
      return;
    }

    var allFakeSmil = true;
    var mo_map = [];
    var parsingDeferreds = [];

    for (var spineIdx = 0; spineIdx < packageDocument.spineLength(); spineIdx++) {
      var spineItem = packageDocument.getSpineItem(spineIdx);

      if (spineItem.media_overlay_id) {
        var manifestItemSMIL = packageDocument.manifest.getManifestItemByIdref(spineItem.media_overlay_id);

        if (!manifestItemSMIL) {
          console.error("Cannot find SMIL manifest item for spine/manifest item?! " + spineItem.media_overlay_id);
          continue;
        }
        //ASSERT manifestItemSMIL.media_type === "application/smil+xml"

        var parsingDeferred = $.Deferred();
        parsingDeferred.media_overlay_id = spineItem.media_overlay_id;
        parsingDeferreds.push(parsingDeferred);
        var smilJson = {};

        // Push the holder object onto the map early so that order isn't disturbed by asynchronicity:
        mo_map.push(smilJson);

        // The local parsingDeferred variable will have its value replaced on next loop iteration.
        // Must pass the parsingDeferred through async calls as an argument and it arrives back as myDeferred.
        that.parse(spineItem, manifestItemSMIL, smilJson, parsingDeferred, function(myDeferred, smilJson) {
          allFakeSmil = false;
          myDeferred.resolve();
        }, function(myDeferred, parseError) {
          console.log('Error when parsing SMIL manifest item ' + manifestItemSMIL.href + ':');
          console.log(parseError);
          myDeferred.resolve();
        });
      } else {
        mo_map.push(makeFakeSmilJson(spineItem));
      }
    }

    $.when.apply($, parsingDeferreds).done(function() {
      packageDocument.getMetadata().setMoMap(mo_map);
      if (allFakeSmil) {
        console.log("No Media Overlays");
        packageDocument.getMetadata().setMoMap([]);
      }
      callback();
    });
  }
};

// parse the timestamp and return the value in seconds
// supports this syntax:
// http://idpf.org/epub/30/spec/epub30-mediaoverlays.html#app-clock-examples
SmilDocumentParser.resolveClockValue = function(value) {
  if (!value) return 0;

  var hours = 0;
  var mins = 0;
  var secs = 0;

  if (value.indexOf("min") != -1) {
    mins = parseFloat(value.substr(0, value.indexOf("min")));
  } else if (value.indexOf("ms") != -1) {
    var ms = parseFloat(value.substr(0, value.indexOf("ms")));
    secs = ms / 1000;
  } else if (value.indexOf("s") != -1) {
    secs = parseFloat(value.substr(0, value.indexOf("s")));
  } else if (value.indexOf("h") != -1) {
    hours = parseFloat(value.substr(0, value.indexOf("h")));
  } else {
    // parse as hh:mm:ss.fraction
    // this also works for seconds-only, e.g. 12.345
    var arr = value.split(":");
    secs = parseFloat(arr.pop());
    if (arr.length > 0) {
      mins = parseFloat(arr.pop());
      if (arr.length > 0) {
        hours = parseFloat(arr.pop());
      }
    }
  }
  var total = hours * 3600 + mins * 60 + secs;
  return total;
}

module.exports = SmilDocumentParser;
},{"jquery":9,"underscore":10}],26:[function(require,module,exports){
(function (process){
var reader = new (require('./light-reader'))({
  useSimpleLoader: true
}, {
  el: '#readium-container'
});

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

var parser = new (require('../lib/epubjs/parser'));

reader.openPackageDocument('demo-book', function onOpenPackageDocument(packageDocument, options) {
  packageDocument.getTocDom(function(html) {
    var toc = document.getElementById('toc');

    // Get a proper TOC object through EPUBJS' parser.
    console.log('toc', parser.nav(html, {}, {}));

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

}).call(this,require('_process'))
},{"../lib/epubjs/parser":1,"./light-reader":27,"URIjs":5,"_process":8}],27:[function(require,module,exports){
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

var $ = require('jquery')
var LightSDK = require('./light-sdk')
var PackageParser = require('./epub/package-document-parser')
var PublicationFetcher = require('./epub-fetch/publication-fetcher')

if (window) {
  //polyfill to support Safari 6
  if ('URL' in window === false) {
    if ('webkitURL' in window === false) {
      throw Error('Browser does not support window.URL');
    }

    window.URL = window.webkitURL;
  }
}

function Reader(readiumOptions, readerOptions) {

  var self = this;

  var _currentPublicationFetcher;

  var jsLibRoot = readiumOptions.jsLibRoot;

  readerOptions.iframeLoader = new LightSDK.Views.IFrameLoader();

  this.reader = new LightSDK.Views.ReaderView(readerOptions);

  this.openPackageDocument = function(bookRoot, callback, openPageRequest) {

    _currentPublicationFetcher = new PublicationFetcher(bookRoot, jsLibRoot);

    _currentPublicationFetcher.initialize(function() {

      var _packageParser = new PackageParser(bookRoot, _currentPublicationFetcher);

      _packageParser.parse(function(packageDocument) {
        var openBookOptions = readiumOptions.openBookOptions || {};
        var openBookData = $.extend(packageDocument.getSharedJsPackageData(), openBookOptions);

        if (openPageRequest) {
          openBookData.openPageRequest = openPageRequest;
        }
        self.reader.openBook(openBookData);

        var options = {
          packageDocumentUrl: _currentPublicationFetcher.getPackageUrl(),
          metadata: packageDocument.getMetadata()
        };

        if (callback) {
          // gives caller access to document metadata like the table of contents
          callback(packageDocument, options);
        }
      });
    });
  }

  //we need global access to the reader object for automation test being able to call it's APIs
  LightSDK.reader = this.reader;

  LightSDK.trigger(LightSDK.Events.READER_INITIALIZED, this.reader);
};

Reader.version = require('../package.json').version;

module.exports = Reader;

},{"../package.json":11,"./epub-fetch/publication-fetcher":18,"./epub/package-document-parser":23,"./light-sdk":49,"jquery":9}],28:[function(require,module,exports){
//  Created by Boris Schneiderman.
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

var Style = require('../models/style')

/**
 *
 * @constructor
 */
function StyleCollection() {

  var _styles = [];

  this.clear = function() {
    _styles.length = 0;

  };

  this.findStyle = function(selector) {

    var count = _styles.length;
    for (var i = 0; i < count; i++) {
      if (_styles[i].selector === selector) {
        return _styles[i];
      }
    }

    return undefined;
  };

  this.addStyle = function(selector, declarations) {

    var style = this.findStyle(selector);

    if (style) {
      style.setDeclarations(declarations);
    } else {
      style = new Style(selector, declarations);
      _styles.push(style);
    }

    return style;
  };

  this.removeStyle = function(selector) {

    var count = _styles.length;

    for (var i = 0; i < count; i++) {

      if (_styles[i].selector === selector) {
        _styles.splice(i, 1);
        return;
      }
    }
  };

  this.getStyles = function() {
    return _styles;
  };

  this.resetStyleValues = function() {

    var count = _styles.length;

    for (var i = 0; i < count; i++) {

      var style = _styles[i];
      var declarations = style.declarations;

      for (var prop in declarations) {
        if (declarations.hasOwnProperty(prop)) {
          declarations[prop] = '';
        }
      }
    }
  }

};

module.exports = StyleCollection
},{"../models/style":59}],29:[function(require,module,exports){
module.exports = {
  /**
   * @event
   */
  READER_INITIALIZED: "ReaderInitialized",
  /**
   * This gets triggered on every page turnover. It includes spine information and such.
   * @event
   */
  PAGINATION_CHANGED: "PaginationChanged",
  /**
   * @event
   */
  SETTINGS_APPLIED: "SettingsApplied",
  /**
   * @event
   */
  FXL_VIEW_RESIZED: "FXLViewResized",
  /**
   * @event
   */
  READER_VIEW_CREATED: "ReaderViewCreated",
  /**
   * @event
   */
  READER_VIEW_DESTROYED: "ReaderViewDestroyed",
  /**
   * @event
   */
  CONTENT_DOCUMENT_LOAD_START: "ContentDocumentLoadStart",
  /**
   * @event
   */
  CONTENT_DOCUMENT_LOADED: "ContentDocumentLoaded",
  /**
   * @event
   */
  MEDIA_OVERLAY_STATUS_CHANGED: "MediaOverlayStatusChanged",
  /**
   * @event
   */
  MEDIA_OVERLAY_TTS_SPEAK: "MediaOverlayTTSSpeak",
  /**
   * @event
   */
  MEDIA_OVERLAY_TTS_STOP: "MediaOverlayTTSStop"
}
},{}],30:[function(require,module,exports){
/**
 *
 * @param str
 * @param suffix
 * @returns {boolean}
 * @static
 */
function BeginsWith(str, suffix) {

  return str.indexOf(suffix) === 0;
};

module.exports = BeginsWith
},{}],31:[function(require,module,exports){
//scale, left, top, angle, origin
function CSSTransformString(options) {
  var enable3D = options.enable3D ? true : false;

  var translate, scale, rotation,
    origin = options.origin;

  if (options.left || options.top) {
    var left = options.left || 0,
      top = options.top || 0;

    translate = enable3D ? ("translate3D(" + left + "px, " + top + "px, 0)") : ("translate(" + left + "px, " + top + "px)");
  }
  if (options.scale) {
    scale = enable3D ? ("scale3D(" + options.scale + ", " + options.scale + ", 0)") : ("scale(" + options.scale + ")");
  }
  if (options.angle) {
    rotation = enable3D ? ("rotate3D(0,0," + options.angle + "deg)") : ("rotate(" + options.angle + "deg)");
  }

  if (!(translate || scale || rotation)) {
    return {};
  }

  var transformString = (translate && scale) ? (translate + " " + scale) : (translate ? translate : scale); // the order is important!
  if (rotation) {
    transformString = transformString + " " + rotation;
    //transformString = rotation + " " + transformString;
  }

  var css = {};
  css['transform'] = transformString;
  css['transform-origin'] = origin ? origin : (enable3D ? '0 0 0' : '0 0');
  return css;
};

module.exports = CSSTransformString
},{}],32:[function(require,module,exports){
var _ = require('underscore')

function CSSTransition($el, trans) {

  // does not work!
  //$el.css('transition', trans);

  var css = {};
  // empty '' prefix FIRST!
  _.each(['', '-webkit-', '-moz-', '-ms-'], function(prefix) {
    css[prefix + 'transition'] = prefix + trans;
  });
  $el.css(css);
}

module.exports = CSSTransition
},{"underscore":10}],33:[function(require,module,exports){
var getOrientation = require('./get-orientation')
var SpineItemConstants = require('../models/spine-item-constants')
var ViewsConstants = require('../views/constants')

/**
 *
 * @param $viewport
 * @param spineItem
 * @param settings
 * @returns {boolean}
 */
//Based on https://docs.google.com/spreadsheet/ccc?key=0AoPMUkQhc4wcdDI0anFvWm96N0xRT184ZE96MXFRdFE&usp=drive_web#gid=0 doc
// Returns falsy and truthy
// true and false mean that the synthetic-spread or single-page is "forced" (to be respected whatever the external conditions)
// 1 and 0 mean that the synthetic-spread or single-page is "not forced" (is allowed to be overriden by external conditions, such as optimum column width / text line number of characters, etc.)
function deduceSyntheticSpread($viewport, spineItem, settings) {

  if (!$viewport || $viewport.length == 0) {
    return 0; // non-forced
  }

  //http://www.idpf.org/epub/fxl/#property-spread-values

  var rendition_spread = spineItem ? spineItem.getRenditionSpread() : undefined;

  if (rendition_spread === SpineItemConstants.RENDITION_SPREAD_NONE) {
    return false; // forced

    //"Reading Systems must not incorporate this spine item in a synthetic spread."
  }

  if (settings.syntheticSpread == "double") {
    return true; // forced
  } else if (settings.syntheticSpread == "single") {
    return false; // forced
  }

  if (!spineItem) {
    return 0; // non-forced
  }

  if (rendition_spread === SpineItemConstants.RENDITION_SPREAD_BOTH) {
    return true; // forced

    //"Reading Systems should incorporate this spine item in a synthetic spread regardless of device orientation."
  }

  var orientation = getOrientation($viewport);

  if (rendition_spread === SpineItemConstants.RENDITION_SPREAD_LANDSCAPE) {
    return orientation === ViewsConstants.ORIENTATION_LANDSCAPE; // forced

    //"Reading Systems should incorporate this spine item in a synthetic spread only when the device is in landscape orientation."
  }

  if (rendition_spread === SpineItemConstants.RENDITION_SPREAD_PORTRAIT) {
    return orientation === ViewsConstants.ORIENTATION_PORTRAIT; // forced

    //"Reading Systems should incorporate this spine item in a synthetic spread only when the device is in portrait orientation."
  }

  if (!rendition_spread || rendition_spread === SpineItemConstants.RENDITION_SPREAD_AUTO) {
    // if no spread set in document and user didn't set in in setting we will do double for landscape
    var landscape = orientation === ViewsConstants.ORIENTATION_LANDSCAPE;
    return landscape ? 1 : 0; // non-forced

    //"Reading Systems may use synthetic spreads in specific or all device orientations as part of a display area utilization optimization process."
  }

  console.warn("Helpers.deduceSyntheticSpread: spread properties?!");
  return 0; // non-forced
};

module.exports = deduceSyntheticSpread
},{"../models/spine-item-constants":56,"../views/constants":65,"./get-orientation":37}],34:[function(require,module,exports){
/**
 *
 * @param str
 * @param suffix
 * @returns {boolean}
 * @static
 */
function EndsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

module.exports = EndsWith
},{}],35:[function(require,module,exports){
//TODO: consider using CSSOM escape() or polyfill
//https://github.com/mathiasbynens/CSS.escape/blob/master/css.escape.js
//http://mathiasbynens.be/notes/css-escapes
/**
 *
 * @param sel
 * @returns {string}
 */
function escapeJQuerySelector(sel) {
  //http://api.jquery.com/category/selectors/
  //!"#$%&'()*+,./:;<=>?@[\]^`{|}~
  // double backslash escape

  if (!sel) return undefined;

  var selector = sel.replace(/([;&,\.\+\*\~\?':"\!\^#$%@\[\]\(\)<=>\|\/\\{}`])/g, '\\$1');

  // if (selector !== sel)
  // {
  //     console.debug("---- SELECTOR ESCAPED");
  //     console.debug("1: " + sel);
  //     console.debug("2: " + selector);
  // }
  // else
  // {
  //     console.debug("---- SELECTOR OKAY: " + sel);
  // }

  return selector;
};
// TESTS BELOW ALL WORKING FINE :)
// (RegExp typos are hard to spot!)
// escapeSelector('!');
// escapeSelector('"');
// escapeSelector('#');
// escapeSelector('$');
// escapeSelector('%');
// escapeSelector('&');
// escapeSelector("'");
// escapeSelector('(');
// escapeSelector(')');
// escapeSelector('*');
// escapeSelector('+');
// escapeSelector(',');
// escapeSelector('.');
// escapeSelector('/');
// escapeSelector(':');
// escapeSelector(';');
// escapeSelector('<');
// escapeSelector('=');
// escapeSelector('>');
// escapeSelector('?');
// escapeSelector('@');
// escapeSelector('[');
// escapeSelector('\\');
// escapeSelector(']');
// escapeSelector('^');
// escapeSelector('`');
// escapeSelector('{');
// escapeSelector('|');
// escapeSelector('}');
// escapeSelector('~');

module.exports = escapeJQuerySelector
},{}],36:[function(require,module,exports){
function extendedThrottle(startCb, tickCb, endCb, tickRate, waitThreshold, context) {
  if (!tickRate) tickRate = 250;
  if (!waitThreshold) waitThreshold = tickRate;

  var first = true,
    last,
    deferTimer;

  return function() {
    var ctx = context || this,
      now = (Date.now && Date.now()) || new Date().getTime(),
      args = arguments;

    if (!(last && now < last + tickRate)) {
      last = now;
      if (first) {
        startCb.apply(ctx, args);
        first = false;
      } else {
        tickCb.apply(ctx, args);
      }
    }

    clearTimeout(deferTimer);
    deferTimer = setTimeout(function() {
      last = now;
      first = true;
      endCb.apply(ctx, args);
    }, waitThreshold);
  };
};

module.exports = extendedThrottle
},{}],37:[function(require,module,exports){
var ViewsConstants = require('../views/constants')

/**
 *
 * @param $viewport
 * @returns {ReadiumSDK.Views.ORIENTATION_LANDSCAPE|ReadiumSDK.Views.ORIENTATION_PORTRAIT}
 */
function getOrientation($viewport) {

  var viewportWidth = $viewport.width();
  var viewportHeight = $viewport.height();

  if (!viewportWidth || !viewportHeight) {
    return undefined;
  }

  return viewportWidth >= viewportHeight ? ViewsConstants.ORIENTATION_LANDSCAPE : ViewsConstants.ORIENTATION_PORTRAIT;
};

module.exports = getOrientation
},{"../views/constants":65}],38:[function(require,module,exports){
//  LauncherOSX
//
//  Created by Boris Schneiderman.
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

module.exports = {
  BeginsWith: require('./begins-with'),
  CSSTransition: require('./css-transition'),
  CSSTransformString: require('./css-transform-string'),
  deduceSyntheticSpread: require('./deduce-synthetic-spread'),
  EndsWith: require('./ends-with'),
  escapeJQuerySelector: require('./escape-jquery-selector'),
  extendedThrottle: require('./extended-throttle'),
  getOrientation: require('./get-orientation'),
  isIframeAlive: require('./is-iframe-alive'),
  isRenditionSpreadPermittedForItem: require('./is-rendition-spread-permitted-for-item'),
  loadTemplate: require('./load-template'),
  Margins: require('./margins'),
  Rect: require('./rect'),
  RemoveFromString: require('./remove-from-string'),
  ResolveContentRef: require('./resolve-content-ref'),
  setStyles: require('./set-styles'),
  triggerLayout: require('./trigger-layout'),
  UpdateHtmlFontSize: require('./update-html-font-size')
}
},{"./begins-with":30,"./css-transform-string":31,"./css-transition":32,"./deduce-synthetic-spread":33,"./ends-with":34,"./escape-jquery-selector":35,"./extended-throttle":36,"./get-orientation":37,"./is-iframe-alive":39,"./is-rendition-spread-permitted-for-item":40,"./load-template":41,"./margins":42,"./rect":43,"./remove-from-string":44,"./resolve-content-ref":45,"./set-styles":46,"./trigger-layout":47,"./update-html-font-size":48}],39:[function(require,module,exports){
/**
 *
 * @param iframe
 * @returns {boolean}
 */
function isIframeAlive(iframe) {
  var w = undefined;
  var d = undefined;
  try {
    w = iframe.contentWindow;
    d = iframe.contentDocument;
  } catch (ex) {
    console.error(ex);
    return false;
  }

  return w && d;
}

module.exports = isIframeAlive
},{}],40:[function(require,module,exports){
var SpineItemConstants = require('../models/spine-item-constants')
var ViewsConstants = require('../views/constants')

/**
 *
 * @param item
 * @param orientation
 * @returns {boolean}
 */
function isRenditionSpreadPermittedForItem(item, orientation) {

  var rendition_spread = item.getRenditionSpread();

  return !rendition_spread || rendition_spread == SpineItemConstants.RENDITION_SPREAD_BOTH || rendition_spread == SpineItemConstants.RENDITION_SPREAD_AUTO || (rendition_spread == SpineItemConstants.RENDITION_SPREAD_LANDSCAPE && orientation == ViewsConstants.ORIENTATION_LANDSCAPE) || (rendition_spread == SpineItemConstants.RENDITION_SPREAD_PORTRAIT && orientation == ViewsConstants.ORIENTATION_PORTRAIT);
};

module.exports = isRenditionSpreadPermittedForItem
},{"../models/spine-item-constants":56,"../views/constants":65}],41:[function(require,module,exports){
/**
 *
 * @param name
 * @param params
 * @returns {Helpers.loadTemplate.cache}
 */
function loadTemplate(name, params) {
  return loadTemplate.cache[name];
};

/**
 *
 * @type {{fixed_book_frame: string, single_page_frame: string, scrolled_book_frame: string, reflowable_book_frame: string, reflowable_book_page_frame: string}}
 */
loadTemplate.cache = {
  "fixed_book_frame": '<div id="fixed-book-frame" class="clearfix book-frame fixed-book-frame"></div>',

  "single_page_frame": '<div><div id="scaler"><iframe scrolling="no" class="iframe-fixed"></iframe></div></div>',
  //"single_page_frame" : '<div><iframe scrolling="no" class="iframe-fixed" id="scaler"></iframe></div>',

  "scrolled_book_frame": '<div id="reflowable-book-frame" class="clearfix book-frame reflowable-book-frame"><div id="scrolled-content-frame"></div></div>',
  "reflowable_book_frame": '<div id="reflowable-book-frame" class="clearfix book-frame reflowable-book-frame"></div>',
  "reflowable_book_page_frame": '<div id="reflowable-content-frame" class="reflowable-content-frame"><iframe scrolling="no" id="epubContentIframe"></iframe></div>'
};

module.exports = loadTemplate;
},{}],42:[function(require,module,exports){
/**
 *
 * @param margin
 * @param border
 * @param padding
 * @constructor
 */
function Margins(margin, border, padding) {

  this.margin = margin;
  this.border = border;
  this.padding = padding;

  this.left = this.margin.left + this.border.left + this.padding.left;
  this.right = this.margin.right + this.border.right + this.padding.right;
  this.top = this.margin.top + this.border.top + this.padding.top;
  this.bottom = this.margin.bottom + this.border.bottom + this.padding.bottom;

  this.width = function() {
    return this.left + this.right;
  };

  this.height = function() {
    return this.top + this.bottom;
  }
};

/**
 *
 * @param $element
 * @returns {Helpers.Rect}
 */
Margins.fromElement = function($element) {
  return new this($element.margin(), $element.border(), $element.padding());
};

/**
 * @returns {Helpers.Rect}
 */
Margins.empty = function() {

  return new this({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }, {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }, {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  });

};

module.exports = Margins
},{}],43:[function(require,module,exports){
/**
 *
 * @param left
 * @param top
 * @param width
 * @param height
 * @constructor
 */
function Rect(left, top, width, height) {

  this.left = left;
  this.top = top;
  this.width = width;
  this.height = height;

  this.right = function() {
    return this.left + this.width;
  };

  this.bottom = function() {
    return this.top + this.height;
  };

  this.isOverlap = function(rect, tolerance) {

    if (tolerance == undefined) {
      tolerance = 0;
    }

    return !(rect.right() < this.left + tolerance ||
      rect.left > this.right() - tolerance ||
      rect.bottom() < this.top + tolerance ||
      rect.top > this.bottom() - tolerance);
  }
};

/**
 *
 * @param $element
 * @returns {Helpers.Rect}
 */
//This method treats multicolumn view as one long column and finds the rectangle of the element in this "long" column
//we are not using jQuery Offset() and width()/height() function because for multicolumn rendition_layout it produces rectangle as a bounding box of element that
// reflows between columns this is inconstant and difficult to analyze .
Rect.fromElement = function($element) {

  var e;
  if (_.isArray($element) || $element instanceof jQuery)
    e = $element[0];
  else
    e = $element;
  // TODODM this is somewhat hacky. Text (range?) elements don't have a position so we have to ask the parent.
  if (e.nodeType === 3) {
    e = $element.parent()[0];
  }


  var offsetLeft = e.offsetLeft;
  var offsetTop = e.offsetTop;
  var offsetWidth = e.offsetWidth;
  var offsetHeight = e.offsetHeight;

  while (e = e.offsetParent) {
    offsetLeft += e.offsetLeft;
    offsetTop += e.offsetTop;
  }

  return new Rect(offsetLeft, offsetTop, offsetWidth, offsetHeight);
};

module.exports = Rect
},{}],44:[function(require,module,exports){
/**
 *
 * @param str
 * @param toRemove
 * @returns {string}
 * @static
 */
function RemoveFromString(str, toRemove) {

  var startIx = str.indexOf(toRemove);

  if (startIx == -1) {
    return str;
  }

  return str.substring(0, startIx) + str.substring(startIx + toRemove.length);
};

module.exports = RemoveFromString
},{}],45:[function(require,module,exports){
/**
 *
 * @param contentRef
 * @param sourceFileHref
 * @returns {string}
 * @constructor
 */
function ResolveContentRef(contentRef, sourceFileHref) {

  if (!sourceFileHref) {
    return contentRef;
  }

  var sourceParts = sourceFileHref.split("/");
  sourceParts.pop(); //remove source file name

  var pathComponents = contentRef.split("/");

  while (sourceParts.length > 0 && pathComponents[0] === "..") {

    sourceParts.pop();
    pathComponents.splice(0, 1);
  }

  var combined = sourceParts.concat(pathComponents);

  return combined.join("/");

};

module.exports = ResolveContentRef
},{}],46:[function(require,module,exports){
/**
 *
 * @param styles
 * @param $element
 */
function setStyles(styles, $element) {

  var count = styles.length;

  if (!count) {
    return;
  }

  for (var i = 0; i < count; i++) {
    var style = styles[i];
    if (style.selector) {
      $(style.selector, $element).css(style.declarations);
    } else {
      $element.css(style.declarations);
    }
  }

};

module.exports = setStyles
},{}],47:[function(require,module,exports){
/**
 *
 * @param $iframe
 */
function triggerLayout($iframe) {

  var doc = $iframe[0].contentDocument;

  if (!doc) {
    return;
  }

  var ss = undefined;
  try {
    ss = doc.styleSheets && doc.styleSheets.length ? doc.styleSheets[0] : undefined;
    if (!ss) {
      var style = doc.createElement('style');
      doc.head.appendChild(style);
      style.appendChild(doc.createTextNode(''));
      ss = style.sheet;
    }

    if (ss)
      ss.insertRule('body:first-child::before {content:\'READIUM\';color: red;font-weight: bold;}', ss.cssRules.length);
  } catch (ex) {
    console.error(ex);
  }

  try {
    var el = doc.createElementNS("http://www.w3.org/1999/xhtml", "style");
    el.appendChild(doc.createTextNode("*{}"));
    doc.body.appendChild(el);
    doc.body.removeChild(el);

    if (ss)
      ss.deleteRule(ss.cssRules.length - 1);
  } catch (ex) {
    console.error(ex);
  }

  if (doc.body) {
    var val = doc.body.offsetTop; // triggers layout
  }

};

module.exports = triggerLayout
},{}],48:[function(require,module,exports){
var $ = require('jquery')
require('../../../lib/jquery-sizes')

function UpdateHtmlFontSize($epubHtml, fontSize) {
  var factor = fontSize / 100;
  var win = $epubHtml[0].ownerDocument.defaultView;
  var $textblocks = $('p, div, span, h1, h2, h3, h4, h5, h6, li, blockquote, td, pre', $epubHtml);
  var originalLineHeight;


  // need to do two passes because it is possible to have nested text blocks. 
  // If you change the font size of the parent this will then create an inaccurate
  // font size for any children. 
  for (var i = 0; i < $textblocks.length; i++) {
    var ele = $textblocks[i],
      fontSizeAttr = ele.getAttribute('data-original-font-size');

    if (!fontSizeAttr) {
      var style = win.getComputedStyle(ele);
      var originalFontSize = parseInt(style.fontSize);
      originalLineHeight = parseInt(style.lineHeight);

      ele.setAttribute('data-original-font-size', originalFontSize);
      // getComputedStyle will not calculate the line-height if the value is 'normal'. In this case parseInt will return NaN
      if (originalLineHeight) {
        ele.setAttribute('data-original-line-height', originalLineHeight);
      }
    }
  }

  // reset variable so the below logic works. All variables in JS are function scoped. 
  originalLineHeight = 0;
  for (var i = 0; i < $textblocks.length; i++) {
    var ele = $textblocks[i],
      fontSizeAttr = ele.getAttribute('data-original-font-size'),
      lineHeightAttr = ele.getAttribute('data-original-line-height'),
      originalFontSize = Number(fontSizeAttr);

    if (lineHeightAttr) {
      originalLineHeight = Number(lineHeightAttr);
    } else {
      originalLineHeight = 0;
    }

    ele.style.fontSize = (originalFontSize * factor) + 'px';
    if (originalLineHeight) {
      ele.style.lineHeight = (originalLineHeight * factor) + 'px';
    }

  }
  $epubHtml.css("font-size", fontSize + "%");
}

module.exports = UpdateHtmlFontSize
},{"../../../lib/jquery-sizes":2,"jquery":9}],49:[function(require,module,exports){
var _ = require('underscore'),
  Backbone = require('backbone')

var ReadiumSDK = {
  Views: require('./views'),
  Events: require('./events'),
  version: function() {
    return "0.8.0";
  }
}

require('./navigator-shim')

_.extend(ReadiumSDK, Backbone.Events)

module.exports = ReadiumSDK
},{"./events":29,"./navigator-shim":63,"./views":67,"backbone":7,"underscore":10}],50:[function(require,module,exports){
    /**
     * Internal Events
     *
     * @desc Should not be triggered outside of {@link ReadiumSDK.Views.ReaderView}.
     * @namespace
     */

    module.exports = {
      /**
       * @event
       */
      CURRENT_VIEW_PAGINATION_CHANGED: "CurrentViewPaginationChanged",
    }
},{}],51:[function(require,module,exports){
//  Created by Boris Schneiderman.
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


/**
 * @class ReadiumSDK.Models.BookmarkData
 */
function BookmarkData(idref, contentCFI) {

  /**
   * spine item idref
   * @property idref
   * @type {string}
   */
  this.idref = idref;

  /**
   * cfi of the first visible element
   * @property contentCFI
   * @type {string}
   */
  this.contentCFI = contentCFI;

  this.toString = function() {
    return JSON.stringify(this);
  }
};

module.exports = BookmarkData
},{}],52:[function(require,module,exports){
//  Created by Boris Schneiderman.
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

/**
 * Used to report pagination state back to the host application
 *
 * @class ReadiumSDK.Models.CurrentPagesInfo
 *
 * @constructor
 *
 * @param {ReadiumSDK.Models.Spine} spine
 * @param {boolean} isFixedLayout is fixed or reflowable spine item
 */

function CurrentPagesInfo(spine, isFixedLayout) {


  this.isRightToLeft = spine.isRightToLeft();
  this.isFixedLayout = isFixedLayout;
  this.spineItemCount = spine.items.length
  this.openPages = [];

  this.addOpenPage = function(spineItemPageIndex, spineItemPageCount, idref, spineItemIndex) {
    this.openPages.push({
      spineItemPageIndex: spineItemPageIndex,
      spineItemPageCount: spineItemPageCount,
      idref: idref,
      spineItemIndex: spineItemIndex
    });

    this.sort();
  };

  this.canGoLeft = function() {
    return this.isRightToLeft ? this.canGoNext() : this.canGoPrev();
  };

  this.canGoRight = function() {
    return this.isRightToLeft ? this.canGoPrev() : this.canGoNext();
  };

  this.canGoNext = function() {

    if (this.openPages.length == 0)
      return false;

    var lastOpenPage = this.openPages[this.openPages.length - 1];

    // TODO: handling of non-linear spine items ("ancillary" documents), allowing page turn within the reflowable XHTML, but preventing previous/next access to sibling spine items. Also needs "go back" feature to navigate to source hyperlink location that led to the non-linear document.
    // See https://github.com/readium/readium-shared-js/issues/26

    // Removed, needs to be implemented properly as per above.
    // See https://github.com/readium/readium-shared-js/issues/108
    // if(!spine.isValidLinearItem(lastOpenPage.spineItemIndex))
    //     return false;

    return lastOpenPage.spineItemIndex < spine.last().index || lastOpenPage.spineItemPageIndex < lastOpenPage.spineItemPageCount - 1;
  };

  this.canGoPrev = function() {

    if (this.openPages.length == 0)
      return false;

    var firstOpenPage = this.openPages[0];

    // TODO: handling of non-linear spine items ("ancillary" documents), allowing page turn within the reflowable XHTML, but preventing previous/next access to sibling spine items. Also needs "go back" feature to navigate to source hyperlink location that led to the non-linear document.
    // See https://github.com/readium/readium-shared-js/issues/26

    // Removed, needs to be implemented properly as per above.
    // //https://github.com/readium/readium-shared-js/issues/108
    // if(!spine.isValidLinearItem(firstOpenPage.spineItemIndex))
    //     return false;

    return spine.first().index < firstOpenPage.spineItemIndex || 0 < firstOpenPage.spineItemPageIndex;
  };

  this.sort = function() {

    this.openPages.sort(function(a, b) {

      if (a.spineItemIndex != b.spineItemIndex) {
        return a.spineItemIndex - b.spineItemIndex;
      }

      return a.pageIndex - b.pageIndex;

    });

  };

}

module.exports = CurrentPagesInfo
},{}],53:[function(require,module,exports){
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

/**
 *
 * @param package
 * @constructor
 */
var MediaOverlay = function(package) {

  this.package = package;


  this.parallelAt = function(timeMilliseconds) {
    var offset = 0;

    for (var i = 0; i < this.smil_models.length; i++) {
      var smilData = this.smil_models[i];

      var timeAdjusted = timeMilliseconds - offset;

      var para = smilData.parallelAt(timeAdjusted);
      if (para) {
        return para;
      }

      offset += smilData.durationMilliseconds_Calculated();
    }

    return undefined;
  };

  this.percentToPosition = function(percent, smilData, par, milliseconds) {
    if (percent < 0.0 || percent > 100.0) {
      percent = 0.0;
    }

    var total = this.durationMilliseconds_Calculated();

    var timeMs = total * (percent / 100.0);

    par.par = this.parallelAt(timeMs);
    if (!par.par) {
      return;
    }

    var smilDataPar = par.par.getSmil();
    if (!smilDataPar) {
      return;
    }

    var smilDataOffset = 0;

    for (var i = 0; i < this.smil_models.length; i++) {
      smilData.smilData = this.smil_models[i];
      if (smilData.smilData == smilDataPar) {
        break;
      }
      smilDataOffset += smilData.smilData.durationMilliseconds_Calculated();
    }

    milliseconds.milliseconds = timeMs - (smilDataOffset + smilData.smilData.clipOffset(par.par));
  };

  this.durationMilliseconds_Calculated = function() {
    var total = 0;

    for (var i = 0; i < this.smil_models.length; i++) {
      var smilData = this.smil_models[i];

      total += smilData.durationMilliseconds_Calculated();
    }

    return total;
  };

  this.smilAt = function(smilIndex) {
    if (smilIndex < 0 || smilIndex >= this.smil_models.length) {
      return undefined;
    }

    return this.smil_models[smilIndex];
  }

  this.positionToPercent = function(smilIndex, parIndex, milliseconds) {
    // console.log(">>>>>>>>>>");
    // console.log(milliseconds);
    // console.log(smilIndex);
    // console.log(parIndex);
    // console.log("-------");

    if (smilIndex >= this.smil_models.length) {
      return -1.0;
    }

    var smilDataOffset = 0;
    for (var i = 0; i < smilIndex; i++) {
      var sd = this.smil_models[i];
      smilDataOffset += sd.durationMilliseconds_Calculated();
    }

    //console.log(smilDataOffset);

    var smilData = this.smil_models[smilIndex];

    var par = smilData.nthParallel(parIndex);
    if (!par) {
      return -1.0;
    }

    var offset = smilDataOffset + smilData.clipOffset(par) + milliseconds;

    //console.log(offset);

    var total = this.durationMilliseconds_Calculated();

    ///console.log(total);

    var percent = (offset / total) * 100;

    //console.log("<<<<<<<<<<< " + percent);

    return percent;
  };

  this.smil_models = [];

  this.skippables = [];
  this.escapables = [];

  this.duration = undefined;
  this.narrator = undefined;


  this.activeClass = undefined;
  this.playbackActiveClass = undefined;

  this.DEBUG = false;


  this.getSmilBySpineItem = function(spineItem) {
    if (!spineItem) return undefined;

    for (var i = 0, count = this.smil_models.length; i < count; i++) {
      var smil = this.smil_models[i];
      if (smil.spineItemId === spineItem.idref) {
        if (spineItem.media_overlay_id !== smil.id) {
          console.error("SMIL INCORRECT ID?? " + spineItem.media_overlay_id + " /// " + smil.id);
        }
        return smil;
      }
    }

    return undefined;
  };

  /*
  this.getSmilById = function (id) {

      for(var i = 0, count = this.smil_models.length; i < count; i++) {

          var smil = this.smil_models[i];
          if(smil.id === id) {
              return smil;
          }
      }

      return undefined;
  };
  */

  this.getNextSmil = function(smil) {

    var index = this.smil_models.indexOf(smil);
    if (index == -1 || index == this.smil_models.length - 1) {
      return undefined;
    }

    return this.smil_models[index + 1];
  }

  this.getPreviousSmil = function(smil) {

    var index = this.smil_models.indexOf(smil);
    if (index == -1 || index == 0) {
      return undefined;
    }

    return this.smil_models[index - 1];
  }
};

MediaOverlay.fromDTO = function(moDTO, package) {

  var mo = new MediaOverlay(package);

  if (!moDTO) {
    console.debug("No Media Overlay.");
    return mo;
  }

  console.debug("Media Overlay INIT...");

  // if (mo.DEBUG)
  //     console.debug(JSON.stringify(moDTO));

  mo.duration = moDTO.duration;
  if (mo.duration && mo.duration.length && mo.duration.length > 0) {
    console.error("SMIL total duration is string, parsing float... (" + mo.duration + ")");
    mo.duration = parseFloat(mo.duration);
  }
  if (mo.DEBUG)
    console.debug("Media Overlay Duration (TOTAL): " + mo.duration);

  mo.narrator = moDTO.narrator;
  if (mo.DEBUG)
    console.debug("Media Overlay Narrator: " + mo.narrator);

  mo.activeClass = moDTO.activeClass;
  if (mo.DEBUG)
    console.debug("Media Overlay Active-Class: " + mo.activeClass);

  mo.playbackActiveClass = moDTO.playbackActiveClass;
  if (mo.DEBUG)
    console.debug("Media Overlay Playback-Active-Class: " + mo.playbackActiveClass);

  var count = moDTO.smil_models.length;
  if (mo.DEBUG)
    console.debug("Media Overlay SMIL count: " + count);

  for (var i = 0; i < count; i++) {
    var smilModel = SmilModel.fromSmilDTO(moDTO.smil_models[i], mo);
    mo.smil_models.push(smilModel);

    if (mo.DEBUG)
      console.debug("Media Overlay Duration (SPINE ITEM): " + smilModel.duration);
  }

  count = moDTO.skippables.length;
  if (mo.DEBUG)
    console.debug("Media Overlay SKIPPABLES count: " + count);

  for (var i = 0; i < count; i++) {
    mo.skippables.push(moDTO.skippables[i]);

    //if (mo.DEBUG)
    //    console.debug("Media Overlay SKIPPABLE: " + mo.skippables[i]);
  }

  count = moDTO.escapables.length;
  if (mo.DEBUG)
    console.debug("Media Overlay ESCAPABLES count: " + count);

  for (var i = 0; i < count; i++) {
    mo.escapables.push(moDTO.escapables[i]);

    //if (mo.DEBUG)
    //    console.debug("Media Overlay ESCAPABLE: " + mo.escapables[i]);
  }

  return mo;
};

module.exports = MediaOverlay
},{}],54:[function(require,module,exports){
//  Created by Boris Schneiderman.
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

var Helpers = require('../helpers')
var MediaOverlay = require('./media-overlay')
var Spine = require('./spine')
var SpineItemConstants = require('./spine-item-constants')

/**
 *
 * @class ReadiumSDK.Models.Package
 * @constructor
 */

var Package = function(packageData) {

  var self = this;

  this.spine = undefined;

  this.rootUrl = undefined;
  this.rootUrlMO = undefined;

  this.media_overlay = undefined;

  this.rendition_viewport = undefined;

  this.rendition_flow = undefined;

  this.rendition_layout = undefined;

  //TODO: unused yet!
  this.rendition_spread = undefined;

  //TODO: unused yet!
  this.rendition_orientation = undefined;

  this.resolveRelativeUrlMO = function(relativeUrl) {

    if (self.rootUrlMO && self.rootUrlMO.length > 0) {

      if (Helpers.EndsWith(self.rootUrlMO, "/")) {
        return self.rootUrlMO + relativeUrl;
      } else {
        return self.rootUrlMO + "/" + relativeUrl;
      }
    }

    return self.resolveRelativeUrl(relativeUrl);
  };

  this.resolveRelativeUrl = function(relativeUrl) {

    if (self.rootUrl) {

      if (Helpers.EndsWith(self.rootUrl, "/")) {
        return self.rootUrl + relativeUrl;
      } else {
        return self.rootUrl + "/" + relativeUrl;
      }
    }

    return relativeUrl;
  };

  this.isFixedLayout = function() {
    return self.rendition_layout === SpineItemConstants.RENDITION_LAYOUT_PREPAGINATED;
  };

  this.isReflowable = function() {
    return !self.isFixedLayout();
  };


  if (packageData) {

    this.rootUrl = packageData.rootUrl;
    this.rootUrlMO = packageData.rootUrlMO;

    this.rendition_viewport = packageData.rendition_viewport;

    this.rendition_layout = packageData.rendition_layout;

    this.rendition_flow = packageData.rendition_flow;
    this.rendition_orientation = packageData.rendition_orientation;
    this.rendition_spread = packageData.rendition_spread;

    this.spine = new Spine(this, packageData.spine);

    this.media_overlay = MediaOverlay.fromDTO(packageData.media_overlay, this);
  }
};

module.exports = Package
},{"../helpers":38,"./media-overlay":53,"./spine":58,"./spine-item-constants":56}],55:[function(require,module,exports){
//  Created by Boris Schneiderman.
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

/**
 * Representation of opening page request
 * Provides the spine item to be opened and one of the following properties:
 *  spineItemPageIndex {Number},
 *  elementId {String},
 *  elementCfi {String},
 *  firstPage {bool},
 *  lastPage {bool}
 *
 * @param {ReadiumSDK.Models.SpineItem} spineItem
 * @param {object} [initiator]
 *
 * @constructor
 */
var PageOpenRequest = function(spineItem, initiator) {

  this.spineItem = spineItem;
  this.spineItemPageIndex = undefined;
  this.elementId = undefined;
  this.elementCfi = undefined;
  this.firstPage = false;
  this.lastPage = false;
  this.initiator = initiator;

  this.reset = function() {
    this.spineItemPageIndex = undefined;
    this.elementId = undefined;
    this.elementCfi = undefined;
    this.firstPage = false;
    this.lastPage = false;
  };

  this.setFirstPage = function() {
    this.reset();
    this.firstPage = true;
  };

  this.setLastPage = function() {
    this.reset();
    this.lastPage = true;
  };

  this.setPageIndex = function(pageIndex) {
    this.reset();
    this.spineItemPageIndex = pageIndex;
  };

  this.setElementId = function(elementId) {
    this.reset();
    this.elementId = elementId;
  };

  this.setElementCfi = function(elementCfi) {

    this.reset();
    this.elementCfi = elementCfi;
  };


};

module.exports = PageOpenRequest
},{}],56:[function(require,module,exports){
module.exports = {
  RENDITION_LAYOUT_REFLOWABLE: "reflowable",
  RENDITION_LAYOUT_PREPAGINATED: "pre-paginated",

  RENDITION_ORIENTATION_LANDSCAPE: "landscape",
  RENDITION_ORIENTATION_PORTRAIT: "portrait",
  RENDITION_ORIENTATION_AUTO: "auto",

  SPREAD_LEFT: "page-spread-left",
  SPREAD_RIGHT: "page-spread-right",
  SPREAD_CENTER: "page-spread-center",

  RENDITION_SPREAD_NONE: "none",
  RENDITION_SPREAD_LANDSCAPE: "landscape",
  RENDITION_SPREAD_PORTRAIT: "portrait",
  RENDITION_SPREAD_BOTH: "both",
  RENDITION_SPREAD_AUTO: "auto",

  RENDITION_FLOW_PAGINATED: "paginated",
  RENDITION_FLOW_SCROLLED_CONTINUOUS: "scrolled-continuous",
  RENDITION_FLOW_SCROLLED_DOC: "scrolled-doc",
  RENDITION_FLOW_AUTO: "auto"
}
},{}],57:[function(require,module,exports){
//  Created by Boris Schneiderman.
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

var Constants = require('./spine-item-constants')

/**
 * Wrapper of the SpineItem object received from the host application
 *
 * @class SpineItem
 *
 * @param itemData spine item properties container
 * @param {Number} index
 * @param {Spine} spine
 *
 */
var SpineItem = function(itemData, index, spine) {

  var self = this;

  this.idref = itemData.idref;
  this.href = itemData.href;

  this.linear = itemData.linear ? itemData.linear.toLowerCase() : itemData.linear;

  this.page_spread = itemData.page_spread;

  this.rendition_viewport = itemData.rendition_viewport;

  this.rendition_spread = itemData.rendition_spread;

  //TODO: unused yet!
  this.rendition_orientation = itemData.rendition_orientation;

  this.rendition_layout = itemData.rendition_layout;

  this.rendition_flow = itemData.rendition_flow;



  this.media_overlay_id = itemData.media_overlay_id;

  this.media_type = itemData.media_type;

  this.index = index;
  this.spine = spine;

  validateSpread();

  this.setSpread = function(spread) {
    this.page_spread = spread;

    validateSpread();
  };

  this.isRenditionSpreadAllowed = function() {

    var rendition_spread = self.getRenditionSpread();
    return !rendition_spread || rendition_spread != Constants.RENDITION_SPREAD_NONE;
  };

  function validateSpread() {

    if (!self.page_spread) {
      return;
    }

    if (self.page_spread != Constants.SPREAD_LEFT &&
      self.page_spread != Constants.SPREAD_RIGHT &&
      self.page_spread != Constants.SPREAD_CENTER) {

      console.error(self.page_spread + " is not a recognized spread type");
    }

  }

  this.isLeftPage = function() {
    return self.page_spread == Constants.SPREAD_LEFT;
  };

  this.isRightPage = function() {
    return self.page_spread == Constants.SPREAD_RIGHT;
  };

  this.isCenterPage = function() {
    return self.page_spread == Constants.SPREAD_CENTER;
  };

  this.isReflowable = function() {
    return !self.isFixedLayout();
  };

  this.isFixedLayout = function() {

    // cannot use isPropertyValueSetForItemOrPackage() here!

    var isLayoutExplicitlyDefined = self.getRenditionLayout();

    if (isLayoutExplicitlyDefined) {

      if (self.rendition_layout) {
        if (self.rendition_layout === Constants.RENDITION_LAYOUT_PREPAGINATED) return true;
        if (self.rendition_layout === Constants.RENDITION_LAYOUT_REFLOWABLE) return false;
      }

      return self.spine.package.isFixedLayout();
    }

    // if image or svg use fixed layout
    return self.media_type.indexOf("image/") >= 0;

  };

  this.getRenditionFlow = function() {

    if (self.rendition_flow) {
      return self.rendition_flow;
    }

    return self.spine.package.rendition_flow;
  };

  this.getRenditionViewport = function() {

    if (self.rendition_viewport) {
      return self.rendition_viewport;
    }

    return self.spine.package.rendition_viewport;
  };

  this.getRenditionSpread = function() {

    if (self.rendition_spread) {
      return self.rendition_spread;
    }

    return self.spine.package.rendition_spread;
  };

  this.getRenditionOrientation = function() {

    if (self.rendition_orientation) {
      return self.rendition_orientation;
    }

    return self.spine.package.rendition_orientation;
  };

  this.getRenditionLayout = function() {

    if (self.rendition_layout) {
      return self.rendition_layout;
    }

    return self.spine.package.rendition_layout;
  };

  function isPropertyValueSetForItemOrPackage(propName, propValue) {

    if (self[propName]) {
      return self[propName] === propValue;
    }

    if (self.spine.package[propName]) {
      return self.spine.package[propName] === propValue;
    }

    return false;
  }

  this.isFlowScrolledContinuous = function() {

    return isPropertyValueSetForItemOrPackage("rendition_flow", Constants.RENDITION_FLOW_SCROLLED_CONTINUOUS);
  };

  this.isFlowScrolledDoc = function() {

    return isPropertyValueSetForItemOrPackage("rendition_flow", Constants.RENDITION_FLOW_SCROLLED_DOC);
  };
};

SpineItem.alternateSpread = function(spread) {

  if (spread === Constants.SPREAD_LEFT) {
    return Constants.SPREAD_RIGHT;
  }

  if (spread === Constants.SPREAD_RIGHT) {
    return Constants.SPREAD_LEFT;
  }

  return spread;

};

module.exports = SpineItem
},{"./spine-item-constants":56}],58:[function(require,module,exports){
//  Created by Boris Schneiderman.
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

/**
 *  Wrapper of the spine object received from hosting application
 *
 *  @class  ReadiumSDK.Models.Spine
 */

var SpineItem = require('./spine-item')
var SpineItemConstants = require('./spine-item-constants')

function Spine(epubPackage, spineDTO) {

  var self = this;

  /*
   * Collection of spine items
   * @property items
   * @type {Array}
   */
  this.items = [];

  /*
   * Page progression direction ltr|rtl|default
   * @property direction
   * @type {string}
   */
  this.direction = "ltr";

  /*
   * @property package
   * @type {ReadiumSDK.Models.Package}
   *
   */
  this.package = epubPackage;

  var _handleLinear = false;

  this.handleLinear = function(handleLinear) {
    _handleLinear = handleLinear;
  };

  function isValidLinearItem(item) {
    return !_handleLinear || item.linear !== "no";
  }


  this.isValidLinearItem = function(index) {

    if (!isValidIndex(index)) {
      return undefined;
    }

    return isValidLinearItem(this.item(index));
  };

  this.prevItem = function(item) {

    return lookForPrevValidItem(item.index - 1);
  };

  function lookForNextValidItem(ix) {

    if (!isValidIndex(ix)) {
      return undefined;
    }

    var item = self.items[ix];

    if (isValidLinearItem(item)) {
      return item;
    }

    return lookForNextValidItem(item.index + 1);
  }

  function lookForPrevValidItem(ix) {

    if (!isValidIndex(ix)) {
      return undefined;
    }

    var item = self.items[ix];

    if (isValidLinearItem(item)) {
      return item;
    }

    return lookForPrevValidItem(item.index - 1);
  }

  this.nextItem = function(item) {

    return lookForNextValidItem(item.index + 1);
  };

  this.getItemUrl = function(item) {

    return self.package.resolveRelativeUrl(item.href);

  };

  function isValidIndex(index) {

    return index >= 0 && index < self.items.length;
  }

  this.first = function() {

    return lookForNextValidItem(0);
  };

  this.last = function() {

    return lookForPrevValidItem(this.items.length - 1);
  };

  this.isFirstItem = function(item) {

    return self.first() === item;
  };

  this.isLastItem = function(item) {

    return self.last() === item;
  };

  this.item = function(index) {

    if (isValidIndex(index))
      return self.items[index];

    return undefined;
  };

  this.isRightToLeft = function() {

    return self.direction == "rtl";
  };

  this.isLeftToRight = function() {

    return !self.isRightToLeft();
  };

  this.getItemById = function(idref) {

    var length = self.items.length;

    for (var i = 0; i < length; i++) {
      if (self.items[i].idref == idref) {

        return self.items[i];
      }
    }

    return undefined;
  };

  this.getItemByHref = function(href) {

    var length = self.items.length;

    for (var i = 0; i < length; i++) {
      if (self.items[i].href == href) {

        return self.items[i];
      }
    }

    return undefined;
  };

  function updateSpineItemsSpread() {

    var len = self.items.length;

    var isFirstPageInSpread = false;
    var baseSide = self.isLeftToRight() ? SpineItemConstants.SPREAD_LEFT : SpineItemConstants.SPREAD_RIGHT;

    for (var i = 0; i < len; i++) {

      var spineItem = self.items[i];
      if (!spineItem.page_spread) {

        var spread = spineItem.isRenditionSpreadAllowed() ? (isFirstPageInSpread ? baseSide : SpineItem.alternateSpread(baseSide)) : SpineItemConstants.SPREAD_CENTER;
        spineItem.setSpread(spread);
      }

      isFirstPageInSpread = !spineItem.isRenditionSpreadAllowed() || spineItem.page_spread != baseSide;
    }
  }

  if (spineDTO) {

    if (spineDTO.direction) {
      this.direction = spineDTO.direction;
    }

    var length = spineDTO.items.length;
    for (var i = 0; i < length; i++) {
      var item = new SpineItem(spineDTO.items[i], i, this);
      this.items.push(item);
    }

    updateSpineItemsSpread();
  }

};

module.exports = Spine
},{"./spine-item":57,"./spine-item-constants":56}],59:[function(require,module,exports){
//  Created by Boris Schneiderman.
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

/**
 *
 * @param selector
 * @param declarations
 * @constructor
 */
var Style = function(selector, declarations) {

  this.selector = selector;
  this.declarations = declarations;

  this.setDeclarations = function(declarations) {

    for (var prop in declarations) {
      if (declarations.hasOwnProperty(prop)) {
        this.declarations[prop] = declarations[prop];
      }
    }

  }
};

module.exports = Style
},{}],60:[function(require,module,exports){
//  LauncherOSX
//
//  Created by Boris Schneiderman.
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

var $ = require('jquery')

// Description: Parse the epub "switch" tags and hide
// cases that are not supported
function apply(dom) {


  // helper method, returns true if a given case node
  // is supported, false otherwise
  function isSupported(caseNode) {

    var ns = caseNode.attributes["required-namespace"];
    if (!ns) {
      // the namespace was not specified, that should
      // never happen, we don't support it then
      console.log("Encountered a case statement with no required-namespace");
      return false;
    }
    // all the xmlns that readium is known to support
    // TODO this is going to require maintenance
    var supportedNamespaces = ["http://www.w3.org/1998/Math/MathML"];
    return _.include(supportedNamespaces, ns);
  }

  $('switch', dom).each(function() {

    // keep track of whether or now we found one
    var found = false;

    $('case', this).each(function() {

      if (!found && isSupported(this)) {
        found = true; // we found the node, don't remove it
      } else {
        $(this).remove(); // remove the node from the dom
        //                    $(this).prop("hidden", true);
      }
    });

    if (found) {
      // if we found a supported case, remove the default
      $('default', this).remove();
      //                $('default', this).prop("hidden", true);
    }
  })
};

module.exports = {
  apply: apply
}
},{"jquery":9}],61:[function(require,module,exports){
//  LauncherOSX
//
//  Created by Boris Schneiderman.
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

var $ = require('jquery')
var escapeJQuerySelector = require('../helpers/escape-jquery-selector')
var Trigger = require('./trigger')

/**
 * Setter fot epub Triggers
 *
 *
 * @param domNode
 */

var Trigger = function(domNode) {
  var $el = $(domNode);
  this.action = $el.attr("action");
  this.ref = $el.attr("ref");
  this.event = $el.attr("ev:event");
  this.observer = $el.attr("ev:observer");
  this.ref = $el.attr("ref");
};

Trigger.register = function(dom) {
  $('trigger', dom).each(function() {
    var trigger = new Trigger(this);
    trigger.subscribe(dom);
  });
};

Trigger.prototype.subscribe = function(dom) {
  var selector = "#" + this.observer;
  var that = this;
  $(selector, dom).on(this.event, function() {
    that.execute(dom);
  });
};

Trigger.prototype.execute = function(dom) {
  var $target = $("#" + escapeJQuerySelector(this.ref), dom);
  switch (this.action) {
    case "show":
      $target.css("visibility", "visible");
      break;
    case "hide":
      $target.css("visibility", "hidden");
      break;
    case "play":
      $target[0].currentTime = 0;
      $target[0].play();
      break;
    case "pause":
      $target[0].pause();
      break;
    case "resume":
      $target[0].play();
      break;
    case "mute":
      $target[0].muted = true;
      break;
    case "unmute":
      $target[0].muted = false;
      break;
    default:
      console.log("do not no how to handle trigger " + this.action);
  }
};

module.exports = Trigger
},{"../helpers/escape-jquery-selector":35,"./trigger":61,"jquery":9}],62:[function(require,module,exports){
//  Created by Boris Schneiderman.
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

/**
 *
 * @param settingsData
 * @constructor
 */
var ViewerSettings = function(settingsData) {

  var self = this;

  this.syntheticSpread = "auto";
  this.fontSize = 100;
  this.columnGap = 20;

  this.mediaOverlaysPreservePlaybackWhenScroll = false;

  this.mediaOverlaysSkipSkippables = false;
  this.mediaOverlaysEscapeEscapables = true;

  this.mediaOverlaysSkippables = [];
  this.mediaOverlaysEscapables = [];

  this.mediaOverlaysEnableClick = true;
  this.mediaOverlaysRate = 1;
  this.mediaOverlaysVolume = 100;

  this.mediaOverlaysSynchronizationGranularity = "";

  this.mediaOverlaysAutomaticPageTurn = true;

  this.enableGPUHardwareAccelerationCSS3D = false;

  // -1 ==> disable
  // [0...n] ==> index of transition in pre-defined array
  this.pageTransition = -1;

  this.scroll = "auto";

  function buildArray(str) {
    var retArr = [];
    var arr = str.split(/[\s,;]+/); //','
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i].trim();
      if (item !== "") {
        retArr.push(item);
      }
    }
    return retArr;
  }

  function mapProperty(propName, settingsData, functionToApply) {

    if (settingsData[propName] !== undefined) {
      if (functionToApply) {

        self[propName] = functionToApply(settingsData[propName]);
      } else {
        self[propName] = settingsData[propName];
      }
    }

  }

  this.update = function(settingsData) {

    mapProperty("columnGap", settingsData);
    mapProperty("fontSize", settingsData);
    mapProperty("mediaOverlaysPreservePlaybackWhenScroll", settingsData);
    mapProperty("mediaOverlaysSkipSkippables", settingsData);
    mapProperty("mediaOverlaysEscapeEscapables", settingsData);
    mapProperty("mediaOverlaysSkippables", settingsData, buildArray);
    mapProperty("mediaOverlaysEscapables", settingsData, buildArray);
    mapProperty("mediaOverlaysEnableClick", settingsData);
    mapProperty("mediaOverlaysRate", settingsData);
    mapProperty("mediaOverlaysVolume", settingsData);
    mapProperty("mediaOverlaysSynchronizationGranularity", settingsData);
    mapProperty("mediaOverlaysAutomaticPageTurn", settingsData);
    mapProperty("scroll", settingsData);
    mapProperty("syntheticSpread", settingsData);
    mapProperty("pageTransition", settingsData);
    mapProperty("enableGPUHardwareAccelerationCSS3D", settingsData);
  };

  this.update(settingsData);
};

module.exports = ViewerSettings;
},{}],63:[function(require,module,exports){
if (navigator) {
  //This is default implementation of reading system object that will be available for the publication's javascript to analyze at runtime
  //To extend/modify/replace this object reading system should subscribe ReadiumSDK.Events.READER_INITIALIZED and apply changes in reaction to this event
  navigator.epubReadingSystem = {
    name: "",
    version: "0.0.0",
    layoutStyle: "paginated",

    hasFeature: function(feature, version) {

      // for now all features must be version 1.0 so fail fast if the user has asked for something else
      if (version && version !== "1.0") {
        return false;
      }

      if (feature === "dom-manipulation") {
        // Scripts may make structural changes to the document???s DOM (applies to spine-level scripting only).
        return true;
      }
      if (feature === "layout-changes") {
        // Scripts may modify attributes and CSS styles that affect content layout (applies to spine-level scripting only).
        return true;
      }
      if (feature === "touch-events") {
        // The device supports touch events and the Reading System passes touch events to the content.
        return false;
      }
      if (feature === "mouse-events") {
        // The device supports mouse events and the Reading System passes mouse events to the content.
        return true;
      }
      if (feature === "keyboard-events") {
        // The device supports keyboard events and the Reading System passes keyboard events to the content.
        return true;
      }

      if (feature === "spine-scripting") {
        //Spine-level scripting is supported.
        return true;
      }

      return false;
    }
  };
}
},{}],64:[function(require,module,exports){
//  LauncherOSX
//
//  Created by Boris Schneiderman.
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

var $ = require('jquery')
var Rect = require('../helpers/rect')

/**
 * CFI navigation helper class
 *
 * @param $viewport
 * @param $iframe
 * @param options Additional settings for NavigationLogic object
 *      - rectangleBased    If truthy, clientRect-based geometry will be used
 *      - paginationInfo    Layout details, used by clientRect-based geometry
 * @constructor
 */

function CfiNavigationLogic($viewport, $iframe, options) {

  options = options || {};

  this.getRootElement = function() {

    return $iframe[0].contentDocument.documentElement;
  };

  // FIXED LAYOUT if (!options.rectangleBased) alert("!!!options.rectangleBased");

  var visibilityCheckerFunc = options.rectangleBased ? checkVisibilityByRectangles : checkVisibilityByVerticalOffsets;

  /**
   * @private
   * Checks whether or not pages are rendered right-to-left
   *
   * @returns {boolean}
   */
  function isPageProgressionRightToLeft() {
    return options.paginationInfo && !!options.paginationInfo.rightToLeft;
  }

  /**
   * @private
   * Checks whether or not pages are rendered with vertical writing mode
   *
   * @returns {boolean}
   */
  function isVerticalWritingMode() {
    return options.paginationInfo && !!options.paginationInfo.isVerticalWritingMode;
  }


  /**
   * @private
   * Checks whether or not a (fully adjusted) rectangle is at least partly visible
   *
   * @param {Object} rect
   * @param {Object} frameDimensions
   * @param {boolean} [isVwm]           isVerticalWritingMode
   * @returns {boolean}
   */
  function isRectVisible(rect, frameDimensions, isVwm) {
    if (isVwm) {
      return rect.top >= 0 && rect.top < frameDimensions.height;
    }
    return rect.left >= 0 && rect.left < frameDimensions.width;
  }

  /**
   * @private
   * Retrieves _current_ full width of a column (including its gap)
   *
   * @returns {number} Full width of a column in pixels
   */
  function getColumnFullWidth() {

    if (!options.paginationInfo || isVerticalWritingMode()) {
      return $iframe.width();
    }

    return options.paginationInfo.columnWidth + options.paginationInfo.columnGap;
  }

  /**
   * @private
   *
   * Retrieves _current_ offset of a viewport
   * (related to the beginning of the chapter)
   *
   * @returns {Object}
   */
  function getVisibleContentOffsets() {
    if (isVerticalWritingMode()) {
      return {
        top: (options.paginationInfo ? options.paginationInfo.pageOffset : 0)
      };
    }
    return {
      left: (options.paginationInfo ? options.paginationInfo.pageOffset : 0) * (isPageProgressionRightToLeft() ? -1 : 1)
    };
  }

  // Old (offsetTop-based) algorithm, useful in top-to-bottom layouts
  function checkVisibilityByVerticalOffsets(
    $element, visibleContentOffsets, shouldCalculateVisibilityOffset) {

    var elementRect = Rect.fromElement($element);
    if (_.isNaN(elementRect.left)) {
      // this is actually a point element, doesnt have a bounding rectangle
      elementRect = new Rect(
        $element.position().top, $element.position().left, 0, 0);
    }
    var topOffset = visibleContentOffsets.top || 0;
    var isBelowVisibleTop = elementRect.bottom() > topOffset;
    var isAboveVisibleBottom = visibleContentOffsets.bottom !== undefined ? elementRect.top < visibleContentOffsets.bottom : true; //this check always passed, if corresponding offset isn't set

    var percentOfElementHeight = 0;
    if (isBelowVisibleTop && isAboveVisibleBottom) { // element is visible
      if (!shouldCalculateVisibilityOffset) {
        return 100;
      } else if (elementRect.top <= topOffset) {
        percentOfElementHeight = Math.ceil(
          100 * (topOffset - elementRect.top) / elementRect.height
        );

        // below goes another algorithm, which has been used in getVisibleElements pattern,
        // but it seems to be a bit incorrect
        // (as spatial offset should be measured at the first visible point of the element):
        //
        // var visibleTop = Math.max(elementRect.top, visibleContentOffsets.top);
        // var visibleBottom = Math.min(elementRect.bottom(), visibleContentOffsets.bottom);
        // var visibleHeight = visibleBottom - visibleTop;
        // var percentVisible = Math.round((visibleHeight / elementRect.height) * 100);
      }
      return 100 - percentOfElementHeight;
    }
    return 0; // element isn't visible
  }

  /**
   * New (rectangle-based) algorithm, useful in multi-column layouts
   *
   * Note: the second param (props) is ignored intentionally
   * (no need to use those in normalization)
   *
   * @param {jQuery} $element
   * @param {Object} _props
   * @param {boolean} shouldCalculateVisibilityPercentage
   * @returns {number|null}
   *      0 for non-visible elements,
   *      0 < n <= 100 for visible elements
   *      (will just give 100, if `shouldCalculateVisibilityPercentage` => false)
   *      null for elements with display:none
   */
  function checkVisibilityByRectangles(
    $element, _props, shouldCalculateVisibilityPercentage) {

    var elementRectangles = getNormalizedRectangles($element);
    var clientRectangles = elementRectangles.clientRectangles;
    if (clientRectangles.length === 0) { // elements with display:none, etc.
      return null;
    }

    var isRtl = isPageProgressionRightToLeft();
    var isVwm = isVerticalWritingMode();
    var columnFullWidth = getColumnFullWidth();
    var frameDimensions = {
      width: $iframe.width(),
      height: $iframe.height()
    };

    if (clientRectangles.length === 1) {
      // because of webkit inconsistency, that single rectangle should be adjusted
      // until it hits the end OR will be based on the FIRST column that is visible
      adjustRectangle(clientRectangles[0], frameDimensions, columnFullWidth,
        isRtl, isVwm, true);
    }

    // for an element split between several CSS columns,
    // both Firefox and IE produce as many client rectangles;
    // each of those should be checked
    var visibilityPercentage = 0;
    for (var i = 0, l = clientRectangles.length; i < l; ++i) {
      if (isRectVisible(clientRectangles[i], frameDimensions, isVwm)) {
        visibilityPercentage = shouldCalculateVisibilityPercentage ? measureVisibilityPercentageByRectangles(clientRectangles, i) : 100;
        break;
      }
    }
    return visibilityPercentage;
  }

  /**
   * Finds a page index (0-based) for a specific element.
   * Calculations are based on rectangles retrieved with getClientRects() method.
   *
   * @param {jQuery} $element
   * @param {number} spatialVerticalOffset
   * @returns {number|null}
   */
  function findPageByRectangles($element, spatialVerticalOffset) {
    var visibleContentOffsets = getVisibleContentOffsets();
    var elementRectangles = getNormalizedRectangles($element, visibleContentOffsets);
    var clientRectangles = elementRectangles.clientRectangles;
    if (clientRectangles.length === 0) { // elements with display:none, etc.
      return null;
    }

    var isRtl = isPageProgressionRightToLeft();
    var isVwm = isVerticalWritingMode();
    var columnFullWidth = getColumnFullWidth();

    var frameHeight = $iframe.height();
    var frameWidth = $iframe.width();

    if (spatialVerticalOffset) {
      trimRectanglesByVertOffset(clientRectangles, spatialVerticalOffset,
        frameHeight, columnFullWidth, isRtl, isVwm);
    }

    var firstRectangle = _.first(clientRectangles);
    if (clientRectangles.length === 1) {
      adjustRectangle(firstRectangle, {
        height: frameHeight,
        width: frameWidth
      }, columnFullWidth, isRtl, isVwm);
    }

    var pageIndex;

    if (isVwm) {
      var topOffset = firstRectangle.top;
      pageIndex = Math.floor(topOffset / frameHeight);
    } else {
      var leftOffset = firstRectangle.left;
      if (isRtl) {
        leftOffset = (columnFullWidth * (options.paginationInfo ? options.paginationInfo.visibleColumnCount : 1)) - leftOffset;
      }
      pageIndex = Math.floor(leftOffset / columnFullWidth);
    }

    if (pageIndex < 0) {
      pageIndex = 0;
    } else if (pageIndex >= (options.paginationInfo ? options.paginationInfo.columnCount : 1)) {
      pageIndex = (options.paginationInfo ? (options.paginationInfo.columnCount - 1) : 0);
    }

    return pageIndex;
  }

  /**
   * @private
   * Calculates the visibility offset percentage based on ClientRect dimensions
   *
   * @param {Array} clientRectangles (should already be normalized)
   * @param {number} firstVisibleRectIndex
   * @returns {number} - visibility percentage (0 < n <= 100)
   */
  function measureVisibilityPercentageByRectangles(
    clientRectangles, firstVisibleRectIndex) {

    var heightTotal = 0;
    var heightVisible = 0;

    if (clientRectangles.length > 1) {
      _.each(clientRectangles, function(rect, index) {
        heightTotal += rect.height;
        if (index >= firstVisibleRectIndex) {
          // in this case, all the rectangles after the first visible
          // should be counted as visible
          heightVisible += rect.height;
        }
      });
    } else {
      // should already be normalized and adjusted
      heightTotal = clientRectangles[0].height;
      heightVisible = clientRectangles[0].height - Math.max(
        0, -clientRectangles[0].top);
    }
    return heightVisible === heightTotal ? 100 // trivial case: element is 100% visible
      : Math.floor(100 * heightVisible / heightTotal);
  }

  /**
   * @private
   * Retrieves the position of $element in multi-column layout
   *
   * @param {jQuery} $el
   * @param {Object} [visibleContentOffsets]
   * @returns {Object}
   */
  function getNormalizedRectangles($el, visibleContentOffsets) {

    visibleContentOffsets = visibleContentOffsets || {};
    var leftOffset = visibleContentOffsets.left || 0;
    var topOffset = visibleContentOffsets.top || 0;

    // union of all rectangles wrapping the element
    var wrapperRectangle = normalizeRectangle(
      $el[0].getBoundingClientRect(), leftOffset, topOffset);

    // all the separate rectangles (for detecting position of the element
    // split between several columns)
    var clientRectangles = [];
    var clientRectList = $el[0].getClientRects();
    for (var i = 0, l = clientRectList.length; i < l; ++i) {
      if (clientRectList[i].height > 0) {
        // Firefox sometimes gets it wrong,
        // adding literally empty (height = 0) client rectangle preceding the real one,
        // that empty client rectanle shouldn't be retrieved
        clientRectangles.push(
          normalizeRectangle(clientRectList[i], leftOffset, topOffset));
      }
    }

    if (clientRectangles.length === 0) {
      // sometimes an element is either hidden or empty, and that means
      // Webkit-based browsers fail to assign proper clientRects to it
      // in this case we need to go for its sibling (if it exists)
      $el = $el.next();
      if ($el.length) {
        return getNormalizedRectangles($el, visibleContentOffsets);
      }
    }

    return {
      wrapperRectangle: wrapperRectangle,
      clientRectangles: clientRectangles
    };
  }

  /**
   * @private
   * Converts TextRectangle object into a plain object,
   * taking content offsets (=scrolls, position shifts etc.) into account
   *
   * @param {TextRectangle} textRect
   * @param {number} leftOffset
   * @param {number} topOffset
   * @returns {Object}
   */
  function normalizeRectangle(textRect, leftOffset, topOffset) {

    var plainRectObject = {
      left: textRect.left,
      right: textRect.right,
      top: textRect.top,
      bottom: textRect.bottom,
      width: textRect.right - textRect.left,
      height: textRect.bottom - textRect.top
    };
    offsetRectangle(plainRectObject, leftOffset, topOffset);
    return plainRectObject;
  }

  /**
   * @private
   * Offsets plain object (which represents a TextRectangle).
   *
   * @param {Object} rect
   * @param {number} leftOffset
   * @param {number} topOffset
   */
  function offsetRectangle(rect, leftOffset, topOffset) {

    rect.left += leftOffset;
    rect.right += leftOffset;
    rect.top += topOffset;
    rect.bottom += topOffset;
  }

  /**
   * @private
   *
   * When element is spilled over two or more columns,
   * most of the time Webkit-based browsers
   * still assign a single clientRectangle to it, setting its `top` property to negative value
   * (so it looks like it's rendered based on the second column)
   * Alas, sometimes they decide to continue the leftmost column - from _below_ its real height.
   * In this case, `bottom` property is actually greater than element's height and had to be adjusted accordingly.
   *
   * Ugh.
   *
   * @param {Object} rect
   * @param {Object} frameDimensions
   * @param {number} columnFullWidth
   * @param {boolean} isRtl
   * @param {boolean} isVwm               isVerticalWritingMode
   * @param {boolean} shouldLookForFirstVisibleColumn
   *      If set, there'll be two-phase adjustment
   *      (to align a rectangle with a viewport)

   */
  function adjustRectangle(rect, frameDimensions, columnFullWidth, isRtl, isVwm,
    shouldLookForFirstVisibleColumn) {

    // Rectangle adjustment is not needed in VWM since it does not deal with columns
    if (isVwm) {
      return;
    }

    if (isRtl) {
      columnFullWidth *= -1; // horizontal shifts are reverted in RTL mode
    }

    // first we go left/right (rebasing onto the very first column available)
    while (rect.top < 0) {
      offsetRectangle(rect, -columnFullWidth, frameDimensions.height);
    }

    // ... then, if necessary (for visibility offset checks),
    // each column is tried again (now in reverse order)
    // the loop will be stopped when the column is aligned with a viewport
    // (i.e., is the first visible one).
    if (shouldLookForFirstVisibleColumn) {
      while (rect.bottom >= frameDimensions.height) {
        if (isRectVisible(rect, frameDimensions, isVwm)) {
          break;
        }
        offsetRectangle(rect, columnFullWidth, -frameDimensions.height);
      }
    }
  }

  /**
   * @private
   * Trims the rectangle(s) representing the given element.
   *
   * @param {Array} rects
   * @param {number} verticalOffset
   * @param {number} frameHeight
   * @param {number} columnFullWidth
   * @param {boolean} isRtl
   * @param {boolean} isVwm               isVerticalWritingMode
   */
  function trimRectanglesByVertOffset(
    rects, verticalOffset, frameHeight, columnFullWidth, isRtl, isVwm) {

    //TODO: Support vertical writing mode
    if (isVwm) {
      return;
    }

    var totalHeight = _.reduce(rects, function(prev, cur) {
      return prev + cur.height;
    }, 0);

    var heightToHide = totalHeight * verticalOffset / 100;
    if (rects.length > 1) {
      var heightAccum = 0;
      do {
        heightAccum += rects[0].height;
        if (heightAccum > heightToHide) {
          break;
        }
        rects.shift();
      } while (rects.length > 1);
    } else {
      // rebase to the last possible column
      // (so that adding to top will be properly processed later)
      if (isRtl) {
        columnFullWidth *= -1;
      }
      while (rects[0].bottom >= frameHeight) {
        offsetRectangle(rects[0], columnFullWidth, -frameHeight);
      }

      rects[0].top += heightToHide;
      rects[0].height -= heightToHide;
    }
  }

  //we look for text and images
  this.findFirstVisibleElement = function(props) {

    if (typeof props !== 'object') {
      // compatibility with legacy code, `props` is `topOffset` actually
      props = {
        top: props
      };
    }

    var $elements;
    var $firstVisibleTextNode = null;
    var percentOfElementHeight = 0;

    $elements = $("body", this.getRootElement()).find(":not(iframe)").contents().filter(function() {
      return isValidTextNode(this) || this.nodeName.toLowerCase() === 'img';
    });

    // Find the first visible text node
    $.each($elements, function() {

      var $element;

      if (this.nodeType === Node.TEXT_NODE) { //text node
        $element = $(this).parent();
      } else {
        $element = $(this); //image
      }

      var visibilityResult = visibilityCheckerFunc($element, props, true);
      if (visibilityResult) {
        $firstVisibleTextNode = $element;
        percentOfElementHeight = 100 - visibilityResult;
        return false;
      }
      return true;
    });

    return {
      $element: $firstVisibleTextNode,
      percentY: percentOfElementHeight
    };
  };

  this.getFirstVisibleElementCfi = function(topOffset) {

    var foundElement = this.findFirstVisibleElement(topOffset);

    if (!foundElement.$element) {
      console.log("Could not generate CFI no visible element on page");
      return undefined;
    }

    //noinspection JSUnresolvedVariable
    var cfi = EPUBcfi.Generator.generateElementCFIComponent(foundElement.$element[0]);

    if (cfi[0] == "!") {
      cfi = cfi.substring(1);
    }

    return cfi + "@0:" + foundElement.percentY;
  };

  this.getPageForElementCfi = function(cfi, classBlacklist, elementBlacklist, idBlacklist) {

    var cfiParts = splitCfi(cfi);

    var $element = getElementByPartialCfi(cfiParts.cfi, classBlacklist, elementBlacklist, idBlacklist);

    if (!$element) {
      return -1;
    }

    return this.getPageForPointOnElement($element, cfiParts.x, cfiParts.y);
  };

  function getElementByPartialCfi(cfi, classBlacklist, elementBlacklist, idBlacklist) {

    var contentDoc = $iframe[0].contentDocument;

    var wrappedCfi = "epubcfi(" + cfi + ")";
    //noinspection JSUnresolvedVariable
    var $element = EPUBcfi.getTargetElementWithPartialCFI(wrappedCfi, contentDoc, classBlacklist, elementBlacklist, idBlacklist);

    if (!$element || $element.length == 0) {
      console.log("Can't find element for CFI: " + cfi);
      return undefined;
    }

    return $element;
  }

  this.getElementByCfi = function(cfi, classBlacklist, elementBlacklist, idBlacklist) {

    var cfiParts = splitCfi(cfi);
    return getElementByPartialCfi(cfiParts.cfi, classBlacklist, elementBlacklist, idBlacklist);
  };

  this.getPageForElement = function($element) {

    return this.getPageForPointOnElement($element, 0, 0);
  };

  this.getPageForPointOnElement = function($element, x, y) {

    var pageIndex;
    if (options.rectangleBased) {
      pageIndex = findPageByRectangles($element, y);
      if (pageIndex === null) {
        console.warn('Impossible to locate a hidden element: ', $element);
        return 0;
      }
      return pageIndex;
    }

    var posInElement = this.getVerticalOffsetForPointOnElement($element, x, y);
    return Math.floor(posInElement / $viewport.height());
  };

  this.getVerticalOffsetForElement = function($element) {

    return this.getVerticalOffsetForPointOnElement($element, 0, 0);
  };

  this.getVerticalOffsetForPointOnElement = function($element, x, y) {

    var elementRect = Rect.fromElement($element);
    return Math.ceil(elementRect.top + y * elementRect.height / 100);
  };

  this.getElementById = function(id) {

    var contentDoc = $iframe[0].contentDocument;

    var $element = $(contentDoc.getElementById(id));
    //$("#" + Helpers.escapeJQuerySelector(id), contentDoc);

    if ($element.length == 0) {
      return undefined;
    }

    return $element;
  };

  this.getPageForElementId = function(id) {

    var $element = this.getElementById(id);
    if (!$element) {
      return -1;
    }

    return this.getPageForElement($element);
  };

  function splitCfi(cfi) {

    var ret = {
      cfi: "",
      x: 0,
      y: 0
    };

    var ix = cfi.indexOf("@");

    if (ix != -1) {
      var terminus = cfi.substring(ix + 1);

      var colIx = terminus.indexOf(":");
      if (colIx != -1) {
        ret.x = parseInt(terminus.substr(0, colIx));
        ret.y = parseInt(terminus.substr(colIx + 1));
      } else {
        console.log("Unexpected terminating step format");
      }

      ret.cfi = cfi.substring(0, ix);
    } else {

      ret.cfi = cfi;
    }

    return ret;
  }

  // returns raw DOM element (not $ jQuery-wrapped)
  this.getFirstVisibleMediaOverlayElement = function(visibleContentOffsets) {
    var docElement = this.getRootElement();
    if (!docElement) return undefined;

    var $root = $("body", docElement);
    if (!$root || !$root.length || !$root[0]) return undefined;

    var that = this;

    var firstPartial = undefined;

    function traverseArray(arr) {
      if (!arr || !arr.length) return undefined;

      for (var i = 0, count = arr.length; i < count; i++) {
        var item = arr[i];
        if (!item) continue;

        var $item = $(item);

        if ($item.data("mediaOverlayData")) {
          var visible = that.getElementVisibility($item, visibleContentOffsets);
          if (visible) {
            if (!firstPartial) firstPartial = item;

            if (visible == 100) return item;
          }
        } else {
          var elem = traverseArray(item.children);
          if (elem) return elem;
        }
      }

      return undefined;
    }

    var el = traverseArray([$root[0]]);
    if (!el) el = firstPartial;
    return el;

    // var $elements = this.getMediaOverlayElements($root);
    // return this.getVisibleElements($elements, visibleContentOffsets);
  };

  this.getElementVisibility = function($element, visibleContentOffsets) {
    return visibilityCheckerFunc($element, visibleContentOffsets, true);
  };

  // /**
  //  * @deprecated
  //  */
  // this.getVisibleMediaOverlayElements = function(visibleContentOffsets) {
  // 
  //     var $elements = this.getMediaOverlayElements($("body", this.getRootElement()));
  //     return this.getVisibleElements($elements, visibleContentOffsets);
  // 
  // };

  this.isElementVisible = visibilityCheckerFunc;

  this.getAllVisibleElementsWithSelector = function(selector, visibleContentOffset) {
    var elements = $(selector, this.getRootElement()).filter(function(e) {
      return true;
    });
    var $newElements = [];
    $.each(elements, function() {
      $newElements.push($(this));
    });
    var visibleDivs = this.getVisibleElements($newElements, visibleContentOffset);
    return visibleDivs;

  };

  this.getVisibleElements = function($elements, visibleContentOffsets) {

    var visibleElements = [];

    // Find the first visible text node
    $.each($elements, function() {
      var $element = this;
      var visibilityPercentage = visibilityCheckerFunc(
        $element, visibleContentOffsets, true);

      if (visibilityPercentage) {
        var $visibleElement = $element;
        visibleElements.push({
          element: $visibleElement[0], // DOM Element is pushed
          percentVisible: visibilityPercentage
        });
        return true;
      }

      // if element's position cannot be determined, just go to next one
      if (visibilityPercentage === null) {
        return true;
      }

      // continue if no visibleElements have been found yet,
      // stop otherwise
      return visibleElements.length === 0;
    });

    return visibleElements;
  };

  this.getVisibleTextElements = function(visibleContentOffsets) {

    var $elements = this.getTextElements($("body", this.getRootElement()));

    return this.getVisibleElements($elements, visibleContentOffsets);
  };

  /**
   * @deprecated
   */
  this.getMediaOverlayElements = function($root) {

    var $elements = [];

    function traverseCollection(elements) {

      if (elements == undefined) return;

      for (var i = 0, count = elements.length; i < count; i++) {

        var $element = $(elements[i]);

        if ($element.data("mediaOverlayData")) {
          $elements.push($element);
        } else {
          traverseCollection($element[0].children);
        }

      }
    }

    traverseCollection([$root[0]]);

    return $elements;
  };

  this.getTextElements = function($root) {

    var $textElements = [];

    $root.find(":not(iframe)").contents().each(function() {

      if (isValidTextNode(this)) {
        $textElements.push($(this).parent());
      }

    });

    return $textElements;

  };

  function isValidTextNode(node) {

    if (node.nodeType === Node.TEXT_NODE) {

      // Heuristic to find a text node with actual text
      var nodeText = node.nodeValue.replace(/\n/g, "");
      nodeText = nodeText.replace(/ /g, "");

      return nodeText.length > 0;
    }

    return false;

  }

  this.getElement = function(selector) {

    var $element = $(selector, this.getRootElement());

    if ($element.length > 0) {
      return $element;
    }

    return undefined;
  };

};

module.exports = CfiNavigationLogic
},{"../helpers/rect":43,"jquery":9}],65:[function(require,module,exports){
module.exports = {
  ORIENTATION_LANDSCAPE: "orientation_landscape",
  ORIENTATION_PORTRAIT: "orientation_portrait"
}
},{}],66:[function(require,module,exports){
var $ = require('jquery')
var _ = require('underscore')
var URI = require('URIjs')

function IFrameLoader() {

  var self = this;
  var eventListeners = {};


  this.addIFrameEventListener = function(eventName, callback, context) {

    if (eventListeners[eventName] == undefined) {
      eventListeners[eventName] = [];
    }

    eventListeners[eventName].push({
      callback: callback,
      context: context
    });
  };

  this.updateIframeEvents = function(iframe) {

    _.each(eventListeners, function(value, key) {
      for (var i = 0, count = value.length; i < count; i++) {
        $(iframe.contentWindow).off(key);
        $(iframe.contentWindow).on(key, value[i].callback, value[i].context);
      }
    });
  };

  this.loadIframe = function(iframe, src, callback, context, attachedData) {

    iframe.setAttribute("data-baseUri", iframe.baseURI);
    iframe.setAttribute("data-src", src);

    var loadedDocumentUri = new URI(src).absoluteTo(iframe.baseURI).toString();

    self._loadIframeWithUri(iframe, attachedData, loadedDocumentUri, function() {
      var doc = iframe.contentDocument || iframe.contentWindow.document;
      $('svg', doc).load(function() {
        console.log('loaded');
      });
      callback.call(context, true, attachedData);
    });
  };

  this._loadIframeWithUri = function(iframe, attachedData, contentUri, callback) {

    iframe.onload = function() {

      self.updateIframeEvents(iframe);

      var mathJax = iframe.contentWindow.MathJax;
      if (mathJax) {
        // If MathJax is being used, delay the callback until it has completed rendering
        var mathJaxCallback = _.once(callback);
        try {
          mathJax.Hub.Queue(mathJaxCallback);
        } catch (err) {
          console.error("MathJax fail!");
          callback();
        }
        // Or at an 8 second timeout, which ever comes first
        //window.setTimeout(mathJaxCallback, 8000);
      } else {
        callback();
      }
    };

    iframe.setAttribute("src", contentUri);

  };



}

module.exports = IFrameLoader
},{"URIjs":5,"jquery":9,"underscore":10}],67:[function(require,module,exports){
// TODO Remove when all underscore deps are gone
var _ = require('underscore')

var Views = {
  IFrameLoader: require('./iframe-loader'),
  ReaderView: require('./reader-view')
}

var ViewsConstants = require('./constants')

_.extend(Views, ViewsConstants)

module.exports = Views
},{"./constants":65,"./iframe-loader":66,"./reader-view":68,"underscore":10}],68:[function(require,module,exports){
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

/**
 * Options passed on the reader from the readium loader/initializer
 *
 * @typedef {object} ReadiumSDK.Views.ReaderView.ReaderOptions
 * @property {jQueryElement|string} el   The element the reader view should create itself in. Can be a jquery wrapped element or a query selector.
 * @property {ReadiumSDK.Views.IFrameLoader} iframeLoader   An instance of an iframe loader or one expanding it.
 * @property {boolean} needsFixedLayoutScalerWorkAround
 */

var _ = require('underscore')
var $ = require('jquery')
// var AnnotationsManager = require('./annotations-manager')
var Backbone = require('backbone')
var Events = require('../events')
var extendedThrottle = require('../helpers/extended-throttle')
// var FixedView = require('./fixed-view')
var IFrameLoader = require('./iframe-loader')
var InternalEvents = require('../internal-events')
// var InternalLinksSupport = require('./internal-links-support')
var isIframeAlive = require('../helpers/is-iframe-alive')
// var MediaOverlayDataInjector = require('./media-overlay-data-injector')
var MediaOverlayPlayer = {}; //require('./media-overlay-player')
var Package = require('../models/package')
var PageOpenRequest = require('../models/page-open-request')
var ReflowableView = require('./reflowable-view')
var ResolveContentRef = require('../helpers/resolve-content-ref')
// var ScrollView = require('./scroll-view')
var setStyles = require('../helpers/set-styles')
var StyleCollection = require('../collections/style')
var Switches = require('../models/switches')
var Trigger = require('../models/trigger')
var ViewerSettings = require('../models/viewer-settings')

/**
 * View Type
 * @typedef {object} ReadiumSDK.Views.ReaderView.ViewType
 * @property {number} VIEW_TYPE_COLUMNIZED          Reflowable document view
 * @property {number} VIEW_TYPE_FIXED               Fixed layout document view
 * @property {number} VIEW_TYPE_SCROLLED_DOC        Scrollable document view
 * @property {number} VIEW_TYPE_SCROLLED_CONTINUOUS Continuous scrollable document view
 */
var VIEW_TYPE_COLUMNIZED = 1;
var VIEW_TYPE_FIXED = 2;
var VIEW_TYPE_SCROLLED_DOC = 3;
var VIEW_TYPE_SCROLLED_CONTINUOUS = 4;


/**
 * Top level View object. Interface for view manipulation public APIs
 * @param {ReadiumSDK.Views.ReaderView.ReaderOptions} options
 * @constructor
 */
function ReaderView(options) {

  _.extend(this, Backbone.Events);

  var self = this;
  var _currentView = undefined;
  var _package = undefined;
  var _spine = undefined;
  var _viewerSettings = new ViewerSettings({});
  //styles applied to the container divs
  var _userStyles = new StyleCollection();
  //styles applied to the content documents
  var _bookStyles = new StyleCollection();
  // var _internalLinksSupport = new InternalLinksSupport(this);
  // var _mediaOverlayPlayer;
  // var _mediaOverlayDataInjector;
  var _iframeLoader;
  var _$el;
  // var _annotationsManager = new AnnotationsManager(self, options);

  //We will call onViewportResize after user stopped resizing window
  var lazyResize = extendedThrottle(
    handleViewportResizeStart,
    handleViewportResizeTick,
    handleViewportResizeEnd, 250, 1000, self);

  $(window).on("resize.ReadiumSDK.readerView", lazyResize);

  if (options.el instanceof $) {
    _$el = options.el;
    console.log("** EL is a jQuery selector:" + options.el.attr('id'));
  } else {
    _$el = $(options.el);
    console.log("** EL is a string:" + _$el.attr('id'));
  }

  if (options.iframeLoader) {
    _iframeLoader = options.iframeLoader;
  } else {
    _iframeLoader = new IFrameLoader({
      mathJaxUrl: options.mathJaxUrl
    });
  }


  _needsFixedLayoutScalerWorkAround = options.needsFixedLayoutScalerWorkAround;
  /**
   * @returns {boolean}
   */
  this.needsFixedLayoutScalerWorkAround = function() {
    return _needsFixedLayoutScalerWorkAround;
  }

  /**
   * Create a view based on the given view type.
   * @param {ReadiumSDK.Views.ReaderView.ViewType} viewType
   * @param {ReadiumSDK.Views.ReaderView.ViewCreationOptions} options
   * @returns {*}
   */
  this.createViewForType = function(viewType, options) {
    var createdView;

    // NOTE: _$el == options.$viewport
    _$el.css("overflow", "hidden");

    // switch (viewType) {
    //   case VIEW_TYPE_FIXED:

    //     _$el.css("overflow", "auto"); // for content pan, see self.setZoom()

    //     createdView = new FixedView(options, self);
    //     break;
    //   case VIEW_TYPE_SCROLLED_DOC:
    //     createdView = new ScrollView(options, false, self);
    //     break;
    //   case VIEW_TYPE_SCROLLED_CONTINUOUS:
    //     createdView = new ScrollView(options, true, self);
    //     break;
    //   default:
        createdView = new ReflowableView(options, self);
        // break;
    // }

    return createdView;
  };

  /**
   * Returns the current view type of the reader view
   * @returns {ReaderView.ViewType}
   */
  this.getCurrentViewType = function() {

    if (!_currentView) {
      return undefined;
    }

    if (_currentView instanceof ReflowableView) {
      return VIEW_TYPE_COLUMNIZED;
    }

    if (_currentView instanceof FixedView) {
      return VIEW_TYPE_FIXED;
    }

    if (_currentView instanceof ScrollView) {
      if (_currentView.isContinuousScroll()) {
        return VIEW_TYPE_SCROLLED_CONTINUOUS;
      }

      return VIEW_TYPE_SCROLLED_DOC;
    }

    console.error("Unrecognized view type");
    return undefined;
  };

  //based on https://docs.google.com/spreadsheet/ccc?key=0AoPMUkQhc4wcdDI0anFvWm96N0xRT184ZE96MXFRdFE&usp=drive_web#gid=0 document
  function deduceDesiredViewType(spineItem) {

    //check settings
    if (_viewerSettings.scroll == "scroll-doc") {
      return VIEW_TYPE_SCROLLED_DOC;
    }

    if (_viewerSettings.scroll == "scroll-continuous") {
      return VIEW_TYPE_SCROLLED_CONTINUOUS;
    }

    //is fixed layout ignore flow
    if (spineItem.isFixedLayout()) {
      return VIEW_TYPE_FIXED;
    }

    //flow
    if (spineItem.isFlowScrolledDoc()) {
      return VIEW_TYPE_SCROLLED_DOC;
    }

    if (spineItem.isFlowScrolledContinuous()) {
      return VIEW_TYPE_SCROLLED_CONTINUOUS;
    }

    return VIEW_TYPE_COLUMNIZED;
  }

  // returns true is view changed
  function initViewForItem(spineItem, callback) {

    var desiredViewType = deduceDesiredViewType(spineItem);

    console.log('desiredViewType', desiredViewType);

    if (_currentView) {

      if (self.getCurrentViewType() == desiredViewType) {
        callback(false);
        return;
      }

      resetCurrentView();
    }

    /**
     * View creation options
     * @typedef {object} ReadiumSDK.Views.ReaderView.ViewCreationOptions
     * @property {jQueryElement} $viewport  The view port element the reader view has created.
     * @property {Models.Spine} spine The spine item collection object
     * @property {ReadiumSDK.Collections.StyleCollection} userStyles User styles
     * @property {ReadiumSDK.Collections.StyleCollection} bookStyles Book styles
     * @property {ReadiumSDK.Views.IFrameLoader} iframeLoader   An instance of an iframe loader or one expanding it.
     */
    var viewCreationParams = {
      $viewport: _$el,
      spine: _spine,
      userStyles: _userStyles,
      bookStyles: _bookStyles,
      iframeLoader: _iframeLoader
    };


    _currentView = self.createViewForType(desiredViewType, viewCreationParams);
    self.trigger(Events.READER_VIEW_CREATED, desiredViewType);

    _currentView.on(Events.CONTENT_DOCUMENT_LOADED, function($iframe, spineItem) {

      if (!isIframeAlive($iframe[0])) return;

      // performance degrades with large DOM (e.g. word-level text-audio sync)
      // _mediaOverlayDataInjector.attachMediaOverlayData($iframe, spineItem, _viewerSettings);

      // _internalLinksSupport.processLinkElements($iframe, spineItem);
      // _annotationsManager.attachAnnotations($iframe, spineItem);

      var contentDoc = $iframe[0].contentDocument;
      Trigger.register(contentDoc);
      Switches.apply(contentDoc);

      self.trigger(Events.CONTENT_DOCUMENT_LOADED, $iframe, spineItem);
    });

    _currentView.on(Events.CONTENT_DOCUMENT_LOAD_START, function($iframe, spineItem) {
      self.trigger(Events.CONTENT_DOCUMENT_LOAD_START, $iframe, spineItem);
    });

    _currentView.on(InternalEvents.CURRENT_VIEW_PAGINATION_CHANGED, function(pageChangeData) {

      //we call on onPageChanged explicitly instead of subscribing to the ReadiumSDK.Events.PAGINATION_CHANGED by
      //mediaOverlayPlayer because we hve to guarantee that mediaOverlayPlayer will be updated before the host
      //application will be notified by the same ReadiumSDK.Events.PAGINATION_CHANGED event
      // _mediaOverlayPlayer.onPageChanged(pageChangeData);

      self.trigger(Events.PAGINATION_CHANGED, pageChangeData);
    });

    _currentView.on(Events.FXL_VIEW_RESIZED, function() {
      self.trigger(Events.FXL_VIEW_RESIZED);
    })

    _currentView.render();
    _currentView.setViewSettings(_viewerSettings);

    // we do this to wait until elements are rendered otherwise book is not able to determine view size.
    setTimeout(function() {

      callback(true);

    }, 50);

  }

  /**
   * Returns a list of the currently active spine items
   *
   * @returns {Models.SpineItem[]}
   */
  this.getLoadedSpineItems = function() {

    if (_currentView) {
      return _currentView.getLoadedSpineItems();
    }

    return [];
  };

  function resetCurrentView() {

    if (!_currentView) {
      return;
    }

    self.trigger(Events.READER_VIEW_DESTROYED);

    _currentView.off(InternalEvents.CURRENT_VIEW_PAGINATION_CHANGED);
    _currentView.remove();
    _currentView = undefined;
  }

  /**
   * Returns the currently instanced viewer settings
   *
   * @returns {Models.ViewerSettings}
   */
  this.viewerSettings = function() {
    return _viewerSettings;
  };

  /**
   * Returns a data object based on the package document
   *
   * @returns {Models.Package}
   */
  this.package = function() {
    return _package;
  };

  /**
   * Returns a representation of the spine as a data object, also acts as list of spine items
   *
   * @returns {Models.Spine}
   */
  this.spine = function() {
    return _spine;
  };

  /**
   * Returns the user CSS styles collection
   *
   * @returns {ReadiumSDK.Collections.StyleCollection}
   */
  this.userStyles = function() {
    return _userStyles;
  };

  /**
   * Open Book Data
   *
   * @typedef {object} ReadiumSDK.Views.ReaderView.OpenBookData
   * @property {Models.Package} package - packageData (required)
   * @property {Models.PageOpenRequest} openPageRequest - openPageRequestData, (optional) data related to open page request
   * @property {ReadiumSDK.Views.ReaderView.SettingsData} [settings]
   * @property {ReadiumSDK.Collections.StyleCollection} styles: [cssStyles]
   * @todo Define missing types
   */

  /**
   * Triggers the process of opening the book and requesting resources specified in the packageData
   *
   * @param {ReadiumSDK.Views.ReaderView.OpenBookData} openBookData - object with open book data
   */
  this.openBook = function(openBookData) {

    var packageData = openBookData.package ? openBookData.package : openBookData;

    _package = new Package(packageData);

    _spine = _package.spine;
    _spine.handleLinear(true);

    // if (_mediaOverlayPlayer) {
    //   _mediaOverlayPlayer.reset();
    // }

    // _mediaOverlayPlayer = new MediaOverlayPlayer(self, $.proxy(onMediaPlayerStatusChanged, self));
    // _mediaOverlayPlayer.setAutomaticNextSmil(_viewerSettings.mediaOverlaysAutomaticPageTurn ? true : false); // just to ensure the internal var is set to the default settings (user settings are applied below at self.updateSettings(openBookData.settings);)

    // _mediaOverlayDataInjector = new MediaOverlayDataInjector(_package.media_overlay, _mediaOverlayPlayer);


    resetCurrentView();

    if (openBookData.settings) {
      self.updateSettings(openBookData.settings);
    }

    if (openBookData.styles) {
      self.setStyles(openBookData.styles);
    }

    var pageRequestData = undefined;

    if (openBookData.openPageRequest) {

      if (openBookData.openPageRequest.idref || (openBookData.openPageRequest.contentRefUrl && openBookData.openPageRequest.sourceFileHref)) {
        pageRequestData = openBookData.openPageRequest;
      } else {
        console.log("Invalid page request data: idref required!");
      }
    }

    var fallback = false;
    if (pageRequestData) {

      pageRequestData = openBookData.openPageRequest;

      try {
        if (pageRequestData.idref) {

          if (pageRequestData.spineItemPageIndex) {
            fallback = !self.openSpineItemPage(pageRequestData.idref, pageRequestData.spineItemPageIndex, self);
          } else if (pageRequestData.elementCfi) {
            fallback = !self.openSpineItemElementCfi(pageRequestData.idref, pageRequestData.elementCfi, self);
          } else {
            fallback = !self.openSpineItemPage(pageRequestData.idref, 0, self);
          }
        } else {
          fallback = !self.openContentUrl(pageRequestData.contentRefUrl, pageRequestData.sourceFileHref, self);
        }
      } catch (err) {
        console.error("openPageRequest fail: fallback to first page!")
        console.log(err);
        fallback = true;
      }
    } else {
      fallback = true;
    }

    if (fallback) { // if we where not asked to open specific page we will open the first one

      var spineItem = _spine.first();
      if (spineItem) {
        var pageOpenRequest = new PageOpenRequest(spineItem, self);
        pageOpenRequest.setFirstPage();
        openPage(pageOpenRequest, 0);
      }

    }

  };

  function onMediaPlayerStatusChanged(status) {
    self.trigger(Events.MEDIA_OVERLAY_STATUS_CHANGED, status);
  }

  /**
   * Flips the page from left to right.
   * Takes to account the page progression direction to decide to flip to prev or next page.
   */
  this.openPageLeft = function() {

    if (_package.spine.isLeftToRight()) {
      self.openPagePrev();
    } else {
      self.openPageNext();
    }
  };

  /**
   * Flips the page from right to left.
   * Takes to account the page progression direction to decide to flip to prev or next page.
   */
  this.openPageRight = function() {

    if (_package.spine.isLeftToRight()) {
      self.openPageNext();
    } else {
      self.openPagePrev();
    }

  };

  /**
   * Returns if the current child view is an instance of a fixed page view
   *
   * @returns {boolean}
   */
  this.isCurrentViewFixedLayout = function() {
    return _currentView instanceof FixedView;
  };

  /**
   * Zoom options
   *
   * @typedef {object} ReadiumSDK.Views.ReaderView.ZoomOptions
   * @property {string} style - "user"|"fit-screen"|"fit-width"
   * @property {number} scale - 0.0 to 1.0
   */

  /**
   * Set the zoom options.
   *
   * @param {ReadiumSDK.Views.ReaderView.ZoomOptions} zoom Zoom options
   */
  this.setZoom = function(zoom) {
    // zoom only handled by fixed layout views 
    if (self.isCurrentViewFixedLayout()) {
      _currentView.setZoom(zoom);
    }
  };

  /**
   * Returns the current view scale as a percentage
   *
   * @returns {number}
   */
  this.getViewScale = function() {
    if (self.isCurrentViewFixedLayout()) {
      return 100 * _currentView.getViewScale();
    } else {
      return 100;
    }
  };

  /**
   * Settings Data
   *
   * @typedef {object} ReadiumSDK.Views.ReaderView.SettingsData
   * @property {number} fontSize - Font size as percentage
   * @property {(string|boolean)} syntheticSpread - "auto"|true|false
   * @property {(string|boolean)} scroll - "auto"|true|false
   * @property {boolean} doNotUpdateView - Indicates whether the view should be updated after the settings are applied
   * @property {boolean} mediaOverlaysEnableClick - Indicates whether media overlays are interactive on mouse clicks
   */

  /**
   * Updates reader view based on the settings specified in settingsData object
   *
   * @param {ReadiumSDK.Views.ReaderView.SettingsData} settingsData Settings data
   * @fires ReadiumSDK.Events.SETTINGS_APPLIED
   */
  this.updateSettings = function(settingsData) {

    //console.debug("UpdateSettings: " + JSON.stringify(settingsData));

    _viewerSettings.update(settingsData);

    // if (_mediaOverlayPlayer) {
    //   _mediaOverlayPlayer.setAutomaticNextSmil(_viewerSettings.mediaOverlaysAutomaticPageTurn ? true : false);
    // }

    if (_currentView && !settingsData.doNotUpdateView) {

      var bookMark = _currentView.bookmarkCurrentPage();

      if (bookMark && bookMark.idref) {

        var wasPlaying = false;
        if (_currentView.isReflowable && _currentView.isReflowable()) {
          wasPlaying = self.isPlayingMediaOverlay();
          if (wasPlaying) {
            self.pauseMediaOverlay();
          }
        }

        var spineItem = _spine.getItemById(bookMark.idref);

        initViewForItem(spineItem, function(isViewChanged) {

          if (!isViewChanged) {
            _currentView.setViewSettings(_viewerSettings);
          }

          self.openSpineItemElementCfi(bookMark.idref, bookMark.contentCFI, self);

          if (wasPlaying) {
            self.playMediaOverlay();
            // setTimeout(function()
            // {
            // }, 60);
          }

          self.trigger(Events.SETTINGS_APPLIED);
          return;
        });
      }
    }

    self.trigger(Events.SETTINGS_APPLIED);
  };

  /**
   * Opens the next page.
   */
  this.openPageNext = function() {

    if (self.getCurrentViewType() === VIEW_TYPE_SCROLLED_CONTINUOUS) {
      _currentView.openPageNext(self);
      return;
    }

    var paginationInfo = _currentView.getPaginationInfo();

    if (paginationInfo.openPages.length == 0) {
      return;
    }

    var lastOpenPage = paginationInfo.openPages[paginationInfo.openPages.length - 1];

    if (lastOpenPage.spineItemPageIndex < lastOpenPage.spineItemPageCount - 1) {
      _currentView.openPageNext(self);
      return;
    }

    var currentSpineItem = _spine.getItemById(lastOpenPage.idref);

    var nextSpineItem = _spine.nextItem(currentSpineItem);

    if (!nextSpineItem) {
      return;
    }

    var openPageRequest = new PageOpenRequest(nextSpineItem, self);
    openPageRequest.setFirstPage();

    openPage(openPageRequest, 2);
  };

  /**
   * Opens the previous page.
   */
  this.openPagePrev = function() {

    if (self.getCurrentViewType() === VIEW_TYPE_SCROLLED_CONTINUOUS) {
      _currentView.openPagePrev(self);
      return;
    }

    var paginationInfo = _currentView.getPaginationInfo();

    if (paginationInfo.openPages.length == 0) {
      return;
    }

    var firstOpenPage = paginationInfo.openPages[0];

    if (firstOpenPage.spineItemPageIndex > 0) {
      _currentView.openPagePrev(self);
      return;
    }

    var currentSpineItem = _spine.getItemById(firstOpenPage.idref);

    var prevSpineItem = _spine.prevItem(currentSpineItem);

    if (!prevSpineItem) {
      return;
    }

    var openPageRequest = new PageOpenRequest(prevSpineItem, self);
    openPageRequest.setLastPage();

    openPage(openPageRequest, 1);
  };

  function getSpineItem(idref) {

    if (!idref) {

      console.log("idref parameter value missing!");
      return undefined;
    }

    var spineItem = _spine.getItemById(idref);
    if (!spineItem) {
      console.log("Spine item with id " + idref + " not found!");
      return undefined;
    }

    return spineItem;

  }

  /**
   * Opens the page of the spine item with element with provided cfi
   *
   * @param {string} idref Id of the spine item
   * @param {string} elementCfi CFI of the element to be shown
   * @param {object} initiator optional
   */
  this.openSpineItemElementCfi = function(idref, elementCfi, initiator) {

    var spineItem = getSpineItem(idref);

    if (!spineItem) {
      return false;
    }

    var pageData = new PageOpenRequest(spineItem, initiator);
    if (elementCfi) {
      pageData.setElementCfi(elementCfi);
    }

    openPage(pageData, 0);

    return true;
  };

  /**
   * Opens specified page index of the current spine item
   *
   * @param {number} pageIndex Zero based index of the page in the current spine item
   * @param {object} initiator optional
   */
  this.openPageIndex = function(pageIndex, initiator) {

    if (!_currentView) {
      return false;
    }

    var pageRequest;

    if (_package.isFixedLayout()) {
      var spineItem = _spine.items[pageIndex];
      if (!spineItem) {
        return false;
      }

      pageRequest = new PageOpenRequest(spineItem, initiator);
      pageRequest.setPageIndex(0);
    } else {

      var spineItems = this.getLoadedSpineItems();
      if (spineItems.length > 0) {
        pageRequest = new PageOpenRequest(spineItems[0], initiator);
        pageRequest.setPageIndex(pageIndex);
      }
    }

    openPage(pageRequest, 0);

    return true;
  };

  // dir: 0 => new or same page, 1 => previous, 2 => next
  function openPage(pageRequest, dir) {

    initViewForItem(pageRequest.spineItem, function(isViewChanged) {

      if (!isViewChanged) {
        _currentView.setViewSettings(_viewerSettings);
      }

      _currentView.openPage(pageRequest, dir);
    });
  }


  /**
   * Opens page index of the spine item with idref provided
   *
   * @param {string} idref Id of the spine item
   * @param {number} pageIndex Zero based index of the page in the spine item
   * @param {object} initiator optional
   */
  this.openSpineItemPage = function(idref, pageIndex, initiator) {

    var spineItem = getSpineItem(idref);

    if (!spineItem) {
      return false;
    }

    var pageData = new PageOpenRequest(spineItem, initiator);
    if (pageIndex) {
      pageData.setPageIndex(pageIndex);
    }

    openPage(pageData, 0);

    return true;
  };

  /**
   * Set CSS Styles to the reader container
   *
   * @param {ReadiumSDK.Collections.StyleCollection} styles   Style collection containing selector property and declarations object
   * @param {boolean} doNotUpdateView                         Whether to update the view after the styles are applied.
   */
  this.setStyles = function(styles, doNotUpdateView) {

    var count = styles.length;

    for (var i = 0; i < count; i++) {
      if (styles[i].declarations) {
        _userStyles.addStyle(styles[i].selector, styles[i].declarations);
      } else {
        _userStyles.removeStyle(styles[i].selector);
      }
    }

    applyStyles(doNotUpdateView);

  };

  /**
   * Set CSS Styles to the content documents
   *
   * @param {ReadiumSDK.Collections.StyleCollection} styles    Style collection containing selector property and declarations object
   */
  this.setBookStyles = function(styles) {

    var count = styles.length;

    for (var i = 0; i < count; i++) {
      _bookStyles.addStyle(styles[i].selector, styles[i].declarations);
    }

    if (_currentView) {
      _currentView.applyBookStyles();
    }

  };

  /**
   * Gets an element from active content documents based on a query selector.
   *
   * @param {Models.SpineItem} spineItem       The spine item object associated with an active content document
   * @param {string} selector                      The query selector
   * @returns {HTMLElement|undefined}
   */
  this.getElement = function(spineItem, selector) {

    if (_currentView) {
      return _currentView.getElement(spineItem, selector);
    }

    return undefined;
  };

  /**
   * Gets an element from active content documents based on an element id.
   *
   * @param {Models.SpineItem} spineItem      The spine item object associated with an active content document
   * @param {string} id                                  The element id
   * @returns {HTMLElement|undefined}
   */
  this.getElementById = function(spineItem, id) {

    if (_currentView) {
      return _currentView.getElementById(spineItem, id);
    }

    return undefined;
  };

  /**
   * Gets an element from active content documents based on a content CFI.
   *
   * @param {Models.SpineItem} spineItem     The spine item idref associated with an active content document
   * @param {string} cfi                                The partial content CFI
   * @param {string[]} [classBlacklist]
   * @param {string[]} [elementBlacklist]
   * @param {string[]} [idBlacklist]
   * @returns {HTMLElement|undefined}
   */
  this.getElementByCfi = function(spineItem, cfi, classBlacklist, elementBlacklist, idBlacklist) {

    if (_currentView) {
      return _currentView.getElementByCfi(spineItem, cfi, classBlacklist, elementBlacklist, idBlacklist);
    }

    return undefined;

  };

  function applyStyles(doNotUpdateView) {

    setStyles(_userStyles.getStyles(), _$el);

    // if (_mediaOverlayPlayer)
    //   _mediaOverlayPlayer.applyStyles();

    if (doNotUpdateView) return;

    if (_currentView) {
      _currentView.applyStyles();
    }
  }

  // /**
  //  * Opens a content url from a media player context
  //  *
  //  * @param {string} contentRefUrl
  //  * @param {string} sourceFileHref
  //  * @param offset
  //  */
  // this.mediaOverlaysOpenContentUrl = function(contentRefUrl, sourceFileHref, offset) {
  //   _mediaOverlayPlayer.mediaOverlaysOpenContentUrl(contentRefUrl, sourceFileHref, offset);
  // };



  /**
   * Opens the content document specified by the url
   *
   * @param {string} contentRefUrl Url of the content document
   * @param {string | undefined} sourceFileHref Url to the file that contentRefUrl is relative to. If contentRefUrl is
   * relative ot the source file that contains it instead of the package file (ex. TOC file) We have to know the
   * sourceFileHref to resolve contentUrl relative to the package file.
   * @param {object} initiator optional
   */
  this.openContentUrl = function(contentRefUrl, sourceFileHref, initiator) {

    var combinedPath = ResolveContentRef(contentRefUrl, sourceFileHref);

    var hashIndex = combinedPath.indexOf("#");
    var hrefPart;
    var elementId;
    if (hashIndex >= 0) {
      hrefPart = combinedPath.substr(0, hashIndex);
      elementId = combinedPath.substr(hashIndex + 1);
    } else {
      hrefPart = combinedPath;
      elementId = undefined;
    }

    var spineItem = _spine.getItemByHref(hrefPart);
    if (!spineItem) {
      console.warn('spineItem ' + hrefPart + ' not found');
      // sometimes that happens because spine item's URI gets encoded,
      // yet it's compared with raw strings by `getItemByHref()` -
      // so we try to search with decoded link as well
      var decodedHrefPart = decodeURIComponent(hrefPart);
      spineItem = _spine.getItemByHref(decodedHrefPart);
      if (!spineItem) {
        console.warn('decoded spineItem ' + decodedHrefPart + ' missing as well');
        return false;
      }
    }

    return self.openSpineItemElementId(spineItem.idref, elementId, initiator);
  };

  /**
   * Opens the page of the spine item with element with provided cfi
   *
   * @param {string} idref Id of the spine item
   * @param {string} elementId id of the element to be shown
   * @param {object} initiator optional
   */
  this.openSpineItemElementId = function(idref, elementId, initiator) {

    var spineItem = _spine.getItemById(idref);
    if (!spineItem) {
      return false;
    }

    var pageData = new PageOpenRequest(spineItem, initiator);

    if (elementId) {
      pageData.setElementId(elementId);
    }


    openPage(pageData, 0);

    return true;
  };

  /**
   * Returns the bookmark associated with currently opened page.
   *
   * @returns {string} Serialized Models.BookmarkData object as JSON string.
   */
  this.bookmarkCurrentPage = function() {
    return JSON.stringify(_currentView.bookmarkCurrentPage());
  };

  /**
   * Resets all the custom styles set by setStyle callers at runtime
   */
  this.clearStyles = function() {

    _userStyles.resetStyleValues();
    applyStyles();
    _userStyles.clear();
  };

  /**
   * Resets all the custom styles set by setBookStyle callers at runtime
   */
  this.clearBookStyles = function() {

    if (_currentView) {

      _bookStyles.resetStyleValues();
      _currentView.applyBookStyles();
    }

    _bookStyles.clear();
  };

  // /**
  //  * Returns true if media overlay available for one of the open pages.
  //  *
  //  * @returns {boolean}
  //  */
  // this.isMediaOverlayAvailable = function() {

  //   if (!_mediaOverlayPlayer) return false;

  //   return _mediaOverlayPlayer.isMediaOverlayAvailable();
  // };

  // /*
  //     this.setMediaOverlaySkippables = function(items) {

  //         _mediaOverlayPlayer.setMediaOverlaySkippables(items);
  //     };

  //     this.setMediaOverlayEscapables = function(items) {

  //         _mediaOverlayPlayer.setMediaOverlayEscapables(items);
  //     };
  // */

  // /**
  //  * Starts/Stop playing media overlay on current page
  //  */
  // this.toggleMediaOverlay = function() {

  //   _mediaOverlayPlayer.toggleMediaOverlay();
  // };


  // /**
  //  * Plays next fragment media overlay
  //  */
  // this.nextMediaOverlay = function() {

  //   _mediaOverlayPlayer.nextMediaOverlay();

  // };

  // /**
  //  * Plays previous fragment media overlay
  //  */
  // this.previousMediaOverlay = function() {

  //   _mediaOverlayPlayer.previousMediaOverlay();

  // };

  // /**
  //  * Plays next available fragment media overlay that is outside of the current escapable scope
  //  */
  // this.escapeMediaOverlay = function() {

  //   _mediaOverlayPlayer.escape();
  // };

  // /**
  //  * End media overlay TTS
  //  * @todo Clarify what this does with Daniel.
  //  */
  // this.ttsEndedMediaOverlay = function() {

  //   _mediaOverlayPlayer.onTTSEnd();
  // };

  // /**
  //  * Pause currently playing media overlays.
  //  */
  // this.pauseMediaOverlay = function() {

  //   _mediaOverlayPlayer.pause();
  // };

  // /**
  //  * Start/Resume playback of media overlays.
  //  */
  // this.playMediaOverlay = function() {

  //   _mediaOverlayPlayer.play();
  // };

  // /**
  //  * Determine if media overlays are currently playing.
  //  * @returns {boolean}
  //  */
  // this.isPlayingMediaOverlay = function() {

  //   return _mediaOverlayPlayer.isPlaying();
  // };

  // //
  // // should use ReadiumSDK.Events.SETTINGS_APPLIED instead!
  // //    this.setRateMediaOverlay = function(rate) {
  // //
  // //        _mediaOverlayPlayer.setRate(rate);
  // //    };
  // //    this.setVolumeMediaOverlay = function(volume){
  // //
  // //        _mediaOverlayPlayer.setVolume(volume);
  // //    };

  // /**
  //  * Get the first visible media overlay element from the currently active content document(s)
  //  * @returns {HTMLElement|undefined}
  //  */
  // this.getFirstVisibleMediaOverlayElement = function() {

  //   if (_currentView) {
  //     return _currentView.getFirstVisibleMediaOverlayElement();
  //   }

  //   return undefined;
  // };

  /**
   * Used to jump to an element to make sure it is visible when a content document is paginated
   * @param {string}      spineItemId   The spine item idref associated with an active content document
   * @param {HTMLElement} element       The element to make visible
   * @param [initiator]
   */
  this.insureElementVisibility = function(spineItemId, element, initiator) {

    if (_currentView) {
      _currentView.insureElementVisibility(spineItemId, element, initiator);
    }
  };

  var _resizeBookmark = null;
  var _resizeMOWasPlaying = false;

  function handleViewportResizeStart() {

    _resizeBookmark = null;
    _resizeMOWasPlaying = false;

    if (_currentView) {

      if (_currentView.isReflowable && _currentView.isReflowable()) {
        _resizeMOWasPlaying = self.isPlayingMediaOverlay();
        if (_resizeMOWasPlaying) {
          self.pauseMediaOverlay();
        }
      }

      _resizeBookmark = _currentView.bookmarkCurrentPage(); // not self! (JSON string)
    }
  }

  function handleViewportResizeTick() {
    if (_currentView) {
      self.handleViewportResize(_resizeBookmark);
    }
  }

  function handleViewportResizeEnd() {
    //same as doing one final tick for now
    handleViewportResizeTick();

    if (_resizeMOWasPlaying) self.playMediaOverlay();
  }

  this.handleViewportResize = function(bookmarkToRestore) {
    if (!_currentView) return;

    var bookMark = bookmarkToRestore || _currentView.bookmarkCurrentPage(); // not self! (JSON string)

    if (_currentView.isReflowable && _currentView.isReflowable() && bookMark && bookMark.idref) {
      var spineItem = _spine.getItemById(bookMark.idref);

      initViewForItem(spineItem, function(isViewChanged) {
        self.openSpineItemElementCfi(bookMark.idref, bookMark.contentCFI, self);
        return;
      });
    } else {
      _currentView.onViewportResize();
    }
  };

  // /**
  //  * Returns current selection partial Cfi, useful for workflows that need to check whether the user has selected something.
  //  *
  //  * @returns {object | undefined} partial cfi object or undefined if nothing is selected
  //  */
  // this.getCurrentSelectionCfi = function() {
  //   return _annotationsManager.getCurrentSelectionCfi();
  // };

  // /**
  //  * Creates a higlight based on given parameters
  //  *
  //  * @param {string} spineIdRef    spine idref that defines the partial Cfi
  //  * @param {string} cfi           partial CFI (withouth the indirection step) relative to the spine index
  //  * @param {string} id            id of the highlight. must be unique
  //  * @param {string} type          currently "highlight" only
  //  *
  //  * @returns {object | undefined} partial cfi object of the created highlight
  //  */
  // this.addHighlight = function(spineIdRef, Cfi, id, type, styles) {
  //   return _annotationsManager.addHighlight(spineIdRef, Cfi, id, type, styles);
  // };


  // /**
  //  * Creates a higlight based on the current selection
  //  *
  //  * @param {string} id id of the highlight. must be unique
  //  * @param {string} type currently "highlight" only
  //  *
  //  * @returns {object | undefined} partial cfi object of the created highlight
  //  */
  // this.addSelectionHighlight = function(id, type) {
  //   return _annotationsManager.addSelectionHighlight(id, type);
  // };

  // /**
  //  * Removes A given highlight
  //  *
  //  * @param {string} id  The id associated with the highlight.
  //  *
  //  * @returns {undefined}
  //  *
  //  */
  // this.removeHighlight = function(id) {
  //   return _annotationsManager.removeHighlight(id);
  // };

  /**
   *
   * @param {string} eventName              Event name.
   * @param {function} callback             Callback function.
   * @param {object} context                User specified data passed to the callback function.
   * @returns {undefined}
   */
  this.addIFrameEventListener = function(eventName, callback, context) {
    _iframeLoader.addIFrameEventListener(eventName, callback, context);
  };

  // TODO Extract
  var BackgroundAudioTrackManager = function() {
    var _spineItemIframeMap = {};
    var _wasPlaying = false;

    var _callback_playPause = undefined;
    this.setCallback_PlayPause = function(callback) {
      _callback_playPause = callback;
    };

    var _callback_isAvailable = undefined;
    this.setCallback_IsAvailable = function(callback) {
      _callback_isAvailable = callback;
    };

    this.playPause = function(doPlay) {
      _playPause(doPlay);
    };

    var _playPause = function(doPlay) {
      if (_callback_playPause) {
        _callback_playPause(doPlay);
      }

      try {
        var $iframe = undefined;

        for (var prop in _spineItemIframeMap) {
          if (!_spineItemIframeMap.hasOwnProperty(prop)) continue;

          var data = _spineItemIframeMap[prop];
          if (!data || !data.active) continue;

          if ($iframe) console.error("More than one active iframe?? (pagination)");

          $iframe = data["$iframe"];
          if (!$iframe) continue;

          var $audios = $("audio", $iframe[0].contentDocument);

          $.each($audios, function() {

            var attr = this.getAttribute("epub:type") || this.getAttribute("type");

            if (!attr) return true; // continue

            if (attr.indexOf("ibooks:soundtrack") < 0 && attr.indexOf("media:soundtrack") < 0 && attr.indexOf("media:background") < 0) return true; // continue

            if (doPlay && this.play) {
              this.play();
            } else if (this.pause) {
              this.pause();
            }

            return true; // continue (more than one track?)
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    this.setPlayState = function(wasPlaying) {
      _wasPlaying = wasPlaying;
    };

    self.on(Events.CONTENT_DOCUMENT_LOADED, function($iframe, spineItem) {
      try {
        if (spineItem && spineItem.idref && $iframe && $iframe[0]) {
          // console.log("CONTENT_DOCUMENT_LOADED");
          // console.debug(spineItem.href);
          // console.debug(spineItem.idref);

          _spineItemIframeMap[spineItem.idref] = {
            "$iframe": $iframe,
            href: spineItem.href
          };
        }
      } catch (err) {
        console.error(err);
      }
    });

    self.on(Events.PAGINATION_CHANGED, function(pageChangeData) {
      // console.log("PAGINATION_CHANGED");
      // console.debug(pageChangeData);
      // 
      // if (pageChangeData.spineItem)
      // {
      //     console.debug(pageChangeData.spineItem.href);
      //     console.debug(pageChangeData.spineItem.idref);
      // }
      // else
      // {
      //     //console.error(pageChangeData);
      // }
      // 
      // if (pageChangeData.paginationInfo && pageChangeData.paginationInfo.openPages && pageChangeData.paginationInfo.openPages.length)
      // {
      //     for (var i = 0; i < pageChangeData.paginationInfo.openPages.length; i++)
      //     {
      //         console.log(pageChangeData.paginationInfo.openPages[i].idref);
      //     }
      // }

      var atLeastOne = false;

      try {
        for (var prop in _spineItemIframeMap) {
          if (!_spineItemIframeMap.hasOwnProperty(prop)) continue;

          var isActive = pageChangeData.spineItem && pageChangeData.spineItem.idref === prop;

          var isDisplayed = false;

          if (pageChangeData.paginationInfo && pageChangeData.paginationInfo.openPages.length) {
            var allSame = true;

            for (var i = 0; i < pageChangeData.paginationInfo.openPages.length; i++) {
              if (pageChangeData.paginationInfo.openPages[i].idref === prop) {
                isDisplayed = true;
              } else {
                allSame = false;
              }
            }

            if (!isActive && allSame) isActive = true;
          }

          if (isActive || isDisplayed) {
            var data = _spineItemIframeMap[prop];
            if (!data) continue;

            _spineItemIframeMap[prop]["active"] = isActive;

            var $iframe = data["$iframe"];
            var href = data.href;

            var $audios = $("audio", $iframe[0].contentDocument);
            $.each($audios, function() {

              var attr = this.getAttribute("epub:type") || this.getAttribute("type");

              if (!attr) return true; // continue

              if (attr.indexOf("ibooks:soundtrack") < 0 && attr.indexOf("media:soundtrack") < 0 && attr.indexOf("media:background") < 0) return true; // continue

              this.setAttribute("loop", "loop");
              this.removeAttribute("autoplay");

              // DEBUG!
              //this.setAttribute("controls", "controls");

              if (isActive) {
                // DEBUG!
                //$(this).css({border:"2px solid green"});
              } else {
                if (this.pause) this.pause();

                // DEBUG!
                //$(this).css({border:"2px solid red"});
              }

              atLeastOne = true;

              return true; // continue (more than one track?)
            });

            continue;
          } else {
            if (_spineItemIframeMap[prop]) _spineItemIframeMap[prop]["$iframe"] = undefined;
            _spineItemIframeMap[prop] = undefined;
          }
        }
      } catch (err) {
        console.error(err);
      }

      if (_callback_isAvailable) {
        _callback_isAvailable(atLeastOne);
      }

      if (atLeastOne) {
        if (_wasPlaying) {
          _playPause(true);
        } else {
          _playPause(false); // ensure correct paused state
        }
      } else {
        _playPause(false); // ensure correct paused state
      }
    });

    self.on(Events.MEDIA_OVERLAY_STATUS_CHANGED, function(value) {
      if (!value.smilIndex) return;
      var package = self.package();
      var smil = package.media_overlay.smilAt(value.smilIndex);
      if (!smil || !smil.spineItemId) return;

      var needUpdate = false;
      for (var prop in _spineItemIframeMap) {
        if (!_spineItemIframeMap.hasOwnProperty(prop)) continue;

        var data = _spineItemIframeMap[prop];
        if (!data) continue;

        if (data.active) {
          if (prop !== smil.spineItemId) {
            _playPause(false); // ensure correct paused state
            data.active = false;
            needUpdate = true;
          }
        }
      }

      if (needUpdate) {
        for (var prop in _spineItemIframeMap) {
          if (!_spineItemIframeMap.hasOwnProperty(prop)) continue;

          var data = _spineItemIframeMap[prop];
          if (!data) continue;

          if (!data.active) {
            if (prop === smil.spineItemId) {
              data.active = true;
            }
          }
        }

        if (_wasPlaying) {
          _playPause(true);
        }
      }
    });
  };
  this.backgroundAudioTrackManager = new BackgroundAudioTrackManager();
};

module.exports = ReaderView;

},{"../collections/style":28,"../events":29,"../helpers/extended-throttle":36,"../helpers/is-iframe-alive":39,"../helpers/resolve-content-ref":45,"../helpers/set-styles":46,"../internal-events":50,"../models/package":54,"../models/page-open-request":55,"../models/switches":60,"../models/trigger":61,"../models/viewer-settings":62,"./iframe-loader":66,"./reflowable-view":69,"backbone":7,"jquery":9,"underscore":10}],69:[function(require,module,exports){
//  LauncherOSX
//
//  Created by Boris Schneiderman.
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

var _ = require('underscore')
var $ = require('jquery')
var Backbone = require('backbone')
var BookmarkData = require('../models/bookmark-data')
var CfiNavigationLogic = require('./cfi-navigation-logic')
var CurrentPagesInfo = require('../models/current-pages-info')
var Events = require('../events')
var deduceSyntheticSpread = require('../helpers/deduce-synthetic-spread')
var InternalEvents = require('../internal-events')
var loadTemplate = require('../helpers/load-template')
var Margins = require('../helpers/margins')
var PageOpenRequest = require('../models/page-open-request')
var triggerLayout = require('../helpers/trigger-layout')
var setStyles = require('../helpers/set-styles')
var UpdateHtmlFontSize = require('../helpers/update-html-font-size')
var ViewerSettings = require('../models/viewer-settings')

/**
 * Renders reflowable content using CSS columns
 * @param options
 * @constructor
 */
function ReflowableView(options, reader) {

  _.extend(this, Backbone.Events);

  var self = this;

  var _$viewport = options.$viewport;
  var _spine = options.spine;
  var _userStyles = options.userStyles;
  var _bookStyles = options.bookStyles;
  var _iframeLoader = options.iframeLoader;

  var _currentSpineItem;
  var _isWaitingFrameRender = false;
  var _deferredPageRequest;
  var _fontSize = 100;
  var _$contentFrame;
  var _navigationLogic;
  var _$el;
  var _$iframe;
  var _$epubHtml;

  var _$htmlBody;

  var _htmlBodyIsVerticalWritingMode;
  var _htmlBodyIsLTRDirection;
  var _htmlBodyIsLTRWritingMode;


  var _currentOpacity = -1;

  var _lastViewPortSize = {
    width: undefined,
    height: undefined
  };

  var _paginationInfo = {

    visibleColumnCount: 2,
    columnGap: 20,
    spreadCount: 0,
    currentSpreadIndex: 0,
    columnWidth: undefined,
    pageOffset: 0,
    columnCount: 0
  };

  this.render = function() {

    var template = loadTemplate("reflowable_book_frame", {});

    _$el = $(template);
    _$viewport.append(_$el);

    var settings = reader.viewerSettings();
    if (!settings || typeof settings.enableGPUHardwareAccelerationCSS3D === "undefined") {
      //defaults
      settings = new ViewerSettings({});
    }
    if (settings.enableGPUHardwareAccelerationCSS3D) {
      // This fixes rendering issues with WebView (native apps), which clips content embedded in iframes unless GPU hardware acceleration is enabled for CSS rendering.
      _$el.css("transform", "translateZ(0)");
    }

    // See ReaderView.handleViewportResize
    // var lazyResize = _.debounce(self.onViewportResize, 100);
    // $(window).on("resize.ReadiumSDK.reflowableView", _.bind(lazyResize, self));
    renderIframe();

    return self;
  };

  function setFrameSizesToRectangle(rectangle) {
    _$contentFrame.css("left", rectangle.left + "px");
    _$contentFrame.css("top", rectangle.top + "px");
    _$contentFrame.css("right", rectangle.right + "px");
    _$contentFrame.css("bottom", rectangle.bottom + "px");

  }

  this.remove = function() {

    //$(window).off("resize.ReadiumSDK.reflowableView");
    _$el.remove();

  };

  this.isReflowable = function() {
    return true;
  };

  this.onViewportResize = function() {

    if (updateViewportSize()) {
      updatePagination();
    }
  };

  var _viewSettings = undefined;
  this.setViewSettings = function(settings) {

    _viewSettings = settings;

    _paginationInfo.columnGap = settings.columnGap;
    _fontSize = settings.fontSize;

    updateHtmlFontSize();
    updateColumnGap();

    updateViewportSize();
    updatePagination();
  };

  function renderIframe() {
    if (_$contentFrame) {
      //destroy old contentFrame
      _$contentFrame.remove();
    }

    var template = loadTemplate("reflowable_book_page_frame", {});
    var $bookFrame = $(template);
    $bookFrame = _$el.append($bookFrame);

    _$contentFrame = $("#reflowable-content-frame", $bookFrame);

    _$iframe = $("#epubContentIframe", $bookFrame);

    _$iframe.css("left", "");
    _$iframe.css("right", "");
    _$iframe.css("position", "relative");
    //_$iframe.css(_spine.isLeftToRight() ? "left" : "right", "0px");
    _$iframe.css("overflow", "hidden");

    _navigationLogic = new CfiNavigationLogic(
      _$contentFrame, _$iframe, {
        rectangleBased: true,
        paginationInfo: _paginationInfo
      });
  }

  function loadSpineItem(spineItem) {

    if (_currentSpineItem != spineItem) {

      //create & append iframe to container frame
      renderIframe();

      _paginationInfo.pageOffset = 0;
      _paginationInfo.currentSpreadIndex = 0;
      _currentSpineItem = spineItem;
      _isWaitingFrameRender = true;

      var src = _spine.package.resolveRelativeUrl(spineItem.href);
      self.trigger(Events.CONTENT_DOCUMENT_LOAD_START, _$iframe, spineItem);

      _$iframe.css("opacity", "0.01");

      _iframeLoader.loadIframe(_$iframe[0], src, onIFrameLoad, self, {
        spineItem: spineItem
      });
    }
  }

  function updateHtmlFontSize() {

    if (_$epubHtml) {
      UpdateHtmlFontSize(_$epubHtml, _fontSize);
    }
  }

  function updateColumnGap() {

    if (_$epubHtml) {

      _$epubHtml.css("column-gap", _paginationInfo.columnGap + "px");
    }
  }

  function onIFrameLoad(success) {

    _isWaitingFrameRender = false;

    //while we where loading frame new request came
    if (_deferredPageRequest && _deferredPageRequest.spineItem != _currentSpineItem) {
      loadSpineItem(_deferredPageRequest.spineItem);
      return;
    }

    if (!success) {
      _$iframe.css("opacity", "1");
      _deferredPageRequest = undefined;
      return;
    }

    self.trigger(Events.CONTENT_DOCUMENT_LOADED, _$iframe, _currentSpineItem);

    var epubContentDocument = _$iframe[0].contentDocument;
    _$epubHtml = $("html", epubContentDocument);
    _$htmlBody = $("body", _$epubHtml);

    // Video surface sometimes (depends on the video codec) disappears from CSS column (i.e. reflow page) during playback (audio continues to play normally, but video canvas is invisible).
    // Enabling CSS3D fixes this Chrome-specific rendering bug.
    if (window.chrome && window.navigator.vendor === "Google Inc.") // TODO: Opera (WebKit) sometimes suffers from this rendering bug too (depends on the video codec), but unfortunately GPU-accelerated rendering makes the video controls unresponsive!!
    {
      $("video", _$htmlBody).css("transform", "translateZ(0)");
    }

    _htmlBodyIsVerticalWritingMode = false;
    _htmlBodyIsLTRDirection = true;
    _htmlBodyIsLTRWritingMode = undefined;

    var win = _$iframe[0].contentDocument.defaultView || _$iframe[0].contentWindow;

    //Helpers.isIframeAlive
    var htmlBodyComputedStyle = win.getComputedStyle(_$htmlBody[0], null);
    if (htmlBodyComputedStyle) {
      _htmlBodyIsLTRDirection = htmlBodyComputedStyle.direction === "ltr";

      var writingMode = undefined;
      if (htmlBodyComputedStyle.getPropertyValue) {
        writingMode = htmlBodyComputedStyle.getPropertyValue("-webkit-writing-mode") || htmlBodyComputedStyle.getPropertyValue("-moz-writing-mode") || htmlBodyComputedStyle.getPropertyValue("-ms-writing-mode") || htmlBodyComputedStyle.getPropertyValue("-o-writing-mode") || htmlBodyComputedStyle.getPropertyValue("-epub-writing-mode") || htmlBodyComputedStyle.getPropertyValue("writing-mode");
      } else {
        writingMode = htmlBodyComputedStyle.webkitWritingMode || htmlBodyComputedStyle.mozWritingMode || htmlBodyComputedStyle.msWritingMode || htmlBodyComputedStyle.oWritingMode || htmlBodyComputedStyle.epubWritingMode || htmlBodyComputedStyle.writingMode;
      }

      if (writingMode) {
        _htmlBodyIsLTRWritingMode = writingMode.indexOf("-lr") >= 0; // || writingMode.indexOf("horizontal-") >= 0; we need explicit!

        if (writingMode.indexOf("vertical") >= 0 || writingMode.indexOf("tb-") >= 0 || writingMode.indexOf("bt-") >= 0) {
          _htmlBodyIsVerticalWritingMode = true;
        }
      }
    }

    if (_htmlBodyIsLTRDirection) {
      if (_$htmlBody[0].getAttribute("dir") === "rtl" || _$epubHtml[0].getAttribute("dir") === "rtl") {
        _htmlBodyIsLTRDirection = false;
      }
    }

    // Some EPUBs may not have explicit RTL content direction (via CSS "direction" property or @dir attribute) despite having a RTL page progression direction. Readium consequently tweaks the HTML in order to restore the correct block flow in the browser renderer, resulting in the appropriate CSS columnisation (which is used to emulate pagination).
    if (!_spine.isLeftToRight() && _htmlBodyIsLTRDirection && !_htmlBodyIsVerticalWritingMode) {
      _$htmlBody[0].setAttribute("dir", "rtl");
      _htmlBodyIsLTRDirection = false;
      _htmlBodyIsLTRWritingMode = false;
    }

    _paginationInfo.isVerticalWritingMode = _htmlBodyIsVerticalWritingMode;

    hideBook();
    _$iframe.css("opacity", "1");

    updateViewportSize();
    _$epubHtml.css("height", _lastViewPortSize.height + "px");

    _$epubHtml.css("position", "relative");
    _$epubHtml.css("margin", "0");
    _$epubHtml.css("padding", "0");

    _$epubHtml.css("column-axis", (_htmlBodyIsVerticalWritingMode ? "vertical" : "horizontal"));

    //
    // /////////
    // //Columns Debugging
    //
    //     _$epubHtml.css("column-rule-color", "red");
    //     _$epubHtml.css("column-rule-style", "dashed");
    //     _$epubHtml.css("column-rule-width", "1px");
    // _$epubHtml.css("background-color", '#b0c4de');
    //
    // ////

    self.applyBookStyles();
    resizeImages();

    updateHtmlFontSize();
    updateColumnGap();


    self.applyStyles();
  }

  this.applyStyles = function() {

    setStyles(_userStyles.getStyles(), _$el.parent());

    //because left, top, bottom, right setting ignores padding of parent container
    //we have to take it to account manually
    var elementMargins = Margins.fromElement(_$el);
    setFrameSizesToRectangle(elementMargins.padding);


    updateViewportSize();
    updatePagination();
  };

  this.applyBookStyles = function() {

    if (_$epubHtml) {
      setStyles(_bookStyles.getStyles(), _$epubHtml);
    }
  };

  function openDeferredElement() {

    if (!_deferredPageRequest) {
      return;
    }

    var deferredData = _deferredPageRequest;
    _deferredPageRequest = undefined;
    self.openPage(deferredData);

  }

  this.openPage = function(pageRequest) {

    if (_isWaitingFrameRender) {
      _deferredPageRequest = pageRequest;
      return;
    }

    // if no spine item specified we are talking about current spine item
    if (pageRequest.spineItem && pageRequest.spineItem != _currentSpineItem) {
      _deferredPageRequest = pageRequest;
      loadSpineItem(pageRequest.spineItem);
      return;
    }

    var pageIndex = undefined;


    if (pageRequest.spineItemPageIndex !== undefined) {
      pageIndex = pageRequest.spineItemPageIndex;
    } else if (pageRequest.elementId) {
      pageIndex = _navigationLogic.getPageForElementId(pageRequest.elementId);
    } else if (pageRequest.elementCfi) {
      try {
        pageIndex = _navigationLogic.getPageForElementCfi(pageRequest.elementCfi, ["cfi-marker", "mo-cfi-highlight"], [], ["MathJax_Message"]);
      } catch (e) {
        pageIndex = 0;
        console.error(e);
      }
    } else if (pageRequest.firstPage) {
      pageIndex = 0;
    } else if (pageRequest.lastPage) {
      pageIndex = _paginationInfo.columnCount - 1;
    } else {
      console.debug("No criteria in pageRequest");
      pageIndex = 0;
    }

    if (pageIndex >= 0 && pageIndex < _paginationInfo.columnCount) {
      _paginationInfo.currentSpreadIndex = Math.floor(pageIndex / _paginationInfo.visibleColumnCount);
      onPaginationChanged(pageRequest.initiator, pageRequest.spineItem, pageRequest.elementId);
    } else {
      console.log('Illegal pageIndex value: ', pageIndex, 'column count is ', _paginationInfo.columnCount);
    }
  };

  function redraw() {

    var offsetVal = -_paginationInfo.pageOffset + "px";

    if (_htmlBodyIsVerticalWritingMode) {
      _$epubHtml.css("top", offsetVal);
    } else {
      var ltr = _htmlBodyIsLTRDirection || _htmlBodyIsLTRWritingMode;

      _$epubHtml.css("left", ltr ? offsetVal : "");
      _$epubHtml.css("right", !ltr ? offsetVal : "");
    }

    showBook(); // as it's no longer hidden by shifting the position
  }

  function updateViewportSize() {

    var newWidth = _$contentFrame.width();
    var newHeight = _$contentFrame.height();

    if (_lastViewPortSize.width !== newWidth || _lastViewPortSize.height !== newHeight) {

      _lastViewPortSize.width = newWidth;
      _lastViewPortSize.height = newHeight;
      return true;
    }

    return false;
  }

  function onPaginationChanged(initiator, paginationRequest_spineItem, paginationRequest_elementId) {

    _paginationInfo.pageOffset = (_paginationInfo.columnWidth + _paginationInfo.columnGap) * _paginationInfo.visibleColumnCount * _paginationInfo.currentSpreadIndex;

    redraw();
    self.trigger(InternalEvents.CURRENT_VIEW_PAGINATION_CHANGED, {
      paginationInfo: self.getPaginationInfo(),
      initiator: initiator,
      spineItem: paginationRequest_spineItem,
      elementId: paginationRequest_elementId
    });
  }

  this.openPagePrev = function(initiator) {

    if (!_currentSpineItem) {
      return;
    }

    if (_paginationInfo.currentSpreadIndex > 0) {
      _paginationInfo.currentSpreadIndex--;
      onPaginationChanged(initiator);
    } else {

      var prevSpineItem = _spine.prevItem(_currentSpineItem, true);
      if (prevSpineItem) {

        var pageRequest = new PageOpenRequest(prevSpineItem, initiator);
        pageRequest.setLastPage();
        self.openPage(pageRequest);
      }
    }
  };

  this.openPageNext = function(initiator) {

    if (!_currentSpineItem) {
      return;
    }

    if (_paginationInfo.currentSpreadIndex < _paginationInfo.spreadCount - 1) {
      _paginationInfo.currentSpreadIndex++;
      onPaginationChanged(initiator);
    } else {

      var nextSpineItem = _spine.nextItem(_currentSpineItem, true);
      if (nextSpineItem) {

        var pageRequest = new PageOpenRequest(nextSpineItem, initiator);
        pageRequest.setFirstPage();
        self.openPage(pageRequest);
      }
    }
  };


  function updatePagination() {

    // At 100% font-size = 16px (on HTML, not body or descendant markup!)
    var MAXW = 550; //TODO user/vendor-configurable?
    var MINW = 400;

    var isDoublePageSyntheticSpread = deduceSyntheticSpread(_$viewport, _currentSpineItem, _viewSettings);

    var forced = (isDoublePageSyntheticSpread === false) || (isDoublePageSyntheticSpread === true);
    // excludes 0 and 1 falsy/truthy values which denote non-forced result

    // console.debug("isDoublePageSyntheticSpread: " + isDoublePageSyntheticSpread);
    // console.debug("forced: " + forced);
    //
    if (isDoublePageSyntheticSpread === 0) {
      isDoublePageSyntheticSpread = 1; // try double page, will shrink if doesn't fit
      // console.debug("TRYING SPREAD INSTEAD OF SINGLE...");
    }

    _paginationInfo.visibleColumnCount = isDoublePageSyntheticSpread ? 2 : 1;

    if (_htmlBodyIsVerticalWritingMode) {
      MAXW *= 2;
      isDoublePageSyntheticSpread = false;
      forced = true;
      _paginationInfo.visibleColumnCount = 1;
      // console.debug("Vertical Writing Mode => single CSS column, but behaves as if two-page spread");
    }

    if (!_$epubHtml) {
      return;
    }

    hideBook(); // shiftBookOfScreen();

    var borderLeft = parseInt(_$viewport.css("border-left-width"));
    var borderRight = parseInt(_$viewport.css("border-right-width"));
    var adjustedGapLeft = _paginationInfo.columnGap / 2;
    adjustedGapLeft = Math.max(0, adjustedGapLeft - borderLeft)
    var adjustedGapRight = _paginationInfo.columnGap / 2;
    adjustedGapRight = Math.max(0, adjustedGapRight - borderRight)

    var filler = 0;

    //         var win = _$iframe[0].contentDocument.defaultView || _$iframe[0].contentWindow;
    //         var htmlBodyComputedStyle = win.getComputedStyle(_$htmlBody[0], null);
    //         if (htmlBodyComputedStyle)
    //         {
    //             var fontSize = undefined;
    //             if (htmlBodyComputedStyle.getPropertyValue)
    //             {
    //                 fontSize = htmlBodyComputedStyle.getPropertyValue("font-size");
    //             }
    //             else
    //             {
    //                 fontSize = htmlBodyComputedStyle.fontSize;
    //             }
    // console.debug(fontSize);
    //         }

    if (_viewSettings.fontSize) {
      var fontSizeAdjust = (_viewSettings.fontSize * 0.8) / 100;
      MAXW = Math.floor(MAXW * fontSizeAdjust);
      MINW = Math.floor(MINW * fontSizeAdjust);
    }

    var availableWidth = _$viewport.width();
    var textWidth = availableWidth - borderLeft - borderRight - adjustedGapLeft - adjustedGapRight;
    if (isDoublePageSyntheticSpread) {
      textWidth = (textWidth - _paginationInfo.columnGap) * 0.5;
    }

    if (textWidth > MAXW) {
      // console.debug("LIMITING WIDTH");
      filler = Math.floor((textWidth - MAXW) * (isDoublePageSyntheticSpread ? 1 : 0.5));
    } else if (!forced && textWidth < MINW && isDoublePageSyntheticSpread) {
      //console.debug("REDUCING SPREAD TO SINGLE");
      isDoublePageSyntheticSpread = false;
      _paginationInfo.visibleColumnCount = 1;

      textWidth = availableWidth - borderLeft - borderRight - adjustedGapLeft - adjustedGapRight;
      if (textWidth > MAXW) {
        filler = Math.floor((textWidth - MAXW) * 0.5);
      }
    }

    _$el.css({
      "left": (filler + adjustedGapLeft + "px"),
      "right": (filler + adjustedGapRight + "px")
    });
    updateViewportSize(); //_$contentFrame ==> _lastViewPortSize


    _$iframe.css("width", _lastViewPortSize.width + "px");
    _$iframe.css("height", _lastViewPortSize.height + "px");

    _$epubHtml.css("height", _lastViewPortSize.height + "px");

    // below min- max- are required in vertical writing mode (height is not enough, in some cases...weird!)
    _$epubHtml.css("min-height", _lastViewPortSize.height + "px");
    _$epubHtml.css("max-height", _lastViewPortSize.height + "px");

    //normalise spacing to avoid interference with column-isation
    _$epubHtml.css('margin', 0);
    _$epubHtml.css('padding', 0);
    _$epubHtml.css('border', 0);
    _$htmlBody.css('margin', 0);
    _$htmlBody.css('padding', 0);

    var spacing = 0;
    try {
      spacing = parseInt(_$htmlBody.css('padding-top')) + parseInt(_$htmlBody.css('border-top-width')) + parseInt(_$htmlBody.css('border-bottom-width'));
    } catch (err) {

    }
    // Needed for Firefox, otherwise content shrinks vertically, resulting in scrollWidth accomodating more columns than necessary
    //_$htmlBody.css("min-height", _lastViewPortSize.height-spacing-9 + "px");
    _$htmlBody.css("min-height", "50%");
    _$htmlBody.css("max-height", _lastViewPortSize.height - spacing + "px");

    _paginationInfo.rightToLeft = _spine.isRightToLeft();

    _paginationInfo.columnWidth = Math.round(((_htmlBodyIsVerticalWritingMode ? _lastViewPortSize.height : _lastViewPortSize.width) - _paginationInfo.columnGap * (_paginationInfo.visibleColumnCount - 1)) / _paginationInfo.visibleColumnCount);

    _$epubHtml.css("width", (_htmlBodyIsVerticalWritingMode ? _lastViewPortSize.width : _paginationInfo.columnWidth) + "px");

    _$epubHtml.css("column-width", _paginationInfo.columnWidth + "px");

    _$epubHtml.css({
      left: "0",
      right: "0",
      top: "0"
    });

    triggerLayout(_$iframe);

    _paginationInfo.columnCount = ((_htmlBodyIsVerticalWritingMode ? _$epubHtml[0].scrollHeight : _$epubHtml[0].scrollWidth) + _paginationInfo.columnGap) / (_paginationInfo.columnWidth + _paginationInfo.columnGap);
    _paginationInfo.columnCount = Math.round(_paginationInfo.columnCount);

    var totalGaps = (_paginationInfo.columnCount - 1) * _paginationInfo.columnGap;
    var colWidthCheck = ((_htmlBodyIsVerticalWritingMode ? _$epubHtml[0].scrollHeight : _$epubHtml[0].scrollWidth) - totalGaps) / _paginationInfo.columnCount;
    colWidthCheck = Math.round(colWidthCheck);

    if (colWidthCheck > _paginationInfo.columnWidth) {
      console.debug("ADJUST COLUMN");
      console.log(_paginationInfo.columnWidth);
      console.log(colWidthCheck);

      _paginationInfo.columnWidth = colWidthCheck;
    }

    _paginationInfo.spreadCount = Math.ceil(_paginationInfo.columnCount / _paginationInfo.visibleColumnCount);

    if (_paginationInfo.currentSpreadIndex >= _paginationInfo.spreadCount) {
      _paginationInfo.currentSpreadIndex = _paginationInfo.spreadCount - 1;
    }

    if (_deferredPageRequest) {

      //if there is a request for specific page we get here
      openDeferredElement();
    } else {

      //we get here on resizing the viewport

      onPaginationChanged(self); // => redraw() => showBook(), so the trick below is not needed

      // //We do this to force re-rendering of the document in the iframe.
      // //There is a bug in WebView control with right to left columns layout - after resizing the window html document
      // //is shifted in side the containing div. Hiding and showing the html element puts document in place.
      // _$epubHtml.hide();
      // setTimeout(function() {
      //     _$epubHtml.show();
      //     onPaginationChanged(self); // => redraw() => showBook()
      // }, 50);

    }
  }

  //    function shiftBookOfScreen() {
  //
  //        if(_spine.isLeftToRight()) {
  //            _$epubHtml.css("left", (_lastViewPortSize.width + 1000) + "px");
  //        }
  //        else {
  //            _$epubHtml.css("right", (_lastViewPortSize.width + 1000) + "px");
  //        }
  //    }

  function hideBook() {
    if (_currentOpacity != -1) return; // already hidden

    _currentOpacity = _$epubHtml.css('opacity');
    _$epubHtml.css('opacity', "0");
  }

  function showBook() {
    if (_currentOpacity != -1) {
      _$epubHtml.css('opacity', _currentOpacity);
    }
    _currentOpacity = -1;
  }

  this.getFirstVisibleElementCfi = function() {

    var contentOffsets = getVisibleContentOffsets();
    return _navigationLogic.getFirstVisibleElementCfi(contentOffsets);
  };

  this.getPaginationInfo = function() {

    var paginationInfo = new CurrentPagesInfo(_spine, false);

    if (!_currentSpineItem) {
      return paginationInfo;
    }

    var pageIndexes = getOpenPageIndexes();

    for (var i = 0, count = pageIndexes.length; i < count; i++) {

      paginationInfo.addOpenPage(pageIndexes[i], _paginationInfo.columnCount, _currentSpineItem.idref, _currentSpineItem.index);
    }

    return paginationInfo;

  };

  function getOpenPageIndexes() {

    var indexes = [];

    var currentPage = _paginationInfo.currentSpreadIndex * _paginationInfo.visibleColumnCount;

    for (var i = 0; i < _paginationInfo.visibleColumnCount && (currentPage + i) < _paginationInfo.columnCount; i++) {

      indexes.push(currentPage + i);
    }

    return indexes;

  }

  //we need this styles for css columnizer not to chop big images
  function resizeImages() {

    if (!_$epubHtml) {
      return;
    }

    var $elem;
    var height;
    var width;

    $('img, svg', _$epubHtml).each(function() {

      $elem = $(this);

      // if we set max-width/max-height to 100% columnizing engine chops images embedded in the text
      // (but not if we set it to 99-98%) go figure.
      // TODO: CSS min-w/h is content-box, not border-box (does not take into account padding + border)? => images may still overrun?
      $elem.css('max-width', '98%');
      $elem.css('max-height', '98%');

      if (!$elem.css('height')) {
        $elem.css('height', 'auto');
      }

      if (!$elem.css('width')) {
        $elem.css('width', 'auto');
      }

    });
  }

  this.bookmarkCurrentPage = function() {

    if (!_currentSpineItem) {

      return new BookmarkData("", "");
    }

    return new BookmarkData(_currentSpineItem.idref, self.getFirstVisibleElementCfi());
  };

  function getVisibleContentOffsets() {
    //TODO: _htmlBodyIsVerticalWritingMode ? (_lastViewPortSize.height * _paginationInfo.currentSpreadIndex)
    // NOT used with options.rectangleBased anyway (see CfiNavigationLogic constructor call, here in this reflow engine class)
    var columnsLeftOfViewport = Math.round(_paginationInfo.pageOffset / (_paginationInfo.columnWidth + _paginationInfo.columnGap));

    var topOffset = columnsLeftOfViewport * _$contentFrame.height();
    var bottomOffset = topOffset + _paginationInfo.visibleColumnCount * _$contentFrame.height();

    return {
      top: topOffset,
      bottom: bottomOffset
    };
  }

  this.getLoadedSpineItems = function() {
    return [_currentSpineItem];
  };

  this.getElementByCfi = function(spineItem, cfi, classBlacklist, elementBlacklist, idBlacklist) {

    if (spineItem != _currentSpineItem) {
      console.error("spine item is not loaded");
      return undefined;
    }

    return _navigationLogic.getElementByCfi(cfi, classBlacklist, elementBlacklist, idBlacklist);
  };

  this.getElementById = function(spineItem, id) {

    if (spineItem != _currentSpineItem) {
      console.error("spine item is not loaded");
      return undefined;
    }

    return _navigationLogic.getElementById(id);
  };

  this.getElement = function(spineItem, selector) {

    if (spineItem != _currentSpineItem) {
      console.error("spine item is not loaded");
      return undefined;
    }

    return _navigationLogic.getElement(selector);
  };

  this.getFirstVisibleMediaOverlayElement = function() {

    var visibleContentOffsets = getVisibleContentOffsets();
    return _navigationLogic.getFirstVisibleMediaOverlayElement(visibleContentOffsets);
  };

  // /**
  //  * @deprecated
  //  */
  // this.getVisibleMediaOverlayElements = function() {
  // 
  //     var visibleContentOffsets = getVisibleContentOffsets();
  //     return _navigationLogic.getVisibleMediaOverlayElements(visibleContentOffsets);
  // };

  this.insureElementVisibility = function(spineItemId, element, initiator) {

    var $element = $(element);
    if (_navigationLogic.isElementVisible($element, getVisibleContentOffsets())) {
      return;
    }

    var page = _navigationLogic.getPageForElement($element);

    if (page == -1) {
      return;
    }

    var openPageRequest = new PageOpenRequest(_currentSpineItem, initiator);
    openPageRequest.setPageIndex(page);

    var id = element.id;
    if (!id) {
      id = element.getAttribute("id");
    }

    if (id) {
      openPageRequest.setElementId(id);
    }

    self.openPage(openPageRequest);
  }

}

module.exports = ReflowableView
},{"../events":29,"../helpers/deduce-synthetic-spread":33,"../helpers/load-template":41,"../helpers/margins":42,"../helpers/set-styles":46,"../helpers/trigger-layout":47,"../helpers/update-html-font-size":48,"../internal-events":50,"../models/bookmark-data":51,"../models/current-pages-info":52,"../models/page-open-request":55,"../models/viewer-settings":62,"./cfi-navigation-logic":64,"backbone":7,"jquery":9,"underscore":10}]},{},[12]);
