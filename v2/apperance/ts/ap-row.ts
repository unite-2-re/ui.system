// Type: standalone

/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./row.html?raw";

// @ts-ignore
import styles from "./row.scss?inline";

//
import UISelectBase from "../../behaviour/bh-select";

// @ts-ignore
@customElement('ui-select-row')
export class UISelectRow extends UISelectBase {
    #parentNode?: any;

    //
    static styles = css`${unsafeCSS(styles)}`;
    constructor() { super(); };

    //
    protected updateStyles() {
        const self = this as unknown as HTMLElement;

        // in selection mode
        if (!this.#parentNode?.matches?.("ui-dropmenu")) {
            self.setAttribute("data-highlight", this.checked ? "2" : "0");
            self.setAttribute("data-highlight-hover", this.checked ? "4" : "0");
            self.setAttribute("data-chroma", this.checked ? "0.1" : "0");
            self.setAttribute("data-scheme", this.checked ? "inverse": "solid");
            self.setAttribute("data-alpha", this.checked ? "1": "0");
        };
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
        if (this.#parentNode?.matches?.("ui-dropmenu")) {
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
        if (this.#parentNode?.matches?.("ui-dropmenu")) {
            const self = this as unknown as HTMLElement;
            self.style.setProperty("display", "none", "important");
        };

        //
        this.updateAttributes();
    }

    //
    protected onSelect(ev){
        super.onSelect?.(ev);
    }
}

//
export default UISelectRow;
