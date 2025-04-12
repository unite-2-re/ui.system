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

//
import { E } from "/externals/lib/blue";

//
import { doIndication } from "@service/behaviour/bh-indication";
import { setAttributesIfNull } from "@service/Utils";

//
export const makeSpin = (root?: any, weak?: WeakRef<any>)=>{

    // TODO: make available with ".nodes" keys as element
    if (weak?.deref?.()) weak.deref().nodes = [
        E("button.ui-step-down", {
            type: "button",
            dataset: {alpha: 1, highlight: 2, chroma: 0.1, scheme: "inverse", highlightHover: 4},
            on: {click: new Set([(ev)=>{
                const self = weak?.deref?.() as (HTMLElement | undefined);
                const input = self?.querySelector?.("input") as (HTMLInputElement | undefined);
                input?.stepDown?.();
                input?.dispatchEvent?.(new Event('change', {bubbles: true, cancelable: true}));
            }])}
        }, [E("ui-icon", {icon: "chevron-left"})]),
        E("button.ui-step-up", {
            type: "button",
            dataset: {alpha: 1, highlight: 2, chroma: 0.1, scheme: "inverse", highlightHover: 4}, 
            on: {click: new Set([(ev)=>{
                const self = weak?.deref?.() as (HTMLElement | undefined);
                const input = self?.querySelector?.("input") as (HTMLInputElement | undefined);
                input?.stepUp?.();
                input?.dispatchEvent?.(new Event('change', {bubbles: true, cancelable: true}));
            }])}
        }, [E("ui-icon", {icon: "chevron-right"})]),
        E("label.ui-content", {dataset: {alpha: 0}}, [E("slot")])
    ].map((e)=>e?.element);
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
        makeSpin(root, new WeakRef(this));
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
