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