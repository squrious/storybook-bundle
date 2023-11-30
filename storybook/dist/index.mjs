// src/utils/twig.ts
var TwigComponent = class {
  constructor(source) {
    this.source = source;
    this.source = source;
  }
  getSource() {
    return this.source;
  }
};
function twig(source) {
  return new TwigComponent(source.raw[0]);
}

// src/index.ts
var src_default = {};

export { TwigComponent, src_default as default, twig };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.mjs.map