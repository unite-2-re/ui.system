/// <reference types="lit" />
// Type: standalone
// Behaviour: select, button

// @ts-ignore
import { css, html, unsafeCSS } from "../../shared/LitUse";

// @ts-ignore
import { customElement } from "lit/decorators.js";

// @ts-ignore
import styles from "./ap-row.scss?inline";

// @ts-ignore
import htmlCode from "./ap-row.html?raw";

//
import UISelectBase from "../../behaviour/bh-select";
import UIButtonBase from "../../behaviour/bh-button";

//
const importStyle = `@import url("${URL.createObjectURL(new Blob([styles], {type: "text/css"}))}");`;

// @ts-ignore
@customElement('ui-select-row')
export class UISelectRow extends UISelectBase {
    constructor() { super(); };

    //
    protected updateStyles() {
        const self = this as unknown as HTMLElement;

        // in selection mode
        if (this.$parentNode?.matches?.("ui-button, ui-toggle")) {
            self.setAttribute("data-highlight-hover", "0");
            self.setAttribute("data-highlight", "0");
            self.setAttribute("data-alpha", "0");
            self.setAttribute("data-scheme", this.$parentNode.dataset.scheme || "dynamic-transparent");
            self.setAttribute("data-chroma", "0");
        } else {
            self.setAttribute("data-highlight", this.checked ? "2" : "0");
            self.setAttribute("data-highlight-hover", this.checked ? "4" : "1");
            self.setAttribute("data-chroma", this.checked ? "0.1" : "0");
            self.setAttribute("data-scheme", this.checked ? "inverse": "solid");
            self.setAttribute("data-alpha", this.checked ? "1": "0");
        }
    }

    //
    protected render() {
        return html`<style>${importStyle}</style>${this.nodes}`;
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
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
        this.importFromTemplate(htmlCode);
        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();
    }
}

//
export default UISelectRow;
