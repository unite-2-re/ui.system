// DEBUG/DEV mode...
import { UICheckBox } from "../src/index";

// @ts-ignore
import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
    // @ts-ignore
    module?.default?.();
}).catch(console.warn.bind(console));

// production mode...
//import { UICheckBox } from "../dist/ui.js";

console.log(UICheckBox);
