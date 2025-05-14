/// <reference types="lit" />
// Type: standalone
// Behaviour: select, button
import UISelectBase from "@mods/inputs/in-select";
import UIButtonBase from "@mods/inputs/in-button";

// @ts-ignore /* @vite-ignore */
import { defineElement, E, H } from "/externals/lib/blue.js";

// @ts-ignore /* @vite-ignore */
import { conditional } from "/externals/lib/object.js";

// @ts-ignore
import styles from "@scss/design/ap-row.scss?inline";


// @ts-ignore
@defineElement('ui-select-row')
export class UISelectRow extends UISelectBase {
    protected styles = () => styles;
    protected render = () => H`<${"div.ui-columns"} part="ui-columns" data-alpha="0"><slot></slot></div><slot name="radio"></slot>`;
    protected onInitialize() {
        super.onInitialize?.();
        const self = this as unknown as HTMLElement;
        const bt = this.$parentNode?.matches?.("ui-button, ui-toggle");
        const ch = this.getProperty("checked");
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
}

// @ts-ignore
@defineElement('ui-button-row')
export class UIButtonRow extends UIButtonBase {
    protected styles = () => styles;
    protected render = () => H`<${"div.ui-columns"} part="ui-columns" data-alpha="0"><slot></slot></div><slot name="radio"></slot>`;
}

//
export default UISelectRow;
