import initLong from "./longtext/LongText";
import initFocus from "./focustext/FocusText";

//
export * from "./focustext/FocusText";
export * from "./longtext/LongText";

//
export const initializeLT = (ROOT = document.documentElement)=>{
    initLong(ROOT);
    initFocus(ROOT);
}

//
export default initializeLT;

/*
import ScrollBox, {importCdn } from "./$core$/ScrollBox";

//
export * from "./$core$/ScrollBox";
export default ScrollBox;

// @ts-ignore
Promise.try(importCdn, ["/externals/core/theme.js"])?.then?.((module)=>{
    // @ts-ignore
    module?.default?.();
}).catch(console.warn.bind(console));
*/