/// <reference types="lit" />
// Type: standalone

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./index.scss?inline";

//
import LitElementTheme from "../shared/LitElementTheme";

// @ts-ignore
@customElement('ui-button-base')
export class UIButtonBase extends LitElementTheme {
    $parentNode?: any;

    //
    static styles = css`${unsafeCSS(styles)}`;
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.addEventListener("contextmenu", (ev)=>{
            ev?.stopPropagation?.();
            ev?.preventDefault?.();
        });
    }

    //
    protected importFromTemplate(htmlCode) {
        return super.importFromTemplate?.(htmlCode);
    }

    //
    public connectedCallback() {
        super.connectedCallback();
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        return root;
    }
}

//
export default UIButtonBase;
