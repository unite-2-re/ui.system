/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
//import styles from "../shared/BoxLayout.scss?inline";

// @ts-ignore
//import htmlT from "../shared/BoxLayout.html?raw";

// @ts-ignore
@customElement('ui-listrow')
export class UIListRow extends LitElement {
    #parentNode?: any;
    #onSelect?: Function;

    //
    constructor() {
        super();

        // @ts-ignore
        this.classList?.add?.("ui-listrow");

        // @ts-ignore
        this.classList?.add?.("u2-input");

        // @ts-ignore
        //this.addEventListener("change", this.onSelect.bind(this));

        // @ts-ignore
        //this.addEventListener("change", this.onSelect.bind(this));

        // @ts-ignore
        //this.style.setProperty("--checked", this.checked ? 1 : 0);
    }

    //
    protected disconnectedCallback() {
        super.disconnectedCallback();

        //
        this.#parentNode?.removeEventListener("change", this.#onSelect ??= this.onSelect.bind(this));
        this.#parentNode = null;
    }

    //
    protected connectedCallback() {
        super.connectedCallback();

        // @ts-ignore
        this.#parentNode = this?.parentNode;
        this.#parentNode?.addEventListener("change", this.#onSelect ??= this.onSelect.bind(this));

        //
        this.updateAttributes();
    }

    //
    protected updateAttributes() {
        // @ts-ignore
        if (this.checked) { this.setAttribute("checked", ""); } else { this.removeAttribute("checked"); }

        // @ts-ignore
        if (!this.dataset?.chroma) this.dataset.chroma = "0.1";

        // @ts-ignore
        if (!this.dataset?.highlightHover) this.dataset.highlightHover = "4";

        // @ts-ignore
        this.setAttribute("data-scheme", this.checked ? "inverse": "solid");

        // @ts-ignore
        this.setAttribute("data-highlight", this.checked ? "8" : "0");

        // @ts-ignore
        this.setAttribute("data-alpha", this.checked ? "1": "0");

        // @ts-ignore
        const ownBox = this.shadowRoot?.querySelector?.("input:where([type=\"radio\"], [type=\"checkbox\"])") ?? this.querySelector?.("input:where([type=\"radio\"], [type=\"checkbox\"])");
        if (ownBox) {
            ownBox.setAttribute("value", this.value);

            // @ts-ignore
            ownBox.setAttribute("name", this.parentNode?.dataset?.name || "dummy-radio");
        };
    }

    //
    protected onSelect(ev){
        if (ev.target.checked != null) {
            // @ts-ignore
            const ownRadio = this.shadowRoot?.querySelector?.("input[type=\"radio\"]") ?? this.querySelector?.("input[type=\"radio\"]");
            if (ownRadio?.name == ev.target?.name) {
                // fix if was in internal DOM
                ownRadio.checked = ev.target == ownRadio;

                //
                this.checked = ownRadio.checked;
                this.updateAttributes();
            }

            // @ts-ignore
            const ownCheckbox = this.shadowRoot?.querySelector?.("input[type=\"checkbox\"]") ?? this.querySelector?.("input[type=\"checkbox\"]");
            if (ownCheckbox?.name == ev.target?.name && ownCheckbox == ev.target) {
                this.checked = ownRadio.checked;
                this.updateAttributes();
            }
        }
    }

    // theme style property
    @property({attribute: true, reflect: true, type: String}) value: string = "";
    @property({attribute: true, reflect: true, type: Boolean}) checked: boolean = false;
    @property() protected themeStyle?: HTMLStyleElement;

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();

        // @ts-ignore
        //root.addEventListener("change", this.onSelect.bind(this));

        // @ts-ignore
        //root.addEventListener("input", this.onSelect.bind(this));

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            // @ts-ignore
            if (root) {
                // @ts-ignore
                this.themeStyle = module?.default?.(root);
            }
        }).catch(console.warn.bind(console));

        // @ts-ignore
        this.addEventListener("click", (ev)=>{
            const input = root.querySelector("input[type=\"radio\"]");
            if (ev.target != input || !ev.target?.matches?.("input")) { input?.click?.(); };
        });

        // @ts-ignore
        this.insertAdjacentHTML?.("afterbegin", `<input slot="radio" data-alpha="0" part="ui-radio" placeholder="" label="" type="radio" value=${this.value} name=${this?.parentNode?.dataset?.name || "dummy-radio"}>`);

        //
        return root;
    }

    // also "display" may be "contents"
    static styles = css`:host { user-select: none; font-size: 0.9rem; box-sizing: border-box; inline-size: 100%; block-size: max-content; pointer-events: auto; cursor: pointer; display: grid; grid-column: 1 / -1; grid-template-rows: minmax(0px, 1fr); grid-template-columns: subgrid; & input[type="radio"], slot[name="radio"]::slotted(input[type="radio"]) { box-sizing: border-box; cursor: pointer; grid-row: 1 / 1 span; grid-column: 1 / -1; inline-size: 100%; block-size: 100%; min-block-size: appearance: none; opacity: 0; }; & .ui-columns { box-sizing: border-box; pointer-events: none; display: grid; grid-template-rows: minmax(0px, 1fr); grid-template-columns: subgrid; grid-row: 1 / 1 span; grid-column: 1 / -1; inline-size: 100%; block-size: 100%; ::slotted(*) { grid-row: 1 / 1 span; user-select: none; padding: 0.25rem; display: inline flex; flex-wrap: wrap; flex-direction: row; align-content: center; align-items: center; } } }`

    //
    render() {
        // @ts-ignore
        return html`${this.themeStyle}<slot name="radio"></slot><div part="ui-columns" data-alpha="0" class="ui-columns"><slot></slot></div>`;
    }
}

//
export default UIListRow;
