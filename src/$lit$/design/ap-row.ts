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

//
import { E } from "/externals/lib/blue";

// @ts-ignore
import styles from "@scss/design/ap-row.scss?inline";

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
    protected updateStyles() {
        const self = this as unknown as HTMLElement;

        // in selection mode
        if (this.$parentNode?.matches?.("ui-button, ui-toggle")) {
            setAttributes(self, {
                "data-highlight": 0,
                "data-highlight-hover": 0,
                "data-alpha": 0,
                "data-chroma": 0,
                "data-scheme": "dynamic-transparent"
            });
        } else {
            setAttributes(self, {
                "data-highlight": this.checked ? "2" : "0",
                "data-highlight-hover": this.checked ? "4" : "1",
                "data-alpha" : this.checked ? "1"   : "0",
                "data-chroma": this.checked ? "0.1" : "0",
                "data-scheme": this.checked ? "inverse": "solid"
            });
        }
    }

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
    protected updateAttributes() {
        super.updateAttributes?.();

        // mono element mode (for drop-menu indicator)
        if (this.$parentNode?.matches?.("ui-button, ui-toggle")) {
            const self = this as unknown as HTMLElement;
            if (this.checked) {
                self.style.removeProperty("display");
            } else {
                self.style.setProperty("display", "none", "important");
            }
        }
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        // mono element mode (for drop-menu indicator)
        if (this.$parentNode?.matches?.("ui-button, ui-toggle")) {
            const self = this as unknown as HTMLElement;
            if (this.checked) {
                self.style.removeProperty("display");
            } else {
                self.style.setProperty("display", "none", "important");
            }
        };

        //
        this.updateAttributes();
    }

    //
    protected onSelect(ev){
        super.onSelect?.(ev);
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
