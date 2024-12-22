/// <reference types="lit" />
// Type: standalone

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./index.html?raw";

// @ts-ignore
import styles from "./index.scss?inline";

//
import UIButtonBase from "../../behaviour/bh-button";

// @ts-ignore
@customElement('ui-button')
export class UIButton extends UIButtonBase {
    @property({attribute: true, reflect: true, type: String}) value = "";
    @property({attribute: true, reflect: true, type: String}) icon = "";
    @property({}) dropMenu?: any = null;

    //
    static styles = css`${unsafeCSS(styles)}`;
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-button");
        self.classList?.add?.("u2-button");
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        const self = this as unknown as HTMLElement;

        //
        if (!self.dataset.scheme) { self.dataset.scheme = "solid"; };
        if (!self.dataset.highlight) { self.dataset.highlight = "0"; };
        if (!self.dataset.highlightHover) { self.dataset.highlightHover = "1"; };
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
        return root;
    }
}

//
export default UIButton;
