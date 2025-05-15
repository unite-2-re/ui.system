// this will be whole UI bundle...
// later, design core will be excluded from main distribution
// may be, some UI components will be dedicated from that project

//
export * from "@service/functional/fn-contextmenu";
export * from "@service/functional/fn-dropmenu";
export * from "@service/functional/fn-modal";
export * from "@service/layout/ps-draggable";
export * from "@service/layout/ps-anchor";
export * from "@service/layout/ps-cursor";
export * from "@service/tasks/manager";
export * from "@service/tasks/opening";
export * from "@service/tasks/binding";

//
export * from "@mods/index";
export * from "@scss/index";
import init from "@scss/index";
export default init;



/*-
// @ts-ignore
import styles from "./$scss$/_GridDesign.scss?inline&compress";
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));

import {importCdn} from "/externals/modules/cdnImport.mjs";
export {importCdn};

//
const initialize = async (rootElement = document.head)=>{
    // @ts-ignore
    const {hash, loadInlineStyle} = await Promise.try(importCdn, ["/externals/lib/dom.js"]);
    const integrity = hash(styles);
    loadInlineStyle(preInit, rootElement);
}

//
export default initialize;
export * from "./$core$/Shape";
*/
