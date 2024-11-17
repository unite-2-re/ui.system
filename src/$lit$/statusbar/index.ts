/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./index.html?raw";

// @ts-ignore
import styles from "./index.scss?inline";

// @ts-ignore
@customElement('ui-statusbar')
export class UIStatusBar extends LitElement {
    @property() protected nodes?: HTMLElement[];
    @property() protected themeStyle?: HTMLStyleElement;
    @property() protected statusSW?: boolean = false;

    //
    static styles = css`${unsafeCSS(styles)}`;

    //
    protected render() {
        // use theme module if available
        return html`${this.themeStyle}${this.nodes}`;
    }

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.style.setProperty("z-index", "999999", "important");
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();

        //
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlCode, "text/html");
        this.nodes = Array.from((dom.querySelector("template") as HTMLTemplateElement)?.content?.childNodes) as HTMLElement[];

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            if (root) { this.themeStyle = module?.default?.(root); }
        }).catch(console.warn.bind(console));

        //
        import("./status").then((module)=>{
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
