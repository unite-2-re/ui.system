/// <reference types="lit" />

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
        const weak = new WeakRef(self);

        //
        self.classList?.add?.("ui-volume");
        self.classList?.add?.("u2-input");

        //
        const sws = { pointerId: -1 };
        const doExaction = (self, clientX, clientY, confirm = false)=>{
            if (!self) return;

            //
            const box    = self?.getBoundingClientRect?.();
            const coord  = [clientX - box?.left, clientY - box?.top];
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

                // anyways triggers...
                //this.onSelect?.({target: number});

                //
                number.dispatchEvent(new Event(confirm ? "change" : "input", {
                    bubbles: true,
                    cancelable: true
                }));
            }
        }

        //
        self.addEventListener("input", this.onSelect.bind(this));
        self.addEventListener("change", this.onSelect.bind(this));

        //
        self.addEventListener("pointerdown", (e)=>{
            if (sws.pointerId < 0) {
                sws.pointerId = e.pointerId;

                //
                (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
                document.documentElement.style.cursor = "grabbing";
            }
        });

        //
        document.addEventListener("pointermove", (e)=>{
            if (sws.pointerId == e.pointerId) {
                doExaction(weak?.deref?.(), e.clientX, e.clientY);
            }
        });

        //
        const stopMove = (e)=>{
            if (sws.pointerId == e.pointerId) {
                sws.pointerId = -1;
                doExaction(weak?.deref?.(), e.clientX, e.clientY, true);
                e.target?.releasePointerCapture?.(e.pointerId);
                document.documentElement.style.removeProperty("cursor");
            }
        }

        //
        document.addEventListener("pointerup", stopMove);
        document.addEventListener("pointercancel", stopMove);
    }

    //
    protected onSelect(ev?: any){
        const self = this as unknown as HTMLElement;
        const element = ev?.target ?? self;
        if (element) {
            const input = ((element.matches("input[type=\"number\"]") ? element : element.querySelector?.("input[type=\"number\"]")) as HTMLInputElement);
            const value = input?.valueAsNumber || parseFloat(input?.value) || 0;

            //
            this.value = value;

            //
            const index = value - (parseFloat(input?.min) || 0);
            if (index >= 0 && ev?.type != "input") { self.style?.setProperty?.("--value", `${index}`); };

            //
            self.style.setProperty("--max-value", `${((parseFloat(input?.max)||0) - (parseFloat(input?.min)||0))}`, "");

            //
            const indicator = self?.querySelector?.(".ui-indicator");
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
