import { useEffect, useState } from "react";
import { ActionPanel, Action, Detail, List } from "@raycast/api";
import Parser from "rss-parser"
import { usePromise } from "@raycast/utils";
import { getBangumiInfo, getTodayBangumis } from "./bangumi";

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
  const bgmId = -1;
  if (props.item.link) {
    const bgmUrl = new URL(props.item.link);
    const bgmId = bgmUrl.pathname.split("/")[2];
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
  const { data, isLoading } = usePromise(getBangumiInfo, [props.bgmId], { execute: !!props.bgmId })
  return (
    <Detail markdown="**Hello** _World_!" />
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