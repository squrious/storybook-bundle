import { webpack } from './unplugin';
import { FrameworkOptions, SymfonyOptions } from './types';
import {StorybookConfig} from "@storybook/server-webpack5";
import { Options, PresetProperty, Entry } from '@storybook/types';
import { join } from 'path';

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

export const webpackFinal: StorybookConfig['webpackFinal'] = async (config , options ) => {
  const { plugins = [] } = config;

  const frameworkOptions = await options.presets.apply<{ symfony: SymfonyOptions }>('frameworkOptions')

  config.plugins = [
      ...plugins,
    webpack(frameworkOptions.symfony)
  ];

  return config;
};

export const previewMainTemplate = async (path: string, options: Options) => {
  const { symfony } = await options.presets.apply<{ symfony: SymfonyOptions }>('frameworkOptions');
  return require.resolve(join(symfony.runtimePath, 'preview/preview.ejs'));
}

export const previewAnnotations = (entry: Entry[] = [], options: Options) => {

  return [require.resolve('./preview'), ...entry]
}

