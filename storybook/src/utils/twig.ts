export class TwigComponent {
    constructor(private readonly source: string) {
        this.source = source;
    }

    getSource() {
        return this.source;
    }

    toString(): string {
        return this.source;
    }
}

export function twig(source: TemplateStringsArray, ...values: any[]): TwigComponent
{
    return new TwigComponent(String.raw({ raw: source }, ...values));
}
