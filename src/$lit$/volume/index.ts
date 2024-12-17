/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "../shared/BoxLayout.scss?inline";

// @ts-ignore
import htmlCode from "../shared/BoxLayout.html?raw";

// @ts-ignore
import { getBoundingOrientRect } from "/externals/core/agate.js";

//
import LitElementTheme from "../shared/LitElementTheme";

// avoid memory leaking...
//const refMap = new WeakSet([]);

// @ts-ignore
@customElement('ui-volume')
export class UIVolume extends LitElementTheme {

    // theme style property
    @property() protected value: number = 0;

    //
    static styles = css`${unsafeCSS(styles)}`;

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;

        //
        const weak = new WeakRef(self);
        const sws = { pointerId: -1 };
        const doExaction = (self, x, y, confirm = false, boundingBox?)=>{
            if (!self) return;

            //
            const box    = boundingBox || getBoundingOrientRect(self);
            const coord  = [x - box?.left, y - box?.top];
            const number = self.querySelector?.("input[type=\"number\"]") as unknown as HTMLInputElement
            const count  = ((parseFloat(number?.max) || 0) - (parseFloat(number?.min) || 0));
            const vary   = [
                (coord[0]/box.width) * (count + 1),
                (coord[1]/box.height) * 1
            ];

            //
            const val = Math.min(Math.max(vary[0] - 0.5, 0), count);
            const step = parseFloat(number?.step ?? 1) ?? 1;
            const exact = Math.min(Math.max(Math.round(val / step) * step, 0), count);

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

            //
            if (number) {
                self.style.setProperty("--max-value", `${count}`, "");
                number.valueAsNumber = (parseFloat(number.min) || 0) + exact;
                number.dispatchEvent(new Event(confirm ? "change" : "input", {
                    bubbles: true,
                    cancelable: true
                }));
            }
        }

        //
        const stopMove = (ev)=>{
            const e = ev?.detail || ev;
            if (sws.pointerId == e.pointerId) {
                sws.pointerId = -1;
                doExaction(weak?.deref?.(), e.orient[0], e.orient[1], true, e?.boundingBox);
                e.target?.releasePointerCapture?.(e.pointerId);
                document.documentElement.style.removeProperty("cursor");
            }
        }

        //
        self.classList?.add?.("ui-volume");
        self.classList?.add?.("u2-input");
        self.addEventListener("input", this.onSelect.bind(this));
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
        const ROOT = document.documentElement;
        ROOT.addEventListener("ag-pointerup", stopMove);
        ROOT.addEventListener("ag-pointercancel", stopMove);
        ROOT.addEventListener("ag-pointermove", (ev)=>{
            const e = ev?.detail || ev;
            if (sws.pointerId == e.pointerId) {
                doExaction(weak?.deref?.(), e.orient[0], e.orient[1], false, e?.boundingBox);
            }
        });
    }

    //
    protected onSelect(ev?: any){
        const self = this as unknown as HTMLElement;
        const e = ev?.detail || ev;
        const element = e?.target ?? self?.querySelector?.("input");

        //
        if (element) {
            const input = ((element.matches("input[type=\"number\"]") ? element : element.querySelector?.("input[type=\"number\"]")) as HTMLInputElement);
            const value = input?.valueAsNumber || parseFloat(input?.value) || 0; this.value = value;
            const index = value - (parseFloat(input?.min) || 0);
            const indicator = self?.querySelector?.(".ui-indicator");

            //
            if (index >= 0 && e?.type != "input") { self.style?.setProperty?.("--value", `${index}`); };
            self.style.setProperty("--max-value", `${((parseFloat(input?.max)||0) - (parseFloat(input?.min)||0))}`, "");

            //
            if (indicator) {
                indicator.innerHTML = "" + value?.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 1
                });
            }
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
export default UIVolume;
