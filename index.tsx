/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChatBarButton } from "@api/ChatButtons";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType, StartAt } from "@utils/types";
import { Icons, useMemo, useState } from "@webpack/common";
import { MouseEventHandler } from "react";

let collapsechatbuttonsopen: boolean | undefined;

const settings = definePluginSettings({
    Open: {
        type: OptionType.BOOLEAN,
        description: "opened by default",
        default: false,
        onChange: (store: { open: boolean; }) => {
            console.log("changing open", store.open);
            collapsechatbuttonsopen = store.open;
        }
    },
});

function CollapseToggleButton(props: { open: boolean | undefined, onClick: MouseEventHandler<HTMLButtonElement>; }) {
    return (<ChatBarButton
        onClick={props.onClick}
        tooltip={props.open ? "Close" : "Open"}
    >
        <svg
            id="vc-chat-button-collapse-buttons-toggle"
            className={props.open ? "vc-collapse-chat-buttons-toggle-open" : "vc-collapse-chat-buttons-toggle-closed"}
            fill="currentColor"
            fillRule="evenodd"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ scale: "1.096", translate: "0 -1px" }}
        >
            {props.open ?
                <Icons.EyeSlashIcon /> :
                <Icons.EyeIcon />
            }
        </svg>
    </ChatBarButton>);
}

function buttonsWrapper(buttons: React.ReactNode[], props: any) {
    if (props.disabled) return;
    const [open, setOpen] = useState(collapsechatbuttonsopen);

    useMemo(() => {
        collapsechatbuttonsopen = open;
    }, [open]);

    const buttonList = (
        <div id="chat-bar-buttons-menu" style={{
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "auto"
        }}>
            {open ? buttons : null}
            <CollapseToggleButton onClick={() => setOpen(!open)} open={open}></CollapseToggleButton>
        </div>
    );
    buttons = [buttonList];
    return buttons;
}

export default definePlugin({
    name: "CollapseChatButtons",
    description: "able to collapse the chat buttons",
    settings: settings,
    authors: [Devs.iamme],
    patches: [
        {
            find: '"sticker")',
            replacement: {
                match: /(.buttons,children:)(\i)\}/,
                replace: "$1$self.buttonsWrapper($2, arguments[0])}"
            }
        }
    ],
    startAt: StartAt.Init,
    buttonsWrapper: buttonsWrapper,
    start: async () => { collapsechatbuttonsopen = settings.store.Open; }
});
