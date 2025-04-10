// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";

//
export const generateId = (len = 16) => {
    var arr = new Uint8Array((len || 16) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (dec)=>dec.toString(16).padStart(2, "0")).join('')
}

//
export const placeWithElement = async (self?: HTMLElement, element?: HTMLElement, where?: string, gap: number = 0)=>{
    if (
        element && element.dataset?.hidden == null &&
        self && self?.dataset?.hidden == null
    ) {
        // @ts-ignore
        const {getBoundingOrientRect} = await Promise.try(importCdn, ["/externals/core/agate.js"]);

        //
        const box      = getBoundingOrientRect(element);
        const self_box = getBoundingOrientRect(self);
        const anchor   = element?.style?.getPropertyValue?.("anchor-name");

        //
        let ID = "--" + generateId();
        if (!anchor || anchor == "none") {
            element?.style?.setProperty?.("anchor-name", ID, "");
        } else {
            ID = anchor;
        }

        //
        self.style.setProperty("--anchor-group", ID, "");
        self.style.setProperty("--inline-size", (box.width || self_box.width || 0) + "px", "");

        //
        const updated_box = getBoundingOrientRect(self), style = getComputedStyle(self);
        const min_height  = Math.max(parseFloat(style?.minBlockSize  || "0") || 0, parseFloat(style?.blockSize  || "0") || 0);
        const min_width   = Math.max(parseFloat(style?.minInlineSize || "0") || 0, parseFloat(style?.inlineSize || "0") || 0);

        //
        self.style.setProperty("--client-x", `${(box.left || 0) + (box.width - Math.max(updated_box.width, min_width)) * 0.5}`);

        // for taskbar/navbar
        if (where == "from-top") {
            self.style.setProperty("--client-y", `${(box.top - Math.max(updated_box.height, min_height) - gap)}`);
        } else {
            self.style.setProperty("--client-y", `${((box.bottom + gap) || 0)}`);
        }
    }
}
