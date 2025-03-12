/// <reference types="lit" />

// @ts-ignore
import { html, css, unsafeCSS } from "../../shared/LitUse";
import LitElementTheme from "../../shared/LitElementTheme";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./index.scss?inline";
import { setAttributesIfNull } from "../../shared/Utils";
//import runTooltip from "./service.js";

// @ts-ignore
@customElement('ui-tooltip')
export class UITooltip extends LitElementTheme {
    @property() protected current: string = "";

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
