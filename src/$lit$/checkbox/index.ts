/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
@customElement('ui-checkbox')
export class UICheckBox extends LitElement {
    //
    constructor() {
        super();

        // @ts-ignore
        this.classList?.add?.("ui-checkbox");

        // @ts-ignore
        this.classList?.add?.("u2-input");

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            // @ts-ignore
            if (this.shadowRoot) {
                // @ts-ignore
                this.themeStyle = module?.default?.(this.shadowRoot);
            }
        }).catch(console.warn.bind(console));
    }

    // mostly, unused...
    static styles = css`:host {}`;

    // theme style property
    @property() protected themeStyle?: HTMLStyleElement;

    //
    protected createRenderRoot() {
        // @ts-ignore
        return (this.shadowRoot ?? this.attachShadow({ mode: "open" }));
    }

    //
    render() {
        // use theme module if available
        return html`${this.themeStyle}<label class="ui-contain"><div class="ui-fill"></div><div class="ui-thumb"></div><slot></slot></label>`;
    }
}

//
export default UICheckBox;
