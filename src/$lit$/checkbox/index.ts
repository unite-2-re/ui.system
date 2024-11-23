/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "../shared/BoxLayout.scss?inline";

// @ts-ignore
import htmlCode from "../shared/BoxLayout.html?raw";

//
import LitElementTheme from "../shared/LitElementTheme";


// @ts-ignore
@customElement('ui-checkbox')
export class UICheckBox extends LitElementTheme {
    @property() protected checked: boolean = false;
    static styles = css`${unsafeCSS(styles)}`;

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;

        //
        self.classList?.add?.("ui-checkbox");
        self.classList?.add?.("u2-input");

        //
        self.addEventListener("change", this.onSelect.bind(this));
        self.addEventListener("click", this.onClick.bind(this));
    }

    //
    protected onClick(e) {
        const self = this as unknown as HTMLElement;
        const selector = "input[type=\"checkbox\"]";
        if (!(e.target as HTMLElement)?.matches?.(selector)) {
            self.querySelector?.<HTMLElement>(selector)?.click?.();
        }
    }

    //
    protected onSelect(ev?: any) {
        const self = this as unknown as HTMLElement;
        if ((ev?.target ?? self)?.checked != null) {
            this.checked = (ev?.target ?? self)?.checked;
            self.style.setProperty("--value", `${this.checked ? 1 : 0}`);
        }

        //
        const icon = self.querySelector("ui-icon");
        if (icon) { icon.setAttribute("icon", ev?.target?.checked ? "badge-check" : "badge"); }

        //
        const thumb = self.shadowRoot?.querySelector?.(".ui-thumb");
        thumb?.setAttribute?.("data-highlight", ev?.target?.checked ? "3" : "8");
        thumb?.setAttribute?.("data-highlight-hover", ev?.target?.checked ? "0" : "5");
        //data-highlight-op="min"
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
        requestIdleCallback(()=>this.onSelect(), {timeout: 1000});
    }
}

//
export default UICheckBox;
