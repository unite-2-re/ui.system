//<div data-hidden="true" data-delay-hide="400" class="ui-tooltip" data-scheme="solid" v-bind="$attrs"></div>

/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./index.scss?inline";
import runTooltip from "./service.js";


// @ts-ignore
@customElement('ui-tooltip')
export class UITooltip extends LitElement {
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.style.setProperty("z-index", "9999", "important");

        //
        self.classList?.add?.("ui-tooltip");
        self.classList?.add?.("u2-tooltip");

        //
        runTooltip();

        //
        if (!self.dataset?.alpha) self.dataset.alpha = "1";
        if (!self.dataset?.scheme) self.dataset.scheme = "solid";
        if (!self.dataset?.chroma) self.dataset.scheme = "0.001";
    }

    // theme style property
    @property() protected themeStyle?: HTMLStyleElement;
    @property() protected current: string = "";

    //
    static styles = css`${unsafeCSS(styles)}`

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            if (root) { this.themeStyle = module?.default?.(root); }
        }).catch(console.warn.bind(console));
        return root;
    }

    //
    render() {
        // use theme module if available
        return html`${this.themeStyle}<slot></slot>`;
    }

}
