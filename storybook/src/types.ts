import type {
  StorybookConfig as StorybookConfigBase,
  TypescriptOptions as TypescriptOptionsReact,
} from '@storybook/preset-server-webpack';

import type {
  StorybookConfigWebpack,
  BuilderOptions,
  TypescriptOptions as TypescriptOptionsBuilder,
} from '@storybook/builder-webpack5';

type FrameworkName = '@storybook/symfony-webpack5';
type BuilderName = '@storybook/builder-webpack5';

type AdditionalWatchPath = string[] | string
type ProxyPaths = string[] | string


export type SymfonyOptions = {
  server: string
  runtimePath?: string
  proxyPaths?: ProxyPaths

  // TODO: Add more watch paths to handle HMR for SF assets
  /*additionalWatchPath?: AdditionalWatchPath*/
}

export type FrameworkOptions = {
  builder?: BuilderOptions;
  symfony?: SymfonyOptions;
};

type StorybookConfigFramework = {
  framework:
    | FrameworkName
    | {
    name: FrameworkName;
    options: FrameworkOptions;
  };
  core?: StorybookConfigBase['core'] & {
    builder?:
      | BuilderName
      | {
      name: BuilderName;
      options: BuilderOptions;
    };
  };
  typescript?: Partial<TypescriptOptionsBuilder & TypescriptOptionsReact> &
    StorybookConfigBase['typescript'];
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = Omit<
  StorybookConfigBase,
  keyof StorybookConfigWebpack | keyof StorybookConfigFramework
> &
  StorybookConfigWebpack &
  StorybookConfigFramework;
