import { createUnplugin } from 'unplugin';
import { SymfonyOptions } from "./types";
import * as fs from "fs/promises";
import { loadCsf, StaticStory } from '@storybook/csf-tools';
import { TwigComponent } from './utils';
import { join } from 'path';
import { logger } from '@storybook/node-logger'
import * as crypto from 'crypto';

export const STORIES_REGEX = /\.stories\.[tj]s?$/;

type TwigTemplate = string;
type StoryId = StaticStory['id'];

class TwigStoriesIndex {
  private templates: Map<string, TwigTemplate> = new Map<string, TwigTemplate>
  private storyIndex: Map<StoryId, string> = new Map<StoryId, string>
  constructor() {
  }

  register(id: string, component: TwigComponent) {
    const hash = crypto.createHash('sha1').update(component.getSource()).digest('hex');
    if (!this.templates.has(hash)) {
      this.templates.set(hash, component.getSource());
    }

    this.storyIndex.set(id, hash);
  }

  getMap() {
    return Object.fromEntries(this.storyIndex);
  }

  getTemplates() {
    return this.templates;
  }

}

const storyIndex = new TwigStoriesIndex();

async function cleanStories(dir: string)
{
  try {
    await fs.access(dir, fs.constants.F_OK);
    const files = await fs.readdir(dir);
    await Promise.all(files.map(f => fs.unlink(join(dir, f))));
  } catch(err) {
    await fs.mkdir(dir, {recursive: true});
  }
}

async function writeStoriesMap(dir: string) {

  const storiesMap = storyIndex.getMap();

  await fs.writeFile(join(dir, 'storiesMap.json'), JSON.stringify(storiesMap), {encoding: 'utf-8'});

  return Array.from(storyIndex.getTemplates(), ([hash, source]) => fs.writeFile(join(dir, `${hash}.html.twig`), source));
}


export const unplugin = createUnplugin<SymfonyOptions>((options) => {
  const outDir = join(options.runtimePath, '/stories');

  return {
    name: 'storybook-addon-symfony',
    enforce: "pre",
    loadInclude(id) {
      return STORIES_REGEX.test(id);
    },
    async load(entry: string) {
      const code = await fs.readFile(entry, {encoding: 'utf-8'});
      delete require.cache[entry]
      const module = require(entry)

      try {
        const makeTitle = (userTitle: string) => userTitle || 'default';
        const csf = loadCsf(code, { makeTitle }).parse();

        csf.stories.forEach((story) => {
          const storyExportName = story.id.split('--')[1]
            .split('-')
            .map(s => s.charAt(0).toUpperCase() + s.slice(1))
            .join('');

          const component = (module[storyExportName].component ?? module['default'].component ?? {}) as TwigComponent;

          storyIndex.register(story.id, component);
        })
      } catch (err: any) {
        logger.warn(err.message);
      }

      // Twig processing doesn't result in anything loaded from SB side
      return null;
    },
    buildStart: async () => {
      await cleanStories(outDir);
    },
    buildEnd: async (error?: Error) => {
      await writeStoriesMap(outDir);
    }
  };
});

export const { esbuild } = unplugin;
export const { webpack } = unplugin;
export const { rollup } = unplugin;
export const { vite } = unplugin;
