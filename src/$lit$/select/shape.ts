/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./shape.html?raw";

// @ts-ignore
import styles from "./shape.scss?inline";

//
import UISelectBase from "./base.js";
// @ts-ignore
@customElement('ui-select-shape')
export class UISelectShape extends UISelectBase {
    static styles = css`${unsafeCSS(styles)}`;

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-select-shape");
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
        return root;
    }

    //
    protected updateStyles() {
        const self = this as unknown as HTMLElement;
        self.setAttribute("data-highlight-hover", "0");
        self.setAttribute("data-highlight", "0");
        self.setAttribute("data-alpha", "0");
        self.setAttribute("data-transparent", "");
    }
}

//
export default UISelectShape;
