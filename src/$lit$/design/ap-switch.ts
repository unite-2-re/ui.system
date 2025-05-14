/// <reference types="lit" />
// Type: contained
// Behaviour: switch (combined)

// @ts-ignore
import ThemedElement from "@mods/shared/LitElementTheme";
import { doIndication } from "@service/behaviour/bh-indication";
import { makeSwitchBH } from "@service/behaviour/bh-switch";

// @ts-ignore
import styles from "@scss/design/ap-switch.scss?inline";

// @ts-ignore /* @vite-ignore */
import { E, H, property, defineElement } from "/externals/lib/blue.js";

// @ts-ignore
@defineElement('ui-switch')
export class UISwitch extends ThemedElement {
    @property({source: "valueAsNumber", from: "input" }) value;
    @property({source: "checked", from: "input"}) checked;

    //
    public styles = ()=>styles;
    public render = ()=>H`<${"label.ui-contain"} part="ui-contain">
    <${"div.ui-fill"} dataset=${{scheme: "inverse", alpha: 1, highlight: 2, chroma: 0.1, highlightHover: 4}}>
        <${"div.ui-fill-inactive"} inert="" data-alpha="0"></div>
        <${"div.ui-fill-active"} inert="" data-alpha="0"></div>
    </div>
    <${"div.ui-thumb"} part="ui-thumb" dataset=${{scheme: "solid", alpha: 1, highlight: 3, highlightHover: 0, highlightOp: "min", chroma: 0.1}}><slot name="icon"></slot></div>
    <${"div.ui-inputs"} inert="" data-alpha="0"><slot></slot></div>
</label>`;

    //
    protected onInitialize() {
        super.onInitialize?.(); const self = this as unknown as HTMLElement;
        E(self, { classList: new Set(["ui-switch", "u2-input"]), on: { "change": new Set([this.onSelect.bind(this)]) }})
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
export default UISwitch;
