/// <reference types="lit" />
// Type: contained
// Behaviour: switch (combined)

// @ts-ignore
import { css, unsafeCSS } from "@mods/shared/LitUse";
import LitElementTheme from "@mods/shared/LitElementTheme";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

//
import { doIndication } from "@service/behaviour/bh-indication";
import { makeSwitchBH } from "@service/behaviour/bh-switch";

// @ts-ignore
import styles from "@scss/design/ap-slider.scss?inline";

//
import { E } from "/externals/lib/blue";

//
const makeSlider = (root: HTMLElement, weak?: WeakRef<any>)=>{

    // TODO: make available with ".nodes" keys as element
    if (weak?.deref?.()) weak.deref().nodes = [
        E("label.ui-contain", {part: "ui-contain"},[
            E("div.ui-fill", {part: "ui-fill", dataset: {scheme: "inverse", alpha: 1, highlight: 2, chroma: 0.6}}, [
                E("div.ui-fill-inactive", {inert: true, dataset: {alpha: 0.5, scheme: "solid"}}),
                E("div.ui-fill-active", {inert: true, dataset: {alpha: 0}})
            ]),
            E("div.ui-thumb", {part: "ui-thumb", dataset: {scheme: "solid", alpha: 1, highlight: 6, highlightHover: 0, highlightOp: "min", chroma: 0.4}}, [E("slot", {name: "icon"})]),
            E("div.ui-inputs", {part: "ui-inputs"}),
        ])
    ].map((e)=>e?.element);
}


// @ts-ignore
@customElement('ui-slider')
export class UISlider extends LitElementTheme {

    // theme style property
    @property({attribute: true, reflect: true, type: String}) public value?: string|number;// = "";
    @property({attribute: true, reflect: true, type: Boolean}) public checked?: boolean; //= false;

    //
    static styles = css`${unsafeCSS(styles)}`;
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            E(self, {
                classList: new Set(["ui-slider", "u2-input"]),
                on: { "change": new Set([this.onSelect.bind(this)]) }
            })
            makeSwitchBH(self);
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
        makeSlider(root, new WeakRef(this));
        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        this.onSelect();
    }
}

//
export default UISlider;
