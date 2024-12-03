/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./index.scss?inline";
import runTooltip from "./service.js";
import LitElementTheme from "../shared/LitElementTheme";

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
        if (!self.dataset?.alpha) self.dataset.alpha = "1";
        if (!self.dataset?.scheme) self.dataset.scheme = "solid";
        if (!self.dataset?.chroma) self.dataset.scheme = "0.001";

        //
        self.style.setProperty("z-index", "9999", "important");
        self.classList?.add?.("ui-tooltip");
        self.classList?.add?.("u2-tooltip");

        //
        runTooltip();
    }
}
