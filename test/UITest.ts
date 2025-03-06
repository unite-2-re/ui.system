// DEBUG/DEV mode...
import init, {
    UITooltip,
    UIStatusBar,
    UIButton,
    UILucideIcon,
    UISwitch,
    UIShaped,
    UIFrame,
    UINavBar,
    UITaskBar,
    UITaskItem,
    UIBlock,
    UISelectRow,
    UINumber,
    UIModal,
    UICalendar,
    UISlider
} from "../src/index";

// @ts-ignore
import { makeSelection } from /* @vite-ignore */ "/externals/core/interact.js";

//
init();

// @ts-ignore
import(/* @vite-ignore */ "/externals/core/agate.js").then((module)=>{
    // @ts-ignore
    module?.default?.();
}).catch(console.warn.bind(console));

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
console.log(UIButton);
console.log(UISelectRow);
console.log(UIModal);
console.log(UILucideIcon);
console.log(UISwitch);
console.log(UIShaped);
console.log(UIFrame);
console.log(UIStatusBar);
console.log(UITooltip);
console.log(UINavBar);
console.log(UITaskBar);
console.log(UITaskItem);
console.log(UIBlock);
console.log(UINumber);
console.log(UICalendar);
console.log(UISlider);

//
makeSelection(document.body, "ui-checkbox, ui-switch");

//
document.body.addEventListener("u2-selected", (ev: any)=>{
    console.log(ev.detail.selected);
});
