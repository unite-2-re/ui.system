/// <reference types="lit" />

// @ts-ignore
import { getBoundingOrientRect } from "/externals/lib/agate.js";

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "../shared/BoxLayout.scss?inline";

// @ts-ignore
import htmlCode from "../shared/BoxLayout.html?raw";

//
import LitElementTheme from "../shared/LitElementTheme";

// @ts-ignore
@customElement('ui-switch')
export class UISwitch extends LitElementTheme {

    // theme style property
    @property() protected value: string = "";

    //
    static styles = css`${unsafeCSS(styles)}`;
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        const weak = new WeakRef(self);
        const sws = { pointerId: -1 };
        const doExaction = (self, x, y, confirm = false)=>{
            if (!self) return;

            //
            const box   = getBoundingOrientRect?.(self);
            const coord = [x - box?.left, y - box?.top];
            const radio = self.querySelectorAll?.("input[type=\"radio\"]") as unknown as HTMLInputElement[];
            const count = (radio?.length || 0); //+ 1;
            const vary = [
                (coord[0]/box.width) * count,
                (coord[1]/box.height) * 1
            ];

            //
            const val = Math.min(Math.max(vary[0] - 0.5, 0), count-1);
            const exact = Math.min(Math.max(Math.floor(vary[0]), 0), count-1);
            if (!radio?.[exact]?.checked && confirm) {
                radio?.[exact]?.click?.();
            };

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
        self.classList?.add?.("ui-switch");
        self.classList?.add?.("u2-input");
        self.addEventListener("change", this.onSelect.bind(this));
        self.addEventListener("ag-pointerdown", (ev)=>{
            const e = ev?.detail || ev;
            if (sws.pointerId < 0) {
                sws.pointerId = e.pointerId;

                //
                (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
                document.documentElement.style.cursor = "grabbing";
            }
        });

        //
        const stopMove = (ev)=>{
            const e = ev?.detail || ev;
            if (sws.pointerId == e.pointerId) {
                sws.pointerId = -1;
                doExaction(weak?.deref?.(), e.orient[0], e.orient[1], true);
                e.target?.releasePointerCapture?.(e.pointerId);
                document.documentElement.style.removeProperty("cursor");
            }
        }

        //
        const ROOT = document.documentElement;
        ROOT.addEventListener("ag-pointerup", stopMove);
        ROOT.addEventListener("ag-pointercancel", stopMove);
        ROOT.addEventListener("ag-pointermove", (ev)=>{
            const e = ev?.detail || ev;
            if (sws.pointerId == e.pointerId) {
                doExaction(weak?.deref?.(), e.orient[0], e.orient[1]);
            }
        });
    }

    //
    protected onSelect(ev?: any){
        const self = this as unknown as HTMLElement;
        const input = (ev?.target ?? self?.querySelector?.("input:checked"));
        if (input?.checked) {
            this.value = input?.value;
            const index = Array.from(self.querySelectorAll?.("input[type=\"radio\"]"))?.indexOf?.(input);
            if (index >= 0) { self.style?.setProperty?.("--value", `${index}`); };
        }
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
