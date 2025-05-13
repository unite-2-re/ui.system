/// <reference types="lit" />
// Type: standalone
// Behaviour: select, button

// @ts-ignore
import { html } from "../shared/LitUse";

// @ts-ignore
import { customElement } from "lit/decorators.js";

//
import UISelectBase from "@mods/inputs/in-select";
import UIButtonBase from "@mods/inputs/in-button";
import { setAttributes } from "@service/Utils";

// @ts-ignore /* @vite-ignore */
import { E } from "/externals/lib/blue.js";

// @ts-ignore
import styles from "@scss/design/ap-row.scss?inline";

// @ts-ignore /* @vite-ignore */
import { checkedRef, conditional } from "/externals/lib/object.js";

//
const importStyle = `@import url("${URL.createObjectURL(new Blob([styles], {type: "text/css"}))}");`;

//
const makeRow = (root: HTMLElement, weak?: WeakRef<any>)=>{

    // TODO: make available with ".nodes" keys as element
    if (weak?.deref?.()) weak.deref().nodes = [
        E("div.ui-columns", { part: "ui-columns", dataset: {alpha: 0}}, [E("slot")]),
        E("slot", {name: "radio"})
    ].map((e)=>e?.element);
}

// @ts-ignore
@customElement('ui-select-row')
export class UISelectRow extends UISelectBase {
    constructor() { super(); };

    //
    #checked: any = null;
    protected render() { return html`<style>${importStyle}</style>${this.nodes}`; }
    protected createRenderRoot() {
        const self = this as unknown as HTMLElement;
        const root = super.createRenderRoot();
        makeRow(root, new WeakRef(this));
        requestAnimationFrame(()=>{
            const bt = this.$parentNode?.matches?.("ui-button, ui-toggle");
            const ch = checkedRef(self);
            this.#checked = ch;
            E(self, {
                style: { "display": bt ? conditional(ch, null, "none") : null },
                dataset: bt ? {
                    highlight: 0,
                    highlightHover: 0,
                    alpha: 0,
                    chroma: 0,
                    scheme: "dynamic-transparent"
                } : {
                    highlight: conditional(ch, 2, 0),
                    highlightHover: conditional(ch, 4, 1),
                    alpha: conditional(ch, 1, 0),
                    chroma: conditional(ch, 0.1, 0),
                    scheme: conditional(ch, "inverse", "solid")
                }
            })
        });
        return root;
    }

    //
    protected updateAttributes() {
        super.updateAttributes?.();
        if (this.#checked) { this.#checked.value = this.checked; };
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        this.updateAttributes();
    }
}


// button derivative (for example, in context-menu)

// @ts-ignore
@customElement('ui-button-row')
export class UIButtonRow extends UIButtonBase {
    constructor() { super(); };

    //
    protected render() {
        return html`<style>${importStyle}</style>${this.nodes}`;
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        makeRow(root, new WeakRef(this));
        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();
    }
}

//
export default UISelectRow;
