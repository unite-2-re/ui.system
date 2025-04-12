/// <reference types="lit" />

import { setAttributesIfNull } from "@service/Utils";

// @ts-ignore
import { html, css, unsafeCSS } from "@mods/shared/LitUse";
import LitElementTheme from "@mods/shared/LitElementTheme";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "@scss/design/ov-tooltip.scss?inline";

// @ts-ignore
@customElement('ui-tooltip')
export class UITooltip extends LitElementTheme {
    @property() protected current?: string;// = "";

    //
    static styles = css`${unsafeCSS(styles)}`;
    protected render() {
        // use theme module if available
        return html`${this.themeStyle}<slot></slot>`;
    }

    //
    constructor() { super(); }
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;

        //
        setAttributesIfNull(self, {
            "data-chroma": "0.001",
            "data-scheme": "solid",
            "data-alpha": 1
        });

        //
        self.style.setProperty("z-index", "9999", "important");
        self.classList?.add?.("ui-tooltip");
        self.classList?.add?.("u2-tooltip");

        //
        //runTooltip();
    }
}
