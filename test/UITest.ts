// DEBUG/DEV mode...
import init, {
    UITooltip,
    UIStatusBar,
    UICheckBox,
    UIListRow,
    UILucideIcon,
    UISwitch,
    UIDropMenu,
    UIShaped,
    UIFrame,
    UINavBar,
    UITaskBar,
    UITaskItem,
    UIBlock,
    UIMenuItem
} from "../src/index";

// @ts-ignore
import {makeSelection} from /* @vite-ignore */ "/externals/lib/interact.js";

//
init();

// @ts-ignore
import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
    // @ts-ignore
    module?.default?.();
}).catch(console.warn.bind(console));

// @ts-ignore
import(/* @vite-ignore */ "/externals/core/design.js").then((module)=>{
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
console.log(UIShaped);
console.log(UIFrame);
console.log(UIStatusBar);
console.log(UITooltip);
console.log(UINavBar);
console.log(UITaskBar);
console.log(UITaskItem);
console.log(UIBlock);
console.log(UIMenuItem);

//
makeSelection(document.body, "ui-checkbox, ui-switch");

//
document.body.addEventListener("u2-selected", (ev: any)=>{
    console.log(ev.detail.selected);
});
