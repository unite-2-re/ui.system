/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "../shared/BoxLayout.scss?inline";

// @ts-ignore
import html from "../shared/BoxLayout.html?raw";


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

        //
        const stateChange = (ev)=>{
            //
            if (ev.target.checked != null) {
                this.checked = ev.target.checked;

                // @ts-ignore
                //this.style.setProperty("--checked", this.checked ? 1 : 0);
            }
        }

        // @ts-ignore
        this.addEventListener("change", stateChange);

        // @ts-ignore
        this.addEventListener("input", stateChange);
    }

    // theme style property
    @property() protected themeStyle?: HTMLStyleElement;
    @property() protected checked: boolean = false;

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

        // @ts-ignore
        return root;
    }

    //
    static styles = css`${styles}`

    //
    render() {
        // use theme module if available
        return html`${this.themeStyle}${html}`;
    }
}

//
export default UICheckBox;
