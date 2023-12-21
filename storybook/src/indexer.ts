import { readCsf } from '@storybook/csf-tools';
import { Indexer } from '@storybook/types';
import {storyIndex} from './unplugin';

export const STORIES_REGEX = /\.stories\.[tj]s?$/;

export const twigIndexer: Indexer  = {
    test: /(stories|story)\.(m?js|ts)x?$/,
    createIndex: async (fileName, options) => {
        const csf = (await readCsf(fileName, {...options})).parse();

        const module = require(fileName);

        csf.indexInputs.forEach((story) => {
            const component = (module[story.exportName]?.component ?? module['default']?.component ?? undefined);
            if (undefined !== component) {
                storyIndex.register(story.__id, component);
            }
        })

        return csf.indexInputs;
    },

}