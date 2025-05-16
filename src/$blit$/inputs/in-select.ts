/// <reference types="lit" />
import { setAttributes } from "@ext/shared/Utils";
import { onItemSelect } from "@service/behaviour/bh-select";

// @ts-ignore /* @vite-ignore */
import { BLitElement, property, defineElement } from "/externals/modules/blue.js";

// @ts-ignore /* @vite-ignore */
import { link } from "/externals/modules/object.js";

// @ts-ignore
@defineElement('ui-select-base')
export class UISelectBase extends BLitElement() {
    $parentNode?: any;
    #onSelect?: Function;

    // theme style property
    @property({source: "value", from: "input"}) public value?: string|number;
    @property({source: "checked", from: "input"}) public checked?: boolean;
    @property({source: "attr", from: "input"}) public name?: string;
    @property({source: "attr", name: "data-name"}) public $name?: string;
    @property({source: "attr", name: "data-value"}) public $value?: string|number;

    //
    protected initialAttributes = {
        "data-highlight": 0,
        "data-alpha": 0
    };

    //
    protected updateStyles() {};
    protected onSelect(ev?: any) { onItemSelect?.(ev, this); }
    protected onInitialize() {
        super.onInitialize?.();
        link(this.getProperty("$name"), this.getProperty("name"));
        link(this.getProperty("$value"), this.getProperty("value"));

        //
        const self = this as unknown as HTMLElement;
        self.classList?.add?.("u2-input");
        self?.addEventListener?.("click", (ev)=>{
            // redirection...
            const element = ev?.target as HTMLElement;
            if (!element?.matches?.("input")) {
                self?.querySelector?.("input")?.click?.();
            }
        });
        if (!self.querySelector("input")) {
            let save = this.value, name = this.name;
            self.insertAdjacentHTML?.("afterbegin", `<input slot="radio" data-alpha="0" part="ui-radio" placeholder=" " label=" " type="radio">`);
            save ||= this.getAttribute("value") || this.getAttribute("data-value");
            name ||= this.getAttribute("name") || this.getAttribute("data-name") || this.parentNode?.getAttribute?.("data-name");
            const input = self.querySelector("input");
            if (input && name) { input.name  = name; };
            if (input && save) { input.value = save+""; };
        }
    }

    //
    public disconnectedCallback() {
        super.disconnectedCallback?.();
        this.$parentNode?.removeEventListener("change", this.#onSelect ??= this.onSelect.bind(this));
        this.$parentNode = null;
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        this.$parentNode = (this as unknown as HTMLElement)?.parentNode;
        this.$parentNode?.addEventListener("change", this.#onSelect ??= this.onSelect.bind(this));
        this.$parentNode?.addEventListener("click", this.#onSelect ??= this.onSelect.bind(this));
        requestIdleCallback(()=>this.onSelect(), {timeout: 100});
    }

    //
    protected updateAttributes() {
        const self = this as unknown as HTMLElement; this.updateStyles?.();
        const ownBox = self.shadowRoot?.querySelector?.("input:where([type=\"radio\"], [type=\"checkbox\"])") ?? self.querySelector?.("input:where([type=\"radio\"], [type=\"checkbox\"])");
        if (ownBox) { setAttributes(ownBox, { "value": this.value, "name" : (self.parentNode as HTMLElement)?.dataset?.name || self?.dataset?.name || (ownBox as any)?.name || "dummy-radio" }); };
    }
}

//
export default UISelectBase;
