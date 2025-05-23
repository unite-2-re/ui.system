/// <reference types="lit" />
// Type: standalone
// Behaviour: select, button
import UISelectBase from "@blit/inputs/in-select";
import UIButtonBase from "@blit/inputs/in-button";

// @ts-ignore /* @vite-ignore */
import { loadInlineStyle } from "/externals/modules/dom.js";

// @ts-ignore /* @vite-ignore */
import { defineElement, E, H } from "/externals/modules/blue.js";

// @ts-ignore /* @vite-ignore */
import { conditional } from "/externals/modules/object.js";

// @ts-ignore
import styles from "@scss/design/ap-row.scss?inline";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
const loading = fetch(preInit, {priority: "high", keepalive: true, cache: "force-cache", mode: "same-origin"});
const markup  = H`<${"div.ui-columns"} part="ui-columns" data-alpha="0"><slot></slot></div><slot name="radio"></slot>`;
const element = loadInlineStyle(preInit, null, "ux-layer");

//
const initialize = (self)=>{
    const bt = self.$parentNode?.matches?.("ui-button, ui-toggle"); // @ts-ignore
    const ch = self.getProperty("checked");
    E(self, {
        style: { "display": bt ? conditional(ch, null, "none") : null },
        dataset: bt ? {
            highlight: 0,
            highlightHover: 0,
            alpha: 0,
            chroma: 0,
            scheme: "dynamic-transparent"
        } : {
            highlight: conditional(ch, 2, 0),
            highlightHover: conditional(ch, 4, 1),
            alpha: conditional(ch, 1, 0),
            chroma: conditional(ch, 0.1, 0),
            scheme: conditional(ch, "inverse", "solid")
        }
    })
}

// @ts-ignore
@defineElement('ui-button-row')
export class UIButtonRow extends UIButtonBase {
    protected styles = () => element.cloneNode(true);
    protected render = () => markup.cloneNode(true);
}

// @ts-ignore
@defineElement('ui-select-row')
export class UISelectRow extends UISelectBase {
    protected styles = () => element.cloneNode(true);
    protected render = () => markup.cloneNode(true);
    protected onInitialize() { super.onInitialize?.(); initialize(this); };
}

//
export default UISelectRow;
