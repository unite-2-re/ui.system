/// <reference types="lit" />
// Type: standalone
// Behaviour: select, button

//@ts-ignore
import { css, unsafeCSS } from "@mods/shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

//
import { E } from "/externals/lib/blue";
import { conditional, checkedRef } from "/externals/lib/object";

//
import { openDropMenu } from "@service/functional/fn-dropmenu";
import { setAttributesIfNull } from "@service/Utils";

//
import UIButtonBase from "@mods/inputs/in-button";
import UISelectBase from "@mods/inputs/in-select";

// @ts-ignore
import styles from "@scss/design/ap-button.scss?inline";

//
const makeButton = (root: HTMLElement, weak?: WeakRef<any>)=>{
    /*return E(root, {}, [
        E("button.ui-button", {
            style: "background-color: transparent;",
            type: "button",
            part: "ui-button",
            dataset: {alpha: 0}
        }, [E("slot")])
    ]);*/

    // TODO: make available with ".nodes" keys as element
    if (weak?.deref?.()) weak.deref().nodes = [
        E("button.ui-button", {
            style: "background-color: transparent;",
            type: "button",
            part: "ui-button",
            dataset: {alpha: 0}
        }, [E("slot")])
    ].map((e)=>e?.element);
}


// @ts-ignore
@customElement('ui-toggle')
export class UIToggle extends UISelectBase {
    @property({attribute: true, reflect: true, type: String}) value;// = "";
    @property({attribute: true, reflect: true, type: String}) icon;// = "";
    @property({}) dropMenu?: any = null;

    //
    static styles = css`${unsafeCSS(styles)}`;
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            E(self, {
                classList: new Set(["ui-toggle", "u2-toggle", "u2-input"]),
                dataset: { scheme: conditional(checkedRef(self), "inverse", "solid") }
            });
        });
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        const self = this as unknown as HTMLElement;

        //
        setAttributesIfNull(self, {
            "data-scheme": "solid",
            "data-highlight": 0,
            "data-highlight-hover": 1
        });
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        makeButton(root, new WeakRef(this));
        //this.importFromTemplate(htmlCode);
        return root;
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
    static styles = css`${unsafeCSS(styles)}`;
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            self.querySelectorAll("ui-select-row, ui-button-row")?.forEach?.((el: any)=>{ el.style.display = "none"; });
            
            //
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
        });
    }

    //
    //protected updateStyles() {
        //const self = this as unknown as HTMLElement;
        //self.dataset.scheme = "inverse";//(this as any).checked ? "solid" : "inverse"
    //};

    //
    public connectedCallback() {
        super.connectedCallback();
        const self = this as unknown as HTMLElement;

        //
        setAttributesIfNull(self, {
            "data-scheme": "solid",
            "data-highlight": 0,
            "data-highlight-hover": 1
        });
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        makeButton(root, new WeakRef(this));
        //root.addEventListener("click", ()=>{ self?.click?.(); });
        //this.importFromTemplate(htmlCode);
        return root;
    }
}

//
export default UIButton;
