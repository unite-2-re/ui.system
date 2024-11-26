// whole dedicated, separate element for lucide icons...
// this component (or lucide icons) may to be distributed with main package.
/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, PropertyValues } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./index.scss?inline";

// @ts-ignore
import htmlCode from "./index.html?raw";

//
import LitElementTheme from "../shared/LitElementTheme";

// @ts-ignore
@customElement('ui-block')
export class UIBlock extends LitElementTheme {

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`;

    //
    protected render() {
        return html`${this.themeStyle}${this.nodes}`;
    }

    //
    constructor() {
        super(); //const self = this as unknown as HTMLElement;
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        if (!self.hasAttribute("data-transparent")) { self.setAttribute("data-transparent", ""); };
        if (!self.hasAttribute("data-alpha")) { self.setAttribute("data-alpha", "0"); };
        if (!self.hasAttribute("data-chroma")) { self.setAttribute("data-chroma", "0.1"); };
        if (!self.hasAttribute("data-scheme")) { self.setAttribute("data-scheme", "solid"); };
        if (!self.hasAttribute("data-highlight")) { self.setAttribute("data-highlight", "0"); };
        self.setAttribute("data-alpha", "0");

        //
        if (!self.classList?.contains?.("ui-block")) self.classList?.add?.("ui-block");
        if (!self.classList?.contains?.("u2-block")) self.classList?.add?.("u2-block");
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
        return root;
    }
}

//
export default UIBlock;
