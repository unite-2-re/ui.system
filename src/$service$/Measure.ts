// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";
export {importCdn};

//
const { unfixedClientZoom } = await Promise.try(importCdn, ["/externals/core/agate.js"]);

//
const canvas = new OffscreenCanvas(1, 1);
const ctx = canvas.getContext("2d");

//
export const initTextStyle = (element, ctx)=>{
    const style = getComputedStyle(element, "");

    //
    if (ctx && style) {
        const fontWeight  = style.getPropertyValue('font-weight') || 'normal';
        const fontSize    = style.getPropertyValue('font-size')   || '16px';
        const fontFamily  = style.getPropertyValue('font-family') || 'Times New Roman';
        const fontStretch = (style.getPropertyValue('font-stretch') || 'normal') as CanvasFontStretch;

        //
        try { ctx.fontStretch     = fontStretch.includes("%") ? "normal" : fontStretch; } catch(e) {};
        try { ctx.letterSpacing   = (style.getPropertyValue('letter-spacing') || 'normal'); } catch(e) {};
        try { ctx.fontKerning     = (style.getPropertyValue('font-kerning') || 'auto') as CanvasFontKerning; } catch(e) {};
        try { ctx.fontVariantCaps = (style.getPropertyValue('font-variant-caps') || 'normal') as CanvasFontVariantCaps; } catch(e) {};
        try { ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`; } catch(e) {};
    }
}

//
export const measureText = (text, element)=>{
    if (ctx) {
        initTextStyle(element, ctx);
        try { return ctx.measureText(text); } catch(e) {};
    }
    return { width: null };
}

//
export const measureInputInFocus = (input: HTMLInputElement)=>{
    const text = input.value.slice(0, input.selectionEnd || 0);
    return measureText(text, input);
}

// important: point WITHOUT padding!
export const computeCaretPosition = (input: HTMLInputElement, point: [number, number])=>{
    const text  = input?.value || "";
    if (ctx) {
        initTextStyle(input, ctx);
        let currentWidth = 0;
        for (let i=0;i<text.length;i++) {
            currentWidth = ctx.measureText(text.slice(0, i))?.width;
            if (currentWidth == null) { return text.length; };
            if (currentWidth != null && currentWidth >= point[0]) { return Math.max(i-1, 0); };
        }
    }
    return text.length;
}

//
export const computeCaretPositionFromClient = (input: HTMLInputElement, client: [number, number])=>{
    const box = input.getBoundingClientRect();
    const point: [number, number] = [client[0] - box.left / unfixedClientZoom(), client[1] - box.top / unfixedClientZoom()];
    return computeCaretPosition(input, point);
}
