/// <reference types="lit" />
// Type: contained
// Behaviour: switch (combined)

// @ts-ignore
import { css, unsafeCSS } from "../../shared/LitUse";
import { doIndication } from "../../behaviour/bh-indication.js";
import { makeSwitch } from "../../behaviour/bh-switch.js";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./ap-switch.scss?inline";

// @ts-ignore
import htmlCode from "./ap-switch.html?raw";

//
import LitElementTheme from "../../shared/LitElementTheme";

// @ts-ignore
@customElement('ui-switch')
export class UISwitch extends LitElementTheme {

    // theme style property
    @property({attribute: true, reflect: true, type: String}) public value?: string|number;// = "";
    @property({attribute: true, reflect: true, type: Boolean}) public checked?: boolean; //= false;

    //
    static styles = css`${unsafeCSS(styles)}`;
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            self.classList?.add?.("ui-switch");
            self.classList?.add?.("u2-input");
            self.addEventListener("change", this.onSelect.bind(this));
            makeSwitch(self);
        });
    }

    //
    protected onSelect(ev?: any){
        const self = this as unknown as HTMLElement;
        const input = (ev?.target?.matches?.("input") ? ev?.target : null) ?? self?.querySelector?.("input:checked") ?? self?.querySelector?.("input");
        doIndication(ev, self, input);
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
        requestIdleCallback(()=>this.onSelect(), {timeout: 100});
    }
}

//
export default UISwitch;
