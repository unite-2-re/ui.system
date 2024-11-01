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

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            // @ts-ignore
            if (this.shadowRoot) {
                // @ts-ignore
                this.themeStyle = module?.default?.(this.shadowRoot);
            }
        }).catch(console.warn.bind(console));

        // @ts-ignore
        //this.style.setProperty("--checked", this.checked ? 1 : 0);
    }

    // theme style property
    @property() protected themeStyle?: HTMLStyleElement;
    @property() protected checked: boolean = false;

    //
    /*protected createRenderRoot() {
        // @ts-ignore
        return (this.shadowRoot ?? this.attachShadow({ mode: "open" }));
    }*/

    static styles = css`:host {
        inline-size: 1rem;
        block-size: 1rem;
        display: flex;
        padding: 0px;
        box-sizing: border-box;
        pointer-events: none;
        place-items: center;
        place-content: center;
        border-radius: 0px;

        & > label {
            container-type: size;
            container-name: ui-contain;

            border-radius: 0px;
            cursor: pointer;
            pointer-events: auto;
            display: flex;
            max-inline-size: 100%;
            max-block-size: 100%;
            inline-size: 100%;
            block-size: 100%;
            position: relative;
            padding: 0px;
            box-sizing: border-box;
            place-items: center;
            place-content: center;

            & > * {
                padding: 0px;
                inset: 0px;
                position: absolute;
                max-inline-size: 100%;
                max-block-size: 100%;
                pointer-events: none;
                background: transparent;
                box-sizing: border-box;
                border-radius: 0px;
            }
        }

        ::slotted(input) {
            cursor: pointer;
            pointer-events: auto;
            box-sizing: border-box;
            padding: 0px;
            margin: 0px;
            max-inline-size: 100%;
            max-block-size: 100%;
            inline-size: 100%;
            block-size: 100%;
            border-radius: 0px;

            appearance: none;
            -webkit-appearance: none;
            opacity: 0;
        }
    }`

    //
    render() {
        // use theme module if available
        return html`${this.themeStyle}<label part="ui-contain" class="ui-contain"><div part="ui-fill" class="ui-fill"></div><div part="ui-thumb" class="ui-thumb"></div><slot></slot></label>`;
    }
}

//
export default UICheckBox;
