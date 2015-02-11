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
var $ = require('zepto')

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

},{"zepto":11}],3:[function(require,module,exports){
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
// Generated by CoffeeScript 1.6.3
(function() {
  var Deferred, PENDING, REJECTED, RESOLVED, VERSION, after, execute, flatten, has, installInto, isArguments, isPromise, wrap, _when,
    __slice = [].slice;

  VERSION = '3.0.0';

  PENDING = "pending";

  RESOLVED = "resolved";

  REJECTED = "rejected";

  has = function(obj, prop) {
    return obj != null ? obj.hasOwnProperty(prop) : void 0;
  };

  isArguments = function(obj) {
    return has(obj, 'length') && has(obj, 'callee');
  };

  isPromise = function(obj) {
    return has(obj, 'promise') && typeof (obj != null ? obj.promise : void 0) === 'function';
  };

  flatten = function(array) {
    if (isArguments(array)) {
      return flatten(Array.prototype.slice.call(array));
    }
    if (!Array.isArray(array)) {
      return [array];
    }
    return array.reduce(function(memo, value) {
      if (Array.isArray(value)) {
        return memo.concat(flatten(value));
      }
      memo.push(value);
      return memo;
    }, []);
  };

  after = function(times, func) {
    if (times <= 0) {
      return func();
    }
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  wrap = function(func, wrapper) {
    return function() {
      var args;
      args = [func].concat(Array.prototype.slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  execute = function(callbacks, args, context) {
    var callback, _i, _len, _ref, _results;
    _ref = flatten(callbacks);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      _results.push(callback.call.apply(callback, [context].concat(__slice.call(args))));
    }
    return _results;
  };

  Deferred = function() {
    var candidate, close, closingArguments, doneCallbacks, failCallbacks, progressCallbacks, state;
    state = PENDING;
    doneCallbacks = [];
    failCallbacks = [];
    progressCallbacks = [];
    closingArguments = {
      'resolved': {},
      'rejected': {},
      'pending': {}
    };
    this.promise = function(candidate) {
      var pipe, storeCallbacks;
      candidate = candidate || {};
      candidate.state = function() {
        return state;
      };
      storeCallbacks = function(shouldExecuteImmediately, holder, holderState) {
        return function() {
          if (state === PENDING) {
            holder.push.apply(holder, flatten(arguments));
          }
          if (shouldExecuteImmediately()) {
            execute(arguments, closingArguments[holderState]);
          }
          return candidate;
        };
      };
      candidate.done = storeCallbacks((function() {
        return state === RESOLVED;
      }), doneCallbacks, RESOLVED);
      candidate.fail = storeCallbacks((function() {
        return state === REJECTED;
      }), failCallbacks, REJECTED);
      candidate.progress = storeCallbacks((function() {
        return state !== PENDING;
      }), progressCallbacks, PENDING);
      candidate.always = function() {
        var _ref;
        return (_ref = candidate.done.apply(candidate, arguments)).fail.apply(_ref, arguments);
      };
      pipe = function(doneFilter, failFilter, progressFilter) {
        var filter, master;
        master = new Deferred();
        filter = function(source, funnel, callback) {
          if (!callback) {
            return candidate[source](master[funnel]);
          }
          return candidate[source](function() {
            var args, value;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            value = callback.apply(null, args);
            if (isPromise(value)) {
              return value.done(master.resolve).fail(master.reject).progress(master.notify);
            } else {
              return master[funnel](value);
            }
          });
        };
        filter('done', 'resolve', doneFilter);
        filter('fail', 'reject', failFilter);
        filter('progress', 'notify', progressFilter);
        return master;
      };
      candidate.pipe = pipe;
      candidate.then = pipe;
      if (candidate.promise == null) {
        candidate.promise = function() {
          return candidate;
        };
      }
      return candidate;
    };
    this.promise(this);
    candidate = this;
    close = function(finalState, callbacks, context) {
      return function() {
        if (state === PENDING) {
          state = finalState;
          closingArguments[finalState] = arguments;
          execute(callbacks, closingArguments[finalState], context);
          return candidate;
        }
        return this;
      };
    };
    this.resolve = close(RESOLVED, doneCallbacks);
    this.reject = close(REJECTED, failCallbacks);
    this.notify = close(PENDING, progressCallbacks);
    this.resolveWith = function(context, args) {
      return close(RESOLVED, doneCallbacks, context).apply(null, args);
    };
    this.rejectWith = function(context, args) {
      return close(REJECTED, failCallbacks, context).apply(null, args);
    };
    this.notifyWith = function(context, args) {
      return close(PENDING, progressCallbacks, context).apply(null, args);
    };
    return this;
  };

  _when = function() {
    var def, defs, finish, resolutionArgs, trigger, _i, _len;
    defs = flatten(arguments);
    if (defs.length === 1) {
      if (isPromise(defs[0])) {
        return defs[0];
      } else {
        return (new Deferred()).resolve(defs[0]).promise();
      }
    }
    trigger = new Deferred();
    if (!defs.length) {
      return trigger.resolve().promise();
    }
    resolutionArgs = [];
    finish = after(defs.length, function() {
      return trigger.resolve.apply(trigger, resolutionArgs);
    });
    defs.forEach(function(def, index) {
      if (isPromise(def)) {
        return def.done(function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          resolutionArgs[index] = args.length > 1 ? args : args[0];
          return finish();
        });
      } else {
        resolutionArgs[index] = def;
        return finish();
      }
    });
    for (_i = 0, _len = defs.length; _i < _len; _i++) {
      def = defs[_i];
      isPromise(def) && def.fail(trigger.reject);
    }
    return trigger.promise();
  };

  installInto = function(fw) {
    fw.Deferred = function() {
      return new Deferred();
    };
    fw.ajax = wrap(fw.ajax, function(ajax, options) {
      var createWrapper, def, promise, xhr;
      if (options == null) {
        options = {};
      }
      def = new Deferred();
      createWrapper = function(wrapped, finisher) {
        return wrap(wrapped, function() {
          var args, func;
          func = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (func) {
            func.apply(null, args);
          }
          return finisher.apply(null, args);
        });
      };
      options.success = createWrapper(options.success, def.resolve);
      options.error = createWrapper(options.error, def.reject);
      xhr = ajax(options);
      promise = def.promise();
      promise.abort = function() {
        return xhr.abort();
      };
      return promise;
    });
    return fw.when = _when;
  };

  if (typeof exports !== 'undefined') {
    exports.Deferred = function() {
      return new Deferred();
    };
    exports.when = _when;
    exports.installInto = installInto;
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      if (typeof Zepto !== 'undefined') {
        return installInto(Zepto);
      } else {
        Deferred.when = _when;
        Deferred.installInto = installInto;
        return Deferred;
      }
    });
  } else if (typeof Zepto !== 'undefined') {
    installInto(Zepto);
  } else {
    this.Deferred = function() {
      return new Deferred();
    };
    this.Deferred.when = _when;
    this.Deferred.installInto = installInto;
  }

}).call(this);

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
/* Zepto v1.1.6 - zepto event ajax form ie - zeptojs.com/license */

var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
    document = window.document,
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div'),
    propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    },
    isArray = Array.isArray ||
      function(object){ return object instanceof Array }

  zepto.matches = function(element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    var dom, nodes, container

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
      if (!(name in containers)) name = '*'

      container = containers[name]
      container.innerHTML = '' + html
      dom = $.each(slice.call(container.childNodes), function(){
        container.removeChild(this)
      })
    }

    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }

    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = $.fn
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    var dom
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // Optimize for string selectors
    else if (typeof selector == 'string') {
      selector = selector.trim()
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector))
        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, just return it
    else if (zepto.isZ(selector)) return selector
    else {
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes.
      else if (isObject(selector))
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector)
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found,
        maybeID = selector[0] == '#',
        maybeClass = !maybeID && selector[0] == '.',
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
        isSimple = simpleSelectorRE.test(nameOnly)
    return (isDocument(element) && isSimple && maybeID) ?
      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
      slice.call(
        isSimple && !maybeID ?
          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
          element.getElementsByTagName(selector) : // Or a tag
          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
      )
  }

  function filtered(nodes, selector) {
    return selector == null ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = document.documentElement.contains ?
    function(parent, node) {
      return parent !== node && parent.contains(node)
    } :
    function(parent, node) {
      while (node && (node = node.parentNode))
        if (node === parent) return true
      return false
    }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className || '',
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          +value + "" == value ? +value :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      // need to check if document.body exists for IE as that browser reports
      // document ready when it hasn't yet created the body element
      if (readyRE.test(document.readyState) && document.body) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (!selector) result = $()
      else if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return 0 in arguments ?
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        }) :
        (0 in this ? this[0].innerHTML : null)
    },
    text: function(text){
      return 0 in arguments ?
        this.each(function(idx){
          var newText = funcArg(this, text, idx, this.textContent)
          this.textContent = newText == null ? '' : ''+newText
        }) :
        (0 in this ? this[0].textContent : null)
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && !(1 in arguments)) ?
        (!this.length || this[0].nodeType !== 1 ? undefined :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
        setAttribute(this, attribute)
      }, this)})
    },
    prop: function(name, value){
      name = propMap[name] || name
      return (1 in arguments) ?
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        }) :
        (this[0] && this[0][name])
    },
    data: function(name, value){
      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

      var data = (1 in arguments) ?
        this.attr(attrName, value) :
        this.attr(attrName)

      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return 0 in arguments ?
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        }) :
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
           this[0].value)
        )
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (!this.length) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2) {
        var computedStyle, element = this[0]
        if(!element) return
        computedStyle = getComputedStyle(element, '')
        if (typeof property == 'string')
          return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
        else if (isArray(property)) {
          var props = {}
          $.each(property, function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (!name) return false
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      if (!name) return this
      return this.each(function(idx){
        if (!('className' in this)) return
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (!('className' in this)) return
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      if (!name) return this
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    },
    scrollLeft: function(value){
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0]
      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function(){ this.scrollLeft = value } :
        function(){ this.scrollTo(value, this.scrollY) })
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    var dimensionProperty =
      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

    $.fn[dimension] = function(value){
      var offset, el = this[0]
      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var i = 0, len = node.childNodes.length; i < len; i++)
      traverseNode(node.childNodes[i], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        var parentInDocument = $.contains(document.documentElement, parent)

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          parent.insertBefore(node, target)
          if (parentInDocument) traverseNode(node, function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)

;(function($){
  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add(element, events, fn, data, selector, delegator, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function(event){
      if (event == 'ready') return $(document).ready(fn)
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    ;(events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (isFunction(data) || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function(event, selector, callback){
    var $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function(event, args){
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function(){
      // handle focus(), blur() by calling them directly
      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
      // items in the collection might not be DOM elements
      else if ('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout focus blur load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return (0 in arguments) ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  $.Event = function(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }

})(Zepto)

;(function($){
  var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/,
      originAnchor = document.createElement('a')

  originAnchor.href = window.location.href

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.isDefaultPrevented()
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings, deferred) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    if (deferred) deferred.resolveWith(context, [data, status, xhr])
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings, deferred) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    if (deferred) deferred.rejectWith(context, [xhr, type, error])
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options, deferred){
    if (!('type' in options)) return $.ajax(options)

    var _callbackName = options.jsonpCallback,
      callbackName = ($.isFunction(_callbackName) ?
        _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
      script = document.createElement('script'),
      originalCallback = window[callbackName],
      responseData,
      abort = function(errorType) {
        $(script).triggerHandler('error', errorType || 'abort')
      },
      xhr = { abort: abort }, abortTimeout

    if (deferred) deferred.promise(xhr)

    $(script).on('load error', function(e, errorType){
      clearTimeout(abortTimeout)
      $(script).off().remove()

      if (e.type == 'error' || !responseData) {
        ajaxError(null, errorType || 'error', xhr, options, deferred)
      } else {
        ajaxSuccess(responseData[0], xhr, options, deferred)
      }

      window[callbackName] = originalCallback
      if (responseData && $.isFunction(originalCallback))
        originalCallback(responseData[0])

      originalCallback = responseData = undefined
    })

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return xhr
    }

    window[callbackName] = function(){
      responseData = arguments
    }

    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
    document.head.appendChild(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    // IIS returns Javascript as "application/x-javascript"
    accepts: {
      script: 'text/javascript, application/javascript, application/x-javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    if (query == '') return url
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data), options.data = undefined
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred(),
        urlAnchor
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) {
      urlAnchor = document.createElement('a')
      urlAnchor.href = settings.url
      urlAnchor.href = urlAnchor.href
      settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
    }

    if (!settings.url) settings.url = window.location.toString()
    serializeData(settings)

    var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
    if (hasPlaceholder) dataType = 'jsonp'

    if (settings.cache === false || (
         (!options || options.cache !== true) &&
         ('script' == dataType || 'jsonp' == dataType)
        ))
      settings.url = appendQuery(settings.url, '_=' + Date.now())

    if ('jsonp' == dataType) {
      if (!hasPlaceholder)
        settings.url = appendQuery(settings.url,
          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
      return $.ajaxJSONP(settings, deferred)
    }

    var mime = settings.accepts[dataType],
        headers = { },
        setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(),
        nativeSetHeader = xhr.setRequestHeader,
        abortTimeout

    if (deferred) deferred.promise(xhr)

    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
    setHeader('Accept', mime || '*/*')
    if (mime = settings.mimeType || mime) {
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

    if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
    xhr.setRequestHeader = setHeader

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
          else ajaxSuccess(result, xhr, settings, deferred)
        } else {
          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
        }
      }
    }

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      ajaxError(null, 'abort', xhr, settings, deferred)
      return xhr
    }

    if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async, settings.username, settings.password)

    for (name in headers) nativeSetHeader.apply(xhr, headers[name])

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings, deferred)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    if ($.isFunction(data)) dataType = success, success = data, data = undefined
    if (!$.isFunction(success)) dataType = success, success = undefined
    return {
      url: url
    , data: data
    , success: success
    , dataType: dataType
    }
  }

  $.get = function(/* url, data, success, dataType */){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(/* url, data, success, dataType */){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(/* url, data, success */){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope :
        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(key, value) {
      if ($.isFunction(value)) value = value()
      if (value == null) value = ""
      this.push(escape(key) + '=' + escape(value))
    }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Zepto)

;(function($){
  $.fn.serializeArray = function() {
    var name, type, result = [],
      add = function(value) {
        if (value.forEach) return value.forEach(add)
        result.push({ name: name, value: value })
      }
    if (this[0]) $.each(this[0].elements, function(_, field){
      type = field.type, name = field.name
      if (name && field.nodeName.toLowerCase() != 'fieldset' &&
        !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
        ((type != 'radio' && type != 'checkbox') || field.checked))
          add($(field).val())
    })
    return result
  }

  $.fn.serialize = function(){
    var result = []
    this.serializeArray().forEach(function(elm){
      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
    })
    return result.join('&')
  }

  $.fn.submit = function(callback) {
    if (0 in arguments) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit')
      this.eq(0).trigger(event)
      if (!event.isDefaultPrevented()) this.get(0).submit()
    }
    return this
  }

})(Zepto)

module.exports = Zepto;

;(function($){
  // __proto__ doesn't exist on IE<11, so redefine
  // the Z function to use object extension instead
  if (!('__proto__' in {})) {
    $.extend($.zepto, {
      Z: function(dom, selector){
        dom = dom || []
        $.extend(dom, $.fn)
        dom.selector = selector || ''
        dom.__Z = true
        return dom
      },
      // this is a kludge but works
      isZ: function(object){
        return $.type(object) === 'array' && '__Z' in object
      }
    })
  }

  // getComputedStyle shouldn't freak out when called
  // without a valid element as argument
  try {
    getComputedStyle(undefined)
  } catch(e) {
    var nativeGetComputedStyle = getComputedStyle;
    window.getComputedStyle = function(element){
      try {
        return nativeGetComputedStyle(element)
      } catch(e) {
        return null
      }
    }
  }
})(Zepto)

},{}],12:[function(require,module,exports){
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
    "zepto": "file:./lib/zepto",
    "simply-deferred": "^3.0.0",
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

},{}],13:[function(require,module,exports){
require('./light-app');

},{"./light-app":27}],14:[function(require,module,exports){
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

var $ = require('zepto');
var _ = require('underscore');
var Deferred = require('simply-deferred');
var URI = require('URIjs');
var ContentTypeDiscovery = require('./discover-content-type');

Deferred.installTo($);

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

},{"./discover-content-type":15,"URIjs":5,"simply-deferred":9,"underscore":10,"zepto":11}],15:[function(require,module,exports){
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

var $ = require('zepto');
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

},{"URIjs":5,"backbone":7,"underscore":10,"zepto":11}],16:[function(require,module,exports){
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

var $ = require('zepto');

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

},{"zepto":11}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

var $ = require('zepto');
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

},{"./discover-content-type":15,"URIjs":5,"underscore":10,"zepto":11}],19:[function(require,module,exports){
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

var $ = require('zepto');
var ContentDocumentFetcher = require('./content-document-fetcher');
var Deferred = require('simply-deferred');
var EncryptionHandler = require('./encryption-handler');
var MarkupParser = require('./markup-parser');
var PlainResourceFetcher = require('./plain-resource-fetcher');
var ResourceCache = require('./resource-cache');
var URI = require('URIjs');
var ZipResourceFetcher = require('./zip-resource-fetcher');

Deferred.installTo($);

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

},{"./content-document-fetcher":14,"./encryption-handler":16,"./markup-parser":17,"./plain-resource-fetcher":18,"./resource-cache":20,"./zip-resource-fetcher":21,"URIjs":5,"simply-deferred":9,"zepto":11}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

var $ = require('zepto');
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

},{"./discover-content-type":15,"URIjs":5,"underscore":10,"zepto":11}],22:[function(require,module,exports){
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

},{"underscore":10}],24:[function(require,module,exports){
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

var $ = require('zepto')
var _ = require('underscore')
var Backbone = require('backbone')
var Deferred = require('simply-deferred');
var Manifest = require('./manifest')
var MarkupParser = require('../epub-fetch/markup-parser')
var Metadata = require('./metadata')
var URI = require('URIjs')
var PackageDocument = require('./package-document')
var SmilDocumentParser = require('./smil-document-parser')

Deferred.installInto($);

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

},{"../epub-fetch/markup-parser":17,"./manifest":22,"./metadata":23,"./package-document":25,"./smil-document-parser":26,"URIjs":5,"backbone":7,"simply-deferred":9,"underscore":10,"zepto":11}],25:[function(require,module,exports){
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


var $ = require('zepto')
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

},{"URIjs":5,"backbone":7,"underscore":10,"zepto":11}],26:[function(require,module,exports){
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

var $ = require('zepto')
var _ = require('underscore')
var Deferred = require('simply-deferred');

Deferred.installTo($);

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

},{"simply-deferred":9,"underscore":10,"zepto":11}],27:[function(require,module,exports){
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
},{"../lib/epubjs/parser":1,"./light-reader":28,"URIjs":5,"_process":8}],28:[function(require,module,exports){
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

var $ = require('zepto')
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

},{"../package.json":12,"./epub-fetch/publication-fetcher":19,"./epub/package-document-parser":24,"./light-sdk":50,"zepto":11}],29:[function(require,module,exports){
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

},{"../models/style":60}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{"underscore":10}],34:[function(require,module,exports){
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

},{"../models/spine-item-constants":57,"../views/constants":66,"./get-orientation":38}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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

},{"../views/constants":66}],39:[function(require,module,exports){
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

},{"./begins-with":31,"./css-transform-string":32,"./css-transition":33,"./deduce-synthetic-spread":34,"./ends-with":35,"./escape-jquery-selector":36,"./extended-throttle":37,"./get-orientation":38,"./is-iframe-alive":40,"./is-rendition-spread-permitted-for-item":41,"./load-template":42,"./margins":43,"./rect":44,"./remove-from-string":45,"./resolve-content-ref":46,"./set-styles":47,"./trigger-layout":48,"./update-html-font-size":49}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{"../models/spine-item-constants":57,"../views/constants":66}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

},{}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
var $ = require('zepto')
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

},{"../../../lib/jquery-sizes":2,"zepto":11}],50:[function(require,module,exports){
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

},{"./events":30,"./navigator-shim":64,"./views":68,"backbone":7,"underscore":10}],51:[function(require,module,exports){
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

},{}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
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

},{"../helpers":39,"./media-overlay":54,"./spine":59,"./spine-item-constants":57}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
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

},{}],58:[function(require,module,exports){
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

},{"./spine-item-constants":57}],59:[function(require,module,exports){
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

},{"./spine-item":58,"./spine-item-constants":57}],60:[function(require,module,exports){
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

},{}],61:[function(require,module,exports){
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

var $ = require('zepto')

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

},{"zepto":11}],62:[function(require,module,exports){
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

var $ = require('zepto')
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

},{"../helpers/escape-jquery-selector":36,"./trigger":62,"zepto":11}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
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

var $ = require('zepto')
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

},{"../helpers/rect":44,"zepto":11}],66:[function(require,module,exports){
module.exports = {
  ORIENTATION_LANDSCAPE: "orientation_landscape",
  ORIENTATION_PORTRAIT: "orientation_portrait"
}

},{}],67:[function(require,module,exports){
var $ = require('zepto')
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

},{"URIjs":5,"underscore":10,"zepto":11}],68:[function(require,module,exports){
// TODO Remove when all underscore deps are gone
var _ = require('underscore')

var Views = {
  IFrameLoader: require('./iframe-loader'),
  ReaderView: require('./reader-view')
}

var ViewsConstants = require('./constants')

_.extend(Views, ViewsConstants)

module.exports = Views

},{"./constants":66,"./iframe-loader":67,"./reader-view":69,"underscore":10}],69:[function(require,module,exports){
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
var $ = require('zepto')
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

},{"../collections/style":29,"../events":30,"../helpers/extended-throttle":37,"../helpers/is-iframe-alive":40,"../helpers/resolve-content-ref":46,"../helpers/set-styles":47,"../internal-events":51,"../models/package":55,"../models/page-open-request":56,"../models/switches":61,"../models/trigger":62,"../models/viewer-settings":63,"./iframe-loader":67,"./reflowable-view":70,"backbone":7,"underscore":10,"zepto":11}],70:[function(require,module,exports){
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
var $ = require('zepto')
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

},{"../events":30,"../helpers/deduce-synthetic-spread":34,"../helpers/load-template":42,"../helpers/margins":43,"../helpers/set-styles":47,"../helpers/trigger-layout":48,"../helpers/update-html-font-size":49,"../internal-events":51,"../models/bookmark-data":52,"../models/current-pages-info":53,"../models/page-open-request":56,"../models/viewer-settings":63,"./cfi-navigation-logic":65,"backbone":7,"underscore":10,"zepto":11}]},{},[13]);
