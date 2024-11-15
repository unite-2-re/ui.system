/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
@customElement('ui-listrow')
export class UIListRow extends LitElement {
    #parentNode?: any;
    #onSelect?: Function;

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;

        //
        self.classList?.add?.("ui-listrow");
        self.classList?.add?.("u2-input");
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

    // theme style property
    @property({attribute: true, reflect: true, type: String}) value: string = "";
    @property({attribute: true, reflect: true, type: Boolean}) checked: boolean = false;
    @property() protected themeStyle?: HTMLStyleElement;

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        const self = this as unknown as HTMLElement;

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            if (root) { this.themeStyle = module?.default?.(root); }
        }).catch(console.warn.bind(console));

        //
        self.addEventListener("click", (ev)=>{
            const input = root.querySelector("input[type=\"radio\"]") as HTMLInputElement;
            if (ev.target != input || !(ev.target as HTMLElement)?.matches?.("input")) { input?.click?.(); };
        });

        //
        self.insertAdjacentHTML?.("afterbegin", `<input slot="radio" data-alpha="0" part="ui-radio" placeholder="" label="" type="radio" value=${this.value} name=${(self?.parentNode as HTMLElement)?.dataset?.name || "dummy-radio"}>`);

        //
        return root;
    }

    // also "display" may be "contents"
    static styles = css`:host {

        /* */
        & {
            user-select: none;
            font-size: 0.9rem;
            box-sizing: border-box;
            inline-size: 100%;
            block-size: max-content;
            pointer-events: auto;
            cursor: pointer;
            display: grid;
            grid-column: 1 / -1;
            grid-template-rows: minmax(0px, 1fr);
            grid-template-columns: subgrid;

            /* */
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            -webkit-tap-highlight-color: transparent;
            user-drag: none;
            user-select: none;
            touch-action: none;
        }

        /* */
        & * {
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            -webkit-tap-highlight-color: transparent;
            user-drag: none;
            user-select: none;
            touch-action: none;
        }

        /* */
        & input[type="radio"], slot[name="radio"]::slotted(input[type="radio"]) {
            box-sizing: border-box;
            cursor: pointer;
            grid-row: 1 / 1 span;
            grid-column: 1 / -1;
            inline-size: 100%;
            block-size: 100%;
            appearance: none;
            opacity: 0;
        };

        /* */
        & .ui-columns {
            box-sizing: border-box;
            pointer-events: none;
            display: grid;
            grid-template-rows: minmax(0px, 1fr);
            grid-template-columns: subgrid;
            grid-row: 1 / 1 span; grid-column: 1 / -1;
            inline-size: 100%; block-size: 100%;

            /* */
            ::slotted(*) {
                grid-row: 1 / 1 span;
                user-select: none;
                padding: 0.25rem;
                display: inline flex;
                flex-wrap: wrap;
                flex-direction: row;
                align-content: safe center;
                align-items: safe center;

                /* */
                -webkit-tap-highlight-color: rgba(0,0,0,0);
                -webkit-tap-highlight-color: transparent;
                user-drag: none;
                user-select: none;
                touch-action: none;
            }
        }
    }`

    //
    render() {
        return html`${this.themeStyle}<slot name="radio"></slot><div part="ui-columns" data-alpha="0" class="ui-columns"><slot></slot></div>`;
    }
}

//
export default UIListRow;
