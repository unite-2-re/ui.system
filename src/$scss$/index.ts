// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";
export {importCdn};

// @ts-ignore
import styles from "./$scss$/Bundle.scss?inline&compress";
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
export const styleCode = {preInit, styles};

//
const initialize = async (rootElement = document.head)=>{
    // @ts-ignore
    const { hash, loadInlineStyle } = await Promise.try(importCdn, ["/externals/lib/dom.js"]);
    const integrity = hash(styles);
    loadInlineStyle(preInit, rootElement);
}

//
export default initialize;
