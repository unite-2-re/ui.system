/// <reference types="lit" />
// Type: standalone

// @ts-ignore /* @vite-ignore */
import { BLitElement, defineElement } from "/externals/modules/blue.js";

// @ts-ignore
@defineElement('ui-button-base')
export class UIButtonBase extends BLitElement() {
    $parentNode?: any;
    public onInitialize() {
        super.onInitialize?.(); const self = this as unknown as HTMLElement;
        if (!self.querySelector("input") && self.querySelector("ui-button-row[data-value], ui-select-row[data-value]")) {
            self.insertAdjacentHTML?.("afterbegin", `<input style="display:none;" slot="radio" hidden data-alpha="0" part="ui-radio" placeholder=" " label=" " type="text" value="" name="${(self?.parentNode as HTMLElement)?.dataset?.name || self?.dataset?.name || "dummy-radio"}">`);
        }
        self.addEventListener("contextmenu", (ev)=>{
            ev?.stopPropagation?.();
            ev?.preventDefault?.();
        });
    }
}

//
export default UIButtonBase;
