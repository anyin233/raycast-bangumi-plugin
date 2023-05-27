import { useEffect, useState } from "react";
import { ActionPanel, Action, Detail, List } from "@raycast/api";
import Parser from "rss-parser"
import { usePromise } from "@raycast/utils";
import { getBangumiInfo, getBangumiInfoFromAPI, getTodayBangumis } from "./bangumi";
import { BGMAPIInfoItem } from "./types";

export default function Command() {
  const { data, isLoading } = usePromise(getTodayBangumis, [], {})

  return (
    <List
      isLoading={isLoading}
    >
      {data?.map(function (item, index) {
        return <BGMListItem key={item.guid} item={item} index={index} />
      })}
    </List>
  );
}

function BGMListItem(props: { item: Parser.Item, index: number }) {
  const bgmTitleList = (props.item.title || "No Title | No Title").split("｜");
  const bgmTitle = bgmTitleList[1];
  var bgmId = -1;
  if (props.item.link) {
    const bgmUrl = new URL(props.item.link);
    bgmId = +bgmUrl.pathname.split("/")[2];
  }
  console.log(bgmTitle);
  
  return (
    <List.Item
      title={ bgmTitle || "No Title" }
      subtitle={ props.item.pubDate || "No Date" }
      actions={<Actions item={props.item} bgmId={bgmId} />}
    />
  );
}

function BGMDetailItem(props: { bgmId: number }) {
  const { data, isLoading } = usePromise(getBangumiInfoFromAPI, [props.bgmId], { execute: !!props.bgmId })
  const bgmData = data as BGMAPIInfoItem;
  const markdown = `
  # ${bgmData?.name_cn || bgmData?.name || "No Title"}
  > Origin name: ${bgmData?.name || "No Title"}

  ![](${bgmData?.images.small})
  ## 简介
  ${bgmData?.summary || ""}
  `
  return (
    <Detail
      isLoading={isLoading} 
    markdown={markdown} 
    metadata = {
      <Detail.Metadata>
        <Detail.Metadata.Label title="放送平台" text={bgmData?.platform || ""}/>
        <Detail.Metadata.Label title="放送时间" text={bgmData?.date || ""}/>
        <Detail.Metadata.Label title="总集数" text={`${bgmData?.total_episodes || 0}`}/>
      </Detail.Metadata>
    }/>
  )
}


function Actions(props: { item: Parser.Item, bgmId: number }) {
  return (
    <ActionPanel title={props.item.title}>
      <ActionPanel.Section>
        {props.bgmId && <Action.Push title="Detail" target={<BGMDetailItem bgmId={props.bgmId} />} />}
      </ActionPanel.Section>
      <ActionPanel.Section>
        {props.item.link && <Action.OpenInBrowser url={props.item.link} shortcut={{ modifiers: ['cmd'], key: 'enter' }} />}
      </ActionPanel.Section>
      <ActionPanel.Section>
        {props.item.link && (
          <Action.CopyToClipboard
            content={props.item.link}
            title="Copy Link"
            shortcut={{ modifiers: ["cmd"], key: "." }}
          />
        )}
      </ActionPanel.Section>
    </ActionPanel>
  )
}