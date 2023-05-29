import { ActionPanel, Action, Detail, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getBangumiEps, getBangumiInfoFromAPI, getTodayBangumiAPI } from "./bangumi";
import { BGMAPIInfoItem, BGMItem, BGMToday, EpsData } from "./types";

export default function Command() {
  // const { data, isLoading } = usePromise(getTodayBangumis, [], {})
  const { data, isLoading } = usePromise(getTodayBangumiAPI, [], {});
  const dataCalender = data as BGMToday;

  return (
    <List
      isLoading={isLoading}
    >
      {dataCalender?.items.map(function (item, index) {
        return <BGMListItem key={item.id} item={item} index={index} />
      })}
    </List>
  );
}

function BGMListItem(props: { item: BGMItem, index: number }) {
  const bgmTitle = (props.item.name_cn || props.item.name || "No Title | No Title");
  // const bgmTitle = bgmTitleList[1];
  var bgmId = -1;
  if (props.item.url) {
    bgmId = props.item.id;
  }
  console.log(bgmTitle);
  
  return (
    <List.Item
      title={ bgmTitle || "No Title" }
      actions={<Actions item={props.item} bgmId={bgmId} />}
    />
  );
}

function BGMDetailItem(props: { bgmId: number }) {
  const { data, isLoading } = usePromise(getBangumiInfoFromAPI, [props.bgmId], { execute: !!props.bgmId });
  const { data: espDataRaw, isLoading: espLoading } = usePromise(getBangumiEps, [data], { execute: !!data });

  const bgmData = data as BGMAPIInfoItem;
  const epsData = espDataRaw as EpsData;

  const markdown = `
  # ${bgmData?.name_cn || bgmData?.name || "No Title"}
  > ${bgmData?.name || "No Title"}

  ![](${bgmData?.images.small})
  ## 简介
  ${bgmData?.summary || ""}
  `
  return (
    <Detail
      isLoading={isLoading || espLoading} 
    markdown={markdown} 
    metadata = {
      <Detail.Metadata>
        <Detail.Metadata.Label title="放送平台" text={bgmData?.platform || ""}/>
        <Detail.Metadata.Label title="放送时间" text={bgmData?.date || ""}/>
        <Detail.Metadata.Label title="总集数" text={`${bgmData?.total_episodes || 0}`}/>
        <Detail.Metadata.Separator/>
        {epsData?.data?.reverse().map(function (item, index) {
          if (!item.name_cn && !item.name || !(item.type !== 0 && item.type !== 1)) {
            return null
          }
          return <Detail.Metadata.Label key={index} title={item.airdate} text={item.name_cn || item.name || "Failed to get title"} />
        }
        )}
        <Detail.Metadata.Separator/>
        <Detail.Metadata.Label title="评分" text={`${bgmData?.rating.score || 0}`}/>
        <Detail.Metadata.Label title="评分人数" text={`${bgmData?.rating.total || 0}`}/>
        <Detail.Metadata.Separator/>
        <Detail.Metadata.Label title="BGM ID" text={`${bgmData?.id || 0}`}/>
      </Detail.Metadata>
    }/>
  )
}


function Actions(props: { item: BGMItem, bgmId: number }) {
  return (
    <ActionPanel title={props.item.name_cn || props.item.name}>
      <ActionPanel.Section>
        {props.bgmId && <Action.Push title="Detail" target={<BGMDetailItem bgmId={props.bgmId} />} />}
      </ActionPanel.Section>
      <ActionPanel.Section>
        {props.item.url && <Action.OpenInBrowser url={props.item.url} shortcut={{ modifiers: ['cmd'], key: 'enter' }} />}
      </ActionPanel.Section>
      <ActionPanel.Section>
        {props.item.url && (
          <Action.CopyToClipboard
            content={props.item.url}
            title="Copy Link"
            shortcut={{ modifiers: ["cmd"], key: "." }}
          />
        )}
      </ActionPanel.Section>
    </ActionPanel>
  )
}