// whole dedicated, separate element for lucide icons...
// this component (or lucide icons) may to be distributed with main package.
/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, PropertyValues } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
@customElement('ui-shaped')
export class UIShaped extends LitElement {

    //
    constructor(options = {icon: "", padding: ""}) {
        super();

        // @ts-ignore
        this.classList?.add?.("ui-shaped");

        // @ts-ignore
        this.classList?.add?.("u2-shaped");

        //
        if (options?.icon) { this.icon = options?.icon; };
    }

    //
    protected disconnectedCallback() {
        super.disconnectedCallback();
    }

    //
    protected connectedCallback() {
        super.connectedCallback();

        // @ts-ignore
        if (!this.hasAttribute("data-scheme")) { this.setAttribute("data-scheme", "accent-inverse"); };

        // @ts-ignore
        if (!this.hasAttribute("data-highlight")) { this.setAttribute("data-highlight", "5"); };

        // @ts-ignore
        this.setAttribute("data-alpha", "0");

        // @ts-ignore
        if (!this.hasAttribute("data-chroma")) { this.setAttribute("data-chroma", "0.1"); };
    }

    // theme style property
    @property({attribute: true, reflect: true, type: String}) icon: string = "";

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            // @ts-ignore
            if (root) {
                // @ts-ignore
                this.themeStyle = module?.default?.(root);
            }
        }).catch(console.warn.bind(console));

        //
        return root;
    }

    // also "display" may be "contents"
    static styles = css`:host { --icon-size: 4rem; padding: 0.25rem; place-items: center; place-content: center; filter: drop-shadow(0 0 1rem #10101040); pointer-events: none; box-sizing: border-box; aspect-ratio: 1 / 1; max-inline-size: var(--icon-size, 4rem); max-block-size: var(--icon-size, 4rem); inline-size: 100%; block-size: 100%; overflow: visible; display: inline grid; grid-template-columns: minmax(0px, 1fr); grid-template-rows: minmax(0px, 1fr); ::slotted(*), & > * { --icon-size: 100%; aspect-ratio: 1 / 1; box-sizing: border-box; inline-size: 100%; block-size: 100%; grid-column: 1 / -1; grid-row: 1 / -1; }; ::slotted(*) { overflow: hidden; pointer-events: auto; scale: var(--corrector, 1); }; & > * { z-index: 99; }; };`

    //
    render() {
        // @ts-ignore
        return html`${this.themeStyle}<slot></slot><ui-icon data-chroma="0" data-alpha="0" data-scheme="dynamic" style="padding: 25%;" icon=${this.icon}></ui-icon>`;
    }
}

//
export default UIShaped;
