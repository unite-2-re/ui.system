/// <reference types="lit" />

// @ts-ignore
import { LitElement, html } from "./LitUse";

// @ts-ignore
import { property } from "lit/decorators.js";

// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";
export {importCdn};

//
export class LitElementTheme extends LitElement {

    // theme style property
    @property() protected themeStyle?: HTMLStyleElement;
    @property() protected nodes?: HTMLElement[];

    //
    protected render() {
        return html`${this.themeStyle}${this.nodes}`;
    }

    //
    protected importFromTemplate(htmlCode: string) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlCode, "text/html");
        this.nodes = Array.from((dom.querySelector("template") as HTMLTemplateElement)?.content?.childNodes) as HTMLElement[];
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();

        // @ts-ignore
        Promise.try(importCdn, ["/externals/core/theme.js"])?.then?.((module)=>{
            if (root) { this.themeStyle = module?.default?.(root); }
        }).catch(console.warn.bind(console));

        //
        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();
    }

    //
    public disconnectedCallback() {
        super.disconnectedCallback();
    }
}

//
export default LitElementTheme;
