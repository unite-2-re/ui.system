/// <reference types="lit" />
// whole dedicated, separate element for lucide icons...
// this component (or lucide icons) may to be distributed with main package.

//
import { E } from "/externals/lib/blue";

// @ts-ignore
import { html, LitElement } from "@mods/shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";


import { setAttributesIfNull } from "@service/Utils";

// @ts-ignore
import styles from "@scss/design/de-shape.scss?inline";

//
const importStyle = `@import url("${URL.createObjectURL(new Blob([styles], {type: "text/css"}))}");`;

// @ts-ignore
@customElement('ui-shaped')
export class UIShaped extends LitElement {

    // theme style property
    @property({attribute: true, reflect: true, type: String}) icon?: string;

    // also "display" may be "contents"
    protected render() {
        return html`<style>${importStyle}</style><slot></slot><ui-icon data-chroma="0" data-alpha="0" style="padding: 25%;" part="icon" icon=${this.icon||""}></ui-icon>`;
    }

    //
    constructor(options = {icon: "", padding: ""}) {
        super(); const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            E(self, { classList: new Set(["ui-shaped", "u2-shaped"]) })
            if (options?.icon) { this.icon = options?.icon || ""; };
        });
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        setAttributesIfNull(this as unknown as HTMLElement, {
            "data-transparent": "",
            "data-alpha": 0,
            "data-chroma": 0.1,
            "data-scheme": "solid",
            "data-highlight": 0
        });
    }
}

//
export default UIShaped;
