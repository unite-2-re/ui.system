// @ts-ignore
import { getBoundingOrientRect, whenAnyScreenChanges } from "/externals/core/agate.js";

//
export const generateId = (len = 16) => {
    var arr = new Uint8Array((len || 16) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (dec)=>dec.toString(16).padStart(2, "0")).join('')
}

//
export const placeWithElement = (self?: HTMLElement, element?: HTMLElement, where?: string, gap: number = 0)=>{
    if (element && self && self?.dataset?.hidden == null) {
        const box = getBoundingOrientRect(element);
        const self_box = getBoundingOrientRect(self);

        //
        self.style.setProperty("--inline-size", `${(box.width || self_box.width)}`);

        // for taskbar/navbar
        const updated_box = getBoundingOrientRect(self);
        if (where == "from-top") {
            self.style.setProperty("--client-x", `${(box.left || 0) - (updated_box.width - box.width) * 0.5}`);
            self.style.setProperty("--client-y", `${(box.top - updated_box.height - gap)}`);
        } else {
            self.style.setProperty("--client-x", `${(box.left || 0) - (updated_box.width - box.width) * 0.5}`);
            self.style.setProperty("--client-y", `${((box.bottom + gap) || 0)}`);
        }

        //
        const initialAnchor = element?.style?.getPropertyValue?.("anchor-name");
        const ID = generateId();
        if (!initialAnchor || initialAnchor == "none") {
            element?.style?.setProperty?.("anchor-name", "--" + ID, "");
        }

        //
        self.style.setProperty("--anchor-group", (element?.style?.getPropertyValue?.("anchor-name") || ("--" + ID)), "");
    }
}
