// @ts-ignore
import LitElementTheme from "@blit/shared/ThemedElement";

// @ts-ignore
import styles from "@scss/design/ov-tooltip.scss?inline";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
const loading = fetch(preInit, {priority: "high", keepalive: true, cache: "force-cache", mode: "same-origin"});

// @ts-ignore /* @vite-ignore */
import { defineElement, property } from "/externals/modules/blue.js";

// @ts-ignore
@defineElement('ui-tooltip')
export class UITooltip extends LitElementTheme {
    @property() protected current?: string;

    //
    public styles = () => preInit;
    public initialAttributes = {
        "data-chroma": "0.001",
        "data-scheme": "solid",
        "data-alpha": 1
    };

    //
    protected onInitialize() {
        super.onInitialize?.();
        const self = this as unknown as HTMLElement;
        self.style.setProperty("z-index", "9999", "important");
        self.classList?.add?.("ui-tooltip");
        self.classList?.add?.("u2-tooltip");
        return this;
    }
}
