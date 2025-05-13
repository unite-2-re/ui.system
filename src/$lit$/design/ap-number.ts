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

// @ts-ignore /* @vite-ignore */
import { E } from "/externals/lib/blue.js";

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
    static styles = css`${unsafeCSS(`@layer ux-layer {${styles}};`)}`;

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            E(self, {
                classList: new Set(["ui-number", "u2-input"]),
                on: {
                    "change": new Set([this.onSelect.bind(this)]),
                    "input": new Set([this.onSelect.bind(this)])
                }
            })
            this.onSelect();
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
        this.onSelect();
        setAttributesIfNull(this as unknown as HTMLElement, {
            "data-alpha": 0,
            "data-highlight": 0
        });
    }
}

//
export default UINumber;
