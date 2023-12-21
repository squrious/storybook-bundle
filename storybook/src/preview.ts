import type { Renderer } from "@storybook/types";
import { PartialStoryFn as StoryFunction, StoryContext } from '@storybook/types';
import { global }  from '@storybook/global'
import { FrameworkOptions } from './types';

function getFrameworkOptions() {
    // @ts-ignore
    return global.FRAMEWORK_OPTIONS as FrameworkOptions;
}


/**
 * Decorator to set server URL
 */
export const decorators = [
    (StoryFn: StoryFunction<Renderer>, context: StoryContext<Renderer>) => {

      const serverUrl = `${getFrameworkOptions().symfony.server}/_storybook/render`;

      const { server = {} } = context.parameters;

      if (server.url === undefined) {
          server.url = serverUrl;
          context.parameters.server = server;
      }

      return StoryFn();
    }
];
