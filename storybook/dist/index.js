'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// src/utils/twig.ts
var TwigComponent = class {
  constructor(source) {
    this.source = source;
    this.source = source;
  }
  getSource() {
    return this.source;
  }
  toString() {
    return this.source;
  }
};
function twig(source, ...values) {
  return new TwigComponent(String.raw({ raw: source }, ...values));
}

// src/index.ts
var src_default = {};

exports.TwigComponent = TwigComponent;
exports.default = src_default;
exports.twig = twig;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map