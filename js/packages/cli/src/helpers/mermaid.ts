import * as cliProgress from 'cli-progress';
import fs from 'fs';
import fetch from 'node-fetch';
import { PromisePool } from '@supercharge/promise-pool';
import log from 'loglevel';
import { sleep } from '../helpers/various';
import { loadCache, saveCache } from '../helpers/cache';

const MERMAID_BASE_URL = 'https://mermaidlegends.games/Metadatas.php';
const MERMAID_TYPES = ['SuperRare', 'Rare', 'Legendary', 'Common', 'Advance'];

export const loadGameJson = async () => {
  try {
    let allItems = [];
    const progressBar = new cliProgress.SingleBar(
      {
        format: 'Progress: [{bar}] {percentage}% | {value}/{total}',
      },
      cliProgress.Presets.shades_classic,
    );
    progressBar.start(MERMAID_TYPES.length, 0);

    await PromisePool.withConcurrency(5)
      .for(MERMAID_TYPES)
      .handleError(async (err, type) => {
        log.error(`\nFailed to fetch type ${type}: ${err.message}`);
        await sleep(5000);
      })
      .process(async (type: string) => {
        const res = await fetch(`${MERMAID_BASE_URL}?req=${type}`);
        const json = await res.json();
        const items = Object.keys(json)
          .filter(key => key !== 'total')
          .map(key => json[key]);
        allItems = [...items, ...allItems];
      });
    progressBar.stop();
    console.log('Number of items', allItems.length);
    console.log('First item', allItems[0]);
    // make sure no duplicate item
    const ids = [];
    allItems.forEach(item => {
      if (ids.includes(item.id)) {
        console.log('duplicate item', item);
      }
      ids.push(item.id);
    });
    console.log('all good!');
    return allItems;
  } catch (error) {
    console.error(error);
  }
};

export const updateConfigFile = (configPath: string, numOfItems: number) => {
  if (configPath === undefined) {
    throw new Error('The configPath is undefined');
  }
  const configString = fs.readFileSync(configPath);
  const config = JSON.parse(configString.toString());
  config.number = numOfItems;
  fs.writeFileSync(configPath, JSON.stringify(config));
};

export const saveItemsToCache = async (
  cacheName: string,
  env: string,
  items: any,
) => {
  const cacheContent = loadCache(cacheName, env) || {};
  if (cacheContent?.items) {
    console.log('cache already has items');
  }
  cacheContent.items = items.reduce(
    (previousValue, currentValue, currentIndex) => {
      previousValue[currentIndex] = {
        link: currentValue.json,
        imageLink: currentValue.images,
        name: `Mermaid #${currentValue.id}`,
        onChain: false,
      };
      return previousValue;
    },
    {},
  );
  saveCache(cacheName, env, cacheContent);
  console.log('cache updated');
};
