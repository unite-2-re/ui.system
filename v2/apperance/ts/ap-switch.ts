/// <reference types="lit" />
// Type: contained

// @ts-ignore
import { getBoundingOrientRect } from "/externals/core/agate.js";

//
export const onSwitch = (ev?: any, self?: HTMLElement, input?: HTMLInputElement)=>{
    //const self = this as unknown as HTMLElement;
    //const input = (ev?.target ?? self?.querySelector?.("input:checked"));
    if (!self) return;

    //
    if (input?.type == "radio" && input?.checked) {
        //self.value = input?.value;
        const index = Array.from(self.querySelectorAll?.("input[type=\"radio\"]"))?.indexOf?.(input);
        if (index >= 0) { self.style?.setProperty?.("--value", `${index}`); };
    }

    //
    if (input?.type == "checkbox" && (ev?.target ?? self)?.checked != null) {
        const checked = (ev?.target ?? self)?.checked;
        self.style.setProperty("--value", `${checked ? 1 : 0}`);
    }

    //
    if (input?.type == "number") {
        const value = input?.valueAsNumber || parseFloat(input?.value) || 0;
        const index = value - (parseFloat(input?.min) || 0);

        //
        if (index >= 0 && ev?.type != "input") { self.style?.setProperty?.("--value", `${index}`); };
        self.style.setProperty("--max-value", `${((parseFloat(input?.max)||0) - (parseFloat(input?.min)||0))}`, "");
    };

    //
    const indicator = self?.querySelector?.(".ui-indicator");
    if (input?.type == "number" && indicator) {
        const value = input?.valueAsNumber || parseFloat(input?.value) || 0;
        indicator.innerHTML = "" + value?.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1
        });
    }

    //
    if (input?.type == "checkbox") {
        const icon = self.querySelector("ui-icon");
        if (icon) { icon.setAttribute("icon", ev?.target?.checked ? "badge-check" : "badge"); }

        //
        const thumb = self.shadowRoot?.querySelector?.(".ui-thumb");
        thumb?.setAttribute?.("data-highlight", ev?.target?.checked ? "3" : "8");
        thumb?.setAttribute?.("data-highlight-hover", ev?.target?.checked ? "0" : "5");
    }
}

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
export const makeSwitch = (self?: HTMLElement, TYPE?: string)=>{
    if (!self) return;

    //
    const sws  = { pointerId: -1 };
    const weak = new WeakRef(self);
    const doExaction = (self, x, y, confirm = false, boundingBox?)=>{
        if (!self) return;

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
