import { StorybookConfig as StorybookConfig$2, Options, TypescriptOptions as TypescriptOptions$1 } from '@storybook/types';
import { BuilderOptions, StorybookConfigWebpack, TypescriptOptions } from '@storybook/builder-webpack5';

declare class TwigComponent {
    private readonly source;
    constructor(source: string);
    getSource(): string;
    toString(): string;
}
declare function twig(source: TemplateStringsArray, ...values: any[]): TwigComponent;

type RulesConfig = any;
type ModuleConfig = {
    rules?: RulesConfig[];
};
type ResolveConfig = {
    extensions?: string[];
    mainFields?: (string | string[])[] | undefined;
    alias?: any;
};
interface WebpackConfiguration {
    plugins?: any[];
    module?: ModuleConfig;
    resolve?: ResolveConfig;
    optimization?: any;
    devtool?: false | string;
}
type StorybookConfig$1<TWebpackConfiguration = WebpackConfiguration> = StorybookConfig$2 & {
    /**
     * Modify or return a custom Webpack config after the Storybook's default configuration
     * has run (mostly used by addons).
     */
    webpack?: (config: TWebpackConfiguration, options: Options) => TWebpackConfiguration | Promise<TWebpackConfiguration>;
    /**
     * Modify or return a custom Webpack config after every addon has run.
     */
    webpackFinal?: (config: TWebpackConfiguration, options: Options) => TWebpackConfiguration | Promise<TWebpackConfiguration>;
};

type FrameworkName = '@storybook/symfony-webpack5';
type BuilderName = '@storybook/builder-webpack5';
type ProxyPaths = string[] | string;
type SymfonyOptions = {
    server: string;
    runtimePath?: string;
    proxyPaths?: ProxyPaths;
};
type FrameworkOptions = {
    builder?: BuilderOptions;
    symfony?: SymfonyOptions;
};
type StorybookConfigFramework = {
    framework: FrameworkName | {
        name: FrameworkName;
        options: FrameworkOptions;
    };
    core?: StorybookConfig$1['core'] & {
        builder?: BuilderName | {
            name: BuilderName;
            options: BuilderOptions;
        };
    };
    typescript?: Partial<TypescriptOptions & TypescriptOptions$1> & StorybookConfig$1['typescript'];
};
/**
 * The interface for Storybook configuration in `main.ts` files.
 */
type StorybookConfig = Omit<StorybookConfig$1, keyof StorybookConfigWebpack | keyof StorybookConfigFramework> & StorybookConfigWebpack & StorybookConfigFramework;

declare const _default: {};

export { type FrameworkOptions, type StorybookConfig, type SymfonyOptions, TwigComponent, _default as default, twig };
