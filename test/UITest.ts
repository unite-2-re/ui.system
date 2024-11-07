// DEBUG/DEV mode...
import init, { makeSelection, UICheckBox, UIListRow, UILucideIcon, UISwitch, UIDropMenu } from "../src/index";

//
init();

// @ts-ignore
import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
    // @ts-ignore
    module?.default?.();
}).catch(console.warn.bind(console));

// production mode...
//import { UICheckBox } from "../dist/ui.js";

//
console.log(UICheckBox);
console.log(UIListRow);
console.log(UILucideIcon);
console.log(UISwitch);
console.log(UIDropMenu);

//
makeSelection(document.body, "ui-checkbox, ui-switch");

//
document.body.addEventListener("ui-selected", (ev: any)=>{
    console.log(ev.detail.selected);
});
