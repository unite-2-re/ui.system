/// <reference types="lit" />
// Type: contained
// Behaviour: spinner

// @ts-ignore
import ThemedElement from "@blit/shared/ThemedElement";
import { doIndication } from "@service/behaviour/bh-indication";

// @ts-ignore
import styles from "@scss/design/ap-number.scss?inline";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
const loading = fetch(preInit, {priority: "high", keepalive: true, cache: "force-cache", mode: "same-origin"});

// @ts-ignore /* @vite-ignore */
import { defineElement, E, H, property } from "/externals/modules/blue.js";

// @ts-ignore
@defineElement('ui-number')
export class UINumber extends ThemedElement {
    @property({source: "valueAsNumber", from: "input" }) value;

    //
    public styles = ()=>preInit;
    public render = (weak)=>{
        const down = (ev)=>{
            const self = weak?.deref?.() as (HTMLElement | undefined);
            const input = self?.querySelector?.("input") as (HTMLInputElement | undefined);
            input?.stepDown?.();
            input?.dispatchEvent?.(new Event('change', {bubbles: true, cancelable: true}));
        };
        const up = (ev)=>{
            const self = weak?.deref?.() as (HTMLElement | undefined);
            const input = self?.querySelector?.("input") as (HTMLInputElement | undefined);
            input?.stepUp?.();
            input?.dispatchEvent?.(new Event('change', {bubbles: true, cancelable: true}));
        };
        const ds = {alpha: 1, highlight: 2, chroma: 0.1, scheme: "inverse", highlightHover: 4};
        return H`
<${"button.ui-step-up"}   type="button" dataset=${ds} on:click=${up}><ui-icon icon="chevron-right"></ui-icon></button>
<${"button.ui-step-down"} type="button" dataset=${ds} on:click=${down}><ui-icon icon="chevron-left"></ui-icon></button>
<${"label.ui-content"} data-alpha="0"><slot></slot></label>`;
    }

    //
    protected initialAttributes = { "data-alpha": 0, "data-highlight": 0 };
    protected onInitialize() { super.onInitialize?.(); E(this, { classList: new Set(["ui-number", "u2-input"]), on: { "change": new Set([this.onSelect.bind(this)]), "input": new Set([this.onSelect.bind(this)])} }); this.onSelect(); return this; };
    protected onSelect(ev?: any){
        const self = this as unknown as HTMLElement;
        const input = (ev?.target?.matches?.("input") ? ev?.target : null) ?? self?.querySelector?.("input:checked") ?? self?.querySelector?.("input");
        doIndication(ev, self, input);
    }
}

//
export default UINumber;
