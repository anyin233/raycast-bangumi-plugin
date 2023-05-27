import Parser from "rss-parser"


export type CacheEntry = {
    timestamp: number;
    items: Parser.Item[];
  };

export type CacheBGMEntry = {
    timestamp: number;
    item: BGMInfo
}

type BGMInfo = {
    title: string;
    items: Parser.Item[];
}