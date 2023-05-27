import Parser from "rss-parser"


export type CacheEntry = {
    timestamp: number;
    items: Parser.Item[];
  };

export type CacheBGMEntry = {
    timestamp: number;
    item: BGMInfo
}

export type CacheAPIBGMEntry = {
  timestamp: number;
  item: BGMAPIInfoItem;
}

// type BGMInfoItem = {
//     date: string;
//     platform: string;
//     images: ImageInfo;
//     summary: string;
//     name: string;
//     name_cn: string;
//     tags: TagItem[];
    
// }

// type ImageInfo = {
//     small: string;
//     grid: string;
//     large: string;
//     medium: string;
//     common: string;
// }

// type TagItem = {
//     name: string;
//     count: number;
// }

// type InfoItem = {
//     key: string;
//     value: {
//         v: string
//     }[];
// }


export interface BGMAPIInfoItem {
    date: string;
    platform: string;
    images: {
      small: string;
      grid: string;
      large: string;
      medium: string;
      common: string;
    };
    summary: string;
    name: string;
    name_cn: string;
    tags: string[];
    id: number;
    eps: number;
    total_episodes: number;
    rating: {
      total: number;
      count: number;
      score: number;
    };
    rank: number;
    collection: {
      doing: number;
      wish: number;
      collect: number;
      dropped: number;
    };
    type: number;
    url: string;
    air_date: string;
    comment: number;
    topic: number;
    lasttouch: number;
    staff: {
      staff: {
        id: number;
        name: string;
        name_cn: string;
        role_name: string;
        images: {
          large: string;
        };
      }[];
    };
    character: {
      character: {
        id: number;
        name: string;
        name_cn: string;
        role_name: string;
        images: {
          large: string;
        };
      }[];
    };
    blog: {
      id: number;
      title: string;
      summary: string;
      image: string;
      url: string;
      dateline: string;
      replies: number;
    }[];
    user: {
      id: number;
      nickname: string;
      username: string;
      sign: string;
      usergroup: number;
      avatar: {
        large: string;
      };
    };
  }

type BGMInfo = {
    title: string;
    items: Parser.Item[];
}
