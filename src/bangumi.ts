import os from "node:os";
import { Cache, environment } from "@raycast/api";
import Parser from "rss-parser";
import { CacheAPIBGMEntry, CacheBGMEntry, CacheEntry } from "./types";
import axios from "axios";

const CACHE_DURATION_IN_MS = 10 * 60 * 1_000;

const cache = new Cache();
const headers = {
  'User-Agent': `cydia/Bgm.tv Extension, Raycast/${environment.raycastVersion} (${os.type()} ${os.release()})`
}
const parser = new Parser({
  headers: {
    "User-Agent": `Bgm.tv Extension, Raycast/${environment.raycastVersion} (${os.type()} ${os.release()})`,
  },
});


export async function getTodayBangumis() {
    const cachedResponse = cache.get("TodayBangumi");
    if (cachedResponse) {
      const parsed: CacheEntry = JSON.parse(cachedResponse);
  
      const elapsed = Date.now() - parsed.timestamp;
      console.log(`TodayBangumi cache age: ${elapsed / 1000} seconds`);
  
      if (elapsed <= CACHE_DURATION_IN_MS) {
        return parsed.items;
      } else {
        console.log(`Cache expired for TodayBangumi`);
      }
    }
  
    const feed = await parser.parseURL(`https://rsshub.app/bangumi/tv/calendar/today`);
    cache.set("TodayBangumi", JSON.stringify({ timestamp: Date.now(), items: feed.items }));
    return feed.items
  }

export async function getBangumiInfo(id: number) {
    const cachedResponse = cache.get(`BGMInfo_${id}`)
    if (cachedResponse) {
        const parsed: CacheBGMEntry = JSON.parse(cachedResponse);

        const elapsed = Date.now() - parsed.timestamp;
        console.log(`BGMItem_${id} cache age: ${elapsed / 1000} seconds`);
        
        if (elapsed <= CACHE_DURATION_IN_MS) {
            return parsed.item;
        }
        else {
            console.log(`Cache expired for BGMItem_${id}`);
        }
    }

    const feed = await parser.parseURL(`https://rsshub.app/bangumi/tv/subject/${id}`)
    const infoBody = {title: feed.title, items: feed.items};
    cache.set(`BGMItem_${id}`, JSON.stringify({timestamp: Date.now(), item: infoBody}))

    return infoBody
}

export async function getBangumiInfoFromAPI(id: number) {
  // const cachedResponse = cache.get(`BGMInfoAPI_${id}`)
  // if (cachedResponse) {
  //   const parsed: CacheAPIBGMEntry = JSON.parse(cachedResponse);

  //   const elapsed = Date.now() - parsed.timestamp;
  //   console.log(`BGMItemAPI_${id} cache age: ${elapsed / 1000} seconds`);

  //   if (elapsed <= CACHE_DURATION_IN_MS) {
  //       return parsed.item;
  //   }
  //   else {
  //     console.log(`Cache expired for BGMItemAPI_${id}`);
  //   }
  // }  
  console.log(`https://api.bgm.tv/v0/subjects/${id}`)
  const data = await axios.get(`https://api.bgm.tv/v0/subjects/${id}`, {headers})
  // cache.set(`BGMInfoAPI_${id}`, JSON.stringify({timestamp: Date.now(), item: await data.data}))
  console.log(data.status)
  return data.data
}