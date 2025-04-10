/// <reference types="lit" />
// Type: contained
// Behaviour: spinner

// @ts-ignore
import { css, unsafeCSS } from "@mods/shared/LitUse";
import LitElementTheme from "@mods/shared/LitElementTheme";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "@scss/design/ap-number.scss?inline";

// @ts-ignore
import htmlCode from "@temp/ap-number.html?raw";

//
import { doIndication } from "@service/behaviour/bh-indication";
import { setAttributesIfNull } from "@service/Utils";

//
export const makeSpin = (weak?: WeakRef<any>, root?: any)=>{
    //
    requestIdleCallback(()=>{
        //
        root?.querySelector?.(".ui-step-up")?.addEventListener?.("click", (ev)=>{
            const self  = weak?.deref?.() as (HTMLElement | undefined);
            const input = self?.querySelector?.("input") as (HTMLInputElement | undefined);
            input?.stepUp?.();
            input?.dispatchEvent?.(new Event('change', {bubbles: true, cancelable: true}));
        });

        //
        root?.querySelector?.(".ui-step-down")?.addEventListener?.("click", (ev)=>{
            const self = weak?.deref?.() as (HTMLElement | undefined);
            const input = self?.querySelector?.("input") as (HTMLInputElement | undefined);
            input?.stepDown?.();
            input?.dispatchEvent?.(new Event('change', {bubbles: true, cancelable: true}));
        });
    });
}

// @ts-ignore
@customElement('ui-number')
export class UINumber extends LitElementTheme {

    // theme style property
    @property({attribute: true, reflect: true, type: String}) public value?: string|number;// = 0;
    @property({attribute: true, reflect: true, type: Boolean}) public checked?: boolean;// = false;

    //
    static styles = css`${unsafeCSS(styles)}`;

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            self.classList?.add?.("ui-number");
            self.classList?.add?.("u2-input");
            self.addEventListener("input", this.onSelect.bind(this));
            self.addEventListener("change", this.onSelect.bind(this));
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
        requestAnimationFrame(()=>{
            makeSpin(new WeakRef(this), root);
        });
        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        requestIdleCallback(()=>this.onSelect(), {timeout: 100});

        //
        const self = this as unknown as HTMLElement;
        setAttributesIfNull(self, {
            "data-alpha": 0,
            "data-highlight": 0
        });
    }
}

//
export default UINumber;
