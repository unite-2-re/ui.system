// DEBUG/DEV mode...
import init, { UICheckBox, UIListRow, UILucideIcon, UISwitch, UIDropMenu } from "../src/index";

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
