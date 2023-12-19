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

export { TwigComponent, src_default as default, twig };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.mjs.map