/// <reference types="lit" />
// Type: standalone
// Behaviour: select, button

// @ts-ignore /* @vite-ignore */
import { E, H, property } from "/externals/lib/blue.js";

// @ts-ignore /* @vite-ignore */
import { conditional, checkedRef } from "/externals/lib/object.js";

//
import { openDropMenu } from "@service/functional/fn-dropmenu";

//
import UIButtonBase from "@mods/inputs/in-button";
import UISelectBase from "@mods/inputs/in-select";

// @ts-ignore
import styles from "@scss/design/ap-button.scss?inline";

// @ts-ignore
@defineElement('ui-toggle')
export class UIToggle extends UISelectBase {
    @property({source: "value", from: "input"}) value;
    @property({source: "checked", from: "input"}) checked;
    @property({source: "attr"}) icon;
    @property({}) dropMenu?: any = null;

    //
    public styles = ()=> styles;
    public render = ()=> H`<${"button.ui-button"} dataset=${{
        style: "background-color: transparent;",
        type: "button",
        part: "ui-button",
        dataset: {alpha: 0}
    }}><slot/></button>`;

    //
    public initialAttributes = {
        "data-alpha": 0,
        "data-scheme": "solid",
        "data-highlight": 0,
        "data-highlight-hover": 1
    }

    //
    public onInitialize() {
        super.onInitialize?.();
        const self = this as unknown as HTMLElement;
        E(self, {
            classList: new Set(["ui-toggle", "u2-toggle", "u2-input"]),
            dataset: { scheme: conditional(checkedRef(self), "inverse", "solid") }
        });
    }
}

// button derivative
// @ts-ignore
@customElement('ui-button')
export class UIButton extends UIButtonBase {
    @property({attribute: true, reflect: true, type: String}) value;// = "";
    @property({attribute: true, reflect: true, type: String}) icon;// = "";
    @property({}) dropMenu?: any = null;

    //
    protected initialAttributes = {
        "data-scheme": "solid",
        "data-highlight": 0,
        "data-highlight-hover": 1
    };

    //
    public styles = ()=> styles;
    public render = ()=> {
        return H`<${"button.ui-button"} dataset=${{
            style: "background-color: transparent;",
            type: "button",
            part: "ui-button",
            dataset: {alpha: 0}
        }}><slot/></button>`;
    }

    //
    onInitialize() {
        super.onInitialize?.(); const self = this as unknown as HTMLElement;
        self.querySelectorAll("ui-select-row, ui-button-row")?.forEach?.((el: any)=>{ el.style.display = "none"; });
        E(self, {
            classList: new Set(["ui-button", "u2-button"]),
            on: {
                "click": new Set([(ev)=>{
                    if (self.querySelector("ui-select-row, ui-button-row")) {
                        openDropMenu(self, ev);
                    }
                }]),
                "change": new Set([(ev)=>{
                    //console.log(el?.dataset?.value || el?.value || "");
                    if ((ev?.target as any)?.matches?.("input[type=\"text\"]")) {
                        self?.querySelectorAll?.("ui-select-row, ui-button-row")?.forEach?.((el: any)=>{
                            if ((el?.dataset?.value || el?.value) == (ev?.target as any)?.value) {
                                el.style.removeProperty("display");
                            } else {
                                el.style.display = "none";
                            }
                        });
                    }
                }])
            }
        })
    }
}

//
export default UIButton;
