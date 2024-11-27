/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./index.html?raw";

// @ts-ignore
import styles from "./index.scss?inline";

//
import LitElementTheme from "../shared/LitElementTheme";


// @ts-ignore
@customElement('ui-menuitem')
export class UIMenuItem extends LitElementTheme {
    #parentNode?: any;
    #onSelect?: Function;

    // theme style property
    @property({attribute: true, reflect: true, type: String}) value: string = "";
    @property({attribute: true, reflect: true, type: Boolean}) checked: boolean = false;

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`;

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;

        //
        self.classList?.add?.("ui-menuitem");
        self.classList?.add?.("u2-menuitem");

        //
        //self.classList?.add?.("ui-input");
        //self.classList?.add?.("u2-input");

        //
        self.style.setProperty("display", "none", "important");
    }

    //
    public disconnectedCallback() {
        super.disconnectedCallback();

        //
        this.#parentNode?.removeEventListener("change", this.#onSelect ??= this.onSelect.bind(this));
        this.#parentNode = null;
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        this.#parentNode = self?.parentNode;
        this.#parentNode?.addEventListener("change", this.#onSelect ??= this.onSelect.bind(this));
        this.#parentNode?.addEventListener("click", this.#onSelect ??= this.onSelect.bind(this));

        //
        this.updateAttributes();
    }

    //
    protected updateAttributes() {
        const self = this as unknown as HTMLElement;

        //
        if (this.checked) { self.setAttribute("checked", ""); } else { self.removeAttribute("checked"); }
        if (!self.dataset?.chroma) self.dataset.chroma = "0.1";
        if (!self.dataset?.highlightHover) self.dataset.highlightHover = "4";

        //
        self.setAttribute("data-scheme", this.checked ? "inverse": "solid");
        self.setAttribute("data-highlight", this.checked ? "8" : "0");
        self.setAttribute("data-alpha", this.checked ? "1": "0");

        //
        const ownBox = self.shadowRoot?.querySelector?.("input:where([type=\"radio\"], [type=\"checkbox\"])") ?? self.querySelector?.("input:where([type=\"radio\"], [type=\"checkbox\"])");
        if (ownBox) {
            ownBox.setAttribute("value", this.value);
            ownBox.setAttribute("name", (self.parentNode as HTMLElement)?.dataset?.name || "dummy-radio");
        };

        //
        if (this.checked) { self.style.removeProperty("display"); } else { self.style.setProperty("display", "none", "important"); }
    }

    //
    protected onSelect(ev){
        if (ev.target.checked != null) {
            const self = this as unknown as HTMLElement;
            const ownRadio: HTMLInputElement = (self.shadowRoot?.querySelector?.("input[type=\"radio\"]") ?? self.querySelector?.("input[type=\"radio\"]")) as HTMLInputElement;
            if (ownRadio?.name == ev.target?.name) {
                // fix if was in internal DOM
                ownRadio.checked = ev.target == ownRadio;

                //
                this.checked = ownRadio.checked;
                this.updateAttributes();
            }

            //
            const ownCheckbox: HTMLInputElement = (self.shadowRoot?.querySelector?.("input[type=\"checkbox\"]") ?? self.querySelector?.("input[type=\"checkbox\"]")) as HTMLInputElement;
            if (ownCheckbox?.name == ev.target?.name && ownCheckbox == ev.target) {
                this.checked = ownRadio.checked;
                this.updateAttributes();
            }
        }
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        const self = this as unknown as HTMLElement;
        this.importFromTemplate(htmlCode);

        //
        self.insertAdjacentHTML?.("afterbegin", `<input slot="radio" data-alpha="0" part="ui-radio" placeholder="" label="" type="radio" value=${this.value} name=${(self?.parentNode as any)?.name || (self?.parentNode as HTMLElement)?.dataset?.name || "dummy-radio"}>`);
        self.addEventListener("click", (ev)=>{
            const input = root.querySelector("input[type=\"radio\"]") as HTMLInputElement;
            if (ev.target != input || !(ev.target as HTMLElement)?.matches?.("input")) { input?.click?.(); };
        });

        //
        return root;
    }
}

//
export default UIMenuItem;
