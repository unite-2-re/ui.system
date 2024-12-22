/// <reference types="lit" />
// Type: contained
// Behaviour: switch (combined)

// @ts-ignore
import { getBoundingOrientRect } from "/externals/core/agate.js";

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "../shared/BoxLayout.scss?inline";

// @ts-ignore
import htmlCode from "../html/ap-switch.html?raw";

//
import LitElementTheme from "../../shared/LitElementTheme";
import { doIndication } from "./ap-indication";

//
export const setStyle = (self, confirm: boolean = false, exact: number = 0, val: number = 0)=>{
    //
    if (confirm) {
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches && self.animate != null) {
            let animation: any = null;
            (animation = self.animate?.([
                { "--value": self.style?.getPropertyValue?.("--value") ?? val },
                { "--value": exact },
            ], {
                duration: 100,
                iterations: 1, // @ts-ignore
                fillMode: "both"
            }))?.finished?.then(()=>{
                animation?.commitStyles?.();
                animation?.cancel?.();

                //
                self.style.setProperty("--value", `${exact}`, "");
            });
        } else {
            self.style.setProperty("--value", `${exact}`, "");
        }
    } else {
        self.style.setProperty("--value", `${val}`, "");
    }
}

//
export const makeSwitch = (self?: HTMLElement)=>{
    if (!self) return;

    //
    const sws  = { pointerId: -1 };
    const weak = new WeakRef(self);
    const doExaction = (self, x, y, confirm = false, boundingBox?)=>{
        if (!self) return;

        //
        let TYPE = "unknown";
        if (self?.matches?.(":has(input[type=\"radio\"])")) { TYPE = "radio"; };
        if (self?.matches?.(":has(input[type=\"number\"])")) { TYPE = "number"; };

        //
        const box   = boundingBox || getBoundingOrientRect?.(self);
        const coord = [x - box?.left, y - box?.top];

        //
        if (TYPE == "radio") {
            const radio = self.querySelectorAll?.("input[type=\"radio\"]") as unknown as HTMLInputElement[];
            const count = (radio?.length || 0); //+ 1;
            const vary = [
                (coord[0]/box.width) * count,
                (coord[1]/box.height) * 1
            ];
            const val = Math.min(Math.max(vary[0] - 0.5, 0), count-1);
            const exact = Math.min(Math.max(Math.floor(vary[0]), 0), count-1);
            if (!radio?.[exact]?.checked && confirm) {
                radio?.[exact]?.click?.();
            };

            //
            setStyle(self, confirm, exact, val);
        }

        //
        if (TYPE == "number") {
            const number = self.querySelector?.("input[type=\"number\"]") as unknown as HTMLInputElement
            const count  = ((parseFloat(number?.max) || 0) - (parseFloat(number?.min) || 0));
            const vary   = [
                (coord[0]/box.width) * (count + 1),
                (coord[1]/box.height) * 1
            ];
            const val = Math.min(Math.max(vary[0] - 0.5, 0), count);
            const step = parseFloat(number?.step ?? 1) ?? 1;
            const exact = Math.min(Math.max(Math.round(val / step) * step, 0), count);

            //
            self.style.setProperty("--max-value", `${count}`, "");
            number.valueAsNumber = (parseFloat(number.min) || 0) + exact;
            number.dispatchEvent(new Event(confirm ? "change" : "input", {
                bubbles: true,
                cancelable: true
            }));

            //
            setStyle(self, confirm, exact, val);
        }
    }

    //
    self?.addEventListener?.("ag-pointerdown", (ev: any)=>{
        const e = ev?.detail || ev;
        if (sws.pointerId < 0) {
            sws.pointerId = e.pointerId;

            //
            (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
            document.documentElement.style.cursor = "grabbing";
        }
    });

    //
    const stopMove = (ev: any)=>{
        const e = ev?.detail || ev;
        if (sws.pointerId == e.pointerId) {
            sws.pointerId = -1;
            doExaction(weak?.deref?.(), e.orient[0], e.orient[1], true, e?.boundingBox);
            e.target?.releasePointerCapture?.(e.pointerId);
            document.documentElement.style.removeProperty("cursor");
        }
    }

    //
    const ROOT = document.documentElement;
    ROOT.addEventListener("ag-pointerup", stopMove);
    ROOT.addEventListener("ag-pointercancel", stopMove);
    ROOT.addEventListener("ag-pointermove", (ev: any)=>{
        const e = ev?.detail || ev;
        if (sws.pointerId == e.pointerId) {
            doExaction(weak?.deref?.(), e.orient[0], e.orient[1], false, e?.boundingBox);
        }
    });
};

// @ts-ignore
@customElement('ui-switch')
export class UISwitch extends LitElementTheme {

    // theme style property
    @property({attribute: true, reflect: true, type: String}) public value: string|number = "";
    @property({attribute: true, reflect: true, type: Boolean}) public checked: boolean = false;

    //
    static styles = css`${unsafeCSS(styles)}`;
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-switch");
        self.classList?.add?.("u2-input");
        makeSwitch(self);
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
        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        requestIdleCallback(()=>this.onSelect(), {timeout: 1000});
    }
}

//
export default UISwitch;
