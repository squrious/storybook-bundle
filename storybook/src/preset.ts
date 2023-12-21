import { webpack as sfPlugin } from './unplugin';
import { FrameworkOptions, SymfonyOptions } from './types';
import {StorybookConfig} from "@storybook/server-webpack5";
import { Options, PresetProperty, Entry, Indexer } from '@storybook/types';
import { join } from 'path';
import { access } from 'fs-extra';
import dedent from 'ts-dedent';
import { twigIndexer } from './indexer';

export const core: PresetProperty<'core'> = async (config, options) => {
  const framework = await options.presets.apply('framework');

  return {
    ...config,
    builder: {
      name: require.resolve('./builder/webpack5-builder'),
      options: typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: '@storybook/server',
  };
}

export const frameworkOptions = async (frameworkOptions: FrameworkOptions, options: Options)=> {
  const { configDir } = options;

  const symfonyOptions: SymfonyOptions = {
    ...frameworkOptions.symfony,
    runtimePath: join(configDir, frameworkOptions.symfony.runtimePath ?? '../var/storybook'),
  }

  return {
    ...frameworkOptions,
    symfony: symfonyOptions
  };
}

// TODO: add support for Vite builder
// export const viteFinal = async (config: any, options: any) => {
//     const { plugins = [] } = config;
//     plugins.push(vite(options));
//     config.plugins = plugins;
//     return config;
// };
//

export const webpack: StorybookConfig['webpack'] = async (config, options) => {
    const frameworkOptions = await options.presets.apply<{ symfony: SymfonyOptions }>('frameworkOptions')

    return {
        ...config,
        plugins: [
          ...(config.plugins || []),
            sfPlugin(frameworkOptions.symfony),
        ],
        module: {
            ...config.module,
            rules: [
                ...(config.module.rules || []),
                {
                    test: /\.html\.twig$/,
                    loader: require.resolve('html-loader'),
                },
            ]
        },
        resolve: {
            ...config.resolve,
            extensions: [...(config.resolve?.extensions || []), '.twig'],
            alias: config.resolve?.alias,
            mainFields: ['twig', ...(config.resolve?.mainFields || ['browser', 'module', 'main'])]
        }
    };
}

export const experimental_indexers: PresetProperty<'experimental_indexers'> = (existingIndexers: Indexer[]) =>
    [twigIndexer].concat(existingIndexers || []);

export const previewMainTemplate = async (path: string, options: Options) => {
  const { symfony } = await options.presets.apply<{ symfony: SymfonyOptions }>('frameworkOptions');

  const previewPath = join(symfony.runtimePath, 'preview/preview.ejs');
  try {
    await access(previewPath);
    return require.resolve(previewPath);

  } catch (err) {
    throw new Error(dedent`
      Unable to find preview template "${previewPath}". Did you forget to run "bin/console storybook:init"?
    `);
  }

}

export const previewAnnotations = (entry: Entry[] = [], options: Options) => {

  return [require.resolve('./preview'), ...entry]
}

