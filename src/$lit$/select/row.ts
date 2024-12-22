/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./row.html?raw";

// @ts-ignore
import styles from "./row.scss?inline";

//
import UISelectBase from "./base.js";
// @ts-ignore
@customElement('ui-select-row')
export class UISelectRow extends UISelectBase {
    static styles = css`${unsafeCSS(styles)}`;

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-select-row");
    }

    //
    protected updateStyles() {
        const self = this as unknown as HTMLElement;
        self.setAttribute("data-highlight-hover", this.checked ? "4" : "0");
        self.setAttribute("data-chroma", this.checked ? "0.1" : "0");
        self.setAttribute("data-scheme", this.checked ? "inverse": "solid");
        self.setAttribute("data-highlight", this.checked ? "2" : "0");
        self.setAttribute("data-chroma", this.checked ? "0.1" : "0");
        self.setAttribute("data-alpha", this.checked ? "1": "0");
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
        return root;
    }
}

//
export default UISelectRow;
