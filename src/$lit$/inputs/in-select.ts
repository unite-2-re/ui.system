/// <reference types="lit" />

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import { LitElement, html } from "@mods/shared/LitUse";
import { setAttributes, setAttributesIfNull } from "@service/Utils";
import { onItemSelect } from "@service/behaviour/bh-select";

// @ts-ignore
@customElement('ui-select-base')
export class UISelectBase extends LitElement {
    $parentNode?: any;
    #onSelect?: Function;

    // theme style property
    @property({attribute: true, reflect: true, type: String}) public value?: string|number;
    @property({attribute: true, reflect: true, type: Boolean}) public checked?: boolean;
    @property({ type: Array }) protected nodes?: HTMLElement[];

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            if (this?.checked == null) this.checked = false;
            self.classList?.add?.("u2-input");
            self?.addEventListener?.("click", (ev)=>{
                // redirection...
                const element = ev?.target as HTMLElement;
                if (!element?.matches?.("input")) {
                    self?.querySelector?.("input")?.click?.();
                }
            });
            setAttributesIfNull(self, {
                "data-highlight": 0,
                "data-alpha": 0
            });
        });
    }

    //
    protected updateStyles() {};
    protected render() { return html`${this.nodes}`; }
    protected onSelect(ev?: any) { onItemSelect?.(ev, this); }
    protected importFromTemplate(htmlCode: string) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlCode, "text/html");
        this.nodes = Array.from((dom.querySelector("template") as HTMLTemplateElement)?.content?.childNodes) as HTMLElement[];
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
        if (this?.checked == null) this.checked = false;

        //
        this.$parentNode = (this as unknown as HTMLElement)?.parentNode;
        this.$parentNode?.addEventListener("change", this.#onSelect ??= this.onSelect.bind(this));
        this.$parentNode?.addEventListener("click", this.#onSelect ??= this.onSelect.bind(this));
        requestIdleCallback(()=>this.onSelect(), {timeout: 100});
    }

    //
    protected updateAttributes() {
        const self = this as unknown as HTMLElement;

        //
        if (this.checked) { self.setAttribute("checked", ""); } else { self.removeAttribute("checked"); }
        this.updateStyles?.();

        //
        const ownBox = self.shadowRoot?.querySelector?.("input:where([type=\"radio\"], [type=\"checkbox\"])") ?? self.querySelector?.("input:where([type=\"radio\"], [type=\"checkbox\"])");
        if (ownBox) { setAttributes(ownBox, { "value": this.value, "name" : (self.parentNode as HTMLElement)?.dataset?.name || self?.dataset?.name || (ownBox as any)?.name || "dummy-radio" }); };
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            if (!self.querySelector("input")) {
                self.insertAdjacentHTML?.("afterbegin", `<input slot="radio" data-alpha="0" part="ui-radio" placeholder=" " label=" " type="radio" value="${this.value}" name="${(self?.parentNode as HTMLElement)?.dataset?.name || self?.dataset?.name || "dummy-radio"}">`);
            }
            /*self.addEventListener("click", (ev)=>{
                const input = self.querySelector("input[type=\"radio\"], input[type=\"checkbox\"]") as HTMLInputElement;
                if (ev.target != input || !(ev.target as HTMLElement)?.matches?.("input")) { input?.click?.(); };
            });*/
        });
        return root;
    }
}

//
export default UISelectBase;
