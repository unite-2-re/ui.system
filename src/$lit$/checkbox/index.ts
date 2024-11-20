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
        self.addEventListener("change", this.onSelect.bind(this));
        self.addEventListener("click", (e)=>{
            if (!(e.target as HTMLElement)?.matches?.("input[type=\"checkbox\"]")) {
                self.querySelector?.<HTMLElement>("input[type=\"checkbox\"]")?.click?.();
            }
        });
    }

    //
    protected onSelect(ev) {
        const self = this as unknown as HTMLElement;
        if (ev.target.checked != null) {
            this.checked = ev.target.checked;
            self.style.setProperty("--value", `${this.checked ? 1 : 0}`);
        }
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
        return root;
    }
}

//
export default UICheckBox;
