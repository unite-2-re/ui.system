/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./index.html?raw";

// @ts-ignore
import styles from "./index.scss?inline";

//
import LitElementTheme from "../shared/LitElementTheme";


// @ts-ignore
@customElement('ui-statusbar')
export class UIStatusBar extends LitElementTheme {
    @property() protected statusSW?: boolean = false;

    //
    static styles = css`${unsafeCSS(styles)}`;

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.style.setProperty("z-index", "999999", "important");
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);

        //
        import("../shared/Status").then((module)=>{
            if (root) {
                module?.default?.(root);
                this.statusSW = true;
            }
        }).catch(console.warn.bind(console));


        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        if (!self.hasAttribute("data-alpha")) { self.setAttribute("data-alpha", "1"); };
        if (!self.hasAttribute("data-chroma")) { self.setAttribute("data-chroma", "0"); };
        if (!self.hasAttribute("data-scheme")) { self.setAttribute("data-scheme", "dynamic"); };
    }
};

//
export default UIStatusBar;
