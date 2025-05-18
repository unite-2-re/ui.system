/// <reference types="lit" />
// Type: contained
// Behaviour: switch (combined)

// @ts-ignore
import ThemedElement from "@blit/shared/ThemedElement";

//
import { doIndication } from "@service/behaviour/bh-indication";
import { makeSwitchBH } from "@service/behaviour/bh-switch";

// @ts-ignore
import styles from "@scss/design/ap-slider.scss?inline";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
const loading = fetch(preInit, {priority: "high", keepalive: true, cache: "force-cache", mode: "same-origin"});

// @ts-ignore /* @vite-ignore */
import { defineElement, E, H, property } from "/externals/modules/blue.js";

// @ts-ignore
@defineElement('ui-slider')
export class UISlider extends ThemedElement {
    @property({source: "valueAsNumber", from: "input" }) value;
    @property({source: "checked", from: "input"}) checked;

    //
    public styles = ()=>preInit;
    public render = ()=> H`<${"label.ui-contain"} part="ui-contain">
    <${"div.ui-fill"} part="ui-fill" dataset=${{scheme: "inverse", alpha: 1, highlight: 2, chroma: 0.6}}>
        <${"div.ui-fill-inactive"} inert="" dataset=${{alpha: 0.5, scheme: "solid"}}></div>
        <${"div.ui-fill-active"} inert="" dataset=${{alpha: 0, scheme: "inverse"}}></div>
    </div>
    <${"div.ui-thumb"} part="ui-thumb" dataset=${{scheme: "solid", alpha: 1, highlight: 6, highlightHover: 0, highlightOp: "min", chroma: 0.4}}><slot name="icon"></slot></div>
    <${"div.ui-inputs"} part="ui-inputs" style="background-color: transparent;"><slot></slot></div>
</label>`

    //
    protected onInitialize() {
        super.onInitialize?.();
        const self = this as unknown as HTMLElement;
        E(self, { classList: new Set(["ui-slider", "u2-input"]), on: { "change": new Set([this.onSelect.bind(this)]) }})
        makeSwitchBH(self);
        this.onSelect();
        return this;
    }

    //
    protected onSelect(ev?: any){
        const self = this as unknown as HTMLElement;
        const input = (ev?.target?.matches?.("input") ? ev?.target : null) ?? self?.querySelector?.("input:checked") ?? self?.querySelector?.("input");
        doIndication(ev, self, input);
    }
}

//
export default UISlider;
