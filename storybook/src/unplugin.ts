import { createUnplugin } from 'unplugin';
import { SymfonyOptions } from "./types";
import * as fs from "fs/promises";
import { loadCsf, readCsf, StaticStory } from '@storybook/csf-tools';
import { TwigComponent } from './utils';
import { join } from 'path';
import { logger } from '@storybook/node-logger'
import * as crypto from 'crypto';
import VirtualModulesPlugin from 'webpack-virtual-modules';
import dedent from 'ts-dedent';

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

export const storyIndex = new TwigStoriesIndex();

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
    enforce: "post",
    transformInclude: (id)=> {
      return STORIES_REGEX.test(id);
    },
    transform: async (code, id) => {
      delete require.cache[id];
      const m = require(id);
      const imports: string[] = m['default']?.imports ?? [];
      console.log('\n TRANSFORM');
      return dedent`
        ${code}
        
        ; export const __twigTemplates = [
            ${imports.map(template => `import(
                /* webpackChunkName: "[request]" */
                /* webpackInclude: /\\/templates\\/components\\/.*\\.html\\.twig$/ */
                '${template}'
            )`)}
        ];
        ;  
      `;
    },

    buildStart: async () => {
      await cleanStories(outDir);
    },
    buildEnd: async (error?: Error) => {
      await writeStoriesMap(outDir);
    },
  };
});

export const { esbuild } = unplugin;
export const { webpack } = unplugin;
export const { rollup } = unplugin;
export const { vite } = unplugin;
