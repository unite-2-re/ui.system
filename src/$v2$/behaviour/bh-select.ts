/// <reference types="lit" />

// @ts-ignore
import { customElement, property } from "lit/decorators.js";
import LitElementTheme from "../shared/LitElementTheme";

//
export const onItemSelect = (ev?: any, self?: any)=>{
    if (!self) return;
    if (ev?.target?.checked != null || ev == null) {
        const ownRadio: HTMLInputElement = (self.shadowRoot?.querySelector?.("input[type=\"radio\"]") ?? self.querySelector?.("input[type=\"radio\"]")) as HTMLInputElement;
        const ownCheckbox: HTMLInputElement = (self.shadowRoot?.querySelector?.("input[type=\"checkbox\"]") ?? self.querySelector?.("input[type=\"checkbox\"]")) as HTMLInputElement;

        //
        if (ownRadio) {
            if (ownRadio?.name == ev?.target?.name || ev == null) {
                // fix if was in internal DOM
                self.checked = (ownRadio?.checked /*= ev.target == ownRadio*/);
            }
        }

        //
        if (ownCheckbox) {
            if (ownCheckbox?.name == ev?.target?.name && ev?.target == ownCheckbox || ev == null) {
                self.checked = ownCheckbox?.checked;
            }
        }

        //
        self?.updateAttributes?.();
    }
}

// @ts-ignore
@customElement('ui-select-base')
export class UISelectBase extends LitElementTheme {
    $parentNode?: any;
    #onSelect?: Function;

    // theme style property
    @property({attribute: true, reflect: true, type: String}) public value: string|number = "";
    @property({attribute: true, reflect: true, type: Boolean}) public checked: boolean = false;

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.classList?.add?.("u2-input");
        self?.addEventListener?.("click", (ev)=>{
            // redirection...
            const element = ev?.target as HTMLElement;
            if (!element?.matches?.("input")) {
                self?.querySelector?.("input")?.click?.();
            }
        });
    }

    //
    public disconnectedCallback() {
        super.disconnectedCallback();
        this.$parentNode?.removeEventListener("change", this.#onSelect ??= this.onSelect.bind(this));
        this.$parentNode = null;
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        if (!self?.getAttribute?.("data-highlight")) { self?.setAttribute?.("data-highlight", "0"); };
        if (!self?.getAttribute?.("data-alpha")) { self.setAttribute("data-alpha", "0"); };

        //
        this.$parentNode = self?.parentNode;
        this.$parentNode?.addEventListener("change", this.#onSelect ??= this.onSelect.bind(this));
        this.$parentNode?.addEventListener("ag-click", this.#onSelect ??= this.onSelect.bind(this));
        requestIdleCallback(()=>this.onSelect(), {timeout: 1000});
    }

    //
    protected updateStyles() {};
    protected updateAttributes() {
        const self = this as unknown as HTMLElement;

        //
        if (this.checked) { self.setAttribute("checked", ""); } else { self.removeAttribute("checked"); }
        this.updateStyles?.();

        //
        const ownBox = self.shadowRoot?.querySelector?.("input:where([type=\"radio\"], [type=\"checkbox\"])") ?? self.querySelector?.("input:where([type=\"radio\"], [type=\"checkbox\"])");
        if (ownBox) {
            ownBox.setAttribute("value", "" + this.value);
            ownBox.setAttribute("name", (self.parentNode as HTMLElement)?.dataset?.name || "dummy-radio");
        };
    }

    //
    protected onSelect(ev?: any) {
        onItemSelect?.(ev, this);
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        const self = this as unknown as HTMLElement;
        self.insertAdjacentHTML?.("afterbegin", `<input slot="radio" data-alpha="0" part="ui-radio" placeholder="" label="" type="radio" value=${this.value} name=${(self?.parentNode as HTMLElement)?.dataset?.name || "dummy-radio"}>`);
        self.addEventListener("ag-click", (ev)=>{
            const input = root.querySelector("input[type=\"radio\"]") as HTMLInputElement;
            if (ev.target != input || !(ev.target as HTMLElement)?.matches?.("input")) { input?.click?.(); };
        });
        return root;
    }
}

//
export default UISelectBase;
