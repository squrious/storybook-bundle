export class TwigComponent {
    constructor(private readonly source: string) {
        this.source = source;
    }

    getSource() {
        return this.source;
    }
}

export function twig(source: TemplateStringsArray): TwigComponent
{
    return new TwigComponent(source.raw[0])
}
