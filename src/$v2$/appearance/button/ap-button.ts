/// <reference types="lit" />
// Type: standalone
// Behaviour: select, button

// @ts-ignore
import { css, unsafeCSS } from "../../shared/LitUse";
import { openDropMenu } from "../../functional/fn-dropmenu.js";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./ap-button.scss?inline";

// @ts-ignore
import htmlCode from "./ap-button.html?raw";

//
import UIButtonBase from "../../behaviour/bh-button";
import UISelectBase from "../../behaviour/bh-select";
import { setAttributesIfNull } from "../../shared/Utils";

// selection derivative

// @ts-ignore
@customElement('ui-toggle')
export class UIToggle extends UISelectBase {
    @property({attribute: true, reflect: true, type: String}) value = "";
    @property({attribute: true, reflect: true, type: String}) icon = "";
    @property({}) dropMenu?: any = null;

    //
    static styles = css`${unsafeCSS(styles)}`;
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-toggle");
        self.classList?.add?.("u2-toggle");
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        const self = this as unknown as HTMLElement;

        //
        setAttributesIfNull(self, {
            "data-scheme": "solid",
            "data-highlight": 0,
            "data-highlight-hover": 1
        });
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
        return root;
    }
}


// button derivative

// @ts-ignore
@customElement('ui-button')
export class UIButton extends UIButtonBase {
    @property({attribute: true, reflect: true, type: String}) value = "";
    @property({attribute: true, reflect: true, type: String}) icon = "";
    @property({}) dropMenu?: any = null;

    //
    static styles = css`${unsafeCSS(styles)}`;
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-button");
        self.classList?.add?.("u2-button");
        self.addEventListener("click", (ev)=>{
            if (self.querySelector("ui-select-row, ui-button-row")) {
                openDropMenu(self, ev);
            }
        });
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        const self = this as unknown as HTMLElement;

        //
        setAttributesIfNull(self, {
            "data-scheme": "solid",
            "data-highlight": 0,
            "data-highlight-hover": 1
        });
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
        return root;
    }
}

//
export default UIButton;
