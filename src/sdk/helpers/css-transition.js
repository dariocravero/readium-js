var _ = require('underscore')

function CSSTransition($el, trans) {
    
    // does not work!
    //$el.css('transition', trans);
    
    var css={};
    // empty '' prefix FIRST!
    _.each(['', '-webkit-', '-moz-', '-ms-'], function(prefix) {
        css[prefix + 'transition'] = prefix + trans;
    });
    $el.css(css);
}

module.exports = CSSTransition
